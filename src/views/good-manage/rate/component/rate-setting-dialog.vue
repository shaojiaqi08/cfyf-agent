<template>
  <el-dialog
    custom-class="rate-setting-dialog"
    top="4vh"
    :title="multCompany ? '批量设置佣金费率' : '设置佣金费率'"
    :visible="visible"
    v-if="visible"
    width="1094px"
    :close-on-click-modal="false"
    @close="closeModal(false)"
  >
    <el-form
      ref="form"
      :model="formModel"
      label-width="110px"
      size="small"
      v-loading="loading"
      label-position="left">
      <!-- <el-form-item label="B端公司">
        <el-select placeholder="请选择B端公司"
                   class="w300"
                   multiple
                   filterable
                   :disabled="singleCompany"
                   v-model="formModel.company_id"
                   v-if="type === 'add' || type === 'copy'">
          <el-option v-for="item in companyList"
                     :key="item.id"
                     :value="item.id"
                     :label="item.name">
            {{ item.name }}
          </el-option>
        </el-select>
        <span v-else>
          {{ formModel.company_id.length && formModel.company_id.map(i => {
            if (companyList.length) {
              return companyList.find(y => y.id === i).name
            } else {
              return '-'
            }
          }).join(',') }}
        </span>
      </el-form-item> -->
      <el-form-item label="保险产品">
        <el-select placeholder="请选择保险产品"
                   class="w300"
                   filterable
                   v-if="type === 'add'"
                   :disabled="singleCompany"
                   v-model="formModel.product_id"
                   @change="productChange">
          <el-option v-for="item in productList"
                     :key="item.id_type"
                     :value="item.id_type"
                     :label="item.name">
            {{ item.name }}
          </el-option>
        </el-select>
        <span v-else>
          {{ formModel.product_name }}
        </span>
      </el-form-item>
      <el-form-item label="生效日期">
        <el-date-picker
          class="w300"
          v-model="formModel.effect_start_at"
          :picker-options="pickerOptions"
          type="datetime"
          range-separator="至"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="销售职位">
        <el-select v-model="formModel.position_id"
                   placeholder="请选择销售职位"
                   :disabled="!multCompany"
                   filterable
                   multiple
                   class="w300">
          <el-option-group
            v-for="group in salePositionList"
            :key="group.level_str"
            :label="group.level_str">
            <el-option
              v-for="item in group.items"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-option-group>
        </el-select>
        <!-- <el-select placeholder="请选择销售职位"
                   class="w300"
                   filterable
                   v-model="formModel.product_id"
                   @change="getProductAttributeList">
          <el-option v-for="item in productList"
                     :key="item.id_type"
                     :value="item.id_type"
                     :label="item.name">
            {{ item.name }}
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="费率计算方法">
        <el-radio-group v-model="formModel.calculate_way"
                        v-if="hasCalculateWay"
                        @change="calculateWayChange">
          <el-radio :label="item.value"
                    v-for="item in calculateWays"
                    :key="item.value"
                    :disabled="true">
            {{ item.label }}
            <el-tooltip :content="item.desc" placement="top">
              <i class="iconfont iconxiao16_gengduoxinxi" style="color:#1F78FF"></i>
            </el-tooltip>
          </el-radio>
        </el-radio-group>
        <span v-else style="color: #FF4C4C;">
          {{ calculateWayMessage }}
        </span>
      </el-form-item>
      <h3 style="margin-bottom: 0;font-size: 16px;font-weight: 500;color: #1a1a1a;">
        佣金费率
      </h3>
      <div style="position: relative;">
        <div class="add-button-group">
            <el-button class="add-button"
                       type="primary"
                       size="small"
                       :loading="tableLoading"
                       @click="addRow">
              <i class="iconfont iconxiao16_hang"></i>
              添加行
            </el-button>
          <el-button class="add-button"
                     type="primary"
                     size="small"
                     v-if="tabSelected != 1"
                     :loading="tableLoading"
                     @click="addCol">
            <i class="iconfont iconxiao16_lie"></i>
            添加列
          </el-button>
        </div>
        <el-tabs class="mt10" size="small" v-model="tabSelected">
          <el-tab-pane v-for="(item, index) in tabs"
                      :key="index"
                      :name="item.value"
                      :label="item.label">
            <el-table
              :data="currentTableData()"
              border
              stripe
              v-loading="tableLoading"
              max-height="300"
              v-if="!loading && !tableEmpty">
              <el-table-column
                label="缴费期限"
                width="120"
                align="center">
                <!-- <template slot-scope="scope">
                  {{ scope.row.guarantee_period.guarantee_period_id }}
                </template> -->
                <template slot-scope="scope">
                  <el-select v-model="scope.row.payment_period.payment_period_id"
                             v-if="formModel.calculate_way === calculateWayKey.GUARANTEEPERIOD || formModel.calculate_way === calculateWayKey.AGEANDGUARANTEEPERIOD">
                    <el-option v-for="(item, index) in paymentList"
                              :key="index"
                              :value="item.id"
                              :label="item.label">
                      {{ item.label }}
                    </el-option>
                  </el-select>
                  <span v-else>全部</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="formModel.calculate_way === calculateWayKey.AGEANDGUARANTEEPERIOD ? '保障期限（年）' : '保障期限'"
                :width="formModel.calculate_way === calculateWayKey.AGEANDGUARANTEEPERIOD ? 165 : 120"
                align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.guarantee_period.guarantee_period_id"
                             v-if="formModel.calculate_way === calculateWayKey.GUARANTEEPERIOD">
                    <el-option v-for="(item, index) in guaranteeList"
                              :key="index"
                              :value="item.id"
                              :label="item.label">
                      {{ item.label }}
                    </el-option>
                  </el-select>
                  <span v-if="formModel.calculate_way === calculateWayKey.AGEANDGUARANTEEPERIOD">
                    <el-input placeholder="最小"
                              class="rate-small-input"
                              v-model="scope.row.guarantee_period.min_guarantee_year"></el-input> -
                    <el-input placeholder="最大"
                              class="rate-small-input"
                              v-model="scope.row.guarantee_period.max_guarantee_year"></el-input>
                  </span>
                  <span v-if="formModel.calculate_way === calculateWayKey.SINGLEPOLICY">全部</span>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(rate, index) in currentTableRateHeader()"
                :key="`${rate.type}_${index}_${Math.random()}`"
                label="佣金费率"
                :width="rate.type !== 'single' && formModel.calculate_way !== calculateWayKey.SINGLEPOLICY ? 356 : ''"
                align="center">
                <template slot="header"
                          slot-scope="scope">
                  <div v-if="rate.type !== 'single'">
                    <div class="header-top" ref="headerTop" :nest="scope">
                      <span class="copy-button" @click="copyCol(rate, index)">复制</span>
                      <span class="delete-button" @click="removeCol(index)">删除</span>
                    </div>
                    <div class="header-bottom">
                      <el-input class="rate-input"
                                placeholder="最小"
                                v-model="rate.renewal_rate_min"
                                type="number">
                        <template slot="append">%</template>
                      </el-input>
                      ≤ 续保率 ＜
                      <el-input class="rate-input"
                                placeholder="最大"
                                v-model="rate.renewal_rate_max"
                                type="number">
                        <template slot="append">%</template>
                      </el-input>
                    </div> 
                  </div>
                  <div v-else>
                    佣金费率
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-input placeholder="基础"
                            class="rate-input"
                            type="number"
                            v-model="scope.row.renewal_rate[index].base_proportion">
                    <template slot="append">%</template>
                  </el-input>
                  +
                  <el-input placeholder="奖励"
                            class="rate-input"
                            type="number"
                            v-model="scope.row.renewal_rate[index].reward_proportion">
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                min-width="100"
                align="center">
                <template slot-scope="scope">
                  <span class="copy-button" @click="copy(scope.$index)">复制</span>
                  <span class="delete-button"
                        @click="remove(scope.$index)">删除</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="tc pt20 pb20"
                 v-if="tableEmpty">
              暂无数据
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
    <span slot="footer" class="footer">
      <el-button :loading="submitting" size="small" @click="closeModal(false)">取消</el-button>
      <el-button :loading="submitting" size="small" type="primary" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { guaranteePeriodUnitArray, paymentPeriodUnitArray } from '@/enums/common'
