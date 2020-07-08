<template>
    <el-scrollbar class="company-container">
        <div class="content">
            <div class="title">新增B端公司<span>第一步：填写公司资料</span></div>
            <el-form label-width="100">
                <div class="card">
                    <div class="header">企业信息</div>
                    <el-form-item class="item" label="主体类型">
                        <el-select value="0"></el-select>
                    </el-form-item>
                    <el-form-item class="item" label="渠道">
                        <el-select value="0"></el-select>
                    </el-form-item>
                    <el-form-item class="item" label="企业名称">
                        <el-input value="0"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="营业执照">
                        <el-input value="0"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="服务费发票类型">
                        <el-select value="0"></el-select>
                    </el-form-item>
                    <el-form-item class="item" label="发票税点">
                        <el-input value="0"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="所属城市">
                        <el-input value="0"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="详细地址">
                        <el-input value="0"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="固定电话">
                        <el-input value="0"></el-input>
                    </el-form-item>
                </div>
                <div class="card">
                    <div class="header">财务信息</div>
                    <el-form-item class="item" label="账户类型">
                        <el-select value="0"></el-select>
                    </el-form-item>
                    <el-form-item class="item" label="户名">
                        <el-select value="0"></el-select>
                    </el-form-item>
                    <el-form-item class="item" label="开户地址">
                        <el-input value="0"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="开户银行">
                        <el-input value="0"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="银行卡号">
                        <el-select value="0"></el-select>
                    </el-form-item>
                    <el-button type="primary" style="width:100%">下一步</el-button>
                </div>
            </el-form>

        </div>
    </el-scrollbar>
</template>

<script>
    export default {
        name: "company-edit"
    }
</script>

<style scoped lang="scss">
    .company-container{
        width: 100%;
        height: calc(100vh - 39px);
        .content{
            width: 480px;
            margin: 16px auto;
            .title{
                padding: 0 16px;
                display: flex;
                height:60px;
                justify-content: space-between;
                align-items: center;
                background:rgba(245,245,245,1);
                border-radius:4px;
                border:1px solid rgba(230,230,230,1);
                font-size: 18px;
                &>span{
                    color:#4d4d4d;
                    font-size: 12px;
                }
            }
            .card{
                overflow: hidden;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                margin: 16px auto 0 auto;
                background: #fff;
                .header{
                    background-color: #f5f5f5;
                    padding: 0 16px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #e6e6e6;
                }
                .item{
                    margin-bottom: 20px;
                    font-size: 14px;
                    color:#4d4d4d;
                    padding: 0 16px;
                    white-space: nowrap;
                    &>span{
                        color:#1A1A1A;
                        font-weight: bold;
                        flex: 1;
                        display: inline-block;
                        text-align: right;
                        padding-left: 16px;
                    }
                }
            }
        }
    }
</style>