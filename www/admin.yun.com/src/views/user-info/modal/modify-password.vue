<template>
  <el-dialog
          title="修改密码"
          :visible="show"
          width="480px"
          :close-on-click-modal="false"
          :before-close="handleClose">
    <el-form class="form"
             label-width="100px"
             label-position="left"
             ref="form"
             :model="formModel"
             :rules="rules">
      <el-form-item label="旧密码" prop="password">
        <el-input auto-complete="off" placeholder="请输入旧密码" type="password" v-model="formModel.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input auto-complete="off" type="password" placeholder="请输入新密码" v-model="formModel.new_password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirm_new_password">
        <el-input auto-complete="off" type="password" placeholder="请再次输入新密码" v-model="formModel.confirm_new_password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="submitting" :disabled="submitting">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {updatePassword} from '@/apis/modules'
  export default {
    props: {
      show: {
        required: true,
        type: Boolean
      }
    },
    data() {
      const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
      return {
        dialogVisible: false,
        submitting: false,
        formModel: {
          password: '',
          new_password: '',
          confirm_new_password: ''
        },
        rules: Object.freeze({
          password: [baseValiObj, {validator: this.pwdValidator}],
          new_password: [baseValiObj, {validator: this.pwdValidator}],
          confirm_new_password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValidator}],
        })
      }
    },
    methods: {
      submit() {
        const form = this.$refs.form
        form.validate(flag => {
          if (flag) {
            this.submitting = true
            updatePassword(this.formModel).then(() => {
              this.$message.success('密码修改成功!')
              this.$store.dispatch('users/loginOut')
              this.$router.replace('/login')
            }).finally(() => {
              this.submitting = false
            })
          }
        })
      },
      handleClose() {
        this.$emit('update:show', false)
      },
      pwdValidator(rule, value, callback) {
        if (value.length < 5) {
          return callback(new Error('密码至少是5位任意字符'))
        }
        callback()
      },
      comparePwdValidator(rule, value, callback) { // eslint-disable-line
        const {new_password, confirm_new_password} = this.formModel
        if (!new_password || !confirm_new_password) {
          return callback()
        } else if(new_password !== confirm_new_password) {
          return callback(new Error('确认新密码必须跟新密码一致'))
        }
        callback()
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .form .el-form-item__label::before{
    display: none;
  }
  ::v-deep .el-dialog__body{
    overflow: visible;
  }
</style>