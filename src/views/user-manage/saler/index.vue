<template>
    <div class="sale-container">
        <div class="header">
            <el-tabs v-model="curTabIdx">
                <el-tab-pane name="sale-pane" label="销售人员"></el-tab-pane>
                <el-tab-pane name="team-pane" label="团队管理"></el-tab-pane>
                <el-tab-pane name="position-pane" label="职位及权限"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="content">
            <keep-alive>
                <Component :is="curTabIdx"></Component>
            </keep-alive>
        </div>
<!--        &lt;!&ndash;编辑/编辑管理员&ndash;&gt;-->
<!--        <el-dialog custom-class="manager-dialog" :title="`${editFormModel.id !== '' ? '编辑' : '新增'}管理员信息`" :visible.sync="editDialogVisible" width="480px">-->
<!--            <el-form ref="editForm" :model="editFormModel" :rules="editRules" label-width="100px" label-position="left">-->
<!--                <el-form-item label="管理员姓名" prop="real_name">-->
<!--                    <el-input placeholder="请输入管理员姓名" v-model="editFormModel.real_name"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="工作邮箱" prop="email">-->
<!--                    <el-input placeholder="请输入工作邮箱" v-model="editFormModel.email"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="手机号" v-if="editFormModel.id === ''" prop="mobile">-->
<!--                    <el-input placeholder="请输入手机号" v-model="editFormModel.mobile"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="管理员账号" prop="account_name">-->
<!--                    <el-input placeholder="请输入管理员登录账号" v-model="editFormModel.account_name"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="管理员角色" prop="role_id">-->
<!--                    <el-select style="width: 100%" placeholder="请选择管理员角色" v-model="editFormModel.role_id">-->
<!--                        <el-option v-for="(item, index) in roleData" :key="index" :value="item.id" :label="item.name"></el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
<!--                <template v-if="editFormModel.id === ''">-->
<!--                    <el-form-item label="登录密码" prop="password">-->
<!--                        <el-input auto-complete="off" type="password" placeholder="请输入管理员登录密码" v-model="editFormModel.password"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="再次输入密码" prop="confirm_password">-->
<!--                        <el-input type="password" placeholder="请再次输入登录密码" v-model="editFormModel.confirm_password"></el-input>-->
<!--                    </el-form-item>-->
<!--                </template>-->
<!--            </el-form>-->
<!--            <span slot="footer">-->
<!--                <el-button @click="editDialogVisible = false">取消</el-button>-->
<!--                <el-button type="primary" :loading="submitting" :disabled="submitting">确认</el-button>-->
<!--            </span>-->
<!--        </el-dialog>-->
<!--        &lt;!&ndash;新增角色&ndash;&gt;-->
<!--        <el-dialog custom-class="manager-dialog" title="新增角色" :visible.sync="addRoleDialogVisible" width="480px">-->
<!--            <el-form ref="addRoleForm" :model="addRoleFormModel" :rules="addRoleRules" label-width="100px" label-position="left">-->
<!--                <el-form-item label="角色名称" prop="name">-->
<!--                    <el-input placeholder="请输入角色名称" v-model="addRoleFormModel.name"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="角色描述" prop="desc">-->
<!--                    <el-input type="textarea" placeholder="请输入角色描述"  v-model="addRoleFormModel.remark"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <span slot="footer">-->
<!--                <el-button @click="addRoleDialogVisible = false">取消</el-button>-->
<!--                <el-button type="primary" @click="submitAddRole" :loading="submitting" :disabled="submitting">确认</el-button>-->
<!--            </span>-->
<!--        </el-dialog>-->
<!--        &lt;!&ndash;修改密码&ndash;&gt;-->
<!--        <el-dialog custom-class="manager-dialog" title="修改密码" :visible.sync="modPwdDialogVisible" width="480px">-->
<!--            <el-form ref="modPwdForm" :model="modPwdFormModel" :rules="modPwdRules" label-width="100px" label-position="left">-->
<!--                <el-form-item label="旧密码" prop="oldPassword">-->
<!--                    <el-input type="password" placeholder="请输入旧密码" v-model.trim="modPwdFormModel.password"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="新密码" prop="newPassword">-->
<!--                    <el-input type="password" placeholder="请输入密码" v-model.trim="modPwdFormModel.new_password"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="确认新密码" prop="confirmPassword">-->
<!--                    <el-input type="password" placeholder="请再次输入新密码" v-model.trim="modPwdFormModel.confirm_new_password"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <span slot="footer">-->
<!--                    <el-button @click="modPwdDialogVisible = false">取消</el-button>-->
<!--                    <el-button type="primary" @click="submitModifyPwd" :loading="submitting" :disabled="submitting">确认</el-button>-->
<!--            </span>-->
<!--        </el-dialog>-->
<!--        &lt;!&ndash;编辑权限&ndash;&gt;-->
<!--        <el-dialog custom-class="permission-dialog" title="编辑全选" :visible.sync="treeDialogVisible" width="1000px" top="4vh" :close-on-click-modal="false">-->
<!--            <el-scrollbar style="width: 100%;height: calc(89vh - 150px);">-->
<!--                <permission-tree v-model="treeData" :editable="true"></permission-tree>-->
<!--            </el-scrollbar>-->
<!--            <span slot="footer">-->
<!--                    <el-button @click="treeDialogVisible = false">取消</el-button>-->
<!--                    <el-button type="primary" @click="submitModifyPermission" :loading="submitting" :disabled="submitting">确认</el-button>-->
<!--            </span>-->
<!--        </el-dialog>-->
    </div>
</template>

<script>
    import {formatDate} from '@/utils/formatTime'
    import {accountStatusMap} from '@/enums/user-manage'
    import SalePane from './tab-panel/sale'
    import TeamPane from './tab-panel/team'
    import PositionPane from './tab-panel/position'
    export default {
        name: 'sale',
        components: {SalePane, TeamPane, PositionPane},
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
                curTabIdx: 'sale-pane',
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
        },
        methods: {
            formatDate,
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
            align-items: center;
            .el-input {
                width: 360px;
            }
            & ::v-deep .el-tabs .el-tabs__header{
                margin: 0;
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