<template>
  <el-dialog
      :visible="visible"
      title=""
      @close="handleClose">
    <div #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button @click="handleEnter">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'qrcode-dialog'
  props: {
    visible: Boolean
  },
  methods: {
    handleEnter() {
      this.$emit('handleSuccess')
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
