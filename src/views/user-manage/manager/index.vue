<template>
    <div class="manager-container">
        <div class="header">
            内部管理员
            <el-button type="primary">新增管理员</el-button>
        </div>
        <div class="content">
            <el-scrollbar class="left-scroll-bar" v-loading="leftLoading">
                <div v-for="(item, index) in peopleData"
                     :key="index"
                     :class="{'list-item':true, active: curSelManage && curSelManage.id === item.id}"
                     @click="ajaxDetail(item.id)">{{item.name}}</div>
            </el-scrollbar>
            <el-scrollbar class="right-scroll-bar" v-loading="rightLoading">
                <el-tab-pane v-model="curTabIdx" v-if="curSelManage && !curSelManage.isSupper">
                    <el-tab-pane name="people" label="成员"></el-tab-pane>
                    <el-tab-pane name="permission" label="权限"></el-tab-pane>
                </el-tab-pane>
                <div class="content" v-if="curSelManage && curTabIdx==='people'">
                    <div class="desc-wrap">
                        {{contentData.name}}
                        <span>{{contentData.desc}}</span>
                    </div>
                    <el-table :data="contentData.tableData" border>
                        <el-table-column label="姓名" prop="name"></el-table-column>
                        <el-table-column label="账号" prop="account"></el-table-column>
                        <el-table-column label="手机号" prop="mobile"></el-table-column>
                        <el-table-column label="开通日期" prop="start_date"></el-table-column>
                        <el-table-column label="当前状态" prop="status">
                            <template v-slot="{row}">
                                <el-tag>{{row.status}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="失效日期" prop="expire_date"></el-table-column>
                        <el-table-column label="操作" prop="operate"></el-table-column>
                    </el-table>
                </div>
                <div class="content" v-else-if="curSelManage && curTabIdx==='permission'"></div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'manager',
        data() {
            return {
                leftLoading: false,
                rightLoading: false,
                peopleData: [
                    {id: 0, name: 'admin', isSupper: false},
                    {id: 1, name: 'superAdmin', isSupper: true}
                ],
                contentData: {},
                curSelManage: null,
                curTabIdx: 'people'
            }
        },
        created() {
            this.ajaxPeopleList()
        },
        methods: {
            ajaxPeopleList() {
                this.curSelManage = this.peopleData[0]
                this.ajaxDetail(0)
            },
            ajaxDetail(id) {
                this.curTabIdx = 'people'
                this.contentData = {
                    name: id ? '管理员' : '超级管理员',
                    desc: '角色描述，展示一行，超长的情况下就使用点点点',
                    tableData: [
                        {
                            name: '11',
                            account: '11',
                            mobile: '11',
                            start_date: '11',
                            status: '有效',
                            expire_date: '11'
                        }
                    ],
                    permission: []
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .manager-container {
        padding: 20px 20px 0 20px;
        & >.header {
            font-size: 16px;
            font-weight: bold;
            padding: 0 16px;
            height: 56px;
            background: #F5F5F5;
            border-radius: 4px 4px 0px 0px;
            border: 1px solid #E6E6E6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-input {
                width: 360px;
            }
        }
        & > .content{
            display: flex;
            height: calc(100vh - 78px);
            background-color: #fff;
            ::v-deep .el-scrollbar{
                .el-scrollbar__wrap{
                    overflow-x: hidden;
                }
            }

            ::v-deep .left-scroll-bar{
                width: 240px;
                border-right: 1px solid #e6e6e6;
                height: 100%;
                .list-item{
                    line-height: 44px;
                    height: 44px;
                    padding: 0 16px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color:#4d4d4d;
                    cursor: pointer;
                    &.active, &:hover{
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
                .content{
                    padding: 16px;
                    box-sizing: border-box;
                    .desc-wrap{
                        height:56px;
                        line-height: 56px;
                        padding: 0 16px;
                        margin-bottom: 16px;
                        background:rgba(245,245,245,1);
                        border-radius:4px;
                        border:1px solid rgba(230,230,230,1);
                        overflow: hidden;

                    }
                }
            }
        }
    }
</style>