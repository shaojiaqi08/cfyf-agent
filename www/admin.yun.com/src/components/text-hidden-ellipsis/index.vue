<template>
  <div
    class="text-hidden-ellipsis-component"
    :style="{ width: parseInt(width) + 'px' }"
  >
    <div
      :class="['text', hiddenEllipsis ? 'text-hidden-ellipsis' : '']"
      :style="{ paddingRight: hiddenEllipsis ? '16px' : '' }"
    >
      <span ref="text"><slot></slot></span>
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
    }
  },
  data() {
    return {
      hiddenEllipsis: false
    }
  },
  updated() {
    if (this.$refs.text.offsetWidth > parseInt(this.width)) {
      this.hiddenEllipsis = true
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.text.offsetWidth > parseInt(this.width)) {
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
    display: block;
    white-space: nowrap;
  }
  .iconfont {
    font-size: 16px;
  }
  .icon {
    position: absolute;
    right: 0;
    top: 0;
    color: #1F78FF;
  }
}
</style>
