<template>
  <div class="order-detail-container">
    <div class="header">订单详情</div>
    <div class="content">
      <h4>产品信息</h4>
      <div class="row">
        <div>
          出单平台
          <span>{{ policyInfo.actually_sales_platform }}</span>
        </div>
        <div>
          公司名
          <span>{{ policyInfo.supplier_name }}</span>
        </div>
        <div>
          产品名称
          <span>{{ policyInfo.product_name }}</span>
        </div>
      </div>
      <h4>保单信息</h4>
      <div class="row">
        <div>
          保单号
          <span>{{ policyInfo.policy_sn }}</span>
        </div>
        <div>
          投保单号
          <span>{{ policyInfo.proposal_sn }}</span>
        </div>
        <div>
          缴费期限
          <span>{{ policyInfo.payment_period_desc }}</span>
        </div>
        <div>
          保障期限
          <span>{{ policyInfo.guarantee_quota_str }}</span>
        </div>
        <!-------------------------------->
        <div>
          保费(元)
          <span>{{ policyInfo.actually_premium }}</span>
        </div>
        <div>
          保单状态
          <span>{{ policyInfo.policy_status_str }}</span>
        </div>
        <div>
          支付状态
          <span>-</span>
        </div>
        <div>
          客户确认状态
          <span>-</span>
        </div>
        <!-------------------------------->
        <div>
          投保时间
          <span>{{ formatDate(policyInfo.proposal_at * 1000, 'yyyy-MM-dd hh:mm:ss') }}</span>
        </div>
        <div>
          承保时间
          <span>{{ formatDate(policyInfo.policy_at * 1000, 'yyyy-MM-dd hh:mm:ss') }}</span>
        </div>
        <div>
          确认时间
          <span>-</span>
        </div>
        <div>
          回访成功日期
          <span>-</span>
        </div>
        <!-------------------------------->
        <div>
          过犹日期
          <span>{{ formatDate(policyInfo.over_hesitation_at * 1000, 'yyyy-MM-dd hh:mm:ss') }}</span>
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
          佣金
          <span>{{ policyInfo.commission || '-' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getManagementPolicyDetail } from '@/apis/modules/achievement'
import { formatDate } from '@/utils/formatTime'
export default {
  name: "order-detail",
  data() {
    return {
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
      getManagementPolicyDetail({ id })
      .then(res => {
          this.policyInfo = res
      })
    }
  }
};
</script>

<style scoped lang="scss">
.order-detail-container {
  background-color: #fff;
  width: 1200px;
  margin: 20px auto;
  border: 1px solid #e6e6e6;
  .header {
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
    h4 {
      color: #1a1a1a;
      line-height: 24px;
      margin: 0 0 8px 0;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 24px;
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
</style>