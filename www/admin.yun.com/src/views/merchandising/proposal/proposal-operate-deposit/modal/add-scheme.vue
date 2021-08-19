<template>
  <el-dialog width="400px"
             :visible="show"
             :close-on-click-modal="false"
             title="新建方案"
             @close="modalClose">
    <el-form label-position="top">
      <el-form-item label="被保人">
        <el-select class="block"
                   v-model="relationModel.recognizee_policy_member.id"
                   placeholder="请选择被保人">
          <el-option v-for="item in relations"
                     :disabled="relationsSelected.filter(i => i.recognizee_policy_member.struct_member_id === item.struct_member_id).length > 0"
                     :key="item.id"
                     :value="item.id"
                     :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投保人">
        <el-select class="block"
                   v-model="relationModel.policy_holder_member.id"
                   placeholder="请选择投保人">
          <el-option v-for="item in relations"
                     :key="item.id"
                     :value="item.id"
                     :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="被保人姓名">
        <el-input placeholder="请输入被保人姓名"
                  v-model="relationModel.name"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <div>
        <el-button @click="modalClose">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    },
    relations: {
      required: true,
      type: Array
    },
    relationsSelected: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      relationModel: {
        recognizee_policy_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        policy_holder_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        name: ''
      }
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:show', false)
      this.relationModel = {
        recognizee_policy_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        policy_holder_member: {
          id: null,
          name: '',
          relation: '',
          sex: '',
          birthday: ''
        },
        name: ''
      }
    },
    submit() {
      if (!this.relationModel.policy_holder_member.id || !this.relationModel.recognizee_policy_member.id) {
        return this.$message({
          message: '请选择投保人以及被保人关系',
          type: 'warning'
        })
      }
      this.relationModel.recognizee_policy_member = this.relations.filter(i => i.id === this.relationModel.recognizee_policy_member.id)[0]
      this.relationModel.policy_holder_member = this.relations.filter(i => i.id === this.relationModel.policy_holder_member.id)[0]
      this.relationsSelected.push(this.relationModel)
      this.$emit('addSchemeResponse')
      this.modalClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin: 0 0 10px 0 !important;
}
/deep/ .el-form--label-top .el-form-item__label {
  padding-bottom: 0 !important;
}
</style>
