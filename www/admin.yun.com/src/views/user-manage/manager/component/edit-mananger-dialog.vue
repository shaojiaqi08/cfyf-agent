<template>
    <el-dialog custom-class="manager-dialog"
               :title="`${formModel.id !== '' ? '编辑' : '新增'}管理员`"
               :visible="visible"
               :close-on-click-modal="false"
               @close="closeDialog"
               width="480px">
        <el-form ref="form" :model="formModel" :rules="rules" label-width="100px" label-position="left">
            <el-form-item label="管理员姓名" prop="real_name">
                <el-input placeholder="请输入管理员姓名" v-model="formModel.real_name"></el-input>
            </el-form-item>
            <el-form-item label="工作邮箱" prop="email">
                <el-input placeholder="请输入工作邮箱" v-model="formModel.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input placeholder="请输入手机号" v-model="formModel.mobile"></el-input>
            </el-form-item>
            <el-form-item label="管理员账号" prop="username">
                <el-input placeholder="请输入管理员登录账号" v-model="formModel.username"></el-input>
            </el-form-item>
            <el-form-item label="管理员角色" prop="position_id" v-if="formModel.is_super_user === superUserKey.NO">
                <el-select :loading="selRoleLoading" style="width: 100%" placeholder="请选择管理员角色" v-model="formModel.position_id">
                    <el-option v-for="(item, index) in editRoleData" :key="index" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="formModel.id === ''">
                <el-form-item label="登录密码" prop="password">
                    <el-input auto-complete="new-password" type="password" placeholder="请输入管理员登录密码" v-model="formModel.password"></el-input>
                </el-form-item>
                <el-form-item label="再次输入密码" prop="confirm_password">
                    <el-input auto-complete="new-password" type="password" placeholder="请再次输入登录密码" v-model="formModel.confirm_password"></el-input>
                </el-form-item>
            </template>
        </el-form>
        <span slot="footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="submit" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
    </el-dialog>
</template>

<script>
    /**
     *  新增/编辑销售 Dialog
     * */
    import baseValiObj from '../../baseValiObj'
    import {createManager, editManager, getEditRoleList } from '@/apis/modules/user-manage'
    import validatorMixin from '../../validatorMixin'
    import { superUserKey } from '@/enums/user-manage'
    export default {
        name: 'edit-manager-dialog',
        mixins: [validatorMixin],
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            formModel: {
                type: Object,
                required: true
            },
            curRole: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                superUserKey,
                loading: false,
                submitting: false,
                selRoleLoading: false,
                rules: Object.freeze({
                    real_name: baseValiObj,
                    username: [baseValiObj, {validator: this.usernameValidator}],
                    position_id: baseValiObj,
                    mobile: [baseValiObj, {validator: this.moblieValidator}],
                    email: [baseValiObj, {validator: this.emailValidator}],
                    password: [baseValiObj, {validator: this.pwdValidator}],
                    confirm_password:[baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValidator}]
                }),
                editRoleData: []
            }
        },
        methods: {
            submit() {
                this.$refs.form.validate(flag => {
                    if (flag) {
                        this.submitting = true
                        const {formModel, curRole} = this
                        const data = {...formModel}
                        let handle = createManager
                        const isEdit =  data.id !== ''
                        if (isEdit) { // 编辑移除多余参数
                            data.role_id = curRole.id
                            delete data.password
                            delete data.confirm_password
                            handle = editManager
                        }
                        handle({...data}).then(res => {
                            this.$emit('success', isEdit ? data.position_id : +res.position_id)
                            this.$message.success(`${isEdit ? '修改' : '新增'}成功!`)
                            this.closeDialog()
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            closeDialog() {
                this.$emit('close')
                this.$nextTick(() => {
                    this.$refs.form.clearValidate()
                    this.$emit('update:visible', false)
                })
            },
            comparePwdValidator(rule, value, callback) { // eslint-disable-line
                const {password, confirm_password} = this.formModel
                if (!password || !confirm_password) {
                    return callback()
                } else if(password !== confirm_password) {
                    return callback(new Error('确认密码必须跟密码一致'))
                }
                return callback()
            },
            getEditRoleData() {
                this.selRoleLoading = true
                getEditRoleList().then(res => {
                    this.editRoleData = res
                }).finally(() => {
                    this.selRoleLoading = false
                })
            }
        },
        watch: {
            visible(v) {
                v && this.getEditRoleData()
            }
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .edit-sales-dialog .el-dialog__body{
        overflow: visible;
    }
</style>