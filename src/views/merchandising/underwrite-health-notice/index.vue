<template>
    <div class="health-notice-container">
        <div class="header">
            <el-tabs v-model="tabIndex">
                <el-tab-pane name="underwrite-search" label="核保查询"></el-tab-pane>
                <el-tab-pane name="health-search" label="健告查询"></el-tab-pane>
                <el-tab-pane name="underwrite-rules" label="核保规则"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="content">
            <Component :is="tabIndex"></Component>
        </div>
    </div>
</template>

<script>
    import UnderwriteSearch from './tab-panel/underwrite-search'
    import HealthSearch from './tab-panel/health-search'
    import UnderwriteRules from './tab-panel/underwrite-rules'
    export default {
        name: 'underwrite-health-notice',
        components: {
            UnderwriteSearch,
            HealthSearch,
            UnderwriteRules
        },
        data() {
            return {
                tabIndex: 'underwrite-search',
                productName: ''
            }
        }
    }
</script>

<style scoped lang="scss">
    .health-notice-container{
        padding: 16px 16px 0 16px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        ::v-deep .search-input{
            position: fixed;
            top: 66.5px;
            right: 32px;
            z-index: 2;
            width: 360px;
        }
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