<template>
  <div class="order-container page-container">
    <div class="header">
      <el-tabs class="tabs" v-model="tabIndex">
        <el-tab-pane name="customer" label="我的客户" :disabled="loading" v-if="$checkAuth('/customer/sales_customer/page_list')"></el-tab-pane>
        <el-tab-pane name="family" label="客户家庭" v-if="$checkAuth('/customer/sales/family_page_list')" :disabled="loading"></el-tab-pane>
      </el-tabs>
      <div class="flex-center">
        <el-button
          type="primary"
          icon="iconfont iconxiao16_xiazai mr4"
          class="mr16"
          size="small"
          @click="exportList"
          v-if="$checkAuth(tabIndex === 'customer' ? '/customer/sales_customer/export' : '/customer/sales/export_family_list')"
          :loading="exporting"
          :disabled="exporting || list.length <= 0 || loading">导出数据</el-button>
        <el-input v-model="searchModel.keyword"
                  :placeholder="placeholder"
                  size="small"
                  class="fw400"
                  clearable
                  style="width:360px"
                  :readonly="loading"
                  @input="search()">
          <i slot="prefix" class="ml4 iconfont iconxiao16_sousuo el-input__icon"></i>
        </el-input>
      </div>
    </div>
    <div class="scroll-box p16" ref="content" v-loading="loading">
      <div style="height: 40px;">
        <!--关联家庭-->
        <filter-shell v-model="searchModel.family_id"
                      autoFocus
                      v-if="tabIndex === 'customer'"
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
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{ searchModel.family_id.length ? relativeFamilyList.find(i => i.id === searchModel.family_id[0]).name : '全部关联家庭' }}
          </template>
        </filter-shell>
        <el-button
          v-else-if="$checkAuth('/customer/sales/create_family')"
          icon="iconfont iconxiao16_jiahao mr4"
          type="primary fr"
          size="small"
          @click="createFamily">添加家庭</el-button>
      </div>
      <el-table :data="list"
                height="calc(100vh - 173px)"
                style="width: 100%"
                v-table-infinite-scroll="scroll2Bottom"
                border
                stripe
                :key="tabIndex">
        <template v-if="tabIndex === 'customer'">
          <el-table-column label="姓名" prop="real_name" align="center" fixed="left" :formatter="cellFormatter"></el-table-column>
          <el-table-column label="手机号" prop="mobile" align="center" :formatter="cellFormatter"></el-table-column>
          <el-table-column label="身份证号" prop="certificate_number" align="center" :formatter="cellFormatter"></el-table-column>
          <el-table-column label="出生日期" prop="birthday" align="center">
            <template v-slot="{ row }">{{row.birthday ? row.birthday.toString().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '-'}}</template>
          </el-table-column>
          <el-table-column label="保单数量" prop="policy_quantity" align="center" :formatter="cellFormatter"></el-table-column>
          <el-table-column label="关联家庭" prop="family_name" align="center" :formatter="cellFormatter"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="120px" v-if="$checkAuth('/customer/sales_customer/detail')">
            <template v-slot="{ row }">
              <el-link type="primary" @click="viewDetail(row)">查看详情</el-link>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column label="家庭名称" prop="name" align="center" :formatter="cellFormatter"></el-table-column>
          <el-table-column label="投保人" prop="members_name" align="center" :formatter="cellFormatter"></el-table-column>
          <el-table-column label="保单数量" prop="policy_quantity" align="center" :formatter="cellFormatter"></el-table-column>
          <el-table-column label="备注" prop="remark" align="center" :formatter="cellFormatter"></el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template v-slot="{ row }">
              <el-link type="primary" @click="viewFamilyDetail(row)" class="mr8" v-if="$checkAuth('/customer/sales/family_detail')">查看详情</el-link>
              <el-link type="primary" @click="dismiss(row)" v-if="$checkAuth('/customer/sales/disband_family')">解散</el-link>
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
import commonMixin from '../mixin'
import {
  getMyCustomerList,
  getMyCustomerFamilyList,
  dismissFamily,
  getMyCustomerRelativeFamily,
  exportMyCustomerListUrl,
  exportMyFamilyListUrl
} from '@/apis/modules/customer'
import { debounce, downloadFrameA } from '@/utils'
import qs from 'qs'
import FilterShell from '@/components/filters/filter-shell'
import OperateFamilyDialog from '../modal/operate-family-dialog'
// 客户 - 我的客户
export default {
  name: 'my-customer',
  components: {
    FilterShell,
    OperateFamilyDialog
  },
  mixins: [ commonMixin ],
  computed: {
    placeholder () {
      return this.tabIndex === 'customer' ? '搜索姓名、身份证号或手机号' : '搜索家庭名称或投保人名称'
    }
  },
  data() {
    return {
      tabIndex: '',
      familyDialogVisible: false,
      filterValue: false,
      list: [],
      teamList: [],
      relativeFamilyList: [],
      page: 1,
      page_size: 50,
      total: 0,
      keyword: '',
      loading: false,
      exporting: false,
      searchModel: {
        keyword: '',
        family_id: []
      }
    };
  },
  methods: {
    // 导出
    exportList() {
      const isCustomerTab = this.tabIndex === 'customer'
      const params = { ...this.searchModel }
      if (!isCustomerTab) {
        delete params.family_id
      }
      const url = `${isCustomerTab ? exportMyCustomerListUrl : exportMyFamilyListUrl }?${qs.stringify(params)}`
      this.exporting = true
      downloadFrameA(url, `${isCustomerTab ? '我的客户' : '我的客户家庭'}列表-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`, 'get', true).finally(() => {
        this.exporting = false
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    createFamily() {
      this.familyDialogVisible = true
    },
    // 打开我的客户详情标签
    viewDetail(row) {
      const url = this.$router.resolve({
        name: 'my-customer-detail',
        params: {
          id: row.relation_id
        }
      }).href
      window.open(url)
    },
    // 打开我的客户家庭详情标签啊
    viewFamilyDetail(row) {
      const url = this.$router.resolve({
        name: 'my-customer-family-detail',
        params: {
          id: row.id
        }
      }).href
      window.open(url)
    },
    // 解散
    dismiss(row) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('i', { class: {
              iconfont: true,
              'iconzhong20_gantanhao': true
            },
            style: {
              color: 'red',
              marginRight: '10px'
            }
          }),
          h('span', null, `正在解散【${row.name}】，是否确认？`)
        ]),
        confirmButtonClass: 'el-button--danger',
        confirmButtonText: '解散',
        showCancelButton: true
      }).then(() => {
        dismissFamily({family_id: row.id}).then(() => {
          this.getMyCustomerFamilyList()
          this.$message.success('解散家庭成功')
        })
      })
    },
    handleTabChange() {
      this.searchModel.keyword = ''
      this.list = []
      this.search()
    },
    search(page = 1) {
      this.page = page;
      this.total = 0;
      this.tabIndex === 'customer' ? this.getMyCustomerList() : this.getMyCustomerFamilyList()
    },
    addFamilySuccess() {
      this.handleTabChange()
    },
    // 主表滚动条到底部handler
    scroll2Bottom() {
      const {page, page_size, total} = this
      if (page * page_size < total) {
        this.search(this.page + 1)
      }
    },
    // 客户列表数据
    getMyCustomerList: debounce(function() {
      this.loading = true
      const { searchModel, page, page_size } = this
      getMyCustomerList({
        ...searchModel,
        page,
        page_size
      }).then(res => {
        this.total = res.total
        this.list = page === 1 ? res.data : this.list.concat(res.data)
      }).finally(() => {
        this.loading = false
      })
    }, 300),
    // 家庭列表数据
    getMyCustomerFamilyList: debounce(function() {
      this.loading = true
      const { searchModel, page, page_size } = this
      getMyCustomerFamilyList({
        keyword: searchModel.keyword,
        page,
        page_size
      }).then(res => {
        this.total = res.total
        this.list = page === 1 ? res.data : this.list.concat(res.data)
      }).finally(() => {
        this.loading = false
      })
    }, 300)
  },
  watch: {
    tabIndex() {
      this.handleTabChange()
    }
  },
  created() {
    if (this.$checkAuth('/customer/sales_customer/page_list')) {
      this.tabIndex = 'customer'
      this.getMyCustomerList()
    } else {
      this.tabIndex = 'family'
      this.getMyCustomerFamilyList()
    }
    // 筛选项 - 关联家庭数据
    getMyCustomerRelativeFamily().then(res => {
      this.relativeFamilyList = res
    })
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
      border-bottom: 1px solid #e6e6e6;
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
