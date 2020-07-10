<template>
    <div :class="`side-filter-container ${customClass}`">
        <div class="search-bar" v-if="showFilter">
            <el-input size="small" prefix-icon="el-icon-search" :placeholder="placeholder" v-model.trim="keyword"></el-input>
            <!-- 自定义搜索条件 -->
            <slot name="extraFilter"></slot>
        </div>
        <el-scrollbar>
            <div class="list-item"
                 v-for="(item, index) in filterList"
                 :key="index"
                 :class="{active: item[valueKey] === activeValue}"
                 @click="handleSelected(item)">
                <slot name="list" v-bind:row="item">
                    <el-tooltip placement="top" :content="item[labelKey]">
                        <span>{{item[labelKey]}}</span>
                    </el-tooltip>
                </slot>
            </div>
        </el-scrollbar>
    </div>
</template>
<script>
    export default {
        name: 'side-filter-list',
        model: {
            prop: 'activeValue',
            event: 'update:activeValue'
        },
        props: {
            customClass: String,
            activeValue: null,
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
                default: 'label'
            },
            valueKey: {
                type: String,
                valueKey: 'value'
            },
            listData: {
                type: Array,
                default: () => []
            },
            listItemRender: Function
        },
        data() {
            return {
                keyword: '',
                selIdx: 0
            }
        },
        computed: {
            filterList() {
                const {keyword, listData, labelKey} = this
                return listData.filter(item => item[labelKey].includes(keyword))
            }
        },
        methods: {
            handleSelected(obj) {
                this.$emit('update:activeValue', obj[this.valueKey])
                this.$emit('change', obj)
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
        display: flex;
        flex-direction: column;
        .search-bar{
            padding: 16px;
        }
        ::v-deep .el-scrollbar{
            flex: auto;
            .el-scrollbar__wrap{
                overflow-x: hidden;
            }
            .list-item{
                min-height: 44px;
                padding: 8px 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
                background: #fff;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                border-top: 1px solid #fff;
                border-bottom: 1px solid #fff;
                &.active, &:hover{
                    border-top: 1px solid #e6e6e6;
                    border-bottom: 1px solid #e6e6e6;
                }
                &.active{
                    background: #f5f5f5;
                }
                &:hover{
                    background: #e6e6e6;
                }
            }
        }
    }
</style>