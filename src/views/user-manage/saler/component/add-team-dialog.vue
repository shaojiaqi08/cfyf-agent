<template>
    <el-dialog
            title="新增团队"
            :visible="visible"
            :close-on-click-modal="false"
            @close="closeDialog"
            custom-class="add-team-dialog"
            width="480px">
        <el-form ref="form" :model="formModel" :rules="rules" label-width="100px" label-position="left">
            <el-form-item label="挂靠团队" prop="parent_id">
                <el-select v-model="formModel.parent_id" style="width: 100%" clearable>
                    <el-option v-for="(item, index) in teamData" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="团队主管" prop="leader_ids">
                <el-select multiple v-model="formModel.leader_ids" style="width: 100%">
                    <el-option placeholder="请选择团队主管" v-for="(item, index) in noTeamSalesData" :key="index" :label="item.real_name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="团队名称" prop="name">
                <el-input placeholder="请输入团队名称" v-model="formModel.name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" :loading="submitting" :disabled="submitting" @click="submit">确认</el-button>
            </span>
    </el-dialog>
</template>

<script>
    /**
     *  新增团队 Dialog
     * */
    import baseValiObj from '../../baseValiObj'
    import {createTeam} from '@/apis/modules/user-manage'
    export default {
        name: 'add-team-dialog',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                default: ''
            },
            noTeamSalesData: {
                type: Array,
                default: () => []
            },
            teamData: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                loading: false,
                submitting: false,
                teamSelLoading: false,
                formModel: {
                    parent_id: '',
                    leader_ids: [],
                    name: ''
                },
                rules: Object.freeze({
                    leader_ids: baseValiObj,
                    name: baseValiObj
                })
            }
        },
        methods: {
            submit() {
                this.$refs.form.validate(flag => {
                    if (flag) {
                        this.submitting = true
                        createTeam(this.formModel).then(() => {
                            this.$emit('success')
                            this.$message.success('新增成功!')
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
    ::v-deep .add-team-dialog .el-dialog__body{
        overflow: visible;
    }
</style>