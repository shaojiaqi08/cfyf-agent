<template>
    <el-dialog
        custom-class="manager-dialog"
        title="设置推荐人"
        :visible="visible"
        width="480px"
        @close="closeDialog"
        :close-on-click-modal="false"
    >
        <el-form
            ref="form"
            :model="submitInfo"
            :rules="rules"
            label-width="100px"
            label-position="left"
        >
            <el-form-item label="姓名">
                {{ formModel.real_name }}
            </el-form-item>
            <el-form-item label="推荐人" prop="referrerName">
                <el-autocomplete
                    v-model="submitInfo.referrerName"
                    value-key="real_name"
                    :fetch-suggestions="querySearch"
                    placeholder="搜索推荐人"
                    @select="handleSelect"
                />
            </el-form-item>
            <el-form-item label="推荐人姓名">
                {{ submitInfo.referrerName || '-' }}
            </el-form-item>
            <el-form-item label="推荐人账号">
                {{ submitInfo.referrerUserName || '-' }}
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button
                type="primary"
                @click="submit"
                :loading="submitting"
                :disabled="submitting"
                >确认</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
/**
 *  新增/编辑销售 Dialog
 * */
import baseValiObj from '../../../baseValiObj'
import { getSalesData } from "@/apis/modules/achievement"
import validatorMixin from '../../../validatorMixin'
import { setReferrerApi } from "@/apis/modules/user-manage"
export default {
    name: 'set-referrer-dialog',
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
    },
    data() {
        return {
            submitting: false,
            rules: Object.freeze({
                referrerName: baseValiObj
            }),
            // 全部推荐人列表
            allSalesList: [],
            submitInfo: {
                // 用户ID
                id: '',
                // 推荐人ID
                introduce_sales_id: '',
                // 推荐人姓名
                referrerName: '',
                // 推荐人账号
                referrerUserName: '',
            },
        }
    },
    created() {
        this.submitInfo.id = this.formModel.id || ''
        this.submitInfo.introduce_sales_id = this.formModel.introduce_sales.id || ''
        this.submitInfo.referrerName = this.formModel.introduce_sales.real_name || ''
        this.submitInfo.referrerUserName = this.formModel.introduce_sales.username || ''
        this.getAllSalesDataFun()
    },
    methods: {
        // 获取全部推荐人列表
        getAllSalesDataFun() {
            getSalesData({
                account_status: 'enable'
            }).then(res => {
                this.allSalesList = res
            }).catch(err => console.log(err))
        },
        // 搜索推荐人
        querySearch(queryString, cb) {
            var allSalesList = this.allSalesList;
            var results = queryString ? allSalesList.filter(this.createFilter(queryString)) : allSalesList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        // 过滤推荐人
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.real_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        // 处理选择推荐人
        handleSelect(item) {
            this.submitInfo.introduce_sales_id = item.id
            this.submitInfo.referrerName = item.real_name
            this.submitInfo.referrerUserName = item.username
        },
        // 确认提交
        submit() {
            this.$refs.form.validate(flag => {
                if (flag) {
                    this.submitting = true
                    setReferrerApi(this.submitInfo).then(() => {
                        this.$emit('submit')
                        this.$message.success("操作成功!");
                        this.closeDialog()
                    }).catch(err => console.log(err)).finally(() => {
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
    },
}
</script>

<style scoped lang="scss">
::v-deep .edit-sales-dialog .el-dialog__body {
    overflow: visible;
}
</style>
