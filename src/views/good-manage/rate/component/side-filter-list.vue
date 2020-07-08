<template>
    <div class="side-filter-container">
        <div class="search-bar" v-if="showFilter">
            <el-input prefix-icon="el-icon-search" :placeholder="placeholder"></el-input>
        </div>
        <el-scrollbar>
            <div class="list-item" v-for="(item, index) in listData" :key="index">
                <slot name="list" v-bind:row="item">{{item.name}}</slot>
            </div>
        </el-scrollbar>

    </div>
</template>
<script>
    export default {
        name: 'side-filter-list',
        props: {
            showFilter: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default: ''
            },
            labelKey: {
                type: String,
                required: true
            },
            listData: {
                type: Array,
                default: () => []
            },
            listItemRender: Function
        },
        data() {
            return {
                selIdx: 0
            }
        },
        methods: {
            handleSelected(obj) {
                this.$emit('onSelected', obj)
            }
        },
        render(h) {
            const filterBar = this.showFilter ? h('div', {'class': {'search-bar': true}}, [this.$slots.filterbar]) : null
            const list = h('el-scroll', [h('ul', [
                this.data.map(item => this.listItemRender ? this.listItemRender() : h('li', item[this.filedKey]))
            ])])
            return h('div', {
                'class': {
                    'side-filter-container': true
                }
            },[
                filterBar,
                list
            ])
        }
    }
</script>

<style scoped lang="scss">
    .side-filter-container{
        height: 100%;
        width: 240px;
        .search-bar{
            padding: 16px;
        }
        ::v-deep .el-scrollbar{
            .list-item{
                height: 44px;
                line-height: 44px;
                padding: 0 16px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
</style>