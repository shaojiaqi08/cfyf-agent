<template>
    <div :class="`side-filter-container ${customClass} ${disabled ? 'side-filter-disabled' : ''}`">
        <div class="search-bar" v-if="showFilter">
            <el-input size="small"
                      prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
                      :placeholder="placeholder"
                      v-model.trim="keyword"
                      :disabled="disabled"
                      @input="updateFilter"
                      clearable></el-input>
        </div>
        <!-- 自定义搜索条件 -->
        <slot name="extraFilter"></slot>
        <el-scrollbar ref="scrollbar">
            <div v-infinite-scroll="scroll2Bottom" class="list-item-wrap">
                <div class="list-item"
                     v-for="(item, index) in filterList"
                     :key="index"
                     :class="{active: item[valueKey] === activeValue && item['channel'] === curChannel}"
                     @click="!disabled && handleSelected(item)">
                    <slot name="list" v-bind:row="item">
                        <list-item :tips-content="item[labelKey]">
                            <template>{{item[labelKey]}}</template>
                        </list-item>
                    </slot>
                </div>
                <div v-if="!filterList.length" class="empty-tips">暂无数据</div>
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
            },
            // 是否禁用
            disabled: {
                type: Boolean,
                default: false
            },
            curChannel: {
              type: String,
              default: ''
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
            },
            resetScrollbar() {
              this.$refs.scrollbar.$el.querySelector('.el-scrollbar__wrap').scrollTo(0, 0)
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

            .list-item-wrap{
                padding: 8px;
            }

            .list-item{
                position: relative;
                min-height: 44px;
                padding: 8px;
                overflow: hidden;
                cursor: pointer;
                background: #fff;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                transition: all .2s ease-in-out;
                border-radius: 4px;
                &:hover{
                    background: #e6e6e6;
                    color: #1A1A1A;
                    font-weight: 400;
                }
                &.active{
                    background:rgba(31,120,255,0.1);
                    font-weight: bold;
                    color: #1F78FF;
                }
            }
        }
        &.side-filter-disabled{}
    }
</style>
