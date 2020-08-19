<template>
    <div class="health-notice-container page-container">
        <div class="header">
            <el-tabs v-model="tabIndex">
                <el-tab-pane v-if="$checkAuth('/interactive-logs/proposal')" name="proposal" label="计划书"></el-tab-pane>
                <el-tab-pane v-if="$checkAuth('/interactive-logs/product')" name="share" label="产品分享"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="content">
            <keep-alive>
                <Component :is="tabIndex"></Component>
            </keep-alive>
        </div>
    </div>
</template>
<script>
    import Proposal from './tab-panel/proposal'
    import Share from './tab-panel/share'
    export default {
        name: 'underwrite-health-notice',
        components: {
            Proposal,
            Share
        },
        data() {
            return {
                tabIndex: '',
                productName: ''
            }
        },
        created() {
            // 初始化tab权限
            if (this.$checkAuth('/interactive-logs/proposal')) {
                this.tabIndex = 'proposal'
            } else if (this.$checkAuth('/interactive-logs/product')) {
                this.tabIndex = 'share'
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