<template>
    <el-scrollbar>
        <div class="container" v-loading="loading">
            <div class="header">
                <div>
                    <p>{{family.name}}</p>
                    <span>{{family.remark}}</span>
                </div>
                <el-button icon="iconfont iconxiao16_bianji mr4"
                           type="primary"
                           size="small"
                           class="ml16"
                           @click="editFamily"
                           v-if="$checkAuth('/edit_brand_info') && isMyCustomer">编辑家庭</el-button>
            </div>
            <div class="content">
                <div class="table-head">
                    <span>投保人</span>
                    <el-button type="primary" size="small" icon="iconfont iconxiao16_guanlian mr4" @click="relativePolicyHolder">关联投保人</el-button>
                </div>
                <el-table :data="customers" border table-head class="mb24" max-height="600px" style="width: 100%">
                    <el-table-column prop="real_name" label="姓名" align="center"></el-table-column>
                    <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
                    <el-table-column prop="certificate_number" label="身份证号" align="center" width="310px"></el-table-column>
                    <el-table-column prop="birthday" label="出生日期" align="center">
                        <template v-slot="{ row }">{{row.birthday ? formatDate(row.birthday * 1000, 'yyyy-MM-dd') : ''}}</template>
                    </el-table-column>
                    <el-table-column prop="policy_quantity" label="保单数量" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="120px">
                        <template v-slot="{ row, $index }">
                            <el-link type="primary" v-if="customers.length > 1" @click="removePolicyHolder(row, $index)">移除</el-link>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="table-head">
                    <span>相关保单<span>共{{policies.length}}单</span></span>
                    <el-button type="primary" size="small" icon="iconfont iconxiao16_xiazai mr4">导出表格</el-button>
                </div>
                <el-table
                    :data="policies"
                    :span-method="tableSpan"
                    border
                    stripe
                    class="mb16"
                    max-height="600px"
                    style="width: 100%">
                    <el-table-column prop="recognizee_policy_name" label="被保人" align="center" fixed="left" width="120px"></el-table-column>
                    <el-table-column prop="holder_name" label="投保人" align="center" width="120px"></el-table-column>
                    <el-table-column prop="product_insurance_class_name" label="险种类型" align="center" width="120px"></el-table-column>
                    <el-table-column prop="product_name" label="产品名称" align="center" width="250px"></el-table-column>
                    <el-table-column prop="" label="缴费期间" align="center" width="120px"></el-table-column>
                    <el-table-column prop="premium" label="年交保费" align="center" width="120px"></el-table-column>
                    <el-table-column prop="guarantee_quota_str" label="基本保险金额" align="center" width="120px"></el-table-column>
                    <el-table-column prop="" label="保障期间" align="center" width="120px"></el-table-column>
                    <el-table-column prop="proposal_at" label="投保日期" align="center" width="120px">
                        <template v-slot="{ row }">{{row.proposal_at ? formatDate(row.proposal_at * 1000, 'yyyy-MM-dd') : ''}}</template>
                    </el-table-column>
                    <el-table-column prop="wait_days" label="等待期" align="center" width="120px"></el-table-column>
                    <el-table-column prop="beneficiaries" label="受益人" align="center" width="120px"></el-table-column>
                    <el-table-column prop="supplier_name" label="保险公司" align="center" width="250px"></el-table-column>
                    <el-table-column prop="account_bank_name" label="缴费银行" align="center" width="120px"></el-table-column>
                    <el-table-column prop="account_bank_number" label="银行卡号" align="center" width="200px"></el-table-column>
                    <el-table-column prop="policy_sn" label="保单号" align="center"  width="220px"></el-table-column>
                    <el-table-column prop="remark" label="备注" align="center" width="200px"></el-table-column>
                </el-table>
            </div>
            <operate-family-dialog
                    v-if="isMyCustomer"
                    :model="family"
                    :visible.sync="editDialogVisible"
                    @confirm="editFamilySuccess"></operate-family-dialog>
            <relative-dialog :visible.sync="relativeDialogVisible" @refresh="getData"></relative-dialog>
        </div>
    </el-scrollbar>
</template>

<script>
    import OperateFamilyDialog from '../modal/operate-family-dialog'
    import RelativeDialog from './modal/relative-dialog'
    import { getMyCustomerFamilyDetail, getFamilyDetail} from '@/apis/modules/customer'
    import { formatDate } from '@/utils/formatTime'
    export default {
        name: 'family-detail',
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
                policyHolderList: []
            }
        },
        methods: {
            formatDate,
            editFamilySuccess({ name, remark}) {
                const f = this.family
                f.name = name
                f.remark = remark
            },
            editFamily() {
                this.editDialogVisible = true
            },
            tableSpan({ row, columnIndex }) {
                if (columnIndex === 0) {
                    if (row.rowSpan) {
                        return {
                            rowspan: row.rowSpan,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },
            relativePolicyHolder() {
                this.relativeDialogVisible = true
            },
            removePolicyHolder(row) {
                this.$confirm(`正在移除投保人【${row.holder_name}】，移除后，此投保人的保单也将从家庭单中移除，是否确认？`, '提示').then(() => {})
            },
            getData() {
                this.loading = true
                this.getDetail({
                    family_id: this.familyId
                }).then(res => {
                    this.customers = res.customers
                    this.family = res.family
                    const policies = []
                    res.policies.forEach(policy => {
                        const len = policy.length
                        if (len) {
                            policy[0].rowSpan = len
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
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped lang="scss">
    .el-scrollbar {
        height: calc(100vh - 60px);
        ::v-deep .el-scrollbar__wrap {
            overflow-x: hidden;
        }
    }
    .container {
        color: #1A1A1A;
        background-color: #fff;
        width: 1200px;
        margin: 0 auto 20px auto;
        display: flex;
        flex-direction: column;
        .header {
            height: 84px;
            font-size: 16px;
            border-bottom: 1px solid #e6e6e6;
            background-color: #f5f5f5;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
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
            padding: 16px;
            .table-head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                & > span {
                    font-size: 16px;
                    span {
                        color: #999;
                        font-size: 14px;
                        margin-left: 8px;
                    }
                }
            }
        }
    }
</style>
