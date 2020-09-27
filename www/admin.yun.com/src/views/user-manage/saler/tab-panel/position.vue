<template>
    <div class="position-pane-container" ref="container">
        <el-button v-if="$checkAuth('/sale/position_and_authority/sales_position/store')"
                   class="add-button"
                   type="primary"
                   @click="posDialogVisible=true"
                   size="small"><i class="iconfont iconxiao16_jiahao"></i> 新增职位</el-button>
        <el-scrollbar class="pos-filter-list" v-loading="positionLoading">
            <div v-for="(item, index) in lvData" :key="index" class="list-item-wrap">
                <div class="group-item">
                    <el-divider v-if="index !== 0" />
                        {{item.label}}
                    </div>
                <div
                    v-for="(item, index) in item.children"
                    :key="index"
                    @click="handleSelPosition(item)"
                    :class="{'list-item': true, active: selPosVal === item.value}"
                    >
                    <list-item class="list-label" :tips-content="item.label">
                        <div>{{item.label}}</div>
                    </list-item>
                    <el-tooltip effect="dark"
                                :content="`当前在职 ${item.sales_count || 0} 人` "
                                placement="top">
                        <div class="list-people-count">{{ item.sales_count || 0 }}人</div>
                    </el-tooltip>
                </div>
            </div>
            <div class="tc mt30" v-if="!lvData.length">暂无数据</div>
        </el-scrollbar>
        <div class="right" v-loading="detailLoading">
            <el-tabs v-model="curTabIdx" v-if="selPosVal" @tab-click="handleTabChange" size="small">
                <el-tab-pane name="people" label="成员" v-if="$checkAuth('/manager/members')"></el-tab-pane>
                <el-tab-pane name="permission" label="权限" v-if="$checkAuth('/manager/admin/authority')"></el-tab-pane>
            </el-tabs>
            <div class="content" v-if="selPosVal && curTabIdx === 'people'">
                <div class="desc-wrap flex-between">
                    <div class="flex-center fs16">
                        {{selPosName}}
                    </div>
                    <div class="flex-center">
                        <el-tooltip content="职位内无成员才可以删除"
                                    v-if="$checkAuth('/manager/admin_position/delete')"
                                    placement="top">
                            <el-link :style="{lineHeight: '20px', color: tableList.length > 0 ? '#999': null}"
                                        :disabled="tableList.length > 0"
                                        :underline="false"
                                        type="minor"
                                        class="mr30 del-link"
                                        @click="delPosition"><i class="iconfont iconxiao16_lajitong mr4"></i>删除</el-link>
                        </el-tooltip>
                        <el-button type="primary"
                                    @click="handleSetPos"
                                    v-if="$checkAuth('/manager/admin_position/update')"
                                    size="small"><i class="iconfont iconxiao16_bianji mr4"></i>编辑</el-button>
                    </div>
                </div>
                <el-table :data="tableList" v-loading="tableLoading" border :max-height="maxHeight - 70">
                    <el-table-column label="姓名" prop="real_name" width="150px" align="center"></el-table-column>
                    <el-table-column label="账号" prop="username" width="150px" align="center"></el-table-column>
                    <el-table-column label="手机号" prop="mobile" width="150px" align="center"></el-table-column>
                    <el-table-column label="职位" prop="sales_position.name" width="150px" align="center"></el-table-column>
                    <el-table-column label="所属团队" prop="team.name" width="150px" align="center"></el-table-column>
                    <el-table-column label="新增时间" width="150px" prop="join_date" align="center">
                        <template v-slot="{row}">
                            <span>{{formatDate(row.resignation_at * 1000, 'yyyy-MM-dd')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="注销时间" width="150px" prop="close_at" align="center">
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
                            <template v-if="row.account_status!==accountStatusMap.cancel.value">
                                <el-link v-if="$checkAuth('/sale/update')" type="primary" class="mr8" @click="editSales(row.id)">编辑</el-link>
                                <el-link v-if="$checkAuth('/sale/update_password')" type="primary" class="mr8" @click="modifyPwd(row)">重置密码</el-link>
                                <el-link v-if="$checkAuth('/sale/simulated_login')" type="primary" class="mr8" @click="genSimulatedLink(row.id)">模拟登录</el-link>
                                <el-link v-if="$checkAuth('/sale/update_account_status')" type="primary" class="mr8" @click="triggerStatus(row)">{{row.account_status === accountStatusMap.disable.value ? '启用' : '禁用'}}</el-link>
                                <el-link v-if="$checkAuth('/sale/dimission')" type="primary" class="mr8" @click="dimission(row.id, $index)">注销</el-link>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="content" v-if="selPosVal && curTabIdx === 'permission'">
                <el-scrollbar :style="{ height: `${maxHeight - 50}px` }">
                    <permission-tree v-if="detailData.length" v-model="detailData"></permission-tree>
                    <div class="empty-tips" v-else>无配置权限</div>
                </el-scrollbar>
                <div class="flex-center mt10">
                    <el-button v-if="$checkAuth('/sale/position_and_authority/update')" type="primary" @click="editTree" size="small">编辑权限</el-button>
                </div>
            </div>
        </div>
        <!--新增职位-->
        <el-dialog title="新增职位" :visible.sync="posDialogVisible" width="480px" @close="$refs.posForm.resetFields()">
            <el-form ref="posForm" label-width="100px" :model="posFormModel" :rules="posRules">
                <el-form-item label="职位等级" prop="level">
                    <el-select v-model="posFormModel.level" placeholder="请选择职位等级" style="width: 100%">
                        <el-option v-for="item in lvMap" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位名称" prop="name">
                    <el-input v-model="posFormModel.name" placeholder="请输入职位名称"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="posDialogVisible = false">取消</el-button>
                <el-button @click="submitCreatePos" type="primary" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑权限-->
        <el-dialog custom-class="permission-dialog"
                   title="编辑权限"
                   :visible.sync="treeDialogVisible"
                   width="1000px"
                   top="0"
                   @close="resetScrollbar"
                   :close-on-click-modal="false">
            <el-scrollbar ref="permissionScrollWrap" wrap-class="permission-scroll-wrap" style="width: 100%;height: calc(89vh - 150px);">
                <permission-tree v-model="treeDetail" :editable="true"></permission-tree>
            </el-scrollbar>
            <span slot="footer">
                    <el-button @click="treeDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitModifyPermission" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog custom-class="manager-dialog" title="编辑" :visible="editRoleDialogVisible" width="480px" @close="closeDialog">
            <el-form ref="form" :model="formModel" label-width="100px" label-position="left">
                <el-form-item label="职位名称" prop="name">
                    <el-input placeholder="请输入职位名称" v-model="formModel.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="submitPosition" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
        <!--重置密码-->
        <modify-password-dialog :visible.sync="modifyPwdVisible" :submitting="submitting" @submit="submitModifyPwd"></modify-password-dialog>
        <!--编辑/新增销售-->
        <edit-sales-dialog :visible.sync="editDialogVisible" :id="editDialogId" :position-data="positionData" @success="ajaxAllSalesList"></edit-sales-dialog>
    </div>
</template>
<script>
    import { getPositionList,
             getPosLvList,
             getPosDetail,
             createPosLv,
             updatePosTree,
             getAllSalesList,
             delMangePos,
             getSalesDetail,
             updateSalesPassword,
             updateSalesStatus,
             dimission,
             updatePosLv } from '@/apis/modules/user-manage'
    import ListItem from '@/components/side-filter-list/side-filter-list-item'
    import {genSimulatedLink} from '@/apis/modules'
    // import SideFilterList from '@/components/side-filter-list'
    import {accountStatusMap} from '@/enums/user-manage'
    import PermissionTree from '@/components/permission-tree'
    import {formatDate} from '@/utils/formatTime'
    import EditSalesDialog  from '../component/edit-sales-dialog'
    import ModifyPasswordDialog from '../../component/modify-password-dialog'
    import {debounce} from '@/utils'
    export default {
        name: 'position-pane',
        components: {
            // SideFilterList,
            PermissionTree,
            EditSalesDialog,
            ModifyPasswordDialog,
            ListItem
        },
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                formatDate,
                treeDialogVisible: false,
                submitting: false,
                positionLoading: false,
                tableLoading: false,
                lvLoading: false,
                detailLoading: false,
                posDialogVisible: false,
                editRoleDialogVisible: false,
                editDialogVisible: false,
                modifyPwdVisible: false,
                targetRow: null,
                name: '',
                selLv: '',
                selPos: '',
                selPosVal: '',
                selPosName: '',
                editDialogId: '',
                detailData: [],
                treeDetail: [],
                positionData: [],
                lvData: [],
                tableList: [],
                curTabIdx: 'people',
                statusTagType: Object.freeze({
                    disable: 'danger',
                    enable: '',
                    dimission: 'minor',
                    cancel: 'minor'
                }),
                lvMap: Object.freeze([
                    {label: '第一级', value: 1},
                    {label: '第二级', value: 2},
                    {label: '第三级', value: 3},
                    {label: '第四级', value: 4},
                    {label: '第五级', value: 5},
                    {label: '第六级', value: 6},
                    {label: '第七级', value: 7},
                    {label: '第八级', value: 8},
                    {label: '第九级', value: 9},
                    {label: '第十级', value: 10}
                ]),
                posRules: Object.freeze({
                    level: baseValiObj,
                    name: baseValiObj
                }),
                posFormModel:{
                    level: '',
                    name: ''
                },
                formModel: {
                    id: '',
                    name: '',
                },
                accountStatusMap: Object.freeze(accountStatusMap)
            }
        },
        computed: {
            filterTableData() {
                const {name} = this
                return this.tableData.filter(item => item.real_name.includes(name) || item.username.includes(name))
            }
        },
        methods: {
            submitPosition() {
                if (!this.formModel.name) {
                    return this.$message.success('请输入职位名称')
                }
                this.submitting = true
                const params = {
                    ...this.formModel,
                    id: this.selPosVal
                }
                updatePosLv(params).then(() => {
                    this.ajaxLvData()
                    this.handleSelPosition(this.selPosVal)
                    this.closeDialog()
                }).finally(() => {
                    this.submitting = false
                })
                // this.submitting = true
                // const {formModel} = this
                // const data = {...formModel}
                // let handle = updateMangePos
                // const isEdit =  data.id !== ''
                // if (!isEdit) {
                //     delete data.id
                //     handle = createRole
                // }
                // handle(this.formModel).then(res => {
                //     this.$message.success(`${isEdit ? '编辑' : '新增'}角色成功!`)
                //     this.closeDialog()
                //     this.$emit('success', isEdit ? data.id : +res.id)
                // }).finally(() => {
                //     this.submitting = false
                // })
            },
            closeDialog() {
                this.editRoleDialogVisible = false
            },
            // 注销
            dimission(id, index) {
                this.confirm('账号注销后不可恢复，是否确认注销？', '注销').then(() => {
                    dimission({id}).then(res => {
                        this.$set(this.tableList, index, res)
                        this.$message.success('操作成功!')
                    })
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
                        row.account_status_str = willDisable ? '已禁用' : '正常'
                        this.$message.success('操作成功!')
                    }).catch(() => {})
                })
            },
            genSimulatedLink(id) {
                genSimulatedLink({id}).then(res => {
                    window.open(res.url, '_blank')
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
            // 新增/编辑销售
            editSales(id) {
                this.ajaxPositionData()
                id && this.ajaxSalesDetail(id)
                this.editDialogId = id
                this.editDialogVisible = true
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
            handleSetPos() {
                this.editRoleDialogVisible = true
                this.formModel.name = this.selPosName
            },
            delPosition() {
                this.confirm('删除后，数据无法恢复，请确认', '删除').then(() => {
                    delMangePos({id: this.selPosVal}).then(() => {
                        this.$message.success('操作成功!')
                        this.selPosVal = ''
                        this.selPosName = ''
                        this.ajaxLvData()
                    })
                })
            },
            // 表格最大高度
            setMaxHeight: debounce(function() {
                const container = this.$refs.container
                if (container) {
                    this.maxHeight = this.$refs.container.offsetHeight - 64
                }
            }, 300),
            handleSelPosition(v) {
                this.tableList = []
                this.detailData = []
                this.curTabIdx = 'people'
                this.selPosVal = v.value
                this.selPosName = v.label
                // this.ajaxDetail(v.value)
                this.ajaxAllSalesList()
            },
            ajaxAllSalesList() {
                this.tableLoading = true
                const params = { position_id: this.selPosVal }
                getAllSalesList(params).then(res => {
                    this.tableList = res.data
                }).finally(() => {
                    this.tableLoading = false
                })
            },
            handleTabChange() {
                if (this.curTabIdx === 'people') {
                    this.tableList = []
                    this.ajaxAllSalesList()
                }
                if (this.curTabIdx === 'permission') {
                    this.detailData = []
                    this.ajaxDetail(this.selPosVal)
                }
            },
            // 重置编辑权限滚动条
            resetScrollbar() {
                this.$refs.permissionScrollWrap.$el.querySelector('.permission-scroll-wrap').scrollTo(0, 0)
            },
            // 初始化tree节点选中和半选状态
            dealTreeData(arr) {
                arr.forEach(item => {
                    const {permission_groups = [], permissions = []} = item
                    // 递归处理权限组
                    permission_groups.length && this.dealTreeData(permission_groups)
                    const allChild = [...permission_groups, ...permissions]
                    const checkedCount = allChild.reduce((prev, next) => prev + (next.is_checked ? 1 : 0), 0)
                    item.is_checked = checkedCount > 0 && allChild.length === checkedCount
                    item.indeterminate = permission_groups.some(item => item.indeterminate) || (checkedCount > 0 && checkedCount < allChild.length)
                })
            },
            editTree() {
                this.treeDetail = JSON.parse(JSON.stringify(this.detailData))
                this.treeDialogVisible = true
            },
            submitModifyPermission() {
                this.submitting = true
                const position_id = this.selPosVal
                const permission_ids = []
                this.loopTree(this.treeDetail, permission_ids)
                updatePosTree({permission_ids, position_id}).then(() => {
                    this.$message.success('编辑权限成功!')
                    this.ajaxDetail(position_id)
                    this.treeDialogVisible = false
                }).catch(() => {}).finally(() => {
                    this.submitting = false
                })
            },
            loopTree(dataArr, arr) {
                dataArr.forEach(item => {
                    if (item.permission_groups && item.permission_groups.length) {
                        this.loopTree(item.permission_groups, arr)
                    }
                    if (item.permissions && item.permissions.length) {
                        arr.push(...item.permissions.filter(item => item.is_checked).map(item => item.id))
                    }
                })
            },
            handleSelLv(obj) {
                this.selLv = obj.level
                this.positionData = []
                this.selPos = ''
                this.detailData = []
                this.ajaxPositionData(obj.level)
            },
            handleSelPos(obj) {
                this.selPos = obj.id
                this.detailData = []
                this.ajaxDetail(obj.id)
            },
            submitCreatePos() {
                this.$refs.posForm.validate(flag => {
                    if (flag) {
                        this.submitting = true
                        const params = this.posFormModel
                        createPosLv(params).then(res => {
                            this.lvData = []
                            this.selLv = ''
                            this.positionData = []
                            this.selPos = ''
                            this.detailData = []
                            this.ajaxLvData(params.level, res.id)
                            this.$message.success('职位添加成功!')
                            this.posDialogVisible = false
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            ajaxDetail(position_id) {
                this.detailLoading = true
                getPosDetail({position_id}).then(res => {
                    this.dealTreeData(res)
                    this.detailData = res
                }).catch(() => {}).finally(() => {
                    this.detailLoading = false
                })
            },
            ajaxPositionData(level, id) {
                this.positionLoading = true
                getPositionList({level, role: 'sales'}).then(res => {
                    this.positionData = res
                    if (id) {
                        this.selPos = id
                        this.ajaxDetail(id)
                    }
                }).catch(() => {}).finally(() => {
                    this.positionLoading = false
                })
            },
            ajaxLvData(lv, id) {
                this.positionLoading = true
                getPosLvList().then(res => {
                    this.lvData = res.map(i => {
                        return {
                            label: i.level_str,
                            children: i.items.map(y => {
                                return {
                                    label: y.name,
                                    value: y.id,
                                    sales_count: y.sales_count
                                }
                            })
                        }
                    })
                    if (id) {
                        this.selLv = lv
                        this.ajaxPositionData(lv, id)
                    }
                }).catch(() => {}).finally(() => {
                    this.positionLoading = false
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
            }
        },
        created() {
            this.ajaxLvData()
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
    .position-pane-container{
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: row;
        align-items: stretch;
        ::v-deep .pos-side-filter {
            .pos-list-item{
                width: 100%;
                height: 100%;
                &>span{
                    font-size: 14px;
                }
                /*&>span:nth-of-type(1){*/
                /*    color: #4d4d4d;*/
                /*}*/
                &>span:nth-of-type(2){
                    font-size: 14px;
                    color: #999999;
                    font-weight: normal;
                }
            }
            .list-item.active .pos-list-item>span:nth-of-type(2){

                /*font-weight: bold;*/
                /*color:#1a1a1a;*/
            }
        }
        .add-button{
            position: absolute;
            z-index: 3;
            top: 12px;
            right: 36px;
        }
        .right {
            flex: 1;
            overflow: hidden;
            border-top: transparent;
            padding: 0 16px;
            padding: 20px 16px;
            .content{
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
                        // flex: 1;
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
            .sale-filter-bar{
                display: flex;
                justify-content: space-between;
                height: 64px;
                align-items: center;
                &>.el-input{
                    width: 240px;
                }
            }
            ::v-deep .el-scrollbar{
                height: calc(100% - 32px);
            }
        }
        ::v-deep .side-filter-container .list-item:first-of-type {
            border-top: transparent;
        }
        ::v-deep .el-dialog__body{
            overflow: visible;
        }
    }
    .pos-filter-list {
        flex: 0 0 240px;
        border-right: 1px solid #e6e6e6;
        .list-item-wrap{
        padding:0 8px 8px 8px;
        .group-item,
        .list-item {
            height: 44px;
            line-height: 44px;
            background: #fff;
            padding: 0 8px;
            color: #999;
            box-sizing: border-box;
            font-size: 14px;
            border-radius: 4px;
        }
        .group-item {
            .el-divider {
            margin: 0;
            }
        }
        .list-item {
            display: flex;
            justify-content: space-between;
            color: #4d4d4d;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            cursor: pointer;
            .list-label {
            width: 162px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            }
            &:hover {
            background: #e6e6e6;
            color: #1A1A1A;
            font-weight: 400;
            }
            &.active {
            background:rgba(31,120,255,0.1);
            font-weight: bold;
            color: #1F78FF;
            }
        }
        }
        ::v-deep .el-scrollbar__wrap{
        overflow-x: hidden;
        }
    }
    .list-people-count {
        color: #999;
    }
    .active {
        .list-people-count {
            color: #1F78FF !important;
        }
    }
    .empty-tips {
        margin: 30vh auto;
        text-align: center;
    }
</style>