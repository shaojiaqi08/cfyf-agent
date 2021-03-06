<template>
  <div class="order-container page-container">
    <div class="header">
      <el-tabs class="tabs" v-model="tabIndex" @tab-click="tabChange">
        <el-tab-pane name="order" label="订单"></el-tab-pane>
        <el-tab-pane
          name="rank"
          label="业绩排行"
          v-if="
            $checkAuth('/company_performance/company/personal_rank') ||
              $checkAuth('/company_performance/team_rank')
          "
        ></el-tab-pane>
        <el-tab-pane
          name="statistics"
          label="商品统计"
          v-if="
            $checkAuth('/company_performance/company/insurance_class_rank') ||
              $checkAuth('/company_performance/company/product_rank')
          "
        ></el-tab-pane>
      </el-tabs>
      <el-input
        v-model="searchModel.keyword"
        placeholder="搜索单号或投被保人信息或投保人手机号"
        size="small"
        class="fw400"
        clearable
        v-if="tabIndex === 'order'"
        @keyup.enter.native="searchModelChange"
      >
        <i
          slot="prefix"
          class="ml4 iconfont iconxiao16_sousuo el-input__icon"
        ></i>
        <el-button slot="append" @click="searchModelChange">搜索</el-button>
      </el-input>
      <el-input
        v-model="rankKeywords"
        placeholder="搜索团队名或出单人姓名"
        size="small"
        class="fw400"
        clearable
        v-if="tabIndex === 'rank'"
        @keyup.enter.native="searchRank"
      >
        <i
          slot="prefix"
          class="ml4 iconfont iconxiao16_sousuo el-input__icon"
        ></i>
        <el-button slot="append" @click="searchRank">搜索</el-button>
      </el-input>
      <el-input
        v-model="statisticsKeywords"
        placeholder="搜索保险产品名"
        size="small"
        class="fw400"
        clearable
        v-if="tabIndex === 'statistics'"
        @keyup.enter.native="searchStatistics"
      >
        <i
          slot="prefix"
          class="ml4 iconfont iconxiao16_sousuo el-input__icon"
        ></i>
        <el-button slot="append" @click="searchStatistics">搜索</el-button>
      </el-input>
      <!-- 公司业绩
      <div class="flex-between">
        <el-button size="small"
                   type="primary"
                   class="mr10"
                   :loading="exporting"
                   icon="iconfont iconxiao16_xiazai mr4"
                   v-if="$checkAuth('/company_performance/export')"
                   @click="policyExport">导出数据</el-button>
        <el-input v-model="searchModel.keyword"
                  placeholder="搜索单号或投被保人信息"
                  size="small"
                  class="fw400"
                  clearable
                  @input="searchModelChange">
          <i slot="prefix" class="ml4 iconfont iconxiao16_sousuo el-input__icon"></i>
        </el-input>
      </div>-->
    </div>
    <div class="scroll-box p16" v-if="tabIndex === 'order'" ref="content">
      <div>
        <!--全部出单日期-->
        <filter-shell
          v-model="searchModel.date_range"
          :width="300"
          :textOverflow="false"
          :collapse="false"
          autoClose
          autofocus
          class="mb16"
          @input="searchModelChange"
        >
          <el-date-picker
            v-model="searchModel.date_range"
            type="daterange"
            style="width: 265px;"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
            @change="searchModelChange"
          ></el-date-picker>
          <template v-slot:label>{{
            searchModel.date_range.length
              ? `${formatDate(
                  searchModel.date_range[0],
                  "yyyyMMdd"
                )} ~ ${formatDate(searchModel.date_range[1], "yyyyMMdd")}`
              : "投退保日期"
          }}</template>
          <template v-slot:link>
            <div class="link-content">
              <span
                v-for="(date, index) in dateRange"
                :key="index"
                class="date-item"
                :class="{
                  active:
                    date.start ===
                      formatDate(searchModel.date_range[0], 'yyyyMMdd') &&
                    date.end ===
                      formatDate(searchModel.date_range[1], 'yyyyMMdd'),
                }"
                @click.stop="dateSelect(date)"
                >{{ date.name }}</span
              >
            </div>
          </template>
        </filter-shell>
        <!--全部销售-->
        <filter-shell
          v-model="searchModel.sales_id"
          autofocus
          class="mb16"
          placeholder="全部出单人"
          @input="searchModelChange"
        >
          <el-select
            class="block"
            v-model="searchModel.sales_id"
            clearable
            filterable
            multiple
            placeholder="请选择"
            @change="searchModelChange"
          >
            <el-option
              v-for="item in salesList"
              :key="item.id"
              :label="item.real_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>{{
            hasValue(searchModel.sales_id)
              ? salesList.find((i) => i.id === searchModel.sales_id[0])
                  .real_name
              : "出单人"
          }}</template>
        </filter-shell>
        <!--全部团队-->
        <filter-shell
          v-model="searchModel.sales_team_id"
          class="mb16"
          @input="searchModelChange"
        >
          <el-select
            class="block"
            v-model="searchModel.sales_team_id"
            multiple
            clearable
            filterable
            placeholder="请选择"
            @change="searchModelChange"
          >
            <el-option
              v-for="item in salesTeamList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <div class="mt20 mb10 flex-between">
            包含子团队
            <el-switch
              :disabled="searchModel.sales_team_id.length <= 0"
              style="float: right"
              inactive-value="0"
              active-value="1"
              v-model="searchModel.include_child_team"
              @change="searchModelChange"
            ></el-switch>
          </div>
          <template v-slot:label>{{
            hasValue(searchModel.sales_team_id)
              ? salesTeamList.find((i) => i.id === searchModel.sales_team_id[0])
                  .name
              : "团队"
          }}</template>
        </filter-shell>
        <!--全部保单状态-->
        <filter-shell
          v-model="searchModel.policy_status"
          autofocus
          class="mb16"
          @input="searchModelChange"
        >
          <el-select
            class="block"
            v-model="searchModel.policy_status"
            multiple
            clearable
            filterable
            placeholder="请选择"
            @change="searchModelChange"
          >
            <el-option
              v-for="item in policyStatusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <template v-slot:label>{{
            hasValue(searchModel.policy_status)
              ? policyStatusArray.find(
                  (i) => i.value === searchModel.policy_status[0]
                ).label
              : "保单状态"
          }}</template>
        </filter-shell>

        <filter-shell
          v-model="searchModel.manpower_underwriting_status"
          autoFocus
          class="mb16"
          @input="searchModelChange"
        >
          <el-select
            class="block"
            v-model="searchModel.manpower_underwriting_status"
            clearable
            filterable
            placeholder="请选择"
            @change="searchModelChange"
          >
            <el-option
              v-for="item in manualReview"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <template v-slot:label>
            <span>
              {{
                hasValue(searchModel.manpower_underwriting_status)
                  ? manualReview.find(
                      (i) =>
                        i.value === searchModel.manpower_underwriting_status
                    ).label
                  : "人核状态"
              }}
            </span>
          </template>
        </filter-shell>

        <!--回访状态-->
        <filter-shell
          v-model="searchModel.visit_status"
          autofocus
          class="mb16"
          @input="searchModelChange"
        >
          <el-select
            class="block"
            v-model="searchModel.visit_status"
            multiple
            clearable
            filterable
            placeholder="请选择"
            @change="searchModelChange"
          >
            <el-option
              v-for="item in visitStatusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <template v-slot:label>{{
            hasValue(searchModel.visit_status)
              ? visitStatusArray.find(
                  (i) => i.value === searchModel.visit_status[0]
                ).label
              : "回访状态"
          }}</template>
        </filter-shell>
        <!--全部保险产品-->
        <filter-shell
          v-model="searchModel.products"
          autofocus
          class="mb16"
          @input="searchModelChange"
        >
          <el-select
            class="block"
            v-model="searchModel.products"
            multiple
            clearable
            filterable
            placeholder="请选择"
            @change="searchModelChange"
          >
            <el-option
              v-for="item in productList"
              :key="item.id_type"
              :label="item.name"
              :value="item.id_type"
            ></el-option>
          </el-select>
          <template v-slot:label>{{
            hasValue(searchModel.products)
              ? productList.find((i) => i.id_type === searchModel.products[0])
                  .name
              : "保险产品"
          }}</template>
        </filter-shell>
        <!--全部保险公司-->
        <filter-shell
          v-model="searchModel.supplier_id"
          autofocus
          class="mb16"
          @input="searchModelChange"
        >
          <el-select
            class="block"
            v-model="searchModel.supplier_id"
            multiple
            clearable
            filterable
            placeholder="请选择"
            @change="searchModelChange"
          >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>{{
            hasValue(searchModel.supplier_id)
              ? supplierList.find((i) => i.id === searchModel.supplier_id[0])
                  .name
              : "保险公司"
          }}</template>
        </filter-shell>
        <!--全部险种分类-->
        <filter-shell
          v-model="searchModel.product_insurance_class"
          autofocus
          class="mb16"
          @input="searchModelChange"
        >
          <el-select
            class="block"
            v-model="searchModel.product_insurance_class"
            multiple
            clearable
            filterable
            placeholder="请选择"
            @change="filterListConfirm"
          >
            <el-option
              v-for="item in insuranceTypeArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <template v-slot:label>{{
            hasValue(searchModel.product_insurance_class)
              ? insuranceTypeArray.find(
                  (i) => i.value === searchModel.product_insurance_class[0]
                ).label
              : "险种分类"
          }}</template>
        </filter-shell>
      </div>
      <div class="data-row" ref="dataRow">
        <el-button
          class="left"
          icon="el-icon-arrow-left"
          circle
          plain
          v-if="scrol2Lvisible"
          @click="scrollTo(0)"
        ></el-button>
        <div
          class="scroll-wrap"
          :style="{ transform: `translateX(${scrollTranslateX}px)` }"
          v-loading="statisticLoading"
        >
          <div class="item-block">
            <div v-if="$checkAuth('/company_performance/company_commission')">
              服务费(元)
              <template>
                <span class="primary">{{
                  statisticInfo.company_actually_commission
                }}</span>
              </template>
            </div>
            <div v-if="$checkAuth('/company_performance/sales_commission')">
              佣金(元)
              <span class="primary">{{
                statisticInfo.sales_position_commission
              }}</span>
            </div>
          </div>
          <div class="item-block">
            <div>
              承保保费总计(元)
              <span class="primary">{{
                statisticInfo.actual_underwrite_total_premium
              }}</span>
            </div>
            <div>
              有效出单件数
              <span>{{ statisticInfo.actual_underwrite_total_count }}</span>
            </div>
            <div>
              保费件均(元)
              <span>{{ statisticInfo.actual_underwrite_average_premium }}</span>
            </div>
          </div>
          <div class="item-block">
            <div>
              净收保费(元)
              <span class="primary">{{ statisticInfo.actual_premium }}</span>
            </div>
            <div>
              投保保费总计(元)
              <span class="primary">{{ statisticInfo.total_premium }}</span>
            </div>
            <div>
              人核中保费(元)
              <span style="color: #09ba08">{{
                statisticInfo.manpower_underwriting_total_premium
              }}</span>
            </div>
            <div>
              人核中件数
              <span style="color: #09ba08">{{
                statisticInfo.manpower_underwriting_total_quantity
              }}</span>
            </div>
            <div>
              未支付保费总计(元)
              <span class="warning">{{
                statisticInfo.unpaid_total_premium
              }}</span>
            </div>
            <div>
              犹退保费总计(元)
              <span class="danger">{{
                statisticInfo.hesitation_surrender_premium
              }}</span>
            </div>
            <div>
              退保保费总计(元)
              <span class="danger">{{ statisticInfo.surrender_premium }}</span>
            </div>
          </div>
          <div class="item-block">
            <div>
              犹退件数
              <span>{{ statisticInfo.hesitation_surrender_count }}</span>
            </div>
            <div>
              犹退件均(元)
              <span>{{
                statisticInfo.average_hesitation_surrender_premium
              }}</span>
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
              <span>{{
                statisticInfo.average_non_hesitation_surrender_premium
              }}</span>
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
      <div class="table-header">
        公司业绩
        <el-button
          size="small"
          type="primary"
          class="fr"
          :loading="exporting"
          icon="iconfont iconxiao16_xiazai mr4"
          v-if="$checkAuth('/company_performance/export')"
          @click="policyExport"
          >导出数据</el-button
        >
      </div>
      <el-table
        :data="list"
        border
        stripe
        v-loading="tableLoading"
        ref="table"
        :row-style="rowStyleFormat"
        :height="tableMaxHeight"
      >
        <el-table-column
          label="团队"
          prop="sales_team_name"
          align="center"
          width="120px"
          fixed="left"
        ></el-table-column>
        <el-table-column
          label="出单人"
          prop="sales_real_name"
          align="center"
          width="120px"
          fixed="left"
        ></el-table-column>
        <el-table-column
          label="保险公司"
          prop="supplier_name"
          align="center"
          width="250px"
        ></el-table-column>
        <el-table-column
          label="产品名称"
          prop="product_name"
          align="center"
          width="250px"
        ></el-table-column>
        <el-table-column
          label="保额(元)"
          prop="guarantee_quota_str"
          align="center"
        ></el-table-column>
        <el-table-column
          label="保费(元)"
          prop="actually_premium"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="缴费期限"
          prop="payment_period_desc"
          align="center"
        ></el-table-column>
        <el-table-column
          label="保障期限"
          prop="guarantee_period_desc"
          align="center"
        ></el-table-column>
        <el-table-column
          label="投保时间"
          prop="proposal_at_str"
          width="170px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="承保时间"
          prop="policy_at_str"
          width="170px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="投保人"
          prop="policy_holder_basic_info_str"
          width="180px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="被保人"
          prop="recognizee_basic_info"
          width="180px"
          align="center"
        >
          <template slot-scope="{ row }">
            <div
              v-for="(item, index) in row.recognizee_basic_info"
              :key="index"
            >
              {{ item.basic_info }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="保单号"
          prop="policy_sn"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="订单号"
          prop="order_no"
          align="center"
          width="210px"
        ></el-table-column>
        <el-table-column
          label="保单状态"
          prop="policy_status_str"
          align="center"
        ></el-table-column>
        <el-table-column align="center" width="80" label="人核状态">
          <template v-slot="{ row }">
            <el-popover
              v-if="row.policy_manpower_underwriting"
              placement="top"
              width="350"
              trigger="hover"
            >
              <div
                class="mb5"
                v-if="
                  row.policy_manpower_underwriting &&
                    row.policy_manpower_underwriting.status == 0
                "
              >
                <b>人核状态</b>：审核中
              </div>
              <div
                class="mb5"
                v-else-if="
                  row.policy_manpower_underwriting &&
                    row.policy_manpower_underwriting.status == 1
                "
              >
                <b>人核状态</b>：审核通过
              </div>
              <div
                class="mb5"
                v-else-if="
                  row.policy_manpower_underwriting &&
                    row.policy_manpower_underwriting.status == 2
                "
              >
                <b>人核状态</b>：审核失败
              </div>
              <div class="mb5">
                <b>人核结论</b>：{{
                  row.policy_manpower_underwriting &&
                  row.policy_manpower_underwriting.result_str
                    ? row.policy_manpower_underwriting.result_str
                    : "-"
                }}
              </div>
              <div class="mb5">
                <b>结论详情</b>：{{
                  row.policy_manpower_underwriting &&
                  row.policy_manpower_underwriting.conclusion
                    ? row.policy_manpower_underwriting.conclusion
                    : "-"
                }}
              </div>
              <div class="mb5">
                <b>申请时间</b>：{{
                  row.policy_manpower_underwriting &&
                  row.policy_manpower_underwriting.add_time
                    ? formatYYMMDD(
                        row.policy_manpower_underwriting.add_time * 1000,
                        "-"
                      )
                    : "-"
                }}
              </div>
              <div class="mb5">
                <b>结论时间</b>：{{
                  row.policy_manpower_underwriting &&
                  row.policy_manpower_underwriting.verify_at
                    ? formatYYMMDD(
                        row.policy_manpower_underwriting.verify_at * 1000,
                        "-"
                      )
                    : "-"
                }}
              </div>
              <div class="mb5">
                <b>过期时间</b>：{{
                  row.policy_manpower_underwriting &&
                  row.policy_manpower_underwriting.expire_at
                    ? formatYYMMDD(
                        row.policy_manpower_underwriting.expire_at * 1000,
                        "-"
                      )
                    : "-"
                }}
              </div>
              <span slot="reference">{{
                row.policy_manpower_underwriting.status_str
              }}</span>
            </el-popover>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="回访状态"
          prop="visit_status_str"
          align="center"
        ></el-table-column>
        <el-table-column
          label="回访日期"
          prop="visit_at_str"
          width="170px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="过犹日期"
          prop="over_hesitation_at_str"
          width="170px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否犹退"
          prop="is_hesitate_surrender_str"
          align="center"
        ></el-table-column>
        <el-table-column
          label="服务费(元)"
          prop="company_actually_commission"
          align="center"
          width="100px"
          v-if="$checkAuth('/company_performance/company_commission')"
        ></el-table-column>
        <el-table-column
          label="佣金(元)"
          prop="sales_position_commission"
          align="center"
          width="100px"
          v-if="$checkAuth('/company_performance/sales_commission')"
        ></el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="150px"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-link
              v-if="$checkAuth('/company_performance/detail')"
              type="primary"
              @click="showInfoDialog(row)"
              class="mr8"
              >订单详情</el-link
            >
            <el-link
              v-if="$checkAuth('/achievement-company/policy/transfer_policy')"
              type="primary"
              @click="showBelongDialog(row)"
              >修改归属</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 20211118 修改分页方式 去除无限滚动 -->
      <div class="table-pagination" v-if="list.length > 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="page_size"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <Rank
      class="scroll-box"
      :keywords="rankKeywords"
      v-if="tabIndex === 'rank'"
      ref="rank"
    ></Rank>
    <Statistics
      class="scroll-box"
      :keywords="statisticsKeywords"
      v-if="tabIndex === 'statistics'"
      ref="statistics"
    ></Statistics>
    <edit-modal
      :show.sync="belongVisible"
      :belongData="belongData"
      @update="searchModelChange"
    ></edit-modal>
  </div>
</template>

<script>
import EditModal from "./modal/edit";
import {
  getCompanyPolicyList,
  getCompanyPolicyStatistics,
  getSalesData,
  getSalesTeamData,
  getDateRange,
  exportCompanyPolicy,
} from "@/apis/modules/achievement";
import { getAllProducts, getSupplierList } from "@/apis/modules/index";
import {
  formatDate,
  dateStr2Timestamp,
  formatYYMMDD,
} from "@/utils/formatTime";
import { debounce, downloadFrameA } from "@/utils";
import qs from "qs";
import {
  policyStatusArray,
  insuranceTypeArray,
  manualReview,
} from "@/enums/common";
import { visitStatus, visitStatusArray } from "@/enums/achievement";
import FilterShell, { hasValue } from "@/components/filters/filter-shell";
import scrollMixin from "../scrollMixin"; // 统计数据滚动事件混入
import orderListMixin from "@/mixins/order-list-mixin";
import Rank from "./tabs/rank";
import Statistics from "./tabs/statistics";

// 业绩-订单
export default {
  name: "order",
  mixins: [scrollMixin, orderListMixin],
  components: {
    EditModal,
    FilterShell,
    Rank,
    Statistics,
  },
  data() {
    return {
      tabIndex: "order",
      formatDate,
      filterValue: false,
      belongVisible: false,
      belongData: {},
      list: [],
      page: 1,
      page_size: 20,
      total: 0,
      rankKeywords: "",
      statisticsKeywords: "",
      policyStatusArray,
      manualReview,
      insuranceTypeArray,
      visitStatus,
      visitStatusArray,
      productList: [],
      salesList: [],
      salesTeamList: [],
      supplierList: [],
      companyList: [],
      dateRange: [],
      statisticInfo: {},
      tableLoading: true,
      statisticLoading: true,
      scrol2Lvisible: false,
      scrol2Rvisible: false,
      exporting: false,
      scrollTranslateX: 0,
      searchModel: {
        keyword: "",
        policy_status: [],
        products: [],
        supplier_id: [],
        product_insurance_class: [],
        date_range: [+new Date(), +new Date()],
        sales_id: [],
        sales_team_id: [],
        include_child_team: "0",
        visit_status: [],
        manpower_underwriting_status: "",
      },
      tableMaxHeight: null,
    };
  },
  mounted() {
    // this.setTableMaxHeight();
  },
  methods: {
    searchStatistics () {
      this.$refs.statistics.searchModelChange();
    },
    searchRank () {
      this.$refs.rank.searchModelChange();
    },
    // 分页
    handleCurrentChange(v) {
      this.tableLoading = true;
      this.page = v;
      this.getCompanyPolicyList();
      this.getCompanyPolicyStatistics();
    },
    formatYYMMDD,
    tabChange() {
      Object.assign(this.searchModel, {
        keyword: "",
        policy_status: [],
        products: [],
        supplier_id: [],
        product_insurance_class: [],
        date_range: [+new Date(), +new Date()],
        sales_id: [],
        sales_team_id: [],
        include_child_team: "0",
      });
      this.rankKeywords = "";
      this.statisticsKeywords = "";

      if (this.tabIndex === "order") {
        this.tableLoading = true;
        this.statisticLoading = true;
        this.getCompanyPolicyList();
        this.getCompanyPolicyStatistics();
      }
    },
    policyExport() {
      const url = `${exportCompanyPolicy}?${qs.stringify({
        ...this.searchModelFormat(true),
      })}`;
      this.exporting = true;
      downloadFrameA(
        url,
        `订单数据-${formatDate(new Date(), "yyyy-MM-dd")}.xlsx`,
        "get",
        true
      )
        .then(() => {
          // this.$message.success('导出成功')
        })
        .finally(() => {
          this.exporting = false;
        });
    },
    dateSelect(date) {
      const start = dateStr2Timestamp(date.start);
      const end = dateStr2Timestamp(date.end);
      if (!start && !end) {
        this.searchModel.date_range = "";
      } else {
        this.searchModel.date_range = [
          dateStr2Timestamp(date.start),
          dateStr2Timestamp(date.end),
        ];
      }
      this.searchModelChange();
    },
    scroll2Bottom() {
      const { page, page_size, total } = this;
      if (page * page_size < total) {
        this.tableLoading = true;
        this.page += 1;
        this.getCompanyPolicyList();
        this.getCompanyPolicyStatistics();
      }
    },
    filterListConfirm() {
      this.searchModelChange();
    },
    searchModelChange() {
      const func = debounce(() => {
        this.tableLoading = true;
        this.statisticLoading = true;
        this.page = 1;
        this.total = 0;
        this.statisticInfo = {};
        // 重置滚动条
        this.$refs.table.$el
          .querySelector(".el-table__body-wrapper")
          .scrollTo(0, 0);
        this.getCompanyPolicyList();
        this.getCompanyPolicyStatistics();
      }, 300);
      func();
      this.searchModelChange = func;
    },
    hasValue,
    showInfoDialog(row) {
      // 20210525 LiuZicong 改为传订单号order_no
      let routeUrl = this.$router.resolve(
        `/achievement-company/detail/${row.order_no}`
      );
      window.open(routeUrl.href, "_blank");

      // let routeUrl = this.$router.resolve(
      //   `/achievement-company/detail/${row.id}`
      // )
      // window.open(routeUrl.href, '_blank')
      // this.$router.push({ path: `/achievement-company/detail/${row.id}` })
    },
    showBelongDialog(row) {
      this.belongData = row;
      this.belongVisible = true;
    },
    searchModelFormat() {
      const model = { ...this.searchModel };
      Object.keys(model).forEach((key) => {
        const cur = model[key];
        if (key === "date_range") {
          const [start, end] = model.date_range;
          model.proposal_at_start = start ? formatDate(start, "yyyyMMdd") : "";
          model.proposal_at_end = end ? formatDate(end, "yyyyMMdd") : "";
        } else if (Array.isArray(cur)) {
          model[key] = model[key].join(",");
        }
      });
      // 没有选择团队删除包含子团队参数
      if (model.sales_team_id.length <= 0) {
        delete model.include_child_team;
      }
      delete model.date_range;
      return model;
    },
    getCompanyPolicyList() {
      const { page, page_size } = this;
      getCompanyPolicyList({ ...this.searchModelFormat(), page, page_size })
        .then((res) => {
          this.tableLoading = false;
          // this.list = this.page === 1 ? res.data : [...list, ...res.data];
          this.list = res.data;
          this.total = res.total;
        })
        .catch(() => {
          this.page = Math.max(1, page - 1);
          if (this.page === 1) {
            this.list = [];
            this.total = 0;
          }
          this.tableLoading = false;
        });
    },
    getCompanyPolicyStatistics() {
      getCompanyPolicyStatistics(this.searchModelFormat())
        .then((res) => {
          this.statisticInfo = res;
          this.statisticLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.statisticLoading = false;
        });
    },
    getSalesData() {
      getSalesData()
        .then((res) => {
          this.salesList = res;
        })
        .catch((err) => console.log(err));
    },
    getSalesTeamData() {
      getSalesTeamData()
        .then((res) => {
          this.salesTeamList = res;
        })
        .catch((err) => console.log(err));
    },
    getAllProducts() {
      getAllProducts()
        .then((res) => {
          this.productList = res;
        })
        .catch((err) => console.log(err));
    },
    getSupplierList() {
      getSupplierList()
        .then((res) => {
          this.supplierList = res;
        })
        .catch((err) => console.log(err));
    },
    getDateRange() {
      getDateRange().then((res) => {
        this.dateRange = res;
        // 确定表格top值, 可以计算表格最高度
        this.$nextTick(() => {this.calcTableHeight()});
      });
    },
  },
  watch: {
    belongVisible(v) {
      if (!v) {
        this.belongData = {};
      }
    },
    "searchModel.sales_team_id"(v) {
      if (v.length <= 0) {
        this.searchModel.include_child_team = "0";
      }
    },
  },
  created() {
    this.getCompanyPolicyList();
    this.getCompanyPolicyStatistics();
    this.getSalesData();
    this.getDateRange();
    this.getSalesTeamData();
    this.getAllProducts();
    this.getSupplierList();
  },
};
</script>
<style lang="scss" scoped>
@import "../index.scss";
</style>
