<template>
  <div class="card-container">
    <div class="flex-between">
      <span class="flex-between">
        <el-tag
          class="mr16"
          :type="effectStatus.find(i => i.value === info.effect_status).tag"
        >{{ info.effect_status_name }}</el-tag>
        <span class="flex-center">
          <el-tooltip content="生效日期" placement="top">
            <i class="iconfont iconxiao16_shengxiaoriqi mr4"></i>s
          </el-tooltip>
          {{ info.effect_start_at_str }}
        </span>
      </span>
      <span class="flex-center add-time">
        <el-tooltip content="添加时间" placement="top">
          <i class="iconfont iconxiao16_tianjiashijian mr4"></i>
        </el-tooltip>
        {{ formatDate(info.add_time * 1000, 'yyyy-MM-dd hh:mm:ss') }}
      </span>
    </div>
    <div class="table-body">
      <el-tabs v-model="tabIndex" size="small" class="small-tabs">
        <el-tab-pane
          v-for="(item) in tabs"
          :key="item.value"
          :name="item.value"
          :label="item.label"
        >
          <el-table
            v-if="hasTabData"
            :data="tableData"
            border
            stripe
            style="max-height: 340px;"
          >
            <el-table-column prop="paymentPeriodText"
                             label="缴费期限"
                             align="center"
                             width="100">
            </el-table-column>
            <el-table-column prop="guaranteePeriodText"
                             label="保障期限"
                             align="center"
                             width="100">
            </el-table-column>
            <el-table-column
              v-for="col in tableHeader"
              :key="col.key"
              :prop="col.key"
              align="center"
              :label="col.label"
            >
            <template slot-scope="scope">
              {{ scope.row[col.key].split('+')[0] }}
              <span style="color: #ff6600;">
                +
                {{ scope.row[col.key].split('+')[1] }}
              </span>
            </template>
            </el-table-column>
          </el-table>
          <div class="empty-table-tips" v-else>
            暂无数据
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="mt16">
      <div class="flex flex-between">
        <div class="flex">
          <span class="flex-center mr4">
            <el-tooltip content="费率计算方法" placement="top">
              <i class="iconfont iconxiao16_feishuaijisuanfangfa mr4"></i>
            </el-tooltip>{{ calculateWays.find(i => i.value === info.calculate_way).label }}
          </span>
          <!-- <span class="flex-center ml20">
            <el-tooltip content="达成方法" placement="top">
              <i class="iconfont iconxiao16_dachengtiaojian mr4"></i>
            </el-tooltip>续保率≥90%
          </span> -->
        </div>
        <div v-if="editable">
          <el-button type="ghost"
                     @click="remove"
                     size="small"
                     v-if="info.effect_status === effectStatusKeys.PENDING">
            <i class="iconfont iconxiao16_lajitong mr4"></i>
            删除
          </el-button>
          <el-button type="plain"
                     size="small"
                     style="margin: 0 0 0 16px"
                     @click="copyRules">
            <i class="iconfont iconxiao16_fuzhi mr4"></i>
            复制
          </el-button>
          <el-button type="plain"
                     style="margin-left: 16px"
                     v-if="info.effect_status === effectStatusKeys.PENDING"
                     @click="editRules">
            <i class="iconfont iconxiao16_bianji mr4"></i>
            编辑
          </el-button>
        </div>
      </div>
    </div>
    <rate-setting-dialog :type="type"
                         :singleCompany="true"
                         :productId="`${info.product_id}_${info.product_type}`"
                         :visible.sync="dialogVisible"
                         :info="info"></rate-setting-dialog>
  </div>
</template>

