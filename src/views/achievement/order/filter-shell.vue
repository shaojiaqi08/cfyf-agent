<template>
  <div class="filter-bar">
    <el-popover
      placement="bottom"
      width="272"
      v-model="popoverShow"
      popper-class="filter-popover"
      trigger="click"
    >
      <div class="inner-box">
        <slot></slot>
      </div>
      <div class="filter-item" :class="{ actived: popoverShow }" slot="reference">
        {{ label }}
        <i class="iconfont iconxiao16_xiajiantou"></i>
        <i class="filter-clear iconfont iconxiao16_yuanxingchahao"></i>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '-'
    },
    value: {
      type: [Array, String, Object]
    }
  },
  data() {
    return {
      popoverShow: false,
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
      // value: ""
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-item {
  display: inline-block;
  position: relative;
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
    .filter-clear {
      display: block;
    }
  }
  &.actived {
    color: #FF9000;
    background-color: rgba(255, 144, 0, 0.1);
    border-color: #FF9000;
  }
  .filter-clear {
    display: none;
    position: absolute;
    top: -8px;
    right: -8px;
    width: 16px;
    height: 16px;
    color: #FF5D5D;
    cursor: pointer;
  }
}
.filter-popover {
  .inner-box {
    padding: 16px;
  }
}
</style>