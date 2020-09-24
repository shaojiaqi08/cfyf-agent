<template>
    <el-dialog custom-class="edit-sales-dialog"
               :title="`${id !== '' ? '编辑' : '新增'}销售`"
               :visible="visible"
               :close-on-click-modal="false"
               @close="closeDialog"
               width="480px">
        <el-form v-loading="loading" ref="form" :model="formModel" :rules="rules" label-width="110px" label-position="left">
            <el-form-item label="姓名" prop="real_name">
                <el-input placeholder="请输入姓名" v-model="formModel.real_name"></el-input>
            </el-form-item>
            <el-form-item label="登录账号" prop="username">
                <el-input placeholder="请输入登录账号" v-model="formModel.username"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="identity_card">
                <el-input placeholder="请输入身份证号" v-model="formModel.identity_card"></el-input>
            </el-form-item>
            <el-form-item label="新增时间" prop="resignation_at">
                <el-date-picker placeholder="请选择新增时间" style="width: 100%" type="date" v-model="formModel.resignation_at" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input placeholder="请输入手机号" v-model="formModel.mobile"></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="position_id">
                <el-select style="width: 100%" placeholder="请选择职位" v-model="formModel.position_id">
                    <el-option v-for="(item, index) in positionData" :key="index" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
<!--            <el-form-item label="团队" prop="team_id">-->
<!--                <el-select style="width: 100%" placeholder="请选择团队" v-model="formModel.team_id" :loading="teamSelLoading" clearable>-->
<!--                    <el-option v-for="(item, index) in teamData" :key="index" :value="item.id" :label="item.name"></el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
            <template v-if="id === ''">
                <el-form-item label="登录密码" prop="password">
                    <el-input autocomplete="new_password" auto-complete="new_password" type="password" placeholder="请输入管理员登录密码" v-model="formModel.password"></el-input>
                </el-form-item>
                <el-form-item label="再次输入密码" prop="confirm_password">
                    <el-input auto-complete="new_password" type="password" placeholder="请再次输入登录密码" v-model="formModel.confirm_password"></el-input>
                </el-form-item>
            </template>
        </el-form>
        <span slot="footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" :loading="submitting" :disabled="submitting" @click="submit">确认</el-button>
            </span>
    </el-dialog>
</template>

<script>
    /**
     *  新增/编辑销售 Dialog
     * */
    import baseValiObj from '../../baseValiObj'
    import {createSales, modifySales, getSalesDetail} from '@/apis/modules/user-manage'
    import {formatDate} from '@/utils/formatTime'
    import validatorMixin from '../../validatorMixin'
    export default {
        name: 'edit-sales-dialog',
        mixins: [validatorMixin],
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                default: ''
            },
            positionData: {
                type: Array,
                default: () => []
            },
            teamData: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                loading: false,
                submitting: false,
                teamSelLoading: false,
                formModel: {
                    id: '',
                    real_name: '',
                    username: '',
                    identity_card: '',
                    resignation_at: '',
                    mobile: '',
                    position_id: '',
                    // team_id: '',
                    password: '',
                    confirm_password: '',
                    role: 'sales'
                },
                rules: Object.freeze({
                    real_name: baseValiObj,
                    username: [baseValiObj, {validator: this.usernameValidator}],
                    identity_card: baseValiObj,
                    resignation_at: baseValiObj,
                    mobile: [baseValiObj, {validator: this.moblieValidator}],
                    position_id: baseValiObj,
                    role: baseValiObj,
                    password: [baseValiObj, {validator: this.pwdValidator}],
                    confirm_password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValidator}]
                })
            }
        },
        methods: {
            submit() {
                this.$refs.form.validate(flag => {
                    if (flag) {
                        const {formModel: data} = this
                        const isEdit = !!data.id
                        const handler = isEdit ? modifySales : createSales
                        this.submitting = true
                        const params = {...data, role: 'sales'}
                        params.resignation_at = ~~(new Date(params.resignation_at.replace(/-/g, '/')) / 1000)
                        handler(params).then(() => {
                            this.$emit('success')
                            this.$message.success(`${isEdit ? '修改' : '新增'}成功!`)
                            this.closeDialog()
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            ajaxDetail(id) {
                this.loading = true
                getSalesDetail({id}).then(res => {
                    res.resignation_at = formatDate(res.resignation_at * 1000, 'yyyy-MM-dd')
                    const model = this.formModel
                    Object.keys(model).forEach(key => model[key] = res[key])
                }).catch(() => {}).finally(() => {
                    this.loading = false
                })
            },
            closeDialog() {
                this.formModel = this.$options.data().formModel
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
        },
        watch: {
            visible(v) {
                if (v && this.id) {
                    this.ajaxDetail(this.id)
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .edit-sales-dialog .el-dialog__body{
        overflow: visible;
    }
</style>