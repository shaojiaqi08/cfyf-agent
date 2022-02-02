<template>
    <div class="underwriting-rule">
        <!-- <side-filter-list
              v-loading="loading"
              label-key="product_name"
              value-key="product_name"
              :showFilter="false"
              v-model="selVal"
              @change="handleSelProduct"
              :disabled="detailLoading"
              style="width: 280px"
              :listData="productData"
      >
          <div slot="extraFilter">
              <div class="search-input-container">
                  <el-input placeholder="搜索产品名称"
                              v-model="product_name_like"
                              prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
                              clearable
                              @input="ajaxProductData"></el-input>
              </div>
          </div>
      </side-filter-list>
      <div class="detail-wrap"
            v-loading="detailLoading">
          <el-scrollbar style="height: 100%" v-if="selName">
              <div class="head">
                  <p>{{selName}}</p>
              </div>
              <div class="product-detail-table" v-if="detailData">
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">产品名称：</div>
                      <div class="product-detail-table-column">{{detailData.product_name}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">保险公司：</div>
                      <div class="product-detail-table-column">{{detailData.company}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">对接渠道：</div>
                      <div class="product-detail-table-column">{{detailData.channel}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">对接方式：</div>
                      <div class="product-detail-table-column">{{detailData.join_way}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">投保人年龄：</div>
                      <div class="product-detail-table-column">{{detailData.applicant_age}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">投保人豁免是否占风险保额：</div>
                      <div class="product-detail-table-column">{{detailData.applicant_occupied_risk_coverage}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">承保年龄：</div>
                      <div class="product-detail-table-column">{{detailData.insured_age}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">可为谁投保：</div>
                      <div class="product-detail-table-column" v-html="detailData.applicant_insured_relation"></div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">投保职业：</div>
                      <div class="product-detail-table-column">{{detailData.occupation}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">保额限制：</div>
                      <div class="product-detail-table-column">{{detailData.guarantee_quota}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">BMI限制：</div>
                      <div class="product-detail-table-column">{{detailData.bmi_restrict}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">反洗钱处理（20万总保费）：</div>
                      <div class="product-detail-table-column">{{detailData.aml}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">是否有风控：</div>
                      <div class="product-detail-table-column">{{detailData.risk_management}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">代收保费：</div>
                      <div class="product-detail-table-column">{{detailData.collect_premium}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">支付认证（校验）：</div>
                      <div class="product-detail-table-column">{{detailData.check_wechat_real_name}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">首期支付方式：</div>
                      <div class="product-detail-table-column">{{detailData.first_payment_way}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column">续期支付方式：</div>
                      <div class="product-detail-table-column">{{detailData.renewal_payment_way}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column" style="padding-right: 50px;">被保人支持的投保证件：</div>
                      <div class="product-detail-table-column">{{detailData.applicant_crowd}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column" style="padding-right: 50px;">销售区域：</div>
                      <div class="product-detail-table-column">{{detailData.apply_area}}</div>
                  </div>
                  <div class="product-detail-table-row">
                      <div class="product-detail-table-column" style="padding-right: 50px;">投被保人为同一人且不带身故责任时，身故处理：</div>
                      <div class="product-detail-table-column">{{detailData.holder_recognizee_same_person_death_handle}}</div>
                  </div>
              </div>
          </el-scrollbar>
          <div class="empty-tips" v-else>
              请选择左侧列表
          </div>
      </div> -->
        <i
            class="collapse-button"
            :class="{
                'el-icon-arrow-left': !collapse,
                'el-icon-arrow-right': collapse,
            }"
            :style="`${
                collapse ? 'left: 18px;transform: translateX(0)' : null
            }`"
            @click="collapsePage"
        ></i>
        <div class="underwriting-all-rule-box">
            <div
                style="width: 280px"
                v-if="!collapse"
                class="underwriting-rule-left"
            >
                <div>险种筛选</div>
                <div class="classify-box">
                    <div
                        :class="['classify-item', { active: item.isSelect }]"
                        v-for="item in classifyList"
                        :key="item.value"
                        @click="selectItem(item)"
                    >
                        {{ item.name }}
                    </div>
                </div>
                <el-scrollbar>
                    <el-form
                        inline
                        :modal="formData"
                        @submit.native.prevent
                        label-position="top"
                    >
                        <el-form-item label="产品名称">
                            <el-input
                                v-model="formData.product_name_like"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="保险公司">
                            <el-input
                                v-model="formData.company"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
<!--                        <el-form-item label="对接渠道">-->
<!--                            <el-input-->
<!--                                v-model="formData.channel"-->
<!--                                placeholder="请输入搜索关键字"-->
<!--                            ></el-input>-->
<!--                        </el-form-item>-->
                        <el-form-item label="对接方式">
                            <el-input
                                v-model="formData.join_way"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="投保人年龄">
                            <el-input
                                v-model="formData.applicant_age"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="投保人豁免是否占风险保额">
                            <el-input
                                v-model="
                                    formData.applicant_occupied_risk_coverage
                                "
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="待支付订单是否占用风险保额">
                            <el-input
                                v-model="
                                    formData.unpaid_order_occupation_risk_coverage
                                "
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="是否支持他人协助填写">
                            <el-input
                                v-model="formData.is_support_others_fill_in"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="出单方式">
                            <el-input
                                v-model="formData.sales_type"
                                placeholder="请输入搜索关键字"
                            />
                        </el-form-item>
                        <el-form-item label="投保人支持的投保证件">
                            <el-input
                                v-model="formData.policy_holder_support_cert"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="被保人年龄">
                            <el-input
                                v-model="formData.insured_age"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="可为谁投保">
                            <el-input
                                v-model="formData.applicant_insured_relation"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="投保职业">
                            <el-input
                                v-model="formData.occupation"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="保额限制">
                            <el-input
                                v-model="formData.guarantee_quota"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="BMI限制">
                            <el-input
                                v-model="formData.bmi_restrict"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="投保认证规则">
                            <el-input
                                v-model="formData.aml"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="是否有风控">
                            <el-input
                                v-model="formData.risk_management"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="首期保费收款方">
                            <el-input
                                v-model="formData.collect_premium"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="支付认证（校验）">
                            <el-input
                                v-model="formData.check_wechat_real_name"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="首期支付方式">
                            <el-input
                                v-model="formData.first_payment_way"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="续期支付方式">
                            <el-input
                                v-model="formData.renewal_payment_way"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="被保人支持的投保证件">
                            <el-input
                                v-model="formData.applicant_crowd"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="销售区域">
                            <el-input
                                v-model="formData.apply_area"
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="投被保人为同一人且不带身故责任时，身故处理"
                        >
                            <el-input
                                v-model="
                                    formData.holder_recognizee_same_person_death_handle
                                "
                                placeholder="请输入搜索关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="是否需要双录">
                            <el-input
                                v-model="formData.is_double_recording"
                                placeholder="请输入搜索关键字"
                            />
                        </el-form-item>
                    </el-form>
                </el-scrollbar>
                <el-row class="button-box">
                    <el-col :span="8"
                        ><el-button @click="reset">重置</el-button></el-col
                    >
                    <el-col :span="16"
                        ><el-button type="warning" @click="search"
                            >搜索</el-button
                        ></el-col
                    >
                </el-row>
            </div>
            <div
                class="underwriting-rules-right"
                v-loading="loading"
                ref="rightBox"
                :style="
                    collapse
                        ? 'margin-left: 16px; border-left: 1px solid #e6e6e6'
                        : null
                "
            >
                <vxe-table
                    :data="tableData"
                    :height="tableHeight"
                    :scroll-x="{ enabled: false }"
                    style="width: 100%"
                    border
                    :header-cell-style="rowCellStyle"
                    :cell-style="rowCellStyle"
                    class="main-table"
                    ref="mainTable"
                >
                    <vxe-table-column
                        class-name="gray-column"
                        fixed="left"
                        width="200"
                        align="center"
                        field="name"
                        title="产品名称"
                    ></vxe-table-column>
                    <vxe-table-column
                        class-name="gray-column"
                        v-for="(item, index) in columnsData"
                        :key="index"
                        width="280"
                        align="center"
                        field="name"
                        :title="item.product_name"
                    >
                        <template v-slot="{ row }">
                            <span
                                v-html="columnsData[index][row.key] || '-'"
                            ></span>
                        </template>
                    </vxe-table-column>
                </vxe-table>
            </div>
        </div>
    </div>
</template>

<script>
import { getUnderwriteRuleList, getUnderwriteRuleDetail } from '@/apis/modules/underwriting'
export default {
    name: 'underwrite-rules',
    data () {
        return {
            collapse: false,
            tableData: [
                { name: '保险公司', key: 'company' },
                { name: '产品类别', key: 'insurance_class' },
                // { name: '对接渠道', key: 'channel' },
                { name: '对接方式', key: 'join_way' },
                { name: '投保人年龄', key: 'applicant_age' },
                { name: '投保人豁免是否占风险保额', key: 'applicant_occupied_risk_coverage' },
                { name: '待支付订单是否占用风险保额', key: 'unpaid_order_occupation_risk_coverage' },
                { name: '是否支持他人协助填写', key: 'is_support_others_fill_in' },
                { name: '出单方式', key: 'sales_type' },
                { name: '投保人支持的投保证件', key: 'policy_holder_support_cert' },
                { name: '被保人年龄', key: 'insured_age' },
                { name: '可为谁投保', key: 'applicant_insured_relation' },
                { name: '投保职业', key: 'occupation' },
                { name: '保额限制', key: 'guarantee_quota' },
                { name: 'BMI限制', key: 'bmi_restrict' },
                { name: '投保认证规则', key: 'aml' },
                { name: '是否有风控', key: 'risk_management' },
                { name: '首期保费收款方', key: 'collect_premium' },
                { name: '支付认证（校验）', key: 'check_wechat_real_name' },
                { name: '首期支付方式', key: 'first_payment_way' },
                { name: '续期支付方式', key: 'renewal_payment_way' },
                { name: '被保人支持的投保证件', key: 'applicant_crowd' },
                { name: '销售区域', key: 'apply_area' },
                { name: '投被保人为同一人且不带身故责任时，身故处理', key: 'holder_recognizee_same_person_death_handle' },
                { name: '是否需要双录', key: 'is_double_recording' }
            ],
            columnsData: [],
            tableHeight: null,
            loading: false,
            loadingDetail: false,
            isReverse: 0,
            detailTableData: [],
            searchConditionData: {},
            curProduct: {},
            showProductDetail: false,
            formData: {
                product_name_like: '', // 产品名称
                company: '', // 保险公司
                channel: '', // 对接渠道
                join_way: '', // 对接方式
                applicant_age: '', // 投保人年龄
                applicant_occupied_risk_coverage: '', // 投保人豁免是否占风险保额
                insured_age: '', // 承保年龄
                applicant_insured_relation: '', // 可为谁投保
                occupation: '', // 投保职业
                guarantee_quota: '', // 保额限制
                bmi_restrict: '', // BMI限制
                aml: '', // 反洗钱处理（20万总保费）
                risk_management: '', // 是否有风控
                collect_premium: '', // 代收保费
                check_wechat_real_name: '', // 支付认证（校验）
                first_payment_way: '', // 首期支付方式
                renewal_payment_way: '', // 续期支付方式
                applicant_crowd: '', // 被保人支持的投保证件
                apply_area: '', // 销售区域
                holder_recognizee_same_person_death_handle: '', // 投被保人为同一人且不带身故责任时，身故处理
                unpaid_order_occupation_risk_coverage: '',
                is_support_others_fill_in: '',
                policy_holder_support_cert: '',
                sales_type: '', // 出单方式
                is_double_recording: '' // 是否需要双录
            },
            classifyList: Object.freeze([
                {
                    name: '重疾险',
                    value: 1,
                    isSelect: false
                },
                {
                    name: '医疗险',
                    value: 2,
                    isSelect: false
                },
                {
                    name: '寿险',
                    value: 3,
                    isSelect: false
                },
                {
                    name: '其他',
                    value: 9999,
                    isSelect: false
                }
            ])
        }
    },
    computed: {
        conditionText () {
            let str = ''
            let { product_name, notice } = this.searchConditionData
            if (product_name) {
                str += `产品名称：${product_name},`
            }
            if (notice) {
                str += `健康告知内容：${notice},`
            }
            if (str.lastIndexOf(',') === (str.length - 1)) {
                str = str.substring(0, str.length - 1)
            }
            if (str) {
                str = `【${this.isReverse ? '反向搜索' : '正向搜索'}】 ${str}`
            }
            return str
        }
    },
    methods: {
        rowCellStyle ({ columnIndex }) {
            return {
                backgroundColor: columnIndex % 2 === 0 ? columnIndex === 0 ? '#ebebeb' : '#f5f5f5' : '#fff',
                fontWeight: columnIndex === 0 ? 'bold' : 'normal'
            }
        },
        collapsePage () {
            this.collapse = !this.collapse
        },
        reset () {
            this.formData = {
                product_name_like: '', // 产品名称
                company: '', // 保险公司
                channel: '', // 对接渠道
                join_way: '', // 对接方式
                applicant_age: '', // 投保人年龄
                applicant_occupied_risk_coverage: '', // 投保人豁免是否占风险保额
                insured_age: '', // 承保年龄
                applicant_insured_relation: '', // 可为谁投保
                occupation: '', // 投保职业
                guarantee_quota: '', // 保额限制
                bmi_restrict: '', // BMI限制
                aml: '', // 反洗钱处理（20万总保费）
                risk_management: '', // 是否有风控
                collect_premium: '', // 代收保费
                check_wechat_real_name: '', // 支付认证（校验）
                first_payment_way: '', // 首期支付方式
                renewal_payment_way: '', // 续期支付方式
                applicant_crowd: '', // 被保人支持的投保证件
                apply_area: '', // 销售区域
                holder_recognizee_same_person_death_handle: '', // 投被保人为同一人且不带身故责任时，身故处理
                unpaid_order_occupation_risk_coverage: '',
                is_support_others_fill_in: '',
                policy_holder_support_cert: '',
                sales_type: '', // 出单方式
                is_double_recording: '' // 是否需要双录
            }
            this.requestList()
        },
        selectItem (item) {
            item.isSelect = !item.isSelect
            this.requestList()
        },
        requestList () {
            let insuranceList = this.classifyList.filter(item => {
                return item.isSelect
            })
            let insurance_class
            if (insuranceList) {
                console.log(insuranceList)
                insurance_class = insuranceList.map(item => {
                    return item.name
                })
            }
            let hasvalue = Object.values(this.formData).some(item => {
                return item !== ''
            })
            if (insurance_class.length === 0 && !hasvalue) {
                return
            }
            this.loading = true
            getUnderwriteRuleList({
                ...this.formData,
                insurance_class: insurance_class ? insurance_class.join(',') : ''
            }).then((res) => {
                this.columnsData = Object.freeze(res)
            })
                .finally(() => {
                    this.loading = false
                })
        },
        requestDetail () {
            this.detailTableData = []
            this.loadingDetail = true
            getUnderwriteRuleDetail({
                id: this.curProduct.id
            })
                .then((res) => {
                    this.detailTableData = [res]
                })
                .finally(() => {
                    this.loadingDetail = false
                })
        },
        search () {
            this.requestList()
        },
        showDetail (data) {
            this.curProduct = data
            this.showProductDetail = true
            this.requestDetail()
        },
        closeDetailModal () {
            this.showProductDetail = false
        },
        closeSearchConditionTips () {
            this.searchConditionData = {}
            this.formData = {}
            this.isReverse = 0
            this.requestList()
        }
    },
    created () {
        this.requestList()
    },
    mounted () {
        this.tableHeight = this.$refs.rightBox.offsetHeight - 32
    }
}
</script>

<style scoped lang="scss">
.underwrite-search-container {
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    position: relative;
    .search-input-container {
        padding: 16px 16px 0;
    }
    .detail-wrap {
        flex: 1;
        padding: 16px;
        box-sizing: border-box;
        max-width: 100%;
        overflow: hidden;
        .head {
            height: 48px;
            position: relative;
            font-size: 14px;
            color: #4d4d4d;
            align-items: flex-start;
            & > p {
                line-height: 32px;
                color: #1a1a1a;
                font-size: 18px;
                margin: 0 0 2px 0;
                font-weight: bold;
            }
            .el-input-number {
                width: 140px;
            }
        }
        ::v-deep .el-scrollbar .el-scrollbar__wrap {
            overflow-x: hidden;
        }
    }
    .side-filter-container {
        border-right: 1px solid #e6e6e6;
    }
    .product-detail-table {
        display: flex;
        flex-wrap: wrap;
        &-row {
            width: 100%;
            display: flex;
            font-size: 16px;
            line-height: 1.3;
            padding: 10px;
            &:hover {
                background: #f7f7f7;
            }
        }
        &-column {
            &:first-child {
                width: 300px !important;
                font-weight: bold;
                flex-shrink: 0;
            }
        }
    }
}

.underwriting-rule {
    height: 100%;
    .el-card__body {
        height: 100%;
        .not-content {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .underwriting-all-rule-box {
        position: relative;
        height: 100%;
        display: flex;
        .underwriting-rule-left {
            width: 280px;
            border-right: 1px solid #e6e6e6;
            height: 100%;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .el-scrollbar {
                flex: 1;
            }
            .el-form-item {
                width: 100%;
                margin-bottom: 20px !important;
                margin-right: 0 !important;
            }
            .el-form-item__label {
                padding: 0;
            }
            ::v-deep .el-scrollbar__wrap {
                overflow-x: hidden;
            }
            .button-box {
                padding-top: 16px;
                // border-top: 1px solid #E6E6E6;
            }
            .el-button--medium {
                width: 90%;
                margin: 0 auto;
            }
            .el-button--warning {
                color: #fff;
                background-color: #1f78ff;
                border-color: #1f78ff;
                float: right;
            }
        }
    }
    .classify-box {
        padding: 16px 0 16px 0;
        font-size: 14px;
        .classify-item {
            cursor: pointer;
            display: inline-block;
            padding: 6px 8px;
            background: #f5f5f5;
            color: #333;
            border-radius: 4px;
            line-height: 1;
            margin-right: 8px;
            border: 1px solid #e6e6e6;
            &.active {
                background: rgba(31, 120, 255, 0.1);
                color: #1f78ff;
                border-color: 1px solid #1f78ff;
            }
        }
    }

    .search-form {
        background: #fff;
        top: 0px;
        left: 0;
        width: 100%;
        padding: 10px 34px;
        z-index: 2;
        .el-form-item {
            margin-bottom: 0 !important;
            margin-right: 36px !important;
        }
    }
    h2 {
        font-size: 20px;
        color: #303133;
        font-weight: 500;
        margin-right: 24px;
        margin-top: 0;
        margin-bottom: 0;
    }
    .underwriting-rule-title {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    .underwriting-rule-list {
        height: 84vh;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .el-col-12 {
        margin-bottom: 24px;
    }
    .delete-btn {
        color: rgb(255, 0, 0);
        cursor: pointer;
        margin-left: 20px;
    }
    .product-detail-table {
        display: flex;
        flex-wrap: wrap;
        &-row {
            width: 100%;
            display: flex;
            font-size: 16px;
            line-height: 1.3;
            padding: 10px;
            &:hover {
                background: #f7f7f7;
            }
        }
        &-column {
            &:first-child {
                width: 300px !important;
                font-weight: bold;
                flex-shrink: 0;
            }
        }
    }
}

.underwriting-rules-right {
    flex: 1;
    padding: 16px;
    overflow: hidden;
    .underwriting-rule-box {
        font-size: 14px;
        margin-left: 16px;
        .underwriting-rule-row {
            font-size: 14px;
            letter-spacing: -4px;
            display: flex;
            border-bottom: 1px solid rgba(0, 0, 0, 0.15);
            &:first-child {
                border-top: 1px solid rgba(0, 0, 0, 0.15);
            }
            &.underwriting-header-info {
                position: fixed;
                z-index: 11;
            }
            .underwriting-rule-row-title {
                position: relative;
                letter-spacing: normal;
                vertical-align: top;
                width: 200px;
                padding: 12px 10px;
                line-height: 22px;
                font-weight: bold;
                display: inline-block;
                text-align: center;
                background: #ebebeb;
                border-right: 1px solid rgba(0, 0, 0, 0.15);
                box-sizing: border-box;
                &:first-child {
                    // border-left:1px solid rgba(0, 0, 0, .15);
                }
            }
            .underwriting-rule-row-desc {
                letter-spacing: normal;
                vertical-align: top;
                width: 280px;
                padding: 12px 10px;
                line-height: 22px;
                display: inline-block;
                text-align: center;
                border-right: 1px solid rgba(0, 0, 0, 0.15);
                &:first-child {
                    border-left: 1px solid rgba(0, 0, 0, 0.15);
                }
                &:nth-child(2n-1) {
                    background: #f5f5f5;
                }
                &:nth-child(2n) {
                    background: #fff;
                }
            }
        }
    }
}
.clone-dom-box {
    position: absolute;
    top: 16px;
    padding-left: 16px;
    overflow: hidden;
    z-index: 10;
    .underwriting-rule-row-title {
        letter-spacing: normal;
        vertical-align: top;
        width: 200px;
        padding: 12px 10px;
        line-height: 22px;
        font-weight: bold;
        text-align: center;
        background: #ebebeb;
        border-right: 1px solid rgba(0, 0, 0, 0.15);
        &:first-child {
            // border-left:1px solid rgba(0, 0, 0, .15);
        }
    }
}
.height-warp {
    width: 100%;
    height: 16px;
    position: absolute;
    left: 0px;
    top: 0px;
    background: #fff;
    z-index: 10;
}
.width-warp {
    width: 16px;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    background: #fff;
}
::v-deep .main-table {
    .vxe-table--border-line {
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
    td,
    th {
        color: #333;
    }
    .vxe-header--column,
    .vxe-body--column {
        background-image: linear-gradient(
                rgba(0, 0, 0, 0.1),
                rgba(0, 0, 0, 0.1)
            ),
            linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
    }
    .vxe-header--column {
        background-position: 100% 0, 0 calc(100% - 0.6px);
    }
    .vxe-table--fixed-left-wrapper {
        border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
    .vxe-table--header-border-line {
        border: transparent;
    }
}
.collapse-button {
    position: absolute;
    top: 136px;
    left: 296px;
    cursor: pointer;
    z-index: 999999;
    transform: translateX(-50%);
    background-color: #ffffff;
    color: #1f78ff;
    border: 1px solid #1f78ff;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
}
</style>
