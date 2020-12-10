<template>
    <div class="container">
        <div class="header">投保人信息</div>
        <div class="content">
            <el-row type="flex" class="mb14" justify="start">
                <el-col :span="6">
                    <span>姓名<span class="ml8">xxx</span></span>
                </el-col>
                <el-col :span="6">
                    <span>手机号<span class="ml8">xxx</span></span>
                </el-col>
                <el-col :span="6">
                    <span>身份证号<span class="ml8">xxx</span></span>
                </el-col>
                <el-col :span="6">
                    <span>出生日期<span class="ml8">xxx</span></span>
                </el-col>
            </el-row>
            <el-row type="flex" class="mb30" justify="start">
                <el-col :span="6">
                    <span>出单人<span class="ml8">xxx</span></span>
                </el-col>
                <el-col :span="6">
                    <span>团队<span class="ml8">xxx</span></span>
                </el-col>
                <el-col :span="6">
                    <span>关联家庭<span class="ml8">xxx</span></span>
                </el-col>
            </el-row>
            <div class="flex-between mb16">
                <span>相关保单 <span>共66张</span></span>
                <el-button
                    type="primary"
                    icon="iconfont iconxiao16_xiazai mr4"
                    class="mr16"
                    size="small">导出数据</el-button>
            </div>
            <el-table :data="list" border stripe height="calc(100% - 120px)">
                <el-table-column label="被保人" align="center" fixed="left"></el-table-column>
                <el-table-column label="投保人" align="center"></el-table-column>
                <el-table-column label="险种类型" align="center"></el-table-column>
                <el-table-column label="产品名称" align="center"></el-table-column>
                <el-table-column label="缴费期间" align="center"></el-table-column>
                <el-table-column label="年缴保费" align="center"></el-table-column>
                <el-table-column label="基本保险金额" align="center"></el-table-column>
                <el-table-column label="保障期间" align="center"></el-table-column>
                <el-table-column label="投保日期" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'customer-detail',
        data() {
            return {
                detail: {},
                list: []
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        color: #1A1A1A;
        background-color: #fff;
        width: 1200px;
        margin: auto;
        height: calc(100vh - 76px);
        display: flex;
        flex-direction: column;
        .header {
            height: 56px;
            font-size: 16px;
            border-bottom: 1px solid #e6e6e6;
            background-color: #f5f5f5;
            padding: 0 16px;
            line-height: 56px;
        }
        .content {
            overflow: hidden;
            flex: 1;
            padding: 16px;
        }
    }
</style>
