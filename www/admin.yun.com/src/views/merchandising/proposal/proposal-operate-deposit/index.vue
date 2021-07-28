<template>
  <div class="new-layout-common">
    <div class="new-layout-common-body proposal">
      <el-scrollbar v-loading="!selectedInit" class="whole-scroller-container">
        <el-card class="proposal-card-shell" shadow="never">
          <div class="proposal-card-header">储蓄计划书基本信息</div>
          <div class="form-row" style="justify-content: flex-start;margin-top: 16px;">
            <div class="form-item customer">
              <div class="label">所属客户</div>
              <el-input v-model.trim="customerName" placeholder="请输入所属客户名称"></el-input>
            </div>
            <div class="form-item proposal-name">
              <div class="label">计划书名称</div>
              <el-input v-model.trim="formData.name" placeholder="请输入计划名称"></el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <div class="label">备注</div>
              <el-input
                v-model.trim="formData.remark"
                :autosize="{ minRows: 2 }"
                placeholder="备注信息不对客户展示，仅作为自我记忆使用"
                type="textarea"
              ></el-input>
            </div>
          </div>
        </el-card>
        <el-card class="proposal-card-shell" shadow="never">
          <div class="proposal-card-header">计划书展示设置</div>
          <div class="form-row mt16">
            <div>
              保险公司介绍
              <el-switch
                v-model="is_show_company_profile"
                class="ml10"
                inactive-color="#E6E6E6"
              ></el-switch>
              <span
                :class="{ active: is_show_company_profile }"
                class="switcher-tips"
              >{{ is_show_company_profile ? '展示' : '不展示' }}</span>
            </div>
          </div>
          <div class="form-row">
            <div>
              投保链接
              <el-switch
                v-model="is_show_link"
                inactive-color="#E6E6E6"
                style="margin-left: 37px;"
              ></el-switch>
              <span
                :class="{ active: is_show_link }"
                class="switcher-tips"
              >{{ is_show_link ? '展示' : '不展示' }}</span>
            </div>
          </div>
        </el-card>
        <el-card class="proposal-card-shell" shadow="never">
          <div class="proposal-card-header no-bottom">保险方案设计</div>
          <div class="proposal-card-body">
            <div style="padding: 16px;">
              <el-table
                ref="prodTable"
                :data="productRowKeys"
                :header-cell-class-name="headerCellClassName"
                border
                class="product-table"
                row-key="id"
                stripe
                style="width: 100%">
                <el-table-column
                  :resizable="false"
                  align="center"
                  fixed="left"
                  label="产品名称"
                  prop="label"
                  width="200px"></el-table-column>
                <el-table-column
                  v-for="(item, index) in productList"
                  :key="item.proposal_product_name + index"
                  :resizable="false"
                  align="center"
                  width="232px">
                  <template #header>
                    <div class="company-box">
                      <i class="el-icon-error fs14 company-icon-close" @click="handleDelProduct(index)"></i>
                      <div class="company-name mb4">{{ item.proposal_product_name }}</div>
                      <div class="company-des mb8">{{ item.supplier_name }}</div>
                      <div class="company-btns">
                        <template v-if="item.is_support_reduction">
                          <i v-if="item.year_reduction" class="iconfont iconxiao16_duigou fs16 company-icon-success"></i>
                          <el-button
                            :disabled="calcing || !item.cash_value || !item.cash_value.length || (item.source === productFrom.MANUALLY_ENTER && item.cash_value.some(i => !i.cash_value))"
                            size="small"
                            type="primary"
                            @click="reduceCalc(item)">减保测算
                          </el-button>
                        </template>
                        <el-button plain size="small" type="primary" @click="handleCopyProd(item)">复制</el-button>
                      </div>
                    </div>
                  </template>
                  <template slot-scope="{ row, $index }">
                    <el-select v-if="$index === 0" :key="item.colKey" v-model="item.relation" placeholder="请选择被保人" @change="setSexAge(item, index)" ref="relationSelect">
                      <el-option
                        v-for="i in relations"
                        :key="i.struct_member_id"
                        :label="i.name"
                        :value="i.struct_member_id">
                      </el-option>
                    </el-select>
                    <span v-if="$index === 1">{{ sexMap[item.gender] || '-' }}</span>
                    <span v-if="$index === 2">{{ item.age != undefined ? item.age : '-' }}</span>
                    <template v-if="$index === 3">
                      <el-select
                        v-if="item.source === productFrom.FROM_INSURANCE"
                        v-model="item.guarantee_time"
                        placeholder="请选择保障期限"
                        @change="handleProdItemChange(item)">
                        <el-option
                          v-for="(item, index) in item.guarantee_period"
                          :key="index"
                          :label="item.text"
                          :value="`${item.value}-${item.unit}`"></el-option>
                      </el-select>
                      <div v-else class="flex-center">
                        <el-input-number
                          v-if="item.guarantee_unit !== guaranteeTimeTypes[2].value"
                          v-model="item.guarantee_time"
                          :controls="false"
                          :max="105"
                          :min="item.guarantee_unit === guaranteeTimeTypes[1].value ? item.age + 1 : 1"
                          :precision="0"
                          class="mr8"
                          placeholder="请输入"
                          style="flex: 1"
                          @change="handleProdItemChange(item)"></el-input-number>
                        <el-select
                          v-model="item.guarantee_unit"
                          :style="{ width: item.guarantee_unit !== guaranteeTimeTypes[2].value ? '95px' : '100%'}"
                          placeholder="请选择"
                          @change="handleGuaranteeUnitChange(item)">
                          <el-option
                            v-for="(item, index) in item.guarantee_period"
                            :key="index"
                            :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </div>
                    </template>
                    <template v-if="$index === 4">
                      <el-select
                        v-if="item.source === productFrom.FROM_INSURANCE"
                        v-model="item.pay_time"
                        placeholder="请选择缴费期限"
                        @change="handleProdItemChange(item)">
                        <el-option
                          v-for="(item, index) in item.pay_period"
                          :key="index"
                          :label="item.text"
                          :value="`${item.value}-${item.unit}`"></el-option>
                      </el-select>
                      <div v-else class="flex-center">
                        <el-input-number
                          v-if="item.pay_unit !== paytimeTypes[2].value"
                          v-model.number="item.pay_time"
                          :controls="false"
                          :max="105"
                          :min="item.pay_unit === paytimeTypes[1].value ? item.age + 1 : 1"
                          :precision="0"
                          class="mr8"
                          placeholder="请输入"
                          style="flex: 1"
                          @change="handleProdItemChange(item)"></el-input-number>
                        <el-select
                          v-model="item.pay_unit"
                          :style="{ width: item.pay_unit !== paytimeTypes[2].value ? '95px' : '100%'}"
                          placeholder="请选择"
                          @change="handlePayUnitChange(item)">
                          <el-option
                            v-for="(item, index) in item.pay_period"
                            :key="index"
                            :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </div>
                    </template>
                    <template v-if="$index === 5">
                      <el-input-number
                        v-if="item.rate_calculate_way === 'calculate_quota_by_premium' || item.source === productFrom.MANUALLY_ENTER"
                        v-model="item.premium"
                        :controls="false"
                        :min="0"
                        :precision="2"
                        placeholder="请输入年交保费"
                        style="width: 100%"
                        type="number"
                        @change="handleProdItemChange(item)"></el-input-number>
                      <span v-else>{{ item.premium }}</span>
                    </template>
                    <template v-if="$index === 6">
                      <el-input-number
                        v-if="item.rate_calculate_way === 'calculate_premium_by_quota' || item.source === productFrom.MANUALLY_ENTER"
                        v-model="item.guarantee_quota"
                        :controls="false"
                        :min="1"
                        :precision="2"
                        placeholder="请输入保费金额"
                        style="width: 100%"
                        @change="handleProdItemChange(item)"></el-input-number>
                      <span v-else>{{ item.guarantee_quota }}</span>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="item in productMaxCnt - productList.length"
                  :key="'extra-column-' + item"
                  :resizable="false"
                  align="center"
                  width="232px">
                  <template slot="header">
                    <el-button icon="el-icon-plus" plain type="primary" @click="handleAddProduct()">添加产品</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <template>
                <el-radio-group v-model="calcType" class="mb16 mt16" size="small">
                  <el-radio-button v-for="(label, key) in calcTypeMap" :key="key" :label="key">{{ label }}</el-radio-button>
                </el-radio-group>
                <el-table
                  ref="cashTable"
                  v-loading="calcing"
                  :cell-class-name="cellClassName"
                  :data="selYearData"
                  border
                  stripe
                  style="width: 100%">
                  <el-table-column
                    :resizable="false"
                    align="center"
                    fixed="left"
                    label="保单年度"
                    prop="year"
                    width="200px"></el-table-column>
                  <el-table-column
                    :label="calcTypeMap[calcType]"
                    :resizable="false"
                    align="center">
                    <el-table-column
                      v-for="(item, index) in productList"
                      :key="item.proposal_product_name + index"
                      :label="item.proposal_product_name"
                      :resizable="false"
                      align="center"
                      width="232px">
                      <template v-slot="{ $index }">
                        <!--自定义现金价值需要填写-->
                        <template v-if="item.source === productFrom.MANUALLY_ENTER && calcType === 'cash_value'">
                          <el-input-number
                            v-if="item.cash_value && calcType === 'cash_value' && item.cash_value[$index]"
                            :ref="`cash-input-${$index}-${index}`"
                            v-model="item.cash_value[$index][calcType]"
                            :controls="false"
                            :min="0"
                            placeholder="请输入现金价值"
                            style="width: 100%"
                            @change="handleCustCashValChange(item)"></el-input-number>
                        </template>
                        <span v-else-if="item.cash_value &&
                                          item.cash_value[$index] &&
                                          item.cash_value[$index][calcType] > 0">{{ item.cash_value[$index][calcType] + (calcType === 'increment_rate' ? '%' : '') }}</span>
                        <span v-else>-</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-for="item in productMaxCnt - productList.length"
                      :key="'extra-column-' + item"
                      :resizable="false"
                      align="center"
                      label=""
                      width="232px">
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </el-card>
        <div class="footer-bar">
          <div class="footer-bar-inner">
            <div class="title">
            </div>
            <span>
              <el-button
                :loading="isButtonLoading || calcing"
                plain
                size="small"
                type="info"
                @click="submit(saveProposalTypes.hold.value)"
              >暂存</el-button>
              <el-button
                :loading="isButtonLoading || calcing"
                class="ml8"
                plain
                size="small"
                type="info"
                @click="submit(saveProposalTypes.preview.value)"
              >预览H5</el-button>
              <el-button
                :loading="isButtonLoading || calcing"
                class="ml8"
                plain
                size="small"
                type="info"
                @click="previewImage(saveProposalTypes.preview.value)"
              >预览图片</el-button>
              <el-button
                :loading="isButtonLoading || calcing"
                class="ml8"
                plain
                size="small"
                type="info"
                @click="previewPdf(saveProposalTypes.preview.value)"
              >预览PDF</el-button>
              <!--              <el-button-->
              <!--                type="info"-->
              <!--                size="small"-->
              <!--                class="ml8"-->
              <!--                :loading="isButtonLoading || calcing"-->
              <!--                plain-->
              <!--              >导出表格</el-button>-->
              <el-button
                :loading="isButtonLoading || calcing"
                class="ml8"
                size="small"
                type="primary"
                @click="submit(saveProposalTypes.done.value)"
              >生成计划书</el-button>
            </span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!--预览-->
    <div v-if="previewVisible" class="new-preview-wrapper" @click="previewHandleClose">
      <div class="new-preview-dialog">
        <iframe :src="proposal.view_url" class="new-preview-iframe" frameborder="0"></iframe>
      </div>
    </div>
    <!--物料-->
    <proposal-material
      :is-deposit="true"
      :proposalInfo="proposal"
      :show.sync="dialogVisible"
      title="成功生成计划书"
      @fresh="handleMaterialClose"
    ></proposal-material>
    <el-backtop :bottom="100" :right="20" target=".whole-scroller-container .el-scrollbar__wrap">
      <i class="el-icon-caret-top"></i>
    </el-backtop>
    <!--添加产品-->
    <add-product-dialog
      :visible.sync="showProductDialog"
      @addProductSubmit="handleProductSubmit"></add-product-dialog>
    <!--减保测算-->
    <cut-insurance-calc-dialog
      :data="reduceData"
      :visible.sync="showReduceDialog"
      @submit="handleReduceCalcSubmit"></cut-insurance-calc-dialog>
  </div>
