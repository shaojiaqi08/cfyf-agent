<template>
    <div class="permission-tree-container" ref="container" v-loading="loading">
        <tree-node :key="index" v-for="(item, index) in data" v-model="data[index]"></tree-node>
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
        props: {
            data: {
                type: Array,
                default: () => []
            },
            loading: {
                type: Boolean,
                default: false
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
            &::before{
                display: none;
            }
            &::after{
                display: none;
            }
        }
    }
</style>