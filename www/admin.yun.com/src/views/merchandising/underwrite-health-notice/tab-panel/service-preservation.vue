<template>
  <div class="underwriting-contents-rule">
    <i
      class="collapse-button"
      :class="{'el-icon-arrow-left': !collapse, 'el-icon-arrow-right' : collapse}"
      :style="`${collapse ? 'left: 18px;transform: translateX(0)' : null}`"
      @click="collapsePage"
    ></i>
    <div class="underwriting-all-rule-box">
      <div style="width: 280px" v-if="!collapse" class="underwriting-contents-rule-left underwrite-search-container">
        <el-form
          style="display: inline-block"
          inline
          :modal="formData"
          @submit.native.prevent
          class="search-form common-form border-bottom"
          label-position="right"
        >
          <el-radio-group v-model="formData.is_reverse" @change="search">
            <el-radio-button :label="0">正向条件</el-radio-button>
            <el-radio-button :label="1">反向条件</el-radio-button>
          </el-radio-group>
        </el-form>

        <!-- <el-radio-group
          size="mini"
          v-model="formData.is_reverse"
          @change="search"
          class="radio-group-wrap"
        >
          <el-radio-button
            style="height: 28px"
            v-for="(item, index) in isReverseData"
            :key="'normal' + index"
            :label="item.value"
          >{{ item.label }}</el-radio-button
          >
        </el-radio-group> -->
        <el-input
          placeholder="搜索产品名称"
          prefix-icon="el-icon-search"
          v-model.trim="formData.product_name"
          clearable
          @keyup.enter.native="search()"
        ></el-input>
        <div class="classify-box">
          <div style="margin-bottom:10px;">险种筛选</div>
          <div
            :class="['classify-item', {'active': item.isSelect}]"
            v-for="item in classifyList"
            :key="item.value"
            @click="selectItem(item)"
          >{{item.name}}</div>
        </div>
        <div class="underwriting-product-list">
          <el-scrollbar style="height:100%">
            <div
              v-for="(item,index) in tableData"
              :key="item.product_name + index"
              :class="['underwriting-product-item', {'active': item.id == (curProduct && curProduct.id)}]"
              @click="showDetail(item)"
            >{{item.product_name}}</div>
          </el-scrollbar>
        </div>
      </div>
      <div
        class="underwriting-contents-rule-right"
        v-loading="loading"
        ref="rightBox"
        :style="collapse ? 'margin-left: 16px; border-left: 1px solid #e6e6e6' : null"
      >
        <vxe-table
          :data="tableRightData"
          :height="tableHeight"
          :scroll-x="{enabled: false}"
          style="width: 100%"
          border
          :header-cell-style="rowCellStyle"
          :cell-style="rowCellStyle"
          class="main-table"
          ref="mainTable"
        >
          <vxe-table-column
            class-name="gray-column"
            fixed="left"
            width="200"
            align="center"
            field="name"
            title="产品名称"
          ></vxe-table-column>
          <vxe-table-column
            class-name="gray-column"
            v-for="(item, index) in columnsData"
            :key="index"
            width="480"
            align="center"
            field="name"
            :title="item.product_name"
          >
            <!-- <template v-slot="{ row }">
              <span v-html="columnsData[index][row.key] || '-'"></span>
            </template>-->
            <template v-slot="{ row }">
              <div
                :class="[{'left-alignment': columnsData[index][row.key].length > 50}]"
              >{{columnsData[index][row.key] || '-'}}</div>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getservicePreservationList,
  getCustomerRuleDetail,
} from '@/apis/modules/underwriting'
export default {
  name: 'underwrite-rule',
  data() {
    return {
      collapse: false,
      isReverseData: [
        { label: "正向条件", value: "0" },
        { label: "反向条件", value: "1" },
      ],
      tableRightData: [
        { name: '保险公司', key: 'company' },
        { name: '产品类别', key: 'insurance_class' },
        { name: '对接渠道', key: 'channel' },
        { name: '是否在售', key: 'is_sale' },
        { name: '保司客服电话', key: 'customer_service_mobile' },
        { name: '电子回访/电话回访', key: 'return_visit' },
        { name: '联系方式变更(电话/地址)', key: 'contact_way_change' },
        { name: '基本信息变更(证件有效期)', key: 'basic_info_change' },
        { name: '续期账户变更', key: 'renewal_account_change' },
        { name: '补充健告', key: 'health_report' },
        { name: '受益人变更', key: 'beneficiary_change' },
        { name: '犹豫期退保/退保', key: 'insurance_refund' },
        { name: '申请纸质保单', key: 'paper_policy' },
        { name: '发票申请', key: 'invoice_apply' },
        { name: '增加/退保投保人豁免', key: 'policy_holder_exempt' },
        { name: '加保/减保', key: 'add_subtract_insurance' },
        { name: '增加第二投保人', key: 'second_policy_holder' },
        { name: '变更投保人', key: 'policy_holder_change' },
        { name: '增加万能账户', key: 'universal_account' },
        { name: '保单贷款', key: 'policy_loan' },
        { name: '其他规则', key: 'other_rule' },
        { name: '备注', key: 'remarks' },
      ],
      tableData: [],
      columnsData: [],
      tableHeight: null,
      loading: false,
      loadingDetail: false,
      isReverse: 0,
      detailTableData: [],
      searchConditionData: {},
      curProduct: {},
      showProductDetail: false,
      formData: {
        product_name: '',
        is_reverse: 0,
        insurance_class: '',
      },
      classifyList: [
        {
          name: '重疾险',
          value: 1,
          isSelect: false,
        },
        {
          name: '医疗险',
          value: 2,
          isSelect: false,
        },
        {
          name: '寿险',
          value: 3,
          isSelect: false,
        },
        {
          name: '其他',
          value: 9999,
          isSelect: false,
        },
      ],
    }
  },
  computed: {
    conditionText() {
      let str = ''
      let { product_name, notice } = this.searchConditionData
      if (product_name) {
        str += `产品名称：${product_name},`
      }
      if (notice) {
        str += `健康告知内容：${notice},`
      }
      if (str.lastIndexOf(',') === str.length - 1) {
        str = str.substring(0, str.length - 1)
      }
      if (str) {
        str = `【${this.isReverse ? '反向搜索' : '正向搜索'}】 ${str}`
      }
      return str
    },
  },
  methods: {
    rowCellStyle({ columnIndex }) {
      return {
        backgroundColor:
          columnIndex % 2 === 0
            ? columnIndex === 0
              ? '#ebebeb'
              : '#f5f5f5'
            : '#fff',
        fontWeight: columnIndex === 0 ? 'bold' : 'normal',
      }
    },
    collapsePage() {
      this.collapse = !this.collapse
    },
    reset() {
      this.formData = {
        product_name_like: '', // 产品名称
        company: '', // 保险公司
        insurance_class: '',
        intelligent_underwriting: '', // 智能核保
        manual_underwriting: '', // 人工核保
        manual_underwriting_way: '', // 人核方式
        manual_underwriting_operation: '', // 人核具体条件
        medicare_card_loan: '', // 是否可以支持医保卡外借
        manual_underwriting_time_limit: '', // 人工核保时效
        manual_underwriting_refuse_leave_trace: '', // 人核拒保是否留痕
        manual_underwriting_conclusion_query_way: '', // 人核结论查询方式
        manual_underwriting_conclusion_expire_date: '', // 人核结论有效期
        manual_underwriting_pass_how_to_insure: '', // 人工核保通过后如何投保
        manual_underwriting_birthday_order_premium: '', // 人核生日单保费计算
        manual_underwriting_conclusion_on_policy: '', // 人核结论是否会体现在保单上
        underwriting_endorsement_application: '', // 核保批单申请
        applicant_issue_underwriting: '', // 是否支持投保人问题核保
        support_reconsider: '', // 是否支持复议
      }
      this.requestList()
    },
    selectItem(item) {
      item.isSelect = !item.isSelect
      this.requestList()
    },
    requestList() {
      let insuranceList = this.classifyList.filter((item) => {
        return item.isSelect
      })
      let insurance_class
      if (insuranceList) {
        console.log(insuranceList)
        insurance_class = insuranceList.map((item) => {
          return item.name
        })
      }
      this.loading = true
      var params = {
        product_name: this.formData.product_name,
        is_reverse: this.formData.is_reverse,
        insurance_class: insurance_class ? insurance_class.join(',') : '',
      }
      getservicePreservationList(params)
        .then((res) => {
          this.tableData = Object.freeze(res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    changeScrollPx() {
      this.$refs.rightBox.$el.querySelector(
        '.clone-dom-inner'
      ).style.marginTop = -this.$refs.rightBox.$el.scrollTop + 'px'
    },
    requestDetail() {
      this.detailTableData = []
      this.loadingDetail = true
      this.loading = true
      getCustomerRuleDetail({
        id: this.curProduct.id,
      })
        .then((res) => {
          this.columnsData = Object.freeze([res])
          this.detailTableData = [res]
          this.loading = false
        })
        .finally(() => {
          this.loading = false
          this.loadingDetail = false
        })
    },
    search() {
      this.requestList()
    },
    showDetail(data) {
      this.curProduct = data
      this.showProductDetail = true
      this.requestDetail()
    },
    closeDetailModal() {
      this.showProductDetail = false
    },
    closeSearchConditionTips() {
      this.searchConditionData = {}
      this.formData = {}
      this.isReverse = 0
      this.requestList()
    },
  },
  created() {
    this.requestList()
  },
  mounted() {
    this.tableHeight = this.$refs.rightBox.offsetHeight - 32
  },
}
</script>

<style scoped lang="scss">
.underwrite-search-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
  .search-input-container {
    padding: 16px 16px 0;
  }
  .detail-wrap {
    flex: 1;
    padding: 16px;
    box-sizing: border-box;
    max-width: 100%;
    overflow: hidden;
    .head {
      height: 48px;
      position: relative;
      font-size: 14px;
      color: #4d4d4d;
      align-items: flex-start;
      & > p {
        line-height: 32px;
        color: #1a1a1a;
        font-size: 18px;
        margin: 0 0 2px 0;
        font-weight: bold;
      }
      .el-input-number {
        width: 140px;
      }
    }
    ::v-deep .el-scrollbar .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .side-filter-container {
    border-right: 1px solid #e6e6e6;
  }
  .product-detail-table {
    display: flex;
    flex-wrap: wrap;
    &-row {
      width: 100%;
      display: flex;
      font-size: 16px;
      line-height: 1.3;
      padding: 10px;
      &:hover {
        background: #f7f7f7;
      }
    }
    &-column {
      &:first-child {
        width: 300px !important;
        font-weight: bold;
        flex-shrink: 0;
      }
    }
  }
}

.underwriting-contents-rule {
  height: 100%;
  .el-card__body {
    height: 100%;
    .not-content {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .underwriting-all-rule-box {
    height: 100%;
    display: flex;
    .underwriting-contents-rule-left {
      // min-width: 280px;
      border-right: 1px solid #e6e6e6;
      height: 100%;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .el-scrollbar {
        flex: 1;
      }
      .el-form-item {
        width: 100%;
        margin-bottom: 20px !important;
        margin-right: 0 !important;
      }
      .el-form-item__label {
        padding: 0;
      }
      ::v-deep .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .button-box {
        padding-top: 16px;
        // border-top: 1px solid #E6E6E6;
      }
      .el-button--medium {
        width: 90%;
        margin: 0 auto;
      }
      .el-button--warning {
        color: #fff;
        background-color: #1f78ff;
        border-color: #1f78ff;
        float: right;
      }
    }
    .underwriting-contents-rule-right {
      flex: 1;
    }
  }
  .classify-box {
    padding: 16px 0 16px 0;
    font-size: 14px;
    .classify-item {
      cursor: pointer;
      display: inline-block;
      padding: 6px 8px;
      background: #f5f5f5;
      color: #333;
      border-radius: 4px;
      line-height: 1;
      margin-right: 8px;
      border: 1px solid #e6e6e6;
      &.active {
        background: rgba(31, 120, 255, 0.1);
        color: #1f78ff;
        border-color: 1px solid #1f78ff;
      }
    }
  }

  .search-form {
    background: #fff;
    top: 0px;
    left: 0;
    width: 100%;
    padding: 0px 34px 10px 34px;
    z-index: 2;
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 36px !important;
    }
  }
  h2 {
    font-size: 20px;
    color: #303133;
    font-weight: 500;
    margin-right: 24px;
    margin-top: 0;
    margin-bottom: 0;
  }
  .underwriting-contents-rule-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .underwriting-contents-rule-list {
    height: 84vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .el-col-12 {
    margin-bottom: 24px;
  }
  .delete-btn {
    color: rgb(255, 0, 0);
    cursor: pointer;
    margin-left: 20px;
  }
  .product-detail-table {
    display: flex;
    flex-wrap: wrap;
    &-row {
      width: 100%;
      display: flex;
      font-size: 16px;
      line-height: 1.3;
      padding: 10px;
      &:hover {
        background: #f7f7f7;
      }
    }
    &-column {
      &:first-child {
        width: 300px !important;
        font-weight: bold;
        flex-shrink: 0;
      }
    }
  }
}

.underwriting-contents-rule-right {
  flex: 1;
  padding: 16px;
  padding-left: 16px;
  overflow: hidden;
  .underwriting-contents-rule-box {
    font-size: 14px;
    margin-left: 16px;
    .underwriting-contents-rule-row {
      font-size: 14px;
      letter-spacing: -4px;
      display: flex;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
      &:first-child {
        border-top: 1px solid rgba(0, 0, 0, 0.15);
      }
      .underwriting-contents-rule-row-title {
        position: relative;
        letter-spacing: normal;
        vertical-align: top;
        width: 200px;
        padding: 12px 10px;
        line-height: 22px;
        font-weight: bold;
        display: inline-block;
        text-align: center;
        background: #ebebeb;
        border-right: 1px solid rgba(0, 0, 0, 0.15);
        box-sizing: border-box;
        &.underwriting-contents-header-info {
          position: fixed;
          z-index: 11;
        }
        &:first-child {
          // border-left:1px solid rgba(0, 0, 0, .15);
        }
      }
      .underwriting-contents-rule-row-desc {
        letter-spacing: normal;
        vertical-align: top;
        width: 280px;
        padding: 12px 10px;
        line-height: 22px;
        display: inline-block;
        text-align: center;
        border-right: 1px solid rgba(0, 0, 0, 0.15);
        &:first-child {
          border-left: 1px solid rgba(0, 0, 0, 0.15);
        }
        &:nth-child(2n-1) {
          background: #f5f5f5;
        }
        &:nth-child(2n) {
          background: #fff;
        }
      }
    }
  }
}
.clone-dom-box {
  position: absolute;
  top: 16px;
  padding-left: 16px;
  overflow: hidden;
  z-index: 10;
  .underwriting-contents-rule-row-title {
    letter-spacing: normal;
    vertical-align: top;
    width: 200px;
    padding: 12px 10px;
    line-height: 22px;
    font-weight: bold;
    text-align: center;
    background: #ebebeb;
    border-right: 1px solid rgba(0, 0, 0, 0.15);
    &:first-child {
      // border-left:1px solid rgba(0, 0, 0, .15);
    }
  }
}
.height-warp {
  width: 100%;
  height: 16px;
  position: absolute;
  left: 0px;
  top: 0px;
  background: #fff;
  z-index: 10;
}
.width-warp {
  width: 16px;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  background: #fff;
}
::v-deep .main-table {
  .vxe-table--border-line {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  td,
  th {
    color: #333;
  }
  .vxe-header--column,
  .vxe-body--column {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
      linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
  }
  .vxe-header--column {
    background-position: 100% 0, 0 calc(100% - 0.6px);
  }
  .vxe-table--fixed-left-wrapper {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }
  .vxe-table--header-border-line {
    border: transparent;
  }
}
.collapse-button {
  position: absolute;
  top: 136px;
  left: 296px;
  cursor: pointer;
  z-index: 999999;
  transform: translateX(-50%);
  background-color: #ffffff;
  color: #1f78ff;
  border: 1px solid #1f78ff;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
}
.underwriting-product-list {
  overflow: hidden;
  height: 75vh;
  .underwriting-product-item {
    cursor: pointer;
    line-height: 1.5;
    padding: 12px 8px;
    font-size: 14px;
    box-sizing: border-box;
    &.active {
      background: #e8f1ff;
      color: #1f78ff;
    }
  }
}
.left-alignment {
  text-align: left;
}
// .underwrite-search-container {
//   height: 100%;
//   overflow: hidden;
//   display: flex;
//   align-items: stretch;
//   justify-content: stretch;
//   .search-input-container {
//     padding: 16px;
//   }
//   .filter-container {
//     padding: 0 16px 16px;
//   }
//   .detail-wrap.underwrite-search {
//     flex: 1;
//     padding: 16px;
//     box-sizing: border-box;
//     max-width: 100%;
//     overflow: hidden;
//     .head {
//       height: 48px;
//       position: relative;
//       font-size: 14px;
//       color: #4d4d4d;
//       align-items: flex-start;
//       & > p {
//         line-height: 32px;
//         color: #1a1a1a;
//         font-size: 18px;
//         margin: 0 0 2px 0;
//         font-weight: bold;
//       }
//       .el-input-number {
//         width: 140px;
//       }
//     }
//   }
//   .side-filter-container {
//     border-right: 1px solid #e6e6e6;
//   }
//   ::v-deep .filter-bar {
//     // width: 72px;
//     .filter-item {
//       // width: 100%;
//       margin-right: 0;
//       text-align: center;
//       display: flex;
//       height: 28px;
//       align-items: center;
//       justify-content: center;
//     }
//     .filter-badge {
//       width: 20px;
//       height: 20px;
//       border-radius: 10px;
//       background-color: #1f78ff;
//       color: #fff;
//     }
//   }
//   ::v-deep .is-reverse-filter {
//     width: initial;
//     .filter-item {
//       margin-right: 0;
//       width: initial;
//       border: none;
//       background: #fff;
//     }
//   }
//   ::v-deep .radio-group-wrap {
//     .el-radio-button {
//       .el-radio-button__inner {
//         padding: 6px 8px;
//         background: #f5f5f5;
//         border-color: #e6e6e6;
//         color: #1f78ff;
//       }
//       &.is-active .el-radio-button__inner {
//         background: #fff;
//         color: #1f78ff;
//         box-shadow: none;
//       }
//     }
//   }
// }
.el-radio-group{
    border-radius: 4px;
    padding: 2px;
    display: flex;
    // background: #f5f5f5;
    // border: 1px solid #E6E6E6;
    .el-radio-button--medium{
      .el-radio-button__inner{
        border-radius: 4px;
        background: #f5f5f5;
        color: #1a1a1a;
        padding: 4px 16px;
        box-shadow: none;
        line-height: 1.5;
        border: 0px;
      }
      &.is-active{
        .el-radio-button__inner{
          font-weight: bold;
          background: #fff;
          color: #FF9000;
          border: 0;
        }
      }
    }
  }
  .search-form{
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    .button-small-select{
      padding: 3px 8px;
      background: #f5f5f5;
      line-height: 1.6;
      color: #333;
    }
  }
</style>
