<template>
    <div class="tree-node-container">
        <div class="chkbox-wrap">
            <i :class="`${expanded ? 'icon-expanded' : ''} el-icon-caret-right arrow-btn`"
               v-if="showExpandedbtn"
               @click="triggerExpanded"></i>
            <el-checkbox v-if="editable"
                         :indeterminate="data.indeterminate"
                         v-model="data.is_checked"
                         @change="handleChecked(data)">{{data.name || data.display_name}}</el-checkbox>
            <span v-else style="font-size: 14px">{{data.name || data.display_name}}</span>
        </div>
        <div class="tree-permission-container"
             :class="{'has-group-follow': filterPermissionGroup.length > 0}"
             v-show="expanded"
             v-if="showPermission">
            <tree-node @checked="handleSubChecked"
                       :key="index"
                       v-for="(item, index) in filterPermissionData"
                       v-model="filterPermissionData[index]"></tree-node>
        </div>
        <div v-show="expanded"
             v-if="showPermissionGroup"
             class="tree-group-container">
            <tree-node @checked="handleSubChecked"
                       :key="index"
                       v-for="(item, index) in filterPermissionGroup"
                       v-model="filterPermissionGroup[index]"></tree-node>
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
        inject: ['editable', '$top'],
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                expanded: true
            }
        },
        computed: {
            showExpandedbtn() {
                const {editable, data} = this
                const {permission_groups: groups, permissions} = data
                return editable ?
                    (groups && groups.length) || (permissions && permissions.length > 0) :
                    (groups && groups.some(item => item.is_checked || item.indeterminate)) || (permissions && permissions.some(item => item.is_checked))
            },
            showPermissionGroup() {
                const {data} = this
                return data.permission_groups && data.permission_groups.length
            },
            showPermission() {
                const {data, editable} = this
                const {permissions} = data
                return editable ? permissions && permissions.length : permissions && permissions.some(item => item.is_checked)
            },
            filterPermissionGroup() {
                const {editable, data} = this
                // 修改状态返回所有, 否则返回is_checked=true的数据
                return editable ? data.permission_groups : (data.permission_groups || []).filter(item => item.is_checked || item.indeterminate)
            },
            filterPermissionData() {
                const {editable, data} = this
                // 修改状态返回所有, 否则返回is_checked=true的数据
                return editable ? data.permissions : data.permissions.filter(item => item.is_checked)
            }
        },
        methods: {
            // 折叠
            triggerExpanded() {
                this.expanded = !this.expanded
            },
            // checkbox点击事件
            handleChecked(obj) {
                obj.indeterminate = false
                // 更新子节点
                this.updateChildren(obj, obj.is_checked)
                // 更新父节点
                this.$emit('checked')
                // 从顶层父节点处渲染整棵树
                this.$top.updateTree()
            },
            // 递归更新子节点
            updateChildren(obj, value) {
                obj.permission_groups && obj.permission_groups.forEach(item => {
                    item.is_checked = value
                    item.indeterminate = false
                    this.updateChildren(item, value)
                })
                obj.permissions && obj.permissions.forEach(item => {
                    item.is_checked = value
                    this.updateChildren(item, value)
                })
            },
            // 子checkbox更新父checkbox
            handleSubChecked() {
                let parent = this
                while (parent && parent !== this.$top) {
                    const d = parent.data
                    const allChild = [...(d['permission_groups'] || []), ...(d['permissions'] || [])]
                    const checkedCount = allChild.reduce((prev, next) => prev + (next.is_checked ? 1 : 0), 0)
                    parent.data.is_checked = checkedCount > 0 && allChild.length === checkedCount
                    // 半选
                    parent.data.indeterminate = d['permission_groups'].some(item => item.indeterminate) || (checkedCount > 0 && checkedCount < allChild.length)
                    parent = parent.$parent
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
        padding-left: 48px;
        position: relative;
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
            &:hover{
                background: #f5f5f5;
                border: 4px;
            }
        }
        .tree-group-container{
            white-space: nowrap;
            position: relative;
            transition: background-color .3s ease-in-out;
        }
        &>div:last-of-type>.tree-node-container:last-of-type::before{
            height: 13px;
        }
        &::after{
            content: '';
            display: inline-block;
            width: 32px;
            position: absolute;
            top: 13.5px;
            left: 14px;
            border-top: 1px dashed #ccc;
        }
        &:nth-of-type(1)::after{
            width: 32px;
        }
        &::before{
            content: '';
            display: inline-block;
            width: 0;
            position: absolute;
            bottom: 0px;
            top: 0;
            left: 14px;
            border-right: 1px dashed #ccc;
        }
        .tree-permission-container {
            position: relative;
            display: flex;
            flex-direction: column;
            &::after{
                display: none;
            }
            &>.tree-node-container{
                padding-left: 48px;
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
                top: 0;
                bottom: 0;
                left: 14px;
                height: calc(100% - 14px) !important;
                border-right: 1px dashed #ccc;
                z-index: 10;
            }
            &.has-group-follow::before{
                height: 100% !important;
            }
            &>.tree-node-container::after{
                content: '';
                display: inline-block;
                width: 32px;
                position: absolute;
                top: 14px;
                left: 14px;
                border-top: 1px dashed #ccc;
            }
            &:hover {
                background: #f5f5f5;
                .tree-node-container{
                    background: #f5f5f5;
                    &:first-of-type{
                        border-radius: 4px 0 0 4px;
                    }
                    &:last-of-type{
                        border-radius: 0 4px 4px 0;
                    }
                }
            }
            .chkbox-wrap:hover{
                background: transparent;
                border: 0px;
            }
        }
    }
</style>
