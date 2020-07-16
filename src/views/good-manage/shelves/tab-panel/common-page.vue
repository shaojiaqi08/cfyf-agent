<template>
    <div class="api-container">
        <side-filter-list
                v-loading="companyLoading"
                :list-data="companyList"
                label-key="label"
                value-key="value"
                placeholder="搜索B端公司"
                v-model="selVal"
                @change="handleSelCompany"
        ></side-filter-list>
        <div class="detail-wrap">
            <div class="head">
                {{type}}
                <el-input placeholder="搜索保险产品" size="small">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <el-table ref="table" :data="data" border height="calc(100vh - 193px)" v-loading="tableLoading" v-table-infinite-scroll="scroll2Bottom">
                <el-table-column label="产品名称" align="center" prop="name"></el-table-column>
                <el-table-column label="产品ID" align="center" prop="id"></el-table-column>
                <el-table-column label="上下架状态" align="center">
                    <template v-slot="{row}">
                        <span :style="{color: row.status ? '#40d659' : '#ff4c4c'}">{{row.statusStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template v-slot="{row}">
                        <el-button type="text" @click="triggerShelves(row.status)">{{row.status ? '下' : '上'}}架</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import SideFilterList from '@/components/side-filter-list'
    import {debounce} from '@/utils'
    export default {
        name: 'common-pate',
        props: {
            type: {
                type: String,
                required: true
            }
        },
        components: {SideFilterList},
        directives: {
            'table-infinite-scroll' : {
                inserted(el, binding) {
                    const scrollWrap = el.querySelector('.el-table__body-wrapper')
                    const scrollHandle = debounce(() => {
                        const {scrollHeight, scrollTop, offsetHeight} = scrollWrap
                        if (offsetHeight + scrollTop >= scrollHeight) { // 到底
                            binding.value()
                        }
                    }, 300)
                    scrollWrap.addEventListener('scroll', scrollHandle)
                }
            }
        },
        data() {
            return {
                data: [
                    {id: 0, status: 0, statusStr: '下架中', name: 'aaa产品'},
                    {id: 0, status: 1, statusStr: '上架中',  name: 'bbb产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                    {id: 0, status: 0, statusStr: '下架中', name: 'xxx产品'},
                ],
                tableLoading: false,
                companyLoading: false,
                companyList: [
                    {label: 'xxx有限公司', value: 'aa'},
                    {label: 'xxxx无限公司', value: 'bb'},
                    {label: 'xxxsx上市公司', value: 'cc'}
                ],
                companyKeyword: '',
                positionList: [],
                selVal: 'aa', // 公司选中值,
                searchModel: {
                    page: 1
                },
                total: 0
            }
        },
        computed: {
            filterCompanyList() {
                const {companyList, selVal} = this
                return companyList.filter(item => item['label'].includes(selVal))
            }
        },
        watch: {
            searchModel() {
                this.debounceAjaxTableData()
            }
        },
        methods: {
            triggerShelves(status) {
                const h = this.$createElement
                const tips = `是否确认${status ? '下' : '上'}架？`
                const iconColor = status ? '#FF4C4C' : '#FFBB33'
                const btnCls = status ? 'el-button--danger' : 'el-button--primary'
                const btnTxt = status ? '下架' : '上架'
                this.$confirm(
                    h('div', [
                        h('i', {
                            class: {
                                iconfont: true,
                                'iconzhong20_gantanhao': true
                            },
                            style: {
                                color: iconColor,
                                marginRight: '10px'
                            }
                        }),
                        h('span', tips)
                    ]),
                    '提示',
                    {
                        confirmButtonText: btnTxt,
                        confirmButtonClass: btnCls
                    }
                ).then(() => {
                }).catch(() => {})

            },
            handleSelCompany() {
            },
            scroll2Bottom() {
                this.ajaxTableData()
            },
            debounceAjaxTableData() {
                const func = debounce.call(this, this.ajaxTableData(), 300, true)
                this.debounceAjaxTableData = func
            },
            ajaxTableData() {
                console.log('ajax data')
            }
        },
        created() {
            this.ajaxTableData()
        }
    }
</script>

<style scoped lang="scss">
    .api-container{
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        .extra-filter-bar{
            padding-top: 16px;
        }
        .product-list-item{
            width: 100%;
            &>span:first-of-type{
                line-height: 20px;
                display: inline-block;
                flex: 1;
                padding-right: 8px;
            }
        }
        .detail-wrap{
            flex: auto;
            padding: 0px 16px 16px 16px;
            box-sizing: border-box;
            .head{
                height: 64px ;
                font-size: 14px;
                color:#999999;
                display: flex;
                justify-content: space-between;
                align-items: center;
                &>.el-input{
                    width: 240px;
                    height: 32px;
                }
            }
            ::v-deep .el-tabs{
                flex: auto;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                .el-tabs__content{
                    flex: 1;
                    .el-tab-pane{
                        height: 100%;
                    }
                    .el-scrollbar {
                        height: 100%;
                        .el-scrollbar__wrap{
                            overflow-x: hidden;
                        }
                    }
                }
            }
            .card{
                background:rgba(245,245,245,1);
                border-radius:4px;
                border:1px solid rgba(230,230,230,1);
                padding: 16px;
                box-sizing: border-box;
                &>div:nth-of-type(1){
                    span{
                        font-weight: bold;
                    }
                    i{
                        font-weight: normal;
                    }
                }
                &>div:nth-of-type(2){
                    flex-wrap: wrap;
                    .pay-block{
                        height: 86px;
                        width: 33.333333%;
                        padding-top: 18px;
                        color: #4d4d4d;
                        font-size: 14px;
                        line-height: 20px;
                        &>span{
                            margin-top: 4px;
                            line-height: 28px;
                            font-size: 18px;
                            font-weight: bold;
                            color:#131415;
                            &>span{
                                color: #ff9000;
                            }
                        }
                    }
                }
                .el-divider{
                    margin: 0 0 16px 0;
                    width: calc(100% + 32px);
                    transform: translateX(-16px);
                }
            }
        }
        .side-filter-container{
            flex: 0 0 240px;
            border-right: 1px solid #e6e6e6;
        }
    }
</style>