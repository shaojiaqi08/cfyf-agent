<template>
  <el-dialog width="690px"
             :visible="show"
             :close-on-click-modal="false"
             title="新建计划书"
             @before-close="addHandleClose"
             @close="modalClose">
    <div class="struct-title">客户名称</div>
    <div class="struct-item">
      <el-input style="width: 140px;"
                placeholder="请输入姓名"
                v-model="customerName"></el-input>
    </div>
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
        value-format="yyyy-MM-dd"
        placeholder="出生日期">
      </el-date-picker>
      <div style="width: 80px;">
        {{ calcAge(item.birthday) || 0 }} 周岁
        <i class="remove iconfont iconxiao16_yuanxingchahao fs16"
           v-if="index"
           @click="deleteMember(index)"></i>
      </div>
    </div>
    <template slot="footer">
      <div style="text-align: center;">
        <el-button type="primary" @click="submit" :loading="submitting" :disabled="submitting">新建</el-button>
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
import { addCustomer } from '@/apis/modules/proposal'
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    }
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
      members: [
        { relation: 'self',
          sex: '1',
          member_name: '',
          birthday: ''
        }
      ]
    }
  },
  methods: {
    submit() {
      this.submitting = true
      const data = {
        customer_name: this.customerName,
        members: this.members.map(i => {
          return Object.assign({}, i, { birthday: i.birthday.replace(/-/g, '') })
        })
      }
      addCustomer(data)
      .then(res => {
        this.modalClose()
        const routeUrl = this.$router.resolve(`/proposal/proposal-operate?customer_id=${res.id}&customer_name=${res.customer_name}`)
        window.open(routeUrl.href, '_blank')
      })
      .catch(err => console.log(err))
      .finally(() => {
        this.submitting = false
      })
    },
    addNewMember() {
      this.members.push({
        relation: '',
        sex: '1',
        member_name: '',
        birthday: ''
      })
    },
    deleteMember(index) {
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
