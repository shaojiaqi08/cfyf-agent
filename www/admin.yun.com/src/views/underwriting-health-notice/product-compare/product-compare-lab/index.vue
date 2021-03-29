<template>
  <div class="new-layout-common">
    <div class="compare-container">
      <div class="inner-box">
        <div class="title">产品对比</div>
        <div style="height: 80vh;">
          <div class="body" v-loading="isInit">
            <div class="absolute-block"
                 @mouseenter="leftBodyMouseIn"
                 @mouseleave="leftBodyMouseOut">
              <el-scrollbar class="left scroll-bar">
                <!-- <div class="inner-relation-container"> -->
                <div class="table-header"><span class="table-header-text">产品名称</span>
<!--                <div class="template-btns-style">-->
<!--                  <div>-->
<!--                    <span class="btns-template-label-style">险种：</span>-->
<!--                    <el-select v-model="btn_insurance_class.default"-->
<!--                               placeholder="请选择险种"-->
<!--                               class="btns-template-select-style">-->
<!--                      <el-option-->
<!--                        v-for="item in btn_insurance_class.options"-->
<!--                        :key="item.label"-->
<!--                        :label="item.label"-->
<!--                        :value="item.value">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </div>-->
<!--                  <div>-->
<!--                    <span class="btns-template-label-style">端：</span>-->
<!--                    <el-select v-model="btn_client.default"-->
<!--                               placeholder="请选择端"-->
<!--                               class="btns-template-select-style">-->
<!--                      <el-option-->
<!--                        v-for="item in btn_client.options"-->
<!--                        :key="item.label"-->
<!--                        :label="item.label"-->
<!--                        :value="item.value">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </div>-->
<!--                  <div>-->
<!--                    <el-button type="primary"-->
<!--                               size="small"-->
<!--                               :loading="isLoadTemplate"-->
<!--                               @click="useTemplateConf()">{{isLoadTemplate ? '获取模板中' : '使用'}}</el-button>-->
<!--                  </div>-->
<!--                </div>-->
                </div>
                <div class="table-body">
                  <!-- columnsOrderArray遍历循环多少种类 -->
                  <div
                    class="group"
                    v-for="(orderKey, index) in columnsOrderArray"
                    :key="index"
                    v-show="columns[orderKey] && columns[orderKey].is_show"
                  >
                    <!-- start 灰色块  第一层 columns中对应的 orderKey匹配数据 -->
                    <div class="row item-header" v-if="columns[orderKey]">
                      <el-checkbox
                        :indeterminate="columns[orderKey].isIndeterminate"
                        v-model="columns[orderKey].checkAll"
                        @change="handleCheckAllChange($event, orderKey)"
                      >{{ columns[orderKey].label }}</el-checkbox>
                      <span class="move-group">
                        <i
                          class="button iconfont iconxiao16_shangzhixiangjiantou"
                          @click="moveOrder(index, 'up')"
                          v-if="index"
                        ></i>
                        <i
                          class="button iconfont iconxiao16_xiazhixiangjiantou"
                          @click="moveOrder(index, 'down')"
                          v-if="index !== columnsOrderArray.length"
                        ></i>
                      </span>
                    </div>
                    <!-- end 灰色块  第一层 columns中对应的 orderKey匹配数据 -->
                    <el-checkbox-group
                      v-model="columns[orderKey].checked"
                      @change="handleCheckedChange($event, orderKey)"
                      v-if="columns[orderKey]"
                    >
                      <div
                        class="row item-block"
                        :class="{ 'has-children': item.field_list.length }"
                        :style="{ height: `${ item.field_list.length ? item.field_list.length * 46 : 46 }px` }"
                        v-for="(item, idx) in columns[orderKey].field_list"
                        v-show="item.is_show"
                        :key="idx"
                      >
                        <!-- 是否有第三层  选择不同模板 -->
                        <template v-if="!item.field_list.length && item.is_show">
                          <el-checkbox :label="item.key">{{ item.label }}</el-checkbox>
                        </template>
                        <template v-else>
                          <div class="parent" v-if="item.is_show">
                            <el-checkbox
                              :label="item.key"
                              :indeterminate="item.isIndeterminate"
                              v-model="item.checkAll"
                              @change="handleCheckAllChange($event, orderKey, idx)"
                            >{{ item.label }}</el-checkbox>
                          </div>
                          <div class="childrens">
                            <el-checkbox-group
                              v-model="item.checked"
                              @change="handleCheckedChange($event, orderKey, idx)"
                            >
                              <div
                                class="children-block"
                                v-for="children in item.field_list"
                                :key="children.key"
                                v-show="item.is_show"
                              >
                                <el-checkbox :label="children.key">{{ children.label }}</el-checkbox>
                              </div>
                            </el-checkbox-group>
                          </div>
                        </template>
                      </div>
                    </el-checkbox-group>
                  </div>
                </div>
                <!-- </div> -->
              </el-scrollbar>
            </div>

            <!-- 右侧产品展示模板 -->
            <div @mouseenter="rightBodyMouseIn"
                 @mouseleave="rightBodyMouseOut">
              <el-scrollbar class="right scroll-bar">
                  <!-- start 表头展示模板 -->
                  <div class="table-header">
                    <div class="item" v-for="(item, index) in productTableList" :key="index">
                      <span class="close-btn" @click="removeProduct(index)">
                        <i class="iconfont iconxiao16_yuanxingchahao"></i>
                      </span>
                      <div class="table-header-title">{{ item.evaluation_product.product_name }}</div>
                      <div class="table-header-company">{{ item.evaluation_product.supplier_name }}</div>
                      <el-button
                        type="primary"
                        size="small"
                        v-if="!(!item.evaluation_product.proposal_product_id && item.evaluation_product.product_insurance_class === 'accident')"
                        @click="adjustProductParams(item.evaluation_product.id, index)"
                      >调整产品参数</el-button>
                    </div>
                    <div class="item" v-if="productTableList.length < LIMITCOMPARECOUNT">
                      <div class="add-button" @click="addProduct">
                        <i class="iconfont iconxiao16_jiahao fs14"></i>
                        添加产品
                      </div>
                    </div>
                  </div>
                  <!-- end 表头展示模板 -->
                  <div class="table-body"
                      v-loading="removing">
                    <div v-for="(item, index) in columnsKeysMap" :key="index" v-show="item.show">
                      <div class="group dark">
                        <div class="row item-header">
                          <el-button
                            type="text"
                            v-if="item.adjustInfo"
                            @click="adjustInsuredInfo"
                          >调整投被保人信息</el-button>
                        </div>
                      </div>

                      <div
                        class="group"
                        v-for="(row, idx) in item.child"
                        v-show="row.show && !removing"
                        :key="`${index}_${idx}`"
                      >
                        <div class="row item-block">
                          <div
                            class="body-item"
                            v-for="(col, idxx) in getColData(row.key)"
                            :key="`${index}_${idx}_${idxx}`"
                          >
                            <div class="inner">
                              <text-hidden-ellipsis :width="200" :popover-tip="col">{{ col }}</text-hidden-ellipsis>
                              <!-- {{ col }} -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bar">
      <el-button
        type="primary"
        @click="createImageModalShow"
        :loading="isCreateImage"
        v-allowed="['product_evaluation_compare_image']"
      >生成对比图片</el-button>
    </div>
    <image-modal :show.sync="isImageModalShow" :imageUrl="imageUrl"></image-modal>
    <el-dialog
      width="400px"
      title="添加产品"
      :visible="addProductModalShow"
      @close="addProductModalShow = false"
    >
      <el-form label-width="100px" label-position="left">
        <el-input placeholder="请输入产品名称" v-model="searchModel.product_name">
          <template slot="prepend">产品名称</template>
          <el-button slot="append" icon="el-icon-search" @click="getEvaluationProductPageList"></el-button>
        </el-input>
        <el-scrollbar
          style="margin-top: 20px;height: 600px;"
          v-loading="isLoading"
          class="scroll-bar"
        >
          <div class="product-item" v-for="(item, index) in productList" :key="item.id">
            <div class="title">{{ item.product_name }}</div>
            <div class="content">
              <div class="tags">
                <div class="tag">{{ item.product_insurance_class_str }}</div>
                <div class="tag" v-if="item.supplier_name">{{ item.supplier_name }}</div>
              </div>
              <div class="button">
                <el-button type="primary" :loading="isAddProduct" plain @click="add2Compare(index)">
                  <i class="el-icon-plus" v-if="!isAddProduct"></i>
                  添加
                </el-button>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-form>
    </el-dialog>
    <el-dialog
      width="400px"
      title="调整投被保人信息"
      :visible="adjustInsuredInfoModalShow"
      @close="adjustInsuredInfoModalShow = false"
      class="product-params-form"
    >
      <el-form label-width="100px" label-position="left">
        <h3>被保人信息</h3>
        <el-form-item label="性别">
          <el-radio-group v-model="casualInsuredInfoModel.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="casualInsuredInfoModel.age" class="w100 mr10" type="number" min="0"></el-input>岁
        </el-form-item>
        <el-form-item label="是否有社保">
          <el-radio-group v-model="casualInsuredInfoModel.hasSocialSecurity">
            <el-radio :label="1">有社保</el-radio>
            <el-radio :label="0">无社保</el-radio>
          </el-radio-group>
        </el-form-item>
        <h3>投保人信息</h3>
        <el-form-item label="性别">
          <el-radio-group v-model="casualApplicantInfoModel.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="casualApplicantInfoModel.age" class="w100 mr10" type="number" min="0"></el-input>岁
        </el-form-item>
        <div class="tr">
          <el-button @click="adjustInsuredInfoModalShow = false">取消</el-button>
          <el-button type="primary" @click="changeInsuredInfo" :loading="isChangeInsuredInfo">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      width="400px"
      title="调整产品参数"
      :visible="adjustProductParamsShow"
      @close="adjustProductParamsShow = false"
    >
      <el-form
        label-width="100px"
        label-position="left"
        class="product-params-form"
        v-loading="isCalcPremium"
        v-if="adjustProductParamsShow"
      >
        <el-form-item label="产品名称">{{ productInfoArray[adjustProductParamsIndex].productName }}</el-form-item>
        <el-form-item
          label="缴费期限"
          v-if="!(!productInfoArray[adjustProductParamsIndex].isAttachProposal && productInfoArray[adjustProductParamsIndex].type === 'health')"
        >
          <el-select
            class="select-width-100"
            v-model="productInfoArray[adjustProductParamsIndex].payPeriod"
            @change="getCalculatePremium('special')"
          >
            <el-option
              v-for="option in productInfoArray[adjustProductParamsIndex].productInfoOptions.pay_period"
              :label="option.label"
              :key="option.value"
              :value="option.value"
            >{{ option.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="保障期限"
          v-if="!(!productInfoArray[adjustProductParamsIndex].isAttachProposal && productInfoArray[adjustProductParamsIndex].type=== 'health')"
        >
          <el-select
            class="select-width-100"
            v-model="productInfoArray[adjustProductParamsIndex].guaranteePeriod"
            @change="getCalculatePremium('special')"
          >
            <el-option
              v-for="option in productInfoArray[adjustProductParamsIndex].productInfoOptions.guarantee_period"
              :label="option.label"
              :key="option.value"
              :value="option.value"
            >{{ option.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="附加险"
          v-if="productInfoArray[adjustProductParamsIndex].isAttachProposal"
        >
          <el-popover
            v-for='(option, idx) in productTableList[adjustProductParamsIndex].proposal_product.product_insurance_group'
            :key='option.id'
            placement='right'
            trigger='hover'>
            <el-radio-group v-model='productInfoArray[adjustProductParamsIndex].productInsurancesId[idx]' @change="getCalculatePremium('special')">
              <el-row v-for='radioItem in option.insurances' :key='radioItem.id'>
                <el-radio :label='radioItem.id' :value='radioItem.id'>{{ radioItem.name }}</el-radio>
                <el-select v-if='radioItem.type.includes("accident") && radioItem.coverages' v-model='productInfoArray[adjustProductParamsIndex].productInsurances[idx].coverage' :popper-append-to-body='false' placeholder='请选择' size='mini' style='width: 80px;' value='1' @change="getCalculatePremium('special')">
                  <el-option
                    v-for='item in radioItem.coverages'
                    :key="item.value"
                    :value="item.value"
                    :label="item.value_text">
                    {{ item.value_text }}
                  </el-option>
                </el-select>
              </el-row>
            </el-radio-group>

            <div slot='reference' class='insurance-checkboxs'>
              <!-- @change="changeCheckbox($event, index, idx, option)" -->

              <el-checkbox
                :disabled="((option.select_status + '' !== 'undefined') && !option.select_status) || !!option.is_main"
                v-model='!!productInfoArray[adjustProductParamsIndex].productInsurancesId[idx]'
                :label='option.id'
                :value='option.id'
                @change='changeClickCheckbox($event, option, idx)'
              >
                <!--                判断如果附加险子险的id在数组中，就选中checkbox。并判断当前此id在productInsurances数组对象中存在 coverage 字段，就拼接此字段-->
                <!--                否则就直接显示附加险组的名称-->
                {{ productInfoArray[adjustProductParamsIndex].productInsurancesId[idx] ?
                productTableList[adjustProductParamsIndex].proposal_product.product_insurance_group[idx].insurances
                  .find(i => i.id == productInfoArray[adjustProductParamsIndex].productInsurancesId[idx]).name
                + (!!productInfoArray[adjustProductParamsIndex].productInsurances.find(item2 => item2.id == productInfoArray[adjustProductParamsIndex].productInsurancesId[idx]).coverage === false ? '' : '/' + productInfoArray[adjustProductParamsIndex].productInsurances[idx].coverage)
                : option.name }}
                <i class='el-icon-arrow-right'></i>
              </el-checkbox>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item
          label="保额"
          v-if="!(!productInfoArray[adjustProductParamsIndex].isAttachProposal && productInfoArray[adjustProductParamsIndex].type === 'health')"
        >
          <el-select
            class="select-width-100"
            v-model="productInfoArray[adjustProductParamsIndex].coverage"
            @change="getCalculatePremium('special')"
          >
            <el-option
              v-for="option in productInfoArray[adjustProductParamsIndex].productInfoOptions.coverage_options"
              :label="option.label"
              :key="option.value"
              :value="option.value"
            >{{ option.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否含质量"
          v-if="!productInfoArray[adjustProductParamsIndex].isAttachProposal && productInfoArray[adjustProductParamsIndex].type === 'health'"
        >
          <el-radio-group
            v-model="productInfoArray[adjustProductParamsIndex].has_proton_heavy_ion"
            @change="getCalculatePremium('special')"
          >
            <el-radio :label="1">含质量</el-radio>
            <el-radio :label="0">不含质量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="保费">{{ calculatePremium || '未满足要求' }}</el-form-item>
        <div class="tr">
          <el-button @click="adjustProductParamsShow = false">取消</el-button>
          <el-button type="primary" :loading="isCalcPremiumLoading" @click="changeProductParmas()">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- <el-backtop target=".scroll-bar .el-scrollbar__wrap" :bottom="100" :right="20">
      <i class="el-icon-caret-top"></i>
    </el-backtop> -->
  </div>
</template>

<script>
import imageModal from './modal/index'
import TextHiddenEllipsis from '@/components/text-hidden-ellipsis'
import {
  getProductEvaluationConfig,
  getProductEvaluationDetail,
  getCalculatePremium,
  getEvaluationProductPageList,
  getProductsCompareInfo,
  getProductEvaluationImage,
  getProductEvaluationTemplateConf
} from '@/apis/modules/underwriting'
const columnsOrderArray = [ // 左边勾选项第一层Key值， 用于从接口数据中匹配对应数据
  'base_info',
  'disease_guarantee',
  'death_guarantee',
  'evaluation_product_accident_info',
  'evaluation_product_traffic_accident_info',
  'evaluation_product_medical_info',
  'evaluation_product_other_guarantee',
  'evaluation_product_waiting_info',
  'apply_rule',
  'evaluation_product_other_info',
  'evaluation_product_service_info',
  'evaluation_product_renewal_info',
  'evaluation_product_clause_info'
]
// 保障期限
export const guaranteeTimeTypes = [
  { label: '年', value: '1' },
  { label: '季', value: '2' },
  { label: '月', value: '3' },
  { label: '天', value: '4' },
  { label: '岁', value: '5' },
  { label: '终身', value: '6' }
]
// 缴费期限
export const paytimeTypes = [
  { label: '年', value: '1' },
  { label: '季', value: '2' },
  { label: '月', value: '3' },
  { label: '天', value: '4' },
  { label: '趸交', value: '5' },
  { label: '岁', value: '6' }
]
export default {
  components: {
    imageModal,
    TextHiddenEllipsis
  },
  data() {
    return {
      templateConf: {}, // 模板配置
      btn_insurance_class: {
        default: 'no',
        options: require('./btnsConf.js').insurance_class
      },
      btn_client: {
        default: 'no',
        options: require('./btnsConf.js').client
      },
      isLoadTemplate: false,
      LIMITCOMPARECOUNT: 6,
      scrollerLock: false,
      url: '',
      isImageModalShow: false,
      adjustInsuredInfoModalShow: false,
      adjustProductParamsShow: false,
      isCalcPremium: false,
      isCalcPremiumLoading: false,
      isChangeInsuredInfo: false,
      addProductModalShow: false,
      isAddProduct: false,
      isCreateImage: false,
      casualInsuredInfoModel: {
        sex: 1,
        age: 30,
        hasSocialSecurity: 1
      },
      insuredInfoModel: {
        sex: 1,
        age: 30,
        hasSocialSecurity: 1
      },
      applicantInfoModel: {
        sex: 2,
        age: 30
      },
      casualApplicantInfoModel: {
        sex: 2,
        age: 30
      },
      productInfoOptions: {
        pay_period: [],
        guarantee_period: [],
        product_insurances: [],
        coverage_options: []
      },
      productInfo: {
        id: null,
        productName: '',
        payPeriod: '',
        guaranteePeriod: '',
        productInsurances: [],
        productInsurancesId: [],
        coverage: null,
        isInit: false,
        isAttachProposal: false,
        productInfoOptions: {
          pay_period: [],
          guarantee_period: [],
          product_insurances: [],
          coverage_options: []
        },
        type: '',
        has_proton_heavy_ion: 0
      },
      productInfoArray: [],
      guaranteeTimeTypes,
      paytimeTypes,
      columns: {},
      columnsKeysMap: [],
      isInit: true,
      columnsOrderArray,
      calculatePremium: null,
      productList: [],
      productTableList: [],
      adjustProductParamsId: null,
      adjustProductParamsIndex: 0,
      isLoading: false,
      removing: false,
      imageUrl: '',
      searchModel: {
        product_name: ''
      },
      isFromAdd: false // 操作是否来自添加商品按钮
    }
  },
  watch: {
    adjustInsuredInfoModalShow(v) {
      if (!v) {
        this.casualApplicantInfoModel = Object.assign(
          this.casualApplicantInfoModel,
          this.applicantInfoModel
        )
        this.casualInsuredInfoModel = Object.assign(
          this.casualInsuredInfoModel,
          this.insuredInfoModel
        )
      }
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.scrollerUnlinkage()
  },
  methods: {
    changeClickCheckbox($event, option, idx) {
      if (!this.productInfoArray[this.adjustProductParamsIndex].productInsurancesId[idx]) {
        return
      }
      this.$set(this.productInfoArray[this.adjustProductParamsIndex].productInsurancesId, idx, '')
      this.getCalculatePremium('special')
    },
    removeProduct(index) {
      this.removing = true
      let delId = this.productTableList[index].evaluation_product.id
      let ids = JSON.parse(this.$route.query.ids).filter(item => item !== delId)
      this.updateConf(ids)
      this.productTableList.splice(index, 1)
      this.productInfoArray.splice(index, 1)
      setTimeout(() => {
        this.removing = false
      }, 500)
    },
    changeProductParmas(id, index) { // 调整产品参数
      this.isCalcPremiumLoading = true
      const {
        sex: insured_sex,
        age: insured_age,
        hasSocialSecurity: has_social_security
      } = this.insuredInfoModel
      const {
        sex: policy_holder_sex,
        age: policy_holder_age
      } = this.applicantInfoModel
      const {
        payPeriod,
        guaranteePeriod,
        productInsurances,
        productInsurancesId,
        coverage,
        has_proton_heavy_ion,
        isAttachProposal,
        type
      } = this.productInfoArray[+index ? index : this.adjustProductParamsIndex]
      const commonData = {
        insured_sex,
        insured_age,
        has_social_security,
        policy_holder_sex,
        policy_holder_age
      }
      let data = {}
      if (!isAttachProposal && type === 'health') {
        Object.assign(data, commonData, {
          products: [
            {
              evaluation_product_id: id || this.adjustProductParamsId,
              has_proton_heavy_ion
            }
          ]
        })
      } else {
        Object.assign(data, commonData, {
          products: [
            {
              evaluation_product_id: id || this.adjustProductParamsId,
              guarantee_period_value: guaranteePeriod.split('-')[0],
              guarantee_period_unit: guaranteePeriod.split('-')[1],
              pay_period_value: payPeriod.split('-')[0],
              pay_period_unit: payPeriod.split('-')[1],
              coverage,
              insurances: productInsurancesId.map(i => {
                if (!i) return
                const target = productInsurances.find(y => y.id === i)
                if (target && target.coverage) {
                  return { id: i, coverage: target.coverage }
                }
                return { id: i }
              })
            }
          ]
        })
      }
      getProductsCompareInfo(data)
        .then(res => {
          this.productTableList.splice(index !== undefined ? index : this.adjustProductParamsIndex, 1, ...res)
          this.adjustProductParamsShow = false
          this.isCalcPremiumLoading = false
        })
        .catch(err => {
          console.log(err)
          this.isCalcPremiumLoading = false
        })
    },
    add2Compare(index) { // 列表项里添加商品按钮
      const product = this.productList[index]
      this.isAddProduct = true
      this.addProductTable(product.id)
      let ids = JSON.parse(this.$route.query.ids)
      ids.push(product.id)
      this.updateConf(ids)
    },
    getEvaluationProductPageList() { // 点击表头添加产品后获取产品列表
      this.isLoading = true
      getEvaluationProductPageList(this.searchModel)
        .then(res => {
          this.productList = res.data
          this.isLoading = false
        })
        .catch(err => console.log(err))
    },
    addProduct() { // 表头添加商品按钮
      this.isFromAdd = true
      this.addProductModalShow = true
      this.searchModel.product_name = ''
      this.getEvaluationProductPageList()
    },
    moveOrder(index, type) {
      const detach = this.columnsOrderArray.splice(index, 1)
      const detachValue = this.columnsKeysMap.splice(index, 1)

      if (type === 'down') {
        this.columnsOrderArray.splice(index + 1, 0, ...detach)
        this.columnsKeysMap.splice(index + 1, 0, ...detachValue)
      } else {
        this.columnsOrderArray.splice(index - 1, 0, ...detach)
        this.columnsKeysMap.splice(index - 1, 0, ...detachValue)
      }
    },
    getCalculatePremium(id, index) {
      if (id === 'special') { // 如果是单独点击弹框的，  则以公共参数覆盖灵活传入的id， 其它情况传id（因为自动刷新的需求会循环多次赋值公共id 和index
        id = this.adjustProductParamsId
        index = this.adjustProductParamsIndex
      }
      console.log('~~~~~~~~~~', id, index)
      this.isCalcPremium = true
      const { sex, age, hasSocialSecurity } = this.insuredInfoModel
      const { sex: applicantSex, age: applicantAge } = this.applicantInfoModel
      const {
        payPeriod,
        guaranteePeriod,
        productInsurances,
        productInsurancesId,
        coverage,
        has_proton_heavy_ion,
        isAttachProposal,
        type
      } = this.productInfoArray[index !== undefined ? index : this.adjustProductParamsIndex]
      const commonQuery = {
        evaluation_product_id: id || this.adjustProductParamsId,
        insured_sex: sex,
        insured_age: age,
        has_social_security: hasSocialSecurity,
        policy_holder_age: applicantAge,
        policy_holder_sex: applicantSex
      }
      let query = {}
      if (!isAttachProposal && type === 'health') {
        Object.assign(query, commonQuery, { has_proton_heavy_ion })
      } else {
        Object.assign(query, commonQuery, {
          coverage,
          guarantee_period_value: guaranteePeriod.split('-')[0],
          guarantee_period_unit: guaranteePeriod.split('-')[1],
          pay_period_value: payPeriod.split('-')[0],
          pay_period_unit: payPeriod.split('-')[1],
          insurances: productInsurancesId.map(i => {
            if (!i) return
            const target = productInsurances.find(y => y.id === i)
            if (target && target.coverage) {
              return { id: i, coverage: target.coverage }
            }
            return { id: i }
          })
        })
      }
      getCalculatePremium(query)
        .then(res => {
          this.calculatePremium = res.total_premium
          this.isCalcPremium = false
          this.productInfoArray[index !== undefined ? index : this.adjustProductParamsIndex].productInfoOptions.product_insurances.map((i, index) => {
            return Object.assign(i, {
              select_status: (res.insurances && res.insurances[index] && res.insurances[index].select_status) || ''
            })
          })
          if (this.isFromAdd) { // 如果是来自添加商品按钮， 则自动执行算保费。若否，则按照原来的流程
            this.changeProductParmas(id, index)
          }
        })
        .catch(err => {
          this.isCalcPremium = false
          this.calculatePremium = null
          console.log(err)
        })
    },
    adjustProductParams(id, index, hide) {
      if (!hide) {
        this.isFromAdd = false
        this.adjustProductParamsShow = true
      } else {
        this.isFromAdd = true
      }
      this.adjustProductParamsId = id
      this.adjustProductParamsIndex = index
      if (!this.productInfoArray[index].isInit) {
        this.getProductEvaluationDetail(id, index)
      } else {
        this.getCalculatePremium(id, index)
      }
    },
    getProductEvaluationDetail(id, index) {
      this.isCalcPremium = true
      const query = { evaluation_product_id: id }
      getProductEvaluationDetail(query)
        .then(res => {
          console.log('单独获取产品信息', res)
          const payPeriods = res.pay_period.map(i => {
            const value = i.split('-')[0]
            const unit = i.split('-')[1]
            const unitFormat = this.paytimeTypes.find(y => y.value === unit)
              .label
            if (unit === '5') return { label: `${unitFormat}`, value: i }
            return { label: `${value}${unitFormat}`, value: i }
          })
          const guaranteePeriods = res.guarantee_period.map(i => {
            const value = i.split('-')[0]
            const unit = i.split('-')[1]
            const unitFormat = this.guaranteeTimeTypes.find(
              y => y.value === unit
            ).label
            if (unit === '6') return { label: `${unitFormat}`, value: i }
            return { label: `${value}${unitFormat}`, value: i }
          })
          const coverages = res.coverage_options.map(i => {
            return { label: i.text, value: i.value }
          })
          const productInsurances = res.proposal_product.product_insurance || []
          // this.productInfoOptions.pay_period = payPeriods
          // this.productInfoOptions.guarantee_period = guaranteePeriods
          // this.productInfoOptions.product_insurances = productInsurances
          // this.productInfoOptions.coverage_options = coverages

          this.productInfoArray[index].productInfoOptions.pay_period = payPeriods
          this.productInfoArray[index].productInfoOptions.guarantee_period = guaranteePeriods
          this.productInfoArray[index].productInfoOptions.product_insurances = productInsurances
          this.productInfoArray[index].productInfoOptions.coverage_options = coverages
          this.productInfoArray[index].isAttachProposal = !!res.proposal_product_id
          this.productInfoArray[index].type = res.product_insurance_class
          this.productInfoArray[index].isInit = true
          this.productInfoArray[index].id = res.id
          this.productInfoArray[index].productName = res.product_name
          if (
            !res.proposal_product_id &&
            res.product_insurance_class === 'health'
          ) {
            this.productInfoArray[index].has_proton_heavy_ion = res.has_proton_heavy_ion || 0
          } else {
            this.productInfoArray[index].payPeriod = payPeriods[0].value || ''
            this.productInfoArray[index].guaranteePeriod = guaranteePeriods[0].value || ''
            this.productInfoArray[index].productInsurances = productInsurances.map(i => {
              if (i.type === 'accident') {
                return {
                  id: i.id || '',
                  coverage: i.coverages[0].value || ''
                }
              }
              return { id: i.id }
            })
            // this.productInfoArray[index].productInsurancesId = productInsurances
            //   .filter(i => i.is_main)
            //   .map(i => i.id)
            let insurancesList = this.productTableList[index].proposal_product.product_insurance_group
            if(insurancesList){
              this.productInfoArray[index].productInsurancesId = insurancesList.map(insurancesItem => {
                let defaultItem = insurancesItem.insurances.filter(item => {
                  if(item.is_default == 1){
                    return item.id
                  }
                })[0]
                if(defaultItem){
                  return defaultItem.id
                }
              })
            }
            this.productInfoArray[index].coverage = (coverages && coverages[0] && coverages[0].value) || ''
          }
          this.getCalculatePremium(id, index)
        })
        .catch(err => {
          this.isCalcPremium = false
          console.log(err)
        })
    },
    changeInsuredInfo() {
      this.isChangeInsuredInfo = true
      this.applicantInfoModel = Object.assign(
        this.applicantInfoModel,
        JSON.parse(JSON.stringify(this.casualApplicantInfoModel))
      )
      this.insuredInfoModel = Object.assign(
        this.insuredInfoModel,
        JSON.parse(JSON.stringify(this.casualInsuredInfoModel))
      )
      const {
        sex: insured_sex,
        age: insured_age,
        hasSocialSecurity: has_social_security
      } = this.insuredInfoModel
      const {
        sex: policy_holder_sex,
        age: policy_holder_age
      } = this.applicantInfoModel

      const data = {
        insured_sex,
        insured_age,
        has_social_security,
        policy_holder_sex,
        policy_holder_age,
        products: this.productInfoArray.map(i => {
          if (i.isInit) {
            if (!i.isAttachProposal && i.type === 'health') {
              return {
                evaluation_product_id: i.id,
                has_proton_heavy_ion: i.has_proton_heavy_ion
              }
            }
            return {
              evaluation_product_id: i.id,
              guarantee_period_value: i.guaranteePeriod.split('-')[0],
              guarantee_period_unit: i.guaranteePeriod.split('-')[1],
              pay_period_value: i.payPeriod.split('-')[0],
              pay_period_unit: i.payPeriod.split('-')[1],
              coverage: i.coverage,
              insurances: i.productInsurancesId.map(y => {
                const target = i.productInsurances.find(z => z.id === y)
                if (target.coverage) {
                  return { id: y, coverage: target.coverage }
                }
                return { id: y }
              })
            }
          } else {
            return {
              evaluation_product_id: i.id
            }
          }
        })
      }

      getProductsCompareInfo(data)
        .then(res => {
          this.productTableList = res
          this.adjustInsuredInfoModalShow = false
          this.isChangeInsuredInfo = false
          const sexFormat = insured_sex === 1 ? '男性' : '女性'
          const applicantSexFormat = policy_holder_sex === 1 ? '男性' : '女性'
          const hasSocialSecurityFromat = has_social_security
            ? '有社保'
            : '无社保'
          const copywrite = `保费测算（被保人：${insured_age}岁，${sexFormat}，${hasSocialSecurityFromat}，投保人：${policy_holder_age}岁，${applicantSexFormat}）`
          this.columns.base_info.label = copywrite
        })
        .catch(err => {
          this.isChangeInsuredInfo = false
          console.log(err)
        })
    },
    adjustInsuredInfo() {
      this.adjustInsuredInfoModalShow = true
    },
    // getFiledList(first, second, third) {
    //   return this.columns[first].field_list
    // },
    addProductTable(id) { // 获取产品信息， 压入显示产品数组
      const {
        sex: insured_sex,
        age: insured_age,
        hasSocialSecurity: has_social_security
      } = this.insuredInfoModel
      const {
        sex: policy_holder_sex,
        age: policy_holder_age
      } = this.applicantInfoModel
      const data = {
        insured_sex,
        insured_age,
        has_social_security,
        policy_holder_sex,
        policy_holder_age,
        products: [{ evaluation_product_id: id }]
      }

      getProductsCompareInfo(data)
        .then(res => {
          this.productTableList.push(...res)
          this.productInfoArray.push(
            Object.assign({}, JSON.parse(JSON.stringify(this.productInfo)), {
              id: res[0].evaluation_product.id
            })
          )
          this.addProductModalShow = false
          this.isAddProduct = false
          // start 方便使用人员，需求：添加后字段显示信息和算保费
          this.adjustProductParams(this.productTableList[this.productTableList.length - 1].evaluation_product.id, this.productTableList.length - 1, true)
        })
        .catch(err => {
          console.log(err)
          this.isAddProduct = false
        })
    },
    initProductTable(ids) {
      const {
        sex: insured_sex,
        age: insured_age,
        hasSocialSecurity: has_social_security
      } = this.insuredInfoModel
      const {
        sex: policy_holder_sex,
        age: policy_holder_age
      } = this.applicantInfoModel
      const data = {
        insured_sex,
        insured_age,
        has_social_security,
        policy_holder_sex,
        policy_holder_age,
        products: ids.map(i => {
          return {
            evaluation_product_id: i
          }
        })
      }

      getProductsCompareInfo(data)
        .then(res => {
          console.log('初始化页面加载产品信息', res)
          this.productTableList = res
          // 初始化productInfoArray
          ids.map((i, idx) => {
            this.productInfoArray.push(
              Object.assign({}, JSON.parse(JSON.stringify(this.productInfo)), {
                id: i
              })
            )
            this.adjustProductParams(i, idx, true) // 初始化自动更新出产品基本信息
          })
          this.isInit = false
          // 初始化表格宽度
          // const width = document.querySelector('.right').getBoundingClientRect().width
          document.querySelector('.right .table-header').style.width = `1394px`
          document.querySelector('.right .table-body').style.width = `1394px`
        })
        .catch(err => console.log(err))
    },
    updateConf (ids) { // 更新左边模板配置
      getProductEvaluationConfig(ids).then(res => {
        // 整理表头字段
        const data = Object.keys(res).reduce((prev, next) => {
          const filedList = res[next].field_list
          const newFiledList = filedList.map(item => {
            if (!item.field_list.length) {
              return item
            } else {
              return Object.assign(item, {
                checkAll: false,
                checked: [],
                isIndeterminate: false
              })
            }
          })
          prev[next] = Object.assign(res[next], {
            field_list: newFiledList,
            checkAll: false,
            checked: [],
            isIndeterminate: false
          })
          return prev
        }, {})

        this.columns = data
        // 整理数据字段映射
        this.setColumnsKeysMap()
      }).catch(err => {
        console.log(err)
      })
    },
    init() {
      const ids = JSON.parse(this.$route.query.ids)
      getProductEvaluationConfig(ids)
        .then(res => { // 获取左边模板数据
          // 整理表头字段
          const data = Object.keys(res).reduce((prev, next) => {
            const filedList = res[next].field_list
            const newFiledList = filedList.map(item => {
              if (!item.field_list.length) {
                return item
              } else {
                return Object.assign(item, {
                  checkAll: false,
                  checked: [],
                  isIndeterminate: false
                })
              }
            })
            prev[next] = Object.assign(res[next], {
              field_list: newFiledList,
              checkAll: false,
              checked: [],
              isIndeterminate: false
            })
            return prev
          }, {})

          this.columns = data
          // 整理数据字段映射
          this.setColumnsKeysMap()
          this.initProductTable(ids)
          // setTimeout(() => this.scrollerLinkage(), 1000)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getColData(key) {
      const k1 = key.split('.')[0]
      const k2 = key.split('.')[1]
      return this.productTableList.map(i => {
        if (!i[k1]) {
          return ''
        } else {
          return i[k1][k2]
        }
      })
    },
    setColumnsKeysMap() {
      this.columnsKeysMap = this.columnsOrderArray.reduce(
        (prev, next, index) => {
          const target = this.columns[next]
          let headerHolder = {
            label: '',
            key: '',
            tag: next,
            show: target.is_show,
            child: []
          }
          if (!index) {
            Object.assign(headerHolder, { adjustInfo: true })
          }
          const array = target.field_list.reduce((p, n) => {
            let array = []
            if (n.field_list.length) {
              const v = n.field_list.map(i => ({
                label: i.label,
                key: i.key,
                tag: next,
                show: i.is_show
              }))
              array.push(...v)
            } else {
              array.push({
                key: n.key,
                label: n.label,
                tag: next,
                show: n.is_show
              })
            }
            return p.concat(array)
          }, [])
          headerHolder.child.push(...array)
          return prev.concat(headerHolder)
        },
        []
      )
    },
    createImageModalShow() {
      const {
        sex: insured_sex,
        age: insured_age,
        hasSocialSecurity: has_social_security
      } = this.insuredInfoModel
      const {
        sex: policy_holder_sex,
        age: policy_holder_age
      } = this.applicantInfoModel
      const checkedData = this.columnsOrderArray
        .reduce((prev, next) => {
          const checked = this.columns[next].checked
          if (!checked.length) {
            return prev
          } else {
            const checked = this.columns[next].checked
            const childChecked = this.columns[next].field_list.reduce(
              (p, n) => {
                if (n.checked && n.checked.length) {
                  return p.concat(n.checked)
                }
                return p
              },
              []
            )
            return prev.concat({
              group: next,
              keys: checked.concat(childChecked)
            })
          }
        }, [])
        .map(i => {
          const reg = /invalid_\w+/
          const filterKeys = i.keys.filter(y => !reg.test(y))
          return Object.assign(i, { keys: filterKeys })
        })

      if (!checkedData.length) {
        return this.$message({
          type: 'warning',
          message: '请勾选需要显示的项'
        })
      }

      if (!this.productInfoArray.length) {
        return this.$message({
          type: 'warning',
          message: '请添加对比产品'
        })
      }

      const commonData = {
        insured_sex,
        insured_age,
        has_social_security,
        policy_holder_sex,
        policy_holder_age
      }

      const selfData = this.productInfoArray.map(i => {
        if (!i.isAttachProposal && i.type === 'health') {
          return {
            evaluation_product_id: i.id,
            has_proton_heavy_ion: i.has_proton_heavy_ion
          }
        } else {
          return {
            evaluation_product_id: i.id,
            guarantee_period_value: i.guaranteePeriod.split('-')[0],
            guarantee_period_unit: i.guaranteePeriod.split('-')[1],
            pay_period_value: i.payPeriod.split('-')[0],
            pay_period_unit: i.payPeriod.split('-')[1],
            coverage: i.coverage,
            insurances: i.productInsurancesId.map(x => {
              const target = i.productInsurances.find(y => y.id === x)
              if (target.coverage) {
                return { id: x, coverage: target.coverage }
              }
              return { id: x }
            })
          }
        }
      })

      const data = Object.assign(
        {},
        commonData,
        { checked_keys: checkedData },
        { products: selfData }
      )
      // const query = { data: JSON.stringify(data) }
      this.isCreateImage = true
      getProductEvaluationImage(data)
        .then(res => {
          this.imageUrl = res.image_base64
          this.isCreateImage = false
          this.isImageModalShow = true
        })
        .catch(err => {
          console.log(err)
          this.isCreateImage = false
        })
    },
    handleCheckedChange(...args) {
      const [value, key, index] = args
      if (index === void 0) {
        const checkCount = this.columns[key].field_list.length
        this.columns[key].checkAll = checkCount === value.length
        this.columns[key].isIndeterminate =
          value.length > 0 && value.length < checkCount
      } else {
        const checkCount = this.columns[key].field_list[index].field_list.length
        const idx = this.columns[key].checked.findIndex(
          i => i === this.columns[key].field_list[index].key
        )
        if (!value.length) {
          // 第一层checkbox处理
          this.columns[key].checked.splice(idx, 1)
          this.columns[key].isIndeterminate = false
          if (!this.columns[key].checked.length) {
            this.columns[key].checkAll = false
          }
          // 第二层checkbox处理
          this.columns[key].field_list[index].checkAll = false
          this.columns[key].field_list[index].isIndeterminate = false
        } else {
          // 第一层checkbox处理
          if (idx === -1) {
            this.columns[key].checked.push(
              this.columns[key].field_list[index].key
            )
          }
          if (
            this.columns[key].checked.length ===
            this.columns[key].field_list.length
          ) {
            this.columns[key].checkAll = true
            this.columns[key].isIndeterminate = false
          } else {
            this.columns[key].checkAll = false
            this.columns[key].isIndeterminate = true
          }
          // 第二层checkbox处理
          if (checkCount === value.length) {
            this.columns[key].field_list[index].checkAll = true
            this.columns[key].field_list[index].isIndeterminate = false
          } else {
            this.columns[key].field_list[index].checkAll = false
            this.columns[key].field_list[index].isIndeterminate = true
          }
        }
      }
    },
    setTemplate2empty () { // 设置--无模板
      this.isLoadTemplate = false
      let columns = JSON.parse(JSON.stringify(this.columns))
      let keys = Object.keys(columns)
      keys.map(key => {
        columns[key].checkAll = false
        columns[key].isIndeterminate = false
        columns[key].checked = []
        columns[key].field_list.map(child => {
          child.checkAll = false
          child.isIndeterminate = false
          child.checked = []
        })
      })
      this.columns = JSON.parse(JSON.stringify(columns))
    },
    setTemplate () { // 设置模板
      let templateConf = JSON.parse(JSON.stringify(this.templateConf))
      let columns = JSON.parse(JSON.stringify(this.columns))
      let first_keys = Object.keys(templateConf)
      first_keys.map(first => {
        let first_checkAll = templateConf[first].checkAll
        let first_isIndeterminate = !templateConf[first].checkAll
        let first_checked = Object.keys(templateConf[first].list)
        columns[first].checkAll = first_checkAll
        columns[first].isIndeterminate = first_isIndeterminate
        columns[first].checked = first_checked
        // 以上是 主目录下的选中项， 即第二层
        let second_keys = Object.keys(templateConf[first].list)
        second_keys.map(second => {
          if ((templateConf[first].list)[second].hadChild) {
            let second_checkAll = (templateConf[first].list)[second].checkAll
            let second_isIndeterminate = !(templateConf[first].list)[second].checkAll
            let second_checked = Object.keys((templateConf[first].list)[second].list)
            let index = columns[first].field_list.findIndex(item => item.key === second)
            columns[first].field_list[index].checkAll = second_checkAll
            columns[first].field_list[index].isIndeterminate = second_isIndeterminate
            columns[first].field_list[index].checked = second_checked
          }
        })
      })
      this.templateConf = JSON.parse(JSON.stringify(templateConf))
      this.columns = JSON.parse(JSON.stringify(columns))
    },
    getTemplateConfig () { // 根据key 或 id 请求 模板
      this.isLoadTemplate = true
      let params = {
        insurance_class: this.btn_insurance_class.default,
        client: this.btn_client.default
      }
      console.log('参数', params)
      getProductEvaluationTemplateConf(params).then(res => {
        console.log('获取模板接口成功', res)
        this.isLoadTemplate = false
        this.templateConf = res
        if (Object.keys(res).length === 0 || res === []) {
          this.$message({
            type: 'warning',
            message: '模板数据为空, 将自动切换为无模板'
          })
          this.setEmptyBtnConf() // 将按钮置为无模板状态
        } else {
          this.setTemplate()
        }
      }).catch(res => {
        console.log('获取模板接口失败', res)
        this.isLoadTemplate = false
      })
    },
    setEmptyBtnConf () {
      this.btn_insurance_class.default = 'no'
      this.btn_client.default = 'no'
      this.setTemplate2empty() // 置空模板数据，无模板状态
    },
    useTemplateConf () { // 模板使用按钮
      this.isLoadTemplate = true
      this.setTemplate2empty()
      let val = `${this.btn_insurance_class.default}_${this.btn_client.default}`
      if (val === 'no_no') {
        this.$message({
          type: 'error',
          message: '请先选择模板条件'
        })
      } else {
        if (this.btn_insurance_class.default === 'no' || this.btn_client.default === 'no') {
          this.setEmptyBtnConf()
        } else {
          this.getTemplateConfig()
        }
      }
    },
    handleCheckAllChange(...args) {
      const [value, key, index] = args
      if (index === void 0) {
        const childKeys = this.columns[key].field_list.map(i => i.key)
        this.columns[key].checked = value ? childKeys : []
        this.columns[key].checkAll = value
        this.columns[key].isIndeterminate = false
        this.columns[key].field_list.map(i => {
          if (i.field_list.length) {
            value
              ? (i.checked = i.field_list.map(y => y.key))
              : (i.checked = [])
          }
        })
      } else {
        const childKeys = this.columns[key].field_list[index].field_list.map(
          i => i.key
        )
        this.columns[key].field_list[index].checked = value ? childKeys : []
        this.columns[key].field_list[index].checkAll = value
        this.columns[key].field_list[index].isIndeterminate = false
        this.columns[key].isIndeterminate = false
      }
    },
    rightBodyMouseIn() {
      const rightTargetElement = document.getElementsByClassName('right')[0]
        .children[0]
      rightTargetElement.addEventListener('scroll', this.rightScrollerHandler)
    },
    rightBodyMouseOut() {
      const rightTargetElement = document.getElementsByClassName('right')[0]
        .children[0]
      rightTargetElement.removeEventListener('scroll', this.rightScrollerHandler)
    },
    leftBodyMouseIn() {
      const leftTargetElement = document.getElementsByClassName('left')[0]
        .children[0]
      leftTargetElement.addEventListener('scroll', this.leftScrollerHandler)
    },
    leftBodyMouseOut() {
      const leftTargetElement = document.getElementsByClassName('left')[0]
        .children[0]
      leftTargetElement.removeEventListener('scroll', this.leftScrollerHandler)
    },
    scrollerLinkage() {
      const leftTargetElement = document.getElementsByClassName('left')[0]
        .children[0]
      const rightTargetElement = document.getElementsByClassName('right')[0]
        .children[0]
      leftTargetElement.addEventListener('scroll', this.leftScrollerHandler)
      rightTargetElement.addEventListener('scroll', this.rightScrollerHandler)
    },
    scrollerUnlinkage() {
      const leftTargetElement = document.getElementsByClassName('left')[0]
        .children[0]
      const rightTargetElement = document.getElementsByClassName('right')[0]
        .children[0]
      leftTargetElement.removeEventListener('scroll', this.leftScrollerHandler)
      rightTargetElement.removeEventListener(
        'scroll',
        this.rightScrollerHandler
      )
    },
    leftScrollerHandler(e) {
      const leftBodyScrollTop = e.target.scrollTop
      const rightTargetElement = document.getElementsByClassName('right')[0]
        .children[0]
      rightTargetElement.scrollTop = leftBodyScrollTop
    },
    rightScrollerHandler(e) {
      const rightBodyScrollTop = e.target.scrollTop
      const rightBodyScrollLeft = e.target.scrollLeft
      const leftTargetElement = document.getElementsByClassName('left')[0]
        .children[0]
      const rightBodyHeader = document.querySelector('.right .table-header')
      const rightItemHeader = document.querySelectorAll('.right .item-header')
      Array.from(rightItemHeader).forEach(element => {
        element.style.padding = `0 ${17 + rightBodyScrollLeft}px`
      })

      leftTargetElement.scrollTop = rightBodyScrollTop
      rightBodyHeader.style.transform = `translateX(-${rightBodyScrollLeft}px)`
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'index.scss';
.template-btns-style {
  display: flex;
  flex-flow: row nowrap;
  position: absolute;
  left: 0;
  bottom: 0;
  line-height: 1;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  color: #333333;
  font-weight: bold;
  font-size: 16px;
  background: #fef9f3;
}
.margin-top-10 {
  margin-top: 10px;
}
.btns-template-label-style {
  font-size: 14px;
}
.btns-template-select-style {
  width: 100px;
  margin-right: 15px;
}
.table-header{
  width: 100%;
  height: 100%;

  .table-header-text{
    display: inline-block;
    line-height: 150px;
    height: 150px;
  }
}

.product-params-form{
  .tr{
    padding-bottom: 20px;
  }
}

/deep/ .el-row{
  padding: 5px 0;
}

/deep/ .el-checkbox__label{
  word-break: break-all;
  white-space: initial;
}

/deep/ .el-form-item--medium .el-form-item__content{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
