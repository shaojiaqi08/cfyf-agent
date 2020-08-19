<template>
    <div class="manager-container page-container">
        <div class="header">
            内部管理员
            <el-button type="primary"
                       @click="addManager"
                       v-if="$checkAuth('/manager/admin/store')"
                       size="small"><i class="iconfont iconxiao16_jiahao"></i> 新增管理员</el-button>
        </div>
        <div class="content" ref="content">
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
                <el-button slot="footer"
                           class="mt8 mb16 mr16 ml16"
                           type="primary"
                           @click="editRoleDialogVisible = true"
                           v-if="$checkAuth('/manager/admin_position/store')"
                           size="small">
                    <i class="iconfont iconxiao16_jiahao mr4"></i>新增管理员角色
                </el-button>
            </side-filter-list>
            <div class="right-content" v-loading="rightLoading">
                <el-button v-if="$checkAuth('/manager/admin/authority') && curTabIdx==='permission' && !curSelRole.is_super_user"
                           type="primary"
                           size="small"
                           style="position: absolute;top:16px;right:16px;z-index: 10"
                           @click="editTree">编辑权限</el-button>
                <el-tabs v-model="curTabIdx" v-if="curSelRole && !curSelRole.isSupper" @tab-click="handleTabChange" size="small">
                    <el-tab-pane name="people" label="成员" v-if="$checkAuth('/manager')"></el-tab-pane>
                    <el-tab-pane name="permission" label="权限" v-if="$checkAuth('/manager/admin/authority')"></el-tab-pane>
                </el-tabs>
                <div class="content" v-if="curSelRole && curTabIdx==='people'">
                    <div class="desc-wrap flex-between">
                        <div class="flex-center fs16">
                            {{curSelRole.name}}
                            <span :title="curSelRole.remark" class="fs14">{{curSelRole.remark}}</span>
                        </div>
                        <div class="flex-center">
                            <el-tooltip content="角色内无成员才可以删除"
                                        v-if="$checkAuth('/manager/admin_position/delete')"
                                        :disabled="managerData.length <= 0"
                                        placement="top">
                                <el-link :style="{lineHeight: '20px', color: managerData.length > 0 ? '#999': null}"
                                         :disabled="managerData.length > 0 || curSelRole.is_super_user"
                                         :underline="false"
                                         type="minor"
                                         class="mr30 del-link"
                                         @click="delPosition"><i class="iconfont iconxiao16_lajitong mr4"></i>删除</el-link>
                            </el-tooltip>
                            <el-button type="primary"
                                       :disabled="curSelRole.is_super_user"
                                       @click="handleSetPos"
                                       v-if="$checkAuth('/manager/admin_position/update')"
                                       size="small"><i class="iconfont iconxiao16_bianji mr4"></i>编辑</el-button>
                        </div>
                    </div>
                    <el-table :data="managerData" border :max-height="maxHeight" v-table-infinite-scroll="scroll2Bottom">
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
                        <el-table-column label="操作" prop="operate" :width="200" align="center">
                            <template v-slot="{row, $index}">
                                <template v-if="row.account_status !== manageAccountStatusMap.invalidation.value && !row.is_super_user">
                                    <el-link v-if="$checkAuth('/manager/admin/close')" type="primary" class="mr8" @click="lostEffect(row.id, $index)">使失效</el-link>
                                    <el-link v-if="$checkAuth('/manager/admin/update_account_status')" type="primary" class="mr8" @click="triggerStatus(row)">{{row.account_status === 'disable' ? '启用' : '禁用'}}</el-link>
                                    <el-link v-if="$checkAuth('/manager/admin/update_password')" type="primary" class="mr8" @click="modifyPwd(row)">重置密码</el-link>
                                    <el-link v-if="$checkAuth('/manager/admin/update')" type="primary" @click="edit(row)">编辑</el-link>
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
                        <permission-tree v-if="treeDetail.length" :data="treeDetail"></permission-tree>
                        <div class="empty-tips" v-else>无配置权限</div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
        <!--编辑/编辑管理员-->
        <edit-manager-dialog :visible.sync="editDialogVisible"
                             :form-model="editFormModel"
                             :curRole="curSelRole"
                             @close="resetEditForm"
                             @success="ajaxRoleList"></edit-manager-dialog>
        <!--新增/编辑角色-->
        <edit-role-dialog :visible.sync="editRoleDialogVisible"
                         @success="ajaxRoleList"
                         @close="restEditRoleForm"
                         :form-model="editRoleFormModel"></edit-role-dialog>
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
        <!--重置密码-->
        <modify-password-dialog :visible.sync="modifyPwdVisible" :submitting="submitting" @submit="submitModifyPwd"></modify-password-dialog>
    </div>
</template>

