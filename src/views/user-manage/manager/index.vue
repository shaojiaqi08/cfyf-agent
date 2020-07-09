<template>
    <div class="manager-container">
        <div class="header">
            内部管理员
            <el-button type="primary" @click="editDialogVisible = true"><i class="iconfont iconxiao16_jiahao"></i> 新增管理员</el-button>
        </div>
        <div class="content">
            <div class="left-scroll-wrap">
                <el-scrollbar class="left-scroll-bar" v-loading="leftLoading">
                    <div v-for="(item, index) in peopleData"
                         :key="index"
                         :class="{'list-item':true, active: curSelManage && curSelManage.id === item.id}"
                         @click="ajaxDetail(item)">
                        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                            <span>{{item.name}}</span>
                        </el-tooltip>
                    </div>
                </el-scrollbar>
                <el-button type="primary" @click="addRoleDialogVisible = true"><i class="iconfont iconxiao16_jiahao"></i> 新增管理员角色</el-button>
            </div>
            <el-scrollbar class="right-scroll-bar" v-loading="rightLoading">
                <el-tabs v-model="curTabIdx" v-if="!contentData.isSupper">
                    <el-tab-pane name="people" label="成员"></el-tab-pane>
<!--                    <el-tab-pane name="permission" label="权限"></el-tab-pane>-->
                </el-tabs>
                <div class="content" v-if="curSelManage && curTabIdx==='people'">
                    <div class="desc-wrap">
                        {{contentData.name}}
                        <span>{{contentData.desc}}</span>
                    </div>
                    <el-table :data="contentData.tableData" border>
                        <el-table-column label="姓名" prop="name" align="center"></el-table-column>
                        <el-table-column label="账号" prop="account" align="center"></el-table-column>
                        <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                        <el-table-column label="开通日期" prop="start_date" align="center"></el-table-column>
                        <el-table-column label="当前状态" prop="status" align="center" width="120">
                            <template v-slot="{row}">
                                <el-tag>{{statusMap[row.status]}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="失效日期" prop="expire_date" align="center"></el-table-column>
                        <el-table-column label="操作" prop="operate" :width="curSelManage.isSupper? 250 : 150" align="center">
                            <template v-slot="{row}">
                                <template v-if="row.status !== 'expired'">
                                    <template v-if="curSelManage.isSupper">
                                    <el-button type="text" @click="lostEffect(row)">使失效</el-button>
                                    <el-button type="text" @click="triggerStatus(row)">{{row.status === 'disabled' ? '启用' : '禁用'}}</el-button>
                                    <el-button type="text" @click="resetPwd(row)">重置密码</el-button>
                                    </template>
                                    <el-button type="text" @click="edit(row)">编辑</el-button>
                                    <el-button type="text" v-if="!curSelManage.isSupper" @click="modifyPwd(row)">修改密码</el-button>
                                </template>
                                <template v-else>
                                    <el-button type="text">-</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="content" v-else-if="curSelManage && curTabIdx==='permission'" style="height: calc(100vh - 150px)">
                    <el-scrollbar class="tree-wrap">
                        <el-tree :data="contentData.permission"
                                 show-checkbox
                                 @node-click="handleTreeNodeClick"></el-tree>
                    </el-scrollbar>

                </div>
            </el-scrollbar>
        </div>
        <!--编辑/编辑管理员-->
        <el-dialog custom-class="manager-dialog" :title="`${editFormModel.id != undefined ? '编辑' : '新增'}管理员信息`" :visible.sync="editDialogVisible" width="480px">
            <el-form ref="editForm" :model="editFormModel" :rules="editRules" label-width="100px" label-position="left">
                <el-form-item label="管理员姓名" prop="real_name">
                    <el-input placeholder="请输入管理员姓名" v-model="editFormModel.real_name"></el-input>
                </el-form-item>
                <el-form-item label="工作邮箱" prop="email">
                    <el-input placeholder="请输入工作邮箱" v-model="editFormModel.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" v-if="editFormModel.id == undefined" prop="mobile">
                    <el-input placeholder="请输入手机号" v-model="editFormModel.mobile"></el-input>
                </el-form-item>
                <el-form-item label="管理员账号" prop="account_name">
                    <el-input placeholder="请输入管理员登录账号" v-model="editFormModel.account_name"></el-input>
                </el-form-item>
                <el-form-item label="管理员角色" prop="role_id">
                    <el-select style="width: 100%" placeholder="请选择管理员角色" v-model="editFormModel.role_id"></el-select>
                </el-form-item>
                <template v-if="editFormModel.id == undefined">
                    <el-form-item label="登录密码" prop="password">
                        <el-input type="password" placeholder="请输入管理员登录密码" v-model="editFormModel.password"></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入密码" prop="confirm_password">
                        <el-input type="password" placeholder="请再次输入登录密码" v-model="editFormModel.confirm_password"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitEdit">确认</el-button>
                </span>
        </el-dialog>
        <!--新增角色-->
        <el-dialog custom-class="manager-dialog" title="新增角色" :visible.sync="addRoleDialogVisible" width="480px">
            <el-form ref="addRoleForm" :model="addRoleFormModel" :rules="addRoleRules" label-width="100px" label-position="left">
                <el-form-item label="角色名称" prop="name">
                    <el-input placeholder="请输入角色名称" v-model="addRoleFormModel.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input type="textarea" placeholder="请输入角色描述"  v-model="addRoleFormModel.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addRoleDialogVisible">取消</el-button>
                <el-button type="primary" @click="submitAddRole">确认</el-button>
            </span>
        </el-dialog>
        <!--修改密码-->
        <el-dialog custom-class="manager-dialog" title="修改密码" :visible.sync="modPwdDialogVisible" width="480px">
            <el-form ref="modPwdForm" :model="modPwdFormModel" :rules="modPwdRules" label-width="100px" label-position="left">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input type="password" placeholder="请输入旧密码" v-model.trim="modPwdFormModel.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" placeholder="请输入密码" v-model.trim="modPwdFormModel.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input type="password" placeholder="请再次输入新密码" v-model.trim="modPwdFormModel.confirmPassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                    <el-button @click="modPwdDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitModifyPwd">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {createManager, editManager, getManagerList, removeEffect, updateStatus, resetPassword, updatePassword} from '@/apis/modules/user-manage' // eslint-disable-line
    export default {
        name: 'manager',
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                leftLoading: false,
                rightLoading: false,
                submitLoading: false, // dialog公用loading
                targetRow: null, // 修改密码目标对象
                peopleData: [
                    {id: 0, name: 'admin', isSupper: false},
                    {id: 1, name: 'superAdmin', isSupper: true}
                ],
                contentData: {},
                curSelManage: null,
                curTabIdx: 'people',
                editDialogVisible: false,
                editFormModel: {
                    id:null,
                    real_name: '',
                    account_name: '',
                    role_id: '',
                    mobile: '',
                    email: '',
                    password: '',
                    confirm_password: ''
                },
                editRules: {
                    real_name: baseValiObj,
                    account_name: baseValiObj,
                    role_id: baseValiObj,
                    mobile: [baseValiObj, {validator: this.moblieValidator}],
                    email: [baseValiObj, {validator: this.emailValidator}],
                    password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}],
                    confirm_password:[baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}]
                },
                addRoleDialogVisible: false,
                addRoleFormModel: {
                    name: '',
                    desc: ''
                },
                addRoleRules: {
                    name: baseValiObj,
                    desc: baseValiObj
                },
                modPwdDialogVisible: false,
                modPwdFormModel: {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                },
                modPwdRules: {
                    oldPassword: [baseValiObj, {validator: this.pwdValidator}],
                    newPassword: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}],
                    confirmPassword: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}]
                },
                statusMap: Object.freeze({
                    disabled: '禁用',
                    enabled: '有效',
                    expired: '失效'
                })
            }
        },
        created() {
            this.ajaxPeopleList()
        },
        methods: {
            handleTreeNodeClick() {

            },
            // 使失效
            lostEffect() {
                const h = this.$createElement
                this.$confirm(
                    h('div', [
                        h('i', {
                            class: {
                                iconfont: true,
                                'iconzhong20_gantanhao': true
                            },
                            style: {
                                color: '#FF4C4C',
                                marginRight: '10px'
                            }
                        }),
                        h('span', '账号失效后无法登录系统，且不可恢复，是否确认失效？')
                    ]),
                    '提示',
                    {
                        confirmButtonText: '失效',
                        confirmButtonClass: 'el-button--danger',
                        customClass: 'manager-msg-box'
                    }
                ).then(() => {

                }).catch(() => {    })
            },
            triggerStatus(row) {
                const {id, status} = row
                const isDisabled = status === 'enabled'
                const confirmButtonText = isDisabled ? '禁用' : '启用'
                const confirmButtonClass = isDisabled ? 'el-button--danger' : ''
                const txt = isDisabled ? '账号禁用期间不可登录系统，是否确认禁用？' : '账号启用后，可正常登录系统，是否确认启用？'
                const h = this.$createElement
                this.$confirm(
                    h('div', [
                        h('i', {
                            class: {
                                iconfont: true,
                                'iconzhong20_gantanhao': true
                            },
                            style: {
                                color: '#FF4C4C',
                                marginRight: '10px'
                            }
                        }),
                        h('span', txt)
                    ]),
                    '提示',
                    {
                        confirmButtonText,
                        confirmButtonClass,
                        customClass: 'manager-msg-box'
                    }
                ).then(() => {
                    (isDisabled ? this.disabled : this.enabled)(id)
                }).catch(() => {})
            },
            // 启用
            enabled() {},
            // 禁用
            disabled() {},
            // 重置密码
            resetPwd() {
                const h = this.$createElement
                this.$confirm(
                    h('div', [
                        h('i', {
                            class: {
                                iconfont: true,
                                'iconzhong20_gantanhao': true
                            },
                            style: {
                                color: '#FFBB33',
                                marginRight: '10px'
                            }
                        }),
                        h('span', '是否确认重置密码？')
                    ]),
                    '提示',
                    {
                        confirmButtonText: '重置'
                    }
                ).then(() => {

                }).catch(() => {    })
            },
            edit(row) {
                if (row) {
                    this.editFormModel.id = row.id
                }
                this.editDialogVisible = true
            },
            // 提交编辑
            submitEdit() {
                this.$refs.editForm.validate(flag => {
                    if (flag) {
                        console.log(123)
                    }
                })
            },
            // 提交新增角色
            submitAddRole() {
                this.$refs.addRoleForm.validate(flag => {
                    if (flag) {
                        console.log(123)
                    }
                })
            },
            modifyPwd(row) {
                this.targetRow = row
                this.modPwdDialogVisible = true
            },
            submitModifyPwd() {
                this.$refs.modPwdForm.validate(flag => {
                    if (flag) {
                        console.log(123)
                    }
                })
            },
            ajaxPeopleList() {
                this.ajaxDetail(this.peopleData[0])
            },
            ajaxDetail(obj) {
                this.curTabIdx = 'people'
                this.curSelManage = obj
                this.contentData = {
                    name: obj.id ? '管理员' : '超级管理员',
                    desc: '角色描述，展示一行，超长的情况下就使用点点点',
                    tableData: [
                        {
                            name: '11',
                            account: '11',
                            mobile: '11',
                            start_date: '11',
                            status: 'enabled',
                            expire_date: '11'
                        },
                        {
                            name: '11',
                            account: '11',
                            mobile: '11',
                            start_date: '11',
                            status: 'disabled',
                            expire_date: '11'
                        },
                        {
                            name: '11',
                            account: '11',
                            mobile: '11',
                            start_date: '11',
                            status: 'expired',
                            expire_date: '11'
                        }
                    ],
                    permission: [{
                        label: '一级 1',
                        children: [{
                            label: '二级 1-1',
                            children: [{
                                label: '三级 1-1-1'
                            }]
                        }]
                    }, {
                        label: '一级 2',
                        children: [{
                            label: '二级 2-1',
                            children: [{
                                label: '三级 2-1-1'
                            }]
                        }, {
                            label: '二级 2-2',
                            children: [{
                                label: '三级 2-2-1'
                            }]
                        }]
                    }, {
                        label: '一级 3',
                        children: [{
                            label: '二级 3-1',
                            children: [{
                                label: '三级 3-1-1'
                            }]
                        }, {
                            label: '二级 3-2',
                            children: [{
                                label: '三级 3-2-1'
                            }]
                        }]
                    }],
                    isSupper: !!obj.id
                }
            },
            comparePwdValitator(rule, value, callback) { // eslint-disable-line
                const {newPassword, confirmPassword} = this.modPwdFormModel
                if (!newPassword || !confirmPassword) {
                    callback()
                } else if(newPassword !== confirmPassword) {
                    callback(new Error('确认新密码必须跟新密码一致'))
                }
            },
            pwdValidator(rule, value, callback) {
                if (value.length < 6) {
                    return callback(new Error('密码至少是6位任意字符'))
                }
                callback()
            },
            emailValidator(rule, value, callback) { // eslint-disable-line
                if(!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)) {
                    return callback(new Error('请输入正确的email格式'))
                }
                callback()
            },
            moblieValidator(rule, value, callback) { // eslint-disable-line
                if (!/^1[3456789]\d{9}$/.test(value)) {
                    return callback(new Error('请输入正确的手机格式'))
                }
                callback()
            }
        },
        watch: {
            editDialogVisible(v) {
                !v && this.$refs.editForm.resetFields()
            },
            addRoleDialogVisible(v) {
                !v && this.$refs.addRoleForm.resetFields()
            },
            modPwdDialogVisible(v) {
                !v && this.$refs.modPwdForm.resetFields()
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
        & >.content{
            display: flex;
            height: calc(100vh - 119px);
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
                    padding: 0 16px 16px 16px;
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
                    width: 480px;
                    height: calc(100% - 32px);
                    margin:16px auto;
                    border: 1px solid #e6e6e6;
                    border-radius: 4px;
                    padding: 13px 6px;
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
            display: none;
        }
    }
</style>