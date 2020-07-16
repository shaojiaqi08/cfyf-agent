<template>
    <div class="product-compare-container">
        <div class="header">
            产品对比
            <div class="flex-between">
                <el-input placeholder="搜索产品或保险公司" size="small">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </div>
        <div class="content">
            <div class="left-content">
                <div class="header">
                    <el-popover
                            placement="bottom"
                            width="200"
                            trigger="click"
                            v-model="filterSelectVisible">
                        <el-select v-model="searchModel.product_insurance_class"
                                   clearable
                                   @change="filterSelected">
                            <el-option v-for="item in insuranceClasses"
                                       :key="item.value"
                                       :label="item.name"
                                       :value="item.value">{{ item.name }}</el-option>
                        </el-select>
                        <div class="filter-selector" slot="reference">
                            {{ searchModel.product_insurance_class ? getName(searchModel.product_insurance_class) : '全部险种' }}
                            <i class="el-icon-arrow-down"></i>
                        </div>
                    </el-popover>
                </div>
                <div class="body" v-loading="isLoading">
                    <el-scrollbar class="scroll-bar" style="height: 800px;">
                        <div v-infinite-scroll="load">
                            <div class="item"
                                 v-for="(item, index) in list"
                                 :key="item.id">
                                <div class="title">
                                    {{ item.product_name }}
                                </div>
                                <div class="tags">
                                    <div class="tag" style="margin-right: 2px;">
                                        {{ item.product_insurance_class_str }}
                                    </div>
                                    <div class="tag" v-if="item.supplier_name">
                                        {{ item.supplier_name }}
                                    </div>
                                </div>
                                <div class="buttons">
                                    <el-button type="primary"
                                               plain
                                               size="small"
                                               @click="add2Compare(index)">
                                        <i class="el-icon-plus"></i>
                                        添加对比
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="right-content selected-list">
                <div class="box">
                    <div class="header">
                        已选择 {{ selected.length }} 款产品
                        <span class="tips">
              （最多选择6款产品）
             </span>
                    </div>
                    <div class="body">
                        <div class="empty-tips" v-if="!selected.length">
                            从左侧选择产品后开始对比
                        </div>
                        <div class="item"
                             v-for="(item, index) in selected"
                             :key="index">
                <span class="close-btn" @click="removeProduct(index)">
                  <i class="iconfont iconxiao_yuanxingguanbi"></i>
                </span>
                            <div class="content">
                                <div class="title">{{ item.product_name }}</div>
                                <div class="close"></div>
                            </div>
                            <div class="footer">
                                <div class="tag">{{ item.product_insurance_class_str }}</div>
                                <div class="tag">{{ item.supplier_name }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="footer-button" @click="compare" v-allowed="['get_products_compare_info']">
                        开始对比
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const insuranceClasses = [
        {value: 'stricken', name: '重疾险'},
        {value: 'health', name: '医疗险'},
        {value: 'life', name: '寿险'},
        {value: 'accident', name: '意外险'}
    ]
    import { getEvaluationProductPageList } from '@/apis/modules/underwriting'
    export default {
        name: 'product-compare',
        data() {
            return {
                list: [],
                selected: [],
                filterSelectVisible: false,
                isLoading: false,
                insuranceClasses,
                total: 0,
                searchModel: {
                    product_insurance_class: null,
                    product_name: null,
                    supplier_name: null,
                    page: 1
                }
            }
        },
        methods: {
            load() {
                if (this.total <= this.searchModel.page * 20) return
                this.searchModel.page += 1
                this.getEvaluationProductPageList()
            },
            removeProduct(index) {
                this.selected.splice(index, 1)
            },
            getName(value) {
                return this.insuranceClasses.find(i => i.value === value).name
            },
            filterSelected() {
                this.filterSelectVisible = false
                this.list = []
                this.searchModel.page = 1
                this.total = 0
                this.search()
            },
            add2Compare(index) {
                if (this.selected.length >= 6) {
                    return this.$message({
                        message: '最多只能添加六个产品',
                        type: 'error'
                    })
                }
                this.selected.push(this.list[index])
            },
            compare() {
                const ids = this.selected.map(i => i.id)
                if (!ids.length) {
                    return this.$message({
                        type: 'warning',
                        message: '请添加对比产品'
                    })
                }

                let route = this.$router.resolve({
                    path: `product-compare-lab`, query: { ids: JSON.stringify(ids) }
                })

                window.open(route.href, '_blank')
            },
            search(model) {
                if (model) {
                    this.list = []
                    this.searchModel.product_name = null
                    this.searchModel.supplier_name = null
                    this.searchModel[model.keyword_type] = model.keyword
                    this.searchModel.page = 1
                    this.total = 0
                }
                this.getEvaluationProductPageList()
            },
            getEvaluationProductPageList() {
                this.isLoading = true
                getEvaluationProductPageList(this.searchModel)
                    .then(res => {
                        // this.list.push(res.data)
                        this.list = this.list.concat(res.data)
                        this.total = res.total
                        this.page = res.current_page
                        this.isLoading = false
                    })
                    .catch(err => console.log(err))
            }
        }
    }
</script>

<style scoped lang="scss">
    .product-compare-container{
        padding: 16px 16px 0 16px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        & > .header {
            font-size: 16px;
            font-weight: bold;
            padding: 0 16px;
            height: 56px;
            background: #f5f5f5;
            border-radius: 4px 4px 0px 0px;
            border: 1px solid #e6e6e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-input {
                width: 360px;
            }
        }
        .content{
            background-color: #fff;
            flex: 1;
            overflow: hidden;
            border: 1px solid #e6e6e6;
            border-top: transparent;
            box-sizing: border-box;
            display: flex;
            .left-content{
                flex: 1;
                .header{
                    height: 56px;
                    padding: 14px 16px;
                }
            }
            .right-content{
                width: 380px;
                border-left: 1px solid #e6e6e6;
                &.selected-list {
                    flex: 0 0 432px !important;
                    background-color: #E6E6E6;

                    .box {
                        position: relative;
                        padding: 20px;
                        width: 400px;
                        height: 100%;
                        background-color: #fff;

                        .header {
                            padding-bottom: 20px;
                            font-size: 16px;
                            color: #333333;
                            font-weight: bold;

                            .tips {
                                font-size: 14px;
                                font-weight: bold;
                                color: #999999;
                            }
                        }

                        .body {
                            border-radius: 4px;

                            .empty-tips {
                                margin: 50% auto;
                                color: #999;
                                text-align: center;
                            }

                            .item {
                                position: relative;
                                margin-bottom: 16px;
                                padding: 16px;
                                background-color: #F5F5F5;
                                border: 1px solid #E6E6E6;
                                border-radius: 4px;

                                .close-btn {
                                    position: absolute;
                                    right: 15px;
                                    top: 18px;
                                    color: red;
                                    cursor: pointer;
                                }

                                .content {
                                    display: flex;

                                    .title {
                                        color: #131415;
                                        font-size: 16px;
                                        line-height: 24px;
                                        font-weight: bold;
                                    }

                                    .close {
                                        flex: 1 1 100px;
                                        cursor: pointer;
                                    }
                                }
                            }
                        }

                        .footer {
                            margin-top: 10px;

                            .tag {
                                display: inline-block;
                                padding: 2px 10px;
                                border: 1px solid rgba(233, 233, 235, 1);
                                color: #999999;
                                font-size: 12px;
                                font-weight: 500;
                                border-radius: 4px;
                            }
                        }

                        .footer-button {
                            position: absolute;
                            bottom: 20px;
                            left: 20px;
                            width: 360px;
                            height: 36px;
                            background-color: #FF9000;
                            color: #fff;
                            text-align: center;
                            font-weight: 500;
                            line-height: 36px;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
</style>