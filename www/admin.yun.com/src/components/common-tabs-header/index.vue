<template>
    <el-tabs class="tabs" v-model="tabIndex" v-bind="$attrs" v-on="$listeners">
        <el-tab-pane
            v-for="(item, index) in filterData"
            :key="index"
            :name="item.name"
            :label="item.label">
            <span slot="label">
                <span>{{item.label}}</span>
                <el-badge :is-dot="item.dot && checkIsShowDot(item.dot)"></el-badge>
            </span>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    // 公共页面tabs头简单封装
    // 主要封装权限判断
    import { mapState } from 'vuex'
    export default {
        name: 'common-tabs-header',
        computed: {
            ...mapState('users', ['userInfo']),
            ...mapState('dotManage', ['dots']),
            filterData() {
                return this.data.filter(i => i.permission ? this.$checkAuth(i.permission) : true)
            }
        },
        data() {
            return {
                tabIndex: ''
            }
        },
        props: {
            data: {
                type: Array,
                default: () => [],
                required: true
            },
            value: String
        },
        methods: {
            checkIsShowDot(dots) {
                return Array.isArray(dots) ? dots.some(key => this.dots[key] > 0) : this.dots[dots] > 0
            },
        },
        watch: {
            tabIndex(v) {
                this.$emit('input', v)
            },
            'userInfo.permissions': {
                handler() {
                    this.tabIndex = (this.filterData[0] || {}).name
                },
                immediate: true
            }
        }
    }
</script>
<style lang="scss" scoped>
    ::v-deep .el-tabs__nav-wrap, ::v-deep .el-tabs__nav-scroll {
        overflow: visible;
    }

    ::v-deep .el-badge {
        position: absolute;
        top: -6px;
    }
</style>
