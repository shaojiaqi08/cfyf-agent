<template>
    <el-dialog
            title="转移团队"
            :visible="visible"
            custom-class="set-leader-dialog"
            :close-on-click-modal="false"
            @close="closeDialog"
            width="480px">
        <el-form ref="form" :model="formModel" :rules="rules" label-width="100px" label-position="left">
            <div class="info-block mb20" style="height: 60px">
                <div class="flex-between mb16" >
                    当前团队挂靠
                    <span>{{data.parent ? data.parent.name : '-'}}</span>
                </div>
            </div>
            <el-form-item label="挂靠团队" prop="parent_id">
                <el-select filterable style="width: 100%" placeholder="请选择在哪个团队下挂靠" v-model="formModel.parent_id">
                    <el-option v-for="(item, index) in transferTeamSelData" :key="index" :value="item.id" :label="item.name"></el-option>
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
    import baseValiObj from '../../baseValiObj'
    import {transferTeam} from '@/apis/modules/user-manage'
    export default {
        name: 'transfer-team-dialog',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object
            },
            transferTeamSelData: {
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
                    parent_id: ''
                },
                rules: Object.freeze({
                    parent_id: baseValiObj
                })
            }
        },
        methods: {
            submit() {
                this.$refs.form.validate(flag => {
                    if (flag) {
                        this.submitting = true
                        const team_id = this.teamId
                        transferTeam({team_id, ...this.formModel}).then(() => {
                            this.$emit('success', team_id)
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