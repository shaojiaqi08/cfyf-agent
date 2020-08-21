<template>
    <div class="sale-people-container" ref="container">
        <el-button class="add-button"
                   type="primary"
                   @click="editSales('')"
                   v-if="$checkAuth('/sale/store')"
                   size="small"><i class="iconfont iconxiao16_jiahao"></i> 新增销售</el-button>
        <div class="side-filter-wrap flex-column flex-center">
            <side-filter-list
                v-loading="teamLoading"
                label-key="name"
                value-key="id"
                :showFilter="false"
                v-model="selTeam"
                @change="handleSelTeam"
                style="width: 240px"
                :listData="computedTeamData"
            >
                <el-button slot="footer"
                           type="primary"
                           v-if="$checkAuth('/sale/team/create')"
                           class="mt8 mb16 ml16 mr16"
                           @click="handleAddTeam"
                           size="small">
                    <i class="iconfont iconxiao16_jiahao mr4"></i>
                    新增团队
                </el-button>
            </side-filter-list>
        </div>
        <div class="right" v-loading="detailLoading">
            <template v-if="selTeam">
                <div class="sale-filter-bar">
                    <div>
                        <filter-shell v-model="searchModel.account_status" :width="250" autoFocus autoClose @input="search">
                            <el-select v-model="searchModel.account_status"
                                       clearable
                                       filterable
                                       style="width: 100%"
                                       @change="search"
                                       placeholder="请选择">
                                <el-option v-for="(item, key) in accountStatusMap" :key="key" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <template v-slot:label>
                                <span>
                                    {{hasValue(searchModel.account_status) ?
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
                        <filter-shell v-model="searchModel.position_id" :width="250" autoFocus autoClose @input="search">
                            <el-select v-model="searchModel.position_id"
                                       clearable
                                       filterable
                                       @change="search"
                                       style="width: 100%"
                                       placeholder="请选择">
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
                        <filter-shell v-model="resignationDateRange"
                                      :width="385"
                                      class="date-range-filter"
                                      :textOverflow="false"
                                      :collapse="false"
                                      autoFocus
                                      autoClose
                                      @input="handleRegDateChange">
                            <el-date-picker type="daterange"
                                            v-model="resignationDateRange"
                                            clearable
                                            @change="handleRegDateChange"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <template v-slot:label>
                                <span>{{hasValue(resignationDateRange) ? `${resignationDateRange[0]} ~ ${resignationDateRange[1]}` : '入职时间'}}</span>
                            </template>
                            <template v-slot:close>
                                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                                   v-if="hasValue(resignationDateRange)"
                                   @click.stop="resignationDateRange=[]"></i>
                            </template>
                        </filter-shell>
                        <filter-shell v-model="closeDateRange"
                                      :width="385"
                                      class="date-range-filter"
                                      autoFocus
                                      autoClose
                                      :textOverflow="false"
                                      :collapse="false"
                                      @input="handleCloseDateChange">
                            <el-date-picker type="daterange"
                                            v-model="closeDateRange"
                                            clearable
                                            @change="handleCloseDateChange"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <template v-slot:label>
                                <span>{{hasValue(closeDateRange) ? `${closeDateRange[0]} ~ ${closeDateRange[1]}` : '离职时间'}}</span>
                            </template>
                            <template v-slot:close>
                                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                                   v-if="hasValue(closeDateRange)"
                                   @click.stop="closeDateRange=[]"></i>
                            </template>
                        </filter-shell>
                    </div>
                    <el-input type="primary" placeholder="搜索成员姓名或账号" prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon" v-model="searchModel.keyword" clearable @input="debounceSearch"></el-input>
                </div>
                <el-table :data="allSalesData"
                          border
                          width="100%"
                          v-if="selTeam === -1"
                          :max-height="maxHeight"
                          v-table-infinite-scroll="scroll2Bottom">
                    <el-table-column label="姓名" prop="real_name" width="150px" align="center"></el-table-column>
                    <el-table-column label="账号" prop="username" width="150px" align="center"></el-table-column>
                    <el-table-column label="手机号" prop="mobile" width="150px" align="center"></el-table-column>
                    <el-table-column label="职位" prop="sales_position.name" width="150px" align="center"></el-table-column>
                    <el-table-column label="所属团队" prop="team.name" width="150px" align="center"></el-table-column>
                    <el-table-column label="入职时间" width="150px" prop="join_date" align="center">
                        <template v-slot="{row}">
                            <span>{{formatDate(row.resignation_at * 1000, 'yyyy-MM-dd')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="离职时间" width="150px" prop="close_at" align="center">
                        <template v-slot="{row}">
                            <span v-if="row.close_at">{{formatDate(row.close_at * 1000, 'yyyy-MM-dd')}}</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="join_date" align="center">
                        <template v-slot="{row}">
                            <el-tag :type="statusTagType[row.account_status]">{{row.account_status_str}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" prop="operate" min-width="260px" align="center">
                        <template v-slot="{row, $index}">
                            <template v-if="row.account_status!==accountStatusMap.dimission.value">
                                <el-link v-if="$checkAuth('/sale/update')" type="primary" class="mr8" @click="editSales(row.id)">编辑</el-link>
                                <el-link v-if="$checkAuth('/sale/update_password')" type="primary" class="mr8" @click="modifyPwd(row)">重置密码</el-link>
                                <el-link v-if="$checkAuth('/sale/simulated_login')" type="primary" class="mr8" @click="genSimulatedLink(row.id)">模拟登录</el-link>
                                <el-link v-if="$checkAuth('/sale/update_account_status')" type="primary" class="mr8" @click="triggerStatus(row)">{{row.account_status === accountStatusMap.disable.value ? '启用' : '禁用'}}</el-link>
                                <el-link v-if="$checkAuth('/sale/dimission')" type="primary" class="mr8" @click="dimission(row.id, $index)">离职</el-link>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-scrollbar v-else>
                    <div class="team-info">
                        <div class="flex-column">
                            <div class="name-wrap">
                                <template v-if="!editting">
                                    {{detailData && detailData.name}}
                                    <el-link v-if="$checkAuth('/sale/team/modify_name')" @click="modifyTeamName" :underline="false" type="primary" class="iconfont iconda24_bianji"></el-link>
                                </template>
                                <div v-else class="flex">
                                    <el-input size="small" v-model.trim="editName" class="mr8" @keyup.native.enter="submitTeamName"></el-input>
                                    <el-button size="mini" type="primary" @click="submitTeamName" :loading="submittingEditName" :disabled="submittingEditName">确定</el-button>
                                </div>
                            </div>
                            <span>当前团队挂靠：{{detailData.parent ? detailData.parent.name : '-'}}</span>
                        </div>
                        <div class="flex-center">
                            <el-link :underline="false"
                                     v-if="$checkAuth('/sale/team/disband_team')"
                                     type="minor"
                                     class="flex-center mr30"
                                     @click="dismissTeam"><i class="iconfont iconxiao16_lajitong mr4"></i>解散团队</el-link>
                            <el-button v-if="$checkAuth('/sale/team/change_team_parent')" type="primary" @click="handleSetTeam" size="small"><i class="iconfont iconxiao16_tihuan mr4"></i>转移团队</el-button>
                        </div>
                    </div>
                    <div class="table-wrap">
                        <div class="flex-between table-header">
                            <span>当前团队主管人数：{{detailData.leader ? detailData.leader.length : 0}} 人</span>
                            <el-button v-if="$checkAuth('/sale/team/set_team_leader')" type="primary" @click="handleSetLeader" size="small"><i class="iconfont iconxiao16_tihuan mr4"></i>更换团队主管</el-button>
                        </div>
                        <el-table :data="detailData.leader || []" border width="100%" class="mb16" :max-height="maxHeight / 2">
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
                            <el-table-column label="状态" prop="join_date" align="center" width="150px">
                                <template  v-slot="{row}">
                                    <el-tag :type="statusTagType[row.account_status]">{{row.account_status_str}}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="table-wrap">
                        <div class="flex-between table-header">
                            <span>当前团队成员人数：{{detailData.member ? detailData.member.length : 0}} 人</span>
                            <el-button v-if="$checkAuth('/sale/team/set_member')" type="primary" @click="handleSetMember" size="small"><i class="iconfont iconxiao16_tihuan mr4"></i>调整团队成员</el-button>
                        </div>
                        <el-table :data="detailData.member || []" border width="100%" :max-height="maxHeight / 2">
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
                            <el-table-column label="状态" prop="join_date" align="center"  width="150px">
                                <template v-slot="{row}">
                                    <el-tag :type="statusTagType[row.account_status]">{{row.account_status_str}}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </template>
        </div>
        <!--编辑/新增销售-->
        <edit-sales-dialog :visible.sync="editDialogVisible" :id="editDialogId" :position-data="positionData" @success="ajaxAllSalesList"></edit-sales-dialog>
        <!--新增团队-->
        <add-team-dialog :visible.sync="addTeamDialogVisible" :team-data="teamData" :no-team-sales-data="noTeamSalesData" @success="ajaxTeamData"></add-team-dialog>
        <!--更换团队主管-->
        <set-leader-dialog :visible.sync="setLeaderDialogVisible" :data="detailData" :no-team-sales-data="noTeamSalesData" :team-id="selTeam" @success="ajaxDetail"></set-leader-dialog>
        <!--转移团队-->
        <transfer-team-dialog :visible.sync="transferTeamDialogVisible" :data="detailData" :transfer-team-sel-data="transferTeamSelData" :team-id="selTeam" @success="ajaxDetail"></transfer-team-dialog>
        <!--调整团队成员-->
        <team-people-dialog :loading="groupSalesLoading"
                            :visible.sync="teamPeopleVisible"
                            :data="groupSalesData"
                            :selected="groupSelected"
                            :submitting="submitting"
                            @submit="groupSalesSubmit"></team-people-dialog>
        <!--重置密码-->
        <modify-password-dialog :visible.sync="modifyPwdVisible" :submitting="submitting" @submit="submitModifyPwd"></modify-password-dialog>
    </div>
</template>
<script>
    import FilterShell, { clearValue, hasValue } from '@/components/filters/filter-shell'
    import {getTeamList,
            getSalesList,
            getAllSalesList,
            dimission,
            getSalesDetail,
            getSalesPositionList,
            getSalesListNoTeam,
            updateSalesStatus,
            setMember,
            dismissTeam,
            modifyTeamName,
            getGroupSalesList,
            updateSalesPassword,
            getTransferTeamSelData} from '@/apis/modules/user-manage'
    import {genSimulatedLink} from '@/apis/modules'
    import SideFilterList from '@/components/side-filter-list'
    import {debounce} from '@/utils'
    import {accountStatusMap} from '@/enums/user-manage'
    import {formatDate} from '@/utils/formatTime'
    import TeamPeopleDialog from '../component/team-people-dialog'
    import ModifyPasswordDialog from '../../component/modify-password-dialog'
    import validatorMixin from "../../validatorMixin";
    import EditSalesDialog  from '../component/edit-sales-dialog'
    import AddTeamDialog  from '../component/add-team-dialog'
    import SetLeaderDialog  from '../component/set-leader-dialog'
    import TransferTeamDialog  from '../component/transfer-team-dialog'
    export default {
        name: 'sale-pane',
        mixins: [validatorMixin],
        components: {
            FilterShell,
            SideFilterList,
            TeamPeopleDialog,
            ModifyPasswordDialog,
            EditSalesDialog,
            AddTeamDialog,
            SetLeaderDialog,
            TransferTeamDialog
        },
        data() {
            return {
                modifyPwdVisible: false,
                loadingSales: false, // loading主管列表
                submitting: false,
                submittingEditName: false,
                teamLoading: false,
                teamSelLoading: false,
                dialogLoading: false,
                detailLoading: false,
                targetRow: null,
                name: '',
                detailData: {},
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
                page: 1,
                page_size: 20,
                total: 0,
                selTeam: '',
                selSales: '',
                teamData: [],
                noTeamSalesData: [],
                allSalesData: [],
                tableData: [],
                editDialogId: '',
                editDialogVisible: false,
                addTeamDialogVisible: false,
                setLeaderDialogVisible: false,
                transferTeamDialogVisible: false,
                transferTeamSelData: [],
                positionData: [],
                resignationDateRange: [],
                closeDateRange: [],
                groupSalesData: null,
                groupSelected: [],
                groupSalesLoading: false,
                teamPeopleVisible: false, // 调整团队成员
                editting: false,
                editName: '',
                accountStatusMap: Object.freeze(accountStatusMap),
                statusTagType: Object.freeze({
                    disable: 'danger',
                    enable: 'success',
                    incumbency: 'primary',
                    dimission: 'minor'
                }),
                maxHeight: null
            }
        },
        computed: {
            filterTableData() {
                const {name} = this
                return this.tableData.filter(item => item.real_name.includes(name) || item.username.includes(name))
            },
            computedTeamData() {
                return [{
                    name: '全部销售',
                    id: -1
                }, ...this.teamData]
            }
        },
        methods: {
            clearValue,
            hasValue,
            formatDate,
            // 转移团队团队下拉数据
            ajaxTransferTeamSelData() {
                this.dialogLoading = true
                getTransferTeamSelData({id: this.selTeam}).then(res => {
                    this.transferTeamSelData = res
                }).finally(() => {
                    this.dialogLoading = false
                })
            },
            modifyPwd(row) {
                this.targetRow = row
                this.modifyPwdVisible = true
            },
            submitModifyPwd([new_password, confirm_new_password]) { // eslint-disable-line
                this.submitting = true
                updateSalesPassword({new_password, confirm_new_password, id: this.targetRow.id}).then(() => {
                    this.$message.success('密码重置成功!')
                    this.modifyPwdVisible = false
                }).finally(() => {
                    this.submitting = false
                })
            },
            handleRegDateChange() {
                const {resignationDateRange} = this
                const [start = '', end = ''] = resignationDateRange || []
                this.searchModel.resignation_start_date = start
                this.searchModel.resignation_end_date = end
                this.search()
            },
            handleCloseDateChange() {
                const {closeDateRange} = this
                const [start = '', end = ''] = closeDateRange || []
                this.searchModel.close_start_date = start
                this.searchModel.close_end_date = end
                this.search()
            },
            genSimulatedLink(id) {
                genSimulatedLink({id}).then(res => {
                    window.open(res.url, '_blank')
                })
            },
            scroll2Bottom() {
                const {page, page_size, total} = this
                if (page * page_size < total) {
                    this.page += 1
                    this.ajaxAllSalesList()
                }
            },
            ajaxAllSalesList() {
                const {page, page_size} = this
                this.detailLoading = true
                getAllSalesList({...this.searchModel, page, page_size}).then(res => {
                    this.total = res.total
                    if (page <= 1) {
                        this.allSalesData = res.data
                    } else{
                        this.allSalesData = [...this.allSalesData, ...res.data]
                    }
                }).finally(() => {
                    this.detailLoading = false
                })
            },
            handleAddTeam() {
                this.addTeamDialogVisible = true
                this.ajaxNoTeamSalesData()
            },
            // 新增/编辑销售
            editSales(id) {
                this.ajaxPositionData()
                id && this.ajaxSalesDetail(id)
                this.editDialogId = id
                this.editDialogVisible = true
            },
            // 离职
            dimission(id, index) {
                this.confirm('账号离职后不可恢复，是否确认离职？', '离职').then(() => {
                    dimission({id}).then(res => {
                        this.$set(this.allSalesData, index, res)
                        this.$message.success('操作成功!')
                    })
                })
            },
            handleSelTeam(obj) {
                this.selTeam = obj.id
                this.editting = false
                this.detailData = {}
                if (obj.id === -1) {
                    this.ajaxAllSalesList()
                } else {
                    this.ajaxDetail(obj.id)
                }
                this.ajaxPositionData()
            },
            handleSetLeader() {
                this.setLeaderDialogVisible = true
                this.ajaxNoTeamSalesData(this.selTeam)
            },
            // 解散团队
            dismissTeam() {
                this.confirm('解散团队后，过往业绩将进行归档，且无法恢复原团队，需重新建。是否确认解散？', '解散').then(() => {
                    dismissTeam({id: this.selTeam}).then(() => {
                        this.$message.success('操作成功!')
                        this.detailData = {}
                        this.selTeam = ''
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
                        this.ajaxTeamData()
                        this.ajaxDetail(id)
                        this.editting = false
                    }).finally(() => {
                        this.submittingEditName = false
                    })
                }

            },
            // 调整团队成员
            handleSetMember() {
                this.groupSelected = this.detailData.member.map(item => item.id)
                this.ajaxGroupSaleList()
                this.teamPeopleVisible = true
            },
            handleSetTeam() {
                this.ajaxTransferTeamSelData()
                this.transferTeamDialogVisible = true
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
            ajaxNoTeamSalesData(team_id) {
                this.loadingSales = true
                getSalesListNoTeam({team_id}).then(res => {
                    this.noTeamSalesData = res
                }).finally(() => {
                    this.loadingSales = false
                })
            },
            ajaxDetail(team_id) {
                this.detailLoading = true
                this.detailData = {}
                const {searchModel} = this
                getSalesList({...searchModel, team_id}).then(res => {
                    this.detailData = res
                }).catch(() => {

                }).finally(() => {
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
                getSalesPositionList({role: 'sales'}).then(res => {
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
                const willDisable = curStatus !== 'disable'
                const content = willDisable ? '账号禁用期间不可登录系统，是否确认禁用？' : '账号启用后，可正常登录系统，是否确认启用？'
                    const btnTxt = willDisable ? '禁用' : '启用'
                const btnColor = willDisable ? '#FF4C4C' : '#FF9000'
                const btnClass = willDisable ? undefined : '#FF9000'
                this.confirm(content, btnTxt, btnColor, btnClass).then(() => {
                    const account_status = willDisable ? 'disable' : 'enable'
                    updateSalesStatus({id, account_status}).then(() => {
                        row.account_status = willDisable ? 'disable' : 'enable'
                        row.account_status_str = willDisable ? '禁用' : '在职'
                        this.$message.success('操作成功!')
                    }).catch(() => {})
                })
            },
            search() {
                const {selTeam} = this
                this.page = 1
                if (selTeam === -1) {
                    this.ajaxAllSalesList()
                } else {
                    this.ajaxDetail(selTeam)
                }
            },
            debounceSearch: debounce(function() {
                this.search()
            }, 300),
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
            // 表格最大高度
            setMaxHeight: debounce(function() {
                const container = this.$refs.container
                if (container) {
                    this.maxHeight = this.$refs.container.offsetHeight - 64
                }
            }, 300)
        },
        created() {
            this.ajaxTeamData()
        },
        mounted() {
            this.setMaxHeight()
        },
        activated() {
            window.addEventListener('resize', this.setMaxHeight)
        },
        deactivated() {
            window.removeEventListener('resize', this.setMaxHeight)
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
            right: 36px;
        }
        .right {
            flex: 1;
            overflow: hidden;
            border: 1px solid #f5f5f5;
            border-top: transparent;
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            &>.el-scrollbar{
                flex: 1;
                overflow: hidden;
            }
            .sale-filter-bar{
                display: flex;
                justify-content: space-between;
                height: 64px;
                align-items: center;
                &>.el-input{
                    width: 240px;
                }
            }
            & > ::v-deep .el-table{
                flex: none;
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
    ::v-deep .set-leader-dialog {
        .el-dialog__body{
            overflow: visible;
        }
        .info-block{
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
    }

    ::v-deep .side-filter-container .list-item:first-of-type {
        border-top: transparent;
    }
</style>
