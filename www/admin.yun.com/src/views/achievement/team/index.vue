<template>
  <div class="order-container page-container">
    <div class="header">
      团队业绩
      <div class="flex-between">
        <el-button size="small"
                   type="primary"
                   class="mr10"
                   :loading="exporting"
                   icon="iconfont iconxiao16_xiazai mr4"
                   v-if="$checkAuth('/team_performance/export')"
                   @click="policyExport">导出数据</el-button>
        <el-input v-model="searchModel.keyword"
                  placeholder="搜索单号或投被保人信息"
                  size="small"
                  class="fw400"
                  clearable
                  @input="searchModelChange">
          <i slot="prefix" class="ml4 iconfont iconxiao16_sousuo el-input__icon"></i>
        </el-input>
      </div>
    </div>
    <div class="scroll-box" ref="content">
      <!--全部出单日期-->
      <filter-shell v-model="searchModel.date_range"
                    :width="300"
                    :textOverflow="false"
                    :collapse="false"
                    autoClose
                    autoFocus
                    class="mb16"
                    @input="searchModelChange">
        <el-date-picker
                v-model="searchModel.date_range"
                type="daterange"
                style="width: 265px;"
                value-format="timestamp"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="searchModelChange">
        </el-date-picker>
        <template v-slot:label>
          {{ searchModel.date_range.length ? `${formatDate(searchModel.date_range[0], 'yyyyMMdd')} ~ ${formatDate(searchModel.date_range[1], 'yyyyMMdd')}` : '投退保日期' }}
        </template>
        <template v-slot:link>
          <div class="link-content">
            <span v-for="(date, index) in dateRange"
                  :key="index"
                  class="date-item"
                  :class="{ active: date.start === formatDate(searchModel.date_range[0], 'yyyyMMdd') && date.end === formatDate(searchModel.date_range[1], 'yyyyMMdd') }"
                  @click.stop="dateSelect(date)">
              {{ date.name }}
            </span>
          </div>
        </template>
      </filter-shell>
      <!--全部销售-->
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
                  v-for="item in salesList"
                  :key="item.id"
                  :label="item.real_name"
                  :value="item.id"
          ></el-option>
        </el-select>
        <template v-slot:label>
          {{hasValue(searchModel.sales_id) ? salesList.find(i => i.id === searchModel.sales_id[0]).real_name : '全部出单人'}}
        </template>
      </filter-shell>
      <!--全部保单状态-->
      <filter-shell v-model="searchModel.policy_status"
                    autoFocus
                    class="mb16"
                    @input="searchModelChange">
        <el-select class="block"
                   v-model="searchModel.policy_status"
                   multiple
                   clearable
                   filterable
                   placeholder="请选择"
                   @change="searchModelChange">
          <el-option
                  v-for="item in policyStatusArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
          ></el-option>
        </el-select>
        <template v-slot:label>
          {{ hasValue(searchModel.policy_status) ? policyStatusArray.find(i => i.value === searchModel.policy_status[0]).label : '全部保单状态' }}
        </template>
      </filter-shell>
      <!--全部保险产品-->
      <filter-shell v-model="searchModel.products"
                    autoFocus
                    class="mb16"
                    @input="searchModelChange">
        <el-select class="block"
                   v-model="searchModel.products"
                   multiple
                   clearable
                   filterable
                   placeholder="请选择"
                   @change="searchModelChange">
          <el-option
                  v-for="item in productList"
                  :key="item.id_type"
                  :label="item.name"
                  :value="item.id_type"
          ></el-option>
        </el-select>
        <template v-slot:label>
          {{ hasValue(searchModel.products) ? productList.find(i => i.id_type === searchModel.products[0]).name : '全部保险产品' }}
        </template>
      </filter-shell>
      <!--全部保险公司-->
      <filter-shell v-model="searchModel.supplier_id"
                    autoFocus
                    class="mb16"
                    @input="searchModelChange">
        <el-select class="block"
                   v-model="searchModel.supplier_id"
                   multiple
                   clearable
                   filterable
                   placeholder="请选择"
                   @change="searchModelChange">
          <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
          ></el-option>
        </el-select>
        <template v-slot:label>
          {{ hasValue(searchModel.supplier_id) ? supplierList.find(i => i.id === searchModel.supplier_id[0]).name : '全部保险公司' }}
        </template>
      </filter-shell>
      <!--全部险种分类-->
      <filter-shell v-model="searchModel.product_insurance_class"
                    autoFocus
                    class="mb16"
                    @input="searchModelChange">
        <el-select class="block"
                   v-model="searchModel.product_insurance_class"
                   multiple
                   clearable
                   filterable
                   placeholder="请选择"
                   @change="searchModelChange">
          <el-option
                  v-for="item in insuranceTypeArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
          ></el-option>
        </el-select>
        <template v-slot:label>
          {{ hasValue(searchModel.product_insurance_class) ? insuranceTypeArray.find(i => i.value === searchModel.product_insurance_class[0]).label : '全部险种分类' }}
        </template>
      </filter-shell>
      <div class="data-row" ref="dataRow">
        <el-button
          class="left"
          icon="el-icon-arrow-left"
          circle
          plain
          v-if="scrol2Lvisible"
          @click="scrollTo(0)"
        ></el-button>
        <div class="scroll-wrap"
             :style="{transform: `translateX(${scrollTranslateX}px)`}"
             v-loading="statisticLoading">
          <div class="item-block">
            <div v-if="$checkAuth('/team_performance/company_commission')">
              服务费(元)
              <template>
                <span class="primary">{{ statisticInfo.company_actually_commission }}</span>
              </template>
            </div>
            <div v-if="$checkAuth('/team_performance/sales_commission')">
              佣金(元)
              <span class="primary">{{ statisticInfo.sales_position_commission }}</span>
            </div>
          </div>
          <div class="item-block">
            <div>
              承保保费总计(元)
              <span class="primary">
                {{ statisticInfo.actual_underwrite_total_premium }}
              </span>
            </div>
            <div>
              有效出单件数
              <span class="primary">
                {{ statisticInfo.actual_underwrite_total_count }}
              </span>
            </div>
            <div>
              保费件均(元)
              <span class="primary">
                {{ statisticInfo.actual_underwrite_average_premium }}
              </span>
            </div>
          </div>
          <div class="item-block">
            <div>
              净收保费(元)
              <span class="primary">
                {{ statisticInfo.actual_premium }}
              </span>
            </div>
            <div>
              投保保费总计(元)
              <span class="primary">
                {{ statisticInfo.total_premium }}
              </span>
            </div>
            <div>
              未支付保费总计(元)
              <span class="warning">
                {{ statisticInfo.unpaid_total_premium }}
              </span>
            </div>
            <div>
              犹退保费总计(元)
              <span class="danger">
                {{ statisticInfo.hesitation_surrender_premium }}
              </span>
            </div>
            <div>
              退保保费总计(元)
              <span class="danger">
                {{ statisticInfo.surrender_premium }}
              </span>
            </div>
          </div>
          <div class="item-block">
            <div>
              犹退件数
              <span>{{ statisticInfo.hesitation_surrender_count }}</span>
            </div>
            <div>
              犹退件均(元)
              <span>{{ statisticInfo.average_hesitation_surrender_premium }}</span>
            </div>
            <div>
              非犹退保费(元)
              <span>{{ statisticInfo.non_hesitation_surrender_premium }}</span>
            </div>
            <div>
              非犹退件数
              <span>{{ statisticInfo.non_hesitation_surrender_count }}</span>
            </div>
            <div>
              非犹退件均(元)
              <span>{{ statisticInfo.average_non_hesitation_surrender_premium }}</span>
            </div>
          </div>
        </div>
        <el-button
          class="right"
          icon="el-icon-arrow-right"
          circle
          plain
          v-if="scrol2Rvisible"
          @click="scrollTo(1)"
        ></el-button>
      </div>
      <el-table :data="list"
                height="calc(100% - 122px)"
                border
                stripe
                v-table-infinite-scroll="scroll2Bottom"
                v-loading="tableLoading"
                :row-style="rowStyleFormat">
        <el-table-column label="出单人" prop="sales_real_name" align="center" width="150px"></el-table-column>
        <el-table-column label="团队" prop="sales_team_name" align="center" width="150px"></el-table-column>
        <el-table-column label="保险公司" prop="supplier_name" align="center" width="250px"></el-table-column>
        <el-table-column label="产品名称" prop="product_name" align="center" width="250px"></el-table-column>
        <el-table-column label="投保时间" prop="proposal_at_str" align="center" width="170px"></el-table-column>
        <el-table-column label="承保时间" prop="policy_at_str" width="170px" align="center"></el-table-column>
        <el-table-column label="投保人" prop="policy_holder_basic_info_str" width="180px" align="center"></el-table-column>
        <el-table-column label="被保人" prop="recognizee_basic_info" width="180px" align="center">
          <template slot-scope="{row}">
            <div v-for="(item, index) in row.recognizee_basic_info"
                  :key="index">
              {{ item.basic_info }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="保费(元)" prop="actually_premium" align="center"></el-table-column>
        <el-table-column label="保额(元)" prop="guarantee_quota_str" align="center"></el-table-column>
        <el-table-column label="缴费期限" prop="payment_period_desc" align="center"></el-table-column>
        <el-table-column label="保障期限" prop="guarantee_period_desc" align="center"></el-table-column>
        <el-table-column label="保单号" prop="policy_sn" align="center" width="200px"></el-table-column>
        <el-table-column label="投保单号" prop="proposal_sn" align="center" width="200px"></el-table-column>
        <el-table-column label="保单状态" prop="policy_status_str" align="center"></el-table-column>
        <el-table-column label="回访日期" prop="visit_at_str" width="170px" align="center"></el-table-column>
        <el-table-column label="过犹日期" prop="over_hesitation_at_str" width="170px" align="center"></el-table-column>
        <el-table-column label="是否犹退" prop="is_hesitate_surrender_str" align="center"></el-table-column>
        <el-table-column label="服务费(元)" prop="company_actually_commission" align="center" width="100px" v-if="$checkAuth('/team_performance/company_commission')"></el-table-column>
        <el-table-column label="佣金(元)" prop="sales_position_commission" align="center" width="100px" v-if="$checkAuth('/team_performance/sales_commission')"></el-table-column>
        <el-table-column label="操作" prop fixed="right" width="100px" align="center">
          <template slot-scope="{row}">
            <el-link v-if="$checkAuth('/achievement-team/detail')" type="primary" @click="showInfoDialog(row)">订单详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getTeamPolicyList, getTeamPolicyStatistics, getSalesData, getDateRange, exportTeamPolicy } from '@/apis/modules/achievement'
