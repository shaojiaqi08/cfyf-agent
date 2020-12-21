<template>
    <el-dialog class="relative-dialog" :visible="visible" @close="closeDialog" width="1200px" :close-on-click-modal="false">
        <span slot="title">
            <span class="dialog-title" style="font-size: 18px">关联投保人<span style="">提示：仅展示尚未关联任何家庭的投保人</span></span>
        </span>
        <div>
            <el-input prefix-icon="iconfont iconxiao16_sousuo ml4" v-model="keyword" placeholder="搜索姓名、身份证号或手机号" class="mb20" @input="handleInput" clearable></el-input>
            <el-table :data="list" border stripe :max-height="tableMaxHeight" v-loading="loading" v-table-infinite-scroll="scroll2Bottom">
                <el-table-column prop="real_name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
                <el-table-column prop="certificate_number" label="身份证号" align="center"></el-table-column>
                <el-table-column prop="birthday" label="出生日期" align="center">
                    <template v-slot="{ row }">{{row.birthday ? formatDate(row.birthday * 1000, 'yyyy-MM-dd') : ''}}</template>
                </el-table-column>
                <el-table-column prop="policy_quantity" label="保单数量" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                    <template v-slot="{ row }">
                        <el-link type="primary" class="mr8" @click="relative(row)">关联</el-link>
                        <el-popover placement="left">
                            <el-link slot="reference" type="primary" @click="viewPolicy(row)">查看保单</el-link>
                            <div style="width: 1000px" v-loading="policyLoading">
                                <h3 style="color: #1A1A1A;font-size: 16px">{{customer.real_name}}，{{customer.mobile}}的保单</h3>
                                <el-table
                                        :data="policyList"
                                        border
                                        stripe
                                        :span-method="tableSpan"
                                        max-height="520px"
                                        style="width: 100%"
                                        v-loading="loading">
                                    <el-table-column prop="recognizee_policy_name" label="被保人" align="center" fixed="left" width="120px"></el-table-column>
                                    <el-table-column prop="holder_name" label="投保人" align="center" width="120px"></el-table-column>
                                    <el-table-column prop="product_insurance_class_name" label="险种类型" align="center" width="120px"></el-table-column>
                                    <el-table-column prop="product_name" label="产品名称" align="center" width="260px"></el-table-column>
                                    <el-table-column prop="guarantee_period_desc" label="缴费期间" align="center" width="120px"></el-table-column>
                                    <el-table-column prop="premium" label="年缴保费" align="center" width="120px"></el-table-column>
                                    <el-table-column prop="guarantee_quota_str" label="基本保险金额" align="center" width="120px"></el-table-column>
                                    <el-table-column prop="payment_period_desc" label="保障期间" align="center" width="120px"></el-table-column>
                                    <el-table-column prop="proposal_at_str" label="投保日期" align="center" width="120px">
                                        <template v-slot="{ row }">{{formatDate(row.proposal_at * 1000, 'yyyy-MM-dd')}}</template>
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
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
    // 关联投保人
    import { getCustomerNoRelation, relativePolicyHolder, getMyCustomerDetail } from '@/apis/modules/customer'
    import { debounce } from '@/utils'
    import { formatDate } from '@/utils/formatTime'
    import commonMixin from '../../mixin'
    let relatived = false // 标记是否关联过, 关闭时刷新主界面
    export default {
        name: 'relative-dialog',
        mixins: [ commonMixin ],
        props: {
            visible: Boolean,
            id: [String, Number]
        },
        data() {
            return {
                loading: false,
                policyLoading: false,
                keyword: '',
                list: [],
                customer: {},
                policyList: [],
                page: 1,
                page_size: 20,
                total: 0,
                tableMaxHeight: null
            }
        },
        created() {
            this.calcTableHeight()
            window.addEventListener('resize', this.calcTableHeight)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.calcTableHeight)
        },
        computed: {
            familyId() {
                return this.$route.params.id
            }
        },
        methods: {
            formatDate,
            scroll2Bottom() {
                const {page, page_size, total} = this
                if (page * page_size < total) {
                    this.loading = true
                    this.page += 1
                    this.getData()
                }
            },
            getData(isSearch = false){
                if (isSearch) {
                    this.page = 1
                    this.keyword = ''
                }
                const { page, page_size, keyword, list } = this
                this.loading = true
                getCustomerNoRelation({
                    page,
                    page_size,
                    keyword
                }).then(res => {
                    this.total = res.total
                    this.list = page === 1 ? res.data : [...list, ...res.data]
                }).finally(() => {
                    this.loading = false
                })
            },
            handleInput: debounce(function() {
                this.page = 1
                this.total = 0
                this.getData()
            }, 300),
            getPolicyData(relation_id) {
                this.policyLoading = true
                this.policyList = []
                getMyCustomerDetail({
                    relation_id
                }).then(res => {
                    let list = []
                    res.policies.forEach(policy => {
                        const len = policy.length
                        if (len) {
                            policy[0].rowSpan = len
                        }
                        list.push(...policy)
                    })
                    this.customer = res.customer
                    this.policyList = list
                }).finally(() => {
                    this.policyLoading = false
                })
            },
            relative({ relation_id }) {
                relativePolicyHolder({
                    relation_id,
                    family_id: this.familyId
                }).then(() => {
                    this.$message.success('关联成功')
                    relatived = true
                    this.getData()
                })
            },
            viewPolicy({ relation_id }) {
                this.getPolicyData(relation_id)
            },
            closeDialog() {
                this.list = []
                this.keyword = ''
                this.$emit('update:visible', false)
                if (relatived) {
                    this.$emit('refresh')
                    relatived = false
                }
            },
            calcTableHeight() {
                const func = () => {
                    this.tableMaxHeight = window.innerHeight * 0.899 - 180
                }
                func()
                this.calcTableHeight = debounce(func, 300)
            }
        },
        watch: {
            visible(v) {
               v && this.getData(true)
            }
        }
    }
</script>

<style scoped lang="scss">
    .relative-dialog {
        .dialog-title {
            font-size: 18px;
            & > span {
                font-size: 14px;
                color: #999;
                margin-left: 8px;
                font-weight: normal;
            }
        }
        ::v-deep .el-dialog__body {
            max-height: 100vh;
            padding-bottom: 20px;
        }
    }
    .policy-dialog {
        ::v-deep .el-dialog__header {
            display: none;
        }

        ::v-deep .el-dialog__body {
            height: 600px;
            padding-bottom: 20px;
            h3 {
                margin-top: 0;
            }
        }
    }
</style>
