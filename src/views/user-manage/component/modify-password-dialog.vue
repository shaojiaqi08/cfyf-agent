<template>
    <el-dialog custom-class="manager-dialog"
               title="重置密码"
               :visible="visible"
               width="480px"
               @close="handleClose"
               :close-on-click-modal="false">
        <el-form ref="form" :model="formModel" :rules="rules" label-width="100px" label-position="left">
            <el-form-item label="新密码" prop="new_password">
                <el-input auto-complete="new_password" type="password" placeholder="请输入密码" v-model.trim="formModel.new_password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirm_new_password">
                <el-input auto-complete="new_password" type="password" placeholder="请再次输入新密码" v-model.trim="formModel.confirm_new_password"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitting" :disabled="submitting">确认</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        name: 'modify-password-dialog',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            submitting: {
                type: Boolean,
                default: false
            }
        },
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                formModel: {
                    new_password: '',
                    confirm_new_password: ''
                },
                rules: Object.freeze({
                    new_password: [baseValiObj, {validator: this.pwdValidator}],
                    confirm_new_password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValidator}]
                }),
            }
        },
        methods: {
            handleClose() {
                this.$emit('update:visible', false)
                this.$refs.form.resetFields()
            },
            submit() {
                this.$refs.form.validate(flag => {
                    if (flag) {
                        const {new_password, confirm_new_password} = this.formModel
                        this.$emit('submit', [new_password, confirm_new_password])
                    }
                })

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
            },
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .manager-dialog{
        .el-form-item__label::before{
            display: none;
        }
        .el-dialog__body{
            overflow: visible;
        }
    }
</style>