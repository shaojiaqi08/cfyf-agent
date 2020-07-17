<template>
    <div class="underwrite-search-container">
        <el-input clearable placeholder="搜索产品名称" class="search-input" v-model="searchModel.product_name" prefix-icon="el-icon-search"></el-input>
        <side-filter-list
            v-loading="loading"
            label-key="product_name"
            value-key="product_name"
            :showFilter="false"
            v-model="selVal"
            @change="handleSelProduct"
            style="width:280px"
            :listData="productData"
        >
            <div slot="extraFilter">
                <div class="flex-between pt16 pl16 pr16">
                    <filter-shell v-model="searchModel.illness">
                        <el-input v-model="searchModel.illness" clearable></el-input>
                        <template v-slot:label>
                            <span>病种</span>
                        </template>
                        <template v-slot:close>
                            <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                               v-if="hasValue(searchModel.illness)"
                               @click.stop="searchModel.illness = ''"></i>
                        </template>
                    </filter-shell>
                    <filter-shell v-model="searchModel.condition_search">
                        <el-input v-model="searchModel.condition_search" clearable></el-input>
                        <template v-slot:label>
                            <span>条件</span>
                        </template>
                        <template v-slot:close>
                            <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                               v-if="hasValue(searchModel.condition_search)"
                               @click.stop="searchModel.condition_search = ''"></i>
                        </template>
                    </filter-shell>
                </div>
                <div class="flex-center pt16 pb16">
                    <filter-shell v-model="searchModel.is_reverse" class="is-reverse-filter">
                        <el-select v-model="searchModel.is_reverse"
                                   style="width: 100%"
                                   clearable
                                   placeholder="请选择"
                                   @change="closePopover">
                            <el-option v-for="(item, index) in isReverseData" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <template v-slot:label>
                            <span>
                                {{ hasValue(searchModel.is_reverse) ? isReverseData.find(i => i.value === searchModel.is_reverse).label : '正向结果' }}
                            </span>
                        </template>
                    </filter-shell>
                </div>
            </div>
        </side-filter-list>
        <div class="detail-wrap"
             v-loading="detailLoading"
             ref="detailWrap">
            <template  v-if="tableData.length > 0">
                <div class="head flex-between">
                    <p>{{selVal}}</p>
                    <div>
                        调整字号
                        <el-input-number class="ml16" :min="14" :max="24" v-model="fontSize" size="small"></el-input-number>
                    </div>
                </div>
                <el-table :data="tableData" border :max-height="tableMaxHeight" :style="{fontSize: fontSize + 'px'}">
                    <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
                    <el-table-column label="器官" prop="organ" width="150px" align="center"></el-table-column>
                    <el-table-column label="病种模块" prop="illness_module" width="250px" align="center"></el-table-column>
                    <el-table-column label="病种分类" prop="illness_category" width="250px" align="center"></el-table-column>
                    <template v-for="(item,index) in maxConditionLength">
                        <el-table-column
                                width="250px"
                                :prop="`conditions[${index}]`"
                                :label="`条件${index+1}`"
                                align="center"
                                :key="index"
                        ></el-table-column>
                    </template>
                </el-table>
            </template>

        </div>
    </div>
</template>

<script>
    import SideFilterList from '@/components/side-filter-list'
    import {getUnderwritingProductList, getUnderwritingDetail} from '@/apis/modules/underwriting'
    import FilterShell, {clearValue, hasValue, closePopover} from '../../components/filter-shell'
    import {debounce} from '@/utils'
    export default {
        name: 'underwrite-search',
        components: {
            SideFilterList,
            FilterShell
        },
        data() {
            return {
                loading: false,
                detailLoading: false,
                selVal: '', // 选中的产品
                tableMaxHeight: 0,
                tableData: [],
                productData: [],
                searchModel: {
                    product_name: '',
                    illness: '',
                    condition_search: '',
                    is_reverse: '0',
                },
                maxConditionLength: 15,
                fontSize: 14,
                isReverseData: [
                    {label: '正向条件', value: '0'},
                    {label: '反向条件', value: '1'}
                ]
            }
        },
        methods: {
            clearValue,
            hasValue,
            closePopover,
            handleSelProduct(obj) {
                const {product_name} = obj
                this.selVal = product_name
                this.ajaxDetail(product_name)
            },
            ajaxDetail(product_name) {
                this.detailLoading = true
                getUnderwritingDetail({
                    ...this.searchModel,
                    product_name,
                }).then(res => {
                    this.tableData = res
                }).finally(() => {
                    this.detailLoading = false
                })
            },
            ajaxProductData() {
                this.loading = true
                this.selVal = ''
                this.tableData = []
                getUnderwritingProductList({...this.searchModel}).then(res => {
                    this.productData = res
                }).catch(() => {}).finally(() => {
                    this.loading = false
                })
            },
            debounceAjaxProductData() {
                const func = debounce(() => {
                    this.ajaxProductData()
                }, 300)
                func()
                this.debounceAjaxProductData = func
            },
            calcTableMaxHeight() {
                this.tableMaxHeight = this.$refs.detailWrap.offsetHeight - 80
            }
        },
        watch: {
            searchModel: {
                handler() {
                    this.debounceAjaxProductData()
                },
                deep: true
            }
        },
        created() {
            this.ajaxProductData()
        },
        mounted() {
            this.calcTableMaxHeight()
            window.addEventListener('resize', this.calcTableMaxHeight)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.this.calcTableMaxHeight)
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
        }
        .side-filter-container{
            border-right: 1px solid #e6e6e6;
        }
        ::v-deep .filter-bar{
            width: 116px;
            .filter-item{
                width: 100%;
                text-align: center;
            }
        }
        ::v-deep .is-reverse-filter{
            width: initial;
            .filter-item{
                margin-right: 0;
                width: initial;
                border: none;
                background: #fff;
            }
        }
    }
</style>