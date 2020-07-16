<template>
    <div class="underwrite-search-container">
        <el-input placeholder="搜索产品名称" class="search-input" v-model="productName" prefix-icon="el-icon-search"></el-input>
        <side-filter-list
                v-loading="loading"
                label-key="label"
                value-key="value"
                :showFilter="false"
                v-model="selVal"
                @change="handleSelProduct"
                style="width: 280px"
        >
            <div slot="extraFilter">
                <div class="flex-between pt16 pb16 pl16">
                    <filter-shell v-model="illness">
                        <el-input v-model="illness" clearable></el-input>
                        <template v-slot:label>
                            <span>
                                {{ hasValue(illness) ? illness : '健康告知' }}
                            </span>
                        </template>
                        <template v-slot:close>
                            <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                               v-if="hasValue(illness)"
                               @click.stop="illness = ''"></i>
                        </template>
                    </filter-shell>
                    <filter-shell v-model="is_reverse">
                        <el-select v-model="is_reverse"
                                   clearable
                                   placeholder="请选择"
                                   @change="closePopover">
                            <el-option v-for="(item, index) in isReverseData" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <template v-slot:label>
                            <span>
                                {{ hasValue(is_reverse) ? isReverseData.find(i => i.value === is_reverse).label : '正向结果' }}
                            </span>
                        </template>
                    </filter-shell>
                </div>
            </div>
        </side-filter-list>
        <div class="detail-wrap"
             v-loading="detailLoading">
            <div class="head flex-between">
                <p>产品健告</p>
                <div class="flex-center">
                    调整字号
                    <el-input-number class="ml16" :min="14" :max="24" v-model="fontSize" size="small"></el-input-number>
                    <el-button class="ml16" type="primary"><i class="iconfont iconxiao16_shengcheng"></i> 生成图片</el-button>
                </div>
            </div>
            <el-table :data="tableData" border max-height="calc(100% - 48px)" :style="{fontSize: fontSize + 'px'}">
                <el-table-column class-name="p16">
                    <template slot="header">
                        <h3 style="color: #333333; margin: 0">{{selName}}</h3>
                    </template>
                    <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
                    <el-table-column label="健康告知内容" prop="notice" class-name="tj"></el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import SideFilterList from '@/components/side-filter-list'
    import FilterShell, {clearValue, hasValue, closePopover} from '../../components/filter-shell'
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
                selVal: null,
                selName: '',
                productName: '',
                tableData: [],
                illness: '',
                condition_search: '',
                is_reverse: '0',
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
                this.selName = obj.product_name
                this.ajaxProductData()
            },
            ajaxProductData() {}
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
    }
</style>