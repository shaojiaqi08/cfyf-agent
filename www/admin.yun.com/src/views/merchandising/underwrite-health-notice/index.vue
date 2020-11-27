<template>
    <div class="health-notice-container page-container">
        <div class="header">
            <el-tabs v-model="tabIndex">
                <el-tab-pane v-if="$checkAuth('/underwrite-health-notice/underwrite_rule')" name="underwrite-rules" label="投保规则"></el-tab-pane>
                <el-tab-pane v-if="$checkAuth('/underwrite-health-notice/health_report_inquiry')" name="health-search" label="健告查询"></el-tab-pane>
                <el-tab-pane v-if="$checkAuth('/underwrite-health-notice/underwriting')" name="underwrite-search" label="智核查询"></el-tab-pane>
                <el-tab-pane v-if="$checkAuth('/underwrite-health-notice/underwrite_content_rule')" name="underwrite-content-rules" label="核保规则"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="content">
            <keep-alive>
                <Component :is="tabIndex||'none'"></Component>
            </keep-alive>
        </div>
    </div>
</template>
<script>
    import UnderwriteSearch from './tab-panel/underwrite-search'
    import HealthSearch from './tab-panel/health-search'
    import UnderwriteRules from './tab-panel/underwrite-rules'
    import UnderwriteContentRules from './tab-panel/underwriting-contents-rules'
    import {mapState} from 'vuex'
    export default {
        name: 'underwrite-health-notice',
        components: {
            UnderwriteSearch,
            HealthSearch,
            UnderwriteRules,
            UnderwriteContentRules
        },
        computed: {
            ...mapState('users', ['userInfo'])
        },
        data() {
            return {
                tabIndex: '',
                productName: ''
            }
        },
        watch: {
            'userInfo.permissions': {
                handler() {
                    // 初始化tab权限
                    if (this.$checkAuth('/underwrite-health-notice/underwrite_rule')) {
                        this.tabIndex = 'underwrite-rules'
                    } else if (this.$checkAuth('/underwrite-health-notice/health_report_inquiry')) {
                        this.tabIndex = 'health-search'
                    } else if (this.$checkAuth('/underwrite-health-notice/underwriting')) {
                        this.tabIndex = 'underwrite-search'
                    } else if (this.$checkAuth('/underwrite-health-notice/underwrite_content_rule')) {
                        this.tabIndex = 'underwrite-content-rules'
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .health-notice-container{
        padding: 0 16px 0 16px;
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
