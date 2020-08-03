<template>
  <div class="filter-bar">
    <el-popover
            placement="bottom"
            :width="width"
            v-model="popoverShow"
            popper-class="filter-popover"
            trigger="click"
    >
      <div class="inner-box" :class="{ noPadding }">
        <slot></slot>
      </div>
      <div class="filter-item" :class="{ actived: popoverShow || isHasValue }" slot="reference">
        <span>{{filterValue}}</span>
        <el-badge type="primary"
                  class="ml4"
                  v-if="collapse && Array.isArray(value) && value.length > 1"
                  :value="value.length"></el-badge>
        <i class="iconfont iconxiao16_xiajiantou" style="margin-left: 2px"></i>
        <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
           v-if="clearable && hasValue(value)"
           @click.prevent.stop="clearValue($event, value)"></i>
      </div>
    </el-popover>
  </div>
</template>

<script>
  export function hasValue(value) {
    if (Array.isArray(value)) {
      if (value.length) {
        return true
      }
      return false
    }
    if (value) {
      return true
    }
    return false
  }

  export function emptyValue(value) {
    if (Array.isArray(value)) {
      return []
    }
    return ''
  }

  export function clearValue(e, value) {
    this.$emit('input', emptyValue(value))
  }

  export default {
    props: {
      value: {
        type: [Array, String, Object, Number],
        default: ''
      },
      // 容器宽度
      width: {
        type: Number,
        default: 272
      },
      // 筛选项选择后是否自动关闭
      autoClose: {
        type: Boolean,
        default: false
      },
      // 是否自动聚焦选择框
      autoFocus: {
        type: Boolean,
        default: false
      },
      // 弹出框是否有内边距
      noPadding: {
        type: Boolean,
        default: false
      },
      // 是否可清除数据
      clearable: {
        type: Boolean,
        default: true
      },
      // 是否折叠
      collapse: {
        type: Boolean,
        default: true
      },
      // 是否省略文本
      textOverflow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        popoverShow: false
      }
    },
    watch: {
      value() {
        if (this.autoClose) {
          this.popoverShow = false
        }
      },
      popoverShow(v) {
        if (v) {
          if (this.autoFocus) {
            this.$nextTick(() => {
              this.$slots.default[0].child.focus()
            })
          }
        }
      }
    },
    computed: {
      isHasValue() {
        return hasValue(this.value)
      },
      // 处理通过插槽传入的文本
      filterValue() {
        const {text, children} = this.$slots.label[0]
        let txt = (text || (children[0] && children[0].text) || '').trim()
        return this.textOverflow ?
                  txt.length > 8 ? `${txt.slice(0, 8)}...` : txt :
                  txt
      }
    },
    methods: {
      clearValue,
      hasValue
    }
  }
</script>

<style lang="scss">
  .filter-bar {
    display: inline-block;
  }
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
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;
    }
    & > .el-badge .el-badge__content{
      top: -1px;
      line-height: 16px;
    }
  }
  .filter-popover {
    .inner-box {
      padding: 16px;
      &.noPadding {
        padding: 0;
      }
    }
  }
  .filter-shell-list {
    padding: 10px 0 4px;
    .filter-list-item {
      width: 100%;
      height: 34px;
      line-height: 34px;
      text-align: center;
      cursor: pointer;
      &.actived {
        background: #fff3e5;
        color: #ffa531;
      }
      &:hover {
        background: #fff3e5;
        color: #ffa531;
      }
    }
  }
</style>