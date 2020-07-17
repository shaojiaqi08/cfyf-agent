<template>
    <div class="sale-people-container">
        <el-button class="add-button" type="primary" @click="editDialogVisible = true"><i class="iconfont iconxiao16_jiahao"></i> 新增销售</el-button>
        <side-filter-list
                v-loading="teamLoading"
                label-key="name"
                value-key="id"
                :showFilter="false"
                v-model="selTeam"
                @change="handleSelTeam"
                style="width: 240px"
                :listData="teamData"
        >
        </side-filter-list>
        <div class="right" v-loading="detailLoading">
            <template v-if="tableData.length">
                <div class="sale-filter-bar">
                    <div>
                        <filter-shell v-model="searchModel.account_status" :width="250">
                            <el-select v-model="searchModel.account_status"
                                       clearable
                                       placeholder="请选择"
                                       @change="closePopover">
                                <el-option v-for="(item, key) in accountStatusMap" :key="key" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <template v-slot:label>
                                                <span>
                                                    {{ hasValue(searchModel.account_status) ?
                                                        accountStatusMap[searchModel.account_status].label :
                                                    '全部状态' }}
                                                </span>
                            </template>
                            <template v-slot:close>
                                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                                   v-if="hasValue(searchModel.account_status)"
                                   @click.stop="searchModel.account_status = ''"></i>
                            </template>
                        </filter-shell>
                        <filter-shell v-model="searchModel.position_id" :width="250">
                            <el-select v-model="searchModel.position_id"
                                       clearable
                                       placeholder="请选择"
                                       @change="closePopover">
                                <el-option v-for="(item, index) in positionData" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            <template v-slot:label>
                                                <span>
                                                    {{ hasValue(searchModel.position_id) ?
                                                        positionData.find(i => i.value === searchModel.position_id).label :
                                                    '全部职位' }}
                                                </span>
                            </template>
                            <template v-slot:close>
                                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                                   v-if="hasValue(searchModel.position_id)"
                                   @click.stop="searchModel.position_id = ''"></i>
                            </template>
                        </filter-shell>
                        <filter-shell v-model="resignationDateRange" :width="385" class="date-range-filter">
                            <el-date-picker type="daterange"
                                            v-model="resignationDateRange"
                                            clearable
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <template v-slot:label>
                                <span>{{hasValue(resignationDateRange) ? `${resignationDateRange[0]} 至 ${resignationDateRange[1]}` : '入职时间'}}</span>
                            </template>
                            <template v-slot:close>
                                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                                   v-if="hasValue(resignationDateRange)"
                                   @click.stop="resignationDateRange=[]"></i>
                            </template>
                        </filter-shell>
                        <filter-shell v-model="closeDateRange" :width="385" class="date-range-filter">
                            <el-date-picker type="daterange"
                                            v-model="closeDateRange"
                                            clearable
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <template v-slot:label>
                                <span>{{hasValue(closeDateRange) ? `${closeDateRange[0]} 至 ${closeDateRange[1]}` : '离职时间'}}</span>
                            </template>
                            <template v-slot:close>
                                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                                   v-if="hasValue(closeDateRange)"
                                   @click.stop="closeDateRange=[]"></i>
                            </template>
                        </filter-shell>
                    </div>
                    <el-input type="primary" placeholder="搜索成员姓名或账号" prefix-icon="el-icon-search" v-model="searchModel.keyword"></el-input>
                </div>
                <el-table :data="filterTableData" border width="100%">
                    <el-table-column label="姓名" prop="real_name" align="center"></el-table-column>
                    <el-table-column label="账号" prop="username" align="center"></el-table-column>
                    <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                    <el-table-column label="职位" prop="position" align="center"></el-table-column>
                    <el-table-column label="所属团队" prop="team" align="center"></el-table-column>
                    <el-table-column label="入职时间" prop="join_date" align="center">
                        <template v-slot="{row}">
                            <span>{{formatDate(row.resignation_at * 1000, 'yyyy-MM-dd')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="join_date" align="center">
                        <template v-slot="{row}">
                            <el-tag >{{row.account_status}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" prop="operate" width="300px" align="center">
                        <template v-slot="{row}">
                            <template v-if="row.account_status!==accountStatusMap.dimission.value">
                                <el-link type="primary" class="mr8" @click="edit(row.id)">编辑</el-link>
                                <el-link type="primary" class="mr8" @click="resetPwd(row.id)">重置密码</el-link>
                                <el-link type="primary" class="mr8">模拟登陆</el-link>
                                <el-link type="primary" class="mr8" @click="triggerStatus(row)">{{row.account_status === accountStatusMap.disabled.value ? '启用' : '禁用'}}</el-link>
                                <el-link type="primary" class="mr8" @click="dimission(row.id)">离职</el-link>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <!--编辑/新增销售-->
        <el-dialog custom-class="manager-dialog"
                   :title="`${editFormModel.id !== '' ? '编辑' : '新增'}信息`"
                   :visible.sync="editDialogVisible"
                   width="480px"
                   v-loading="dialogLoading">
            <el-form ref="editForm" :model="editFormModel" :rules="editRules" label-width="100px" label-position="left">
                <el-form-item label="姓名" prop="real_name">
                    <el-input placeholder="请输入姓名" v-model="editFormModel.real_name"></el-input>
                </el-form-item>
                <el-form-item label="登录账号" prop="username">
                    <el-input placeholder="请输入登录账号" v-model="editFormModel.username"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="email">
                    <el-input placeholder="请输入身份证号" v-model="editFormModel.email"></el-input>
                </el-form-item>
                <el-form-item label="入职日期" prop="resignation_at">
                    <el-date-picker style="width: 100%" type="date" v-model="editFormModel.resignation_at" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input placeholder="请输入手机号" v-model="editFormModel.mobile"></el-input>
                </el-form-item>
                <el-form-item label="职位" prop="position_id">
                    <el-select filterable style="width: 100%" placeholder="请选择职位" v-model="editFormModel.position_id">
                        <el-option v-for="(item, index) in positionData" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="团队" prop="team_id">
                    <el-select filterable style="width: 100%" placeholder="团队" v-model="editFormModel.team_id">
                        <el-option v-for="(item, index) in teamData" :key="index" :value="item.id" :label="item.name"></el-option>
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
                <el-button type="primary" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import FilterShell, { clearValue, hasValue, closePopover } from '../component/filter-shell'
    import {getTeamList, getSalesList, createSales, modifySales, dimission, resetSalesPassword, getSalesDetail, getSalesPositionList} from '@/apis/modules/user-manage' // eslint-disable-line
    import SideFilterList from '@/components/side-filter-list'
    import {debounce} from '@/utils'
    import {accountStatusMap} from '@/enums/user-manage'
    import {formatDate} from '@/utils/formatTime'
    export default {
        name: 'sale-pane',
        components: {
            FilterShell,
            SideFilterList
        },
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                accountStatusMap,
                submitting: false,
                teamLoading: false,
                dialogLoading: false,
                detailLoading: false,
                name: '',
                searchModel: {
                    account_status: '',
                    company_id: '',
                    position_id: '',
                    team_id: '',
                    resignation_start_date: '',
                    resignation_end_date: '',
                    close_start_date: '',
                    close_end_date: '',
                    keyword: ''
                    // page: 1
                },
                selTeam: '',
                selSales: '',
                teamData: [],
                tableData: [],
                editFormModel: {
                    id: '',
                    real_name: '',
                    username: '',
                    identity_card: '',
                    resignation_at: '',
                    mobile: '',
                    position_id: '',
                    team_id: '',
                    password: '',
                    confirm_password: '',
                    role: 'sales'
                },
                editRules: {
                    real_name: baseValiObj,
                    username: baseValiObj,
                    identity_card: baseValiObj,
                    resignation_at: baseValiObj,
                    mobile: baseValiObj,
                    position_id: baseValiObj,
                    team_id: baseValiObj,
                    role: baseValiObj,
                    password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}],
                    confirm_password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}]
                },
                editDialogVisible: false,
                positionData: [],
                resignationDateRange: [],
                closeDateRange: []
            }
        },
        computed: {
            filterTableData() {
                const {name} = this
                return this.tableData.filter(item => item.real_name.includes(name) || item.username.includes(name))
            }
        },
        methods: {
            clearValue,
            hasValue,
            closePopover,
            formatDate,
            create() {},
            edit(id) {
                this.ajaxSalesDetail(id)
                this.editDialogVisible = true
            },
            submitEdit() {
                const {salesFormModel: data} = this
                const isEdit = !!data.id
                const handler = isEdit ? modifySales : createSales
                this.submitting = true
                handler(data).then(res => {
                    if (isEdit) {
                        // 更新行
                        this.$set(this.tableData, this.tableData.findIndex(item => item.id === res.id), res)
                    } else {
                        // 点击新增到的团队
                        this.handleSelTeam(this.teamData.find(item => item.id === data.team_id))
                    }
                    this.editDialogVisible = false
                    this.$message.success(`${isEdit ? '修改' : '新增'}成功!`)
                }).catch(() => {}).finally(() => {
                    this.submitting = false
                })
            },
            // 重置密码
            resetPwd(id) {
                this.confirm('是否确认重置密码？', '重置').then(() => {
                    resetSalesPassword({id}).then((res) => {
                        this.$confirm(`重置密码成功,新密码【${res.password}】, 请妥善保管`, '提示')
                    })
                }).catch(() => {
                })
            },
            dimission(id) {
                this.confirm('账号离职后不可恢复，是否确认离职？', '离职').then(() => {
                    dimission({id}).then(() => {
                        this.$message.success('操作成功!')
                    })
                })
            },
            handleSelTeam(obj) {
                this.selTeam = obj.id
                // this.searchModel.page = 1
                this.ajaxDetail(obj.id)
            },
            ajaxTeamData() {
                this.teamLoading = true
                getTeamList().then(res => {
                    this.teamData = res
                }).catch(() => {}).finally(() => {
                    this.teamLoading = false
                })
            },
            ajaxDetail(team_id) {
                this.detailLoading = true
                const {searchModel} = this
                getSalesList({...searchModel, team_id}).then(res => {
                    if (searchModel.page === 1) {
                        this.tableData = res.data
                    } else {
                        this.tableData = [...this.tableData, ...res.data]
                    }
                }).catch(() => {}).finally(() => {
                    this.detailLoading = false
                })
            },
            ajaxSalesDetail(id) {
                this.dialogLoading = true
                getSalesDetail({id}).then(res => {
                    this.editFormModel = res
                }).catch(() => {}).finally(() => {
                    this.dialogLoading = false
                })
            },
            ajaxPositionData() {
                getSalesPositionList().then(res => {
                    this.positionData = res
                })
            },
            triggerStatus(row) {
                const {id, account_status: curStatus} = row // eslint-disable-line
                const willDisable = curStatus === 'incumbency'
                const content = willDisable ? '账号禁用期间不可登录系统，是否确认禁用？' : '账号启用后，可正常登录系统，是否确认启用？'
                const btnTxt = willDisable ? '禁用' : '启用'
                const btnColor = willDisable ? undefined : '#FF9000'
                this.confirm(content, btnTxt, btnColor).then(() => {})
            },
            debounceAjaxDetail() {
                const func = debounce(() => {
                    this.ajaxDetail()
                }, 400)
                this.debounceAjaxDetail = func
            },
            confirm(content, btnTxt, btnColor='#FF4C4C') {
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
                        confirmButtonClass: 'disable-button',
                        customClass: 'manager-msg-box'
                    }
                )
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
            searchModel: {
                handler() {
                    this.debounceAjaxDetail()
                },
                deep: true
            },
            editDialogVisible(v) {
                !v && this.$refs.editForm.resetFields()
            },
            resignationDateRange(v) {
                const [start = '', end = ''] = v
                this.searchModel.resignation_start_date = start
                this.searchModel.resignation_end_date = end
            },
            closeDateRange(v) {
                const [start = '', end = ''] = v
                this.searchModel.close_start_date = start
                this.searchModel.close_end_date = end
            }
        },
        created() {
            this.ajaxTeamData()
            this.ajaxPositionData()
        }
    }
</script>

<style scoped lang="scss">
    .sale-people-container{
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: row;
        align-items: stretch;
        .add-button{
            position: fixed;
            z-index: 3;
            top: 72.5px;
            right: 32px;
        }
        .right {
            flex: 1;
            overflow: hidden;
            border: 1px solid #f5f5f5;
            padding: 0 16px;
            .sale-filter-bar{
                display: flex;
                justify-content: space-between;
                height: 64px;
                align-items: center;
                &>.el-input{
                    width: 240px;
                }
            }
        }
    }
</style>