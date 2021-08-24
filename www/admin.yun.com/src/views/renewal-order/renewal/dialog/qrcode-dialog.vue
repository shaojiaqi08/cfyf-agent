<template>
  <el-dialog
      :visible="visible"
      title="续保链接二维码"
      width="400px"
      @close="handleClose">
    <p class="title">扫描二维码后，可转发链接给客户</p>
    <el-image :src="src"></el-image>
  </el-dialog>
</template>

<script>
export default {
  name: 'qrcode-dialog',
  props: {
    visible: Boolean,
    src: String
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep .el-dialog__body {
    text-align: center;
    .title {
      font-size: 11px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 16px;
      margin-bottom: 10px;
    }
    .el-image {
      width: 248px;
      height: 248px;
    }
  }
  ::v-deep .el-dialog__footer .el-button {
    width: 114px;
  }
</style>
