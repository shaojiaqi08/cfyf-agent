<template>
    <div class="tree-node-container">
        <i :class="`${data.expanded ? 'icon-expanded' : ''} el-icon-caret-right arrow-btn`"
           v-if="(data.sys_permission_groups && data.sys_permission_groups.length > 0)||(data.sys_permissions && data.sys_permissions.length > 0)"
            @click="triggerExpanded"></i>
        <el-checkbox v-model="data.is_checked">{{data.name || data.display_name}}</el-checkbox>
        <div v-if="data.expanded && data.sys_permission_groups && data.sys_permission_groups.length > 0" class="tree-group-container">
            <tree-node  :key="index" v-for="(item, index) in data.sys_permission_groups" v-model="data.sys_permission_groups[index]"></tree-node>
        </div>
        <div class="tree-permission-container" v-if="data.expanded && data.sys_permissions && data.sys_permissions.length > 0">
            <tree-node :key="index" v-for="(item, index) in data.sys_permissions" v-model="data.sys_permissions[index]"></tree-node>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tree-node',
        model: {
            prop: 'data',
            event: 'update'
        },
        props: {
            data: {
                type: Object,
                default: () => {}
            }
        },
        methods: {
            triggerExpanded() {
                this.data.expanded = !this.data.expanded
                this.$emit('update', this.data)
            }
        },
        created() {
            console.log(this.data)
        }
    }
</script>

<style scoped lang="scss">
    .arrow-btn{
        cursor: pointer;
        transition: transform .3s ease-in-out;
        color: #c0c4cc;
        font-size: 12px;
        &.icon-expanded{
            cursor: pointer;
            color: #c0c4cc;
            transform: rotate(90deg);
        }
    }
    .tree-node-container{
        padding-top: 10px;
        padding-left: 30px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        .tree-group-container{
            white-space: nowrap;
            &>.tree-node-container:first-of-type::after{
                left: 22px !important;
                width: 5px;
            }
        }
        &:nth-of-type(1)::before{
            content: '';
            display: inline-block;
            width: 0;
            position: absolute;
            top: 0;
            left: 20px;
            bottom: 9px;
            border-right: 1px dashed #000;
        }
        &::after{
            content: '';
            display: inline-block;
            width: 18px;
            height: 30px;
            position: absolute;
            top: 19px;
            left: 7px;
            border-top: 1px dashed #000;
        }
        .tree-permission-container {
            &::after{
                display: none;
            }
            .tree-node-container {
                &::before {
                    display: none;
                }

                display: block;
            }
            &::before {
                content: '';
                display: inline-block;
                width: 0;
                position: absolute;
                transform: translateX(7px);
                top: 30px;
                bottom: 9px;
                left: 44px;
                border-right: 1px dashed #000;
            }
            &>.tree-node-container::after{
                content: '';
                display: inline-block;
                width: 7px;
                height: 30px;
                position: absolute;
                top: 19px;
                left: 22px;
                border-top: 1px dashed #000;
            }
        }
    }
</style>