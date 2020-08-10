<template>
    <div class="rate-container">
        <div class="header">
            <el-tabs v-model="tabIndex">
                <el-tab-pane name="server-rate" label="服务费率"></el-tab-pane>
                <el-tab-pane name="commission-rate" label="佣金费率"></el-tab-pane>
            </el-tabs>
            <el-button v-if="tabIndex === 'server-rate'" type="primary" @click="openRateDialog"><i class="iconfont iconxiao16_shezhi mr4"></i>批量设置服务费率</el-button>
        </div>
        <div class="content">
            <Component :is="tabIndex"></Component>
        </div>
        <rate-setting-dialog :visible.sync="dialogVisible"></rate-setting-dialog>
    </div>
</template>
<script>
    import serverRate from './tab-panel/server-rate'
    import commissionRate from './tab-panel/commission-rate'
    import RateSettingDialog from './component/rate-setting-dialog'
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
        }
    }
</script>

<style scoped lang="scss">
    .rate-container{
        padding: 16px 16px 0 16px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .header{
            padding: 16px 0 0 16px;
            height: 56px;
            background: #F5F5F5;
            border-radius: 4px 4px 0px 0px;
            border: 1px solid #E6E6E6;
            position: relative;
            .el-button{
                position: absolute;
                top:12px;
                right: 16px;
            }
        }
        .content{
            background-color: #fff;
            flex: 1;
            overflow: hidden;
            border: 1px solid #e6e6e6;
            border-top: transparent;
            box-sizing: border-box;
        }
    }
</style>