<template>
  <div class="prospectus-container page-container">
    <div class="header">
      <common-tabs-header
        v-model="curTabIdx"
        :data="tabsData"
      ></common-tabs-header>
      <el-input
        style="margin-left:10px"
        type="primary"
        v-model="keyword"
        placeholder="请输入"
        clearable
        @input="search"
        size="small"
      >
        <filter-shell
          v-model="type"
          slot="prepend"
          class="keyword-type-filter"
          autoFocus
          autoClose
          :clearable="false"
        >
          <el-select
            v-model="type"
            filterable5
            style="width: 100%"
            @change="keyword = ''"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              :key="index"
              v-for="(item, index) in keywordType"
            ></el-option>
          </el-select>
          <template v-slot:label>
            <span>{{
              keywordType.find((item) => item.value === type).label
            }}</span>
          </template>
        </filter-shell>
      </el-input>
      <div class="proposal-1">
        <filter-shell
          style="margin-left:10px"
          v-model="dateRange"
          :width="385"
          class="date-range-filter"
          @input="handleDateChange"
          autoFocus
          autoClose
          :textOverflow="false"
          :collapse="false"
        >
          <el-date-picker
            type="daterange"
            v-model="dateRange"
            @change="handleDateChange"
            clearable
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <template v-slot:label>
            <span>{{
              hasValue(dateRange)
                ? `${dateRange[0]} ~ ${dateRange[1]}`
                : "全部时间范围"
            }}</span>
          </template>
        </filter-shell>
      </div>
      <div class="proposal-1">
        <filter-shell
          v-model="searchForm.sales_id"
          autoFocus
          @input="handlesalesChange"
        >
          <el-select
            class="block"
            v-model="searchForm.sales_id"
            clearable
            filterable
            placeholder="请选择"
            @change="handlesalesChange"
          >
            <el-option
              v-for="item in salesList"
              :key="item.id"
              :label="item.real_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <template v-slot:label>{{
            hasValue(searchForm.sales_id)
              ? salesList.find((i) => i.id === searchForm.sales_id).real_name
              : "创建人员"
          }}</template>
        </filter-shell>
      </div>
    </div>
    <div class="content" ref="content">
      <div class="flex-between flex" style="margin-bottom:10px">
        <!-- <div style=""></div>
        <div class="flex">
          <el-tooltip placement="bottom" content="计划书个人展示">
            <div @click="editUserInfo" class="avatar mr16">
              <img :src="userHeadImg" class="avatar-image" />
            </div>
          </el-tooltip>
          <el-button
            v-if="checkAddProposal"
            type="primary"
            @click="addProposal"
            size="small"
            ><i class="iconfont iconxiao16_jiahao mr4"></i>新建计划书</el-button
          >
        </div> -->
      </div>
      <el-table
        v-loading="loading"
        border
        :data="data"
        :max-height="maxHeight"
      >
        <el-table-column
          label="计划书名称"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="{ row }">
            <el-tag
              :type="
                row.status === proposalStatusMap.done.value ? 'minor' : 'danger'
              "
              >{{ proposal_status[row.status] }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="所属客户"
          prop="customer_name"
          align="center"
        ></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="{ row }">
            <span v-if="curTabIdx.includes('guarantee-pane')">{{
              row.created_at
            }}</span>
            <span v-else-if="curTabIdx.includes('deposit-pane')">{{
              row.add_time_format
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人员"
          prop="sales_realname"
          align="center"
        ></el-table-column>
        <el-table-column
          label="被保人"
          prop="recognizee_policies_text"
          align="center"
        ></el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="240px" align="center">
          <template v-slot="{ row, index }">
            <template v-if="row.status === proposalStatusMap.done.value">
              <el-link
                v-if="checkPDF"
                type="primary"
                class="mr8"
                @click="checkMaterial(row)"
                >查看PDF计划书</el-link
              >
              <!-- <el-link
                v-if="checkCopyProposal"
                type="primary"
                class="mr8"
                @click="copyProposal(row)"
                >复制</el-link
              > -->
              <el-link
                v-if="checkh5"
                type="primary"
                class="mr8"
                @click="checkInfo(row, index)"
                >查看h5计划书</el-link
              >
            </template>
            <!-- <template v-else>
              <el-link
                v-if="checkEditProposal"
                type="primary"
                @click="editProposal(row)"
                >编辑计划书</el-link
              >
            </template> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 20211118 修改分页方式 去除无限滚动 -->
      <div class="table-pagination" v-if="data.length > 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-size="searchForm.limit"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <div
      class="new-preview-wrapper"
      v-if="previewVisible"
      @click="previewHandleClose"
    >
      <div class="new-preview-dialog">
        <iframe
          class="new-preview-iframe"
          :src="previewUrl"
          frameborder="0"
        ></iframe>
      </div>
    </div>
    <user-info-modal
      :show.sync="isUserInfoModalShow"
      :userInfo="userInfo"
      @fresh="ajaxUserInfo"
    ></user-info-modal>
    <proposal-material
      v-if="isProposalMaterialShow"
      :show.sync="isProposalMaterialShow"
      :proposalInfo="proposalInfo"
      :is-deposit="isDeposit"
      title="计划书材料"
    ></proposal-material>
    <add-member-struct
      :show.sync="isAddProposal"
      :is-deposit="isDeposit"
    ></add-member-struct>
  </div>
</template>
<script>
import FilterShell, {
  clearValue,
  hasValue,
} from "@/components/filters/filter-shell";
import CommonTabsHeader from "./modal/tabs-header";
import UserInfoModal from "./modal/user-info";
import { getSalesData } from "@/apis/modules/achievement";
import ProposalMaterial from "./modal/proposal-material";
import AddMemberStruct from "./modal/add-member-struct";
import { debounce } from "@/utils";
import { proposal_status, proposalStatusMap } from "@/enums/merchandising";
import {
  getProposalListAll,
  getProposalMasterInfo,
  getDepositProposalListAll,
  copyProposalFamily,
} from "@/apis/modules/proposal";
export default {
  name: "prospectus",
  components: {
    UserInfoModal,
    ProposalMaterial,
    AddMemberStruct,
    FilterShell,
    CommonTabsHeader,
  },
  data() {
    return {
      fetchIndex: 0,
      salesList: [],
      proposal_status: Object.freeze(proposal_status),
      proposalStatusMap: Object.freeze(proposalStatusMap),
      isUserInfoModalShow: false,
      isProposalMaterialShow: false,
      previewVisible: false,
      isAddProposal: false,
      loading: false,
      previewUrl: "",
      userInfo: {},
      userHeadImg: "",
      proposalInfo: {},
      keyword: "",
      keywordType: Object.freeze([
        { value: "name", label: "计划书名称" },
        { value: "proposal_product_name", label: "产品名称" },
        { value: "customer_name", label: "所属客户" },
      ]),
      data: [],
      type: "name",
      dateRange: null,
      searchForm: {
        page: 1,
        limit: 20,
        start_created_at: "",
        end_created_at: "",
        sales_id: "",
      },
      total: 0,
      maxHeight: null,
      paramsChanged: false,
      curTabIdx: "",
      tabsData: [
        {
          name: "guarantee-pane",
          label: "保障计划书",
          permission: "/proposal/all_list_with_page",
        },
        {
          name: "deposit-pane",
          label: "储蓄计划书",
          permission: "/deposit-proposal/all-list-with-page",
        },
      ],
      isDeposit: false,
    };
  },
  methods: {
    // 分页
    handleCurrentChange(v) {
      this.searchForm.page = v;
      this.ajaxData();
    },
    clearValue,
    hasValue,
    getSalesData() {
      getSalesData()
        .then((res) => {
          this.salesList = res;
        })
        .catch((err) => console.log(err));
    },
    // 筛选日期change
    handleDateChange(v) {
      const [start = "", end = ""] = v || [];
      this.searchForm.start_created_at = start;
      this.searchForm.end_created_at = end;
      this.search();
    },
    handlesalesChange(v) {
      this.searchForm.sales_id = v;
      this.search();
    },
    editUserInfo() {
      this.isUserInfoModalShow = true;
    },
    addProposal() {
      this.isAddProposal = true;
    },
    checkInfo(item, index) {
      this.currentIndex = index;
      this.previewVisible = true;
      if (item.status === proposalStatusMap.hold.value) return;
      this.previewUrl = "";
      this.$nextTick(() => {
        this.previewUrl = item.view_url;
      });
    },
    copyProposal(item) {
      // console.log("this.isDeposit", this.isDeposit);
      this.loading = true;
      if (this.isDeposit) {
        let routeUrl = this.$router.resolve(
          `/proposal/proposal-operate${
            this.isDeposit ? "-deposit" : ""
          }?proposal_id=${item.id}&customer_id=${item.customer_id}`
        );
        this.loading = false;
        window.open(routeUrl.href, "_blank");
      } else {
        //   复制家庭成员
        //http://proxy.yun.beta.2239.com/agent/proxy/proposal/customer/copy-family?source_proposal_id=1&////proposal_type=safeguard_proposa
        copyProposalFamily({
          source_proposal_id: item.id,
          proposal_type: "safeguard_proposal",
        }).then((res) => {
          console.log(res);
          let routeUrl = this.$router.resolve(
            `/proposal/proposal-operate${
              this.isDeposit ? "-deposit" : ""
            }?proposal_id=${item.id}&customer_id=${
              item.customer_id
            }&family_struct_id=${res.id}`
          );
          this.loading = false;
          window.open(routeUrl.href, "_blank");
        });
      }
    },
    editProposal(item) {
      let routeUrl = this.$router.resolve(
        `/proposal/proposal-operate${
          this.isDeposit ? "-deposit" : ""
        }?proposal_id=${item.id}&customer_id=${item.customer_id}`
      );
      window.open(routeUrl.href, "_blank");
    },
    checkMaterial(item) {
      // this.isProposalMaterialShow = true;
      this.proposalInfo = item;
      window.open(
        `${process.env.VUE_APP_API_URL}/agent/proxy/${
          this.isDeposit
            ? `deposit-proposal/pdf/view-by-pcode`
            : `proposal/file/view/pdf`
        }?pcode=${item.pcode}`
      );
    },
    scroll2Bottom() {
      const { total, searchForm } = this;
      const { page, limit } = searchForm;
      if (page * limit < total) {
        searchForm.page += 1;
        this.ajaxData();
      }
    },
    previewHandleClose() {
      this.previewVisible = false;
    },
    ajaxUserInfo() {
      getProposalMasterInfo().then((res) => {
        this.userInfo = res;
        this.userHeadImg = res.avatar_url;
      });
    },
    ajaxData() {
      // 计划书接口较慢, 处理多次请求并发情况
      const idx = (this.fetchIndex += 1);
      this.loading = true;
      const { searchForm, keywordType, keyword, type } = this;
      const key = keywordType.find((item) => item.value === type).value;
      (this.isDeposit ? getDepositProposalListAll : getProposalListAll)({
        ...searchForm,
        [key]: keyword,
      })
        .then((res) => {
          // 当前不是最后一次请求或者最后一次请求结束
          if (idx < this.fetchIndex || !this.fetchIndex) return;
          // if (searchForm.page <= 1) {
            this.data = res.data;
          // } else {
          //   this.data = [...this.data, ...res.data];
          // }
          this.total = res.total;
        })
        .catch(() => {})
        .finally(() => {
          // 最后一次请求结束后重置参数
          if (idx === this.fetchIndex) {
            this.loading = false;
            this.fetchIndex = 0;
          }
        });
    },
    search: debounce(function() {
      this.searchForm.page = 1;
      this.total = 0;
      this.ajaxData();
    }, 300),
    onStorage(e) {
      e.key === "refreshPage" && this.search();
    },
    setTableMaxHeight: debounce(function() {
      this.maxHeight = this.$refs.content.offsetHeight - 80;
    }, 300),
  },
  created() {
    this.ajaxUserInfo();
    this.getSalesData();
    // this.ajaxData()
    window.addEventListener("storage", this.onStorage);
    window.addEventListener("resize", this.setTableMaxHeight);
  },
  mounted() {
    this.setTableMaxHeight();
  },
  beforeDestroy() {
    window.removeEventListener("storage", this.onStorage);
    window.removeEventListener("resize", this.setTableMaxHeight);
  },
  watch: {
    dateRange(v) {
      v = v || ["", ""];
      this.searchForm.start_created_at = v[0];
      this.searchForm.end_created_at = v[1];
    },
    curTabIdx(v) {
      this.searchForm.page = 1;
      this.isDeposit = v.includes("deposit");
      document.querySelector(".el-table__body-wrapper").scrollTo(0, 0);
      this.ajaxData();
    },
  },
  computed: {
    checkPDF() {
      // 团队保障计划书-查看PDF: /proposal/team-pdf
      // 团队保障计划书-查看H5:  /proposal/team-h5

      // 团队储蓄计划书-查看PDF: /deposit-proposal/team-pdf
      // 团队储蓄计划书-查看H5:  /deposit-proposal/team-h5

      // 所有保障计划书-查看PDF: /proposal/all-pdf
      // 所有保障计划书-查看H5:  /proposal/all-h5

      // 所有储蓄计划书-查看PDF: /deposit-proposal/all-pdf
      // 所有储蓄计划书-查看H5:  /deposit-proposal/all-h5
      console.log("111111", this.isDeposit)
      return this.isDeposit
        ? this.$checkAuth("/deposit-proposal/all-pdf")
        : this.$checkAuth("/proposal/all-pdf");
    },
    checkh5() {
      return this.isDeposit
        ? this.$checkAuth("/deposit-proposal/all-h5")
        : this.$checkAuth("/proposal/all-h5");
    },
  },
};
</script>

<style scoped lang="scss">
.prospectus-container {
  display: flex;
  padding: 0 20px 0 20px;
  flex-direction: column;

  & > .header {
    font-size: 16px;
    font-weight: bold;
    padding: 0 16px;
    height: 56px;
    background: #fff;
    border-radius: 4px 4px 0px 0px;
    // border: 1px solid #e6e6e6;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .el-input {
      width: 360px;
    }
    & > ::v-deep .el-input {
      .el-input-group__prepend {
        background: #fff;
        padding: 0 4px;
      }
      .el-input__inner {
        border-left: transparent;
        padding-left: 4px;
        &:focus {
          border-color: rgb(220, 223, 230);
        }
      }
    }
    ::v-deep .keyword-type-filter {
      padding-bottom: 0 !important;
      // .filter-item{
      //     margin: 0;
      //     height: 24px;
      //     line-height: 21px;
      //     width: 106px;
      //     font-weight: normal;
      //     display: flex !important;
      //     align-items: center;
      //     justify-content: center;
      //     &.actived{
      //         color:#1A1A1A;
      //         background: #f5f5f5;
      //         border-color: #e6e6e6;
      //     }
      // }
    }
    .proposal-1 ::v-deep .el-popover__reference-wrapper .filter-item {
      height: 32px;
      line-height: 21px;
    }
  }
  & > .content {
    background: #ffffff;
    padding: 0 16px;
    flex: 1;
    overflow: hidden;
    .filter-bar {
      display: flex;
      justify-content: space-between;
      height: 64px;
      padding-bottom: 0;
      align-items: center;
    }
    ::v-deep .el-scrollbar {
      flex: 1;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    ::v-deep .date-range-filter {
      .filter-popover {
        width: 385px;
      }
      .filter-item {
        margin: 0;
        font-weight: normal;
        display: flex !important;
        align-items: center;
        justify-content: center;
      }
    }
    .avatar {
      width: 32px;
      height: 32px;
      background-color: #f5f5f5;
      border: 1px solid #e6e6e6;
      border-radius: 50%;
      overflow: hidden;
      .avatar-image {
        width: 33px;
        height: 33px;
        transform: translate(-1px, -1px);
      }
    }
  }
  .new-preview-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 3001;
  }
  .new-preview-dialog {
    position: relative;
    margin: 0 auto 50px;
    margin-top: 3vh;
    width: 400px;
    height: 820px;
    background-color: #f5f5f5;
    border-radius: 8px;
    border: 12px solid #fff;
    // background: url(../../../assets/images/iPhone6.png) no-repeat;
    // background-size: contain;
  }
  .new-preview-dialog-close {
    position: absolute;
    right: -60px;
    top: 20px;
    width: 30px;
    height: 30px;
    background: url(../../../assets/images/proposal-close.png) no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .new-preview-iframe {
    position: absolute;
    // top: 106px;
    // left: 31px;
    width: 375px;
    height: 100%;
    cursor: cell;
  }
}
</style>
