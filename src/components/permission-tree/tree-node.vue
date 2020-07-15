<template>
    <div class="tree-node-container">
        <div class="chkbox-wrap">
            <i :class="`${expanded ? 'icon-expanded' : ''} el-icon-caret-right arrow-btn`"
               v-if="(data.permission_groups && data.permission_groups.length > 0)||(data.permissions && data.permissions.length > 0)"
               @click="triggerExpanded"></i>
            <el-checkbox v-if="editable" :indeterminate= "indeterminate" v-model="data.is_checked" @change="handleChecked(data)">{{data.name || data.display_name}}</el-checkbox>
            <span v-else style="font-size: 14px">{{data.name || data.display_name}}</span>
        </div>
        <div v-show="expanded"
             v-if="data.permission_groups && data.permission_groups.length > 0"
             class="tree-group-container">
            <tree-node @checked="handleSubChecked" :parent="data" :isGroup="true"  :key="index" v-for="(item, index) in data.permission_groups" v-model="data.permission_groups[index]"></tree-node>
        </div>
        <div class="tree-permission-container"
             v-show="expanded"
             v-if="data.permissions && data.permissions.length > 0">
            <tree-node @checked="handleSubChecked" :parent="data" :isGroup="false" :key="index" v-for="(item, index) in data.permissions" v-model="data.permissions[index]"></tree-node>
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
        inject: ['editable', 'treeData', '$top'],
        props: {
            data: {
                type: Object,
                default: () => {}
            },
            isGroup: Boolean,
            parent: Object
        },
        data() {
            return {
                indeterminate: false,
                expanded: true
            }
        },
        methods: {
            triggerExpanded() {
                this.expanded = !this.expanded
            },
            handleChecked(obj) {
                this.updateChildren(obj, obj.is_checked)
                this.$emit('checked', obj, this.isGroup)
                this.$top.updateTree()
            },
            updateChildren(obj, value) {
                if (obj.permission_groups) {
                    obj.permission_groups.forEach(item => {
                        item.is_checked = value
                        this.updateChildren(item, value)
                    })
                }
                if (obj.permissions){
                    obj.permissions.forEach(item => {
                        item.is_checked = value
                        this.updateChildren(item, value)
                    })
                }
            },
            // 子checkbox更新父checkbox
            handleSubChecked(obj, isGroup) {
                const {data} = this
                const target = data[isGroup ? 'permission_groups' : 'permissions']
                if (!data.is_checked) {
                    data.is_checked = target.every(item => item.is_checked)
                } else {
                    data.is_checked = false
                }
                // 更新父节点
                let parent = this.parent
                while (parent) {
                    const target = parent[this.isGroup ? 'permission_groups' : 'permissions']
                    if (!parent.is_checked) {
                        parent.is_checked = target.every(item => item.is_checked)
                    } else {
                        parent.is_checked = false
                    }
                    parent = parent.parent
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .arrow-btn{
        cursor: pointer;
        transition: transform .3s ease-in-out;
        color: #D8D8D8;
        font-size: 12px;
        margin-right: 8px;
        &.icon-expanded{
            transform: rotate(90deg);
        }
    }
    .tree-node-container{
        padding-left: 84px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        .expanded-enter-active, .expanded-leave-active{
            transition: transform .2s ease-in-out;
            transform: scaleY(0);
            transform-origin: top;
        }
        .expanded-enter-to, .expanded-leave-to{
            transform: scaleY(1);
        }
        .chkbox-wrap{
            height: 28px;
            display: flex;
            align-items: center;
            border-radius: 4px;
            padding: 0 8px;
            overflow: hidden;
            &::after{
                content: '';
                display: inline-block;
                width: 100%;
                transform: translateX(8px);
                border-top: 1px dashed #ccc;
            }
        }
        .tree-group-container{
            white-space: nowrap;
            &:hover{
                background: #f5f5f5;
                border-radius: 4px;
            }

            &>.tree-node-container:first-of-type{
                padding-left: 48px;
                &::after{
                    left: 14px !important;
                }
            }
        }
        &::after{
            content: '';
            display: inline-block;
            width: 84px;
            position: absolute;
            top: 13.5px;
            left: 2px;
            border-top: 1px dashed #ccc;
        }
        &:nth-of-type(1)::after{
            width: 32px;
        }
        .tree-permission-container {
            position: relative;
            &::after{
                display: none;
            }
            &>.tree-node-container{
                padding-left: 45px;
                &> ::v-deep .chkbox-wrap::after{
                    display: none;
                }
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
                top: 0px;
                bottom: 14px;
                left: 14px;
                border-right: 1px dashed #ccc;
            }
            &>.tree-node-container::after{
                content: '';
                display: inline-block;
                width: 30px;
                position: absolute;
                top: 14px;
                left: 16px;
                border-top: 1px dashed #ccc;
            }
        }
    }
</style>