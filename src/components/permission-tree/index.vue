<template>
    <div :class="`permission-tree-container ${data.length === 1 ? 'only-one-data' : ''}`" ref="container" v-loading="loading">
        <tree-node :editable="editable" :key="index" v-for="(item, index) in data" v-model="data[index]"></tree-node>
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
            // 更新整棵树
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
        &>.tree-node-container{
            padding-left: 0;
            &::before{
                content: '';
                display: inline-block;
                width: 0;
                position: absolute;
                top: 26px;
                bottom: 0px;
                left: 14px;
                border-right: 1px dashed #ccc;
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
        }
        &.only-one-data>.tree-node-container{
            &::before{
                content: '';
                display: inline-block;
                width: 0;
                position: absolute;
                top: 26px;
                bottom: 50px;
                height: 17px;
                left: 14px;
                border-right: 1px dashed #ccc;
            }
        }
        &>.tree-node-container:last-child::before{
            height: 14px;
        }
    }
</style>