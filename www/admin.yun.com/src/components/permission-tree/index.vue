<template>
    <div class="permission-tree-container" ref="container" v-loading="loading">
        <template v-if="filterData.length">
            <tree-node :key="index" v-for="(item, index) in filterData" v-model="filterData[index]"></tree-node>
        </template>
        <span v-else class="empty-tips">无权限配置</span>
    </div>
</template>

<script>
    import TreeNode from './tree-node'
    export default {
        name: 'permission-tree',
        components: {TreeNode},
        model: {
            prop: 'data',
            event: 'update'
        },
        provide() {
            return {
                editable: this.editable,
                $top: this
            }
        },
        computed: {
            filterData() {
                const {editable, data} = this
                return editable ? data : data.filter(item => (item.is_checked || item.indeterminate))
            }
        },
        props: {
            data: {
                type: Array,
                default: () => []
            },
            loading: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            // 强制刷新
            updateTree() {
                this.$emit('update', JSON.parse(JSON.stringify(this.data)))
            }
        }
    }
</script>

<style scoped lang="scss">
    .permission-tree-container{
        position: relative;
        display: flex;
        flex-direction: column;
        width: auto;
        &>.tree-node-container{
            padding-left: 0;
            &::before{
                display: none;
            }
            &::after{
                display: none;
            }
            &>::v-deep .tree-group-container::before{
                display: none;
            }
            & > ::v-deep .chkbox-wrap::after{
                display: none;
            }
            & > ::v-deep .chkbox-wrap:hover{
                background: #f5f5f5;
            }
            & > ::v-deep .tree-group-container>.tree-node-container:last-of-type::before{
                height: 100%;
            }
            &:last-of-type > ::v-deep .tree-group-container>div:last-of-type::before{
                height: 13px;
            }
        }
        .empty-tips {
            margin: 30vh auto;
            text-align: center;
        }
    }
</style>