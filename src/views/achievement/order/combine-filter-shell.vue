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
      <div class="filter-item" :class="{ actived: popoverShow || isHasValue || isHasCombineValue }" slot="reference">
        <slot name="label"></slot>
        <i class="iconfont iconxiao16_xiajiantou"></i>
        <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
            v-if="hasValue(value)"
            @click="clearValue($event, value)"></i>
        <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
            v-if="hasCombineValue(combineModel)"
            @click="clearValue($event, combineModel)"></i>
      </div>
    </el-popover>
  </div>
</template>

<script>
let self = null
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

export function hasCombineValue(obj) {
  const keys = Object.keys(obj)
  const arr = keys.filter(i => obj[i])
  if (arr.length) return true
  return false
}

export function emptyValue(value) {
  if (Array.isArray(value)) {
    return []
  }
  return ''
}

export function emptyCombineValue(value) {
  const keys = Object.keys(value)
  keys.map(i => {
    value[i] = ''
  })
}

export function closePopover() {
  self.popoverShow = false
}

export function clearValue(e, value) {
  if (e.target.classList.contains('filter-clear')) {
    e.preventDefault()
    // this[key] = emptyValue(this.key)
    this.$emit('input', emptyValue(value))
    // if (hasValue(value)) {
    //   this.$emit('input', emptyValue(value))
    // }
    // if (hasCombineValue(value)) {
    //   emptyCombineValue(value)
    // }
  }
}

export default {
  props: {
    value: {
      type: [Array, String, Object, Number],
      default: ''
    },
    width: {
      type: Number,
      default: 272
    },
    combineModel: {
      type: Object,
      default: function() {
        return {}
      }
    },
    confirm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popoverShow: false
    }
  },
  computed: {
    isHasValue() {
      return hasValue(this.value)
    },
    isHasCombineValue() {
      return hasCombineValue(this.combineModel)
    }
  },
  mounted() {
    self = this
  },
  methods: {
    clearValue,
    hasValue,
    hasCombineValue
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