<script>
import { effectStatus, effectStatusKeys, terms, calculateWays, calculateWayKey } from "@/enums/good-manage";
import { formatDate } from "@/utils/formatTime";
import RateSettingDialog from "./rate-setting-dialog";
import { deleteCompanyCommission } from '@/apis/modules/good-manage'
import {
  guaranteePeriodUnitArray,
  paymentPeriodUnitArray,
  guaranteePeriodUnit,
  paymentPeriodUnit
} from "@/enums/common";
export default {
  props: {
    info: {
      type: Object
    },
    editable: {
      type: Boolean
    },
    tableHeaderLabel: {
      type: String
    }
  },
  components: {
    RateSettingDialog
  },
  data() {
    return {
      type: '',
      calculateWays,
      effectStatusKeys,
      tabIndex: "1",
      tabs: terms,
      effectStatus,
      dialogVisible: false,
      tableData: [],
      tableHeader: [],
      hasTabData: true
    };
  },
  watch: {
    tabIndex() {
      this.tableSetting();
    }
  },
  mounted() {
    this.tableSetting();
  },
  methods: {
    formatDate,
    copyRules() {
      this.dialogVisible = true
      this.type = 'copy'
    },
    editRules() {
      this.dialogVisible = true
      this.type = 'edit'
    },
    rowDataFormat(rules) {
      return rules.map(y => {
        if (this.info.calculate_way === calculateWayKey.SINGLEPOLICY) {
          return {
            paymentPeriodText: '全部',
            guaranteePeriodText: '全部',
            proportion: `${y.base_proportion}% + ${y.reward_proportion}%`
          }
        }
        const paymentPeriodUnitText = paymentPeriodUnitArray.find(
          i => i.value === y.payment_period_unit
        ).label;
        const paymentPeriodText =
          y.payment_period_unit === paymentPeriodUnit.SINGLE
            ? paymentPeriodUnitText
            : `${y.payment_period_value}${paymentPeriodUnitText}`;
        if (this.info.calculate_way === calculateWayKey.AGEANDGUARANTEEPERIOD) {
          const guaranteePeriodText = `${y.min_guarantee_year}年至${y.max_guarantee_year}年`
          return {
            paymentPeriodText,
            guaranteePeriodText,
            proportion: `${y.base_proportion}% + ${y.reward_proportion}%`
          };
        }
        const guaranteePeriodUnitText = guaranteePeriodUnitArray.find(
          i => i.value === y.guarantee_period_unit
        ).label;
        const guaranteePeriodText =
          y.guarantee_period_unit === guaranteePeriodUnit.LIFELONG
            ? guaranteePeriodUnitText
            : `${y.guarantee_period_value}${guaranteePeriodUnitText}`;
        return {
          paymentPeriodText,
          guaranteePeriodText,
          proportion: `${y.base_proportion}% + ${y.reward_proportion}%`
        };
      })
    },
    tableSetting() {
      if (this.tabIndex == 1) {
        this.hasTabData = true
        this.tableData = this.info.schemes
          .filter(i => i.stage == this.tabIndex)
          .reduce((prev, next) => {
            const rules = next.rules;
            const data = this.rowDataFormat(rules)
            return prev.concat(data);
          }, []);
        this.tableHeader = [{ label: this.tableHeaderLabel, key: "proportion" }];
      } else {
        const targetSchemes = this.info.schemes.filter(i => i.stage == this.tabIndex);
        if (targetSchemes.length) {
          this.hasTabData = true
          const header = targetSchemes.map((i, index) => {
            return {
              label: `${i.renewal_rate_min}% ≤ 续保率 ＜ ${i.renewal_rate_max}%`,
              key: `proportion${index}`
            }
          })
          let data = this.rowDataFormat(targetSchemes[0].rules)
          targetSchemes.map((i, index) => {
            data = data.map((y, idx) => {
              return Object.assign(y, {
                [`proportion${index}`]: `${i.rules[idx].base_proportion}% + ${i.rules[idx].reward_proportion}%`
              })
            })
          })
          this.tableHeader = header
          this.tableData = data
          } else {
            this.hasTabData = false
          }
      }
    },
    remove() {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('i', { class: {
              iconfont: true,
              'iconzhong20_gantanhao': true
            },
            style: {
              color: 'red',
              marginRight: '10px'
            }
          }),
          h('span', null, '是否确认删除？删除后不可恢复。')
        ]),
        confirmButtonClass: 'el-button--danger',
        showCancelButton: true
      })
      .then(() => {
        const data = { id: this.info.id }
        deleteCompanyCommission(data).then(() => {
          this.$root.$emit('updateList')
        })
      })
      .catch(() => {
        
      });
      // this.$confirm("是否确认删除？删除后不可恢复。", "提示")
      //   .then(() => {
      //     const data = { id: this.info.id }
      //     deleteCompanyCommission(data).then(() => {
      //       this.$root.$emit('updateList')
      //     })
      //   })
      //   .catch(() => {
          
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
.card-container {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  &:first-child {
    margin-top: 0;
  }
  .add-time {
    color: #ccc;
  }
  .table-body {
    margin-top: 20px;
  }
}
.empty-table-tips {
  padding: 30px;
  text-align: center;
}
</style>