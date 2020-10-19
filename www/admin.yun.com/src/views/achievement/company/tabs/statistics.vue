<template>
  <div>
    <filter-shell v-model="searchModel.date_range"
                  :width="300"
                  autoClose
                  autoFocus
                  class="mb16"
                  :collapse="false"
                  :textOverflow="false"
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
        <span>{{ searchModel.date_range.length ? `${formatDate(searchModel.date_range[0], 'yyyyMMdd')} 至 ${formatDate(searchModel.date_range[1], 'yyyyMMdd')}` : '投退保日期' }}</span>
      </template>
      <template v-slot:link>
        <div class="link-content">
          <span v-for="(date, index) in dateRange"
                :key="index"
                class="date-item"
                :class="{ active: date.start === formatDate(searchModel.date_range[0], 'yyyyMMdd') && date.end === formatDate(searchModel.date_range[1], 'yyyyMMdd') }"
                @click.stop="dateSelect(date, 'searchModel')">
            {{ date.name }}
          </span>
        </div>
      </template>
    </filter-shell>
    <filter-shell v-model="searchModel.products"
                  autoFocus
                  class="mb16"
                  @input="searchModelChange">
      <el-select class="block"
                v-model="searchModel.products"
                clearable
                filterable
                multiple
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
        <span>
            {{ hasValue(searchModel.products) ? productList.find(i => i.id_type === searchModel.products[0]).name : '全部保险产品' }}
        </span>
      </template>
    </filter-shell>
    <filter-shell v-model="searchModel.product_insurance_class"
                  autoFocus
                  class="mb16"
                  @input="searchModelChange">
      <el-select class="block"
                v-model="searchModel.product_insurance_class"
                clearable
                filterable
                multiple
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
        <span>
            {{ hasValue(searchModel.product_insurance_class) ? insuranceTypeArray.find(i => i.value === searchModel.product_insurance_class[0]).label : '全部险种分类' }}
        </span>
      </template>
    </filter-shell>
    <filter-shell v-model="searchModel.sales_company_id"
                  autoFocus
                  class="mb16"
                  @input="searchModelChange">
      <el-select class="block"
                v-model="searchModel.sales_company_id"
                clearable
                filterable
                multiple
                placeholder="请选择"
                @change="searchModelChange">
        <el-option
                v-for="item in teamList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
        ></el-option>
      </el-select>
      <template v-slot:label>
        <span>
            {{ hasValue(searchModel.sales_company_id) ? teamList.find(i => i.id === searchModel.sales_company_id[0]).name : '全部团队' }}
        </span>
      </template>
    </filter-shell>
    <div v-if="$checkAuth('/company_performance/company/insurance_class_rank')">
      <div class="table-header">
        险种类别统计
        <el-button class="fr"
                  size="small"
                  type="primary"
                  :loading="exporting"
                  icon="iconfont iconxiao16_xiazai mr4"
                  v-if="$checkAuth('/company_performance/company/export_insurance_class_rank')"
                  @click="policyExport('exportInsuranceClassRank')">导出数据</el-button>
      </div>
      <el-table :data="insuranceClassRankList"
                stripe
                border
                height="32vh"
                v-loading="insuranceClassRankListLoading">
        <el-table-column align="center" label="排名" width="150px" prop="rank"></el-table-column>
        <el-table-column align="center" label="险种类别" width="250px" prop="insurance_class_name"></el-table-column>
        <el-table-column align="center" label="承保保费总计" width="150px" prop="underwrite_premium_rate">
          <template slot="header">
            <div>承保保费总计</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.underwrite_premium }}</div>
            <div v-if="scope.row.insurance_class">({{ scope.row.underwrite_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效出单件数" width="150px" prop="underwrite_quantity_rate">
          <template slot="header">
            <div>有效出单件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.underwrite_quantity }}</div>
            <div v-if="scope.row.insurance_class">({{ scope.row.underwrite_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="件均保费" width="150px" prop="average_underwrite_premium"></el-table-column>
        <el-table-column align="center" label="退保保费" width="150px" prop="surrender_premium_rate">
          <template slot="header">
            <div>退保保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.surrender_premium }}</div>
            <div v-if="scope.row.insurance_class">({{ scope.row.surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="退保件数" width="150px" prop="surrender_quantity">
          <template slot="header">
            <div>退保件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.surrender_quantity }}</div>
            <div v-if="scope.row.insurance_class">({{ scope.row.surrender_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="犹退保费" width="150px" prop="hesitate_surrender_premium">
          <template slot="header">
            <div>犹退保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.hesitate_surrender_premium }}</div>
            <div v-if="scope.row.insurance_class">({{ scope.row.hesitate_surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="犹退件数" prop="hesitate_surrender_quantity">
          <template slot="header">
            <div>犹退件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.hesitate_surrender_quantity }}</div>
            <div v-if="scope.row.insurance_class">({{ scope.row.hesitate_surrender_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="$checkAuth('/company_performance/company/product_rank')">
      <div class="table-header mt16">
        保险产品统计
        <el-button class="fr"
                  size="small"
                  type="primary"
                  :loading="exporting"
                  v-if="$checkAuth('/company_performance/company/export_product_rank')"
                  icon="iconfont iconxiao16_xiazai mr4"
                  @click="policyExport('exportProductRank')">导出数据</el-button>
      </div>
      <el-table :data="productRankList"
                stripe
                border
                height="32vh"
                v-loading="productRankListLoading">
        <el-table-column align="center" label="排名" width="150px" prop="rank"></el-table-column>
        <el-table-column align="center" label="保险产品" width="250px" prop="product_name"></el-table-column>
        <el-table-column align="center" label="承保保费总计" width="150px" prop="underwrite_premium">
          <template slot="header">
            <div>承保保费总计</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.underwrite_premium }}</div>
            <div v-if="scope.row.id_type">({{ scope.row.underwrite_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效出单件数" width="150px" prop="underwrite_quantity">
          <template slot="header">
            <div>有效出单件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.underwrite_quantity }}</div>
            <div v-if="scope.row.id_type">({{ scope.row.underwrite_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="件均保费" width="150px" prop="average_underwrite_premium"></el-table-column>
        <el-table-column align="center" label="退保保费" width="150px" prop="surrender_premium">
          <template slot="header">
            <div>退保保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.surrender_premium }}</div>
            <div v-if="scope.row.id_type">({{ scope.row.surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="退保件数" width="150px" prop="surrender_premium_rate">
          <template slot="header">
            <div>退保件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.surrender_premium }}</div>
            <div v-if="scope.row.id_type">({{ scope.row.surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="犹退保费" width="150px" prop="hesitate_surrender_premium">
          <template slot="header">
            <div>犹退保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.hesitate_surrender_premium }}</div>
            <div v-if="scope.row.id_type">({{ scope.row.hesitate_surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="犹退件数" prop="hesitate_surrender_premium_rate">
          <template slot="header">
            <div>犹退件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.hesitate_surrender_premium }}</div>
            <div v-if="scope.row.id_type">({{ scope.row.hesitate_surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatDate, dateStr2Timestamp } from '@/utils/formatTime'
import { getAllProducts } from '@/apis/modules/index'
import { getDateRange, getSalesTeamData, getProductRank, getInsuranceClassRank,
         exportInsuranceClassRank, exportProductRank } from '@/apis/modules/achievement'
import { insuranceTypeArray } from '@/enums/common'
import FilterShell, { hasValue } from '@/components/filters/filter-shell'
import { downloadFrameA } from '@/utils'
import qs from 'qs'
export default {
  props: {
    keywords: {
      type: String
    }
  },
  components: {
    FilterShell
  },
  data() {
    return {
      exportInsuranceClassRank,
      exportProductRank,
      productRankList: [],
      insuranceClassRankList: [],
      dateRange: [],
      productList: [],
      teamList: [],
      insuranceTypeArray,
      productRankListLoading: false,
      insuranceClassRankListLoading: false,
      exporting: false,
      page: 1,
      total: 0,
      searchModel: {
        date_range: [+new Date(), +new Date()],
        products: [],
        product_insurance_class: [],
        sales_company_id: [],
        keyword: ''
      }
    }
  },
  watch: {
    keywords(v) {
      this.searchModel.keyword = v
      this.searchModelChange()
    }
  },
  methods: {
    dateStr2Timestamp,
    hasValue,
    formatDate,
    policyExport(type) {
      const url = `${this[type]}?${qs.stringify({...this.searchModelFormat()})}`
      this.exporting = true
      downloadFrameA(url, `订单数据-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`, 'get', true).then(() => {
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
    getDateRange() {
      getDateRange().then(res => {
        this.dateRange = res
      })
    },
    getAllProducts() {
      getAllProducts().then(res => {
        this.productList = res
      })
      .catch(err => console.log(err))
    },
    getSalesTeamData() {
      getSalesTeamData().then(res => {
        this.teamList = res
      })
      .catch(err => console.log(err))
    },
    getProductRank() {
      this.productRankListLoading = true
      getProductRank(this.searchModelFormat()).then(res => {
        this.productRankList = res
      }).finally(() => {
        this.productRankListLoading = false
      })
    },
    getInsuranceClassRank() {
      this.insuranceClassRankListLoading = true
      getInsuranceClassRank(this.searchModelFormat()).then(res => {
        this.insuranceClassRankList = res
      }).finally(() => {
        this.insuranceClassRankListLoading = false
      })
    },
    searchModelFormat() {
      const { date_range } = this.searchModel
      let data
      if (date_range.length) {
        data = Object.assign({}, this.searchModel, {
          proposal_at_start: formatDate(date_range[0], 'yyyyMMdd'),
          proposal_at_end: formatDate(date_range[1], 'yyyyMMdd')
        })
      } else {
        data = Object.assign({}, this.searchModel, {
          proposal_at_start: '',
          proposal_at_end: ''
        })
      }
      delete data.date_range
      return data
    },
    searchModelChange() {
      this.page = 1
      this.total = 0
      this.productRankList = []
      this.insuranceClassRankList = []
      this.getProductRank()
      this.getInsuranceClassRank()
    }
  },
  mounted() {
    this.getDateRange()
    this.getAllProducts()
    this.getSalesTeamData()
    this.getProductRank()
    this.getInsuranceClassRank()
  }
}
</script>

<style lang="scss" scoped>
@import '../../index.scss';
.table-header {
  margin-bottom: 16px;
  height: 32px;
  font-size: 16px;
  font-weight: 500;
  line-height: 32px;
}
</style>