<template>
    <el-dialog title="调整团队成员"
               width="620px"
               :close-on-click-modal="false"
               :destroy-on-close = "true"
               @close="close"
               :visible="visible">
        <div class="content flex-between" v-loading="loading">
            <div class="left">
                <div class="header">
                    当前团队成员
                    <span>{{curDataCount}}</span>
                </div>
                <div class="body">
                    <div class="search-wrap pr16">
                        <el-input prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon" placeholder="搜索姓名或者账号" v-model.trim="curKeyword" clearable></el-input>
                    </div>
                    <el-scrollbar>
                        <el-checkbox-group v-model="curSelected">
                            <template  v-for="(parent, lv) in filterCurData">
                                <div class="checkbox-item mb16" v-if="parent.sales.length" :key="lv">
                                    <span class="fs14 lh20 mb16">{{lv}}</span>
                                    <div class="flex-between mb16 pr16" v-for="(item, index) in parent.sales" :key="index">
                                        <el-checkbox :label="item.id">{{item.real_name}}</el-checkbox>
                                        <div class="fs14  flex-center">
                                            {{parent.name}}
                                            <el-link type="danger" class="ml8" :underline="false">
                                                <i class="iconfont iconxiao16_yuanxingjianhao" @click="del(item, lv, index)"></i>
                                            </el-link>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-checkbox-group>
                    </el-scrollbar>
                </div>
                <div class="footer">
                    <div class="flex-center">
                        <el-checkbox :disabled="!curDataCount" :value="curIsCheckAll" @change="curCheckAll">全选<span class="ml8" style="color:#999">{{curDataSelCount}}</span></el-checkbox>
                    </div>
                    <el-link :disabled="!curDataSelCount" type="danger" :underline="false" @click="batchDel">批量删除</el-link>
                </div>
            </div>
            <div class="right">
                <div class="header">
                    全部可选成员
                    <span>{{allDataCount}}</span>
                </div>
                <div class="body">
                    <div class="search-wrap pr16">
                        <el-input prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon" placeholder="搜索姓名或者账号" v-model.trim="allKeyword" clearable></el-input>
                    </div>
                    <el-scrollbar>
                        <el-checkbox-group v-model="allSelected">
                            <template v-for="(parent, lv) in filterAllData">
                                <div class="checkbox-item mb16" v-if="parent.sales.length" :key="lv">
                                    <span class="fs14 lh20 mb16">{{lv}}</span>
                                    <div class="flex-between mb16 pr16" v-for="(item, index) in parent.sales" :key="index">
                                        <el-checkbox :label="item.id">{{item.real_name}}</el-checkbox>
                                        <div class="fs14  flex-center">
                                            {{parent.name}}
                                            <el-link type="primary" class="ml8" :underline="false">
                                                <i class="iconfont iconxiao16_yuanxingjiahao" @click="join(parent, item, lv)"></i>
                                            </el-link>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-checkbox-group>
                    </el-scrollbar>
                </div>
                <div class="footer">
                    <div class="flex-center">
                        <el-checkbox :disabled="!allDataCount" :value="allIsCheckAll" @change="allCheckAll">全选<span class="ml8" style="color:#999">{{allDataSelCount}}</span></el-checkbox>
                    </div>
                    <el-link :disabled="!allDataSelCount" type="primary" :underline="false" @click="batchJoin">批量加入</el-link>
                </div>
            </div>
        </div>
        <span slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitting" :disabled="submitting">确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
    /**
     *  调整团队成员组件
     * */
    export default {
        name: 'team-people-dialog',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: () => {}
            },
            // 已选择数据id
            selected: {
                type: Array,
                default: () => []
            },
            loading: {
                type: Boolean,
                default: false
            },
            submitting: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                curData: {},
                curSelected: [],
                curKeyword: '',
                allData: {},
                allSelected: [],
                allKeyword: ''
            }
        },
        computed: {
            filterCurData() {
                return this.filterData(this.curKeyword, false)
            },
            filterAllData() {
                return this.filterData(this.allKeyword, true)
            },
            curIsCheckAll() {
                const {filterCurData, curSelected} = this
                const smooth = []
                Object.keys(filterCurData).forEach(key => {
                    smooth.push(...filterCurData[key].sales.map(item => item.id))
                })
                return curSelected.length > 0 && smooth.length === curSelected.filter(i => smooth.includes(i)).length
            },
            curDataCount() {
                const d = this.filterCurData
                return Object.keys(d).reduce((prev, key) => {
                    return prev + d[key].sales.length
                }, 0)
            },
            curDataSelCount() {
                const {filterCurData, curSelected} = this
                return Object.keys(filterCurData).reduce((prev, key) => {
                    return prev + filterCurData[key].sales.filter(i => curSelected.includes(i.id)).length
                }, 0)
            },
            // 所有已选择数据id, 用于过滤全部数据
            curDataSmooth() {
                const d = this.curData
                const res = []
                Object.keys(d).forEach(key => {
                    res.push(...d[key].sales.map(item => item.id))
                })
                return res
            },
            allIsCheckAll() {
                const {filterAllData, allSelected} = this
                const smooth = []
                Object.keys(filterAllData).forEach(key => {
                    smooth.push(...filterAllData[key].sales.map(item => item.id))
                })
                return allSelected.length > 0 && smooth.length === allSelected.filter(i => smooth.includes(i)).length
            },
            allDataCount() {
                const d = this.filterAllData
                return Object.keys(d).reduce((prev, key) => {
                    return prev + d[key].sales.length
                }, 0)
            },
            allDataSelCount() {
                const {filterAllData, allSelected} = this
                return Object.keys(filterAllData).reduce((prev, key) => {
                    return prev + filterAllData[key].sales.filter(i => allSelected.includes(i.id)).length
                }, 0)
            }
        },
        methods: {
            submit() {
                this.$emit('submit', this.curData)
            },
            close() {
                this.curData = {}
                this.allData = {}
                this.curKeyword = ''
                this.allKeyword = ''
                this.curSelected = []
                this.allSelected = []
                this.$emit('update:visible', false)
            },
            curCheckAll(v) {
                const allIds = v ? [] : [...this.curSelected]
                const d = this.filterCurData
                Object.keys(d).forEach(key => {
                    const salesIds = d[key].sales.map(i => i.id)
                    if (v) {
                        allIds.push(...salesIds)
                    } else {
                        salesIds.forEach(id => {
                            const idx = allIds.findIndex(i => id === i)
                            if (~idx) {
                                allIds.splice(idx, 1)
                            }
                        })
                    }
                })
                this.curSelected = allIds
            },
            allCheckAll(v) {
                const allIds = v ? [] : [...this.allSelected]
                const d = this.filterAllData
                Object.keys(d).forEach(key => {
                    const salesIds = d[key].sales.map(i => i.id)
                    if (v) {
                        allIds.push(...salesIds)
                    } else {
                        salesIds.forEach(id => {
                            const idx = allIds.findIndex(i => id === i)
                            if (~idx) {
                                allIds.splice(idx, 1)
                            }
                        })
                    }
                })
                this.allSelected = allIds
            },
            del(obj, key, idx) {
                const {curData: data, curSelected: selected} = this
                const selIdx = selected.findIndex(item => item === obj.id)
                if (~selIdx) {
                    selected.splice(selIdx, 1)
                }
                data[key].sales.splice(idx, 1)
            },
            // 批量删除
            batchDel() {
                const {filterCurData: data, curSelected: selected, curData} = this
                Object.keys(data).forEach(key => {
                    const cur = curData[key]
                    this.$set(cur, 'sales', cur.sales.filter(item => {
                        const idx = selected.findIndex(i => i === item.id)
                        if (~idx) {
                            selected.splice(idx, 1)
                        }
                        return !(~idx)
                    }))
                })
            },
            join(parent, obj, key) {
                const {curData: data, allSelected: selected} = this
                const cur = data[key]
                if (cur) {
                    cur.sales.push(obj)
                } else {
                    this.$set(this.curData, key, {
                        ...parent,
                        sales: [obj]
                    })
                }
                const idx = selected.findIndex(i => i === obj.id)
                if (~idx) {
                    selected.splice(idx, 1)
                }
            },
            // 批量加入
            batchJoin() {
                const {filterAllData: data, allSelected: selected, curData} = this
                Object.keys(data).forEach(key => {
                    const cur = data[key]
                    const filter = cur.sales.filter(item => {
                        const idx = selected.findIndex(i => i === item.id)
                        if (~idx) {
                            selected.splice(idx, 1)
                        }
                        return ~idx
                    })
                    if (filter.length) {
                        if (curData[key]) {
                            curData[key].sales.push(...filter)
                        } else {
                            this.$set(curData, key, {
                                ...cur,
                                sales: [...filter]
                            })
                        }
                    }
                })
            },
            filterData(value, isAll) {
                const d = isAll ? this.allData : this.curData
                const res = {}
                Object.keys(d).forEach(key => {
                    const filter = d[key].sales.filter(item => (item.real_name.includes(value) || item.username.includes(value)) && (isAll ? !this.curDataSmooth.includes(item.id) : true))
                    if (filter.length) {
                        res[key] = {
                            ...d[key],
                            sales: filter
                        }
                    }
                })
                return res
            },
            initData() {
                if (!this.selected.length) return
                const {curData, allData} = this
                Object.keys(allData).forEach(key => {
                    const cur = allData[key]
                    const filter = cur.sales.filter(item => this.selected.includes(item.id))
                    if (filter.length) {
                        if (curData[key]) {
                            curData.sales.push(...filter)
                        } else {
                            this.$set(curData, key, {
                                ...cur,
                                sales: [...filter]
                            })
                        }
                    }
                })
            }
        },
        watch: {
            data() {
                this.allData = this.data
                this.initData()
            }
        }
    }
</script>

<style scoped lang="scss">
    .content {
        padding-bottom: 20px;
        & > div {
            width: 280px;
            height: 500px;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            .header, .footer {
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
            }
            .header > span {
                color: #999;
            }
            .body{
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 0 0  0 16px;
                border-top: 1px solid #e6e6e6;
                border-bottom: 1px solid #e6e6e6;
                overflow: hidden;
                .search-wrap{
                    height: 64px;
                    line-height: 64px;
                }
                ::v-deep .el-scrollbar{
                    flex: 1;
                    .checkbox-item{
                        color: #999;
                        & > span {
                            display: block;

                        }
                    }
                }
            }
            &.left {
                .header, .body{
                    background: #f5f5f5;
                }
            }
            &.right {
                .header {
                    background: #f5f5f5;
                }
            }
        }
    }
</style>