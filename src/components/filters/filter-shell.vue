<template>
  <div class="filter-bar">
    <el-popover
      placement="bottom"
      :width="width"
      v-model="popoverShow"
      popper-class="filter-popover"
      trigger="click"
    >
      <div class="inner-box">
        <slot></slot>
      </div>
      <div class="filter-item" :class="{ actived: popoverShow || isHasValue }" slot="reference">
        <slot name="label"></slot>
        <i class="iconfont iconxiao16_xiajiantou"></i>
        <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
            v-if="hasValue(value)"
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
    }
  },
  mounted() {
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
}
.filter-popover {
  .inner-box {
    padding: 16px;
  }
}
</style>