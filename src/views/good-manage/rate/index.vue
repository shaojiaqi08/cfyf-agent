<template>
    <div class="rate-container page-container">
        <div class="header">
            <el-tabs class="tabs" v-model="tabIndex">
                <el-tab-pane v-if="$checkAuth('/rate/service_rate')" name="server-rate" label="服务费率"></el-tab-pane>
                <el-tab-pane v-if="$checkAuth('/rate/commission_management')" name="commission-rate" label="佣金费率"></el-tab-pane>
            </el-tabs>
            <el-button v-if="$checkAuth('/rate/commission_management/batch_create') && tabIndex === 'commission-rate'" size="small" type="primary" @click="openRateDialog"><i class="iconfont iconxiao16_shezhi mr4"></i>批量设置佣金费率</el-button>
        </div>
        <div class="content">
            <Component :is="tabIndex"></Component>
        </div>
        <rate-setting-dialog type="add" :multCompany="true" :visible.sync="dialogVisible"></rate-setting-dialog>
    </div>
</template>
<script>
    import serverRate from './tab-panel/server-rate'
    import commissionRate from './tab-panel/commission-rate'
    import RateSettingDialog from './component/rate-setting-dialog'
    import {mapState} from 'vuex'
    export default {
        name: 'rate',
        components: {
            serverRate,
            commissionRate,
            RateSettingDialog
        },
        data() {
            return {
                dialogVisible: false,
                tabIndex: 'server-rate'
            }
        },
        methods: {
            openRateDialog() {
                this.dialogVisible = true
            }
        },
        computed: {
            ...mapState('users', ['userInfo'])
        },
        watch: {
            'userInfo.permissions': {
                handler() {
                    // 初始化tab权限
                    if (this.$checkAuth('/rate/service_rate')) {
                        this.tabIndex = 'server-rate'
                    } else if (this.$checkAuth('/rate/commission_management')) {
                        this.tabIndex = 'commission-rate'
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .rate-container{
        // padding: 16px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .header{
            padding: 16px 0 0;
            height: 56px;
            background: #F5F5F5;
            border-radius: 4px 4px 0px 0px;
            border: 1px solid #E6E6E6;
            position: relative;
            .tabs {
                padding-left: 18px;
            }
            .el-button{
                position: absolute;
                top:12px;
                right: 16px;
            }
        }
        .content{
            background-color: #fff;
            flex: 1;
            height: 800px;
            overflow: hidden;
            border: 1px solid #e6e6e6;
            border-top: transparent;
            box-sizing: border-box;
        }
    }
</style>