<template>
    <div class="manager-container">
        <div class="header">
            内部管理员
            <el-button type="primary" @click="editDialogVisible = true"><i class="iconfont iconxiao16_jiahao"></i> 新增管理员</el-button>
        </div>
        <div class="content">
            <div class="left-scroll-wrap">
                <el-scrollbar class="left-scroll-bar" v-loading="leftLoading">
                    <div v-for="(item, index) in roleData"
                         :key="index"
                         :class="{'list-item':true, active: curSelRole && curSelRole.id === item.id}"
                         @click="ajaxDetail(item)">
                        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                            <span>{{item.name}}</span>
                        </el-tooltip>
                    </div>
                </el-scrollbar>
                <el-button type="primary" @click="addRoleDialogVisible = true"><i class="iconfont iconxiao16_jiahao"></i> 新增管理员角色</el-button>
            </div>
            <el-scrollbar class="right-scroll-bar" v-loading="rightLoading">
                <el-button v-if="curTabIdx==='permission'" type="primary" style="position: absolute;top:16px;right:16px;z-index: 10" @click="treeDialogVisible=true">编辑</el-button>
                <el-tabs v-model="curTabIdx" v-if="curSelRole && !curSelRole.isSupper">
                    <el-tab-pane name="people" label="成员"></el-tab-pane>
                    <el-tab-pane name="permission" label="权限"></el-tab-pane>
                </el-tabs>
                <div class="content" v-if="curSelRole && curTabIdx==='people'">
                    <div class="desc-wrap">
                        {{curSelRole.name}}
                        <span>{{curSelRole.remark}}</span>
                    </div>
                    <el-table :data="managerData" border>
                        <el-table-column label="姓名" prop="real_name" align="center"></el-table-column>
                        <el-table-column label="账号" prop="account_name" align="center"></el-table-column>
                        <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                        <el-table-column label="开通日期" prop="open_at" align="center">
                            <template v-slot="{row}">
                                <span v-if="!row.open_at">-</span>
                                <sapn v-else>{{formatDate(new Date(row.open_at * 1000), 'yyyy-MM-dd')}}</sapn>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前状态" prop="account_status_str" align="center" width="120">
                            <template v-slot="{row}">
                                <el-tag :type="statusColorMap[row.account_status]">{{row.account_status_str}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="失效日期" prop="close_at" align="center">
                            <template v-slot="{row}">
                                <span v-if="!row.open_at">-</span>
                                <sapn v-else>{{formatDate(new Date(row.close_at * 1000), 'yyyy-MM-dd')}}</sapn>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" prop="operate" :width="(curSelRole && !curSelRole.isSupper)? 250 : 150" align="center">
                            <template v-slot="{row}">
                                <template v-if="row.account_status !== accountStatusMap.invalidation.value">
                                    <template v-if="curSelRole && !curSelRole.isSupper">
                                    <el-button type="text" @click="lostEffect(row.id)">使失效</el-button>
                                    <el-button type="text" @click="triggerStatus(row)">{{row.account_status === 'disable' ? '启用' : '禁用'}}</el-button>
                                    <el-button type="text" @click="resetPwd(row.id)">重置密码</el-button>
                                    </template>
                                    <el-button type="text" @click="edit(row)">编辑</el-button>
                                    <el-button type="text" v-if="curSelRole && curSelRole.isSupper" @click="modifyPwd(row)">修改密码</el-button>
                                </template>
                                <template v-else>
                                    <span>-</span>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="content" v-else-if="curSelRole && curTabIdx==='permission'" style="height: calc(100vh - 166px)">
                    <el-scrollbar class="tree-wrap">
                        <permission-tree :data="treeData"></permission-tree>
                    </el-scrollbar>
                </div>
            </el-scrollbar>
        </div>
        <!--编辑/编辑管理员-->
        <el-dialog custom-class="manager-dialog" :title="`${editFormModel.id !== '' ? '编辑' : '新增'}管理员信息`" :visible.sync="editDialogVisible" width="480px">
            <el-form ref="editForm" :model="editFormModel" :rules="editRules" label-width="100px" label-position="left">
                <el-form-item label="管理员姓名" prop="real_name">
                    <el-input placeholder="请输入管理员姓名" v-model="editFormModel.real_name"></el-input>
                </el-form-item>
                <el-form-item label="工作邮箱" prop="email">
                    <el-input placeholder="请输入工作邮箱" v-model="editFormModel.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" v-if="editFormModel.id === ''" prop="mobile">
                    <el-input placeholder="请输入手机号" v-model="editFormModel.mobile"></el-input>
                </el-form-item>
                <el-form-item label="管理员账号" prop="account_name">
                    <el-input placeholder="请输入管理员登录账号" v-model="editFormModel.account_name"></el-input>
                </el-form-item>
                <el-form-item label="管理员角色" prop="role_id">
                    <el-select style="width: 100%" placeholder="请选择管理员角色" v-model="editFormModel.role_id">
                        <el-option v-for="(item, index) in roleData" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="editFormModel.id === ''">
                    <el-form-item label="登录密码" prop="password">
                        <el-input auto-complete="off" type="password" placeholder="请输入管理员登录密码" v-model="editFormModel.password"></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入密码" prop="confirm_password">
                        <el-input type="password" placeholder="请再次输入登录密码" v-model="editFormModel.confirm_password"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
        <!--新增角色-->
        <el-dialog custom-class="manager-dialog" title="新增角色" :visible.sync="addRoleDialogVisible" width="480px">
            <el-form ref="addRoleForm" :model="addRoleFormModel" :rules="addRoleRules" label-width="100px" label-position="left">
                <el-form-item label="角色名称" prop="name">
                    <el-input placeholder="请输入角色名称" v-model="addRoleFormModel.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input type="textarea" placeholder="请输入角色描述"  v-model="addRoleFormModel.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addRoleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAddRole" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
        <!--修改密码-->
        <el-dialog custom-class="manager-dialog" title="修改密码" :visible.sync="modPwdDialogVisible" width="480px">
            <el-form ref="modPwdForm" :model="modPwdFormModel" :rules="modPwdRules" label-width="100px" label-position="left">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input type="password" placeholder="请输入旧密码" v-model.trim="modPwdFormModel.password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" placeholder="请输入密码" v-model.trim="modPwdFormModel.new_password"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input type="password" placeholder="请再次输入新密码" v-model.trim="modPwdFormModel.confirm_new_password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                    <el-button @click="modPwdDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitModifyPwd" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑权限-->
        <el-dialog custom-class="permission-dialog" title="编辑全选" :visible.sync="treeDialogVisible" width="1000px" top="4vh" :close-on-click-modal="false">
            <el-scrollbar style="width: 100%;height: calc(89vh - 150px);">
                <permission-tree v-model="treeData" :editable="true"></permission-tree>
            </el-scrollbar>
            <span slot="footer">
                    <el-button @click="treeDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitModifyPermission" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {createManager,
            editManager,
            getManagerList,
            removeEffect,
            updateStatus,
            resetPassword,
            updatePassword,
            getManageTree,
            updateTree} from '@/apis/modules/user-manage' // eslint-disable-line
    import {getRoleList, createRole} from '@/apis/modules/index'
    import {formatDate} from '@/utils/formatTime'
    import {accountStatusMap} from '@/enums/user-manage'
    import PermissionTree from '../../../components/permission-tree'
    export default {
        name: 'manager',
        components: {PermissionTree},
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                leftLoading: false,
                rightLoading: false,
                submitting: false, // dialog公用loading
                targetRow: null, // 修改密码目标对象
                treeData: [],
                curSelRole: null,
                roleData: [],
                managerData: [],
                curTabIdx: 'people',
                treeDialogVisible: false,
                editDialogVisible: false,
                editFormModel: {
                    id: '',
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
                    remark: ''
                },
                addRoleRules: {
                    name: baseValiObj,
                    remark: baseValiObj
                },
                modPwdDialogVisible: false,
                modPwdFormModel: {
                    password: '',
                    new_password: '',
                    confirm_new_password: ''
                },
                modPwdRules: {
                    password: [baseValiObj, {validator: this.pwdValidator}],
                    new_password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}],
                    confirm_new_password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}]
                },
                accountStatusMap,
                statusColorMap : Object.freeze({
                    disabled: 'danger',
                    enabled: 'success',
                    invalidation: 'minor'
                })
            }
        },
        created() {
            this.ajaxRoleList()
            getManageTree().then(res => {
                this.treeData = res
            })
        },
        methods: {
            formatDate,
            submitModifyPermission() {
                const permission_ids = []
                this.loopTree(this.treeData, permission_ids)
                this.submitting = true
                updateTree({permission_ids, role_id: this.curSelRole.id}).then(() => {
                    this.$message.success('编辑权限成功!')
                    this.treeDialogVisible = false
                }).catch(()=> {}).finally(() => {
                    this.submitting = false
                })
            },
            loopTree(dataArr, arr) {
                dataArr.forEach(item => {
                    console.log(item)
                    if (item.permission_groups && item.permission_groups.length) {
                        this.loopTree(item.permission_groups, arr)
                    }
                    if (item.permissions && item.permissions.length) {
                        arr.push(...item.permissions.filter(item => item.is_checked).map(item => item.id))
                    }
                })
            },
            // 使失效
            lostEffect(id) {
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
                    removeEffect({id}).then(() => {
                        this.$message.success('操作成功!')
                        this.ajaxDetail(this.curSelRole)
                    })
                }).catch(() => {})
            },
            // 更改状态
            triggerStatus(row) {
                const {id, account_status} = row
                const isDisabled = account_status === 'enable'
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
                    updateStatus({id, account_status: isDisabled ? 'disable' : 'enable'}).then(() => {
                        this.$message.success(`${isDisabled ? '禁用' : '启用'}成功!`)
                        this.ajaxDetail(this.curSelRole)
                    })
                }).catch(() => {})
            },
            // 重置密码
            resetPwd(id) {
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
                    resetPassword({id}).then((res) => {
                        this.$confirm(`重置密码成功,新密码【${res.password}】`, '提示')
                    })
                }).catch(() => {})
            },
            edit(row) {
                if (row) {
                    const target = this.editFormModel
                    target.id = row.id
                    target.email = row.email
                    target.real_name = row.real_name
                    target.account_name = row.account_name
                    target.role_id = this.curSelRole.id
                }
                this.editDialogVisible = true
            },
            // 提交编辑
            submitEdit() {
                this.$refs.editForm.validate(flag => {
                    if (flag) {
                        this.submitting = true
                        const {editFormModel, curSelRole} = this
                        const data = {...editFormModel}
                        let handle = createManager
                        if (data.id !== '') { // 编辑移除多余参数
                            data.role_id = curSelRole.id
                            delete data.password
                            delete data.confirm_password
                            delete data.mobile
                            handle = editManager
                        }
                        handle({...data}).then(res => {
                            console.log(res)
                            if (data.id !== '') {
                                this.ajaxDetail(curSelRole)
                            } else {
                                this.ajaxRoleList(+res.role_id)
                            }
                            this.$message.success('修改成功!')
                            this.editDialogVisible = false
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            // 提交新增角色
            submitAddRole() {
                this.$refs.addRoleForm.validate(flag => {
                    if (flag) {
                        this.submitting = true
                        createRole(this.addRoleFormModel).then(() => {
                            this.$message.success('新增角色成功!')
                            this.addRoleDialogVisible = false
                            this.ajaxRoleList()
                        }).finally(() => {
                            this.submitting = false
                        })
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
                        this.submitting = true
                        const {targetRow, modPwdFormModel} = this
                        updatePassword({...modPwdFormModel, id: targetRow.id}).then(() => {
                            this.$message.success('修改密码成功!')
                            this.modPwdDialogVisible = false
                        }).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            ajaxRoleList(roleId) {
                this.leftLoading = true
                getRoleList().then(res => {
                    this.roleData = res.data
                    if (this.roleData.length > 0 && roleId) {
                        const role = this.roleData.find(item => item.id === roleId)
                        this.ajaxDetail(role)
                    }
                }).catch(() => {
                    this.roleData = []
                    this.managerData = []
                    this.curSelRole = null
                }).finally(() => {
                    this.leftLoading = false
                })
            },
            ajaxDetail(obj) {
                this.rightLoading = true
                this.curSelRole = obj
                getManagerList({role_id: obj.id}).then(res => {
                    this.managerData = res.data
                }).finally(() => {
                    this.rightLoading = false
                })
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
                if (!v) {
                    this.editFormModel = this.$options.data().editFormModel
                    this.$nextTick(() => {
                        this.$refs.editForm.clearValidate()
                    })
                }
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
        display: flex;
        flex-direction: column;
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
            flex: 1;
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
            display: none;
        }
    }
    .permission-dialog{
        .el-scrollbar .el-scrollbar__wrap{
            overflow-x: hidden;
        }
    }
</style>