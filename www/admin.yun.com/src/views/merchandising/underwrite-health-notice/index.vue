<template>
  <div class="health-notice-container page-container">
    <div class="header">
      <common-tabs-header v-model="tabIndex" :data="tabsData"></common-tabs-header>
    </div>
    <div class="content">
      <Component :is="tabIndex"></Component>
    </div>
  </div>
</template>
<script>
import UnderwriteSearch from './tab-panel/underwrite-search'
import HealthSearch from './tab-panel/health-search'
import UnderwriteRules from './tab-panel/underwrite-rules'
import UnderwriteContentRules from './tab-panel/underwriting-contents-rules'
import servicePreservation from './tab-panel/service-preservation'
import claimSettlement from './tab-panel/claim-settlement'
import CommonTabsHeader from '../../../components/common-tabs-header'
export default {
  name: 'underwrite-health-notice',
  components: {
    CommonTabsHeader,
    UnderwriteSearch,
    HealthSearch,
    UnderwriteRules,
    UnderwriteContentRules,
    servicePreservation,
    claimSettlement,
  },
  data() {
    return {
      tabIndex: '',
      tabsData: [
        {
          name: 'underwrite-rules',
          label: '投保规则',
          permission: '/underwrite-health-notice/underwrite_rule',
        },
        {
          name: 'health-search',
          label: '健告查询',
          permission: '/underwrite-health-notice/health_report_inquiry',
        },
        {
          name: 'underwrite-search',
          label: '智核查询',
          permission: '/underwrite-health-notice/underwriting',
        },
        {
          name: 'underwrite-content-rules',
          label: '核保规则',
          permission: '/underwrite-health-notice/underwrite_content_rule',
        },
        {
          name: 'service-preservation',
          label: '保全售后',
          permission: '/customer-service-product-list',
        },
        {
          name: 'claim-settlement',
          label: '理赔规则',
          permission: '/claim-settlement-product-list',
        },
      ],
      productName: '',
    }
  },
}
</script>

<style scoped lang="scss">
.health-notice-container {
  padding: 0 16px 0 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  ::v-deep .search-input {
    position: fixed;
    top: 66.5px;
    right: 32px;
    z-index: 2;
    width: 360px;
  }
  .header {
    padding-left: 16px;
    height: 56px;
    background: #f5f5f5;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #e6e6e6;
    position: relative;
    .el-button {
      position: absolute;
      top: 12px;
      right: 16px;
    }
  }
  .content {
    background-color: #fff;
    flex: 1;
    overflow: hidden;
    border: 1px solid #e6e6e6;
    border-top: transparent;
    box-sizing: border-box;
  }
}
</style>
