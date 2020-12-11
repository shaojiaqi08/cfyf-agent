<template>
    <el-dialog :visible="visible" @close="closeDialog" width="1200px" :close-on-click-modal="false">
        <span slot="title">
            关联投保人
        </span>
        <div>
            <el-input v-model="keyword" placeholder="搜索姓名、身份证号或手机号" class="mb20"></el-input>
            <el-table :data="list" border stripe height="640px" v-loading="loading">
                <el-table-column label="姓名" align="center" prop="name"></el-table-column>
                <el-table-column label="手机号" align="center" prop="name"></el-table-column>
                <el-table-column label="身份证号" align="center" prop="name"></el-table-column>
                <el-table-column label="出生日期" align="center" prop="name"></el-table-column>
                <el-table-column label="保单数量" align="center" prop="name"></el-table-column>
                <el-table-column label="操作" align="center" prop="name" width="120px">
                    <template v-slot="{ row }">
                        <el-link type="primary" class="mr8" @click="relative(row)">关联</el-link>
                        <el-link type="primary" @click="viewPolicy(row)">查看保单</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :visible.sync="policyDialogVisible" append-to-body :show-close="false" :modal="false">
            <el-table :data="policyList" border stripe height="640px" v-loading="loading">
                <el-table-column label="被保人" align="center" prop="name" fixed="left"></el-table-column>
                <el-table-column label="投保人" align="center" prop="name"></el-table-column>
                <el-table-column label="险种类型" align="center" prop="name"></el-table-column>
                <el-table-column label="产品名称" align="center" prop="name"></el-table-column>
                <el-table-column label="缴费期间" align="center" prop="name"></el-table-column>
                <el-table-column label="年交保费" align="center" prop="name"></el-table-column>
                <el-table-column label="基本保险金额" align="center" prop="name"></el-table-column>
                <el-table-column label="保障期间" align="center" prop="name"></el-table-column>
                <el-table-column label="投保日期" align="center" prop="name"></el-table-column>
                <el-table-column label="等待期" align="center" prop="name"></el-table-column>
                <el-table-column label="受益人" align="center" prop="name"></el-table-column>
                <el-table-column label="保险公司" align="center" prop="name"></el-table-column>
                <el-table-column label="缴费银行" align="center" prop="name"></el-table-column>
                <el-table-column label="银行卡号" align="center" prop="name"></el-table-column>
                <el-table-column label="保单号" align="center" prop="name"></el-table-column>
                <el-table-column label="备注" align="center" prop="name"></el-table-column>
            </el-table>
        </el-dialog>
    </el-dialog>
</template>

<script>
    // 关联投保人
    export default {
        name: 'relative-dialog',
        props: {
            visible: Boolean,
            id: [String, Number]
        },
        data() {
            return {
                policyDialogVisible: false,
                loading: false,
                policyLoading: false,
                keyword: '',
                list: [],
                policyList: []
            }
        },
        methods: {
            getData(){},
            getPolicyData() {},
            relative() {},
            viewPolicy(id) {
                this.getPolicyData(id)
                this.policyDialogVisible = true
            },
            closeDialog() {
                this.list = []
                this.keyword = ''
                this.$emit('update:visible', false)
            }
        },
        watch: {
            visible(v) {
               v && this.getData()
            }
        }
    }
</script>

<style scoped lang="scss+">

</style>
