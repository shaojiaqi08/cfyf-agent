<template>
    <div class="sale-container page-container">
        <div class="header">
            <el-tabs v-model="curTabIdx">
                <el-tab-pane v-if="$checkAuth('/sale/list')" name="sale-pane" label="团队"></el-tab-pane>
                <el-tab-pane v-if="$checkAuth('/sale/position_and_authority')" name="position-pane" label="职位及权限"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="content">
            <keep-alive>
                <Component :is="curTabIdx"></Component>
            </keep-alive>
        </div>
    </div>
</template>

<script>
    import SalePane from './tab-panel/sale'
    import PositionPane from './tab-panel/position'
    import {mapState} from 'vuex'
    export default {
        name: 'sale',
        components: {SalePane, PositionPane},
        data() {
            return {
                curTabIdx: ''
            }
        },
        computed: {
            ...mapState('users', ['userInfo'])
        },
        watch: {
            'userInfo.permissions': {
                handler() {
                    // 初始化tab权限
                    if (this.$checkAuth('/sale/list')) {
                        this.curTabIdx = 'sale-pane'
                    } else if (this.$checkAuth('/sale/position_and_authority')) {
                        this.curTabIdx = 'position-pane'
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .sale-container {
        padding: 20px 20px 0 20px;
        display: flex;
        flex-direction: column;
        & >.header {
            font-size: 16px;
            font-weight: bold;
            padding: 016px;
            height: 56px;
            background: #F5F5F5;
            border-radius: 4px 4px 0px 0px;
            border: 1px solid #E6E6E6;
            display: flex;
            justify-content: space-between;
            .el-input {
                width: 360px;
            }
            & ::v-deep .el-tabs .el-tabs__header{
                margin: 0;
            }
        }
        & >.content{
            flex: 1;
            overflow: hidden;
            display: flex;
            background-color: #fff;
            box-sizing: border-box;
            border: 1px solid #e6e6e6;
            border-top: transparent;
            .left-scroll-wrap{
                width: 240px;
                height: 100%;
                padding-bottom: 64px;
                position: relative;
                box-sizing: border-box;
                border-right: 1px solid #e6e6e6;
                &>.el-button{
                    position: absolute;
                    bottom: 14px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
            ::v-deep .el-scrollbar{
                .el-scrollbar__wrap{
                    overflow-x: hidden;
                }
            }
            ::v-deep .left-scroll-bar{
                width: 240px;
                height: 100%;
                .list-item{
                    line-height: 44px;
                    height: 44px;
                    padding: 0 16px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color:#4d4d4d;
                    cursor: pointer;
                    box-sizing: border-box;
                    &.active, &:hover{
                        border-top:1px solid rgba(0, 0, 0, .1);
                        border-bottom:1px solid rgba(0, 0, 0, .1);
                        color: #1A1A1A;
                    }
                    &.active{
                        background-color: #F5F5F5;
                    }
                    &:hover{
                        background-color: #e6e6e6;
                    }
                }
            }
            ::v-deep .right-scroll-bar{
                flex: 1;
                height: 100%;
                .el-tabs{
                    padding: 16px 16px 0 16px;
                    .el-tabs__header{
                        margin: 0;
                    }
                }
                .content{
                    padding: 16px;
                    box-sizing: border-box;
                    .desc-wrap{
                        display: flex;
                        height:56px;
                        line-height: 56px;
                        padding: 0 16px;
                        margin: 16px 0;
                        background:rgba(245,245,245,1);
                        border-radius:4px;
                        border:1px solid rgba(230,230,230,1);
                        color: #1A1A1A;
                        font-weight: bold;
                        &>span{
                            font-weight: normal;
                            font-size: 14px;
                            color:#999;
                            margin-left: 16px;
                            flex: 1;
                            display: inline-block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .tree-wrap{
                    height: 100%;
                    border-radius: 4px;
                }
                .el-table .el-button{
                    min-width: 0;
                    padding: 0;
                }
            }
        }
    }
</style>
<style lang="scss">
    .manager-dialog{
        .el-form-item__label::before{
            /*display: none;*/
        }
    }
    .permission-dialog{
        .el-scrollbar .el-scrollbar__wrap{
            overflow-x: hidden;
        }
    }
</style>