<template>
    <div class="order-detail-container">
        <div class="header">订单详情</div>
        <div class="content">
            <h4>产品信息</h4>
            <div class="row">
                <div>出单平台<span>同方保险公司</span></div>
                <div>公司名<span>同方保险公司</span></div>
                <div>产品名称<span>同方全球「臻爱」优选定期寿险</span></div>
            </div>
            <h4>保单信息</h4>
            <div class="row">
                <div>保单号<span>-</span></div>
                <div>投保单号<span>e002130244</span></div>
                <div>缴费期限<span>20年</span></div>
                <div>保障期限<span>20年</span></div>
                <!-------------------------------->
                <div>保费(元)<span>358.00</span></div>
                <div>保单状态<span>20年</span></div>
                <div>支付状态<span>e002130244</span></div>
                <div>客户确认状态<span>20年</span></div>
                <!-------------------------------->
                <div>投保时间<span>358.00</span></div>
                <div>承保时间<span>20年</span></div>
                <div>承保时间<span>e002130244</span></div>
                <div>回访成功日期<span>20年</span></div>
                <!-------------------------------->
                <div>过犹日期<span>358.00</span></div>
                <div>投保单号<span>20年</span></div>
                <div>缴费期限<span>e002130244</span></div>
                <div>保障期限<span>20年</span></div>
            </div>
            <h4>被保人信息</h4>
            <div class="row">
                <div>投保人<span>-</span></div>
                <div>投保人手机号<span>e002130244</span></div>
                <div>被保人<span>20年</span></div>
                <div>被保人手机号<span>20年</span></div>
            </div>
            <h4>销售信息</h4>
            <div class="row">
                <div>出单销售<span>-</span></div>
                <div>销售团队<span>e002130244</span></div>
                <div>服务费<span>20年</span></div>
                <div>佣金<span>20年</span></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'order-detail',
        data() {
            return {
                data: {}
            }
        },
        methods: {
            ajaxDetail() {
                const {id} = this.$route.params
                if (id == undefined) return
            }
        },
        created() {
            this.ajaxDetail()
        }
    }
</script>

<style scoped lang="scss">
    .order-detail-container{
        background-color: #fff;
        width: 1200px;
        margin: 20px auto;
        border: 1px solid #E6E6E6;
        .header {
            font-size: 16px;
            font-weight: bold;
            padding: 0 16px;
            height: 56px;
            line-height: 56px;
            background: #F5F5F5;
            border-radius: 4px 4px 0px 0px;
            border-bottom: 1px solid #E6E6E6;
        }
        .content{
            padding: 16px;
            h4{
                color:#1A1A1A;
                line-height: 24px;
                margin: 0 0 8px 0;
            }
            .row{
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 24px;
                &>div{
                    width: 25%;
                    font-size: 14px;
                    color: #4d4d4d;
                    margin-bottom: 12px;
                    line-height: 20px;
                    &>span{
                        color:#1A1A1A;
                        margin-left: 8px;
                        font-weight:bold;
                    }
                }
            }
        }
    }
</style>