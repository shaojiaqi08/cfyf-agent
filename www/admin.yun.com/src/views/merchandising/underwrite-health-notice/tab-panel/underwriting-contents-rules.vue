<template>
  <div class="underwriting-contents-rule">
    <el-row class="underwriting-all-rule-box">
      <el-col :span="5" class="underwriting-contents-rule-left">
        <div>
          险种筛选
        </div>
        <div class="classify-box">
          <div :class="['classify-item', {'active': item.isSelect}]" v-for="item in classifyList" :key="item.value" @click="selectItem(item)">{{item.name}}</div>
        </div>
        <el-scrollbar style="height:77%">
          <el-form inline :modal="formData" @submit.native.prevent label-position="top">
              <el-form-item label="保险公司">
              <el-input v-model="formData.company" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="产品名称">
              <el-input v-model="formData.product_name_like" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="智能核保">
              <el-input v-model="formData.intelligent_underwriting" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人工核保">
              <el-input v-model="formData.manual_underwriting" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人核方式">
              <el-input v-model="formData.manual_underwriting_way" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人核具体条件">
              <el-input v-model="formData.manual_underwriting_operation" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="是否可以支持医保卡外借">
              <el-input v-model="formData.medicare_card_loan" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人工核保时效">
              <el-input v-model="formData.manual_underwriting_time_limit" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人核拒保是否留痕">
              <el-input v-model="formData.manual_underwriting_refuse_leave_trace" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人核结论查询方式">
              <el-input v-model="formData.manual_underwriting_conclusion_query_way" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人核结论有效期">
              <el-input v-model="formData.manual_underwriting_conclusion_expire_date" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人工核保通过后如何投保">
              <el-input v-model="formData.manual_underwriting_pass_how_to_insure" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人核生日单保费计算">
              <el-input v-model="formData.manual_underwriting_birthday_order_premium" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="人核结论是否会体现在保单上">
              <el-input v-model="formData.manual_underwriting_conclusion_on_policy" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="核保批单申请">
              <el-input v-model="formData.underwriting_endorsement_application" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="是否支持投保人问题核保">
              <el-input v-model="formData.applicant_issue_underwriting" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
            <el-form-item label="是否支持复议">
              <el-input v-model="formData.support_reconsider" placeholder="请输入搜索关键字"></el-input>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <el-row class="button-box">
          <el-col :span="8"><el-button @click="reset">重置</el-button></el-col>
          <el-col :span="16"><el-button type="warning" @click="search">搜索</el-button></el-col>
        </el-row>
      </el-col>
      <el-col :span="19" class="underwriting-contents-rule-right" v-loading="loading" ref="rightBox">
        <div class="clone-dom-box">
          <div class="width-warp">
          </div>
          <div class="clone-dom-inner">
          </div>
        </div>
        <div class="height-warp">
        </div>
        <div class="underwriting-contents-rule-box">
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (product_name.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">产品名称</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in product_name" :key="item + index" v-html="item">{{item}}</div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (company.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">保险公司</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in company" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (insurance_class.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">产品类别</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in insurance_class" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (intelligent_underwriting.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">智能核保</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in intelligent_underwriting" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人工核保</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting_way.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人核方式</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting_way" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting_operation.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人核具体条件</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting_operation" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (medicare_card_loan.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">是否可以支持医保卡外借</div>

            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in medicare_card_loan" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting_time_limit.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人工核保时效</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting_time_limit" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting_refuse_leave_trace.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人核拒保是否留痕</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting_refuse_leave_trace" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting_conclusion_query_way.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人核结论查询方式</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting_conclusion_query_way" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting_conclusion_expire_date.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人核结论有效期</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting_conclusion_expire_date" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting_pass_how_to_insure.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人工核保通过后如何投保</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting_pass_how_to_insure" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting_birthday_order_premium.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人核生日单保费计算</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting_birthday_order_premium" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (manual_underwriting_conclusion_on_policy.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">人核结论是否会体现在保单上</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in manual_underwriting_conclusion_on_policy" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (underwriting_endorsement_application.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">核保批单申请</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in underwriting_endorsement_application" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (applicant_issue_underwriting.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">是否支持投保人问题核保</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in applicant_issue_underwriting" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-contents-rule-row" :style="[{'width': 200 + 280 * (support_reconsider.length) + 'px'}]">
            <div class="underwriting-contents-rule-row-title">是否支持复议</div>
            <div class="underwriting-contents-rule-row-desc" v-for="(item, index) in support_reconsider" :key="item + index" v-html="item"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import SideFilterList from '@/components/side-filter-list'
import { getInsuranceRuleList, getUnderwriteRuleDetail} from '@/apis/modules/underwriting'
export default {
  name: 'underwrite-rule',
  components: {
      // SideFilterList
  },
  data() {
    return {
      tableData: [],
      loading: false,
      loadingDetail: false,
      isReverse: 0,
      detailTableData: [],
      searchConditionData: {},
      curProduct: {},
      showProductDetail: false,
      formData: {
        product_name_like: '', // 产品名称
        company: '', // 保险公司
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
        support_reconsider: '' // 是否支持复议
      },
      product_name: [],
      company: [], // 保险公司
      insurance_class: [],
      intelligent_underwriting: [], // 智能核保
      manual_underwriting: [], // 人工核保
      manual_underwriting_way: [], // 人核方式
      manual_underwriting_operation: [], // 人核具体条件
      medicare_card_loan: [], // 是否可以支持医保卡外借
      manual_underwriting_time_limit: [], // 人工核保时效
      manual_underwriting_refuse_leave_trace: [], // 人核拒保是否留痕
      manual_underwriting_conclusion_query_way: [], // 人核结论查询方式
      manual_underwriting_conclusion_expire_date: [], // 人核结论有效期
      manual_underwriting_pass_how_to_insure: [], // 人工核保通过后如何投保
      manual_underwriting_birthday_order_premium: [], // 人核生日单保费计算
      manual_underwriting_conclusion_on_policy: [], // 人核结论是否会体现在保单上
      underwriting_endorsement_application: [], // 核保批单申请
      applicant_issue_underwriting: [], // 是否支持投保人问题核保
      support_reconsider: [], // 是否支持复议
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
        support_reconsider: '' // 是否支持复议
      }
      this.requestList()
    },
    selectItem(item) {
      item.isSelect = !item.isSelect
      this.requestList()
    },
    requestList() {
      this.loading = true
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
      getInsuranceRuleList({
        ...this.formData,
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      })
        .then((res) => {
          this.product_name = []
          this.company = []
          this.intelligent_underwriting = []
          this.insurance_class = []
          this.manual_underwriting = []
          this.manual_underwriting_way = []
          this.manual_underwriting_operation = []
          this.medicare_card_loan = []
          this.manual_underwriting_time_limit = []
          this.manual_underwriting_refuse_leave_trace = []
          this.manual_underwriting_conclusion_query_way = []
          this.manual_underwriting_conclusion_expire_date = []
          this.manual_underwriting_pass_how_to_insure = []
          this.manual_underwriting_birthday_order_premium = []
          this.manual_underwriting_conclusion_on_policy = []
          this.underwriting_endorsement_application = []
          this.applicant_issue_underwriting = []
          this.support_reconsider = []
          res.map(item => {
            this.product_name.push(item.product_name || '-')
            this.company.push(item.company || '-') // 保险公司
            this.intelligent_underwriting.push(item.intelligent_underwriting || '-') // 智能核保
            this.insurance_class.push(item.insurance_class || '-')
            this.manual_underwriting.push(item.manual_underwriting || '-') // 人工核保
            this.manual_underwriting_way.push(item.manual_underwriting_way || '-') // 人核方式
            this.manual_underwriting_operation.push(item.manual_underwriting_operation || '-') // 人核具体条件
            this.medicare_card_loan.push(item.medicare_card_loan || '-') // 是否可以支持医保卡外借
            this.manual_underwriting_time_limit.push(item.manual_underwriting_time_limit || '-') // 人工核保时效
            this.manual_underwriting_refuse_leave_trace.push(item.manual_underwriting_refuse_leave_trace || '-') // 人核拒保是否留痕
            this.manual_underwriting_conclusion_query_way.push(item.manual_underwriting_conclusion_query_way || '-') // 人核结论查询方式
            this.manual_underwriting_conclusion_expire_date.push(item.manual_underwriting_conclusion_expire_date || '-') // 人核结论有效期
            this.manual_underwriting_pass_how_to_insure.push(item.manual_underwriting_pass_how_to_insure || '-') // 人工核保通过后如何投保
            this.manual_underwriting_birthday_order_premium.push(item.manual_underwriting_birthday_order_premium || '-') // 人核生日单保费计算
            this.manual_underwriting_conclusion_on_policy.push(item.manual_underwriting_conclusion_on_policy || '-') // 人核结论是否会体现在保单上
            this.underwriting_endorsement_application.push(item.underwriting_endorsement_application || '-') // 核保批单申请
            this.applicant_issue_underwriting.push(item.applicant_issue_underwriting || '-') // 是否支持投保人问题核保
            this.support_reconsider.push(item.support_reconsider || '-') // 是否支持复议
          })
          this.$nextTick(() => {
            this.$refs.rightBox.$el.querySelector('.clone-dom-inner').innerHTML = "";
            setTimeout(() => {
              this.$refs.rightBox.$el.querySelectorAll('.underwriting-contents-rule-row-title').forEach(item => {
                let itemHeight = item.offsetHeight
                // let itemWidth = item.clientWidth
                let clonedNode = item.cloneNode(true);
                clonedNode.style.height = itemHeight + 1 + 'px' // 修正父级下边框
                clonedNode.style.widhth = '200px'
                this.$refs.rightBox.$el.querySelector('.clone-dom-inner').appendChild(clonedNode)
              })
              this.$refs.rightBox.$el.querySelector('.clone-dom-box').style.height = this.$refs.rightBox.$el.clientHeight - 16 + 'px' // 16是一个padding
              this.$refs.rightBox.$el.removeEventListener('scroll', this.changeScrollPx)
              this.$refs.rightBox.$el.addEventListener('scroll', this.changeScrollPx)
            }, 300)
          })
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
    this.requestList()
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
    .underwriting-contents-rule-left{
      // min-width: 280px;
      border-right: 1px solid #E6E6E6;
      height: 95vh;
      padding: 16px;
      box-sizing: border-box;
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
  height: 88vh;
  padding: 16px;
  padding-left: 0px;
  overflow: scroll;
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
</style>
