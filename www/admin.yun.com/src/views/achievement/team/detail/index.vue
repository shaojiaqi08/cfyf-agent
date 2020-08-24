<template>
  <div class="order-detail-container" v-loading="loading">
    <div class="header">订单详情</div>
    <div class="content">
      <h4>产品信息</h4>
      <div class="row">
        <div>
          出单平台
          <span>{{ policyInfo.actually_sales_platform_str || '-'}}</span>
        </div>
        <div>
          公司名
          <span>{{ policyInfo.supplier_name || '-' }}</span>
        </div>
        <div>
          产品名称
          <span>{{ policyInfo.product_name || '-' }}</span>
        </div>
      </div>
      <h4>保单信息</h4>
      <div class="row">
        <div>
          保单号
          <span>{{ policyInfo.policy_sn || '-' }}</span>
        </div>
        <div>
          投保单号
          <span>{{ policyInfo.proposal_sn || '-' }}</span>
        </div>
        <div>
          缴费期限
          <span>{{ policyInfo.payment_period_desc || '-' }}</span>
        </div>
        <div>
          保障期限
          <span>{{ policyInfo.guarantee_period_desc || '-' }}</span>
        </div>
        <div>
          保额(元)
          <span>{{ policyInfo.guarantee_quota_str || '-' }}</span>
        </div>
        <!-------------------------------->
        <div>
          保费(元)
          <span>{{ policyInfo.actually_premium || '-' }}</span>
        </div>
        <div>
          保单状态
          <span>{{ policyInfo.policy_status_str || '-' }}</span>
        </div>
        <div>
          投保时间
          <span>{{policyInfo.proposal_at_str || '-' }}</span>
        </div>
        <div>
          承保时间
          <span>{{ policyInfo.policy_at_str || '-' }}</span>
        </div>
        <!-------------------------------->
        <div>
          回访成功日期
          <span>{{policyInfo.visit_at_str || '-'}}</span>
        </div>
        <div>
          过犹日期
          <span>{{ policyInfo.over_hesitation_at_str || '-'}}</span>
        </div>
      </div>
      <h4>投被保人信息</h4>
      <div class="row">
        <div>
          投保人
          <span>{{ policyInfo.policy_holder_name || '-' }}</span>
        </div>
        <div>
          投保人手机号
          <span>{{ policyInfo.policy_holder_mobile || '-' }}</span>
        </div>
        <div>
          被保人
          <span>{{ policyInfo.policy_recognizee_name || '-' }}</span>
        </div>
        <div>
          被保人手机号
          <span>{{ policyInfo.policy_recognizee_mobile || '-' }}</span>
        </div>
      </div>
      <h4>销售信息</h4>
      <div class="row">
        <div>
          出单销售
          <span>{{ policyInfo.sales_real_name || '-' }}</span>
        </div>
        <div>
          销售团队
          <span>{{ policyInfo.sales_team_name || '-' }}</span>
        </div>
        <div>
          服务费(元)
          <span>{{ policyInfo.company_actually_commission || '-' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPolicyDetail } from '@/apis/modules/achievement'
import { formatDate } from '@/utils/formatTime'
export default {
  name: "order-detail",
  data() {
    return {
      loading: false,
      policyInfo: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    formatDate,
    init() {
      const { id } = this.$route.params
      this.loading = true
      getPolicyDetail({ id })
      .then(res => {
          this.policyInfo = res
      }).finally(() => {
        this.loading = false
      })
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../detail.scss';
</style>