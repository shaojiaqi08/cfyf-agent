<template>
  <div class="underwriting-contents-rule">
    <i
      class="collapse-button"
      :class="{'el-icon-arrow-left': !collapse, 'el-icon-arrow-right' : collapse}"
      :style="`${collapse ? 'left: 18px;transform: translateX(0)' : null}`"
      @click="collapsePage"></i>
    <div class="underwriting-all-rule-box">
      <div style="width: 280px" v-if="!collapse" class="underwriting-contents-rule-left">
        <div>
          险种筛选
        </div>
        <div class="classify-box">
          <div :class="['classify-item', {'active': item.isSelect}]" v-for="item in classifyList" :key="item.value" @click="selectItem(item)">{{item.name}}</div>
        </div>
        <el-scrollbar>
          <el-form inline :modal="formData" @submit.native.prevent label-position="top">
               <el-form-item label="产品名称">
                <el-input v-model="formData.product_name" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="保险公司">
                <el-input v-model="formData.company" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <!-- <el-form-item label="产品类别">
                <el-input v-model="formData.insurance_class" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>-->
<!--              <el-form-item label="对接渠道">-->
<!--                <el-input v-model="formData.channel" placeholder="请输入搜索关键字"></el-input>-->
<!--              </el-form-item>-->
              <el-form-item label="是否在售">
                <!-- <el-input v-model="formData.is_sale" placeholder="请输入搜索关键字"></el-input> -->
                <el-select v-model="formData.is_sale" placeholder="请选择是否在售" clearable  style="width: 100%;">
                  <el-option
                    v-for="item in isSaleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="保险公司报案电话">
                <el-input v-model="formData.report_mobile" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="其他理赔途径">
                <el-input v-model="formData.other_claims" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="理赔材料">
                <el-input v-model="formData.claim_materials" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
          </el-form>
        </el-scrollbar>
        <el-row class="button-box">
          <el-col :span="8"><el-button @click="reset">重置</el-button></el-col>
          <el-col :span="16"><el-button type="warning" @click="search">搜索</el-button></el-col>
        </el-row>
      </div>
      <div class="underwriting-contents-rule-right" v-loading="loading" ref="rightBox" :style="collapse ? 'margin-left: 16px; border-left: 1px solid #e6e6e6' : null">
        <vxe-table
                :data="tableData"
                :height="tableHeight"
                :scroll-x="{enabled: false}"
                style="width: 100%"
                border
                :header-cell-style="rowCellStyle"
                :cell-style="rowCellStyle"
                class="main-table"
                ref="mainTable">
          <vxe-table-column class-name="gray-column" fixed="left" width="200" align="center" field="name" title="产品名称"></vxe-table-column>
          <vxe-table-column class-name="gray-column" v-for="(item, index) in columnsData" :key="index" width="280" align="center" field="name" :title="item.product_name">
            <!-- <template v-slot="{ row }">
              <span v-html="columnsData[index][row.key] || '-'"></span>
            </template> -->
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
import { getClaimPreservationList, getUnderwriteRuleDetail} from '@/apis/modules/underwriting'
export default {
  name: 'underwrite-rule',
  data() {
    return {
      collapse: false,
      tableData: [
        { name: '保险公司', key: 'company' },
        { name: '产品类别', key: 'insurance_class' },
        // { name: '对接渠道', key: 'channel' },
        { name: '是否在售', key: 'is_sale' },
        { name: '保险公司报案电话', key: 'report_mobile' },
        { name: '其他理赔途径', key: 'other_claims' },
        { name: '理赔材料', key: 'claim_materials' },
      ],
      isSaleList: [
        {
          value: '',
          label: '全部'
        }, {
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }
      ],
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
        company: '',
        insurance_class: '',
        channel: '',
        is_sale: '全部',
        report_mobile: '',
        other_claims: '',
        claim_materials: '',
      },
      classifyList: [
        {
          name: '重疾险',
          value: 1,
          isSelect: false
        },
        {
          name: '医疗险',
          value: 2,
          isSelect: false
        },
        {
          name: '寿险',
          value: 3,
          isSelect: false
        },
        {
          name: '其他',
          value: 9999,
          isSelect: false
        }
      ]
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
      if (str.lastIndexOf(',') === (str.length - 1)) {
        str = str.substring(0, str.length - 1)
      }
      if (str) {
        str = `【${this.isReverse ? '反向搜索' : '正向搜索'}】 ${str}`
      }
      return str
    }
  },
  methods: {
    rowCellStyle({ columnIndex }) {
      return {
        backgroundColor: columnIndex % 2 === 0 ? columnIndex === 0 ? '#ebebeb' : '#f5f5f5' : '#fff',
        fontWeight: columnIndex === 0 ? 'bold' : 'normal'
      }
    },
    collapsePage() {
      this.collapse = !this.collapse
    },
    reset() {
      this.formData = {
        product_name: '',
        company: '',
        insurance_class: '',
        channel: '',
        is_sale:'全部',
        report_mobile: '',
        other_claims: '',
        claim_materials: '',
      }
      this.requestList()
    },
    selectItem(item) {
      item.isSelect = !item.isSelect
      this.requestList()
    },
    requestList() {
      let insuranceList = this.classifyList.filter(item => {
        return item.isSelect
      })
      let insurance_class
      if (insuranceList) {
        console.log(insuranceList)
        insurance_class = insuranceList.map(item => {
          return item.name
        })
      }
      let hasvalue = Object.values(this.formData).some(item => {
        return item !== ''
      })
      if (insurance_class.length === 0 && !hasvalue) {
        return
      }
      this.loading = true
      if (this.formData.is_sale == '全部') {
        this.formData.is_sale = ''
      }
      getClaimPreservationList({
        ...this.formData,
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      })
        .then((res) => {
          this.columnsData = Object.freeze(res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    changeScrollPx() {
      this.$refs.rightBox.$el.querySelector('.clone-dom-inner').style.marginTop = -this.$refs.rightBox.$el.scrollTop + 'px'
    },
    requestDetail() {

      this.detailTableData = []
      this.loadingDetail = true
      getUnderwriteRuleDetail({
        id: this.curProduct.id
      })
        .then((res) => {
          this.detailTableData = [res]
        })
        .finally(() => {
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
    }
  },
  created() {
    // this.requestList()
  },
  mounted() {
    this.tableHeight = this.$refs.rightBox.offsetHeight - 32
  }
}
</script>

<style scoped lang="scss">
.underwrite-search-container{
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
  .search-input-container {
    padding: 16px 16px 0;
  }
  .detail-wrap{
    flex: 1;
    padding: 16px;
    box-sizing: border-box;
    max-width: 100%;
    overflow: hidden;
    .head{
      height: 48px ;
      position: relative;
      font-size: 14px;
      color:#4d4d4d;
      align-items: flex-start;
      &>p{
        line-height: 32px;
        color: #1a1a1a;
        font-size: 18px;
        margin: 0 0 2px 0;
        font-weight: bold;
      }
      .el-input-number{
        width: 140px;
      }
    }
    ::v-deep .el-scrollbar .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
  .side-filter-container{
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

  .underwriting-all-rule-box{
    height: 100%;
    display: flex;
    .underwriting-contents-rule-left{
      // min-width: 280px;
      border-right: 1px solid #E6E6E6;
      height: 100%;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .el-scrollbar {
        flex: 1;
      }
      .el-form-item{
        width: 100%;
        margin-bottom: 20px!important;
        margin-right: 0!important;
      }
      .el-form-item__label{
        padding: 0;
      }
      ::v-deep .el-scrollbar__wrap{
        overflow-x: hidden;
      }
      .button-box{
        padding-top: 16px;
        // border-top: 1px solid #E6E6E6;
      }
      .el-button--medium{
        width: 90%;
        margin: 0 auto;
      }
      .el-button--warning{
        color: #fff;
        background-color: #1F78FF;
        border-color: #1F78FF;
        float: right;
      }
    }
    .underwriting-contents-rule-right {
      flex: 1;
    }
  }
  .classify-box{
    padding: 16px 0 16px 0;
    font-size: 14px;
    .classify-item{
      cursor: pointer;
      display: inline-block;
      padding: 6px 8px;
      background: #F5F5F5;
      color: #333;
      border-radius: 4px;
      line-height: 1;
      margin-right: 8px;
      border: 1px solid #E6E6E6;
      &.active{
        background: rgba(31, 120, 255, 0.1);
        color: #1F78FF;
        border-color: 1px solid #1F78FF;
      }
    }
  }

  .search-form {
    background: #fff;
    top: 0px;
    left: 0;
    width: 100%;
    padding: 10px 34px;
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

.underwriting-contents-rule-right{
  flex: 1;
  padding: 16px;
  padding-left: 16px;
  overflow: hidden;
  .underwriting-contents-rule-box{
    font-size: 14px;
    margin-left: 16px;;
    .underwriting-contents-rule-row{
      font-size: 14px;
      letter-spacing: -4px;
      display: flex;
      border-bottom: 1px solid rgba(0, 0, 0, .15);
      &:first-child{
        border-top: 1px solid rgba(0, 0, 0, .15);
      }
      .underwriting-contents-rule-row-title{
        position: relative;
        letter-spacing: normal;
        vertical-align:top;
        width: 200px;
        padding: 12px 10px;
        line-height: 22px;
        font-weight: bold;
        display: inline-block;
        text-align: center;
        background: #EBEBEB;
        border-right: 1px solid rgba(0, 0, 0, .15);
        box-sizing: border-box;
        &.underwriting-contents-header-info{
        position: fixed;
        z-index: 11;
      }
        &:first-child{
          // border-left:1px solid rgba(0, 0, 0, .15);
        }
      }
      .underwriting-contents-rule-row-desc{
        letter-spacing: normal;
        vertical-align:top;
        width: 280px;
        padding: 12px 10px;
        line-height: 22px;
        display: inline-block;
        text-align: center;
        border-right: 1px solid rgba(0, 0, 0, .15);
        &:first-child{
          border-left:1px solid rgba(0, 0, 0, .15);
        }
        &:nth-child(2n-1){
          background: #F5F5F5;
        }
        &:nth-child(2n){
          background: #fff;
        }
      }
    }
  }
}
.clone-dom-box{
  position: absolute;
  top: 16px;
  padding-left: 16px;
  overflow: hidden;
  z-index: 10;
  .underwriting-contents-rule-row-title{
    letter-spacing: normal;
    vertical-align:top;
    width: 200px;
    padding: 12px 10px;
    line-height: 22px;
    font-weight: bold;
    text-align: center;
    background: #EBEBEB;
    border-right: 1px solid rgba(0, 0, 0, .15);
    &:first-child{
      // border-left:1px solid rgba(0, 0, 0, .15);
    }
  }
}
.height-warp{
  width: 100%;
  height: 16px;
  position: absolute;
  left: 0px;
  top: 0px;
  background: #fff;
  z-index: 10;
}
.width-warp{
  width: 16px;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  background: #fff;
}
::v-deep .main-table{
  .vxe-table--border-line {
    border: 1px solid rgba(0, 0, 0, .1);
  }
  td, th {
    color: #333;
  }
  .vxe-header--column, .vxe-body--column {
    background-image: linear-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .1)),linear-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .1))
  }
  .vxe-header--column{
    background-position: 100% 0, 0 calc(100% - .6px);
  }
  .vxe-table--fixed-left-wrapper {
    border-right: 1px solid rgba(0, 0, 0, .1);
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
  color: #1F78FF;
  border: 1px solid #1F78FF;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
}
.left-alignment {
  text-align: left;
}
</style>
