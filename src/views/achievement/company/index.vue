<template>
  <div class="order-container">
    <div class="header">
      公司业绩
      <div class="flex-between">
        <el-input v-model="searchModel.keyword"
                  placeholder="搜索单号或投被保人信息"
                  size="small"
                  clearable
                  @input="searchModelChange">
          <i slot="prefix" class="ml4 iconfont iconxiao16_sousuo el-input__icon"></i>
        </el-input>
      </div>
    </div>
    <div class="scroll-box" ref="content">
      <!--全部销售-->
      <filter-shell v-model="searchModel.sales_id"
                    autoFocus
                    placeholder="全部销售"
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
          {{hasValue(searchModel.sales_id) ? salesList.find(i => i.id === searchModel.sales_id[0]).real_name : '全部销售'}}
        </template>
      </filter-shell>
      <!--全部团队-->
      <filter-shell v-model="searchModel.sales_team_id"
                    autoFocus
                    @input="searchModelChange">
        <el-select class="block"
                   v-model="searchModel.sales_team_id"
                   multiple
                   clearable
                   filterable
                   placeholder="请选择"
                   @change="searchModelChange">
            <el-option
                v-for="item in salesTeamList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
        </el-select>
        <el-switch class="mt8 mb8" style="float: right" v-model="searchModel.include_child_team" active-text="查看挂靠团队"></el-switch>
        <template v-slot:label>
          {{ hasValue(searchModel.sales_team_id) ? salesTeamList.find(i => i.id === searchModel.sales_team_id[0]).name : '全部团队' }}
        </template>
      </filter-shell>
      <!--全部保单状态-->
      <filter-shell v-model="searchModel.policy_status"
                    autoFocus
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
                    @input="searchModelChange">
        <el-select class="block"
                   v-model="searchModel.product_insurance_class"
                   multiple
                   clearable
                   filterable
                   placeholder="请选择"
                   @change="filterListConfirm">
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
      <!--全部出单日期-->
      <filter-shell v-model="searchModel.date_range"
                    :width="300"
                    :textOverflow="false"
                    :collapse="false"
                    autoClose
                    autoFocus
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
          {{ searchModel.date_range.length ? `${formatDate(searchModel.date_range[0], 'yyyyMMdd')} ~ ${formatDate(searchModel.date_range[1], 'yyyyMMdd')}` : '全部出单日期' }}
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
            <div>
              服务费(元)
              <template>
                <span v-if="!parseInt(statisticInfo.company_actually_commission)" class="primary">0</span>
                <span v-else class="primary" v-to-fixed:[2]="statisticInfo.company_actually_commission">{{ statisticInfo.company_actually_commission }}</span>
              </template>
            </div>
            <div>
              佣金(元)
              <span v-if="!parseInt(statisticInfo.sales_position_commission)" class="primary">0</span>
              <span v-else class="primary" v-to-fixed:[2]="statisticInfo.sales_position_commission">{{ statisticInfo.sales_position_commission }}</span>
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
              <span>
                {{ statisticInfo.actual_underwrite_total_count }}
              </span>
            </div>
            <div>
              保费件均(元)
              <span>
                {{ statisticInfo.actual_underwrite_average_premium }}
              </span>
            </div>
          </div>
          <div class="item-block">
            <div>
              净收保费(元)
              <span class="primary">
                {{ statisticInfo.hesitation_surrender_premium }}
              </span>
            </div>
            <div>
              投保保费总计(元)
              <span class="primary">
                {{ statisticInfo.actual_premium }}
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
                :max-height="maxHeight"
                v-table-infinite-scroll="scroll2Bottom"
                border
                stripe
                v-loading="tableLoading">
        <el-table-column label="产品名称" prop="product_name" align="center" width="250px"></el-table-column>
        <el-table-column label="保险公司" prop="supplier_name" align="center" width="200px"></el-table-column>
        <el-table-column label="所属销售" prop="sales_real_name" align="center"></el-table-column>
        <el-table-column label="销售团队" prop="sales_team_name" align="center"></el-table-column>
        <el-table-column label="保单状态" prop="policy_status_str" align="center"></el-table-column>
        <el-table-column label="保费" prop="actually_premium" align="center" width="100px"></el-table-column>
        <el-table-column label="服务费" prop="company_actually_commission" align="center" width="100px">
          <template v-slot="{row}">
            <span v-if="!parseInt(row.company_actually_commission)">0</span>
            <span v-else v-to-fixed:[2]="row.company_actually_commission"></span>
          </template>
        </el-table-column>
        <el-table-column label="佣金" prop="sales_position_commission" align="center" width="100px">
          <template v-slot="{row}">
            <span v-if="!parseInt(row.sales_position_commission)">0</span>
            <span v-else v-to-fixed:[2]="row.sales_position_commission"></span>
          </template>
        </el-table-column>
        <el-table-column label="投保时间" prop="proposal_at" width="150px" align="center">
          <template slot-scope="{row}">
            {{ row.proposal_at && formatDate(row.proposal_at * 1000, 'yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="承保时间" prop="policy_at" width="150px" align="center">
          <template slot-scope="{row}">
            {{ row.policy_at && formatDate(row.policy_at * 1000, 'yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="回访成功日期" prop="" width="150px" align="center"></el-table-column>
        <el-table-column label="过犹日期" prop="over_hesitation_at" width="150px" align="center">
          <template slot-scope="{row}">
            {{ row.over_hesitation_at && formatDate(row.over_hesitation_at * 1000, 'yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="是否犹退" prop="is_hesitate_surrender_str" align="center"></el-table-column>
        <el-table-column label="投保人" prop="policy_holder_name" align="center"></el-table-column>
        <el-table-column label="被保人" prop="policy_recognizee_name" align="center"></el-table-column>
        <el-table-column label="保额" prop="guarantee_quota_str" align="center"></el-table-column>
        <el-table-column label="缴费期限" prop="payment_period_desc" align="center"></el-table-column>
        <el-table-column label="保障期限" prop="guarantee_period_desc" align="center"></el-table-column>
        <el-table-column label="保单号" prop="policy_sn" align="center" width="200px"></el-table-column>
        <el-table-column label="投保单号" prop="proposal_sn" align="center" width="200px"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150px" align="center">
          <template slot-scope="{row}">
            <el-link type="primary" @click="showInfoDialog(row)" class="mr8">订单详情</el-link>
            <el-link type="primary" @click="showBelongDialog(row)">修改归属</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-modal :show.sync="belongVisible"
                :belongData="belongData"
                @update="getCompanyPolicyList"></edit-modal>
  </div>
</template>

<script>
import EditModal from './modal/edit';
import { getCompanyPolicyList, getCompanyPolicyStatistics, getSalesData, getSalesTeamData } from '@/apis/modules/achievement'
import { getAllProducts, getSupplierList } from '@/apis/modules/index'
import { formatDate } from '@/utils/formatTime'
import { debounce } from '@/utils'
import { policyStatusArray, insuranceTypeArray } from '@/enums/common'
import FilterShell, { hasValue } from '@/components/filters/filter-shell'
// 业绩-订单
export default {
  name: "order",
  components: {
    EditModal,
    FilterShell
  },
  directives: {
    'table-infinite-scroll' : {
      inserted(el, binding) {
        const scrollWrap = el.querySelector('.el-table__body-wrapper')
        const scrollHandle = debounce(() => {
          const {scrollHeight, scrollTop, offsetHeight} = scrollWrap
          if (scrollHeight > offsetHeight && offsetHeight + scrollTop >= scrollHeight) { // 到底
            binding.value()
          }
        }, 300)
        scrollWrap.addEventListener('scroll', scrollHandle)
      }
    }
  },
  data() {
    return {
      formatDate,
      filterValue: false,
      belongVisible: false,
      belongData: {},
      list: [],
      page: 1,
      page_size: 20,
      total: 0,
      policyStatusArray,
      insuranceTypeArray,
      productList: [],
      salesList: [],
      salesTeamList: [],
      supplierList: [],
      companyList: [],
      statisticInfo: {
        actual_underwrite_total_premium: 0
      },
      tableLoading: true,
      statisticLoading: true,
      scrol2Lvisible: false,
      scrol2Rvisible: false,
      scrollTranslateX: 0,
      searchModel: {
        keyword: '',
        policy_status: [],
        products: [],
        supplier_id: [],
        product_insurance_class: [],
        date_range: [],
        sales_id: [],
        sales_team_id: [],
        include_child_team: false,
      },
      maxHeight: null
    };
  },
  methods: {
    scroll2Bottom() {
      const {page, page_size, total} = this
      if (page * page_size < total) {
        this.page += 1
        this.getCompanyPolicyList()
        this.getCompanyPolicyStatistics()
      }
    },
    filterListConfirm() {
      this.searchModelChange()
    },
    searchModelChange() {
      const func = debounce(() => {
        this.tableLoading = true
        this.statisticLoading = true
        this.getCompanyPolicyList()
        this.getCompanyPolicyStatistics()
      }, 300)
      func()
      this.searchModelChange = func
    },
    hasValue,
    // dir 0: 左 1: 右
    scrollTo(dir) {
      const { scrollTranslateX: oldTranX } = this;
      const el = this.$refs.dataRow;
      const { offsetWidth } = el;
      const { offsetWidth: warpWidth } = el.querySelector(".scroll-wrap");
      let newTranX = oldTranX + (dir ? -100 : 100);
      if (dir) {
        const limitX = offsetWidth - warpWidth;
        newTranX = Math.max(newTranX, limitX);
        this.scrol2Rvisible = newTranX !== limitX;
        this.scrol2Lvisible = true;
      } else {
        newTranX = Math.min(0, newTranX);
        this.scrol2Lvisible = !!newTranX;
        this.scrol2Rvisible = true;
      }
      this.scrollTranslateX = newTranX;
    },
    // 检测数据栏是否需要滚动
    checkNeedScroll() {
      const { offsetWidth } = this.$refs.dataRow;
      const { offsetWidth: warpWidth } = this.$refs.dataRow.querySelector(
        '.scroll-wrap'
      );
      if (warpWidth - 16 > offsetWidth) {
        this.scrol2Lvisible = false;
        this.scrol2Rvisible = true;
        this.scrollTranslateX = 0;
      } else {
        this.scrol2Lvisible = false;
        this.scrol2Rvisible = false;
        this.scrollTranslateX = 0;
      }
    },
    showInfoDialog(row) {
      let routeUrl = this.$router.resolve(`/achievement-company/detail/${row.id}`)
      window.open(routeUrl.href, '_blank')
      // this.$router.push({ path: `/achievement-company/detail/${row.id}` })
    },
    showBelongDialog(row) {
      this.belongData = row;
      this.belongVisible = true;
    },
    searchModelFormat() {
      const model = {...this.searchModel}
      Object.keys(model).forEach(key => {
        const cur = model[key]
        if (key === 'date_range') {
          const [start, end] = model.date_range
          model.proposal_at_start = start ? +start / 1000 : ''
          model.proposal_at_end = end ? +start / 1000 : ''
        } else if(Array.isArray(cur)) {
          model[key] = model[key].join(',')
        }
      })
      delete model.date_range
      return model
    },
    getCompanyPolicyList() {
      const {page, page_size, list} = this
      getCompanyPolicyList({...this.searchModelFormat(), page, page_size}).then(res => {
        this.tableLoading = false
        this.list = page <= 1 ? res.data : [...list, ...res.data]
        this.total = res.total
      })
      .catch(err => {
        console.log(err)
        this.tableLoading = false
      })
    },
    getCompanyPolicyStatistics() {
      getCompanyPolicyStatistics(this.searchModelFormat()).then(res => {
        this.statisticInfo = res
        this.statisticLoading = false
      })
      .catch(err => {
        console.log(err)
        this.statisticLoading = false
      })
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
    setMaxHeight() {
      this.maxHeight = this.$refs.content.offsetHeight - 158
    },
    handleResize() {
      const func = debounce(() => {
        this.checkNeedScroll()
        this.setMaxHeight()
      }, 300)
      func()
      this.handleResize = func
    }
  },
  watch: {
    belongVisible(v) {
      if (!v) {
        this.belongData = {};
      }
    }
  },
  created() {
    this.getCompanyPolicyList()
    this.getCompanyPolicyStatistics()
    this.getSalesData()
    this.getSalesTeamData()
    this.getAllProducts()
    this.getSupplierList()
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>
<style lang="scss" scoped>
@import '../index.scss';
</style>