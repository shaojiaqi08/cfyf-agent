<template>
  <el-dialog
    title="减保演算"
    :visible="visible"
    width="1200px"
    :close-on-click-modal="false"
    @close="closeDialog">
    <div class="tips">
      {{data.proposal_product_name}}
      <span>内部收益率 = {{Number(irr) && Number(irr).toFixed(3) || '-'}} %</span>
    </div>
    <el-table
      :max-height="520"
      :data="tableData"
      width="100%"
      stripe
      v-loading="calcing"
      border>
      <el-table-column label="保单年度" align="center">
        <template v-slot="{ $index }">{{$index + 1}}</template>
      </el-table-column>
      <el-table-column label="现金价值" align="center" prop="cash_value"></el-table-column>
      <el-table-column label="减保领取" align="center">
        <template v-slot="{ row, $index }">
          <div style="text-align: left">
            <el-input-number
              v-model="row.reduction"
              :controls="false"
              :min="0"
              style="width: 176px"
              @change="handleChange"
            ></el-input-number>
            <el-button
              type="text"
              icon="iconfont iconxiao16_xiazhixiangjiantou"
              class="ml8"
              v-if="$index != tableData.length - 1"
              @click="cutDown(row, $index)"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="减保领取总额" align="center" prop="reduce_get_total">
        <template slot-scope="{ row }">{{row.reduce_get_total != undefined ? row.reduce_get_total : '-'}}</template>
      </el-table-column>
      <el-table-column label="减保后现金价值" align="center" prop="reduce_total">
        <template v-slot="{ row }">
          <span :style="{ color: row.reduce_total < 0 ? 'red' : null }">{{row.reduce_total != undefined ? row.reduce_total : '-'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="calcIRR" :disabled="tableData.every(i => !i.reduction) || calcing" :loading="calcing">计算</el-button>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="save" :disabled="!calcRes">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // 减保演算
  import { IRRCalc, custProdIRRCalc } from '@/apis/modules/proposal'
  import { productFrom } from '../config'

  export default {
    name: 'cut-insurance-calc-dialog',
    props: {
      visible: Boolean,
      data: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        loading: false,
        calcing: false,
        tableData: [],
        irr: '',
        calcRes: null
      }
    },
    methods: {
      handleChange() {
        this.tableData.forEach(i => {
          i.reduce_get_total = ''
          i.reduce_total = ''
        })
        this.calcRes = null
        this.irr = ''
      },
      save() {
        const d = this.calcRes
        this.$emit('submit', {
          reduction_money: d.each_year_reduction,
          after_reduction_cash: d.each_year_accumulate_reduction,
          reduction_total_money: d.cash_value_after_reduction,
          after_reduction_cash_growth_rate: d.cash_value_increment_rate_after_reduction,
          flow: d.cash_flow,
          irr: d.irr
        })
        this.closeDialog()
      },
      // 减保向下
      cutDown(row, index) {
        const d = this.tableData
        for (let i = index; i < d.length - 1; i++) {
          const cur = d[i]
          const next = d[i + 1]
          next.reduction = cur.reduction
        }
      },
      // IRR公式计算
      calcIRR() {
        const d = this.data
        this.calcing = true
        const isFromInsurance = d.source === productFrom.FROM_INSURANCE
        ;(isFromInsurance ? IRRCalc : custProdIRRCalc)({
          proposal_product_id: d.id,
          gender: d.gender,
          age: d.age,
          guarantee_time: isFromInsurance ? d.guarantee_time.split('-')[0] : (d.guarantee_time || 0),
          guarantee_unit: d.guarantee_unit,
          pay_time: isFromInsurance ? d.pay_time.split('-')[0] : (d.pay_time || 0),
          pay_unit: d.pay_unit,
          guarantee_quota: d.guarantee_quota,
          premium: d.premium,
          year_reduction: JSON.stringify(this.tableData.map(i => i.reduction)),
          cash_value: JSON.stringify(d.cash_value.map(i => i.cash_value))
        }).then(res => {
          this.tableData.forEach((item, index) => {
            item.reduction = res.each_year_reduction[index]
            item.reduce_get_total = res.each_year_accumulate_reduction[index]
            item.reduce_total = res.cash_value_after_reduction[index]
          })
          this.tableData = [...this.tableData]
          this.irr = res.irr || ''
          if (res.irr) {
            this.calcRes = res
          }
        }).finally(() => {
          this.calcing = false
        })
      },
      closeDialog() {
        this.$emit('update:visible', false)
        this.tableData = []
        this.irr = ''
        this.calcRes = null
        this.loading = false
      },
      initData() {
        const { cash_value = [], year_reduction } = this.data
        this.tableData = cash_value.map((i, index) => ({
          cash_value: i.cash_value,
          reduction: year_reduction ? year_reduction.reduction_money[index] : 0,
          reduce_get_total: year_reduction ? year_reduction.after_reduction_cash[index] : '',
          reduce_total: year_reduction ? year_reduction.reduction_total_money[index] : ''
        }))
        if (year_reduction) {
          this.irr = year_reduction.irr
        }
      }
    },
    watch: {
      visible(v) {
        v && this.initData()
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/ .el-dialog{
    margin-top: 10vh!important;
    .el-dialog__body {
      .tips {
        height: 54px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        color: #333;
        font-size: 16px;
        background: #F5F5F5;
        border-radius: 4px;
        border: 1px solid #E6E6E6;
        margin-bottom: 16px;
        & > span {
          font-size: 14px;
          margin-left: 16px;
        }
      }
    }
  }

  /deep/ .el-table {
    th{
      background-color: #f5f5f5;
      border-right: 1px solid rgba(0, 0, 0, .1);
      border-bottom: 1px solid rgba(0, 0, 0, .1);
    }
    &::before {
      background-color: rgba(0, 0, 0, .1);
    }
    &.el-table--border {
      border: 1px solid rgba(0, 0, 0, .1);
      border-bottom: transparent;
    }
  }
</style>
