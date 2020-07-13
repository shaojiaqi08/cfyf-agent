<template>
    <el-dialog custom-class="rate-setting-dialog"
               v-loading="loading"
               top="4vh"
               title="设置服务费率"
               :visible.sync="visible"
               width="1094px"
               :close-on-click-modal="false"
               @close="$emit('update:visible', false)">
        <el-form ref="form" :model="formModel" :rules="rules" label-width="110px" size="small" label-position="left">
            <el-form-item label="B端公司">某某某某保险科技有限公司</el-form-item>
            <el-form-item label="保险产品">复星XXXXX重疾险</el-form-item>
            <el-form-item label="服务费类型">
                <el-radio-group :value="3">
                    <el-radio :label="1">首年</el-radio>
                    <el-radio :label="2">第2年</el-radio>
                    <el-radio :label="3">第3年</el-radio>
                    <el-radio :label="4">第3年</el-radio>
                    <el-radio :label="5">第3年</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="达成条件" class="input-number-wrap">
                <div>续保率 ≥ <el-input-number placeholder="请输入数值" :controls="false" class="mr4 ml4"></el-input-number> %</div>
            </el-form-item>
            <el-form-item label="生效日期范围">
                <el-date-picker type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="费率计算方法">
                <el-radio-group :value="3">
                    <el-radio :label="1">
                        按保障期限算
                        <el-tooltip content="费率将直接根据订单的保障期限进行计算" placement="top">
                            <i class="iconfont iconxiao16_gengduoxinxi" style="color:#ff9000"></i>
                        </el-tooltip>
                    </el-radio>
                    <el-radio :label="1">
                        按保障期限和年龄算
                        <el-tooltip content="按保障期限和年龄算" placement="top">
                            <i class="iconfont iconxiao16_gengduoxinxi" style="color:#ff9000"></i>
                        </el-tooltip>
                    </el-radio>
                    <el-radio :label="1">
                        按整单系数算
                        <el-tooltip content="费率将直接根据订单的保障期限进行计算" placement="top">
                            <i class="iconfont iconxiao16_gengduoxinxi" style="color:#ff9000"></i>
                        </el-tooltip>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <h3 style="margin-bottom: 0">服务费率</h3>
            <el-form-item label-width="0px" class="rate-wrap flex flex-wrap">
                <div class="item" v-for="(item, index) in formModel.rate" :key="index">
                    <div class="head flex-between pl16 pr16">
                        <span>
                            服务费率
                            <span class="ml16" style="cursor: pointer">
                                <i class="iconfont iconxiao16_fuzhi mr4"></i>
                                复制
                            </span>
                        </span>
                        <i class="iconfont iconxiao16_yuanxingchahao" @click="formModel.rate.splice(index, 1)"></i>
                    </div>
                    <div class="content flex-item pt20 pl16 pr16">
                        <el-form-item label="保障期限"
                                      :prop="'rate.'+ index + '.payment_period_value'"
                                      :rules="baseValiObj">
                            <el-select size="small" placeholder="请选择保障期限" v-model="item.payment_period_value"></el-select>
                        </el-form-item>
                        <el-form-item label="保障期限范围"
                                      :prop="'rate.'+ index + '.payment_period_value'"
                                      :rules="baseValiObj">
                            <el-form-item label-width="0">
                                <el-input-number></el-input-number>
                            </el-form-item> -
                            <el-form-item label-width="0">
                                <el-input-number></el-input-number>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="是否含身故"
                                      v-model="item.includeDie"
                                      :prop="'rate.'+ index + '.includeDie'"
                                      :rules="baseValiObj">
                            <el-radio size="small" label="1">是</el-radio>
                            <el-radio size="small" label="0">否</el-radio>
                        </el-form-item>
                        <el-form-item label="缴费期限"
                                      :prop="'rate.'+ index + '.guarantee_period_values'"
                                      :rules="baseValiObj">
                            <el-select size="small" v-model="item.guarantee_period_values" placeholder="请选择缴费期限" multiple></el-select>
                        </el-form-item>
                        <el-form-item label="基础服务费率"
                                      class="input-number-item"
                                      :min="0"
                                      :prop="'rate.'+ index + '.baseRate'"
                                      :rules="baseValiObj">
                            <el-input-number size="small" placeholder="请输入数值" v-model="item.baseRate" :controls="false"></el-input-number>%
                        </el-form-item>
                        <el-form-item label="额外奖励"
                                      :min="0"
                                      class="input-number-item"
                                      :prop="'rate.'+ index + '.extraRate'"
                                      :rules="baseValiObj">
                            <el-input-number size="small" placeholder="请输入数值" v-model="item.extraRate" :controls="false"></el-input-number>%
                        </el-form-item>
                    </div>
                </div>
                <div class="item add-block">
                    <el-button type="primary" plain @click="addRate"><i class="iconfont iconxiao16_jiahao mr4"></i>添加费率</el-button>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="footer">
            <el-button @click="$emit('update:visible', false)">取消</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        name: 'rate-setting-dialog',
        props: {
            visible: {
                type: Boolean,
                default: false
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
            const baseValiObj = {required: true, message: '此项不可为空'}
            return {
                baseValiObj,
                formModel: {
                    rate: [
                        {
                            payment_period_value: '',
                            guarantee_period_values: [],
                            includeDie: '',
                            baseRate: undefined,
                            extraRate: undefined,
                            payment_period_start: '',
                            payment_period_end: ''
                        },
                        {
                            payment_period_value: '',
                            guarantee_period_values: [],
                            inculudeDie: '',
                            baseRate: undefined,
                            extraRate: undefined,
                            payment_period_start: '',
                            payment_period_end: ''
                        }
                    ]
                },
                rules: {}
            }
        },
        methods: {
            addRate(obj = {}) {
                const target = this.formModel.rate
                target.push({
                    payment_period_value: '',
                    guarantee_period_values: [],
                    includeDie: '',
                    baseRate: undefined,
                    extraRate: undefined,
                    ...obj
                })
            },
            submit() {
                this.$refs.form.validate(flag => {
                    if (flag) {
                        console.log(flag)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .rate-setting-dialog{
        .input-number-wrap .el-input__inner{
            text-align: left;
        }
        .rate-wrap{
            align-items: flex-start;
            &>.el-form-item__content{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
            }
            .item {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                flex-basis: calc(33.3333333% - 11px);
                margin-top: 16px;
                min-height:336px;
                background:rgba(245,245,245,1);
                border-radius:4px;
                border:1px solid rgba(230,230,230,1);
                position: relative;
                &:nth-of-type(3n-1) {
                    margin: 16px 16px 0 16px;
                }
                .head{
                    height: 56px;
                    border-bottom: 1px solid #e6e6e6;
                    &>span{
                        font-size: 16px;
                        color:#1a1a1a;
                        font-weight: bold;
                        &>span{
                            font-size: 14px;
                            font-weight: normal;
                            color: #FF9000;
                            display: inline-flex;
                            align-items: center;
                        }
                    }
                    &>i{
                        color: #FF4C4C;
                        cursor: pointer;
                        font-size: 16px;
                    }
                }
                .content{
                    background: #ffffff;
                }
                &.add-block .el-button{
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
                .input-number-item .el-form-item__content{
                    display: flex;
                    .el-input-number{
                        flex: 1;
                        margin-right: 4px;
                        .el-input__inner{
                            text-align: left;
                        }
                    }
                }
            }
        }
        .el-dialog__footer{
            padding-top: 20px;
        }
    }
</style>