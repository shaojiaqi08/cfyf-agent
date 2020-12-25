<template>
  <div class="underwriting-rule">
    <!-- <side-filter-list
            v-loading="loading"
            label-key="product_name"
            value-key="product_name"
            :showFilter="false"
            v-model="selVal"
            @change="handleSelProduct"
            :disabled="detailLoading"
            style="width: 280px"
            :listData="productData"
    >
        <div slot="extraFilter">
            <div class="search-input-container">
                <el-input placeholder="搜索产品名称"
                            v-model="product_name_like"
                            prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
                            clearable
                            @input="ajaxProductData"></el-input>
            </div>
        </div>
    </side-filter-list>
    <div class="detail-wrap"
          v-loading="detailLoading">
        <el-scrollbar style="height: 100%" v-if="selName">
            <div class="head">
                <p>{{selName}}</p>
            </div>
            <div class="product-detail-table" v-if="detailData">
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">产品名称：</div>
                    <div class="product-detail-table-column">{{detailData.product_name}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">保险公司：</div>
                    <div class="product-detail-table-column">{{detailData.company}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">对接渠道：</div>
                    <div class="product-detail-table-column">{{detailData.channel}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">对接方式：</div>
                    <div class="product-detail-table-column">{{detailData.join_way}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">投保人年龄：</div>
                    <div class="product-detail-table-column">{{detailData.applicant_age}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">投保人豁免是否占风险保额：</div>
                    <div class="product-detail-table-column">{{detailData.applicant_occupied_risk_coverage}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">承保年龄：</div>
                    <div class="product-detail-table-column">{{detailData.insured_age}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">可为谁投保：</div>
                    <div class="product-detail-table-column" v-html="detailData.applicant_insured_relation"></div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">投保职业：</div>
                    <div class="product-detail-table-column">{{detailData.occupation}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">保额限制：</div>
                    <div class="product-detail-table-column">{{detailData.guarantee_quota}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">BMI限制：</div>
                    <div class="product-detail-table-column">{{detailData.bmi_restrict}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">反洗钱处理（20万总保费）：</div>
                    <div class="product-detail-table-column">{{detailData.aml}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">是否有风控：</div>
                    <div class="product-detail-table-column">{{detailData.risk_management}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">代收保费：</div>
                    <div class="product-detail-table-column">{{detailData.collect_premium}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">支付认证（校验）：</div>
                    <div class="product-detail-table-column">{{detailData.check_wechat_real_name}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">首期支付方式：</div>
                    <div class="product-detail-table-column">{{detailData.first_payment_way}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column">续期支付方式：</div>
                    <div class="product-detail-table-column">{{detailData.renewal_payment_way}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column" style="padding-right: 50px;">被保人支持的投保证件：</div>
                    <div class="product-detail-table-column">{{detailData.applicant_crowd}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column" style="padding-right: 50px;">销售区域：</div>
                    <div class="product-detail-table-column">{{detailData.apply_area}}</div>
                </div>
                <div class="product-detail-table-row">
                    <div class="product-detail-table-column" style="padding-right: 50px;">投被保人为同一人且不带身故责任时，身故处理：</div>
                    <div class="product-detail-table-column">{{detailData.holder_recognizee_same_person_death_handle}}</div>
                </div>
            </div>
        </el-scrollbar>
        <div class="empty-tips" v-else>
            请选择左侧列表
        </div>
    </div> -->
    <el-row class="underwriting-all-rule-box">
      <el-col :span="5" class="underwriting-rule-left">
        <div>
          险种筛选
        </div>
        <div class="classify-box">
          <div :class="['classify-item', {'active': item.isSelect}]" v-for="item in classifyList" :key="item.value" @click="selectItem(item)">{{item.name}}</div>
        </div>
        <el-scrollbar style="height:77%">
          <el-form inline :modal="formData" @submit.native.prevent label-position="top">
              <el-form-item label="产品名称">
              <el-input v-model="formData.product_name_like" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="保险公司">
              <el-input v-model="formData.company" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="对接渠道">
              <el-input v-model="formData.channel" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="对接方式">
              <el-input v-model="formData.join_way" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="投保人年龄">
              <el-input v-model="formData.applicant_age" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="投保人豁免是否占风险保额">
              <el-input v-model="formData.applicant_occupied_risk_coverage" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="承保年龄">
              <el-input v-model="formData.insured_age" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="可为谁投保">
              <el-input v-model="formData.applicant_insured_relation" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="投保职业">
              <el-input v-model="formData.occupation" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="保额限制">
              <el-input v-model="formData.guarantee_quota" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="BMI限制">
              <el-input v-model="formData.bmi_restrict" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="反洗钱处理（20万总保费）">
              <el-input v-model="formData.aml" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="是否有风控">
              <el-input v-model="formData.risk_management" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="代收保费">
              <el-input v-model="formData.collect_premium" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="支付认证（校验）">
              <el-input v-model="formData.check_wechat_real_name" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="首期支付方式">
              <el-input v-model="formData.first_payment_way" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="续期支付方式">
              <el-input v-model="formData.renewal_payment_way" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="被保人支持的投保证件">
              <el-input v-model="formData.applicant_crowd" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="销售区域">
              <el-input v-model="formData.apply_area" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
              <el-form-item label="投被保人为同一人且不带身故责任时，身故处理">
              <el-input v-model="formData.holder_recognizee_same_person_death_handle" placeholder="请输入搜索关键字"></el-input>
              </el-form-item>
          </el-form>
        </el-scrollbar>
        <el-row class="button-box">
          <el-col :span="8"><el-button @click="reset">重置</el-button></el-col>
          <el-col :span="16"><el-button type="warning" @click="search">搜索</el-button></el-col>
        </el-row>
      </el-col>
      <el-col :span="19" class="underwriting-rules-right" v-loading="loading" ref="rightBox">
        <div class="clone-dom-box">
          <div class="width-warp">
          </div>
          <div class="clone-dom-inner">
          </div>
        </div>
        <div class="height-warp">
        </div>
        <div class="underwriting-rule-box">
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (product_name.length) + 'px'}]">
            <div class="underwriting-rule-row-title">产品名称</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in product_name" :key="item + index" v-html="item">{{item}}</div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (company.length) + 'px'}]">
            <div class="underwriting-rule-row-title">保险公司</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in company" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (insurance_class.length) + 'px'}]">
            <div class="underwriting-rule-row-title">产品类别</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in insurance_class" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (channel.length) + 'px'}]">
            <div class="underwriting-rule-row-title">对接渠道</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in channel" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (join_way.length) + 'px'}]">
            <div class="underwriting-rule-row-title">对接方式</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in join_way" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (applicant_age.length) + 'px'}]">
            <div class="underwriting-rule-row-title">投保人年龄</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in applicant_age" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (applicant_occupied_risk_coverage.length) + 'px'}]">
            <div class="underwriting-rule-row-title">投保人豁免是否占风险保额</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in applicant_occupied_risk_coverage" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (insured_age.length) + 'px'}]">
            <div class="underwriting-rule-row-title">承保年龄</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in insured_age" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (applicant_insured_relation.length) + 'px'}]">
            <div class="underwriting-rule-row-title">可为谁投保</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in applicant_insured_relation" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (occupation.length) + 'px'}]">
            <div class="underwriting-rule-row-title">投保职业</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in occupation" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (guarantee_quota.length) + 'px'}]">
            <div class="underwriting-rule-row-title">保额限制</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in guarantee_quota" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (bmi_restrict.length) + 'px'}]">
            <div class="underwriting-rule-row-title">BMI限制</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in bmi_restrict" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (aml.length) + 'px'}]">
            <div class="underwriting-rule-row-title">反洗钱处理（20万总保费）</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in aml" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (risk_management.length) + 'px'}]">
            <div class="underwriting-rule-row-title">是否有风控</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in risk_management" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (collect_premium.length) + 'px'}]">
            <div class="underwriting-rule-row-title">代收保费</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in collect_premium" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (check_wechat_real_name.length) + 'px'}]">
            <div class="underwriting-rule-row-title">支付认证（校验）</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in check_wechat_real_name" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (first_payment_way.length) + 'px'}]">
            <div class="underwriting-rule-row-title">首期支付方式</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in first_payment_way" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (renewal_payment_way.length) + 'px'}]">
            <div class="underwriting-rule-row-title">续期支付方式</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in renewal_payment_way" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (applicant_crowd.length) + 'px'}]">
            <div class="underwriting-rule-row-title">被保人支持的投保证件</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in applicant_crowd" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (apply_area.length) + 'px'}]">
            <div class="underwriting-rule-row-title">销售区域</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in apply_area" :key="item + index" v-html="item"></div>
          </div>
          <div class="underwriting-rule-row" :style="[{'width': 200 + 280 * (holder_recognizee_same_person_death_handle.length) + 'px'}]">
            <div class="underwriting-rule-row-title">投被保人为同一人且不带身故责任时，身故处理</div>
            <div class="underwriting-rule-row-desc" v-for="(item, index) in holder_recognizee_same_person_death_handle" :key="item + index" v-html="item"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import SideFilterList from '@/components/side-filter-list'
import {getUnderwriteRuleList, getUnderwriteRuleDetail} from '@/apis/modules/underwriting'
export default {
  name: 'underwrite-rules',
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
        channel: '', // 对接渠道
        join_way: '', // 对接方式
        applicant_age: '', // 投保人年龄
        applicant_occupied_risk_coverage: '', // 投保人豁免是否占风险保额
        insured_age: '', // 承保年龄
        applicant_insured_relation: '', // 可为谁投保
        occupation: '', // 投保职业
        guarantee_quota: '', // 保额限制
        bmi_restrict: '', // BMI限制
        aml: '', // 反洗钱处理（20万总保费）
        risk_management: '', // 是否有风控
        collect_premium: '', // 代收保费
        check_wechat_real_name: '', // 支付认证（校验）
        first_payment_way: '', // 首期支付方式
        renewal_payment_way: '', // 续期支付方式
        applicant_crowd: '', // 被保人支持的投保证件
        apply_area: '', // 销售区域
        holder_recognizee_same_person_death_handle: '' // 投被保人为同一人且不带身故责任时，身故处理
      },
      product_name: [],
      company: [], // 保险公司
      insurance_class: [],
      channel: [], // 对接渠道
      join_way: [], // 对接方式
      applicant_age: [], // 投保人年龄
      applicant_occupied_risk_coverage: [], // 投保人豁免是否占风险保额
      insured_age: [], // 承保年龄
      applicant_insured_relation: [], // 可为谁投保
      occupation: [], // 投保职业
      guarantee_quota: [], // 保额限制
      bmi_restrict: [], // BMI限制
      aml: [], // 反洗钱处理（20万总保费）
      risk_management: [], // 是否有风控
      collect_premium: [], // 代收保费
      check_wechat_real_name: [], // 支付认证（校验）
      first_payment_way: [], // 首期支付方式
      renewal_payment_way: [], // 续期支付方式
      applicant_crowd: [], // 被保人支持的投保证件
      apply_area: [], // 销售区域
      holder_recognizee_same_person_death_handle: [], // 投被保人为同一人且不带身故责任时，身故处理
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
        channel: '', // 对接渠道
        join_way: '', // 对接方式
        applicant_age: '', // 投保人年龄
        applicant_occupied_risk_coverage: '', // 投保人豁免是否占风险保额
        insured_age: '', // 承保年龄
        applicant_insured_relation: '', // 可为谁投保
        occupation: '', // 投保职业
        guarantee_quota: '', // 保额限制
        bmi_restrict: '', // BMI限制
        aml: '', // 反洗钱处理（20万总保费）
        risk_management: '', // 是否有风控
        collect_premium: '', // 代收保费
        check_wechat_real_name: '', // 支付认证（校验）
        first_payment_way: '', // 首期支付方式
        renewal_payment_way: '', // 续期支付方式
        applicant_crowd: '', // 被保人支持的投保证件
        apply_area: '', // 销售区域
        holder_recognizee_same_person_death_handle: '' // 投被保人为同一人且不带身故责任时，身故处理
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
      getUnderwriteRuleList({
        ...this.formData,
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      })
        .then((res) => {
          this.product_name = []
          this.company = []
          this.channel = []
          this.insurance_class = []
          this.join_way = []
          this.applicant_age = []
          this.applicant_occupied_risk_coverage = []
          this.insured_age = []
          this.applicant_insured_relation = []
          this.occupation = []
          this.guarantee_quota = []
          this.bmi_restrict = []
          this.aml = []
          this.risk_management = []
          this.collect_premium = []
          this.check_wechat_real_name = []
          this.first_payment_way = []
          this.renewal_payment_way = []
          this.applicant_crowd = []
          this.apply_area = []
          this.holder_recognizee_same_person_death_handle = []
          res.map(item => {
            // 去除guarantee_quota中的<br />字符串
            item.guarantee_quota = item.guarantee_quota.replace(/<br \/>/g, '')
            this.product_name.push(item.product_name || '-')
            this.company.push(item.company || '-') // 保险公司
            this.insurance_class.push(item.insurance_class || '-')
            this.channel.push(item.channel || '-') // 对接渠道
            this.join_way.push(item.join_way || '-') // 对接方式
            this.applicant_age.push(item.applicant_age || '-') // 投保人年龄
            this.applicant_occupied_risk_coverage.push(item.applicant_occupied_risk_coverage || '-') // 投保人豁免是否占风险保额
            this.insured_age.push(item.insured_age || '-') // 承保年龄
            this.applicant_insured_relation.push(item.applicant_insured_relation || '-') // 可为谁投保
            this.occupation.push(item.occupation || '-') // 投保职业
            this.guarantee_quota.push(item.guarantee_quota || '-') // 保额限制
            this.bmi_restrict.push(item.bmi_restrict || '-') // BMI限制
            this.aml.push(item.aml || '-') // 反洗钱处理（20万总保费）
            this.risk_management.push(item.risk_management || '-') // 是否有风控
            this.collect_premium.push(item.collect_premium || '-') // 代收保费
            this.check_wechat_real_name.push(item.check_wechat_real_name || '-') // 支付认证（校验）
            this.first_payment_way.push(item.first_payment_way || '-') // 首期支付方式
            this.renewal_payment_way.push(item.renewal_payment_way || '-') // 续期支付方式
            this.applicant_crowd.push(item.applicant_crowd || '-') // 被保人支持的投保证件
            this.apply_area.push(item.apply_area || '-') // 销售区域
            this.holder_recognizee_same_person_death_handle.push(item.holder_recognizee_same_person_death_handle || '-') // 投被保人为同一人且不带身故责任时，身故处理
          })
          this.$nextTick(() => {
            this.$refs.rightBox.$el.querySelector('.clone-dom-inner').innerHTML = "";
            setTimeout(() => {
              this.$refs.rightBox.$el.querySelectorAll('.underwriting-rule-row-title').forEach(item => {
                let itemHeight = item.offsetHeight
                // let itemWidth = item.clientWidth
                let clonedNode = item.cloneNode(true);
                clonedNode.style.height = itemHeight + 1 + 'px' // 修正父级下边框
                clonedNode.style.widhth = '200px'
                this.$refs.rightBox.$el.querySelector('.clone-dom-inner').appendChild(clonedNode)
              })
              this.$refs.rightBox.$el.querySelector('.clone-dom-box').style.height = this.$refs.rightBox.$el.clientHeight - 16 + 'px' // 32是两个padding
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

.underwriting-rule {
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
    .underwriting-rule-left{
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
  .underwriting-rule-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .underwriting-rule-list {
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

.underwriting-rules-right{
  height: 88vh;
  padding: 16px;
  padding-left: 0px;
  overflow: scroll;
  .underwriting-rule-box{
    font-size: 14px;
    margin-left: 16px;;
    .underwriting-rule-row{
      font-size: 14px;
      letter-spacing: -4px;
      display: flex;
      border-bottom: 1px solid rgba(0, 0, 0, .15);
      &:first-child{
        border-top: 1px solid rgba(0, 0, 0, .15);
      }
      .underwriting-rule-row-title{
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
      .underwriting-rule-row-desc{
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
  .underwriting-rule-row-title{
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
