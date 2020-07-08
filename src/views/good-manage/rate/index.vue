<template>
    <div class="rate-container">
        <div class="header">
            <el-tabs v-model="tabIndex">
                <el-tab-pane name="server-rate" label="服务费率"></el-tab-pane>
                <el-tab-pane name="commission-rate" label="佣金费率"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="content">
            <Component :is="tabIndex"></Component>
        </div>
    </div>
</template>

<script>
    import serverRate from './tab-panel/server-rate'
    import commissionRate from './tab-panel/commission-rate'
    export default {
        name: 'rate',
        components: {
            serverRate,
            commissionRate
        },
        data() {
            return {
                tabIndex: 'server-rate'
            }
        }
    }
</script>

<style scoped lang="scss">
    .rate-container{
        padding: 16px 16px 0 16px;
        height: 100%;
        .header{
            padding: 0 16px;
            height: 56px;
            line-height: 56px;
            background: #F5F5F5;
            border-radius: 4px 4px 0px 0px;
            border: 1px solid #E6E6E6;
        }
        .content{
            background-color: #fff;
            height: calc(100vh - 74px);
        }
    }
</style>