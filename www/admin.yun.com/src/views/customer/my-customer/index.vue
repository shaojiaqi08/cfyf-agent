<template>
  <div class="order-container page-container">
    <div class="header">
      <el-tabs class="tabs" v-model="tabIndex" @tab-click="handleTabChange">
        <el-tab-pane name="my" label="我的客户"></el-tab-pane>
        <el-tab-pane name="family" label="客户家庭" v-if="$checkAuth('/company_performance/company/personal_rank') || $checkAuth('/company_performance/team_rank')"></el-tab-pane>
      </el-tabs>
      <div class="flex-center">
        <el-button
          type="primary"
          icon="iconfont iconxiao16_xiazai mr4"
          class="mr16"
          size="small">导出数据</el-button>
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
      <div style="height: 40px;">
        <!--关联家庭-->
        <filter-shell v-model="searchModel.policy_status"
                      autoFocus
                      v-if="tabIndex === 'my'"
                      @input="search()">
          <el-select class="block"
                    v-model="searchModel.family_id"
                    multiple
                    clearable
                    filterable
                    placeholder="请选择"
                    @change="search()">
            <el-option
                    v-for="item in relativeFamilyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{ searchModel.family_id.length ? relativeFamilyList.find(i => i.value === searchModel.family_id[0]).label : '全部关联家庭' }}
          </template>
        </filter-shell>
        <el-button v-else icon="iconfont iconxiao16_jiahao mr4" type="primary fr" size="small">添加家庭</el-button>
      </div>
      <el-table :data="list"
                height="calc(100vh - 173px)"
                style="width: 100%"
                v-table-infinite-scroll="scroll2Bottom"
                border
                stripe
                :key="tabIndex"
                v-loading="tableLoading">
        <template v-if="tabIndex === 'my'">
          <el-table-column label="姓名" prop="real_name" align="center" fixed="left"></el-table-column>
          <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
          <el-table-column label="身份证号" prop="certificate_number" align="center"></el-table-column>
          <el-table-column label="出生日期" prop="birthday" align="center">
            <template v-slot="{ row }">{{ formatDate(row.birthday * 1000, 'yyyy-MM-dd') }}</template>
          </el-table-column>
          <el-table-column label="保单数量" prop="policy_quantity" align="center"></el-table-column>
          <el-table-column label="关联家庭" prop="family_name" align="center"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="120px">
            <template v-slot="{ row }">
              <el-link type="primary" @click="viewDetail(row)">查看详情</el-link>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column label="家庭名称" align="center"></el-table-column>
          <el-table-column label="投保人" align="center"></el-table-column>
          <el-table-column label="保单数量" align="center"></el-table-column>
          <el-table-column label="备注" align="center"></el-table-column>
          <el-table-column label="备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template v-slot="{ row }">
              <el-link type="primary" @click="viewFamilyDetail(row)" class="mr8">查看详情</el-link>
              <el-link type="primary" @click="dismiss(row)">解散</el-link>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <operate-family-dialog :visible.sync="familyDialogVisible" @confirm="addFamilySuccess"></operate-family-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatTime'
import { getMyCustomerList, getMyCustomerFamilyList } from '@/apis/modules/customer'
import { debounce } from '@/utils'
// import qs from 'qs'
import FilterShell from '@/components/filters/filter-shell'
import OperateFamilyDialog from '../modal/operate-family-dialog'
// 客户 - 我的客户
export default {
  name: 'my-customer',
  components: {
    FilterShell,
    OperateFamilyDialog
  },
  computed: {
    placeholder () {
      return this.tabIndex === 'all' ? '搜索昵称、姓名、ID、身份证号或手机号' : '搜索家庭名称或投保人名称'
    }
  },
  data() {
    return {
      tabIndex: 'my',
      formatDate,
      familyDialogVisible: false,
      filterValue: false,
      list: [],
      teamList: [],
      relativeFamilyList: [],
      page: 1,
      page_size: 20,
      total: 0,
      keyword: '',
      tableLoading: false,
      exporting: false,
      searchModel: {
        keyword: '',
        family_id: []
      }
    };
  },
  methods: {
    viewDetail(row) {
      const url = this.$router.resolve({
        name: 'my-customer-detail',
        params: {
          id: row.relation_id
        }
      }).href
      window.open(url)
    },
    viewFamilyDetail() {

    },
    dismiss() {},
    handleTabChange() {
      this.searchModel.keyword = ''
      this.list = []
      this.search()
    },
    search(page = 1) {
      this.page = page;
      this.total = 0;
      this.tabIndex === 'my' ? this.getMyCustomerList() : this.getMyCustomerFamilyList()
    },
    addFamilySuccess() {

    },
    scroll2Bottom() {
      const {page, page_size, total} = this
      if (page * page_size < total) {
        this.search(this.page + 1)
      }
    },
    getMyCustomerList: debounce(function() {
      this.tableLoading = true
      const { searchModel, page, page_size } = this
      getMyCustomerList({
        keyword: searchModel.keyword,
        page,
        page_size
      }).then(res => {
        this.total = res.total
        this.list = page === 1 ? res.data : this.list.concat(res.data)
      }).finally(() => {
        this.tableLoading = false
      })
    }, 300),
    getMyCustomerFamilyList: debounce(function() {
      this.tableLoading = true
      const { searchModel, page, page_size } = this
      getMyCustomerFamilyList({
        keyword: searchModel.keyword,
        page,
        page_size
      }).then(res => {
        this.total = res.total
        this.list = res.data
      }).finally(() => {
        this.tableLoading = false
      })
    }, 300)
  },
  created() {
    this.getMyCustomerList()
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
      background-color: #e6e6e6;
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
