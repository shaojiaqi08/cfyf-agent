<template>
  <div class="health-notice-container page-container">
    <div class="header">
      <common-tabs-header
        v-model="tabIndex"
        :data="tabsData"
      ></common-tabs-header>
    </div>
    <div class="content">
      <Component :is="tabIndex"></Component>
    </div>
  </div>
</template>
<script>
import Proposal from "../proposal/index.vue";
import ProposalTeam from "../proposal-team/index.vue";
import ProposalAll from "../proposal-all/index.vue";
import CommonTabsHeader from "../../../components/common-tabs-header";
export default {
  name: "underwrite-health-notice",
  components: {
    CommonTabsHeader,
    Proposal,
    ProposalTeam,
    ProposalAll,
  },
  data() {
    return {
      tabIndex: "",
      tabsData: [
        {
          name: "proposal",
          label: "个人计划书",
          permission: ["/proposal","/deposit-proposal/list-with-page"],
        },
        {
          name: "proposal-team",
          label: "团队计划书",
          permission: ["/proposal/team_list_with_page","/deposit-proposal/team-list-with-pag"],
        },
        {
          name: "proposal-all",
          label: "所有计划书",
          permission: ["/proposal/all_list_with_page","/deposit-proposal/all-list-with-page"],
        },
      ],
      productName: "",
    };
  },
};
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