</template>

<script>
  // import InsuranceTypes from './components/filters/insurance-types'
  // import Coverage from './components/filters/coverage'
  // import GuaranteeTimes from './components/filters/guarantee-times'
  // import InsuranceCompany from './components/filters/insurance-company'
  // import PaymentPeriod from './components/filters/payment-period'
  import ProposalMaterial from '@/components/proposal-material'
  // import addDiyProduct from './modal/add-diy-product'
  import AddProductDialog from './modal/add-product-dialog'
  import {
    depositProposalCalc,
    depositProposalCustCalc,
    depositProposalSave,
    getDepositProposalInfo,
    getProposalCustomerSync,
    getRelationsV2
  } from '@/apis/modules/proposal'

  import {
    guaranteeTimeTypes,
    paytimeTypes,
    productFrom,
    saveProposalTypes
  } from './config'

  import CutInsuranceCalcDialog from './modal/cut-insurance-calc-dialog'
  import Sortable from 'sortablejs'
  import { throttle } from '@/utils'

  export default {
    name: 'proposal',
    components: {
      CutInsuranceCalcDialog,
      // InsuranceTypes,
      // Coverage,
      // GuaranteeTimes,
      // InsuranceCompany,
      // PaymentPeriod,
      ProposalMaterial,
      // addDiyProduct,
      AddProductDialog
    },
    watch: {
      customerName (v) {
        document.title = `${v}的计划书`
      }
    },
    data () {
      return {
        showReduceDialog: false, // 显隐减保测算dialog
        reduceData: {},
        calcType: 'cash_value',
        calcTypeMap: {
          cash_value: '现金价值',
          increment_rate: '现价增速'
        },
        calcing: false,
        productMaxCnt: 7,
        showProductDialog: false,
        productRowKeys: Object.freeze([
          {label: '选择被保人', id: 0},
          {label: '性别', id: 1},
          {label: '年龄', id: 2},
          {label: '保障期限', id: 3},
          {label: '缴费期限', id: 4},
          {label: '年交保费', id: 5},
          {label: '保险金额', id: 6}
        ]),
        sexMap: Object.freeze({
          '1': '男',
          '2': '女'
        }),
        productFrom,
        selectedInit: true,
        proposal: {},
        paytimeTypes,
        guaranteeTimeTypes,
        saveProposalTypes,
        customerName: '',
        customerId: 0,
        proposal_struct_id: 0,
        insuranceProductList: [],
        relations: [],
        formData: {
          customer_id: 1,
          pdf_illustration_type: 'rich',
          illustration_type: 'rich',
          name: '',
          remark: '',
          illustration: '',
          schemes: [],
          is_show_premium: false,
          has_pdf_illustration: 1,
          pdf_illustration: ''
        },
        dialogVisible: false,
        previewVisible: false,
        isButtonLoading: false,
        is_show_company_profile: 1,
        is_show_link: 0,
        is_show_coverage_aggregate: 0,
        productList: []
      }
    },
    computed: {
      maxSelYears () {
        return Math.max.apply(null, this.productList.map(i => (i.cash_value || []).length))
      },
      selYearData () {
        const arr = []
        const max = this.maxSelYears
        for (let i = 1; i <= max; i++) {
          arr.push({year: i})
        }
        return arr
      },
      // 获取高亮值
      highlightColPreRow () {
        const cash_value = []
        const increment_rate = []
        for (let i = 0; i < this.maxSelYears; i++) {
          const vals = []
          const rateVals = []
          this.productList.forEach(item => {
            const hasData = item.cash_value && item.cash_value[i]
            vals.push(hasData && item.cash_value[i].cash_value ? item.cash_value[i].cash_value : 0)
            rateVals.push(hasData && item.cash_value[i].increment_rate > 0 ? item.cash_value[i].increment_rate : 0)
          })
          cash_value[i] = vals.find(i => parseFloat(i) === Math.max.apply(null, vals)) || 0
          increment_rate[i] = rateVals.find(i => parseFloat(i) === Math.max.apply(null, rateVals)) || -1
        }
        return {
          cash_value,
          increment_rate
        }
      }
    },
    created () {
      const id = this.$route.query.id
      const proposalId = this.$route.query.proposal_id
      this.customerName = this.$route.query.customer_name || ''
      this.customerId = this.$route.query.customer_id || 0
      // 计划书入口有三个
      // 1. 计划书列表 > 新增计划书 (query: customer_id&customer_name)
      // 2. 我的客户管理 > 新增计划书 (query: id)
      // 3. 计划书列表 > 编辑/复制 (query: proposal_id)
      if (proposalId) {
        // 3 进入 先请求计划书详情接口，再获取家庭关系
        if (this.customerId > 0) {
          this.getProposalCustomerSync(this.customerId, () => {
            this.getProposalInfo(proposalId)
          })
        } else {
          this.getProposalInfo(proposalId)
        }
      } else {
        if (id) {
          // 2 进入 先获取用户id，再获取家庭关系
          this.getProposalCustomerSync(id)
        } else {
          // 1 进入 获取家庭关系
          this.getRelations(this.customerId)
          this.customerId = 0
          this.proposal_struct_id = this.$route.query.customer_id
        }
      }
    },
    mounted () {
      // 初始化表格横滚动同步
      const prodWrap = this.$refs.prodTable.$el.querySelector('.el-table__body-wrapper')
      const cashWarp = this.$refs.cashTable.$el.querySelector('.el-table__body-wrapper')
      // 节流防止表头错位
      prodWrap.addEventListener('scroll', throttle(function () {
        cashWarp.scrollLeft = prodWrap.scrollLeft
      }, 50))
      cashWarp.addEventListener('scroll', throttle(function () {
        prodWrap.scrollLeft = cashWarp.scrollLeft
      }, 50))
      this.columnDrop()
    },
    methods: {
      // 自定义保障期限选择单位
      handleGuaranteeUnitChange (item) {
        if (item.guarantee_unit === guaranteeTimeTypes[2].value) {
          item.guarantee_time = void 0
        }
        this.handleProdItemChange(item)
      },
      // 自定义缴费期限选择单位
      handlePayUnitChange (item) {
        if (item.pay_unit === paytimeTypes[2].value) {
          item.pay_time = void 0
        }
        this.handleProdItemChange(item)
      },
      // 自定义产品现金价值填写
      handleCustCashValChange (data) {
        const keys = [
          'age',
          'gender',
          'guarantee_time',
          'guarantee_unit',
          'pay_time',
          'pay_unit',
          'guarantee_quota',
          'premium'
        ]
        if (keys.every(key => {
          if (key === 'guarantee_time' && data.guarantee_unit === guaranteeTimeTypes[2].value) {
            return true
          } else if (key === 'pay_time' && data.pay_unit === paytimeTypes[2].value) {
            return true
          }
          return data[key]
        }) && data.cash_value.every(i => i.cash_value)) {
          this.depositProposalCustCalc(data)
        }
      },
      // 产品列表设置可拖拽列classname
      headerCellClassName ({columnIndex}) {
        if (this.productList.length > 1 && columnIndex > 0 && columnIndex <= this.productList.length) {
          return 'draggable-th'
        }
      },
      // 列拖拽
      columnDrop () {
        const wrapperTr = this.$refs.prodTable.$el.querySelector('.el-table__header-wrapper tr')
        this.sortable = Sortable.create(wrapperTr, {
          animation: 180,
          delay: 0,
          draggable: '.draggable-th',
          onEnd: e => {
            const d = this.productList
            const oldItem = d[e.oldIndex - 1]
            d.splice(e.oldIndex - 1, 1)
            d.splice(e.newIndex - 1, 0, oldItem)
          }
        })
      },
      // 表格高亮逻辑
      cellClassName ({rowIndex, columnIndex}) {
        const {productList, calcType} = this
        if (columnIndex > 0 && columnIndex - 1 < productList.length) {
          const curProd = productList[columnIndex - 1]
          if (!curProd.cash_value || !curProd.cash_value[rowIndex]) return
          if (curProd.cash_value[rowIndex][calcType] == this.highlightColPreRow[calcType][rowIndex]) {
            return 'td-highlight'
          }
        }
      },
      // 复制产品
      handleCopyProd (item) {
        const copy = JSON.parse(JSON.stringify(item))
        // 复制不带减保信息
        delete copy.year_reduction
        delete copy.crm_id
        delete copy.scheme_id
        this.productList.push(copy)
      },
      // 减保演算提交
      handleReduceCalcSubmit (data) {
        this.$set(this.reduceData, 'year_reduction', data)
      },
      // 产品内容输入
      handleProdItemChange (item) {
        // 存在减保演算数据就清空掉
        item.year_reduction && this.$delete(item, 'year_reduction')
        const {
                age,
                gender,
                guarantee_time,
                guarantee_unit,
                pay_time,
                guarantee_quota,
                premium,
                pay_unit,
                relation,
                rate_calculate_way,
                id: proposal_product_id
              } = item
        if (item.source === this.productFrom.FROM_INSURANCE &&
          relation &&
          guarantee_time &&
          pay_time &&
          ((rate_calculate_way === 'calculate_quota_by_premium' && premium) ||
            (rate_calculate_way === 'calculate_premium_by_quota' && guarantee_quota))) {
          // 设置默认缴费期限单位
          const pay_val_unit = pay_time.split('-')
          item.pay_unit = pay_val_unit[1]
          // 设置保障期限单位
          const guarantee_val_unit = guarantee_time.split('-')
          item.guarantee_unit = guarantee_val_unit[1]
          this.calcing = true
          depositProposalCalc({
            age,
            gender,
            guarantee_time: guarantee_val_unit[0],
            pay_time: pay_val_unit[0],
            premium: rate_calculate_way === 'calculate_quota_by_premium' ? premium : void 0,
            guarantee_quota: rate_calculate_way === 'calculate_premium_by_quota' ? guarantee_quota : void 0,
            pay_unit: item.pay_unit,
            guarantee_unit: item.guarantee_unit,
            proposal_product_id
          }).then(res => {
            item.premium = res.premium
            item.guarantee_quota = res.guarantee_quota
            this.$set(item, 'cash_value', res.cash_value)
          }).catch(err => {
            // 组合条件没有匹配的费率，无法按照设定参数投保
            // 清除年交保费和保额
            if (err.code === 110007) {
              if (item.rate_calculate_way === 'calculate_premium_by_quota') {
                item.premium = void 0
              } else if (item.rate_calculate_way === 'calculate_quota_by_premium') {
                item.guarantee_quota = void 0
              }
            }
          }).finally(() => {
            this.calcing = false
          })
        }
        // 计算现金价值年度
        // 产品生成保障期限推算保单年度
        if (guarantee_unit) {
          let count = 0
          switch (guarantee_unit) {
            case guaranteeTimeTypes[0].value: // 年度
              if (guarantee_time) {
                count = guarantee_time
              }
              break
            case guaranteeTimeTypes[1].value: // 周岁
              if (age && guarantee_time) {
                count = guarantee_time - age
              }
              break
            case guaranteeTimeTypes[2].value: // 终身
              if (age) {
                count = 105 - age
              }
              break
          }
          if (!item.cash_value || item.cash_value.length !== count) {
            const case_value = []
            for (let i = 0; i < count; i++) {
              case_value.push({
                year: i + 1,
                rate: 0,
                cash_value: void 0,
                increment_rate: 0
              })
            }
            this.$set(item, 'cash_value', case_value)
          }
        }
        if (item.source === this.productFrom.MANUALLY_ENTER &&
          relation &&
          item.cash_value &&
          item.cash_value.every(i => i.cash_value) &&
          pay_unit &&
          (pay_unit === paytimeTypes[2].value || pay_time) &&
          guarantee_unit &&
          (guarantee_unit === guaranteeTimeTypes[2].value || guarantee_time) &&
          premium &&
          guarantee_quota) {
          this.depositProposalCustCalc(item)
        }
      },
      depositProposalCustCalc (item) {
        const params = {
          age: item.age,
          gender: item.gender,
          guarantee_time: item.guarantee_time || 0,
          guarantee_unit: item.guarantee_unit,
          pay_time: item.pay_time || 0,
          guarantee_quota: item.guarantee_quota,
          premium: item.premium,
          pay_unit: item.pay_unit,
          proposal_product_id: item.id,
          cash_value: JSON.stringify(item.cash_value.map(i => i.cash_value))
        }
        this.calcing = true
        depositProposalCustCalc(params).then(res => {
          this.$set(item, 'cash_value', res.cash_value)
        }).finally(() => {
          this.calcing = false
        })
      },
      // 打开减保演算dialog
      reduceCalc (item) {
        this.showReduceDialog = true
        this.reduceData = item
      },
      handleDelProduct (index) {
        this.$confirm('您确定要删除此产品吗?', '提示').then(() => this.productList.splice(index, 1))
      },
      handleAddProduct () {
        this.showProductDialog = true
      },
      // 添加产品
      handleProductSubmit (obj) {
        obj.relation = '' // 被保人
        obj.pay_time = void 0
        obj.pay_unit = ''
        obj.guarantee_time = void 0
        obj.guarantee_unit = ''
        obj.premium = void 0
        obj.guarantee_quota = void 0
        this.productList.push(obj)
      },
      setSexAge (obj) {
        const source = this.relations.find(i => i.struct_member_id === obj.relation)
        obj.gender = source.sex
        obj.age = source.age
        this.handleProdItemChange(obj)
      },
      handleMaterialClose () {
        // this.$router.push('/proposal/proposal-list?tab=deposit')
        localStorage.setItem('refreshPage', new Date().getTime())
        window.close()
      },
      getProposalInfo (proposalId) {
        this.selectedInit = false
        getDepositProposalInfo({id: proposalId})
          .then(res => {
            this.customerName = res.customer_name
            this.customerId = res.customer_id
            this.is_show_company_profile = !!res.is_show_company_profile
            this.is_show_link = !!res.is_show_link
            this.is_show_coverage_aggregate = !!res.is_show_coverage_aggregate
            this.proposal_struct_id = res.proposal_struct_id
            this.productList = res.schemes.map(s => {
              const prod = s.product
              const fromInsurance = prod.source === 'from_insurance'
              const res = {
                id: prod.source_proposal_product_id,
                crm_id: prod.id || '',
                scheme_id: s.id || '',
                cash_calculate_way: prod.product_cash_calculate_way,
                guarantee_period: fromInsurance ? prod.guarantee_period : guaranteeTimeTypes,
                guarantee_quota: prod.guarantee_quota,
                guarantee_time: prod.guarantee_period_value !== '' ? (fromInsurance ? `${prod.guarantee_period_value}-${prod.guarantee_period_unit}` : String(prod.guarantee_period_value)) : '',
                guarantee_unit: prod.guarantee_period_unit,
                is_support_reduction: fromInsurance ? prod.is_support_reduction : true,
                pay_period: fromInsurance ? prod.pay_period : paytimeTypes,
                pay_time: prod.pay_period_value !== '' ? (fromInsurance ? `${prod.pay_period_value}-${prod.pay_period_unit}` : String(prod.pay_period_value)) : '',
                pay_unit: prod.pay_period_unit,
                premium: prod.premium,
                proposal_product_name: prod.proposal_product_name,
                rate_calculate_way: prod.product_rate_calculate_way,
                relation: s.recognizee_policy_struct_member_id,
                supplier_id: prod.source_supplier_id,
                supplier_name: prod.supplier_name,
                age: s.recognizee_policy_age,
                gender: s.recognizee_policy_sex,
                cash_value: [],
                source: prod.source,
                year_reduction: prod.irr_profit > 0 ? {
                  reduction_money: [],
                  after_reduction_cash: [],
                  reduction_total_money: [],
                  after_reduction_cash_growth_rate: [],
                  flow: [],
                  irr: prod.irr_profit
                } : null
              }
              prod.scheme_product_cash.forEach(i => {
                // 现金价值
                res.cash_value.push({
                  year: i.year,
                  rate: i.cash_rate,
                  cash_value: i.cash,
                  increment_rate: i.cash_growth_rate
                })
                // 初始化减保数据
                if (prod.irr_profit > 0) {
                  res.year_reduction.reduction_money.push(i.reduction_money)
                  res.year_reduction.after_reduction_cash.push(i.after_reduction_cash)
                  res.year_reduction.reduction_total_money.push(i.reduction_total_money)
                  res.year_reduction.after_reduction_cash_growth_rate.push(i.after_reduction_cash_growth_rate)
                  res.year_reduction.flow.push(i.flow)
                }
              })
              return res
            })
            this.getRelations(res.proposal_struct_id)
            this.formData = {
              name: res.name,
              remark: res.remark
            }
          }).catch(err => console.log(err)).finally(() => {
          this.selectedInit = true
        })
      },
      getProposalCustomerSync (id, cb) {
        getProposalCustomerSync({customer_id: id, type: 'deposit_proposal'})
          .then(res => {
            this.proposal_struct_id = res.id
            this.getRelations(res.id)
            if (cb) {
              cb()
            }
          })
          .catch(err => console.log(err))
      },
      previewImage (type) {
        this.submit(type, res => {
          const pcode = res.pcode
          window.open(`${process.env.API_URL}/agent/proxy/deposit-proposal/image/view-by-pcode?pcode=${pcode}`)
        })
      },
      previewPdf (type) {
        this.submit(type, res => {
          const pcode = res.pcode
          window.open(`${process.env.API_URL}/agent/proxy/deposit-proposal/pdf/view-by-pcode?pcode=${pcode}`)
        })
      },
      validate () {
        const {customerName, formData: {name, remark}, productList} = this
        if (!customerName) {
          this.$notify.error({
            title: '错误',
            message: '请输入所属客户'
          })
          return false
        } else if (!name) {
          this.$notify.error({
            title: '错误',
            message: '请输入计划书名称'
          })
          return false
        } else if (!remark) {
          this.$notify.error({
            title: '错误',
            message: '请输入备注'
          })
          return false
        } else {
          // 判断产品信息
          const keys = [
            'relation',
            'gender',
            'guarantee_time',
            'guarantee_unit',
            'pay_time',
            'pay_unit',
            'guarantee_quota',
            'premium',
            'cash_value'
          ]
          try {
            productList.forEach(p => {
              if (!keys.every(k => {
                if (p.source === this.productFrom.MANUALLY_ENTER) {
                  if (k === 'cash_value') {
                    return p.cash_value.every(i => i.cash_value > 0)
                  } else if (k === 'guarantee_time' && p.guarantee_unit === guaranteeTimeTypes[2].value) {
                    return true
                  } else if (k === 'pay_time' && p.pay_unit === paytimeTypes[2].value) {
                    return true
                  }
                }
                return p[k]
              })) {
                throw new Error()
              }
            })
          } catch (e) {
            this.$notify.error({
              title: '错误',
              message: '产品信息不能为空'
            })
            return false
          }
        }
        return true
      },
      submit (type, cb) {
        if (!this.validate()) return
        this.isButtonLoading = true
        this.proposal = {}
        const data = {
          id: this.$route.query.proposal_id
            ? this.$route.query.proposal_id
            : null,
          customer_id: this.$route.query.id || this.customerId || 0,
          proposal_struct_id: this.proposal_struct_id,
          name: this.formData.name,
          customer_name: this.customerName,
          is_show_company_profile: this.is_show_company_profile ? 1 : 0,
          is_show_link: this.is_show_link ? 1 : 0,
          is_show_coverage_aggregate: this.is_show_coverage_aggregate ? 1 : 0,
          status: type,
          remark: this.formData.remark,
          schemes: this.productList.map(i => {
            const prod = {}
            const scheme = {...this.relations.find(r => r.struct_member_id === i.relation)}
            const res = {
              id: i.scheme_id,
              recognizee_policy_member_id: scheme.id,
              recognizee_policy_struct_member_id: scheme.struct_member_id,
              recognizee_policy_name: scheme.name,
              recognizee_policy_relation: scheme.relation,
              recognizee_policy_sex: scheme.sex,
              recognizee_policy_birthday: scheme.birthday
            }
            prod.id = i.crm_id
            prod.source = i.id ? productFrom.FROM_INSURANCE : productFrom.MANUALLY_ENTER
            prod.proposal_product_id = i.id || 0
            prod.product_name = i.proposal_product_name
            prod.company_id = i.company_id
            prod.company_name = i.company_name
            prod.supplier_id = i.supplier_id
            prod.supplier_name = i.supplier_name
            prod.pay_period = i.pay_period
            prod.guarantee_period = i.guarantee_period
            prod.guarantee_period_value = (prod.source === 'from_insurance' ? i.guarantee_time.split('-')[0] : i.guarantee_time) || 0
            prod.guarantee_period_unit = i.guarantee_unit
            prod.pay_period_value = (prod.source === 'from_insurance' ? i.pay_time.split('-')[0] : i.pay_time) || 0
            prod.pay_period_unit = i.pay_unit
            prod.guarantee_quota = i.guarantee_quota
            prod.premium = i.premium
            prod.irr_profit = i.year_reduction ? i.year_reduction.irr : 0
            prod.cash = i.cash_value.map((item, index) => {
              const obj = {
                year: item.year,
                cash: item.cash_value,
                cash_rate: item.rate,
                cash_growth_rate: item.increment_rate
              }
              if (i.year_reduction) {
                obj.reduction_money = i.year_reduction.reduction_money[index]
                obj.after_reduction_cash = i.year_reduction.after_reduction_cash[index]
                obj.reduction_total_money = i.year_reduction.reduction_total_money[index]
                obj.after_reduction_cash_growth_rate = i.year_reduction.after_reduction_cash_growth_rate[index]
                obj.flow = i.year_reduction.flow[index]
              }
              return obj
            })
            res.product = prod
            return res
          })
        }
        console.log(data)
        depositProposalSave({data: JSON.stringify(data)}).then(res => {
          this.isButtonLoading = false
          this.proposal = res
          if (cb) {
            return cb(res)
          }
          if (type === 1) {
            this.previewVisible = true
          } else if (type === 2) {
            this.dialogVisible = true
          } else {
            this.$message({
              message: '计划书暂存成功',
              type: 'success'
            })
            localStorage.setItem('refreshPage', new Date().getTime())
            setTimeout(() => {
              window.close()
            }, 1000)
          }
        }).finally(() => {
          this.isButtonLoading = false
        })
      },
      // 家庭关系数据
      getRelations (id) {
        getRelationsV2({id}).then(res => {
          this.relations = res
        })
      },
      previewHandleClose () {
        this.previewVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'index';

  .whole-scroller-container {
    padding-bottom: 60px;

    .proposal-card-body {
      background-color: #fff;
    }
  }

  /deep/ .el-table {
    &.product-table th {
      background: rgba(255, 144, 0, 0.05);

      &.draggable-th {
        cursor: move;
      }
    }

    td, th {
      color: #333333;
    }

    .cell {
      overflow: hidden !important;
    }

    td {
      height: 60px;

      &.td-highlight {
        color: #FF9000 !important;
        background: #FFF3E5 !important;
      }

      border-bottom: 1px solid rgba(0, 0, 0, .1);
      border-right: 1px solid rgba(0, 0, 0, .1);
    }

    &.el-table--striped .el-table__body tr.el-table__row--striped td {
      background: #f5f5f5;
    }

    thead.is-group th {
      background-color: #f5f5f5;
      border-bottom: 1px solid rgba(0, 0, 0, .1);
      border-right: 1px solid rgba(0, 0, 0, .1);
    }
  }

  .el-table--border {
    border: 1px solid rgba(0, 0, 0, .1);
  }

  /deep/ .el-input-number input {
    text-align: left;
  }
</style>
