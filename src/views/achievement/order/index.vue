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
      <div class="filter-bar">
        <el-popover
          placement="bottom"
          width="272"
          v-model="filterValue"
          popper-class="filter-popover"
          trigger="click"
        >
          <div class="inner-box">
            <el-select class="block" v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-item" :class="{ actived: filterValue }" slot="reference">
            全部保单状态
            <i class="iconfont iconxiao16_xiajiantou"></i>
          </div>
        </el-popover>
        <!-- <div class="filter-item">
            全部保单状态
            <i class="iconfont iconxiao16_xiajiantou"></i>
        </div>-->
      </div>
      <div class="data-row" ref="dataRow">
        <el-button
          class="left"
          icon="el-icon-arrow-left"
          circle
          plain
          v-if="scrol2Lvisible"
          @click="scrollTo(0)"
        ></el-button>
        <div class="scroll-wrap" :style="{transform: `translateX(${scrollTranslateX}px)`}">
          <div class="item-block">
            <div>
              承保保费总计(元)
              <span class="primary">123023320.00</span>
            </div>
            <div>
              有效出单件数
              <span>2</span>
            </div>
            <div>
              保单件均数(元)
              <span>11234.3</span>
            </div>
          </div>
          <div class="item-block">
            <div>
              净收保费(元)
              <span class="primary">123023320.00</span>
            </div>
            <div>
              投保保费总计(元)
              <span class="primary">2</span>
            </div>
            <div>
              未支付保费总计(元)
              <span class="warning">11234.3</span>
            </div>
            <div>
              犹退保费总计(元)
              <span class="danger">11234.3</span>
            </div>
            <div>
              退保保费总计(元)
              <span class="danger">11234.3</span>
            </div>
          </div>
          <div class="item-block">
            <div>
              犹退件数
              <span>123023320.00</span>
            </div>
            <div>
              犹退件均(元)
              <span>2</span>
            </div>
            <div>
              非犹退保费(元)
              <span>11234.3</span>
            </div>
            <div>
              非犹退件数
              <span>11234.3</span>
            </div>
            <div>
              非犹退件均(元)
              <span>1466</span>
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
      <el-table :data="tableData" max-height="626px" border stripe :loading="tableLoading">
        <el-table-column label="产品名称" prop></el-table-column>
        <el-table-column label="保险公司" prop></el-table-column>
        <el-table-column label="所属销售" prop></el-table-column>
        <el-table-column label="保单状态" prop></el-table-column>
        <el-table-column label="保费" prop></el-table-column>
        <el-table-column label="投保时间" prop></el-table-column>
        <el-table-column label="承保时间" prop></el-table-column>
        <el-table-column label="回访成功日期" prop width="150"></el-table-column>
        <el-table-column label="过犹日期" prop></el-table-column>
        <el-table-column label="是否犹退" prop></el-table-column>
        <el-table-column label="投保人" prop></el-table-column>
        <el-table-column label="被保人" prop></el-table-column>
        <el-table-column label="保额" prop></el-table-column>
        <el-table-column label="缴费期限" prop></el-table-column>
        <el-table-column label="保障日期" prop></el-table-column>
        <el-table-column label="保单号" prop></el-table-column>
        <el-table-column label="投保单号" prop></el-table-column>
        <el-table-column label="操作" prop fixed="right" width="200">
          <template slot-scope="{row}">
            <el-button type="text" size="mini">订单详情</el-button>
            <el-button type="text" size="mini" @click="showBelongDialog(row)">修改归属</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-modal :show.sync="belongVisible"></edit-modal>
  </div>
</template>

<script>
import EditModal from "./modal/edit";
// 业绩-订单
export default {
  name: "order",
  components: {
    EditModal
  },
  data() {
    return {
      filterValue: "",
      belongVisible: false,
      belongData: {},
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
      value: "",
      tableData: [
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 },
        { id: 0 }
      ],
      tableLoading: false,
      scrol2Lvisible: false,
      scrol2Rvisible: false,
      scrollTranslateX: 0,
      searchModel: {}
    };
  },
  methods: {
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
    ajaxData() {},
    showBelongDialog(row) {
      this.belongData = row;
      this.belongVisible = true;
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
    this.ajaxData();
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
.filter-item {
  display: inline-block;
  margin-right: 16px;
  padding: 4px 12px;
  color: #1a1a1a;
  font-size: 14px;
  background-color: #f5f5f5;
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  &.actived {
    color: #FF9000;
    background-color: rgba(255, 144, 0, 0.1);
    border-color: #FF9000;
  }
}
.filter-popover {
  .inner-box {
    padding: 16px;
  }
}
</style>