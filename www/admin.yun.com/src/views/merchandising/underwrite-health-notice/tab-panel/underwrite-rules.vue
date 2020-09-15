<template>
    <div class="underwrite-search-container">
        <el-input placeholder="搜索产品名称"
                  class="search-input"
                  v-model="product_name_like"
                  prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
                  clearable
                  @input="ajaxProductData"></el-input>
        <side-filter-list
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
                        <div class="product-detail-table-column">出单渠道：</div>
                        <div class="product-detail-table-column">{{detailData.channel}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">产品类型：</div>
                        <div class="product-detail-table-column">{{detailData.insurance_class}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">投保险人年龄：</div>
                        <div class="product-detail-table-column">{{detailData.applicant_age}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">被保险人年龄：</div>
                        <div class="product-detail-table-column">{{detailData.insured_age}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">可为谁投保：</div>
                        <div class="product-detail-table-column">{{detailData.applicant_insured_relation}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">保额限制：</div>
                        <div class="product-detail-table-column" v-html="detailData.guarantee_quota"></div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">投保人豁免是否占用风险保额：</div>
                        <div class="product-detail-table-column">{{detailData.applicant_occupied_risk_coverage}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">职业限制：</div>
                        <div class="product-detail-table-column">{{detailData.occupation}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">BMI限制：</div>
                        <div class="product-detail-table-column">{{detailData.bmi_restrict}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">反洗钱规则：</div>
                        <div class="product-detail-table-column">{{detailData.aml}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">是否有风控：</div>
                        <div class="product-detail-table-column">{{detailData.risk_management}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">微信实名制（校验）：</div>
                        <div class="product-detail-table-column">{{detailData.check_wechat_real_name}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">保费缴纳方式：</div>
                        <div class="product-detail-table-column" v-html="detailData.payment_method"></div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">是否可以支持医保卡外借：</div>
                        <div class="product-detail-table-column">{{detailData.medical_card_lend_out}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">被保险人是否有智能核保：</div>
                        <div class="product-detail-table-column">{{detailData.insured_intelligent_underwriting}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">预核保（邮件）/人工核保：</div>
                        <div class="product-detail-table-column">{{detailData.pre_underwriting_support}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">核保结果是否行业内留痕：</div>
                        <div class="product-detail-table-column">{{detailData.has_underwriting_result_trace}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">支持的投保人群：</div>
                        <div class="product-detail-table-column">{{detailData.applicant_crowd}}</div>
                    </div>
                    <div class="product-detail-table-row">
                        <div class="product-detail-table-column">投保区域：</div>
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
        </div>
    </div>
</template>

<script>
    import SideFilterList from '@/components/side-filter-list'
    import {getUnderwriteRuleList, getUnderwriteRuleDetail} from '@/apis/modules/underwriting'
    export default {
        name: 'underwrite-rules',
        components: {
            SideFilterList
        },
        data() {
            return {
                loading: false,
                detailLoading: false,
                selVal: null,
                selName: '',
                product_name_like: '',
                detailData: null,
                productData: [],
                illness: '',
                condition_search: '',
                is_reverse: '0',
                maxConditionLength: 15,
                fontSize: 14
            }
        },
        methods: {
            handleSelProduct(obj) {
                this.selName = obj.product_name
                this.detailData = null
                this.ajaxDetail(obj.id)
            },
            ajaxProductData() {
                this.loading = true
                this.detailData = null
                this.selName = ''
                this.selVal = null
                const {product_name_like} = this
                getUnderwriteRuleList({product_name_like}).then(res => {
                    this.productData = res
                }).catch(() => {}).finally(() => {
                    this.loading = false
                })
            },
            ajaxDetail(id) {
                this.detailLoading = true
                getUnderwriteRuleDetail({id}).then(res => {
                    this.detailData = res
                }).catch(() => {}).finally(() => {
                    this.detailLoading = false
                })
            }
        },
        created() {
            this.ajaxProductData()
        }
    }
</script>

<style scoped lang="scss">
    .underwrite-search-container{
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        position: relative;
        .detail-wrap{
            flex: 1;
            padding: 16px;
            box-sizing: border-box;
            max-width: 100%;
            overflow: hidden;
            .head{
                height: 48px ;
                position: relative;
                font-size: 14px;
                color:#4d4d4d;
                align-items: flex-start;
                &>p{
                    line-height: 32px;
                    color: #1a1a1a;
                    font-size: 18px;
                    margin: 0 0 2px 0;
                    font-weight: bold;
                }
                .el-input-number{
                    width: 140px;
                }
            }
            ::v-deep .el-scrollbar .el-scrollbar__wrap{
                overflow-x: hidden;
            }
        }
        .side-filter-container{
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
</style>