import { calculateWays, calculateWayKey, terms } from '@/enums/good-manage'
import { getCompanyList,
         getCommissionAllProduct,
         getProductAttributeList, getCompanyCommissionDetail,
         companyCommissionUpdate, companyCommissionCreate, getCalculateWay, getPositionsWithAdminRoles } from '@/apis/modules/good-manage'
export default {
  name: "rate-setting-dialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object
    },
    type: {
      type: String
    },
    singleCompany: {
      type: Boolean
    },
    multCompany: {
      type: Boolean
    },
    companyId: {},
    productId: {},
    positionId: {}
  },
  data() {
    const baseValiObj = { required: true, message: "此项不可为空" };
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      baseValiObj,
      calcType: calculateWays[0].value,
      tabs: terms,
      search: '',
      input: '',
      loading: false,
      tableLoading: false,
      tableEmpty: false,
      submitting: false,
      isGetProductAttribute: false,
      hasCalculateWay: false,
      guaranteePeriodUnitArray,
      paymentPeriodUnitArray,
      tabSelected: '1',
      calculateWays,
      calculateWayKey,
      date: '',
      companyList: [],
      productList: [],
      guaranteeList: [],
      paymentList: [],
      salePositionList: [],
      tableData: [],
      calculateWayMessage: '',
      formModel: {
        calculate_way: calculateWayKey.GUARANTEEPERIOD,
        company_id: [],
        effect_start_at: '',
        id: '',
        name: '',
        position_id: [],
        product_id: '',
        product_name: '',
        product_type: '',
        remark: '',
        schemes: []
      }
    };
  },
  computed: {
    targetRules() {
      return this.formModel.schemes.find(i => i.stage == this.tabSelected).rules
    }
  },
  watch: {
    visible(v) {
      if (v) {
        this.hasCalculateWay = false
        this.tabSelected = '1'
        this.getProductList()
        // this.getCompanyList()
        this.getSalesPositionList()
        if (this.type === 'edit' || this.type === 'copy') {
          this.getCompanyCommissionDetail()
        } 
        if (this.type === 'add') {
          this.init()
        }
      } else {
        this.formModel = this.$options.data().formModel
        this.guaranteeList = []
        this.paymentList = []
        // this.isGetProductAttribute = false
      }
    },
    tabSelected() {
      this.tableEmpty = false
      this.tableLoading = true
      this.judgeScheme()
      setTimeout(() => {
        this.tableHeaderTopHack()
        this.tableLoading = false
      }, 500)
    }
  },
  methods: {
    tableHeaderTopHack() {
      const array = this.$refs.headerTop
      array.map(i => {
        while (!i.classList.contains('cell')) {
          i = i.parentElement
        }
        i.style.padding = `0px`
      })
    },
    productChange() {
      this.getProductAttributeList()
      this.getCalculateWay(this.formModel.product_id)
    },
    getCalculateWay(productInfo) {
      const [product_id, product_type] = productInfo ? productInfo.split('_') : this.productId.split('_')
      const data = { product_id, product_type }
      getCalculateWay(data).then(res => {
        const way = res.calculate_way
        if (this.formModel.calculate_way !== way) {
          this.calculateWayChange()
          this.formModel.calculate_way = way
        }
        if (way) {
          this.hasCalculateWay = true
        } else {
          this.hasCalculateWay = false
          this.calculateWayMessage = '未设置服务费计算方法，请联系创富云服管理员'
        }
      })
    },
    getSalesPositionList() {
      getPositionsWithAdminRoles()
        .then(res => {
          this.salePositionList = res
        })
    },
    calculateWayChange() {
      const schemes = this.formModel.schemes
      schemes.map(i => {
        i.rules = []
        i.rules.push(this.getRuleModel('new'))
      })
      this.tabSelected = '1'
    },
    judgeScheme() {
      const rules = this.formModel.schemes.find(i => i.stage == this.tabSelected)
      if (!rules) {
        this.formModel.schemes.push({
          rules: [this.getRuleModel('new')],
          stage: this.tabSelected
        })
      }
    },
    currentTableRateHeader() {
      if (this.tabSelected == 1) {
        return [{
          label: '佣金费率',
          renewal_rate_min: 0,
          renewal_rate_max: 0,
          type: 'single'
        }]
      }
      const schemes = this.formModel.schemes
      if (!schemes.find(i => i.stage == this.tabSelected)) {
        return this.tableEmpty = true
      }
      const rules = schemes.find(i => i.stage == this.tabSelected).rules
      return rules[0].renewal_rate
    },
    currentTableData() {
      const schemes = this.formModel.schemes
      if (!schemes.find(i => i.stage == this.tabSelected)) {
        return this.tableEmpty = true
      }
      return schemes.find(i => i.stage == this.tabSelected).rules
    },
    init() {
      if (this.singleCompany) {
        this.formModel.company_id = [this.companyId]
        this.formModel.product_id = this.productId
        this.formModel.position_id = [this.positionId]
        this.getCalculateWay()
      }
      this.formModel.schemes.push({
        rules: [this.getRuleModel('new')],
        stage: '1'
      })
    },
    getCompanyCommissionDetail() {
      const data = { id: this.info.id }
      this.loading = true
      getCompanyCommissionDetail(data).then(res => {
        // this.hasCalculateWay = true
        Object.assign(this.formModel, res, {
          effect_start_at: res.effect_start_at * 1000,
          product_id: `${res.product_id}_${res.product_type}`,
          company_id: Array.isArray(res.company_id) ? res.company_id : [res.company_id],
          position_id: Array.isArray(res.position_id) ? res.position_id : [res.position_id],
        })
        this.getCalculateWay(this.formModel.product_id)
        this.getProductAttributeList()
        this.loading = false
      })
    },
    getProductAttributeList() {
      // if (this.isGetProductAttribute) return
      this.tableLoading = true
      // this.isGetProductAttribute = true
      const productId = this.formModel.product_id
      const [product_id, type] = productId.split('_')
      const data = { type, product_id }
      getProductAttributeList(data).then(res => {
        // 这里el-table有个小坑点，当外部数据更新是，table内部数据只会通过tableData进行更新渲染
        // 所以需要改变tableData去触发table里面数据绑定的变化
        this.tableData.push([1])
        this.$nextTick(() => {
          this.guaranteeList = res.guarantee
          this.paymentList = res.payment
          this.tableData.pop()
          this.tableLoading = false
        })
      })
    },
    getCompanyList() {
      getCompanyList().then(res => {
        this.companyList = res
      })
    },
    getProductList() {
      getCommissionAllProduct().then(res => {
        // this.formModel.product_id = ''
        // TODO TEST
        if (this.singleCompany) {
          this.formModel.product_id = this.productId
          this.getProductAttributeList()
        }
        this.productList = res
      })
    },
    getRuleModel(type) {
      let renewalRate
      if (type === 'new') {
        renewalRate = [{
          renewal_rate_max: '',
          renewal_rate_min: '',
          base_proportion: '',
          reward_proportion: ''
        }]
      } else {
        const rules = this.targetRules
        const { renewal_rate } = rules[0]
        renewalRate = renewal_rate.map(i => {
          return {
            renewal_rate_max: i.renewal_rate_max,
            renewal_rate_min: i.renewal_rate_min,
            base_proportion: '',
            reward_proportion: ''
          }
        })
      }
      return {
        guarantee_period: {
          guarantee_period_id: '',
          guarantee_period_unit: 0,
          guarantee_period_value: 0,
          max_guarantee_year: '',
          min_guarantee_year: ''
        },
        payment_period: {
          payment_period_id: '',
          payment_period_unit: 0,
          payment_period_value: 0
        },
        renewal_rate: renewalRate
      }
    },
    // 增加行
    addRow() {
      this.forceRenderTable(() => {
        const rules = this.targetRules
        rules.push(JSON.parse(JSON.stringify(this.getRuleModel())))
      })
    },
    // 增加列
    addCol() {
      this.forceRenderTable(() => {
        const rules = this.targetRules
        const renewalRate = {
          base_proportion: '',
          renewal_rate_max: '',
          renewal_rate_min: '',
          reward_proportion: ''
        }
        rules.map(i => {
          i.renewal_rate.push(JSON.parse(JSON.stringify(renewalRate)))
        })
      })
    },
    // 复制列
    copyCol(rate, index) {
      this.forceRenderTable(() => {
        const rules = this.targetRules
        rules.map(i => {
          const targetRate = JSON.parse(JSON.stringify(i.renewal_rate[index]))
          i.renewal_rate.push(targetRate)
        })
      })
    },
    // 复制行
    copy(index) {
      this.forceRenderTable(() => {
        const rules = this.targetRules
        const target = JSON.parse(JSON.stringify(rules[index]))
        rules.push(target)
      })
    },
    // 删除行
    remove(index) {
      this.forceRenderTable(() => {
        const rules = this.targetRules
        if (rules.length === 1) {
          return this.$message.warning('需至少一个规则')
        }
        rules.splice(index, 1)
      })
    },
    // 删除列
    removeCol(index) {
      this.forceRenderTable(() => {
        const rules = this.targetRules
        rules.map(i => {
          if (i.renewal_rate.length === 1) {
            this.$message.warning('需至少一个规则')
          } else {
            i.renewal_rate.splice(index, 1)
          }
        })
      })
    },
    forceRenderTable(callback) {
      this.tableLoading = true
      callback()
      setTimeout(() => {
        if (this.tabSelected != 1) {
          this.tableHeaderTopHack()
        }
        this.tableLoading = false
      }, 800)
    },
    closeModal(needFresh = false) {
      this.$emit('update:visible', false)
      if (needFresh) {
        this.$root.$emit('updateList')
      }
    },
    submit() {
      const { position_id, effect_start_at, product_id } = this.formModel
      if (!product_id) {
        return this.$message.warning('请选择保险产品')
      }
      if (!effect_start_at) {
        return this.$message.warning('请选择生效日期')
      }
      if (!position_id.length) {
        return this.$message.warning('请选择销售职位')
      }
      this.submitting = true
      const copyFormModel = JSON.parse(JSON.stringify(this.formModel))
      copyFormModel.schemes.map(i => {
        let min = [], max = []
        i.rules.map((y, index) => {
          const guarantee_period = y.guarantee_period
          const guarantee_period_id = guarantee_period.guarantee_period_id
          const payment_period = y.payment_period
          const payment_period_id = payment_period.payment_period_id
          if (guarantee_period_id) {
            const target = this.guaranteeList.find(z => z.id === guarantee_period_id)
            guarantee_period.guarantee_period_unit = target.unit
            guarantee_period.guarantee_period_value = target.value
          } else {
            guarantee_period.guarantee_period_id = 0
            guarantee_period.guarantee_period_unit = 0
            guarantee_period.guarantee_period_value = 0
          }
          if (payment_period_id) {
            const target = this.paymentList.find(z => z.id === payment_period_id)
            payment_period.payment_period_unit = target.unit
            payment_period.payment_period_value = target.value
          } else {
            payment_period.payment_period_id = 0
            payment_period.payment_period_unit = 0
            payment_period.payment_period_value = 0
          }

          if (!index) {
            min = y.renewal_rate.map(x => (x.renewal_rate_min || 0))
            max = y.renewal_rate.map(x => (x.renewal_rate_max || 0))
            y.renewal_rate[0].renewal_rate_min = y.renewal_rate[0].renewal_rate_min || 0
            y.renewal_rate[0].renewal_rate_max = y.renewal_rate[0].renewal_rate_max || 0
          } else {
            y.renewal_rate.map((x, idx) => {
              x.renewal_rate_min = min[idx] || 0
              x.renewal_rate_max = max[idx] || 0
            })
          }
        })
      })
      const data = Object.assign({}, copyFormModel, {
        effect_start_at: +this.formModel.effect_start_at / 1000 || '',
        product_id: this.formModel.product_id.split('_')[0],
        product_type: this.formModel.product_id.split('_')[1],
        product_name: this.productList.find(i => i.id_type === this.formModel.product_id).name
      })
      if (this.type === 'edit') {
        companyCommissionUpdate(data).then(() => {
          this.$message.success('保存成功！')
          this.closeModal(true)
        }).finally(() => {
          this.submitting = false
        })
      } else {
        companyCommissionCreate(data).then(() => {
          this.$message.success('保存成功！')
          this.closeModal(true)
        }).finally(() => {
          this.submitting = false
        })
      }
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .rate-setting-dialog {
  .header-top {
    padding-top: 2px;
    padding-bottom: 12px;
    border-bottom: 1px solid #E6E6E6;
  }
  .small-input {
    width: 60px;
  }
  .header-bottom {
    padding-top: 16px;
    .rate-input {
      width: 120px;
    }
  }
  .add-button-group {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }
  .copy-button {
    margin-right: 10px;
    color: #1F78FF;
    cursor: pointer;
  }
  .delete-button {
    color: #ff4c4c;
    cursor: pointer;
  }
  .input-number-wrap .el-input__inner {
    text-align: left;
  }
  .rate-wrap {
    align-items: flex-start;
    & > .el-form-item__content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    .payment-period-values-item {
      margin-bottom: 0;
      .el-form-item__content {
        display: flex;
        .el-input-number {
          width: 68px;
          margin-right: 8px;
        }
        & > span {
          display: inline-block;
          width: 9px;
          height: 1px;
          background: #1a1a1a;
          margin-right: 8px;
          line-height: 32px;
          transform: translateY(16px);
        }
      }
    }
    .item {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      flex-basis: calc(33.3333333% - 11px);
      margin-top: 16px;
      min-height: 336px;
      background: rgba(245, 245, 245, 1);
      border-radius: 4px;
      border: 1px solid rgba(230, 230, 230, 1);
      position: relative;
      &:nth-of-type(3n-1) {
        margin: 16px 16px 0 16px;
      }
      .head {
        height: 56px;
        border-bottom: 1px solid #e6e6e6;
        & > span {
          font-size: 16px;
          color: #1a1a1a;
          font-weight: bold;
          & > span {
            font-size: 14px;
            font-weight: normal;
            color: #1F78FF;
            display: inline-flex;
            align-items: center;
          }
        }
        & > i {
          color: #ff4c4c;
          cursor: pointer;
          font-size: 16px;
        }
      }
      .content {
        background: #ffffff;
      }
      &.add-block .el-button {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .input-number-item .el-form-item__content {
        display: flex;
        .el-input-number {
          flex: 1;
          margin-right: 4px;
          .el-input__inner {
            text-align: left;
          }
        }
      }
    }
  }
  .rate-input {
    width: 140px;
  }
  .rate-small-input {
    width: 60px;
  }
  .el-dialog__footer {
    padding-top: 20px;
  }
}
</style>