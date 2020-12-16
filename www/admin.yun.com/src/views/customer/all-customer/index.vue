<template>
  <div class="order-container page-container">
    <div class="header">
      <el-tabs class="tabs" v-model="tabIndex" @tab-click="handleTabChange">
        <el-tab-pane name="customer" label="全部客户"></el-tab-pane>
        <el-tab-pane name="family" label="客户家庭" v-if="$checkAuth('/customer/admin/family_page_list')"></el-tab-pane>
      </el-tabs>
      <div class="flex-center">
        <el-button
          type="primary"
          icon="iconfont iconxiao16_xiazai mr4"
          class="mr16"
          size="small"
          v-if="$checkAuth(tabIndex === 'customer' ? '/customer/admin/export_customers' : '/customer/admin/family_page_list')"
          @click="exportList"
          :loading="exporting"
          :disabled="exporting">导出数据</el-button>
        <el-input v-model="searchModel.keyword"
                  :placeholder="placeholder"
                  size="small"
                  class="fw400"
                  clearable
                  style="width:360px"
                  @input="search()">
          <i slot="prefix" class="ml4 iconfont iconxiao16_sousuo el-input__icon"></i>
        </el-input>
      </div>
    </div>
    <div class="scroll-box p16" ref="content">
      <div>
        <!--全部出单人-->
        <filter-shell v-model="searchModel.sales_id"
                      autoFocus
                      class="mb16"
                      placeholder="全部出单人"
                      @input="search()">
          <el-select class="block"
                     v-model="searchModel.sales_id"
                     clearable
                     filterable
                     multiple
                     placeholder="请选择"
                     @change="search()">
            <el-option
                    v-for="item in salesList"
                    :key="item.id"
                    :label="item.real_name"
                    :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{searchModel.sales_id.length ? salesList.find(i => i.id === searchModel.sales_id[0]).real_name : '全部出单人'}}
          </template>
        </filter-shell>
        <!--全部团队-->
        <filter-shell v-model="searchModel.sales_team_id"
                      autoFocus
                      class="mb16"
                      placeholder="全部出单人"
                      :width="330"
                      @input="search()">
          <el-select class="block"
                    v-model="searchModel.sales_team_id"
                    clearable
                    filterable
                    multiple
                    placeholder="请选择"
                    @change="search()">
              <el-option
                  v-for="item in salesTeamList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
          </el-select>
          <template v-slot:label>
            {{searchModel.sales_team_id.length ? salesTeamList.find(i => i.id === searchModel.sales_team_id[0]).name : '全部团队'}}
          </template>
        </filter-shell>
        <!--全部关联家庭-->
        <filter-shell v-model="searchModel.policy_status"
                      autoFocus
                      class="mb16"
                      v-if="tabIndex === 'customer'"
                      @input="search()">
          <el-select class="block"
                    v-model="searchModel.policy_status"
                    multiple
                    clearable
                    filterable
                    placeholder="请选择"
                    @change="search()">
            <el-option
                    v-for="item in relativeFamilyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{ searchModel.family_id.length ? relativeFamilyList.find(i => i.id === searchModel.family_id[0]).name : '全部关联家庭' }}
          </template>
        </filter-shell>
      </div>
      <el-table :data="list"
                height="calc(100vh - 173px)"
                v-table-infinite-scroll="scroll2Bottom"
                border
                stripe
                :key="tabIndex"
                v-loading="tableLoading">
        <template v-if="tabIndex === 'customer'">
          <el-table-column prop="real_name" label="姓名" align="center" fixed="left"></el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
          <el-table-column prop="certificate_number" label="身份证号" align="center"></el-table-column>
          <el-table-column prop="birthday" label="出生日期" align="center">
            <template v-slot="{ row }">{{row.birthday ? formatDate(row.birthday * 1000, 'yyyy-MM-dd') : ''}}</template>
          </el-table-column>
          <el-table-column prop="policy_quantity" label="保单数量" align="center"></el-table-column>
          <el-table-column prop="family_name" label="关联家庭" align="center"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="120px">
            <template v-slot="{ row }">
              <el-link type="primary" @click="viewDetail(row)">查看详情</el-link>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column prop="name" label="家庭名称" align="center"></el-table-column>
          <el-table-column prop="members_name" label="投保人" align="center"></el-table-column>
          <el-table-column prop="policy_quantity" label="保单数量" align="center"></el-table-column>
          <el-table-column prop="sales_name" label="创建人" align="center"></el-table-column>
          <el-table-column prop="sales_team_name" label="团队" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120px" v-if="$checkAuth('/customer/admin/customer_detail')">
            <template v-slot="{ row }">
              <el-link type="primary" @click="viewFamilyDetail(row)" class="mr8">查看详情</el-link>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatTime'
