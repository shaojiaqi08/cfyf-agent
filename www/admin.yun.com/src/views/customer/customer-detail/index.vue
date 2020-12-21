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
                    <span>出生日期<span class="ml8">{{detail.birthday ? formatDate(detail.birthday * 1000, 'yyyy-MM-dd') : '-'}}</span></span>
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
                    <i v-if="$checkAuth(isMyCustomer ? '/customer/sales/detail/jump2family' : '/customer/admin/jump2family') && detail.family_id" class="iconfont iconxiao16_tiaozhuan ml8" @click="goFamilyDetail" style="color: #1F78FF"></i>
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
                stripe
                :span-method="tableSpan"
                :max-height="tableHeight"
                style="width: 100%" >
                <el-table-column prop="recognizee_policy_name" label="被保人" align="center" fixed="left" width="120px"></el-table-column>
                <el-table-column prop="holder_name" label="投保人" align="center" width="120px"></el-table-column>
                <el-table-column prop="product_insurance_class_name" label="险种类型" align="center" width="120px"></el-table-column>
                <el-table-column prop="product_name" label="产品名称" align="center" width="260px"></el-table-column>
                <el-table-column prop="payment_period_desc" label="缴费期间" align="center" width="120px"></el-table-column>
                <el-table-column prop="premium" label="年交保费" align="center" width="120px"></el-table-column>
                <el-table-column prop="guarantee_quota_str" label="基本保险金额" align="center" width="120px"></el-table-column>
                <el-table-column prop="guarantee_period_desc" label="保障期间" align="center" width="120px"></el-table-column>
                <el-table-column prop="proposal_at_str" label="投保日期" align="center" width="120px">
                    <template v-slot="{ row }">{{formatDate(row.proposal_at * 1000, 'yyyy-MM-dd')}}</template>
                </el-table-column>
                <el-table-column prop="wait_days" label="等待期" align="center" width="120px"></el-table-column>
                <el-table-column prop="beneficiaries" label="受益人" align="center" width="120px"></el-table-column>
                <el-table-column prop="supplier_name" label="保险公司" align="center" width="250px"></el-table-column>
                <el-table-column prop="account_bank_name" label="缴费银行" align="center" width="120px"></el-table-column>
                <el-table-column prop="account_bank_number" label="银行卡号" align="center" width="220px"></el-table-column>
                <el-table-column prop="policy_sn" label="保单号" align="center"  width="220px"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center" width="200px"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { getMyCustomerDetail, getCustomerDetail, exportMyCustomerPolicyUrl, exportCustomerPolicyUrl } from '@/apis/modules/customer'
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
                tableHeight: null
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
                    res.policies.forEach(policy => {
                        const len = policy.length
                        if (len) {
                            policy[0].rowSpan = len
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
