<template>
  <div
    class="text-hidden-ellipsis-component"
    :style="{ width: computedWidth, maxWidth: computedMaxWidth }"
    ref="container"
    v-on="$listeners"
  >
    <div
      :class="['text', hiddenEllipsis ? 'text-hidden-ellipsis' : '']"
      :style="{ paddingRight: hiddenEllipsis ? '16px' : '', 'text-align': align }"
    >
      <span ref="text">
        <slot>{{popoverTip}}</slot>
      </span>
    </div>
    <el-popover
      :placement="placement"
      trigger="hover"
      :content="popoverTip"
      v-if="hiddenEllipsis"
    >
      <i
        slot="reference"
        class="icon iconfont iconxiao16_gengduoxinxi fw400"
      ></i>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: [String, Number],
      default: 110
    },
    popoverTip: {
      type: String
    },
    placement: {
      type: String,
      default: 'top'
    },
    maxWidth: {
      type: [String, Number],
      default: ''
    },
    align: {
      type: String,
      default: 'left'
    }
  },
  computed: {
    computedWidth() {
      const { width } = this
      return typeof width === 'number' ? width + 'px' : width
    },
    computedMaxWidth() {
      const { maxWidth } = this
      return typeof width === 'number' ? maxWidth + 'px' : maxWidth
    }
  },
  data() {
    return {
      hiddenEllipsis: false
    }
  },
  updated() {
    if (this.$refs.text.offsetWidth > this.$refs.container.offsetWidth) {
      this.hiddenEllipsis = true
    } else {
      this.hiddenEllipsis = false
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.text.offsetWidth > this.$refs.container.offsetWidth) {
        this.hiddenEllipsis = true
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.text-hidden-ellipsis-component {
  font-size: 14px;
  position: relative;
  .text {
    white-space: nowrap;
  }
  .iconfont {
    font-size: 16px;
  }
  .icon {
    position: absolute;
    right: 0;
    top: -2px;
    color: #1F78FF;
    line-height: 24px;
  }
}
</style>
