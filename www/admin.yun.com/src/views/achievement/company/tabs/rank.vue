<template>
  <el-scrollbar class="scrollbar" style="height: 94vh;">
    <div class="pl16 pr16 pt16">
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
      <filter-shell v-model="searchModel.sales_team_id"
                    autoFocus
                    class="mb16"
                    @input="searchModelChange">
        <el-select class="block"
                  v-model="searchModel.sales_team_id"
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
              {{ hasValue(searchModel.sales_team_id) ? teamList.find(i => i.id === searchModel.sales_team_id[0]).name : '全部团队' }}
          </span>
        </template>
      </filter-shell>
    </div>
    <div class="pl16 pr16" v-if="$checkAuth('/company_performance/team_rank')">
      <div class="table-header">
        团队业绩排行
        <el-button class="fr"
                  size="small"
                  type="primary"
                  :loading="exporting"
                  icon="iconfont iconxiao16_xiazai mr4"
                  v-if="$checkAuth('/company_performance/export_team_rank')"
                  @click="policyExport('exportTeamRank')">导出数据</el-button>
      </div>
      <el-table :data="salesCompanyRankList"
                stripe
                border
                height="768px"
                v-loading="salesCompanyRankListLoading">
        <el-table-column align="center" label="排名" width="150px" prop="rank"></el-table-column>
        <el-table-column align="center" label="团队" width="150px" prop="team_name"></el-table-column>
        <el-table-column align="center" label="承保保费总计" width="150px" prop="underwrite_premium">
          <template slot="header">
            <div>承保保费总计</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.underwrite_premium }}</div>
            <div v-if="scope.row.team_id">({{ scope.row.underwrite_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效出单件数" width="150px" prop="underwrite_quantity">
          <template slot="header">
            <div>有效出单件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.underwrite_quantity }}</div>
            <div v-if="scope.row.team_id">({{ scope.row.underwrite_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="件均保费" width="150px" prop="average_underwrite_premium"></el-table-column>
        <el-table-column align="center" label="人力" width="150px" prop="manpower">
          <template slot="header">
            <div>人力</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.manpower }}</div>
            <div v-if="scope.row.team_id">({{ scope.row.manpower_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="人均保费" width="150px" prop="person_avg_premium"></el-table-column>
        <el-table-column align="center" label="长险保费" width="150px" prop="long_insurance_premium">
          <template slot="header">
            <div>长险保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.long_insurance_premium }}</div>
            <div v-if="scope.row.team_id">({{ scope.row.long_insurance_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="长险有效出单件数" width="150px" prop="long_insurance_quantity">
          <template slot="header">
            <div>长险有效出单件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.long_insurance_quantity }}</div>
            <div v-if="scope.row.team_id">({{ scope.row.long_insurance_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="长险件均保费" width="150px" prop="long_insurance_premium_avg"></el-table-column>
        <el-table-column align="center" label="短险保费" width="150px" prop="short_insurance_premium">
          <template slot="header">
            <div>短险保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.short_insurance_premium }}</div>
            <div v-if="scope.row.team_id">({{ scope.row.short_insurance_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="短险有效出单件数" width="150px" prop="short_insurance_quantity">
          <template slot="header">
            <div>短险有效出单件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.short_insurance_quantity }}</div>
            <div v-if="scope.row.team_id">({{ scope.row.short_insurance_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="短险件均保费" width="150px" prop="short_insurance_premium_avg"></el-table-column>
        <el-table-column align="center" label="退保保费" width="150px" prop="surrender_premium">
          <template slot="header">
            <div>退保保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.surrender_premium }}</div>
            <div v-if="scope.row.team_id">({{ scope.row.surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="犹退保费" prop="hesitate_surrender_premium">
          <template slot="header">
            <div>犹退保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.hesitate_surrender_premium }}</div>
            <div v-if="scope.row.team_id">({{ scope.row.hesitate_surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pl16 pr16" v-if="$checkAuth('/company_performance/company/personal_rank')">
      <div class="table-header mt20">
        个人业绩排行
        <el-button class="fr"
                  size="small"
                  type="primary"
                  :loading="exporting"
                  icon="iconfont iconxiao16_xiazai mr4"
                  v-if="$checkAuth('/company_performance/company/export_personal_rank')"
                  @click="policyExport('exportPersonalRank')">导出数据</el-button>
      </div>
      <el-table :data="personalRankList"
                stripe
                border
                height="768px"
                v-loading="personalRankListLoading">
        <el-table-column align="center" label="排名" width="150px" prop="rank"></el-table-column>
        <el-table-column align="center" label="出单人" width="250px" prop="sales_real_name">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;">
              <span class="mr4">{{ scope.row.sales_real_name }}</span>
              <div v-if="scope.row.sales_avatar_url"
                   style="display: inline-block;">
                <img :src="scope.row.sales_avatar_url"
                    style="border-radius: 50%;"
                    width="40"
                    height="40">
              </div>
              <span class="ml4 mr4" v-if="scope.row.sales_position_name">({{ scope.row.sales_position_name }})</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="团队" width="150px" prop="sales_team_name"></el-table-column>
        <el-table-column align="center" label="承保保费总计" width="150px" prop="underwrite_premium_rate">
          <template slot="header">
            <div>承保保费总计</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.underwrite_premium }}</div>
            <div v-if="scope.row.sales_id">({{ scope.row.underwrite_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效出单件数" width="150px" prop="underwrite_quantity_rate">
          <template slot="header">
            <div>有效出单件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.underwrite_quantity }}</div>
            <div v-if="scope.row.sales_id">({{ scope.row.underwrite_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="件均保费" width="150px" prop="average_underwrite_premium"></el-table-column>
        <el-table-column align="center" label="长险保费" width="150px" prop="long_insurance_premium_rate">
          <template slot="header">
            <div>长险保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.long_insurance_premium }}</div>
            <div v-if="scope.row.sales_id">({{ scope.row.long_insurance_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="长险有效出单件数" width="150px" prop="long_insurance_quantity_rate">
          <template slot="header">
            <div>长险有效出单件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.long_insurance_quantity }}</div>
            <div v-if="scope.row.sales_id">({{ scope.row.long_insurance_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="长险件均保费" width="150px" prop="long_insurance_premium_avg"></el-table-column>
        <el-table-column align="center" label="短险保费" width="150px" prop="short_insurance_premium_rate">
          <template slot="header">
            <div>短险保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.short_insurance_premium }}</div>
            <div v-if="scope.row.sales_id">({{ scope.row.short_insurance_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="短险有效出单件数" width="150px" prop="short_insurance_quantity_rate">
          <template slot="header">
            <div>短险有效出单件数</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.short_insurance_quantity }}</div>
            <div v-if="scope.row.sales_id">({{ scope.row.short_insurance_quantity_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="短险件均保费" width="150px" prop="short_insurance_premium_avg"></el-table-column>
        <el-table-column align="center" label="退保保费" width="150px" prop="surrender_premium_rate">
          <template slot="header">
            <div>退保保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.surrender_premium }}</div>
            <div v-if="scope.row.sales_id">({{ scope.row.surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="犹退保费" prop="hesitate_surrender_premium_rate">
          <template slot="header">
            <div>犹退保费</div>
            <div>(占比)</div>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.hesitate_surrender_premium }}</div>
            <div v-if="scope.row.sales_id">({{ scope.row.hesitate_surrender_premium_rate || 0 }}%)</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-scrollbar>
</template>

<script>
import { formatDate, dateStr2Timestamp } from '@/utils/formatTime'
import { getAllProducts } from '@/apis/modules/index'
import { getDateRange, getSalesTeamData, getTeamRank, getPersonalRank,
         exportTeamRank, exportPersonalRank } from '@/apis/modules/achievement'
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
      exportTeamRank,
      exportPersonalRank,
      salesCompanyRankList: [],
      personalRankList: [],
      dateRange: [],
      productList: [],
      teamList: [],
      page: 1,
      total: 0,
      insuranceTypeArray,
      salesCompanyRankListLoading: false,
      personalRankListLoading: false,
      exporting: false,
      searchModel: {
        date_range: [+new Date(), +new Date()],
        products: [],
        product_insurance_class: [],
        sales_team_id: [],
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
      let exportName
      switch (type) {
        case 'exportTeamRank':
          exportName = '团队业绩排行'
          break
        case 'exportPersonalRank':
          exportName = '个人业绩排行'
          break
      }
      const url = `${this[type]}?${qs.stringify({...this.searchModelFormat()})}`
      this.exporting = true
      downloadFrameA(url, `${exportName}-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`, 'get', true).then(() => {
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
    getTeamRank() {
      this.salesCompanyRankListLoading = true
      this.salesCompanyRankList = []
      getTeamRank(this.searchModelFormat()).then(res => {
        this.salesCompanyRankList = res
      })
      .finally(() => {
        this.salesCompanyRankListLoading = false
      })
    },
    getPersonalRank() {
      this.personalRankListLoading = true
      this.personalRankList = []
      getPersonalRank(this.searchModelFormat()).then(res => {
        this.personalRankList = res
      }).finally(() => {
        this.personalRankListLoading = false
      })
    },
    searchModelChange() {
      this.page = 1
      this.total = 0
      this.salesCompanyRankList = []
      this.personalRankList = []
      this.$checkAuth('/company_performance/team_rank') && this.getTeamRank()
      this.$checkAuth('/company_performance/company/personal_rank') && this.getPersonalRank()
    }
  },
  mounted() {
    this.getDateRange()
    this.getAllProducts()
    this.getSalesTeamData()
    this.$checkAuth('/company_performance/team_rank') && this.getTeamRank()
    this.$checkAuth('/company_performance/company/personal_rank') && this.getPersonalRank()
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