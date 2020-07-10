<template>
    <div class="server-rate-container">
        <side-filter-list
            v-loading="companyLoading"
            :list-data="filterCompanyList"
            label-key="label"
            value-key="value"
            placeholder="搜索B端公司"
            v-model="selVal"
            @change="handleSelCompany"
        ></side-filter-list>
        <side-filter-list
                v-loading="productLoading"
                :list-data="productList"
                label-key="label"
                value-key="value"
                placeholder="搜索产品名称"
                v-model="selProductVal"
                @change="handleSelProduct"
        >
            <template slot="extraFilter">
                <div class="extra-filter-bar">
                    <el-tag>占位置</el-tag>
                </div>
            </template>
            <template v-slot:list="{row}">
                <div class="product-list-item flex">
                    <span>{{row.label}}</span>
                    <el-tooltip :content="row.tip_text" placement="top">
                        <span :style="{backgroundColor: row.color}"></span>
                    </el-tooltip>
                </div>
            </template>
        </side-filter-list>
        <div class="detail-wrap"
             v-loading="detailLoading">
            <div class="head">
                <p>服务费率记录</p>
                某某某保险产品名称过长换行超过两行就换行展示产品
                <el-button type="primary"><i class="iconfont iconxiao16_shezhi mr4"></i>设置服务费率</el-button>
            </div>
            <el-tabs v-model="tabIdx">
                <el-tab-pane name="1" label="首年">
                    <el-scrollbar>
                        <div class="card">
                            <div class="flex-between">
                                <span class="flex-center">
                                    <el-tooltip content="添加时间" placement="top">
                                        <i class="iconfont iconxiao16_tianjiashijian mr4"></i>
                                    </el-tooltip>
                                    2020年2月15日 09:44
                                </span>
                                <span class="flex-center">
                                    <el-tooltip content="生效日期" placement="top">
                                        <i class="iconfont iconxiao16_shengxiaoriqi mr4"></i>s
                                    </el-tooltip>
                                    2020年3月1日—2020年6月30日
                                    <el-tag type="success" class="ml16">生效中</el-tag>
                                </span>
                            </div>
                            <div class="flex">
                                <div class="pay-block">
                                    10年缴费/保障30年<br>
                                    <span>20%<i class="iconfont iconxiao16_jiahao"></i><span>6%</span></span>
                                </div>
                                <div class="pay-block">
                                    20年缴费/保障30年<br>
                                    <span>20%<i class="iconfont iconxiao16_jiahao"></i><span>6%</span></span>
                                </div>
                                <div class="pay-block">
                                    20年缴费/保障40年<br>
                                    <span>20%<i class="iconfont iconxiao16_jiahao"></i><span>6%</span></span>
                                </div>
                                <div class="pay-block">
                                    30年缴费/保至终生<br>
                                    <span>20%<i class="iconfont iconxiao16_jiahao"></i><span>6%</span></span>
                                </div>

                            </div>
                            <el-divider></el-divider>
                            <div class="flex flex-between">
                                <div class="flex">
                                    <span class="flex-center mr4">
                                        <el-tooltip content="费率计算方法" placement="top">
                                            <i class="iconfont iconxiao16_feishuaijisuanfangfa mr4"></i>
                                        </el-tooltip>
                                        2020年2月15日 09:44
                                    </span>
                                    <span class="flex-center ml20">
                                        <el-tooltip content="达成方法" placement="top">
                                            <i class="iconfont iconxiao16_dachengtiaojian mr4"></i>
                                        </el-tooltip>
                                        续保率≥90%
                                    </span>
                                </div>

                                <div>
                                    <el-button type="plain"><i class="iconfont iconxiao16_lajitong mr4"></i>删除</el-button>
                                    <el-button type="plain" style="margin: 0 6px 0 16px"><i class="iconfont iconxiao16_fuzhi mr4"></i>复制</el-button>
                                    <el-button type="plain"><i class="iconfont iconxiao16_bianji mr4"></i>编辑</el-button>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane name="2" label="第2年"></el-tab-pane>
                <el-tab-pane name="3" label="第3年"></el-tab-pane>
                <el-tab-pane name="4" label="第4年"></el-tab-pane>
                <el-tab-pane name="5" label="第5年"></el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import SideFilterList from '../component/side-filter-list'
    export default {
        name: 'server-rate',
        components: {SideFilterList},
        data() {
           return {
               dialogVisible: false,
               companyLoading: false,
               productLoading: false,
               detailLoading: false,
               companyList: [
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
                   {label: 'xxx有限公司', value: 'aa'},
                   {label: 'xxxx无限公司', value: 'bb'},
                   {label: 'xxxsx上市公司', value: 'cc'},
               ],
               productList: [
                   {label: '产品111产品111产品111产品111产品111产品111', value: 'aa', color: '#339AFF', tip_text: '未设置'},
                   {label: '产品222', value: 'bb', color: '#40D659', tip_text: '未设置'},
                   {label: '产品333', value: 'cc', color: '#FF4C4C', tip_text: '未设置'},
                   {label: '产品444', value: 'dd', color: '#4D4D4D', tip_text: '未设置'},
               ],
               selVal: 'aa', // 公司选中值
               selProductVal: 'aa', // 产品选中值
               extra: '',
               productFilter: {},
               tabIdx: '1'
           }
        },
        computed: {
            filterCompanyList() {
                const {extra, companyList} = this
                return companyList.filter(item => item['label'].includes(extra))
            },
            filterProductList() {
                const {productFilter, companyList} = this
                return companyList.filter(item => item['label'].includes(productFilter))
            }
        },
        methods: {
            handleSelCompany() {
            },
            handleSelProduct() {

            }
        },
        created() {
        }
    }
</script>

<style scoped lang="scss">
    .server-rate-container{
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
            &>span:last-of-type{
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 100%;
            }
        }
        .detail-wrap{
            flex: auto;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .head{
                height: 68px ;
                position: relative;
                font-size: 14px;
                line-height: 20px;
                color:#999999;
                padding-bottom: 16px;
                &>p{
                    line-height: 28px;
                    color: #1a1a1a;
                    font-size: 18px;
                    margin: 0 0 2px 0;
                    font-weight: bold;
                }
                .el-button{
                    position: absolute;
                    right: 0;
                    top: 0;
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
                        width: 25%;
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
            border-right: 1px solid #e6e6e6;
        }
    }
</style>