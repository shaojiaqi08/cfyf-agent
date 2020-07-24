<template>
    <div class="prospectus-container">
        <div class="header">
            内部管理员
            <el-input type="primary" v-model="searchForm.keyword" placeholder="搜索计划书名称" clearable>
                <filter-shell v-model="type" slot="prepend" class="keyword-type-filter">
                    <el-select v-model="type" clearable style="width: 100%" @change="handleSelType">
                        <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in keywordType"></el-option>
                    </el-select>
                    <template v-slot:label>
                        <span>{{keywordType.find(item => item.value === type).label}}</span>
                    </template>
                </filter-shell>
            </el-input>
        </div>
        <div class="content">
            <div class="filter-bar flex-between flex">
                <filter-shell v-model="dateRange" :width="385" class="date-range-filter">
                    <el-date-picker type="daterange" v-model="dateRange" @change="handleDateChange" clearable value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                    <template v-slot:label>
                        <span>{{hasValue(dateRange) ? `${dateRange[0]} 至 ${dateRange[1]}` : '全部时间范围'}}</span>
                    </template>
                    <template v-slot:close>
                        <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                           v-if="hasValue(dateRange)"
                           @click="dateRange=null"></i>
                    </template>
                </filter-shell>
                <div class="flex">
                    <el-tooltip placement="bottom" content="计划书个人展示">
                        <div @click="editUserInfo" class="avatar mr16">
                            <img :src="userHeadImg" class="avatar-image">
                        </div>
                    </el-tooltip>
                    <el-button type="primary" @click="addProposal">新建计划书</el-button>
                </div>
            </div>
            <el-table  v-loading="loading"
                       border
                      :data="data"
                      max-height="calc(100% - 84px)"
                      v-table-infinite-scroll="scroll2Bottom">
                <el-table-column label="计划书名称" prop="name" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template v-slot="{row}">
                        <el-tag :type="row.status === proposalStatusMap.done.value ? 'minor' : 'danger'">{{proposal_status[row.status]}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="所属客户" prop="customer_name" align="center"></el-table-column>
                <el-table-column label="创建时间" prop="created_at" align="center"></el-table-column>
                <el-table-column label="被保人" prop="recognizee_policies_text" align="center"></el-table-column>
                <el-table-column label="备注" prop="备注" align="center"></el-table-column>
                <el-table-column label="操作" width="240px" align="center">
                    <template v-slot="{row, index}">
                        <template v-if="row.status === proposalStatusMap.done.value">
                            <el-link type="primary" class="mr8" @click="checkMaterial(row)">计划书材料</el-link>
                            <el-link type="primary" class="mr8" @click="editProposal(row)">复制</el-link>
                            <el-link type="primary" class="mr8" @click="checkInfo(row, index)">查看h5计划书</el-link>
                        </template>
                        <template v-else>
                            <el-link type="primary" @click="editProposal(row)">编辑计划书</el-link>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="new-preview-wrapper" v-if="previewVisible" @click="previewHandleClose">
            <div class="new-preview-dialog">
                <!-- <div class="new-preview-dialog-close" @click="previewHandleClose"></div> -->
                <iframe class="new-preview-iframe"
                        :src="previewUrl" frameborder="0"></iframe>
            </div>
        </div>
        <user-info-modal :show.sync="isUserInfoModalShow"
                         :userInfo="userInfo"
                         @fresh="ajaxUserInfo"></user-info-modal>
        <proposal-material :show.sync="isProposalMaterialShow"
                           :proposalInfo="proposalInfo"
                           title="计划书材料"></proposal-material>
        <add-member-struct :show.sync="isAddProposal"></add-member-struct>
    </div>
</template>

<script>
    import FilterShell, {clearValue, hasValue, closePopover} from '@/components/filter-shell'
    import UserInfoModal from './modal/user-info'
    import ProposalMaterial from './proposal-operate/modal/proposal-material'
    import AddMemberStruct from './modal/add-member-struct'
    import {debounce} from '@/utils'
    import {proposal_status, proposalStatusMap} from '@/enums/merchandising'
    import {getProposalList, getProposalMasterInfo} from '@/apis/modules/proposal'
    export default {
        name: 'prospectus',
        components: {
            UserInfoModal,
            ProposalMaterial,
            AddMemberStruct,
            FilterShell
        },
        directives: {
            'table-infinite-scroll' : {
                inserted(el, binding) {
                    const scrollWrap = el.querySelector('.el-table__body-wrapper')
                    const scrollHandle = debounce(() => {
                        const {scrollHeight, scrollTop, offsetHeight} = scrollWrap
                        if (offsetHeight + scrollTop >= scrollHeight) { // 到底
                            binding.value()
                        }
                    }, 300)
                    scrollWrap.addEventListener('scroll', scrollHandle)
                }
            }
        },
        data() {
            return {
                proposal_status,
                proposalStatusMap,
                isUserInfoModalShow: false,
                isProposalMaterialShow: false,
                previewVisible: false,
                isAddProposal: false,
                loading: false,
                previewUrl: '',
                userInfo: {},
                userHeadImg: '',
                proposalInfo: {},
                keywordType: [
                    {value: 'name', label: '计划书名称'},
                    {value: 'proposal_product_name', label: '产品名称'}
                ],
                data: [
                ],
                type: 'name',
                dateRange: null,
                searchForm: {
                    page: 1,
                    limit: 10,
                    name: '',
                    customer_name: '',
                    proposal_product_name: '',
                    start_created_at: '',
                    end_created_at: '',
                    keyword: ''
                }
            }
        },
        methods: {
            clearValue,
            hasValue,
            closePopover,
            // 筛选日期change
            handleDateChange(v) {
                const [start = '', end = ''] = v || []
                this.searchForm.start_created_at = start
                this.searchForm.end_created_at = end
            },
            editUserInfo() {
                this.isUserInfoModalShow = true
            },
            addProposal() {
                this.isAddProposal = true
            },
            checkInfo(item, index) {
                this.currentIndex = index
                this.previewVisible = true
                if (item.status === proposalStatusMap.hold.value) return
                this.previewUrl = ''
                this.$nextTick(() => {
                    this.previewUrl = item.view_url
                })
            },
            editProposal(item) {
                let routeUrl = this.$router.resolve(`/proposal/proposal-operate?proposal_id=${item.id}&customer_id=${item.customer_id}`)
                window.open(routeUrl.href, '_blank')
            },
            checkMaterial(item) {
                this.isProposalMaterialShow = true
                this.proposalInfo = item
            },
            scroll2Bottom() {
                this.searchForm.page += 1
                this.ajaxData()
            },
            previewHandleClose() {
                this.previewVisible = false
            },
            ajaxUserInfo() {
                getProposalMasterInfo().then(res => {
                    this.userInfo = res
                    this.userHeadImg = res.avatar_url
                })
            },
            ajaxData() {
                const {searchForm} = this
                this.loading = true
                getProposalList({...searchForm}).then(res => {
                    if (searchForm.page === 1) {
                        this.data = res.data
                    } else if (res.data.length > 0) {
                        this.data = [...this.data, ...res.data]
                    } else {
                        searchForm.page -= 1
                    }
                }).catch(()=> {}).finally(() => {
                    this.loading = false
                })
                this.ajaxUserInfo()
            },
            debounceAjaxData() {
                const func = debounce(() => {
                    this.ajaxData()
                }, 300)
                func()
                this.debounceAjaxData = func
            },
            handleSelType(val) {
               const target = this.searchForm
               this.keywordType.forEach(item => {
                   if (item.value !== val) {
                       target[item.value] = ''
                   } else {
                       target[val] =  this.keyword
                   }
               })
            }
        },
        created() {
            this.ajaxData()
        },
        watch: {
            searchForm: {
                handler() {
                    this.debounceAjaxData()
                },
                deep: true
            },
            dateRange(v) {
                this.searchForm.start_created_at = v[0]
                this.searchForm.end_created_at = v[1]
            },
        }
    }
</script>

<style scoped lang="scss">
    .prospectus-container{
        display: flex;
        padding: 20px 20px 0 20px;
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
            &>::v-deep .el-input {
                .el-input-group__prepend{
                    background: #fff;
                    padding: 0 4px;
                }
                .el-input__inner{
                    border-left: transparent;
                    &:focus{
                        border-color: rgb(220, 223, 230);
                    }
                }
            }
            ::v-deep .keyword-type-filter{
                .filter-item{
                    margin: 0;
                    height: 24px;
                    width: 106px;
                    font-weight: normal;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

        }
        & > .content{
            background: #FFFFFF;
            padding: 0 16px;
            flex: 1;
            .filter-bar{
                display: flex;
                justify-content: space-between;
                height: 64px;
                align-items: center;
            }
            ::v-deep .date-range-filter .filter-popover{
                width: 385px
            }
            .avatar {
                width: 32px;
                height: 32px;
                background-color: #f5f5f5;
                border: 1px solid #e6e6e6;
                border-radius: 50%;
                overflow: hidden;
                .avatar-image {
                    width: 33px;
                    height: 33px;
                    transform: translate(-1px, -1px);
                }
            }
        }
        .new-preview-wrapper {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            margin: 0;
            background-color: rgba(0, 0, 0, .2);
            z-index: 3001;
        }
        .new-preview-dialog {
            position: relative;
            margin: 0 auto 50px;
            margin-top: 3vh;
            width: 400px;
            height: 820px;
            background-color: #F5F5F5;
            border-radius: 8px;
            border: 12px solid #fff;
            // background: url(../../../assets/images/iPhone6.png) no-repeat;
            // background-size: contain;
        }
        .new-preview-dialog-close {
            position: absolute;
            right: -60px;
            top: 20px;
            width: 30px;
            height: 30px;
            background: url(../../../assets/images/proposal-close.png) no-repeat;
            background-size: contain;
            cursor: pointer;
        }
        .new-preview-iframe {
            position: absolute;
            // top: 106px;
            // left: 31px;
            width: 375px;
            height: 100%;
            cursor: cell;
        }
    }
</style>