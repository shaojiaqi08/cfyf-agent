<template>
    <div style="padding: 16px">
        <div class="tag-container">
            <p>按钮</p>
            <div style="display: flex;align-items: center">
                <el-button type="primary">主要按钮</el-button>
                <el-button type="primary" plain>次要按钮</el-button>
                <el-button icon="el-icon-search">空心按钮</el-button>
                <el-button type="ghost">幽灵按钮</el-button>
            </div>
        </div>
        <div class="tag-container">
            <p>标签</p>
            <div style="display: flex;align-items: center">
                主要标签
                <el-tag type="primary" effect="dark">主色标签<i class="el-icon-search"></i></el-tag>
                <el-tag type="danger" effect="dark">警示标签</el-tag>
                <el-tag type="info" effect="dark">提示标签</el-tag>
                <el-tag type="warning" effect="dark">安全标签</el-tag>
                <el-tag type="success" effect="dark">成功标签</el-tag>
                <el-tag type="minor" effect="dark">次要标签<i class="el-icon-search"></i></el-tag>
                <el-tag type="invert" effect="dark">反色标签<i class="el-icon-search"></i></el-tag>
            </div>
            <div style="display: flex;align-items: center">
                次要标签
                <el-tag type="primary">主色标签<i class="el-icon-search"></i></el-tag>
                <el-tag type="danger">警示标签</el-tag>
                <el-tag type="info">提示标签</el-tag>
                <el-tag type="warning">安全标签</el-tag>
                <el-tag type="success">成功标签</el-tag>
                <el-tag type="minor">次要标签<i class="el-icon-search"></i></el-tag>
                <el-tag type="invert">反色标签<i class="el-icon-search"></i></el-tag>
            </div>
            <div style="display: flex;align-items: center">
                空心标签
                <el-tag type="primary" effect="plain">主色标签<i class="el-icon-search"></i></el-tag>
                <el-tag type="danger" effect="plain">警示标签</el-tag>
                <el-tag type="info" effect="plain">提示标签</el-tag>
                <el-tag type="warning" effect="plain">安全标签</el-tag>
                <el-tag type="success" effect="plain">成功标签</el-tag>
                <el-tag type="minor" effect="plain">次要标签<i class="el-icon-search"></i></el-tag>
                <el-tag type="invert" effect="plain">反色标签<i class="el-icon-search"></i></el-tag>
            </div>
            <div class="bg-block"></div>
        </div>
        <div class="tag-container">
            <p>一级标签页</p>
            <el-tabs value="second">
                <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
                <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
            </el-tabs>
            <p>二级标签页</p>
            <el-tabs value="first" size="small">
                <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
                <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
            </el-tabs>
        </div>
        <div class="tag-container">
            <p style="margin-bottom: 10px">对话框</p>
            <el-button @click="showDialog">弹出消息对话框</el-button>
            <el-button @click="dialog2Visible=true">弹出对话框</el-button>
            <el-dialog title="批量上下架" :visible.sync="dialog2Visible" top="5vh">
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <p>这是一段信息~~~~</p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialog2Visible = false">取消</el-button>
                    <el-button type="primary" @click="dialog2Visible = false">保存</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="tag-container">
            <p>表格</p>
            <el-table :data="tableData" border stripe  max-height="768px">
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="name" label="name"></el-table-column>
                <el-table-column prop="age" label="age"></el-table-column>
                <el-table-column prop="content" label="content"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DesignSpec",
        data() {
            return {
                dialog1Visible: false,
                dialog2Visible: false,
                tableData: [
                    {id: 0,name: 'aa', age: 1, content: 'bb'},
                    {id: 1,name: 'aa1', age: 1, content: 'bb'},
                    {id: 2,name: 'aa2', age: 1, content: 'bb'},
                    {id: 3,name: 'aa3', age: 1, content: 'bb'},
                    {id: 4,name: 'aa4', age: 1, content: 'bb'},
                    {id: 5,name: 'aa5', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                    {id: 6,name: 'aa6', age: 1, content: 'bb'},
                ]
            }
        },
        methods: {
            showDialog() {
                this.$confirm('是否确认删除？删除后不可恢复。', '提示').then(() => {
                    this.dialog1Visible = false
                }).catch(() => {
                    this.dialog1Visible = false
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .tag-container{
        position: relative;
        width: 800px;
        margin: 30px 0;
        padding: 20px 0;
        border-bottom: 1px solid #ccc;
        & > p{
            font-weight: bold;
            text-align: left;
            margin: 0;
        }
        .el-tag, .el-button{
            margin: 10px;
        }
        .bg-block{
            position: absolute;
            top:20px;
            right: 70px;
            bottom: 0px;
            width: 120px;
            background: #999999;
            z-index: -1;
        }
    }
</style>