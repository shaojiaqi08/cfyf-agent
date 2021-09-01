<template>
  <el-dialog width="690px"
             :visible="show"
             :close-on-click-modal="false"
             title="家庭关系结构编辑"
             @before-close="addHandleClose"
             @close="modalClose">
    <!-- <div class="struct-title">客户名称</div>
    <div class="struct-item">
      <el-input style="width: 140px;"
                placeholder="请输入姓名"
                v-model="customerName"></el-input>
    </div> -->
    <div class="struct-title mt20">
      客户家庭关系
      <el-button type="text" size="small" @click="addNewMember">
        <i class="el-icon-plus bold"></i>
        添加家庭成员
      </el-button>
    </div>
    <div class="struct-item"
         v-for="(item, index) in members"
         :key="index">
      <el-select v-model="item.relation"
                 style="width: 120px;"
                 placeholder="家庭关系"
                 :disabled="index === 0">
        <el-option v-for="(family, idx) in familyTypes"
                    :key="`${idx}${family.value}`"
                    :value="family.value"
                    :label="family.label"
                    :disabled="family.value === 'self'">
          {{ family.label }}
        </el-option>
      </el-select>
      <div class="radio">
        <el-radio v-for="sex in sexTypes"
                  v-model="item.sex"
                  :key="sex.value"
                  :label="sex.value">
          {{ sex.label }}
        </el-radio>
      </div>
      <el-input style="width: 140px;"
                placeholder="请输入姓名"
                v-model="item.member_name"></el-input>
      <el-date-picker
        style="width: 150px;"
        v-model="item.birthday"
        type="date"
        value-format="yyyyMMdd"
        placeholder="出生日期">
      </el-date-picker>
      <div style="width: 80px;">
        {{ item.birthday && calcAge(
          `${item.birthday.substr(0, 4)}-${item.birthday.substr(4, 2)}-${item.birthday.slice(-2)}`
        ) || 0 }} 周岁
        <i class="remove iconfont iconxiao16_yuanxingchahao fs16"
           v-if="index"
           @click="deleteMember(index)"></i>
      </div>
    </div>
    <template slot="footer">
      <div style="text-align: center;">
        <el-button type="primary" @click="modalClose">取消</el-button>
        <el-button type="primary" @click="editFunc" :loading="submitting" :disabled="submitting">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { familyStructure,
         familyTypes,
         numberArray,
         sexTypes,
         proposalStatus
       } from '../config'
import calcAge from '@/utils/calc-age'
import { addCustomer, changeCustomer } from '@/apis/modules/proposal'

const member_item = {
  id: '',
  relation: '',
  sex: 1,
  member_name: '',
  birthday: ''
}
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    },
    isDeposit: Boolean,
    list: {
      type: Array
    },
    dataObj: {
      type: Object,
      required: true
    },
    proposalType: String
  },
  data() {
    return {
      date: '',
      familyTypes,
      familyStructure,
      numberArray,
      sexTypes,
      proposalStatus,
      customerName: '',
      submitting: false,
      // members: [
      //   { relation: 'self',
      //     sex: '1',
      //     member_name: '',
      //     birthday: ''
      //   }
      // ]
      members: [],
      is_delete: false, // 是否删除已经存在的，若无则只更新人员列表
      delete_ids: [], // 删除的人的id
    }
  },
  created () {
    this.delete_ids = []
    this.members = this.list.map(item => {
        return {
          id: item.id || '',
          relation: item.relation,
          sex: item.sex,
          birthday: item.birthday.toString(),
          member_name: item.member_name
        }
      }) || [member_item]
  },
  methods: {
    submit() {
      this.submitting = true
      const data = {
        customer_name: this.customerName,
        members: this.members.map(i => {
          return Object.assign({}, i, { birthday: i.birthday.replace(/-/g, '') })
        }),
        type: !this.isDeposit ? 'safeguard_proposal' : 'deposit_proposal'
      }
      addCustomer(data)
      .then(res => {
        this.modalClose()
        const routeUrl = this.$router.resolve(`/proposal/${this.isDeposit ? 'proposal-operate-deposit' : 'proposal-operate'}?customer_id=${res.id}&customer_name=${res.customer_name}`)
        window.open(routeUrl.href, '_blank')
      })
      .catch(err => console.log(err))
      .finally(() => {
        this.submitting = false
      })
    },
    checkDataPass () {
      let keys = ['relation', 'sex', 'member_name', 'birthday']
      let idx = this.members.findIndex(item => {
         return keys.findIndex(key => !item[key]) > -1
      })
      if (idx > -1) {
        return false
      } else {
        return true
      }
    },
    editFunc () {
      if (!this.checkDataPass()) {
        this.$message.error('请完整填写数据')
        return
      }
      this.editLoading = true
      let params = {
        ...this.dataObj,
        members: this.members
      }
      changeCustomer(params).then(res => {
        console.log('修改成员成功', res)
        this.editLoading = false
        this.$message.success('保存成功')
        // this.$emit('save', this.is_delete ? 'update-detail' : 'update-member')
        this.$emit('save', this.is_delete ? this.delete_ids : 'update-member')
        this.modalClose()
      }).catch(res => {
        console.log('修改成员失败', res)
        this.editLoading = false
      })
    },
    addNewMember() {
      this.members.push(member_item)
    },
    deleteMember(index) {
      if (this.members[index].id) {
        this.is_delete = true
        this.delete_ids.push(this.members[index].id)
      }
      this.members.splice(index, 1)
    },
    calcAge(val) {
      if (!val) return
      return calcAge(val)
    },
    addHandleClose(done) {
      this.members = [
        { relation: 'self', sex: '1', member_name: '', birthday: '' }
      ]
      this.customerName = ''
      done()
    },
    modalClose() {
      this.customerName = ''
      this.members = [{ relation: 'self',
        sex: '1',
        member_name: '',
        birthday: ''
      }]
      this.$emit('update:show', false)
      this.$emit('fresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.struct-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}
.struct-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #F5F5F5;
  border-radius: 4px;
  .remove {
    margin-left: 10px;
    color: red;
    cursor: pointer;
  }
  .radio {
    padding: 8px;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #DCDFE6;
    .el-radio {
      margin-right: 0 !important;
      &:first-child {
        margin-right: 16px !important;
      }
      .el-radio__label {
        padding: 0 !important;
      }
    }
  }
}
</style>
