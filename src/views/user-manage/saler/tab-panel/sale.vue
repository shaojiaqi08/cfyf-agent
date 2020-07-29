<template>
    <div class="sale-people-container">
        <el-button class="add-button" type="primary" @click="handleAddSales"><i class="iconfont iconxiao16_jiahao"></i> 新增销售</el-button>
        <div class="side-filter-wrap flex-column flex-center">
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
                <el-button slot="footer" type="primary" class="mt8 mb16 ml16 mr16" @click="addTeamDialogVisible = true"><i class="iconfont iconxiao16_jiahao mr4"></i>增加团队</el-button>
            </side-filter-list>
        </div>
            <div class="right" v-loading="detailLoading">
            <template v-if="detailData">
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
                                                        positionData.find(i => i.id === searchModel.position_id).name :
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
                    <el-input type="primary" placeholder="搜索成员姓名或账号" prefix-icon="el-icon-search" v-model="searchModel.keyword" clearable></el-input>
                </div>
                <el-scrollbar style="height: calc(100% - 64px)">
                    <div class="team-info" v-if="detailData.parent">
                        <div class="flex-column">
                            <div class="name-wrap">
                                <template v-if="!editting">
                                    {{detailData.name}}
                                    <el-link  @click="modifyTeamName" :underline="false" type="primary" class="iconfont iconda24_bianji"></el-link>
                                </template>
                                <div v-else class="flex">
                                    <el-input size="small" v-model.trim="editName" class="mr8"></el-input>
                                    <el-button size="mini" type="primary" @click="submitTeamName" :loading="submittingEditName" :disabled="submittingEditName">确定</el-button>
                                </div>

                            </div>
                            <span>当前团队挂靠：{{detailData.parent.name}}</span>
                        </div>
                        <div class="flex-center">
                            <el-link :underline="false" type="minor" class="flex-center mr30" @click="dismissTeam"><i class="iconfont iconxiao16_lajitong mr4"></i>解散团队</el-link>
                            <el-button type="primary" @click="handleSetTeam"><i class="iconfont iconxiao16_tihuan mr4"></i>转移团队</el-button>
                        </div>
                    </div>
                    <div class="table-wrap" v-if="detailData.leader">
                        <div class="flex-between table-header">
                            <span>当前团队主管人数：{{detailData.leader.length}} 人</span>
                            <el-button type="primary" @click="handleSetLeader"><i class="iconfont iconxiao16_tihuan mr4"></i>更换主管团队</el-button>
                        </div>
                        <el-table :data="detailData.leader" border width="100%" class="mb16" max-height="768px">
                            <el-table-column label="姓名" prop="real_name" align="center"></el-table-column>
                            <el-table-column label="账号" prop="username" align="center"></el-table-column>
                            <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                            <el-table-column label="职位" prop="sales_position.name" align="center"></el-table-column>
                            <el-table-column label="所属团队" prop="team.name" align="center"></el-table-column>
                            <el-table-column label="入职时间" prop="join_date" align="center">
                                <template v-slot="{row}">
                                    <span>{{formatDate(row.resignation_at * 1000, 'yyyy-MM-dd')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="离职时间" prop="close_at" align="center">
                                <template v-slot="{row}">
                                    <span v-if="row.close_at">{{formatDate(row.close_at * 1000, 'yyyy-MM-dd')}}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" prop="join_date" align="center" width="100px">
                                <template  v-slot="{row}">
                                    <el-tag :type="statusTagType[row.account_status]">{{row.account_status_str}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" prop="operate" width="300px" align="center">
                                <template v-slot="{row}">
                                    <template v-if="row.account_status!==accountStatusMap.dimission.value">
                                        <el-link type="primary" class="mr8" @click="edit(row.id)">编辑</el-link>
                                        <el-link type="primary" class="mr8" @click="resetPwd(row.id)">重置密码</el-link>
                                        <el-link type="primary" class="mr8">模拟登陆</el-link>
                                        <el-link type="primary" class="mr8" @click="triggerStatus(row)">{{row.account_status === accountStatusMap.disable.value ? '启用' : '禁用'}}</el-link>
                                        <el-link type="primary" class="mr8" @click="dimission(row.id)">离职</el-link>
                                    </template>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="table-wrap" v-if="detailData.member">
                        <div class="flex-between table-header">
                            <span>当前团队成员人数：{{detailData.member.length}} 人</span>
                            <el-button type="primary" @click="handleSetMember"><i class="iconfont iconxiao16_tihuan mr4"></i>调整团队成员</el-button>
                        </div>
                        <el-table :data="detailData.member" border width="100%">
                            <el-table-column label="姓名" prop="real_name" align="center"></el-table-column>
                            <el-table-column label="账号" prop="username" align="center"></el-table-column>
                            <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                            <el-table-column label="职位" prop="sales_position.name" align="center"></el-table-column>
                            <el-table-column label="所属团队" prop="team.name" align="center"></el-table-column>
                            <el-table-column label="入职时间" prop="join_date" align="center">
                                <template v-slot="{row}">
                                    <span>{{formatDate(row.resignation_at * 1000, 'yyyy-MM-dd')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="离职时间" prop="close_at" align="center">
                                <template v-slot="{row}">
                                    <span v-if="row.close_at">{{formatDate(row.close_at * 1000, 'yyyy-MM-dd')}}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" prop="join_date" align="center"  width="100px">
                                <template v-slot="{row}">
                                    <el-tag :type="statusTagType[row.account_status]">{{row.account_status_str}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" prop="operate" width="300px" align="center">
                                <template v-slot="{row}">
                                    <template v-if="row.account_status!==accountStatusMap.dimission.value">
                                        <el-link type="primary" class="mr8" @click="edit(row.id)">编辑</el-link>
                                        <el-link type="primary" class="mr8" @click="resetPwd(row.id)">重置密码</el-link>
                                        <el-link type="primary" class="mr8">模拟登陆</el-link>
                                        <el-link type="primary" class="mr8" @click="triggerStatus(row)">{{row.account_status === accountStatusMap.disable.value ? '启用' : '禁用'}}</el-link>
                                        <el-link type="primary" class="mr8" @click="dimission(row.id)">离职</el-link>
                                    </template>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </template>
        </div>
        <!--编辑/新增销售-->
        <el-dialog custom-class="manager-dialog"
                   :title="`${editFormModel.id !== '' ? '编辑' : '新增'}信息`"
                   :visible.sync="editDialogVisible"
                   :close-on-click-modal="false"
                   @close="$refs.editForm.resetFields()"
                   width="480px">
            <el-form v-loading="dialogLoading" ref="editForm" :model="editFormModel" :rules="editRules" label-width="100px" label-position="left">
                <el-form-item label="姓名" prop="real_name">
                    <el-input placeholder="请输入姓名" v-model="editFormModel.real_name"></el-input>
                </el-form-item>
                <el-form-item label="登录账号" prop="username">
                    <el-input placeholder="请输入登录账号" v-model="editFormModel.username"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="identity_card">
                    <el-input placeholder="请输入身份证号" v-model="editFormModel.identity_card"></el-input>
                </el-form-item>
                <el-form-item label="入职日期" prop="resignation_at">
                    <el-date-picker style="width: 100%" type="date" v-model="editFormModel.resignation_at" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input placeholder="请输入手机号" v-model="editFormModel.mobile"></el-input>
                </el-form-item>
                <el-form-item label="职位" prop="position_id">
                    <el-select style="width: 100%" placeholder="请选择职位" v-model="editFormModel.position_id">
                        <el-option v-for="(item, index) in positionData" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="团队" prop="team_id">
                    <el-select style="width: 100%" placeholder="团队" v-model="editFormModel.team_id" :loading="teamSelLoading">
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
                <el-button type="primary" :loading="submitting" :disabled="submitting" @click="submitSalesEdit">确认</el-button>
            </span>
        </el-dialog>
        <!--新增团队-->
        <el-dialog
                   title="新增团队"
                   :visible.sync="addTeamDialogVisible"
                   :close-on-click-modal="false"
                   @close="$refs.addTeamForm.resetFields()"
                   width="480px">
            <el-form ref="addTeamForm" :model="addTeamFormModel" :rules="addTeamRules" label-width="100px" label-position="left">
                <el-form-item label="挂靠团队" prop="parent_id">
                    <el-select v-model="addTeamFormModel.parent_id" style="width: 100%">
                        <el-option v-for="(item, index) in teamData" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="团队主管" prop="leader_ids">
                    <el-select multiple v-model="addTeamFormModel.leader_ids" style="width: 100%">
                        <el-option placeholder="请选择团队主管" v-for="(item, index) in noTeamSalesData" :key="index" :label="item.real_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="团队名称" prop="name">
                    <el-input placeholder="请输入团队名称" v-model="addTeamFormModel.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addTeamDialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitting" :disabled="submitting" @click="submitAddTeam">确认</el-button>
            </span>
        </el-dialog>
        <!--更换团队主管-->
        <el-dialog
                title="更换团队主管"
                :visible.sync="setLeaderDialogVisible"
                custom-class="set-leader-dialog"
                :close-on-click-modal="false"
                width="480px">
            <el-form v-if="detailData && detailData.leader" ref="setLeaderForm" :model="setLeaderFormModel" :rules="setLeaderRules" label-width="100px" label-position="left">
                <div class="info-block mb20">
                    <div class="flex-between mb16">
                        团队名称
                        <span>{{detailData.name}}</span>
                    </div>
                    <div class="flex-between">
                        当前团队主管
                        <span>{{detailData.leader.map(item => item.real_name).join(',')}}</span>
                    </div>
                </div>
                <el-form-item label="新团队主管" prop="leader_ids" style="width: 100%">
                    <el-select multiple v-model="setLeaderFormModel.leader_ids" >
                        <el-option v-for="(item, index) in noTeamSalesData" :key="index" :label="item.real_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="setLeaderDialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitting" :disabled="submitting" @click="submitSetLeader">更换</el-button>
            </span>
        </el-dialog>
        <!--转移团队-->
        <el-dialog
                title="转移团队"
                :visible.sync="transferTeamDialogVisible"
                custom-class="set-leader-dialog"
                :close-on-click-modal="false"
                width="480px">
            <el-form v-if="detailData" ref="setTeamForm" :model="transferTeamFormModel" :rules="transferTeamRules" label-width="100px" label-position="left">
                <div class="info-block mb20" style="height: 60px">
                    <div class="flex-between mb16" >
                        当前团队挂靠
                        <span>某团队</span>
                    </div>
                </div>
                <el-form-item label="团队名称" prop="parent_id">
                    <el-select filterable style="width: 100%" placeholder="团队" v-model="transferTeamFormModel.parent_id">
                        <el-option v-for="(item, index) in teamData" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="setLeaderDialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitting" :disabled="submitting" @click="submitSetTeam">更换</el-button>
            </span>
        </el-dialog>
        <!--调整团队成员-->
        <team-people-dialog :loading="groupSalesLoading"
                            :visible.sync="teamPeopleVisible"
                            :data="groupSalesData"
                            :selected="groupSelected"
                            :submitting="submitting"
                            @submit="groupSalesSubmit"></team-people-dialog>
    </div>
</template>
<script>
    import FilterShell, { clearValue, hasValue, closePopover } from '@/components/filter-shell'
    import {getTeamList,
            getSalesList,
            createSales,
            modifySales,
            dimission,
            resetSalesPassword,
            getSalesDetail,
            getSalesPositionList,
            getSalesListNoTeam,
            updateSalesStatus,
            createTeam,// eslint-disable-line
            setLeader,// eslint-disable-line
            setMember,// eslint-disable-line
            dismissTeam,
            modifyTeamName,
            getGroupSalesList,
            transferTeam} from '@/apis/modules/user-manage' // eslint-disable-line
    import SideFilterList from '@/components/side-filter-list'
    import {debounce} from '@/utils'
    import {accountStatusMap} from '@/enums/user-manage'
    import {formatDate} from '@/utils/formatTime'
    import TeamPeopleDialog from '../component/team-people-dialog'
    export default {
        name: 'sale-pane',
        components: {
            FilterShell,
            SideFilterList,
            TeamPeopleDialog
        },
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                submitting: false,
                submittingEditName: false,
                teamLoading: false,
                teamSelLoading: false,
                dialogLoading: false,
                detailLoading: false,
                name: '',
                detailData: null,
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
                },
                selTeam: '',
                selSales: '',
                teamData: [],
                noTeamSalesData: [],
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
                    mobile: [baseValiObj, {validator: this.moblieValidator}],
                    position_id: baseValiObj,
                    role: baseValiObj,
                    password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}],
                    confirm_password: [baseValiObj, {validator: this.pwdValidator}, {validator: this.comparePwdValitator}]
                },
                editDialogVisible: false,
                addTeamDialogVisible: false,
                addTeamFormModel: {
                    parent_id: '',
                    leader_ids: [],
                    name: ''
                },
                addTeamRules: {
                    leader_ids: baseValiObj,
                    name: baseValiObj,
                },
                setLeaderDialogVisible: false,
                setLeaderFormModel: {
                    leader_ids: []
                },
                setLeaderRules: {
                    leader_ids: baseValiObj
                },
                transferTeamDialogVisible: false,
                transferTeamFormModel: {
                    parent_id: ''
                },
                transferTeamRules: {
                    parent_id: baseValiObj
                },
                positionData: [],
                resignationDateRange: [],
                closeDateRange: [],
                groupSalesData: null,
                groupSelected: [],
                groupSalesLoading: false,
                teamPeopleVisible: false, // 调整团队成员
                editting: false,
                editName: ''
            }
        },
        computed: {
            filterTableData() {
                const {name} = this
                return this.tableData.filter(item => item.real_name.includes(name) || item.username.includes(name))
            },
            accountStatusMap: () => accountStatusMap,
            statusTagType: () => ({
                disable: 'danger',
                enable: 'success',
                incumbency: 'primary',
                dimission: 'minor'
            })
        },
        methods: {
            clearValue,
            hasValue,
            closePopover,
            formatDate,
            create() {},
            // 编辑销售
            edit(id) {
                this.ajaxSalesDetail(id)
                this.editDialogVisible = true
            },
            handleAddSales() {
                this.ajaxPositionData()
                this.editDialogVisible = true

            },
            // 新增/编辑销售
            submitSalesEdit() {
                this.$refs.editForm.validate(flag => {
                    if (flag) {
                        const {editFormModel: data} = this
                        const isEdit = !!data.id
                        const handler = isEdit ? modifySales : createSales
                        this.submitting = true
                        const params = {...data, role: 'sales'}
                        params.resignation_at = ~~(new Date(params.resignation_at.replace(/-/g, '/')) / 1000)
                        handler(params).then(() => {
                            this.ajaxDetail(this.selTeam)
                            this.editDialogVisible = false
                            this.$message.success(`${isEdit ? '修改' : '新增'}成功!`)
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            // 新增团队提交
            submitAddTeam() {
                this.$refs.addTeamForm.validate(flag => {
                    if (flag) {
                        this.submitting = true
                        createTeam(this.addTeamFormModel).then(() => {
                            this.ajaxTeamData()
                            this.ajaxNoTeamSalesData()
                            this.$message.success('新增成功!')
                            this.addTeamDialogVisible = false
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
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
            // 离职
            dimission(id) {
                this.confirm('账号离职后不可恢复，是否确认离职？', '离职').then(() => {
                    dimission({id}).then(() => {
                        this.ajaxDetail(this.selTeam)
                        this.$message.success('操作成功!')
                    })
                })
            },
            handleSelTeam(obj) {
                this.selTeam = obj.id
                // this.searchModel.page = 1
                this.editting = false
                this.detailData = null
                this.ajaxDetail(obj.id)
            },
            handleSetLeader() {
                this.setLeaderDialogVisible = true
            },
            // 解散团队
            dismissTeam() {
                this.confirm('解散团队后，过往业绩将进行归档，且无法恢复原团队，需重新建。是否确认解散？', '解散').then(() => {
                    dismissTeam({id: this.selTeam}).then(() => {
                        this.$message.success('操作成功!')
                        this.detailData = null
                        this.ajaxTeamData()
                        this.ajaxNoTeamSalesData()
                    })
                })
            },
            // 修改团队名
            modifyTeamName() {
                this.editting = true
                this.editName = this.detailData.name
            },
            submitTeamName() {
                const {selTeam: id, editName: name} = this
                if (name === this.detailData.name) {
                    this.editting = false
                } else {
                    this.submittingEditName = true
                    modifyTeamName({id, name}).then(() => {
                        this.$message.success('修改团队名成功!')
                        this.ajaxDetail(id)
                        this.editting = false
                    }).finally(() => {
                        this.submittingEditName = false
                    })
                }

            },
            // 提交更换领导
            submitSetLeader() {
                this.$refs.setLeaderForm.validate(flag => {
                    if (flag) {
                        const team_id = this.selTeam
                        this.submitting = true
                        setLeader({...this.setLeaderFormModel, team_id}).then(() => {
                            this.ajaxDetail(team_id)
                            this.ajaxNoTeamSalesData()
                            this.$message.success('操作成功!')
                            this.setLeaderDialogVisible = false
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            // 调整团队成员
            handleSetMember() {
                this.groupSelected = this.detailData.member.map(item => item.id)
                this.ajaxGroupSaleList()
                this.teamPeopleVisible = true
            },
            handleSetTeam() {
                this.transferTeamDialogVisible = true
            },
            submitSetTeam() {
                this.$refs.setTeamForm.validate(flag => {
                    if (flag) {
                        this.submitting = true
                        const team_id = this.selTeam
                        transferTeam({team_id, ...this.transferTeamFormModel}).then(() => {
                            this.ajaxDetail(team_id)
                            this.transferTeamDialogVisible = false
                            this.$message.success('操作成功!')
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            // 调整成员提交
            groupSalesSubmit(data) {
                this.submitting = true
                const team_id = this.selTeam
                const params = {team_id, sales_ids: []}
                Object.keys(data).forEach(key => {
                   params.sales_ids.push(...data[key].sales.map(item => item.id))
                })
                setMember(params).then(() => {
                    this.$message.success('操作成功!')
                    this.ajaxDetail(team_id)
                    this.teamPeopleVisible = false
                }).catch(() => {}).finally(() => {
                    this.groupSelected = []
                    this.submitting = false
                })
            },
            ajaxTeamData() {
                this.teamLoading = true
                getTeamList().then(res => {
                    this.teamData = res
                }).catch(() => {}).finally(() => {
                    this.teamLoading = false
                })
            },
            ajaxNoTeamSalesData() {
                getSalesListNoTeam().then(res => {
                    this.noTeamSalesData = res
                })
            },
            ajaxDetail(team_id) {
                this.detailLoading = true
                this.detailData = null
                const {searchModel} = this
                getSalesList({...searchModel, team_id}).then(res => {
                    this.detailData = res
                }).catch(() => {}).finally(() => {
                    this.detailLoading = false
                })
            },
            ajaxSalesDetail(id) {
                this.dialogLoading = true
                getSalesDetail({id}).then(res => {
                    res.resignation_at = formatDate(res.resignation_at * 1000, 'yyyy-MM-dd')
                    this.editFormModel = res
                }).catch(() => {}).finally(() => {
                    this.dialogLoading = false
                })
            },
            ajaxPositionData() {
                this.teamSelLoading = true
                getSalesPositionList({role: 'sales', level: 1}).then(res => {
                    this.positionData = res
                }).finally(() => {
                    this.teamSelLoading = false
                })
            },
            ajaxGroupSaleList() {
                this.groupSalesLoading = true
                getGroupSalesList({team_id: this.selTeam}).then(res => {
                    const obj = {}
                    res.forEach(item => {
                        obj[item.format_name] = item
                    })
                    this.groupSalesData = obj
                }).finally(() => {
                    this.groupSalesLoading = false
                })
            },
            triggerStatus(row) {
                const {id, account_status: curStatus} = row // eslint-disable-line
                const willDisable = curStatus === 'incumbency' || curStatus === 'enable'
                const content = willDisable ? '账号禁用期间不可登录系统，是否确认禁用？' : '账号启用后，可正常登录系统，是否确认启用？'
                const btnTxt = willDisable ? '禁用' : '启用'
                const btnColor = willDisable ? '#FF4C4C' : '#FF9000'
                const btnClass = willDisable ? undefined : '#FF9000'
                this.confirm(content, btnTxt, btnColor, btnClass).then(() => {
                    const account_status = willDisable ? 'disable' : 'enable'
                    updateSalesStatus({id, account_status}).then(() => {
                        this.ajaxDetail(this.selTeam)
                        this.$message.success('操作成功!')
                    }).catch(() => {})
                })
            },
            debounceAjaxDetail() {
                const func = debounce(() => {
                    this.ajaxDetail(this.selTeam)
                }, 300)
                func()
                this.debounceAjaxDetail = func
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
            comparePwdValitator(rule, value, callback) { // eslint-disable-line
                const {password, confirmPassword} = this.editFormModel
                if (!password || !confirmPassword) {
                    return callback()
                } else if(password !== confirmPassword) {
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
            }
        },
        watch: {
            searchModel: {
                handler() {
                    this.debounceAjaxDetail()
                },
                deep: true
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
            // 没加入团队的销售
            this.ajaxNoTeamSalesData()
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
        ::v-deep .side-filter-container .list-item:first-of-type{
            border-top: transparent;
        }
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
            border-top: transparent;
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

            .team-info{
                height: 84px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 16px;
                background: #f5f5f5;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                margin-bottom: 16px;
                .name-wrap{
                    font-size: 18px;
                    color:#1a1a1a;
                    font-weight: bold;
                    line-height: 28px;
                    line-height: 28px;
                    display: flex;
                    align-items: center;
                    margin-bottom: 4px;
                    .el-link{
                        font-weight: normal;
                        font-size: 24px;
                        margin-left: 4px;
                    }
                    &+span{
                        color: #999;
                        line-height: 20px;
                    }
                }

            }
            .table-wrap .table-header{
                height: 64px;
                padding: 0 16px 0 20px;
                background: #f5f5f5;
                color: #1a1a1a;
                font-weight: bold;
                border: 1px solid #e6e6e6;
                border-bottom: transparent;
            }
        }
    }
    ::v-deep .set-leader-dialog .info-block{
        height:96px;
        background:rgba(245,245,245,1);
        border-radius:4px;
        border:1px solid rgba(230,230,230,1);
        padding: 20px;
        &>div{
            line-height: 20px;
            color:#4d4d4d;
            font-size: 14px;
            &>span{
                color: #1a1a1a;
                font-weight: bold;
            }
        }
    }

    ::v-deep .side-filter-container .list-item:first-of-type {
        border-top: transparent;
    }
</style>
