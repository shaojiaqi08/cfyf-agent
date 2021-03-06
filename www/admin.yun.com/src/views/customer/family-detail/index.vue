<template>
    <div class="container" v-loading="loading">
        <div class="header">
            <div>
                <p>{{family.name}}</p>
                <span>{{family.remark}}</span>
            </div>
            <el-button
                    icon="iconfont iconxiao16_bianji mr4"
                    type="primary"
                    size="small"
                    class="ml16"
                    @click="editFamily"
                    v-if="$checkAuth('/customer/sales/edit_family') && isMyCustomer">编辑家庭</el-button>
        </div>
        <div class="content">
            <el-scrollbar>
                <div class="table-head">
                    <span>投保人</span>
                    <el-button
                            v-if="$checkAuth('/customer/sales/customer_join_family') && isMyCustomer"
                            type="primary"
                            size="small"
                            icon="iconfont iconxiao16_guanlian mr4"
                            @click="relativePolicyHolder">关联投保人</el-button>
                </div>
                <el-table :data="customers" border stripe table-head class="mb24" max-height="600px" style="width: 100%">
                    <el-table-column prop="real_name" label="姓名" align="center" :formatter="cellFormatter"></el-table-column>
                    <el-table-column prop="mobile" label="手机号" align="center" :formatter="cellFormatter"></el-table-column>
                    <el-table-column prop="certificate_number" label="身份证号" align="center" width="310px" :formatter="cellFormatter"></el-table-column>
                    <el-table-column prop="birthday" label="出生日期" align="center">
                        <template v-slot="{ row }">{{row.birthday ? row.birthday.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3") : '-'}}</template>
                    </el-table-column>
                    <el-table-column prop="policy_quantity" label="保单数量" align="center" :formatter="cellFormatter"></el-table-column>
                    <el-table-column label="操作" align="center" width="120px" v-if="$checkAuth('/customer/sales/remove_family_member') && isMyCustomer">
                        <template v-slot="{ row, $index }">
                            <el-link type="primary" v-if="customers.length > 1" @click="removePolicyHolder(row, $index)">移除</el-link>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="table-head">
                    <span>相关保单<span>共{{policies.length}}单</span></span>
                    <el-button
                            type="primary"
                            size="small"
                            icon="iconfont iconxiao16_xiazai mr4"
                            @click="exportPolicy"
                            v-if="$checkAuth(isMyCustomer ? '/customer/sales_customer/export' : '/customer/admin/export_family_policy')"
                            :loading="exporting"
                            :disabled="exporting || policies.length <= 0">导出表格</el-button>
                </div>
                <el-table
                        :data="policies"
                        :span-method="tableSpan"
                        border
                        class="policy-table"
                        max-height="600px"
                        :row-class-name="policyRowClassName"
                        @cell-click="handleCelClick"
                        style="width: 100%">
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
            </el-scrollbar>
        </div>
        <operate-family-dialog
                v-if="isMyCustomer"
                :model="family"
                :visible.sync="editDialogVisible"
                @confirm="editFamilySuccess"></operate-family-dialog>
        <relative-dialog :visible.sync="relativeDialogVisible" @refresh="getData"></relative-dialog>
    </div>
</template>

<script>
    import OperateFamilyDialog from '../modal/operate-family-dialog'
    import RelativeDialog from './modal/relative-dialog'
    import {
        getMyCustomerFamilyDetail,
        getFamilyDetail,
        exportMyFamilyPolicyUrl,
        exportFamilyPolicyUrl,
        removePolicyHolder,
        modifyRemark
    } from '@/apis/modules/customer'
    import { formatDate } from '@/utils/formatTime'
    import { downloadFrameA } from '@/utils'
    import commonMixin from '../mixin'
    export default {
        name: 'family-detail',
        mixins: [ commonMixin ],
        components: {
            OperateFamilyDialog,
            RelativeDialog
        },
        data() {
            return {
                loading: false,
                relativeDialogVisible: false,
                editDialogVisible: false,
                family: {},
                customers: [],
                policies: [],
                policyHolderList: [],
                exporting: false,
                editRow: null,
                editRemark: '',
                remarkSubmitting: false
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
            // 导出
            exportPolicy() {
                const url = `${this.exportUrl}?family_id=${this.familyId}`
                this.exporting = true
                downloadFrameA(url, `家庭保单-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`, 'get', true).finally(() => {
                    this.exporting = false
                })
            },
            editFamilySuccess({ name, remark}) {
                const f = this.family
                f.name = name
                f.remark = remark
            },
            editFamily() {
                this.editDialogVisible = true
            },
            relativePolicyHolder() {
                this.relativeDialogVisible = true
            },
            // 移除投保人
            removePolicyHolder({ real_name, relation_id }) {
                const h = this.$createElement
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('i', { class: {
                                iconfont: true,
                                'iconzhong20_gantanhao': true
                            },
                            style: {
                                color: 'red',
                                marginRight: '10px'
                            }
                        }),
                        h('span', null, `正在移除投保人【${real_name}】，移除后，此投保人的保单也将从家庭单中移除，是否确认？`)
                    ]),
                    confirmButtonClass: 'el-button--danger',
                    confirmButtonText: '移除',
                    showCancelButton: true
                }).then(() => {
                    this.loading = true
                    removePolicyHolder({
                        relation_id
                    }).then(() => this.getData()).catch(() => {
                        this.loading = false
                    })
                })
            },
            // 获取详情
            getData() {
                this.loading = true
                this.getDetail({
                    family_id: this.familyId
                }).then(res => {
                    this.customers = res.customers
                    this.family = res.family
                    const policies = []
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
                        policies.push(...policy)
                    })
                    this.policies = policies
                }).finally(() => {
                    this.loading = false
                })
            }
        },
        computed: {
            familyId() {
                return this.$route.params.id
            },
            isMyCustomer() {
                return this.$route.name === 'my-customer-family-detail'
            },
            getDetail() {
                return this.isMyCustomer ? getMyCustomerFamilyDetail : getFamilyDetail
            },
            exportUrl() {
                return this.isMyCustomer ? exportMyFamilyPolicyUrl : exportFamilyPolicyUrl
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped lang="scss">
    .el-scrollbar {
        height: 100%;
        ::v-deep .el-scrollbar__view{
            padding: 16px;
        }
        ::v-deep .el-scrollbar__wrap {
            overflow-x: hidden;
        }
    }
    .container {
        color: #1A1A1A;
        width: 1200px;
        margin: 20px auto;
        height: calc(100% - 20px);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .header {
            min-height: 84px;
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #e6e6e6;
            background-color: #f5f5f5;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 4px 4px 0 0;
            & > div {
                flex: 1;
                overflow: hidden;
                p {
                    margin: 0 0 8px 0;
                    font-size: 16px;
                    color: #1A1A1A;
                    font-weight: bold;
                    & + span {
                        color: #999;
                        font-size: 14px;
                    }
                }
            }
        }
        .content {
            background-color: #fff;
            flex: 1;
            overflow: hidden;
            .table-head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                & > span {
                    font-size: 16px;
                    font-weight: bold;
                    span {
                        color: #999;
                        font-size: 14px;
                        margin-left: 8px;
                        font-weight: normal;
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
        }
        .el-table {
            color: #333;
            &.el-table--border {
                border: 1px solid #A5C9FF;
            }
            ::v-deep .el-table__fixed {
                bottom: 16px !important;
            }
            & ::v-deep th {
                background: #EDF5FF;
                color: #333;
            }
            ::v-deep .el-table__row--striped td{
                background: #EDF5FF;
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
        ::v-deep .policy-gray-row {
            background: #EDF5FF;
        }
    }
</style>
