<template>
    <el-dialog
            title="更换团队主管"
            :visible="visible"
            custom-class="set-leader-dialog"
            :close-on-click-modal="false"
            @close="closeDialog"
            width="480px">
        <el-form ref="form" :model="formModel" :rules="rules" label-width="100px" label-position="left">
            <div class="info-block mb20">
                <div class="flex-between mb16">
                    团队名称
                    <span>{{data.name}}</span>
                </div>
                <div class="flex-between">
                    当前团队主管
                    <span>{{(data.leader || []).map(item => item.real_name).join(',')}}</span>
                </div>
            </div>
            <el-form-item label="新团队主管" prop="leader_ids">
                <el-select multiple v-model="formModel.leader_ids" style="width: 100%">
                    <el-option v-for="(item, index) in noTeamSalesData" :key="index" :label="item.real_name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" :loading="submitting" :disabled="submitting" @click="submit">更换</el-button>
        </span>
    </el-dialog>
</template>

<script>
    /**
     *  新增团队 Dialog
     * */
    import baseValiObj from './baseValiObj'
    import {setLeader} from '@/apis/modules/user-manage'
    export default {
        name: 'set-leader-dialog',
        inject: ['$parent'],
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object
            },
            noTeamSalesData: {
                type: Array,
                default: () => []
            },
            teamId: {
                validator(v) {
                    const typeOf = typeof v
                    return ['string', 'number'].includes(typeOf)
                },
                default: ''
            }
        },
        data() {
            return {
                loading: false,
                submitting: false,
                teamSelLoading: false,
                formModel: {
                    leader_ids: []
                },
                rules: Object.freeze({
                    leader_ids: baseValiObj
                })
            }
        },
        methods: {
            submit() {
                this.$refs.form.validate(flag => {
                    if (flag) {
                        const team_id = this.teamId
                        this.submitting = true
                        setLeader({...this.formModel, team_id}).then(() => {
                            this.$parent.ajaxDetail(team_id)
                            this.$message.success('操作成功!')
                            this.closeDialog()
                        }).catch(() => {}).finally(() => {
                            this.submitting = false
                        })
                    }
                })
            },
            closeDialog() {
                this.$emit('update:visible', false)
                this.$refs.form.resetFields()
            }
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .set-leader-dialog {
        .el-dialog__body{
            overflow: visible;
        }
        .info-block{
            height:96px;
            background:rgba(245,245,245,1);
            border-radius:4px;
            border:1px solid rgba(230,230,230,1);
            padding: 20px;
            &>div{
                line-height: 20px;
                color:#4d4d4d;
                font-size: 14px;
                &>span{
                    color: #1a1a1a;
                    font-weight: bold;
                }
            }
        }
    }
</style>