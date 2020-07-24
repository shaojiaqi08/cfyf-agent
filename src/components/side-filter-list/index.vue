<template>
    <div :class="`side-filter-container ${customClass}`">
        <div class="search-bar" v-if="showFilter">
            <el-input size="small"
                      prefix-icon="el-icon-search"
                      :placeholder="placeholder"
                      v-model.trim="keyword"
                      @input="updateFilter"
                      clearable></el-input>
        </div>
        <!-- 自定义搜索条件 -->
        <slot name="extraFilter"></slot>
        <el-scrollbar>
            <div v-infinite-scroll="scroll2Bottom">
                <div class="list-item"
                     v-for="(item, index) in filterList"
                     :key="index"
                     :class="{active: item[valueKey] === activeValue}"
                     @click="handleSelected(item)">
                    <slot name="list" v-bind:row="item">
                        <list-item :tips-content="item[labelKey]">
                            <template>{{item[labelKey]}}</template>
                        </list-item>
                    </slot>
                </div>
                <div v-if="!filterList.length" style="text-align: center; line-height: 44px; color:#999">暂无数据</div>
            </div>
        </el-scrollbar>
        <slot name="footer"></slot>
    </div>
</template>
<script>
    /**
     *  侧边列表筛选器
     * */
    import ListItem from './side-filter-list-item'
    export default {
        name: 'side-filter-list',
        components: { ListItem },
        model: {
            prop: 'activeValue',
            event: 'update:activeValue'
        },
        props: {
            customClass: {
                type: String,
                default: ''
            },
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
            }
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
            },
            updateFilter(v) {
                this.$emit('updateFilter', v)
            },
            scroll2Bottom () {
                this.$emit('scrollToBottom')
            }
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
            flex: 1;
            .el-scrollbar__wrap{
                overflow-x: hidden;
            }
            .list-item{
                position: relative;
                min-height: 44px;
                padding: 8px 16px;
                overflow: hidden;
                cursor: pointer;
                background: #fff;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                border-top: 1px solid #fff;
                border-bottom: 1px solid #fff;
                transition: all .2s ease-in;
                &.active, &:hover{
                    border-top: 1px solid #e6e6e6;
                    border-bottom: 1px solid #e6e6e6;
                }
                &.active{
                    background: #f5f5f5;
                    font-weight: bold;
                }
                &:hover{
                    background: #e6e6e6;
                }
            }
        }
    }
</style>