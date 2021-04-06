<template>
    <div class="health-notice-container page-container">
        <div class="header">
            <common-tabs-header v-model="tabIndex" :data="tabsData"></common-tabs-header>
        </div>
        <div class="content">
            <Component :is="tabIndex"></Component>
        </div>
    </div>
</template>
<script>
    import Proposal from './tab-panel/proposal'
    import Share from './tab-panel/share'
    import CommonTabsHeader from '../../../components/common-tabs-header'
    export default {
        name: 'underwrite-health-notice',
        components: {
            CommonTabsHeader,
            Proposal,
            Share
        },
        data() {
            return {
                tabIndex: '',
                tabsData: [
                    { name: 'proposal', label: '计划书', permission: '/interactive-logs/proposal'},
                    { name: 'share', label: '产品分享', permission: '/interactive-logs/product'}
                ],
                productName: ''
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
            padding-left: 16px;
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
