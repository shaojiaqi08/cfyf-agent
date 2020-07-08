<template>
  <el-dialog
    title="修改密码"
    :visible="show"
    width="30%"
    :before-close="handleClose">
    <el-form inline
             label-width="100px"
             label-position="left">
      <el-form-item label="旧密码">
        <el-input type="password" v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input type="password" v-model="name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      dialogVisible: false,
      name: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>