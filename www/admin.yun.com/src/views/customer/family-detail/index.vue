<template>
    <div class="container">
        <div class="header">
            <div>
                <p>张先生的家庭</p>
                <span>这里是备注内容，创建家庭时输入，最多100个汉字，超长换行。</span>
            </div>
            <el-button icon="iconfont iconxiao16_bianji mr4"
                       type="primary"
                       size="small"
                       class="ml16"
                       v-if="$checkAuth('/edit_brand_info')">编辑家庭</el-button>
        </div>
        <div class="content">
            <div class="table-head">
                <span>投保人</span>
                <el-button type="primary" size="small" icon="iconfont iconxiao16_guanlian mr4">关联投保人</el-button>
            </div>
            <el-table border table-head class="mb24" max-height="600px" style="width: 100%">
                <el-table-column label="姓名" align="center"></el-table-column>
                <el-table-column label="手机号" align="center"></el-table-column>
                <el-table-column label="身份证号" align="center" width="310px"></el-table-column>
                <el-table-column label="出生日期" align="center"></el-table-column>
                <el-table-column label="保单数量" align="center"></el-table-column>
                <el-table-column label="操作" align="center"></el-table-column>
            </el-table>
            <div class="table-head">
                <span>相关保单<span>共66单</span></span>
                <el-button type="primary" size="small" icon="iconfont iconxiao16_xiazai mr4">导出表格</el-button>
            </div>
            <el-table border stripe class="mb24" max-height="600px" style="width: 100%">
                <el-table-column label="被保人" align="center" fixed="left"></el-table-column>
                <el-table-column label="投保人" align="center"></el-table-column>
                <el-table-column label="险种类型" align="center"></el-table-column>
                <el-table-column label="产品名称" align="center" width="200px"></el-table-column>
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
        name: 'family-detail',
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
        display: flex;
        flex-direction: column;
        .header {
            height: 84px;
            font-size: 16px;
            border-bottom: 1px solid #e6e6e6;
            background-color: #f5f5f5;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            p {
                margin: 0 0 8px 0;
                font-size: 16px;
                color: #1A1A1A;
                font-weight: bold;
                & + span {
                    color: #999;
                    font-size: 14px;
                }
            }
        }
        .content {
            overflow: hidden;
            flex: 1;
            padding: 16px;
            .table-head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                & > span {
                    font-size: 16px;
                    span {
                        color: #999;
                        font-size: 14px;
                        margin-left: 8px;
                    }
                }
            }
        }
    }
</style>
