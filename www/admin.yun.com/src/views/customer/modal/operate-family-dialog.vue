<template>
    <el-dialog :visible="visible" :title="title" width="480px" @close="closeDialog">
        <el-form :model="formModel" label-width="100px" :rules="rules" ref="form">
            <el-form-item label="家庭名称" prop="name">
                <el-input v-model="formModel.name" placeholder="请输入家庭名称，最多50字" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="选择客户" prop="name" v-if="!isEdit">
                <el-select multiple :loading="customerLoading" v-model="formModel.customer_ids" placeholder="请选择投保人" style="width: 100%">
                    <el-option v-for="(item, index) in customerList" :key="index" :label="item.real_name" :value="'' + item.relation_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="name">
                <el-input v-model="formModel.remark" placeholder="请输入备注内容" type="textarea" row="4"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button class="mr16" @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitting" :disabled="submitting">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
    // 操作家庭dialog
    import { createFamily, editFamily, getCustomerNoRelation } from '@/apis/modules/customer'
    export default {
        name: 'operate-family-dialog',
        props: {
            visible: Boolean,
            model: Object
        },
        data() {
            return {
                submitting: false,
                customerLoading: false,
                customerList: [],
                formModel: {
                    name: '',
                    customer_ids: [],
                    remark: ''
                },
                rules: {
                    name: {
                        required: true,
                        message: '请输入家庭名称'
                    },
                    customer_ids: {
                        required: true,
                        message: '请选择客户'
                    }
                }
            }
        },
        computed: {
            isEdit() {
                return this.model
            },
            title() {
                return this.isEdit ? '编辑家庭' : '新增家庭'
            },
            submitFunc() {
                return this.isEdit ? editFamily : createFamily
            }
        },
        methods: {
            submit() {
                this.$refs.form.validate(flag => {
                    if (!flag) return
                    this.submitting = true
                    const params = { ...this.formModel }
                    if (this.isEdit) {
                        delete params.customers
                        params.id = this.$route.params.id
                    }
                    this.submitFunc(params).then(() => {
                        this.$message.success(`${this.isEdit ? '编辑' : '新建'}家庭成功`)
                        this.$emit('confirm', params)
                        this.closeDialog()
                    }).finally(() => {
                        this.submitting = false
                    })
                })
            },
            closeDialog() {
                this.formModel = JSON.parse(JSON.stringify(this.$options.data().formModel))
                this.$refs.form.resetFields()
                this.$emit('update:visible', false)
            },
            getCustomerList() {
                this.customerLoading = true
                getCustomerNoRelation({page_size: 999999, page: 1}).then(res => {
                    this.customerList = res.data
                }).finally(() => {
                    this.customerLoading = false
                })
            }
        },
        watch: {
            visible(v){
                if (v) {
                    const { formModel, model } = this
                    if (this.isEdit) {
                        formModel.name = model.name
                        formModel.remark = model.remark
                    } else {
                        this.getCustomerList()
                    }
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .el-dialog__body {
        overflow: visible;
    }
</style>
