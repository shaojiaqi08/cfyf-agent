<template>
    <div class="underwrite-search-container">
        <el-input clearable placeholder="搜索产品名称"
                  class="search-input"
                  v-model="searchModel.product_name"
                  prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
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
            <div slot="extraFilter">
                <div class="flex-between pt16 pb16 pl16 pr16">
                    <filter-shell v-model.trim="searchModel.notice" autoFocus @input="ajaxProductData">
                        <el-input v-model.trim="searchModel.notice" placeholder="多个条件以逗号分隔，最多5个" clearable @input="debounceAjaxProductData"></el-input>
                        <template v-slot:label>
                            <span>健康告知</span>
                        </template>
                        <template v-slot:close>
                            <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                               v-if="hasValue(searchModel.notice)"
                               @click.stop="searchModel.notice = ''"></i>
                        </template>
                    </filter-shell>
                </div>
                <div class="pl16" style="padding-bottom: 8px">
                    <el-radio-group size="mini" v-model="searchModel.is_reverse" @change="ajaxProductData" class="radio-group-wrap">
                        <el-radio-button style="height: 28px" v-for="(item, index) in isReverseData" :key="index" :label="item.value">{{item.label}}</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </side-filter-list>
        <div class="detail-wrap"
             v-loading="detailLoading">
            <template v-if="tableData.length">
                <div class="head flex-between">
                    <p>产品健告</p>
                    <div class="flex-center">
                        调整字号
                        <el-input-number class="ml16" :min="12" :max="24" v-model="fontSize" size="small"></el-input-number>
                        <el-button v-if="$checkAuth('/underwrite-health-notice/generate_pictures')" class="ml16" type="primary" @click="createImg" size="small"><i class="iconfont iconxiao16_shengcheng"></i> 生成图片</el-button>
                    </div>
                </div>
                <el-scrollbar style="height: 100%;">
                    <div ref="imageDom">
                        <el-table :data="tableData" border :style="{fontSize: fontSize + 'px'}">
                            <el-table-column class-name="p16">
                                <template slot="header">
                                    <h3 style="color: #333333; margin: 0; line-height: 38px;">{{selVal}}</h3>
                                </template>
                                <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
                                <el-table-column label="健康告知内容" prop="notice" class-name="tj"></el-table-column>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>

            </template>
            <div class="empty-tips" v-else>
                请选择左侧列表
            </div>
        </div>
    </div>
</template>

<script>
    import SideFilterList from '@/components/side-filter-list'
    import FilterShell, {hasValue} from '@/components/filters/filter-shell'
    import {getHealthNoticeProductList, getHealthNoticeDetail} from '@/apis/modules/underwriting'
    import {debounce} from '@/utils'
    import html2canvas from 'html2canvas'
    export default {
        name: 'health-search',
        components: {
            SideFilterList,
            FilterShell
        },
        data() {
            return {
                loading: false,
                detailLoading: false,
                selVal: '',
                tableData: [],
                productData: [],
                searchModel: {
                    product_name: '',
                    notice: '',
                    condition_search: '',
                    is_reverse: '0',
                },
                isReverseData: [
                    {label: '正向条件', value: '0'},
                    {label: '反向条件', value: '1'}
                ],
                fontSize: 14
            }
        },
        methods: {
            hasValue,
            handleSelProduct(obj) {
                const {product_name} = obj
                this.selVal = product_name
                this.ajaxDetail(product_name)
            },
            ajaxDetail(product_name) {
                this.detailLoading = true
                getHealthNoticeDetail({
                    ...this.searchModel,
                    product_name
                }).then(res => {
                    this.tableData = res
                }).catch(() => {}).finally(() => {
                    this.detailLoading = false
                })
            },
            ajaxProductData() {
                this.loading = true
                this.tableData = []
                this.selVal = ''
                getHealthNoticeProductList({...this.searchModel}).then(res => {
                    this.productData = res
                }).catch(() => {}).finally(() => {
                    this.loading = false
                })
            },
            debounceAjaxProductData: debounce(function() {
                this.ajaxProductData()
            }, 300),
            // 生成图片
            createImg() {
                this.$nextTick(() => {
                    let self = this
                    html2canvas(this.$refs.imageDom).then(canvas => {
                        // 转成图片，生成图片地址
                        self.imgUrl = canvas.toDataURL('image/png')
                        // 创建隐藏的可下载链接
                        let eleLink = document.createElement('a')
                        eleLink.href = self.imgUrl // 转换后的图片地址
                        eleLink.download = self.selVal
                        // 触发点击
                        document.body.appendChild(eleLink)
                        eleLink.click()
                        // 然后移除
                        document.body.removeChild(eleLink)
                    })
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
        .detail-wrap{
            flex: 1;
            padding: 16px;
            box-sizing: border-box;
            max-width: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
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
            ::v-deep .el-scrollbar {
                flex: 1;
                .el-scrollbar__wrap{
                    overflow-x: hidden;
                }
            }
        }
        .side-filter-container{
            border-right: 1px solid #e6e6e6;
        }
        ::v-deep .is-reverse-filter{
            width: 100px;
            .filter-item{
                margin-right: 0;
                width: initial;
                border: none;
                background: #fff;
            }
        }
        ::v-deep .radio-group-wrap{
            .el-radio-button {
                .el-radio-button__inner {
                    background: #f5f5f5;
                    border-color: #e6e6e6;
                }
                &.is-active .el-radio-button__inner{
                    background: #fff;
                    color: #1F78FF;
                    box-shadow: none;
                }
            }
        }
    }
</style>