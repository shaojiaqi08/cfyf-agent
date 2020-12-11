<template>
    <el-dialog :visible="visible" :title="title" width="480px">
        <el-form :model="formModel" label-width="100px" :rules="rules" ref="form">
            <el-form-item label="家庭名称" prop="name">
                <el-input v-model="formModel.name" placeholder="请输入家庭名称，最多50字"></el-input>
            </el-form-item>
            <el-form-item label="选择客户" prop="name" v-if="!isEdit">
                <el-input v-model="formModel.customers" placeholder="请选择投保人"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="name">
                <el-input v-model="formModel.customers" placeholder="请输入备注内容" type="textarea" row="4"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button class="mr16" @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
    // 操作家庭dialog
    export default {
        name: 'operate-family-dialog',
        props: {
            visible: Boolean,
            model: Object
        },
        data() {
            return {
                formModel: {
                    name: '',
                    customers: [],
                    remark: ''
                },
                rules: {
                    name: {
                        required: true,
                        message: '请输入家庭名称'
                    },
                    customers: {
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
            }
        },
        methods: {
            submit() {
                this.$refs.form.validate(flag => {
                    if (!flag) return
                })
            },
            closeDialog() {
                this.formModel = JSON.parse(JSON.stringify(this.$options.data().formModel))
                this.$emit('update:visible', false)
            }
        },
        watch: {
            visible(v){
                if (v) {
                    const { formModel, model } = this
                    formModel.name = model.name
                    formModel.customers = model.customers
                    formModel.remark = model.remark
                }
            }
        }
    }
</script>

<style scoped>

</style>
