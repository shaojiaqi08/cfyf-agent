<template>
  <div class="order-container page-container">
    <div class="header">
      <el-tabs class="tabs" v-model="tabIndex" @tab-click="tabChange">
        <el-tab-pane name="all" label="全部客户"></el-tab-pane>
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
                  @input="searchModelChange">
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
                      @input="searchModelChange">
          <el-select class="block"
                     v-model="searchModel.sales_id"
                     clearable
                     filterable
                     multiple
                     placeholder="请选择"
                     @change="searchModelChange">
            <el-option
                    v-for="item in teamList"
                    :key="item.id"
                    :label="item.real_name"
                    :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{searchModel.sales_id.length ? teamList.find(i => i.id === searchModel.sales_id[0]).real_name : '全部出单人'}}
          </template>
        </filter-shell>
        <!--全部团队-->
        <filter-shell v-model="searchModel.sales_id"
                      autoFocus
                      class="mb16"
                      placeholder="全部出单人"
                      @input="searchModelChange">
          <el-select class="block"
                    v-model="searchModel.sales_id"
                    clearable
                    filterable
                    multiple
                    placeholder="请选择"
                    @change="searchModelChange">
              <el-option
                  v-for="item in teamList"
                  :key="item.id"
                  :label="item.real_name"
                  :value="item.id"
              ></el-option>
          </el-select>
          <template v-slot:label>
            {{searchModel.sales_id.length ? teamList.find(i => i.id === searchModel.sales_id[0]).real_name : '全部团队'}}
          </template>
        </filter-shell>
        <!--全部关联家庭-->
        <filter-shell v-model="searchModel.policy_status"
                      autoFocus
                      class="mb16"
                      v-if="tabIndex === 'all'"
                      @input="searchModelChange">
          <el-select class="block"
                    v-model="searchModel.policy_status"
                    multiple
                    clearable
                    filterable
                    placeholder="请选择"
                    @change="searchModelChange">
            <el-option
                    v-for="item in relativeFamilyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{ searchModel.policy_status.length ? relativeFamilyList.find(i => i.value === searchModel.policy_status[0]).label : '全部关联家庭' }}
          </template>
        </filter-shell>
      </div>
      <el-table :data="list"
                height="calc(100vh - 163px)"
                v-table-infinite-scroll="scroll2Bottom"
                border
                stripe
                v-loading="tableLoading">
        <template v-if="tabIndex === 'all'">
          <el-table-column label="姓名" align="center" fixed="left"></el-table-column>
          <el-table-column label="手机号" align="center"></el-table-column>
          <el-table-column label="身份证号" align="center"></el-table-column>
          <el-table-column label="出生日期" align="center"></el-table-column>
          <el-table-column label="保单数量" align="center"></el-table-column>
          <el-table-column label="关联家庭" align="center"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template v-slot="{ row }">
              <el-link type="primary" @click="viewDetail(row)">查看详情</el-link>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column label="家庭名称" align="center"></el-table-column>
          <el-table-column label="投保人" align="center"></el-table-column>
          <el-table-column label="保单数量" align="center"></el-table-column>
          <el-table-column label="创建人" align="center"></el-table-column>
          <el-table-column label="团队" align="center"></el-table-column>
          <el-table-column label="备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center"></el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatTime'
// import { debounce, downloadFrameA } from '@/utils'
// import qs from 'qs'
import FilterShell from '@/components/filters/filter-shell'

// 客户 - 全部客户
export default {
  name: 'all-customer',
  components: {
    FilterShell
  },
  computed: {
    placeholder () {
      return this.tabIndex === 'all' ? '搜索昵称、姓名、ID、身份证号或手机号' : '搜索家庭名称或投保人名称'
    }
  },
  data() {
    return {
      tabIndex: 'all',
      formatDate,
      filterValue: false,
      belongVisible: false,
      belongData: {},
      list: [],
      teamList: [],
      relativeFamilyList: [],
      page: 1,
      page_size: 20,
      total: 0,
      tableLoading: false,
      exporting: false,
      searchModel: {
        keyword: '',
        policy_status: [],
        products: [],
        supplier_id: [],
        product_insurance_class: [],
        date_range: [+new Date(), +new Date()],
        sales_id: [],
        sales_team_id: [],
        include_child_team: '0',
        visit_status: []
      }
    };
  },
  methods: {
    viewDetail(row) {
      console.log(row)
    },
    searchModelChange() {

    },
    tabChange() {
      Object.assign(this.searchModel, {
        keyword: '',
        policy_status: [],
        products: [],
        supplier_id: [],
        product_insurance_class: [],
        date_range: [+new Date(), +new Date()],
        sales_id: [],
        sales_team_id: [],
        include_child_team: '0',
      })
      this.rankKeywords = ''
      this.statisticsKeywords = ''
    },
    scroll2Bottom() {
      const {page, page_size, total} = this
      if (page * page_size < total) {
        this.tableLoading = true
        this.page += 1
      }
    }
  },
  watch: {
    belongVisible(v) {
      if (!v) {
        this.belongData = {};
      }
    },
    'searchModel.sales_team_id'(v) {
      if(v.length <= 0) {
        this.searchModel.include_child_team = '0'
      }
    }
  },
  created() {}
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
