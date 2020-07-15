<template>
  <div class="order-container">
    <div class="header">
      订单
      <div class="flex-between">
        <el-button size="small" type="primary" class="mr10" icon="iconfont iconxiao16_xiazai">导出数据</el-button>
        <el-input placeholder="搜索单号或投被保人信息" size="small">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
    <div class="scrollbox">
      <filter-shell v-model="value" @input="valueChange">
        <el-select class="block"
                   v-model="value"
                   multiple
                   ref="focusRef"
                   clearable
                   filterable
                   placeholder="请选择"
                   @change="valueChange">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <template v-slot:label>
          <span>
              {{ hasValue(value) ? value.map(i => options.find(y => y.value === i).label).join(',') : '全部保单状态' }}
          </span>
        </template>
        <!-- <template v-slot:close>
            <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
               v-if="hasValue(value)"
               @click="clearValue($event, 'value')"></i>
        </template> -->
      </filter-shell>
      <filter-shell v-model="value1">
        <el-select class="block"
                   v-model="value1"
                   clearable
                   filterable
                   ref="focusRef"
                   placeholder="请选择"
                   @change="closePopover">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <template v-slot:label>
            <span>
                {{ hasValue(value1) ? options.find(i => i.value === value1).label : '全部保单状态' }}
            </span>
        </template>
        <template v-slot:close>
            <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
               v-if="hasValue(value1)"
               @click="clearValue($event, 'value1')"></i>
        </template>
      </filter-shell>
      <!-- <filter-shell v-model="value1" :width="260">
        <el-date-picker
          v-model="value1"
          type="date"
          value-format="timestamp"
          placeholder="选择日期"
          @change="closePopover">
        </el-date-picker>
        <template v-slot:label>
            <span>{{ value1 ? formatDate(value1, 'yyyyMMdd') : '请选择日期' }}</span>
        </template>
      </filter-shell> -->
      <!-- <filter-shell v-model="value1" :width="400">
        <el-date-picker v-model="value1"
                        type="daterange"
                        value-format="timestamp"
                        placeholder="选择日期"
                        @change="closePopover"></el-date-picker>
        <template v-slot:label>
            <span>
              {{ hasValue(value1) ? `${formatDate(value1[0], 'yyyyMMdd')} ~ ${formatDate(value1[1], 'yyyyMMdd')}` : '请选择日期' }}
            </span>
        </template>
      </filter-shell> -->
      <!-- <filter-shell :combineModel.sync="formValue" confirm :width="400">
        <el-input v-model="formValue.value2"></el-input>
        <el-select v-model="formValue.value3">
          <el-option value="1" label="dsd">dsd</el-option>
        </el-select>
        <el-button @click="closePopover">@</el-button>
        <template v-slot:label>
            <span>
              {{ hasCombineValue(formValue) ? `${formValue.value2}(${formValue.value3})` : '请选择详细' }}
            </span>
        </template>
      </filter-shell> -->
      <div class="data-row" ref="dataRow">
        <el-button
          class="left"
          icon="el-icon-arrow-left"
          circle
          plain
          v-if="scrol2Lvisible"
          @click="scrollTo(0)"
        ></el-button>
        <div class="scroll-wrap"
             :style="{transform: `translateX(${scrollTranslateX}px)`}"
             v-loading="statisticLoading">
          <div class="item-block">
            <div>
              承保保费总计(元)
              <span class="primary">
                {{ statisticInfo.actual_underwrite_total_premium }}
              </span>
            </div>
            <div>
              有效出单件数
              <span>
                {{ statisticInfo.total_premium }}
              </span>
            </div>
            <div>
              保单件均数(元)
              <span>
                {{ statisticInfo.actual_underwrite_average_premium }}
              </span>
            </div>
          </div>
          <div class="item-block">
            <div>
              净收保费(元)
              <span class="primary">
                {{ statisticInfo.actual_premium }}
              </span>
            </div>
            <div>
              投保保费总计(元)
              <span class="primary">
                {{ statisticInfo.total_premium }}
              </span>
            </div>
            <div>
              未支付保费总计(元)
              <span class="warning">
                {{ statisticInfo.unpaid_total_premium }}
              </span>
            </div>
            <div>
              犹退保费总计(元)
              <span class="danger">
                {{ statisticInfo.hesitation_surrender_premium }}
              </span>
            </div>
            <div>
              退保保费总计(元)
              <span class="danger">
                {{ statisticInfo.surrender_premium }}
              </span>
            </div>
          </div>
          <div class="item-block">
            <div>
              犹退件数
              <span>
                {{ statisticInfo.hesitation_surrender_count }}
              </span>
            </div>
            <div>
              犹退件均(元)
              <span>
                {{ statisticInfo.average_hesitation_surrender_premium }}
              </span>
            </div>
            <div>
              非犹退保费(元)
              <span>
                {{ statisticInfo.non_hesitation_surrender_premium }}
              </span>
            </div>
            <div>
              非犹退件数
              <span>
                {{ statisticInfo.non_hesitation_surrender_count }}
              </span>
            </div>
            <div>
              非犹退件均(元)
              <span>
                {{ statisticInfo.average_non_hesitation_surrender_premium }}
              </span>
            </div>
          </div>
        </div>
        <el-button
          class="right"
          icon="el-icon-arrow-right"
          circle
          plain
          v-if="scrol2Rvisible"
          @click="scrollTo(1)"
        ></el-button>
      </div>
      <el-table :data="list" max-height="626px" border stripe v-loading="tableLoading">
        <el-table-column label="产品名称" prop="product_name"></el-table-column>
        <el-table-column label="保险公司" prop="supplier_name"></el-table-column>
        <el-table-column label="所属销售" prop="sales_real_name"></el-table-column>
        <el-table-column label="保单状态" prop="policy_status_str"></el-table-column>
        <el-table-column label="保费" prop="premium"></el-table-column>
        <el-table-column label="投保时间" prop="proposal_at">
          <template slot-scope="{row}">
            {{ formatDate(row.proposal_at * 1000, 'yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="承保时间" prop="policy_at">
          <template slot-scope="{row}">
            {{ formatDate(row.policy_at * 1000, 'yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="回访成功日期" prop="" width="150"></el-table-column> -->
        <el-table-column label="过犹日期" prop="over_hesitation_at">
          <template slot-scope="{row}">
            {{ formatDate(row.over_hesitation_at * 1000, 'yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="是否犹退" prop="is_hesitate_surrender_str"></el-table-column>
        <el-table-column label="投保人" prop="policy_holder_name"></el-table-column>
        <el-table-column label="被保人" prop="policy_recognizee_name"></el-table-column>
        <el-table-column label="保额" prop="guarantee_quota_str"></el-table-column>
        <el-table-column label="缴费期限" prop="payment_period_desc"></el-table-column>
        <el-table-column label="保障日期" prop="guarantee_period_desc">
          <template slot-scope="{row}">
            {{ formatDate(row.guarantee_period_desc * 1000, 'yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="保单号" prop="policy_sn"></el-table-column>
        <el-table-column label="投保单号" prop="proposal_sn"></el-table-column>
        <el-table-column label="操作" prop fixed="right" width="200">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="showInfoDialog(row)">订单详情</el-button>
            <el-button type="text" size="mini" @click="showBelongDialog(row)">修改归属</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-modal :show.sync="belongVisible"
                :belongData="belongData"
                @update="getManagementPolicyList"></edit-modal>
  </div>
</template>

<script>
import EditModal from "./modal/edit";
import { getManagementPolicyList, getManagementPolicyStatistics } from '@/apis/modules/achievement'
import { formatDate } from '@/utils/formatTime'
import FilterShell, { clearValue, hasValue, closePopover } from './filter-shell'
// 业绩-订单
export default {
  name: "order",
  components: {
    EditModal,
    FilterShell
  },
  data() {
    return {
      formatDate,
      filterValue: false,
      belongVisible: false,
      belongData: {},
      list: [],
      statisticInfo: {},
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: [],
      value1: '',
      formValue: {
        value2: '',
        value3: ''
      },
      value2: '',
      value3: '',
      tableLoading: true,
      statisticLoading: true,
      scrol2Lvisible: false,
      scrol2Rvisible: false,
      scrollTranslateX: 0,
      searchModel: {}
    };
  },
  methods: {
    valueChange(v) {
      console.log(v, '++++')
    },
    closePopover,
    hasValue,
    clearValue,
    // dir 0: 左 1: 右
    scrollTo(dir) {
      const { scrollTranslateX: oldTranX } = this;
      const el = this.$refs.dataRow;
      const { offsetWidth } = el;
      const { offsetWidth: warpWidth } = el.querySelector(".scroll-wrap");
      let newTranX = oldTranX + (dir ? -100 : 100);
      if (dir) {
        const limitX = offsetWidth - warpWidth;
        newTranX = Math.max(newTranX, limitX);
        this.scrol2Rvisible = newTranX !== limitX;
        this.scrol2Lvisible = true;
      } else {
        newTranX = Math.min(0, newTranX);
        this.scrol2Lvisible = !!newTranX;
        this.scrol2Rvisible = true;
      }
      this.scrollTranslateX = newTranX;
    },
    // 检测数据栏是否需要滚动
    checkNeedScroll() {
      const { offsetWidth } = this.$refs.dataRow;
      const { offsetWidth: warpWidth } = this.$refs.dataRow.querySelector(
        ".scroll-wrap"
      );
      if (warpWidth - 16 > offsetWidth) {
        this.scrol2Lvisible = false;
        this.scrol2Rvisible = true;
        this.scrollTranslateX = 0;
      } else {
        this.scrol2Lvisible = false;
        this.scrol2Rvisible = false;
        this.scrollTranslateX = 0;
      }
    },
    showInfoDialog(row) {
      this.$router.push({ path: `/order/detail/${row.id}` })
    },
    showBelongDialog(row) {
      this.belongData = row;
      this.belongVisible = true;
    },
    getManagementPolicyList() {
      getManagementPolicyList().then(res => {
        this.tableLoading = false
        this.list = res.data
      })
      .catch(err => {
        console.log(err)
        this.tableLoading = false
      })
    },
    getManagementPolicyStatistics() {
      getManagementPolicyStatistics().then(res => {
        this.statisticInfo = res
        this.statisticLoading = false
      })
      .catch(err => {
        console.log(err)
        this.statisticLoading = false
      })
    }
  },
  watch: {
    belongVisible(v) {
      if (!v) {
        this.belongData = {};
      }
    }
  },
  created() {
    this.getManagementPolicyList()
    this.getManagementPolicyStatistics()
  },
  mounted() {
    this.checkNeedScroll();
    window.addEventListener("resize", this.checkNeedScroll);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkNeedScroll);
  }
};
</script>
<style lang="scss" scoped>
.scrollbox {
  padding: 16px;
  background-color: #fff;
}
.order-container {
  padding: 20px 20px 0 20px;
  .header {
    font-size: 16px;
    font-weight: bold;
    padding: 0 16px;
    height: 56px;
    background: #f5f5f5;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-input {
      width: 360px;
    }
  }

  & ::v-deep .el-scrollbar {
    height: calc(100vh - 78px);
    padding-top: 16px;
    box-sizing: border-box;
    & .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }

    .el-scrollbar__bar {
      z-index: 999;
    }
  }

  .data-row {
    padding: 16px 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    .scroll-wrap {
      float: left;
      transition: all 0.3s ease-out;
      .item-block {
        background: #f5f5f5;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        display: inline-flex;
        margin-right: 16px;

        & > div {
          margin: 8px;
          padding: 0 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          line-height: 20px;
          color: #333;

          & > span {
            font-weight: bold;
            font-size: 16px;
            line-height: 24px;
            white-space: nowrap;
            &.primary {
              color: #ff9000;
            }
            &.warning {
              color: #4497eb;
            }
            &.danger {
              color: #ff5151;
            }
          }
        }
      }
      .item-block:last-of-type {
        margin-right: 0;
      }
    }

    .el-button {
      position: absolute;
      padding: 0;
      min-width: initial;
      width: 32px;
      top: 50%;
      transform: translateY(-50%);
      box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.1);
      border: transparent;
      color: #ff9000;
      z-index: 99;
      &.left {
        left: 16px;
      }
      &.right {
        right: 16px;
      }
    }
  }

  .el-dialog__wrapper ::v-deep .belong-dialog {
    width: 200px;
    .el-dialog__body {
      .card {
        background: #f5f5f5;
        border: 1px solid #e6e6e6;
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 20px;
        & > .el-row:nth-of-type(1) {
          .el-col:first-of-type {
            font-weight: bold;
            color: #1a1a1a;
          }
        }
        & > .el-row:nth-of-type(2) {
          margin-top: 16px;
          .el-col {
            display: flex;
            flex-direction: column;
            line-height: 20px;
            color: #999999;
            font-size: 14px;
            span {
              margin-top: 4px;
              color: #1a1a1a;
              font-weight: bold;
            }
          }
        }
        .el-divider {
          margin: 16px 0;
        }
        & > .el-row:nth-of-type(4) {
          margin-top: 16px;
          .el-col {
            display: flex;
            line-height: 20px;
            color: #999999;
            font-size: 14px;
            align-items: center;
            span {
              color: #1a1a1a;
              font-weight: 400;
              margin-left: 8px;
            }
          }
        }
      }
    }
    .el-dialog__footer {
      padding-top: 0;
    }
    .el-form-item .el-select {
      width: 100%;
    }
  }
}
</style>