<script>
    import {createManager,
            editManager,
            getManagerList,
            removeEffect,
            updateStatus,
            updateManageTree,
            getManageTreeDetail,
            getRoleList,
            delMangePos,
            updatePassword} from '@/apis/modules/user-manage'
    import {formatDate} from '@/utils/formatTime'
    import {manageAccountStatusMap} from '@/enums/user-manage'
    import PermissionTree from '@/components/permission-tree'
    import SideFilterList from '@/components/side-filter-list'
    import ModifyPasswordDialog from '../component/modify-password-dialog'
    import validatorMixin from "../validatorMixin";
    import EditManagerDialog from './component/edit-mananger-dialog'
    import EditRoleDialog from './component/edit-role-dialog'
    import {debounce} from '../../../utils'
    export default {
        name: 'manager',
        mixins: [validatorMixin],
        components: {
            PermissionTree,
            SideFilterList,
            ModifyPasswordDialog,
            EditManagerDialog,
            EditRoleDialog
        },
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                modifyPwdVisible: false,
                selRoleLoading: false,
                leftLoading: false,
                rightLoading: false,
                treeLoading: false,
                submitting: false, // dialog公用loading
                targetRow: null, // 重置密码目标对象
                treeData: [],
                treeDetail: [],
                editTreeDetail: [],
                curSelRole: null,
                selRole: '',
                roleData: [],
                page: 1,
                page_size: 20,
                total: 0,
                managerData: [],
                curTabIdx: '',
                defTabIdx: '',
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
                    username: [baseValiObj, {validator: this.usernameValidator}],
                    position_id: baseValiObj,
                    mobile: [baseValiObj, {validator: this.moblieValidator}],
                    email: [baseValiObj, {validator: this.emailValidator}],
                    password: [baseValiObj, {validator: this.pwdValidator}],
                    confirm_password:[baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValidator}]
                }),
                editRoleDialogVisible: false,
                editRoleFormModel: {
                    id: '',
                    name: '',
                    remark: ''
                },
                manageAccountStatusMap: Object.freeze(manageAccountStatusMap),
                statusColorMap: Object.freeze({
                    disable: 'danger',
                    enable: 'success',
                    invalidation: 'minor'
                }),
                maxHeight: null
            }
        },
        methods: {
            formatDate,
            scroll2Bottom() {
                const {page, total, page_size} = this
                if (page * page_size < total) {
                    this.page += 1
                    this.managerData = []
                    this.ajaxDetail(this.curSelRole)
                }
            },
            handleTabChange() {
                this[`${this.curTabIdx}TabHandle`]()
            },
            peopleTabHandle() {
                this.managerData.length <= 0 && this.ajaxDetail(this.curSelRole)
            },
            permissionTabHandle() {
                this.treeDetail.length <= 0 && this.ajaxTreeDetail()
            },
            modifyPwd(row) {
                this.targetRow = row
                this.modifyPwdVisible = true
            },
            submitModifyPwd([new_password, confirm_new_password]) { // eslint-disable-line
                this.submitting = true
                updatePassword({
                    new_password,
                    confirm_new_password,
                    id: this.targetRow.id
                }).then(()=>{
                    this.$message.success('密码重置成功!')
                    this.modifyPwdVisible = false
                }).finally(() => {
                    this.submitting = false
                })
            },
            addManager() {
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
                const {editRoleFormModel, curSelRole} = this
                debugger
                editRoleFormModel.id = curSelRole.id
                editRoleFormModel.name = curSelRole.name
                editRoleFormModel.remark = curSelRole.remark
                this.editRoleDialogVisible = true
            },
            handleSelRole(obj) {
                this.page = 1
                this.curTabIdx = this.defTabIdx
                this.treeDetail = []
                this.managerData = []
                this.ajaxDetail(obj)
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
            lostEffect(id, index) {
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
                    removeEffect({id}).then(row => {
                        this.$message.success('操作成功!')
                        this.$set(this.managerData, index, row)
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
                    const account_status = isDisabled ? 'disable' : 'enable'
                    const account_status_str = isDisabled ? '禁用' : '启用'
                    updateStatus({id, account_status}).then(() => {
                        this.$message.success(`${account_status_str}成功!`)
                        row.account_status = account_status
                        row.account_status_str = account_status_str
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
                const {page, page_size, managerData} = this
                getManagerList({position_id: obj.id, page, page_size}).then(res => {
                    const d = res.data
                    this.managerData = page <= 1 ? d : [...managerData, ...d]
                    this.total = res.total
                }).finally(() => {
                    this.rightLoading = false
                })
            },
            resetEditForm() {
                this.editFormModel = this.$options.data().editFormModel
            },
            restEditRoleForm() {
                this.editRoleFormModel = this.$options.data().editRoleFormModel
            },
            setMaxHeight() {
                const func = debounce(() => {
                    this.maxHeight = this.$refs.content.offsetHeight - 145
                }, 300)
                func()
                this.setMaxHeight = func
            }
        },
        mounted() {
            this.setMaxHeight()
        },
        created() {
            // 初始化tab权限
            if (this.$checkAuth('/manager')) {
                this.curTabIdx = 'people'
            } else if (this.$checkAuth('/manager/admin/authority')) {
                this.curTabIdx = 'permission'
            }
            this.defTabIdx = this.curTabIdx
            this.ajaxRoleList()
            window.addEventListener('resize', this.setMaxHeight)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.setMaxHeight)
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
            overflow: hidden;
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
            .right-content{
                flex: 1;
                height: 100%;
                position: relative;
                overflow: hidden;
                ::v-deep .el-tabs{
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
                        margin: 0 0 16px 0;
                        background:rgba(245,245,245,1);
                        border-radius:4px;
                        border:1px solid rgba(230,230,230,1);
                        color: #1A1A1A;
                        font-weight: bold;
                        ::v-deep .del-link .el-link--inner{
                            display: flex;
                            align-items: center;
                        }
                        &>div:first-of-type{
                            flex: 1;
                            overflow: hidden;
                            padding-right: 20px;
                            & > span{
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
        ::v-deep .manager-dialog .el-dialog__body{
            overflow: visible;
        }
    }
    .empty-tips {
        margin: 30vh auto;
        text-align: center;
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