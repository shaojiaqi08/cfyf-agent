<template>
    <div class="container">
        <div class="header">投保人信息</div>
        <div class="content">
            <el-row type="flex" class="mb14" justify="start">
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
                    <span>出生日期<span class="ml8">{{detail.birthday ? formatDate(detail.birthday * 1000, 'yyyy-MM-dd') : '-'}}</span></span>
                </el-col>
            </el-row>
            <el-row type="flex" class="mb30" justify="start" align="middle">
                <template v-if="!isMyCustomer">
                    <el-col :span="6">
                        <span>出单人<span class="ml8">xxx</span></span>
                    </el-col>
                    <el-col :span="6">
                        <span>团队<span class="ml8">xxx</span></span>
                    </el-col>
                </template>
                <el-col :span="6">
                    <span>关联家庭<span class="ml8">{{detail.family_name || '-'}}</span></span>
                    <i v-if="detail.family_id" class="iconfont iconxiao16_tiaozhuan ml8" @click="goFamilyDetail" style="color: #1F78FF"></i>
                </el-col>
            </el-row>
            <div class="flex-between mb16">
                <span class="table-title">相关保单<span class="ml8">共66张</span></span>
                <el-button
                    type="primary"
                    icon="iconfont iconxiao16_xiazai mr4"
                    class="mr16"
                    size="small">导出数据</el-button>
            </div>
            <el-table
                    :data="list"
                    border
                    stripe
                    :span-method="tableSpan"
                    height="calc(100% - 120px)"
                    style="width: 100%" >
                <el-table-column prop="recognizee_policy_name" label="被保人" align="center" fixed="left"></el-table-column>
                <el-table-column prop="holder_name" label="投保人" align="center"></el-table-column>
                <el-table-column prop="product_insurance_class_name" label="险种类型" align="center"></el-table-column>
                <el-table-column prop="product_name" label="产品名称" align="center" width="200px"></el-table-column>
                <el-table-column prop="guarantee_period_desc" label="缴费期间" align="center"></el-table-column>
                <el-table-column prop="premium" label="年缴保费" align="center"></el-table-column>
                <el-table-column prop="guarantee_quota_str" label="基本保险金额" align="center" width="120px"></el-table-column>
                <el-table-column prop="payment_period_desc" label="保障期间" align="center"></el-table-column>
                <el-table-column prop="proposal_at_str" label="投保日期" align="center" width="120px">
                    <template v-slot="{ row }">{{formatDate(row.proposal_at * 1000, 'yyyy-MM-dd')}}</template>
                </el-table-column>
                <el-table-column prop="wait_days" label="等待期" align="center"></el-table-column>
                <el-table-column prop="beneficiaries" label="受益人" align="center"></el-table-column>
                <el-table-column prop="supplier_name" label="保险公司" align="center" width="250px"></el-table-column>
                <el-table-column prop="account_bank_name" label="缴费银行" align="center"></el-table-column>
                <el-table-column prop="account_bank_number" label="银行卡号" align="center" width="200px"></el-table-column>
                <el-table-column prop="policy_sn" label="保单号" align="center"  width="220px"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center" width="200px"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { getMyCustomerDetail, getCustomerDetail } from '@/apis/modules/customer'
    import { formatDate } from '@/utils/formatTime'
    export default {
        name: 'customer-detail',
        data() {
            return {
                detail: {},
                list: []
            }
        },
        computed: {
            relationId() {
                return this.$route.params.id
            },
            isMyCustomer() {
                return this.$route.name === 'my-customer-detail'
            },
            getDetail() {
                return this.isMyCustomer ? getMyCustomerDetail : getCustomerDetail
            }
        },
        methods: {
            formatDate,
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
            goFamilyDetail() {
                const url = this.$router.resolve({
                    name: this.isMyCustomer ? 'my-customer-family-detail' : 'customer-family-detail',
                    id: this.detail.relation_id
                }).href
                window.open(url)
            },
            getData() {
                this.getDetail({
                    relation_id: this.relationId
                }).then(res => {
                    let list = []
                    res.policies.forEach(policy => {
                        const len = policy.length
                        if (len) {
                            policy.rowSpan = len
                        }
                        list.push(...policy)
                    })
                    this.detail = res.customer
                    this.list = list
                })
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped lang="scss">
    .container {
        color: #1A1A1A;
        background-color: #fff;
        width: 1200px;
        margin: auto;
        height: calc(100vh - 76px);
        display: flex;
        flex-direction: column;
        .header {
            height: 56px;
            font-size: 16px;
            border-bottom: 1px solid #e6e6e6;
            background-color: #f5f5f5;
            padding: 0 16px;
            line-height: 56px;
        }
        .content {
            overflow: hidden;
            flex: 1;
            padding: 16px;
            .el-col {
                span > span {
                    font-weight: bold;
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
        }
    }
</style>
