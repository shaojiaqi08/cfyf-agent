<template>
    <div class="company-container">
        <div class="header">
            B端公司
            <el-button type="primary" @click="createCompany"><i class="iconfont iconxiao16_jiahao"></i> 新增B端公司</el-button>
        </div>
        <div class="content">
            <div class="left-scroll-wrap">
                <div class="search-wrap">
                    <el-input prefix-icon="el-icon-search" placeholder="搜索B端公司" v-model.trim="searchInput"></el-input>
                </div>
                <el-scrollbar class="left-scroll-bar" v-loading="leftLoading">
                    <div v-for="(item, index) in filterCompanyData"
                         :key="index"
                         :class="{'list-item':true, active: curSelCompany && curSelCompany.id === item.id}"
                         @click="ajaxPeopleList(item)">
                        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                            <span>{{item.name}}</span>
                        </el-tooltip>
                    </div>
                </el-scrollbar>
            </div>
            <div class="right-scroll-bar" v-loading="rightLoading" v-if="curSelCompany">
                <el-input class="search-input"
                          placeholder="搜索成员姓名或账号"
                          prefix-icon="el-icon-search"
                          v-model="peopleSearchModel.keyword"
                          v-if="curTabIdx==='people'"
                          @input="debounceAjaxPeopleList"></el-input>
                <el-tabs v-model="curTabIdx">
                    <el-tab-pane name="base" label="基本资料" class="base-info-pane">
                        <el-scrollbar>
                            <div class="card">
                                <div class="header">
                                    企业信息
                                    <el-button type="primary" @click="editCompany"><i class="iconfont iconxiao16_bianji"></i>修改信息</el-button>
                                </div>
                                <div class="item">主体类型<span>公司</span></div>
                                <div class="item">渠道<span>公司</span></div>
                                <div class="item">企业名称<span>公司</span></div>
                                <div class="item">企业营业执照<span>公司</span></div>
                                <div class="item">服务费发票类型<span>公司</span></div>
                                <div class="item">发票税点<span>公司</span></div>
                                <div class="item">所属城市<span>公司</span></div>
                                <div class="item">详细地址<span>公司</span></div>
                                <div class="item">固定电话<span>公司</span></div>
                            </div>
                            <div class="card">
                                <div class="header">
                                    财务信息
                                </div>
                                <div class="item">账户类型<span>公司</span></div>
                                <div class="item">户名<span>公司</span></div>
                                <div class="item">开户地址<span>公司</span></div>
                                <div class="item">开户银行<span>公司</span></div>
                                <div class="item">银行卡号<span>公司</span></div>
                            </div>
                            <el-button type="danger" @click="removeSettled">解除入驻</el-button><br>
                            <span class="bottom-txt">解除入驻后，该公司所有账号将无法再登录，所有数据将归档封存，此操作不可恢复</span>
                        </el-scrollbar>
                    </el-tab-pane>
                    <el-tab-pane name="people" label="成员">
                        <div class="content people-content">
                            <div class="left-wrap">
                               <el-scrollbar class="people-left-scroll">
                                   <div v-for="(item, index) in roleData"
                                        :key="index"
                                        :class="{'list-item':true, active: curSelManage && curSelManage.id === item.id}"
                                        @click="ajaxDetail(item)">
                                       <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                                           <span>{{item.name}}</span>
                                       </el-tooltip>
                                   </div>
                               </el-scrollbar>
                            </div>
                            <div class="right-wrap">
                                <div v-if="curSelManage && curSelManage.isSupper" class="admin-filter-bar">
                                    <div>
                                        <filter-shell v-model="peopleSearchModel.position_id">
                                            <el-select v-model="peopleSearchModel.position_id"
                                                       clearable
                                                       placeholder="请选择"
                                                       @change="closePopover">
                                                <el-option v-for="(item, index) in positionOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                            <template v-slot:label>
                                                <span>
                                                    {{ hasValue(peopleSearchModel.position_id) ?
                                                        positionOptions.find(i => i.value === peopleSearchModel.position_id).label :
                                                    '全部职位' }}
                                                </span>
                                            </template>
                                            <template v-slot:close>
                                                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                                                   v-if="hasValue(peopleSearchModel.position_id)"
                                                   @click.stop="peopleSearchModel.position_id = ''"></i>
                                            </template>
                                        </filter-shell>
                                        <filter-shell v-model="peopleSearchModel.team_id">
                                            <el-select v-model="peopleSearchModel.team_id"
                                                       clearable
                                                       placeholder="请选择"
                                                       @change="closePopover">
                                                <el-option v-for="(item, index) in teamOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                            <template v-slot:label>
                                                <span>
                                                    {{ hasValue(peopleSearchModel.team_id) ?
                                                        teamOptions.find(i => i.value === peopleSearchModel.team_id).label :
                                                    '全部所属团队' }}
                                                </span>
                                            </template>
                                            <template v-slot:close>
                                                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                                                   v-if="hasValue(peopleSearchModel.team_id)"
                                                   @click.stop="peopleSearchModel.team_id = ''"></i>
                                            </template>
                                        </filter-shell>
                                        <filter-shell v-model="peopleSearchModel.account_status">
                                            <el-select v-model="peopleSearchModel.account_status"
                                                       clearable
                                                       placeholder="请选择"
                                                       @change="closePopover">
                                                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                            <template v-slot:label>
                                                <span>
                                                    {{ hasValue(peopleSearchModel.account_status) ?
                                                        statusOptions.find(i => i.value === peopleSearchModel.account_status).label :
                                                    '全部状态' }}
                                                </span>
                                            </template>
                                            <template v-slot:close>
                                                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                                                   v-if="hasValue(peopleSearchModel.account_status)"
                                                   @click.stop="peopleSearchModel.account_status = ''"></i>
                                            </template>
                                        </filter-shell>
                                    </div>
                                    <el-button type="primary">导出数据</el-button>
                                </div>
                                <el-table :data="contentData.tableData" border max-height="calc(100vh - 240px)">
                                    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
                                    <el-table-column label="账号" prop="account" align="center"></el-table-column>
                                    <el-table-column label="管理员角色" prop="account" align="center" v-if="curSelManage && curSelManage.isSupper"></el-table-column>
                                    <el-table-column label="系统工号" prop="account" align="center" v-if="curSelManage && !curSelManage.isSupper"></el-table-column>
                                    <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                                    <el-table-column label="开通日期" prop="start_date" align="center"></el-table-column>
                                    <el-table-column label="当前状态" prop="status" align="center" width="120">
                                        <template v-slot="{row}">
                                            <el-tag>{{statusMap[row.status]}}</el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="关闭日期" prop="expire_date" align="center"></el-table-column>
                                    <el-table-column label="操作" fixed="right" prop="operate" v-if="curSelManage && curSelManage.isSupper" :width="150" align="center">
                                        <template v-slot="{row}">
                                            <el-button type="text" @click="modifyPwd(row)">重置密码</el-button>
                                            <el-button type="text" @click="modifyAccount(row)">修改账号</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                    <!--权限需求未明确,先隐藏-->
                    <el-tab-pane name="permission" label="权限" v-if="false">
                        <div class="content" style="height: calc(100vh - 150px)">
                            <el-scrollbar class="tree-wrap">
                                <el-tree :data="contentData.permission"
                                         show-checkbox
                                         @node-click="handleTreeNodeClick"></el-tree>
                            </el-scrollbar>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!--修改账号-->
        <el-dialog custom-class="company-dialog" title="修改账号" :visible.sync="editAccountVisible" width="480px">
            <el-form ref="editAccountForm" :model="editAccountFormModel" :rules="editAccountRules" label-width="100px" label-position="left">
                <el-form-item label="原账号" prop="account_name">
                    <span>{{editAccountFormModel.account_name}}</span>
                </el-form-item>
                <el-form-item label="新账号" prop="new_account_name">
                    <el-input placeholder="请输入新账号" v-model="editAccountFormModel.new_account_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitEdit">确认</el-button>
                </span>
        </el-dialog>
        <!--重置密码-->
        <el-dialog custom-class="company-dialog" title="重置密码" :visible.sync="modPwdDialogVisible" width="480px">
            <el-form ref="modPwdForm" :model="modPwdFormModel" :rules="modPwdRules" label-width="100px" label-position="left">
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
    import {getCompanyDetail, getCompanyList, getPeopleList} from "../../../apis/modules/user-manage";
    import {debounce} from '@/utils'
    import FilterShell, { clearValue, hasValue, closePopover } from './filter-shell'

    export default {
        name: 'manager',
        components: {
            FilterShell
        },
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            const roleData = [
                {id: 1, name: '管理员', isSupper: true},
                {id: 0, name: '销售', isSupper: false},
            ]
            return {
                leftLoading: false,
                rightLoading: false,
                submitLoading: false, // dialog公用loading
                targetRow: null, // 修改密码目标对象
                searchInput: '',
                companyData: [
                    {
                        name: '11',
                        mobile: '',
                        email: '',
                        confirm_password: ''
                    }
                ],
                baseInfoData: null,
                peopleData: [],
                roleData,
                peopleSearchModel: {
                    team_id: '',
                    position_id: '',
                    account_status: '',
                    keyword: ''
                },
                contentData: {},
                curSelManage: roleData[0],
                curSelCompany: null,
                curTabIdx: 'base',
                editAccountVisible: false,
                editAccountFormModel: {
                    account_name: '',
                    new_account_name: ''
                },
                editAccountRules: {
                    new_account_name: baseValiObj
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
                }),
                positionOptions: [
                    {label: '职位1', value: '1'},
                    {label: '职位2', value: '2'},
                    {label: '职位3', value: '3'}
                ],
                teamOptions: [
                    {label: '团队1', value: '1'},
                    {label: '团队2', value: '2'},
                    {label: '团队3', value: '3'},
                ],
                statusOptions: [
                    {label: '在职', value: '1'},
                    {label: '离职', value: '2'},
                ]
            }
        },
        created() {
            this.ajaxCompanyList()
        },
        computed: {
            filterCompanyData() {
                const {searchInput, companyData} = this
                return companyData.filter(item => item.name.includes(searchInput))
            }
        },
        methods: {
            closePopover,
            hasValue,
            clearValue,
            createCompany() {
                window.open(this.$route.fullPath)
            },
            editCompany() {
                const {id} = this.curSelCompany
                window.open(`${this.$route.fullPath}/${id}`)
            },
            handleTreeNodeClick() {
            },
            // 解除入驻
            removeSettled(){ // eslint-disable-line
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
                        h('span', '是否确认解除入驻？解除入驻后不可恢复。')
                    ]),
                    '提示',
                    {
                        confirmButtonText: '解除',
                        confirmButtonClass: 'disable-button',
                        customClass: 'manager-msg-box'
                    }
                ).then(() => {

                }).catch(() => {    })
            },
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
            modifyAccount() {},
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
            ajaxCompanyList() {
                const {searchInput: name, curTabIdx} = this
                this.leftLoading = true
                // 清空先关数据
                this.companyData = []
                this.peopleData = []
                this.baseInfoData = null
                getCompanyList({params: {name}}).then(res => {
                    if (res.data.length > 0) {
                        this.companyData = res.data
                        this.curSelCompany = this.companyData[0]
                        this[`${curTabIdx}TabHandle`]()
                    }
                }).finally(() => {
                    this.leftLoading = false
                })
            },
            // 延迟&&防抖加载数据
            debounceAjaxTableData() {
                const func = debounce.call(this, this.ajaxPeopleList(), 500, true)
                this.debounceAjaxTableData = func
            },
            ajaxPeopleList(obj) { // eslint-disable-line
                const {peopleSearchModel, curSelCompany} = this
                this.peopleData = []
                this.rightLoading = true
                const params = {...peopleSearchModel, company_id: curSelCompany.id}
                getPeopleList({params}).then(res => {
                    this.peopleData = res.data
                }).finally(() => {
                    debugger
                    this.rightLoading = false
                })
            },
            ajaxBaseInfo() {
                this.baseInfoData = null
                getCompanyDetail({params: {id: this.curSelCompany.id}}).then(res => {
                    this.baseInfoData = res
                })
            },
            // 处理基础资料tab
            baseTabHandle() {
                const {baseInfoData} = this
                if (!baseInfoData) {
                    this.ajaxBaseInfo()
                }
            },
            // 处理成员tab
            peopleTabHandle() {
                const {peopleData, roleData} = this
                if (!peopleData.length <= 0) {
                    this.ajaxPeopleList(roleData[0])
                }
            },
            debounceAjaxPeopleList() {
                const func = debounce(this.ajaxPeopleList, 300, true)
                this.debounceAjaxPeopleList = func
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
            editAccountVisible(v) {
                !v && this.$refs.editAccountForm.resetFields()
            },
            modPwdDialogVisible(v) {
                !v && this.$refs.modPwdForm.resetFields()
            },
            curTabIdx(v) {
                this[`${v}TabHandle`]()
            },
            peopleSearchModel() {
                this.debounceAjaxTableData()
            }
        }
    }
