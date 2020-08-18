<template>
    <el-dialog custom-class="manager-dialog" :title="`${formModel.id !== '' ? '编辑' : '新增'}角色`" :visible.sync="visible" width="480px" @close="closeDialog">
        <el-form ref="form" :model="formModel" :rules="rules" label-width="100px" label-position="left">
            <el-form-item label="角色名称" prop="name">
                <el-input placeholder="请输入角色名称" v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
                <el-input type="textarea" placeholder="请输入角色描述"  v-model="formModel.remark"></el-input>
            </el-form-item>
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
    import { createRole, updateMangePos } from '@/apis/modules/user-manage'
    export default {
        name: 'add-role-dialog',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            formModel: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                loading: false,
                submitting: false,
                selRoleLoading: false,
                rules: Object.freeze({
                    name: baseValiObj,
                    remark: baseValiObj
                })
            }
        },
        methods: {
            submit() {
                this.$refs.form.validate(flag => {
                    if (flag) {
                        this.submitting = true
                        const {formModel} = this
                        const data = {...formModel}
                        let handle = updateMangePos
                        const isEdit =  data.id !== ''
                        if (!isEdit) {
                            delete data.id
                            handle = createRole
                        }
                        handle(this.formModel).then(res => {
                            this.$message.success(`${isEdit ? '编辑' : '新增'}角色成功!`)
                            this.closeDialog()
                            this.$emit('success', isEdit ? data.id : +res.id)
                        }).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            closeDialog() {
                this.$refs.form.resetFields()
                this.$emit('update:visible', false)
            }
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .edit-sales-dialog .el-dialog__body{
        overflow: visible;
    }
</style>