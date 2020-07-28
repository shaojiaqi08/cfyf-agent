<template>
  <el-dialog
          title="修改密码"
          :visible="show"
          width="480px"
          :before-close="handleClose">
    <el-form class="form"
             label-width="100px"
             label-position="left"
             ref="form"
             :model="formModel"
             :rules="rules">
      <el-form-item label="旧密码" prop="old_password">
        <el-input auto-complete="off" type="password" v-model="formModel.old_password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input auto-complete="off" type="password" v-model="formModel.password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirm_password">
        <el-input auto-complete="off" type="password" v-model="formModel.confirm_password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="submitting" :disabled="submitting">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {updatePassword} from '@/apis/modules/index'
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
          old_password: '',
          password: '',
          confirm_password: ''
        },
        rules: {
          old_password: [baseValiObj, {validator: this.pwdValidator}],
          password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}],
          confirm_password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}],
        }
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate(flag => {
          if (flag) {
            this.submitting = true
            updatePassword.then(() => {
              this.$message.success('密码修改成功!')
              this.handleClose()
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
        if (value.length < 6) {
          return callback(new Error('密码至少是6位任意字符'))
        }
        callback()
      },
      comparePwdValitator(rule, value, callback) { // eslint-disable-line
        const {password, confirm_password} = this.formModel
        if (!password || !confirm_password) {
          callback()
        } else if(password !== confirm_password) {
          callback(new Error('确认新密码必须跟新密码一致'))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .form .el-form-item__label::before{
    display: none;
  }
</style>