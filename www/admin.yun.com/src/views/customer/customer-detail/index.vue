<template>
    <div class="container" ref="container">
        <div class="header">投保人信息</div>
        <div class="content" v-loading="loading">
            <el-row type="flex" class="mb14" justify="middle">
                <el-col :span="6">
                    <span>姓名<span class="ml8">{{detail.real_name || '-'}}</span></span>
                </el-col>
                <el-col :span="6">
                    <span>手机号<span class="ml8">{{detail.mobile || '-'}}</span></span>
                </el-col>
                <el-col :span="6">
                    <span>身份证号<span class="ml8">{{detail.certificate_number || '-'}}</span></span>
                </el-col>
                <el-col :span="6">
                    <span>出生日期<span class="ml8">{{detail.birthday ? detail.birthday.toString().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '-'}}</span></span>
                </el-col>
            </el-row>
            <el-row type="flex" class="mb30" justify="start" align="top">
                <template v-if="!isMyCustomer">
                    <el-col :span="6">
                        <span>出单人<span class="ml8">{{detail.sales_name || '-'}}</span></span>
                    </el-col>
                    <el-col :span="6">
                        <span>团队<span class="ml8">{{detail.sales_team_name || '-'}}</span></span>
                    </el-col>
                </template>
                <el-col :span="6" class="flex">
                    <span>关联家庭<span class="ml8" style="padding-right: 0">{{detail.family_name || '-'}}</span></span>
                    <i
                        v-if="$checkAuth(isMyCustomer ? '/customer/sales/family_detail' : '/customer/admin/family_detail') && detail.family_name"
                        class="iconfont iconxiao16_tiaozhuan ml8"
                        @click="goFamilyDetail"
                        style="color: #1F78FF; cursor: pointer"></i>
                </el-col>
            </el-row>
            <div class="flex-between mb16">
                <span class="table-title">相关保单<span class="ml8">共{{list.length}}张</span></span>
                <el-button
                    type="primary"
                    icon="iconfont iconxiao16_xiazai mr4"
                    class="mr16"
                    @click="exportPolicy"
                    :loading="exporting"
                    :disabled="exporting || list.length <= 0"
                    v-if="$checkAuth(isMyCustomer ? '/customer/sales/export_customer_policy' : '/customer/admin/export_customer_policy')"
                    size="small">导出表格</el-button>
            </div>
            <el-table
                :data="list"
                border
                class="policy-table"
                :span-method="tableSpan"
                :max-height="tableHeight"
                @cell-click="handleCelClick"
                :row-class-name="policyRowClassName"
                style="width: 100%" >
                <el-table-column prop="__row_index" label="客户编号" align="center" fixed="left" width="80px"></el-table-column>
                <el-table-column prop="recognizee_policy_name" label="被保人" align="center" fixed="left" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="holder_name" label="投保人" align="center" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="product_insurance_class_name" label="险种类型" align="center" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="product_name" label="产品名称" align="center" width="260px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="guarantee_quota_str" label="基本保险金额" align="center" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="guarantee_period_desc" label="保障期间" align="center" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="payment_period_desc" label="缴费期间" align="center" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="premium" label="年交保费(元)" align="center" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="proposal_at" label="投保日期" align="center" width="120px">
                    <template v-slot="{ row }">{{row.proposal_at ? formatDate(row.proposal_at * 1000, 'yyyy-MM-dd') : '-'}}</template>
                </el-table-column>
                <el-table-column prop="wait_days" label="等待期" align="center" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="beneficiaries" label="身故受益人" align="center" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="supplier_name" label="保险公司" align="center" width="250px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="supplier_hotline" label="保险公司客服电话" align="center" width="220px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="account_bank_name" label="续期缴费银行" align="center" width="120px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="account_bank_number" label="续期缴费银行卡号" align="center" width="200px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="policy_sn" label="保单号" align="center"  width="220px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="holder_mobile" label="投保人手机号" align="center" width="250px" :formatter="cellFormatter"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center" width="260px">
                    <template v-slot="{row}">
                        <div v-if="row === editRow" class="flex edit-remark-wrap">
                            <el-input v-if="row === editRow"
                                      v-focus
                                      ref="remarkInput"
                                      clearable
                                      v-model.trim="editRemark"
                                      :readonly="remarkSubmitting"
                                      @keyup.esc.native="cancelEditRemark"
                                      @keyup.enter.native="editRemark!==row.remark && submitEditVerifyRemark()"></el-input>
                            <i v-if="editRemark!==row.remark"
                               :disabled="remarkSubmitting"
                               class="el-icon-success ml4"
                               @click="submitEditVerifyRemark"></i>
                            <i v-if="!remarkSubmitting"
                               class="el-icon-error ml8"
                               @click="cancelEditRemark"></i>
                        </div>
                        <span v-else>{{row.remark || '-'}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { getMyCustomerDetail, getCustomerDetail, exportMyCustomerPolicyUrl, exportCustomerPolicyUrl, modifyRemark } from '@/apis/modules/customer'
    import { formatDate } from '@/utils/formatTime'
    import { downloadFrameA, debounce } from '@/utils'
    import commonMixin from '../mixin'
    export default {
        name: 'customer-detail',
        mixins: [ commonMixin ],
        data() {
            return {
                detail: {},
                list: [],
                exporting: false,
                loading: false,
                tableHeight: null,
                editRow: null,
                editRemark: '',
                remarkSubmitting: false
            }
        },
        computed: {
            relationId() {
                return this.$route.params.id
            },
            isMyCustomer() {
                return this.$route.name === 'my-customer-detail'
            },
            // 详情接口
            getDetail() {
                return this.isMyCustomer ? getMyCustomerDetail : getCustomerDetail
            },
            // 导出链接
            exportUrl() {
                return this.isMyCustomer ? exportMyCustomerPolicyUrl : exportCustomerPolicyUrl
            }
        },
        methods: {
            formatDate,
            // 保单列表行className
            policyRowClassName({ row }) {
                if (row.$is_gray_row) {
                    return 'policy-gray-row'
                }
            },
            // 点击备注列
            handleCelClick(row, {property}) {
                if (this.isMyCustomer && property === 'remark' && this.$checkAuth('/customer/sales_customer/export')) {
                    this.editRow = row
                    this.editRemark = row.remark
                }
            },
            submitEditVerifyRemark() {
                const { editRemark, editRow } = this
                this.remarkSubmitting = true
                modifyRemark({
                    policy_id: editRow.id,
                    remark: editRemark
                }).then(() => {
                    this.$set(editRow, 'remark', editRemark)
                    this.cancelEditRemark()
                }).finally(() => {
                    this.remarkSubmitting = false
                })
            },
            cancelEditRemark() {
                this.editRow = null
                this.editRemark = ''
            },
            // 导出保单
            exportPolicy() {
                const url = `${this.exportUrl}?relation_id=${this.relationId}`
                this.exporting = true
                downloadFrameA(url, `客户保单-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`, 'get', true).finally(() => {
                    this.exporting = false
                })
            },
            // 打开家庭详情标签
            goFamilyDetail() {
                const url = this.$router.resolve({
                    name: this.isMyCustomer ? 'my-customer-family-detail' : 'customer-family-detail',
                    params: {
                        id: this.detail.family_id
                    }
                }).href
                window.open(url)
            },
            // 获取详情
            getData() {
                this.loading = true
                this.getDetail({
                    relation_id: this.relationId
                }).then(res => {
                    let list = []
                    res.policies.forEach((policy, index) => {
                        const len = policy.length
                        policy[0].rowSpan = len
                        policy[0].__row_index = index + 1
                        if (index % 2 !== 0) {
                            policy.forEach(i => {
                                // 标记斑马行
                                i.$is_gray_row = true
                            })
                        }
                        list.push(...policy)
                    })
                    this.detail = res.customer
                    this.list = list
                }).finally(() => {
                    this.loading = false
                })
            },
            calcTableHeight() {
                const func = () => {
                    this.tableHeight = this.$refs.container.offsetHeight - 213
                }
                func()
                this.calcTableHeight = debounce(func, 300)
            }
        },
        created() {
            this.getData()
        },
        mounted() {
            this.calcTableHeight()
            window.addEventListener('resize', this.calcTableHeight)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.calcTableHeight)
        }
    }