import { getAllProducts, getSupplierList } from '@/apis/modules/index'
import { formatDate, dateStr2Timestamp } from '@/utils/formatTime'
import { debounce, downloadFrameA } from '@/utils'
import qs from 'qs'
import { policyStatusArray, insuranceTypeArray } from '@/enums/common'
import FilterShell, { hasValue } from '@/components/filters/filter-shell'
import scrollMixin from '../scrollMixin' // 统计数据滚动事件混入
import orderListMixin from '@/mixins/order-list-mixin'

// 团队业绩
export default {
  name: 'achievement-team',
  mixins: [scrollMixin, orderListMixin],
  components: {
    FilterShell
  },
  data() {
    return {
      formatDate,
      filterValue: false,
      belongVisible: false,
      list: [],
      page: 1,
      page_size: 20,
      total: 0,
      policyStatusArray,
      insuranceTypeArray,
      productList: [],
      supplierList: [],
      companyList: [],
      salesList: [],
      dateRange: [],
      statisticInfo: {
        actual_underwrite_total_premium: 0
      },
      tableLoading: true,
      statisticLoading: true,
      scrol2Lvisible: false,
      scrol2Rvisible: false,
      exporting: false,
      scrollTranslateX: 0,
      searchModel: {
        keyword: '',
        sales_id: [],
        policy_status: [],
        products: [],
        supplier_id: [],
        product_insurance_class: [],
        date_range: [+new Date(), +new Date()]
      }
    };
  },
  methods: {
    policyExport() {
      const url = `${exportTeamPolicy}?${qs.stringify({...this.searchModelFormat(true)})}`
      this.exporting = true
      downloadFrameA(url, `订单数据-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`, 'get', true).then(() => {
        // this.$message.success('导出成功')
      }).finally(() => {
        this.exporting = false
      })
    },
    dateSelect(date) {
      const start = dateStr2Timestamp(date.start)
      const end = dateStr2Timestamp(date.end)
      if (!start && !end) {
        this.searchModel.date_range = ''
      } else {
        this.searchModel.date_range = [dateStr2Timestamp(date.start), dateStr2Timestamp(date.end)]
      }
      this.searchModelChange()
    },
    scroll2Bottom() {
      const {page, page_size, total} = this
      if (page * page_size < total) {
        this.tableLoading = true
        this.page += 1
        this.getTeamPolicyList()
        this.getTeamPolicyStatistics()
      }
    },
    searchModelChange: debounce(function() {
      this.tableLoading = true
      this.statisticLoading = true
      this.page = 1
      this.list = []
      this.total = 0
      this.statisticInfo = {}
      this.getTeamPolicyList()
      this.getTeamPolicyStatistics()
    }, 300),
    hasValue,
    showInfoDialog(row) {
      let routeUrl = this.$router.resolve(`/achievement-team/detail/${row.id}`)
      window.open(routeUrl.href, '_blank')
      // this.$router.push({ path: `/achievement-team/detail/${row.id}` })
    },
    searchModelFormat() {
      const model = {...this.searchModel}
      Object.keys(model).forEach(key => {
        const cur = model[key]
        if (key === 'date_range') {
          const [start, end] = model.date_range
          model.proposal_at_start = start ? formatDate(start, 'yyyyMMdd') : ''
          model.proposal_at_end = end ? formatDate(end, 'yyyyMMdd') : ''
        } else if(Array.isArray(cur)) {
          model[key] = model[key].join(',')
        }
      })
      delete model.date_range
      return model
    },
    getTeamPolicyList() {
      const {page, page_size, list} = this
      getTeamPolicyList({...this.searchModelFormat(), page, page_size}).then(res => {
        this.tableLoading = false
        this.list = [...list, ...res.data]
        this.total = res.total
      })
      .catch(() => {
        this.page = Math.max(1, page - 1)
        this.tableLoading = false
      })
    },
    getTeamPolicyStatistics() {
      getTeamPolicyStatistics(this.searchModelFormat()).then(res => {
        this.statisticInfo = res
        this.statisticLoading = false
      })
      .catch(err => {
        console.log(err)
        this.statisticLoading = false
      })
    },
    getAllProducts() {  
      getAllProducts().then(res => {
        this.productList = res
      })
      .catch(err => console.log(err))
    },
    getSupplierList() {
      getSupplierList().then(res => {
        this.supplierList = res
      })
      .catch(err => console.log(err))
    },
    getSalesData() {
      getSalesData().then(res => {
        this.salesList = res
      }).catch(err => console.log(err))
    },
    getDateRange() {
      getDateRange().then(res => {
        this.dateRange = res
      })
    }
  },
  created() {
    this.getTeamPolicyList()
    this.getTeamPolicyStatistics()
    this.getAllProducts()
    this.getSupplierList()
    this.getSalesData()
    this.getDateRange()
  }
};
</script>
<style lang="scss" scoped>
@import '../index.scss';
</style>