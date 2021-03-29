<template>
    <el-tabs class="tabs" v-model="tabIndex" v-bind="$attrs">
        <el-tab-pane
            v-for="(item, index) in filterData"
            :key="index"
            :name="item.name"
            :label="item.label">
            <span slot="label">
                <el-badge :is-dot="item.dot" v-if="item.dot" class="mr4"></el-badge>
                <span>{{item.label}}</span>
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