</script>

<style scoped lang="scss">
    .container {
        color: #1A1A1A;
        width: 1200px;
        margin: auto;
        height: calc(100vh - 76px);
        display: flex;
        flex-direction: column;
        .header {
            height: 56px;
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #e6e6e6;
            background-color: #f5f5f5;
            padding: 0 16px;
            line-height: 56px;
        }
        .content {
            overflow: hidden;
            padding: 16px;
            background-color: #fff;
            .el-col {
                span {
                    display: flex;
                    & > span {
                        font-weight: bold;
                        flex: 1;
                        overflow: visible;
                        display: block;
                        height: 16px;
                        padding-right: 16px;
                        word-break: break-all;
                    }
                }
            }
            .edit-remark-wrap {
                i {
                    cursor: pointer;
                    font-size: 18px;
                }
                .el-icon-success {
                    color: #ff9000;
                }
                .el-icon-error {
                    color: #FF4C4C;
                }
            }
            .table-title {
                font-size: 16px;
                font-weight: bold;
                display: flex;
                align-items: center;
                & > span {
                    color: #999;
                    font-weight: normal;
                    font-size: 14px;
                }
            }
            .el-table {
                color: #333;
                &.el-table--border {
                    border: 1px solid #A5C9FF;
                }
                & ::v-deep th {
                    background: #EDF5FF;
                    color: #333;
                }
                ::v-deep .el-table__fixed {
                    bottom: 16px !important;
                }
                .el-table .el-table__body tr.el-table__row td, .el-table--enable-row-hover{
                    background: #FFF7EB;
                }
                ::v-deep .el-table__body tr:hover td ,::v-deep .hover-row td{
                    background: rgba(31, 120, 255, 0.2)!important;
                }
                .el-table__fixed-right-patch {
                    background: #EDF5FF;
                }
                & ::v-deep td, & ::v-deep th.is-leaf,.el-table--border, ::v-deep .el-table--group, ::v-deep .el-table__fixed{
                    border-color: #A5C9FF;
                }
                ::v-deep .el-table--border::after, ::v-deep .el-table--group::after, & ::v-deep ::before{
                    border-color: #A5C9FF;
                }
            }
            ::v-deep .policy-table {
                .policy-gray-row {
                    background: #EDF5FF;
                }
            }
        }
    }
</style>