</script>

<style scoped lang="scss">
    .company-container {
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
                padding-top: 64px;
                position: relative;
                box-sizing: border-box;
                border-right: 1px solid #e6e6e6;
                &>.search-wrap{
                    position: absolute;
                    top: 0;
                    width: 100%;
                    left: 0;
                    padding: 0 16px;
                    height: 64px;
                    line-height: 64px;
                    box-sizing: border-box;
                }
            }
            ::v-deep .el-scrollbar{
                .el-scrollbar__wrap{
                    overflow-x: hidden;
                }
                .el-scrollbar__bar{
                    z-index: 999;
                }
            }
            // 左侧滚动列表 & 成员tab左侧滚动列表
            ::v-deep .left-scroll-bar, ::v-deep .people-left-scroll{
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
                position: relative;
                .search-input{
                    position: absolute;
                    right: 16px;
                    top: 16px;
                    width: 240px;
                    z-index: 999;
                }
                .el-tabs{
                    padding: 16px 16px 0 16px;
                    position: absolute;
                    top: 0;
                    left:0;
                    right: 0;
                    bottom: 0;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    .el-tab-pane{
                        height: 100%;
                    }
                    .el-tabs__content{
                        flex: 1;
                        .tabpanel{
                            height: 100%;
                        }
                        .el-tab-pane>.el-scrollbar{
                            position:absolute;
                            top: 0;
                            left:0;
                            right: 0;
                            bottom: 0;
                        }
                    }
                    .el-tabs__item{
                        height: 32px;
                        line-height: 32px;
                    }
                    .el-tabs__header{
                        margin-bottom: 16px;
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
                    &.people-content{
                        display: flex;
                        padding-left: 0;
                        height: 100%;
                        padding-bottom: 0;
                        padding-right: 0;
                        .left-wrap{
                            width: 240px;
                            border: 1px solid #e6e6e6;
                            border-bottom: none;
                        }
                        .right-wrap{
                            flex: 1;
                            overflow: hidden;
                            padding-left:16px;
                            .admin-filter-bar{
                                height: 46px;
                                display: flex;
                                align-items: flex-start;
                                justify-content: space-between;
                            }
                        }
                    }
                }
                .tree-wrap{
                    width: 480px;
                    height: calc(100% - 46px);
                    margin:16px auto;
                    border: 1px solid #e6e6e6;
                    border-radius: 4px;
                    padding: 13px 0 13px 6px;
                }
                .el-table .el-button{
                    min-width: 0;
                    height: 23px;
                    line-height: 23px;
                    padding: 0;
                }
            }
            // 基础资料tab pane
            .base-info-pane {
                text-align: center;
                .card{
                    width: 400px;
                    overflow: hidden;
                    border: 1px solid #e6e6e6;
                    border-radius: 4px;
                    margin: 16px auto 0 auto;
                    .header{
                        background-color: #f5f5f5;
                        padding: 0 16px;
                        height: 48px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 20px;
                        border-bottom: 1px solid #e6e6e6;
                    }
                    .item{
                        line-height: 20px;
                        margin-bottom: 24px;
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                        color:#4d4d4d;
                        padding: 0 16px;
                        &>span{
                            color:#1A1A1A;
                            font-weight: bold;
                            flex: 1;
                            display: inline-block;
                            text-align: right;
                            padding-left: 16px;
                        }
                    }
                }
                .el-button--danger{
                    margin: 16px 0 8px 0;
                }
                span.bottom-txt{
                    color:#ccc;
                    font-size: 14px;
                    display: inline-block;
                    padding-bottom: 72px;
                }
            }
        }
    }
</style>
<style lang="scss">
    .manager-msg-box{
        .disable-button {
            background-color: #FF4C4C;
            border: none;
        }
    }
    .company-dialog{
        .el-form-item__label::before{
            display: none;
        }
    }
</style>