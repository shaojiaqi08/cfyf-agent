<template>
    <div class="position-pane-container">
        <el-button v-if="$checkAuth('/sale/position_and_authority/sales_position/store')"
                   class="add-button"
                   type="primary"
                   @click="posDialogVisible=true"
                   size="small"><i class="iconfont iconxiao16_jiahao"></i> 新增职位</el-button>
        <side-filter-list
                custom-class="pos-side-filter"
                v-loading="lvLoading"
                label-key="level_str"
                value-key="level"
                :showFilter="false"
                v-model="selLv"
                :disabled="positionLoading"
                @change="handleSelLv"
                style="width: 240px; border-right: 1px solid #e6e6e6"
                :listData="lvData"
        >
            <template v-slot:list="{row}">
                <div class="pos-list-item flex flex-between">
                    <span>{{row.level_str}}</span>
                    <span>共 {{row.count}} 个职位</span>
                </div>
            </template>
        </side-filter-list>
        <side-filter-list
                v-loading="positionLoading"
                label-key="name"
                value-key="id"
                :showFilter="false"
                v-model="selPos"
                @change="handleSelPos"
                :disabled="detailLoading"
                style="width: 240px"
                :listData="positionData"
        >
        </side-filter-list>
        <div class="right" v-loading="detailLoading">
            <template v-if="selLv && selPos">
                <el-scrollbar>
                    <permission-tree v-if="detailData.length" v-model="detailData"></permission-tree>
                    <div class="empty-tips" v-else>无配置权限</div>
                </el-scrollbar>
                <div class="flex-center">
                    <el-button v-if="$checkAuth('/sale/position_and_authority/update')" type="primary" @click="editTree" size="small">编辑权限</el-button>
                </div>
            </template>
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
        <el-dialog custom-class="permission-dialog" title="编辑权限" :visible.sync="treeDialogVisible" width="1000px" top="0" :close-on-click-modal="false">
            <el-scrollbar style="width: 100%;height: calc(89vh - 150px);">
                <permission-tree v-model="treeDetail" :editable="true"></permission-tree>
            </el-scrollbar>
            <span slot="footer">
                    <el-button @click="treeDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitModifyPermission" :loading="submitting" :disabled="submitting">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {getPositionList, getPosLvList, getPosDetail, createPosLv, updatePosTree} from '@/apis/modules/user-manage'
    import SideFilterList from '@/components/side-filter-list'
    import {accountStatusMap} from '@/enums/user-manage'
    import PermissionTree from '@/components/permission-tree'
    export default {
        name: 'position-pane',
        components: {
            SideFilterList,
            PermissionTree
        },
        data() {
            const baseValiObj = {required: true, message: '此项不可为空', trigger: 'blur'}
            return {
                treeDialogVisible: false,
                submitting: false,
                positionLoading: false,
                lvLoading: false,
                detailLoading: false,
                posDialogVisible: false,
                name: '',
                selLv: '',
                selPos: '',
                detailData: [],
                treeDetail: [],
                positionData: [],
                lvData: [],
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
            editTree() {
                this.treeDetail = JSON.parse(JSON.stringify(this.detailData))
                this.treeDialogVisible = true
            },
            submitModifyPermission() {
                this.submitting = true
                const position_id = this.selPos
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
                this.lvLoading = true
                getPosLvList().then(res => {
                    this.lvData = res
                    if (id) {
                        this.selLv = lv
                        this.ajaxPositionData(lv, id)
                    }
                }).catch(() => {}).finally(() => {
                    this.lvLoading = false
                })
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
            }
        },
        created() {
            this.ajaxLvData()
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
                &>span:nth-of-type(1){
                    color: #4d4d4d;
                }
                &>span:nth-of-type(2){
                    font-size: 14px;
                    color: #999999;
                }
            }
            .list-item.active .pos-list-item>span:nth-of-type(1){
                font-weight: bold;
                color:#1a1a1a;
            }
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
            border: 1px solid #e6e6e6;
            border-top: transparent;
            padding: 0 16px;
            padding: 20px 16px;
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
    }
    .empty-tips {
        margin: 30vh auto;
        text-align: center;
    }
</style>