<template>
    <div class="rate-container">
        <div class="header">
            <el-tabs v-model="tabIndex">
                <el-tab-pane name="api" label="API"></el-tab-pane>
                <el-tab-pane name="cps" label="CPS"></el-tab-pane>
            </el-tabs>
            <el-button type="primary" @click="openRateDialog"><i class="iconfont iconxiao16_shezhi mr4"></i>批量上下架</el-button>
        </div>
        <div class="content">
            <Component :is="tabIndex"></Component>
        </div>
        <el-dialog title="批量上下架" width="480px" custom-class="shelves-dialog" :visible.sync="dialogVisible">
            <el-form ref="form" :model="formModel" :rules="rules" label-width="100px" label-position="left">
                <el-form-item label="保险产品" prop="product_id" placeholder="请选择保险产品">
                    <el-select v-model="formModel.product_id">
                        <el-option v-for="(item, index) in productData" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="B端公司" prop="company_id">
                    <el-select v-model="formModel.company_id">
                        <el-option v-for="(item, index) in companyData" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设置状态" prop="status">
                    <el-radio v-model="formModel.status" label="on">上架</el-radio>
                    <el-radio v-model="formModel.status" label="off">下架</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button @click="submit" :loading="submitting" :disabled="submitting" type="primary">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from './tab-panel/api'
    import cps from './tab-panel/cps'
    export default {
        name: 'rate',
        components: {
            api,
            cps,
        },
        data() {
            return {
                submitting: false,
                dialogVisible: false,
                tabIndex: 'api',
                formModel: {
                    product_id: '',
                    company_id: '',
                    status: ''
                },
                rules: {},
                productData: [],
                companyData: []
            }
        },
        methods: {
            submit() {

            },
            openRateDialog() {
                this.dialogVisible = true
            },
            ajaxCompanyData() {

            },
            ajaxProductData() {}
        },
        watch: {
            dialogVisible(v) {
                !v && this.$refs.form.resetFields()
            }
        },
        created() {

        }
    }
</script>

<style scoped lang="scss">
    .rate-container{
        padding: 16px 16px 0 16px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .header{
            padding: 16px 0 0 16px;
            height: 56px;
            background: #F5F5F5;
            border-radius: 4px 4px 0px 0px;
            border: 1px solid #E6E6E6;
            position: relative;
            .el-button{
                position: absolute;
                top:12px;
                right: 16px;
            }
        }
        .content{
            background-color: #fff;
            flex: 1;
            overflow: hidden;
            border: 1px solid #e6e6e6;
            border-top: transparent;
            box-sizing: border-box;
        }
    }
</style>