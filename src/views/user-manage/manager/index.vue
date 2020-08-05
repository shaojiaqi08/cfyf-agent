<template>
    <div class="manager-container">
        <div class="header">
            内部管理员
            <el-button type="primary" @click="addManager"><i class="iconfont iconxiao16_jiahao"></i> 新增管理员</el-button>
        </div>
        <div class="content">
            <side-filter-list
                    v-loading="leftLoading"
                    label-key="name"
                    value-key="id"
                    :showFilter="false"
                    v-model="selRole"
                    @change="handleSelRole"
                    style="width: 240px;border-right: 1px solid #e6e6e6;"
                    :listData="roleData"
            >
                <el-button slot="footer" class="mt8 mb16 mr16 ml16" type="primary" @click="addRoleDialogVisible = true"><i class="iconfont iconxiao16_jiahao"></i> 新增管理员角色</el-button>
            </side-filter-list>
            <el-scrollbar class="right-scroll-bar" v-loading="rightLoading">
                <el-button v-if="curTabIdx==='permission' && !curSelRole.is_super_user" type="primary" style="position: absolute;top:16px;right:16px;z-index: 10" @click="editTree">编辑</el-button>
                <el-tabs v-model="curTabIdx" v-if="curSelRole && !curSelRole.isSupper">
                    <el-tab-pane name="people" label="成员"></el-tab-pane>
                    <el-tab-pane name="permission" label="权限"></el-tab-pane>
                </el-tabs>
                <div class="content" v-if="curSelRole && curTabIdx==='people'">
                    <div class="desc-wrap flex-between">
                        <div>
                            {{curSelRole.name}}
                            <span>{{curSelRole.remark}}</span>
                        </div>
                        <div class="flex-center">
                            <el-tooltip content="角色内无成员才可以删除" :disabled="managerData.length <= 0" placement="top">
                                <el-link :style="{lineHeight: '20px', color: managerData.length > 0 ? '#999': null}"
                                         :disabled="managerData.length > 0 || curSelRole.is_super_user"
                                         :underline="false"
                                         type="minor"
                                         class="mr30 del-link"
                                         @click="delPosition"><i class="iconfont iconxiao16_lajitong mr4"></i>删除</el-link>
                            </el-tooltip>
                            <el-button type="primary" :disabled="curSelRole.is_super_user" @click="handleSetPos"><i class="iconfont iconxiao16_bianji mr4"></i>编辑</el-button>
                        </div>
                    </div>
                    <el-table :data="managerData" border>
                        <el-table-column label="姓名" prop="real_name" align="center"></el-table-column>
                        <el-table-column label="账号" prop="username" align="center"></el-table-column>
                        <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                        <el-table-column label="开通日期" prop="open_at" align="center">
                            <template v-slot="{row}">
                                <span v-if="!row.open_at">-</span>
                                <span v-else>{{formatDate(new Date(row.open_at * 1000), 'yyyy-MM-dd')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前状态" prop="account_status_str" align="center" width="120">
                            <template v-slot="{row}">
                                <el-tag :type="statusColorMap[row.account_status]">{{row.account_status_str}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="失效日期" prop="close_at" align="center">
                            <template v-slot="{row}">
                                <span v-if="!row.close_at">-</span>
                                <span v-else>{{formatDate(new Date(row.close_at * 1000), 'yyyy-MM-dd')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" prop="operate" :width="250" align="center">
                            <template v-slot="{row}">
                                <template v-if="row.account_status !== manageAccountStatusMap.invalidation.value && !row.is_super_user">
                                        <el-button type="text" @click="lostEffect(row.id)">使失效</el-button>
                                        <el-button type="text" @click="triggerStatus(row)">{{row.account_status === 'disable' ? '启用' : '禁用'}}</el-button>
                                        <el-button type="text" @click="resetPwd(row.id)">重置密码</el-button>
                                        <el-button type="text" @click="edit(row)">编辑</el-button>
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
                        <permission-tree :data="treeDetail"></permission-tree>
                    </el-scrollbar>
                </div>
            </el-scrollbar>
        </div>
        <!--编辑/编辑管理员-->
        <el-dialog custom-class="manager-dialog"
                   :title="`${editFormModel.id !== '' ? '编辑' : '新增'}管理员`"
                   :visible.sync="editDialogVisible"
                   :close-on-click-modal="false"
                   @close="resetEditForm"
                   width="480px">
            <el-form ref="editForm" :model="editFormModel" :rules="editRules" label-width="100px" label-position="left">
                <el-form-item label="管理员姓名" prop="real_name">
                    <el-input placeholder="请输入管理员姓名" v-model="editFormModel.real_name"></el-input>
                </el-form-item>
                <el-form-item label="工作邮箱" prop="email">
                    <el-input placeholder="请输入工作邮箱" v-model="editFormModel.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input placeholder="请输入手机号" v-model="editFormModel.mobile"></el-input>
                </el-form-item>
                <el-form-item label="管理员账号" prop="username">
                    <el-input placeholder="请输入管理员登录账号" v-model="editFormModel.username"></el-input>
                </el-form-item>
                <el-form-item label="管理员角色" prop="position_id">
                    <el-select :loading="selRoleLoading" style="width: 100%" placeholder="请选择管理员角色" v-model="editFormModel.position_id">
                        <el-option v-for="(item, index) in editRoleData" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="editFormModel.id === ''">
                    <el-form-item label="登录密码" prop="password">
                        <el-input auto-complete="new-password" type="password" placeholder="请输入管理员登录密码" v-model="editFormModel.password"></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入密码" prop="confirm_password">
                        <el-input auto-complete="new-password" type="password" placeholder="请再次输入登录密码" v-model="editFormModel.confirm_password"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
        <!--新增角色-->
        <el-dialog custom-class="manager-dialog" title="新增角色" :visible.sync="addRoleDialogVisible" width="480px" @close="$refs.addRoleForm.resetFields()">
            <el-form ref="addRoleForm" :model="addRoleFormModel" :rules="addRoleRules" label-width="100px" label-position="left">
                <el-form-item label="角色名称" prop="name">
                    <el-input placeholder="请输入角色名称" v-model="addRoleFormModel.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="remark">
                    <el-input type="textarea" placeholder="请输入角色描述"  v-model="addRoleFormModel.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addRoleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAddRole" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑权限-->
        <el-dialog custom-class="permission-dialog" title="编辑权限" :visible.sync="treeDialogVisible" width="1000px" top="4vh" :close-on-click-modal="false">
            <el-scrollbar style="width: 100%;height: calc(89vh - 150px);" v-loading="treeLoading">
                <permission-tree v-model="editTreeDetail" :editable="true"></permission-tree>
            </el-scrollbar>
            <span slot="footer">
                    <el-button @click="treeDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitModifyPermission" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑职位-->
        <el-dialog custom-class="manager-dialog" title="编辑角色" :visible.sync="editPosDialogVisible" width="480px" @close="$refs.editPosForm.resetFields()">
            <el-form ref="editPosForm" :model="editPosFormModel" :rules="editPosRules" label-width="100px" label-position="left">
                <el-form-item label="角色名称" prop="name">
                    <el-input placeholder="请输入职位名称" v-model="editPosFormModel.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="remark">
                    <el-input type="textarea" placeholder="请输入角色描述"  v-model="editPosFormModel.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editPosDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEditPos" :loading="submitting" :disabled="submitting">确认</el-button>
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
            updateManageTree,
            getManageTreeDetail,
            getRoleList,
            getEditRoleList,
            createRole,
            delMangePos,
            updateMangePos} from '@/apis/modules/user-manage'
    import {formatDate} from '@/utils/formatTime'
    import {manageAccountStatusMap} from '@/enums/user-manage'
    import PermissionTree from '@/components/permission-tree'
    import SideFilterList from '@/components/side-filter-list'

    export default {
        name: 'manager',
        components: {PermissionTree, SideFilterList},
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                selRoleLoading: false,
                leftLoading: false,
                rightLoading: false,
                treeLoading: false,
                submitting: false, // dialog公用loading
                targetRow: null, // 修改密码目标对象
                treeData: [],
                treeDetail: [],
                editTreeDetail: [],
                curSelRole: null,
                selRole: '',
                roleData: [],
                managerData: [],
                curTabIdx: 'people',
                treeDialogVisible: false,
                editDialogVisible: false,
                editFormModel: {
                    id: '',
                    real_name: '',
                    username: '',
                    position_id: '',
                    mobile: '',
                    email: '',
                    password: '',
                    confirm_password: ''
                },
                editRules: Object.freeze({
                    real_name: baseValiObj,
                    username: baseValiObj,
                    position_id: baseValiObj,
                    mobile: [baseValiObj, {validator: this.moblieValidator}],
                    email: [baseValiObj, {validator: this.emailValidator}],
                    password: [baseValiObj, {validator: this.pwdValidator}],
                    confirm_password:[baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValidator}]
                }),
                addRoleDialogVisible: false,
                addRoleFormModel: {
                    name: '',
                    remark: ''
                },
                addRoleRules: Object.freeze({
                    name: baseValiObj,
                    remark: baseValiObj
                }),
                modPwdFormModel: {
                    password: '',
                    new_password: '',
                    confirm_new_password: ''
                },
                modPwdRules: Object.freeze({
                    password: [baseValiObj, {validator: this.pwdValidator}],
                    new_password: [baseValiObj, {validator: this.pwdValidator}],
                    confirm_new_password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.compareModPwdValitator}]
                }),
                // 新增编辑用角色数据
                editRoleData: [],
                editPosDialogVisible: false,
                editPosFormModel: {
                    name: '',
                    remark: ''
                },
                editPosRules: Object.freeze({
                    name: baseValiObj
                }),
                manageAccountStatusMap: Object.freeze(manageAccountStatusMap),
                statusColorMap: Object.freeze({
                    disabled: 'danger',
                    enabled: 'success',
                    invalidation: 'minor'
                })
            }
        },
        created() {
            this.ajaxRoleList()
            this.ajaxEditRoleList()
        },
        methods: {
            formatDate,
            addManager() {
                this.ajaxEditRoleList()
                this.editDialogVisible = true
            },
            // 初始化tree节点选中和半选状态
            dealTreeData(arr) {
                arr.forEach(item => {
                    const {permission_groups = [], permissions = []} = item
                    // 递归处理权限组
                    permission_groups.length && this.dealTreeData(permission_groups)
                    const allChild = [...permission_groups, ...permissions]
                    const checkedCount = allChild.reduce((prev, next) => prev += next.is_checked ? 1 : 0, 0)
                    item.is_checked = checkedCount > 0 && allChild.length === checkedCount
                    item.indeterminate = permission_groups.some(item => item.indeterminate) || (checkedCount > 0 && checkedCount < allChild.length)
                })
            },
            submitEditPos() {
                this.$refs.editPosForm.validate(flag => {
                    if (flag) {
                        const id = this.curSelRole.id
                        this.submitting = true
                        updateMangePos({...this.editPosFormModel, id}).then(() => {
                            this.ajaxRoleList(id)
                            this.$message.success('修改成功!')
                            this.editPosDialogVisible = false
                        }).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            delPosition() {
                this.confirm('删除后，数据无法恢复，请确认', '删除').then(() => {
                    delMangePos({id: this.curSelRole.id}).then(() => {
                        this.$message.success('操作成功!')
                        this.curSelRole = null
                        this.selRole = ''
                        this.ajaxRoleList()
                    })
                })
            },
            confirm(content, btnTxt, btnColor='#FF4C4C', btnClass='el-button--danger') {
                const h = this.$createElement
                return this.$confirm(
                    h('div', [
                        h('i', {
                            class: {
                                iconfont: true,
                                'iconzhong20_gantanhao': true
                            },
                            style: {
                                color: btnColor,
                                marginRight: '10px'
                            }
                        }),
                        h('span', content)
                    ]),
                    '提示',
                    {
                        confirmButtonText: btnTxt,
                        confirmButtonClass: btnClass,
                        customClass: 'manager-msg-box'
                    }
                )
            },
            handleSetPos() {
                const {editPosFormModel, curSelRole} = this
                editPosFormModel.name = curSelRole.name
                editPosFormModel.remark = curSelRole.remark
                this.editPosDialogVisible = true
            },
            handleSelRole(obj) {
                this.ajaxDetail(obj)
                this.ajaxTreeDetail()
            },
            submitModifyPermission() {
                const permission_ids = []
                this.loopTree(this.editTreeDetail, permission_ids)
                this.submitting = true
                updateManageTree({permission_ids, position_id: this.curSelRole.id}).then(() => {
                    this.$message.success('编辑权限成功!')
                    this.ajaxTreeDetail()
                    this.treeDialogVisible = false
                }).catch(()=> {}).finally(() => {
                    this.submitting = false
                })
            },
            loopTree(dataArr, arr) {
                dataArr.forEach(item => {
                    if (item.permission_groups && item.permission_groups.length) {
                        this.loopTree(item.permission_groups, arr)
                    }
                    if (item.permissions && item.permissions.length) {
                        console.log(item)
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
                const isDisabled = account_status !== 'disable'
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
                    this.editFormModel = {...row, role_id: this.curSelRole.id}
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
                        const isEdit =  data.id !== ''
                        if (isEdit) { // 编辑移除多余参数
                            data.role_id = curSelRole.id
                            delete data.password
                            delete data.confirm_password
                            handle = editManager
                        }
                        handle({...data}).then(res => {
                            this.ajaxRoleList(isEdit ? data.position_id : +res.position_id)
                            this.$message.success(`${isEdit ? '修改' : '新增'}成功!`)
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
                        createRole(this.addRoleFormModel).then(res => {
                            this.$message.success('新增角色成功!')
                            this.addRoleDialogVisible = false
                            this.ajaxRoleList(+res.id)
                        }).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            ajaxEditRoleList() {
                this.selRoleLoading = true
                getEditRoleList().then(res => {
                    this.editRoleData = res
                }).finally(() => {
                    this.selRoleLoading = false
                })
            },
            ajaxRoleList(roleId) {
                this.leftLoading = true
                this.managerData = []
                this.curSelRole = null
                this.treeDetail = []
                this.editTreeDetail = []
                getRoleList().then(res => {
                    this.roleData = res
                    if (this.roleData.length > 0 && roleId) {
                        const role = this.roleData.find(item => item.id === roleId)
                        this.curSelRole = role
                        this.selRole = roleId
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
            editTree() {
                this.ajaxTreeDetail()
                this.treeDialogVisible = true
            },
            ajaxTreeDetail() {
                this.treeLoading = true
                this.rightLoading = true
                getManageTreeDetail({position_id: this.curSelRole.id}).then(res => {
                    this.dealTreeData(res)
                    this.treeDetail = res
                    this.editTreeDetail = JSON.parse(JSON.stringify(res))
                }).catch(() => {}).finally(() => {
                    this.treeLoading = false
                    this.rightLoading = false
                })
            },
            ajaxDetail(obj) {
                this.rightLoading = true
                this.curSelRole = obj
                getManagerList({position_id: obj.id}).then(res => {
                    this.managerData = res.data
                }).finally(() => {
                    this.rightLoading = false
                })
            },
            comparePwdValidator(rule, value, callback) { // eslint-disable-line
                const {password, confirm_password} = this.editFormModel
                if (!password || !confirm_password) {
                    return callback()
                } else if(password !== confirm_password) {
                    return callback(new Error('确认密码必须跟密码一致'))
                }
                return callback()
            },
            compareModPwdValitator(rule, value, callback) { // eslint-disable-line
                const {new_password, confirm_new_password} = this.modPwdFormModel
                if (!new_password || !confirm_new_password) {
                    return callback()
                } else if(new_password !== confirm_new_password) {
                    return callback(new Error('确认新密码必须跟新密码一致'))
                }
                return callback()
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
            },
            resetEditForm() {
                this.editFormModel = this.$options.data().editFormModel
                this.$nextTick(() => {
                    this.$refs.editForm.clearValidate()
                })
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
                        ::v-deep .del-link .el-link--inner{
                            display: flex;
                            align-items: center;
                        }
                        &>div:first-of-type>span{
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