import { getCustomerList, getCustomerFamilyList, exportCustomerListUrl, exportFamilyListUrl } from '@/apis/modules/customer'
import { getSalesData, getSalesTeamData} from '@/apis/modules/achievement'
import { debounce, downloadFrameA } from '@/utils'
import qs from 'qs'
import FilterShell from '@/components/filters/filter-shell'

// 客户 - 全部客户
export default {
  name: 'all-customer',
  components: {
    FilterShell
  },
  computed: {
    placeholder () {
      return this.tabIndex === 'customer' ? '搜索昵称、姓名、ID、身份证号或手机号' : '搜索家庭名称或投保人名称'
    }
  },
  data() {
    return {
      tabIndex: 'customer',
      list: [],
      teamList: [],
      relativeFamilyList: [],
      page: 1,
      page_size: 50,
      total: 0,
      tableLoading: false,
      exporting: false,
      searchModel: {
        keyword: '',
        sales_id: [],
        sales_team_id: [],
        family_id: []
      },
      salesList: [],
      salesTeamList: []
    };
  },
  methods: {
    formatDate,
    exportList() {
      const isAll = this.tabIndex === 'customer'
      const params = { ...this.searchModel }
      if (!isAll) {
        delete params.family_id
      }
      const url = `${isAll ? exportCustomerListUrl : exportFamilyListUrl }?${qs.stringify(params)}`
      this.exporting = true
      downloadFrameA(url, `${isAll ? '客户' : '客户家庭'}列表-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`, 'get', true).finally(() => {
        this.exporting = false
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    viewDetail(row) {
      const url = this.$router.resolve({
        name: 'customer-detail',
        params: {
          id: row.relation_id
        }
      }).href
      window.open(url)
    },
    viewFamilyDetail(row) {
      const url = this.$router.resolve({
        name: 'customer-family-detail',
        params: {
          id: row.id
        }
      }).href
      window.open(url)
    },
    getCustomerList: debounce(function() {
      this.tableLoading = true
      const { page, page_size, searchModel } = this
      getCustomerList({
        page,
        page_size,
        ...searchModel,
        family_id: void 0
      }).then(res => {
        this.list = page === 1 ? res.data : [...this.list, ...res.data]
        this.total = res.total
      }).finally(() => {
        this.tableLoading = false
      })
    }, 300),
    getCustomerFamilyList: debounce(function() {
      this.tableLoading = true
      const { page, page_size, searchModel } = this
      getCustomerFamilyList({
        page,
        page_size,
        ...searchModel,

      }).then(res => {
        this.list = page === 1 ? res.data : [...this.list, ...res.data]
        this.total = res.total
      }).finally(() => {
        this.tableLoading = false
      })
    }, 300),
    handleTabChange() {
      this.searchModel =  {
        keyword: '',
        sales_id: [],
        sales_team_id: [],
        family_id: []
      }
      this.list = []
      this.search()
    },
    search(page = 1) {
      this.page = page;
      this.total = 0;
      this.tabIndex === 'customer' ? this.getCustomerList() : this.getCustomerFamilyList()
    },
    scroll2Bottom() {
      const {page, page_size, total} = this
      if (page * page_size < total) {
        this.search(this.page + 1)
      }
    },
    getSalesData() {
      getSalesData().then(res => {
        this.salesList = res
      }).catch(err => console.log(err))
    },
    getSalesTeamData() {
      getSalesTeamData().then(res => {
        this.salesTeamList = res
      }).catch(err => console.log(err))
    }
  },
  created() {
    // 筛选项 - 关联家庭数据
    getCustomerFamilyList({page: 1, page_size: 9999999}).then(res => {
      this.relativeFamilyList = res.data
    })
    this.getSalesData()
    this.getSalesTeamData()
    this.getCustomerList()
  }
};
</script>
<style lang="scss" scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .header {
      height: 56px;
      background-color: #f5f5f5;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tabs {
        height: 32px;
      }
    }
    .scroll-box {
      flex: 1;
      background-color: #fff;
      overflow: hidden;
    }
  }
</style>
