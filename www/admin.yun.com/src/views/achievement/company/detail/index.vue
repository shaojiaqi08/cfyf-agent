<template>
  <div class="order-detail-container">
    <div class="header" id="pageHeader">
      订单详情
      <el-button
        type="primary"
        :loading="downloading"
        v-if="baseInfo.policy_file_url && $checkAuth('/order/download_policy_file')"
        icon="iconfont iconxiao16_shouqiangaozhi"
        @click="download(baseInfo.policy_file_url)"
      >
        <span class="ml4">下载电子保单</span>
      </el-button>
    </div>
    <div class="content" :style="{maxHeight: contentMaxHeight + 'px'}">
      <!--保单基本信息-->
      <template>
        <h3>保单基本信息</h3>
        <div class="item-block" v-loading="baseInfoLoading">
          <div class="item">
            <div class="label">保单号：</div>
            <div class="content">{{baseInfo.policy_sn||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">保险公司：</div>
            <div class="content">{{baseInfo.supplier_name||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">产品名称：</div>
            <div class="content">{{baseInfo.product_name||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">监管分类：</div>
            <div class="content">
              {{baseInfo.product ? (baseInfo.product.cbirc_category_str||'-')
              : (baseInfo.cps_product ? baseInfo.cps_product.cbirc_category_str : '-')}}
            </div>
          </div>
          <div class="item">
            <div class="label">起保日期：</div>
            <div
              class="content"
            >{{(baseInfo.policy_plan && baseInfo.policy_plan.guarantee_start_at) ? formatDate(baseInfo.policy_plan.guarantee_start_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
          </div>
          <div class="item">
            <div class="label">终保日期：</div>
            <div
              class="content"
            >{{(baseInfo.policy_plan && baseInfo.policy_plan.guarantee_end_at) ? formatDate(baseInfo.policy_plan.guarantee_end_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
          </div>
          <div class="item">
            <div class="label">基本保额(元)：</div>
            <div class="content">{{baseInfo.guarantee_quota||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">保障期限：</div>
            <div class="content">{{baseInfo.guarantee_period_desc||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">缴费期间：</div>
            <div class="content">{{baseInfo.payment_period_desc||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">保费(元)：</div>
            <div class="content">{{baseInfo.premium||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">订单号：</div>
            <div class="content">{{baseInfo.order_sn || '-'}}</div>
          </div>
          <div class="item">
            <div class="label">电子保单：</div>
            <div class="content">
              <el-link
                v-if="baseInfo.policy_file_url"
                type="primary"
                class="mr10"
                target="_blank"
                :href="baseInfo.policy_file_url"
                style="transform: translateY(-1.5px)"
              >下载</el-link>
            </div>
          </div>
          <div class="item">
            <div class="label">投保单号：</div>
            <div class="content">{{baseInfo.proposal_sn||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">投保时间：</div>
            <div class="content">{{baseInfo.proposal_at_str||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">退保时间：</div>
            <div
              class="content"
            >{{baseInfo.surrender_at ? formatDate(baseInfo.surrender_at * 1000, 'yyyy-MM-dd hh:mm:ss') : '-'}}</div>
          </div>
          <div class="item">
            <div class="label">退保类型：</div>
            <div class="content">{{baseInfo.surrender_type_str||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">出单渠道：</div>
            <div class="content">{{baseInfo.actually_sales_platform_str||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">保单状态：</div>
            <div class="content">{{baseInfo.policy_status_str||'-'}}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </template>

      <!--客户信息-->
      <template>
        <h3>客户信息</h3>
        <div v-loading="customerInfoLoading">
          <el-tabs v-model="tabIndex" lazy>
            <el-tab-pane label="投保人" name="1"></el-tab-pane>
            <el-tab-pane label="被保人" name="2"></el-tab-pane>
            <el-tab-pane label="受益人" name="3"></el-tab-pane>
          </el-tabs>
          <cust-info :data="customerInfo.policy_holder_info" v-if="tabIndex === '1'"></cust-info>
          <template
            v-for="(item, index) in customerInfo.policy_recognizee_policies"
            v-else-if="tabIndex === '2'"
          >
            <div :key="'policy_recognizee_policies' + index">
              <p style="color:#999;font-size: 14px">被保人{{index + 1}}：</p>
              <cust-info type="2" :data="item"></cust-info>
            </div>
          </template>
          <div
            v-for="(item, index) in customerInfo.policy_recognizee_policies"
            :key="'policy_recognizee_policies' + index"
            v-else
          >
            <div class="mb10 mt10">
              <span class="mr10" style="font-size: 14px">被保人{{index + 1}}的受益人类型</span>
              <el-radio-group :value="customerInfo.is_legal_beneficiary">
                <el-radio :label="2">指定受益人</el-radio>
                <el-radio :label="1">法定受益人</el-radio>
                <el-radio :label="3">被保人本人</el-radio>
              </el-radio-group>
            </div>
            <div
              class="pl10"
              :key="'policy_beneficiaries' + index"
              v-for="(item, index) in item.policy_beneficiaries"
            >
              <p style="color:#999;font-size: 14px">受益人{{index + 1}}：</p>
              <cust-info type="3" :data="item"></cust-info>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
      </template>

      <!--险种信息-->
      <template>
        <h3>险种信息</h3>
        <div v-loading="insuranceInfoLoading">
          <div class="item-block">
            <div class="item">
              <div class="label">计划方案：</div>
              <div class="content">-</div>
            </div>
            <div class="item">
              <div class="label">购买份数：</div>
              <div class="content">{{insuranceInfo.copies || '-'}}</div>
            </div>
            <div class="item">
              <div class="label">币种：</div>
              <div class="content">人民币</div>
            </div>
            <div class="item">
              <div class="label">产品系数：</div>
              <div class="content">{{insuranceInfo.product_coefficient || '-'}}</div>
            </div>
            <div class="item">
              <div class="label">年交系数：</div>
              <div class="content">{{insuranceInfo.product_pay_coefficient || '-'}}</div>
            </div>
            <div class="item">
              <div class="label">标保(元)：</div>
              <div class="content">{{insuranceInfo.standard_guarantee || '-'}}</div>
            </div>
          </div>
          <el-table class="mt20" border stripe :data="insuranceInfo.policy_product_insurances">
            <el-table-column label="险别" width="100px">
              <template v-slot="{row}">{{row.is_main === 1 ? '主险' : '附加险'}}</template>
            </el-table-column>
            <el-table-column label="险种名称" prop="name"></el-table-column>
            <el-table-column label="基本保额(元)" prop="guarantee_quota"></el-table-column>
            <el-table-column label="保费(元)" prop="premium"></el-table-column>
            <!--            <el-table-column label="实收金额" prop="premium"></el-table-column>-->
            <el-table-column label="份数" prop="copies"></el-table-column>
          </el-table>
          <div class="item-block" style="width: 40%;margin: 0 0 0 auto;justify-content: flex-end">
            <div class="item" style="width: auto;display: inline-flex;">
              <div class="label">总保费(元)：</div>
              <div class="content">{{insuranceInfo.total_premium||'-'}}</div>
            </div>
          </div>
        </div>
        <el-divider class="mt4"></el-divider>
      </template>

      <!--支付信息-->
      <template>
        <h3>支付信息</h3>
        <div class="item-block" v-loading="payInfoLoading">
          <div class="item">
            <div class="label">代收保费：</div>
            <div
              class="content"
            >{{(payInfo.pay_method != undefined && payInfo.pay_method !== '') ? (payInfo.pay_method > 0 ? '是' : '否') : '-'}}</div>
          </div>
          <div class="item">
            <div class="label">支付方式：</div>
            <div class="content">{{payInfoPayment.pay_channel_str||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">支付时间：</div>
            <div
              class="content"
            >{{payInfoPayment.pay_at ? formatDate(payInfoPayment.pay_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
          </div>
          <div class="item">
            <div class="label">支付状态：</div>
            <div class="content">{{payInfoPayment.pay_status_str||'-'}}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </template>

      <!--退款信息-->
      <template v-if="payInfoRefund">
        <h3>退款信息</h3>
        <div class="item-block" v-loading="payInfoLoading">
          <div class="item">
            <div class="label">退款金额：</div>
            <div class="content">{{payInfoRefund.refund_fee || '-'}}</div>
          </div>
          <div class="item">
            <div class="label">商户退款单号：</div>
            <div class="content">{{payInfoRefund.refund_sn||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">平台退款单号：</div>
            <div class="content">{{payInfoRefund.third_refund_sn||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">退款状态：</div>
            <div class="content">{{payInfoRefund.refund_status_str ||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">退款申请时间：</div>
            <div class="content">{{payInfoRefund.apply_at_str || '-'}}</div>
          </div>
          <div class="item">
            <div class="label">退款成功时间：</div>
            <div class="content">{{payInfoRefund.success_at_str || '-'}}</div>
          </div>
          <div class="item">
            <div class="label">退款失败原因：</div>
            <div class="content">{{payInfoRefund.refund_err_reason||'-'}}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </template>

      <!--销售信息-->
      <template>
        <h3>销售信息</h3>
        <div class="item-block" v-loading="salesInfoLoading">
          <div class="item">
            <div class="label">出单人：</div>
            <div class="content">{{salesInfo.sales_real_name||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">顾问：</div>
            <div class="content">{{salesInfo.adviser_real_name||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">所属团队：</div>
            <div class="content">{{salesInfo.sales_team_name||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">所属群：</div>
            <div class="content">{{salesInfo.group_name||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">关联客户：</div>
            <div class="content">{{salesInfo.name||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">微信昵称：</div>
            <div class="content">{{salesInfo.nickname||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">客户来源：</div>
            <div class="content">{{salesInfo.source_channel_str||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">客户类型：</div>
            <div
              class="content"
            >{{salesInfo.introduce_customer_id != undefined ? (salesInfo.introduce_customer_id > 0 ? '转介绍客户' : '普通客户') : '-' }}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </template>

      <!--回访信息-->
      <template>
        <h3>回访信息</h3>
        <div class="item-block" v-loading="visitInfoLoading">
          <div class="item">
            <div class="label">回访状态：</div>
            <div class="content">{{visitInfo.visit_status||'-'}}</div>
            <el-link
              v-if="visitInfo.visit_link != ''"
              type="primary"
              @click="copyLink(visitInfo.visit_link)"
            >复制回访链接</el-link>
          </div>
          <div class="item">
            <div class="label">回访时间：</div>
            <div
              class="content"
            >{{visitInfo.visit_at ? formatDate(visitInfo.visit_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
          </div>
          <div class="item">
            <div class="label">回访方式：</div>
            <div class="content">{{visitInfo.visit_way_name||'-'}}</div>
          </div>
          <div class="item">
            <div class="label">回访失败原因：</div>
            <div class="content">{{visitInfo.visit_ques_reason||'-'}}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </template>

      <!--关联保单信息-->
      <template>
        <h3>关联保单信息</h3>
        <div v-loading="relationInfoLoading">
          <div class="item-block" v-for="(item, index) in relationInfo" :key="index">
            <div class="item">
              <div class="label">关联保单{{index + 1}}：</div>
              <div class="content">{{item.policy_sn||'-'}}</div>
            </div>
            <div class="item">
              <div class="label">是投保人的：</div>
              <div
                class="content"
              >{{(item.policy_recognizee_policies && item.policy_recognizee_policies[0]) ? item.policy_recognizee_policies[0].relation_str : '-'}}</div>
            </div>
            <div class="item">
              <div class="label">被保人：</div>
              <div class="content">{{item.recognizee_name_str||'-'}}</div>
            </div>
          </div>
          <div
            v-if="relationInfo.length === 0 && !relationInfoLoading"
            class="flex-center"
            style="color: #999"
          >暂无数据</div>
        </div>
        <el-divider></el-divider>
      </template>

      <!--续保信息-->
      <template>
        <h3>{{renewalInfo.renewal_terms ? '续期' : '续保'}}信息</h3>
        <div v-loading="renewalInfoLoading">
          <template v-if="renewalInfo.renewal_insurance">
            <div class="item-block">
              <div class="item">
                <div class="label">上年保单号：</div>
                <div class="content">{{renewalInfo.renewal_insurance.policy_sn||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">续保状态：</div>
                <div class="content">{{renewalInfo.renewal_insurance.renewal_status_name||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">续保保单号：</div>
                <div class="content">{{renewalInfo.renewal_insurance.next_policy_sn||'-'}}</div>
              </div>

              <div class="item">
                <div class="label">预期保费(元)：</div>
                <div class="content">{{renewalInfo.renewal_insurance.predict_premium||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">实际保费(元)：</div>
                <div class="content">{{renewalInfo.renewal_insurance.premium||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">续保时间：</div>
                <div
                  class="content"
                >{{renewalInfo.renewal_insurance.renewal_at ? formatDate(renewalInfo.renewal_insurance.renewal_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
              </div>
              <div class="item">
                <div class="label">应续日期：</div>
                <div
                  class="content"
                >{{renewalInfo.renewal_insurance.renewal_date ? formatRenewalDate(renewalInfo.renewal_insurance.renewal_date) : '-'}}</div>
              </div>
              <div class="item">
                <div class="label">宽限期满日期：</div>
                <div
                  class="content"
                >{{renewalInfo.renewal_insurance.grace_end_at ? formatDate(renewalInfo.renewal_insurance.grace_end_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
              </div>
              <div class="item">
                <div class="label">续保失败原因：</div>
                <div class="content">{{renewalInfo.renewal_insurance.fail_reason||'-'}}</div>
              </div>
              <div class="item" v-if="renewalInfo.renewal_insurance.renewal_url">
                <div class="label">续保链接：</div>
                <div class="content">
                  <el-link
                    type="primary"
                    @click="copyLink(renewalInfo.renewal_insurance.renewal_url)"
                  >复制</el-link>
                </div>
              </div>
            </div>
          </template>
          <template v-if="renewalInfo.renewal_terms">
            <el-table :data="renewalInfo.renewal_terms" style="margin-top: 10px" border stripe>
              <el-table-column label="缴费期数" prop="stage"></el-table-column>
              <el-table-column label="应缴日期">
                <template
                  v-slot="{row}"
                >{{row.renewal_date ? formatRenewalDate(row.renewal_date) : '-'}}</template>
              </el-table-column>
              <el-table-column label="宽限期满日期">
                <template
                  v-slot="{row}"
                >{{row.grace_end_at ? formatDate(row.grace_end_at * 1000, 'yyyy-MM-dd') : '-'}}</template>
              </el-table-column>
              <el-table-column label="期缴保费(元)" prop="premium"></el-table-column>
              <el-table-column label="预期保费(元)" prop="predict_premium"></el-table-column>
              <el-table-column label="续保状态" prop="renewal_status_name"></el-table-column>
              <el-table-column label="续期失败原因" prop="fail_reason"></el-table-column>
              <el-table-column label="实缴日期">
                <template
                  v-slot="{row}"
                >{{row.renewal_at ? formatDate(row.renewal_at * 1000, 'yyyy-MM-dd') : '-'}}</template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </template>

      <el-dialog
        title="续期信息"
        :visible.sync="renewalDialogVisible"
        @close="renewalDialogVisible = false"
        append-to-body
      >
        <el-table :data="renewalInfo.renewal_terms" border stripe>
          <el-table-column label="缴费期数" prop="stage"></el-table-column>
          <el-table-column label="缴费周期"></el-table-column>
          <el-table-column label="应缴日期" prop="renewal_date"></el-table-column>
          <el-table-column label="宽限期满日期" prop="grace_end_at"></el-table-column>
          <el-table-column label="期缴保费(元)" prop="premium"></el-table-column>
          <el-table-column label="预期保费(元)" prop="predict_premium"></el-table-column>
          <el-table-column label="续保状态" prop="renewal_status_name"></el-table-column>
          <el-table-column label="续期失败原因" prop="fail_reason"></el-table-column>
          <el-table-column label="实缴日期" prop="renewal_at"></el-table-column>
        </el-table>
        <span slot="footer">
          <el-button @click="renewalDialogVisible=false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  // getManagementPolicyDetail,
  // getPolicyFile,
  getPolicyBase,
  getPolicyHolder,
  getPolicyInsurances,
  getPolicyPayment,
  getPolicySales,
  getPolicyVisit,
  getPolicyChildren,
  getPolicyRenewal,
} from '@/apis/modules/achievement'
import { formatDate } from '@/utils/formatTime'
import custInfo from '@/views/achievement/company/component/cust-info'

export default {
  name: 'order-detail',
  components: {
    custInfo,
  },
  data() {
    return {
      policyInfo: {},
      payInfo: {},
      baseInfo: {},
      baseInfoLoading: false,
      tabIndex: '1',
      downloading: false,
      contentMaxHeight: null,
      customerInfoLoading: false,
      insuranceInfoLoading: false,
      salesInfoLoading: false,
      payInfoLoading: false,
      visitInfoLoading: false,
      relationInfoLoading: false,
      renewalDialogVisible: false,
      renewalInfoLoading: false,
      salesInfo: {},
      customerInfo: {
        policy_holder_info: {},
        policy_recognizee_policies: [],
        policy_payment: {},
      },
      relationInfo: [],
      insuranceInfo: {
        policy_product_insurances: [],
      },
      renewalInfo: {
        renewal_insurance: {},
        renewal_terms: [],
      },
      payInfoPayment: {},
      payInfoRefund: {},
      visitInfo: {},
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    formatDate,
    download(url) {
      window.open(url)
      // this.downloading = true
      // const params = { order_no: this.$route.params.order_no }
      // getPolicyFile(params)
      //   .then((res) => {
      //     if (res.policy_file_url) {
      //       window.open(res.policy_file_url)
      //     }
      //   })
      //   .finally(() => (this.downloading = false))
    },
    init() {
      // 获取保单基本信息
      this.getPolicyBase_()
      // 获取客户信息
      this.getPolicyHolder_()
      // 获取险种信息
      this.getPolicyInsurances_()
      // 获取支付信息
      this.getPolicyPayment_()
      // 获取销售信息
      this.getPolicySales_()
      // 获取回访信息
      this.getPolicyVisit_()
      // 获取关联保单信息
      this.getPolicyChildren_()
      // 获取续保续期信息
      this.getPolicyRenewal_()

      // 设置高度
      this.setHeight()
      window.addEventListener('resize', this.setHeight)
    },
    setHeight() {
      const bodyHeight = document.body.clientHeight
      const headHeight = document
        .getElementById('pageHeader')
        .getBoundingClientRect()
      console.log('headHeight', headHeight)
      // pageHeader
      console.log(bodyHeight)
      // 视口-顶-margin-10预留
      this.contentMaxHeight = bodyHeight - headHeight.height - 40 - 60 - 10
    },
    copyLink(link) {
      this.$copyText(link).then(
        () => {
          this.$message.success('已复制到粘贴板')
        },
        (e) => {
          this.$message.error(e)
        }
      )
    },
    getPolicyRenewal_() {
      const obj = {
        order_no: this.$route.params.id,
      }
      this.renewalInfoLoading = true
      getPolicyRenewal(obj).then((res) => {
        const { renewal_insurance, renewal_terms } = res
        this.renewalInfo = {
          renewal_insurance: renewal_insurance,
          renewal_terms: renewal_terms,
        }
        this.renewalInfoLoading = false
      })
    },
    getPolicyChildren_() {
      const obj = {
        order_no: this.$route.params.id,
      }
      this.relationInfoLoading = true
      getPolicyChildren(obj).then((res) => {
        this.relationInfo = res
        this.relationInfoLoading = false
      })
    },
    getPolicyVisit_() {
      const obj = {
        order_no: this.$route.params.id,
      }
      this.visitInfoLoading = true
      getPolicyVisit(obj).then((res) => {
        this.visitInfo = {
          ...res,
          ...(res.policy_sales || {}),
          ...(res.policy_customer || {}),
        }
        this.visitInfoLoading = false
      })
    },
    getPolicySales_() {
      const obj = {
        order_no: this.$route.params.id,
      }
      this.salesInfoLoading = true
      getPolicySales(obj).then((res) => {
        this.salesInfo = {
          ...res,
          ...(res.policy_sales || {}),
          ...(res.policy_customer || {}),
        }
        this.salesInfoLoading = false
      })
    },
    getPolicyPayment_() {
      const obj = {
        order_no: this.$route.params.id,
      }
      this.payInfoLoading = true
      getPolicyPayment(obj).then((res) => {
        this.payInfo = res || {}
        this.payInfoPayment = res.policy_payment || {}
        this.payInfoRefund = res.policy_refund || null
        this.payInfoLoading = false
      })
    },
    getPolicyInsurances_() {
      // 获取险种信息
      const obj = {
        order_no: this.$route.params.id,
      }
      this.insuranceInfoLoading = true
      getPolicyInsurances(obj).then((res) => {
        this.insuranceInfo = res
        this.insuranceInfoLoading = false
      })
    },
    getPolicyHolder_() {
      // 获取保单基本信息
      const obj = {
        order_no: this.$route.params.id,
      }
      this.customerInfoLoading = true
      getPolicyHolder(obj).then((res) => {
        res.policy_holder_info.policy_renewal = res.policy_renewal || {}
        this.customerInfo = res
        this.customerInfoLoading = false
      })
    },
    getPolicyBase_() {
      // 获取客户信息
      const obj = {
        order_no: this.$route.params.id,
      }
      this.baseInfoLoading = true
      getPolicyBase(obj).then((res) => {
        this.policyInfo = res
        this.baseInfo = res
        this.baseInfoLoading = false
      })
    },
    copy() {
      this.$message.success('支付链接已复制到粘贴板')
    },
  },
}
</script>

<style scoped lang="scss">
.order-detail-container {
  background-color: #fff;
  width: 1200px;
  margin: 20px auto;
  border: 1px solid #e6e6e6;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    padding: 0 16px;
    height: 56px;
    line-height: 56px;
    background: #f5f5f5;
    border-radius: 4px 4px 0px 0px;
    border-bottom: 1px solid #e6e6e6;
  }
  .content {
    padding: 16px;
    overflow: auto;
    h4 {
      color: #1a1a1a;
      line-height: 24px;
      margin: 0 0 8px 0;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
      & > div {
        width: 25%;
        font-size: 14px;
        color: #4d4d4d;
        margin-bottom: 12px;
        line-height: 20px;
        & > span {
          color: #1a1a1a;
          margin-left: 8px;
          font-weight: bold;
        }
      }
    }
  }
}
.order-flex {
  display: flex;
  line-height: 24px;
  h4 {
    margin: 0 0 8px 0;
  }
  i {
    cursor: pointer;
    color: #40aaff;
  }
}
.item-block {
  display: flex !important;
  flex-wrap: wrap;
  margin-bottom: 16px;
  .item {
    width: 25%;
    box-sizing: border-box;
    display: flex;
    align-items: baseline;
    // margin: 10px 0;
    font-size: 14px;
    & > .label {
      width: 120px;
      text-align: right;
      box-sizing: border-box;
      padding-right: 5px;
    }
    & > .content {
      flex: 1;
      overflow: hidden;
      word-break: break-all;
      font-weight: 700;
    }
    &.one-line {
      width: 100%;
    }
  }
}
</style>
