<template>
  <el-dialog
      top="5vh"
      custom-class="belong-dialog"
      title="修改归属"
      width="480px"
      :close-on-click-modal="false"
      :visible="show"
      @close="close">
      <div class="card">
        <el-row type="flex" justify="space-between">
          <el-col :span="15">{{ belongData.product_name }}</el-col>
          <el-col :span="9">
            <el-tag type="minor" v-if="belongData.proposal_at">投保日期：{{ formatDate(belongData.proposal_at * 1000, 'yyyy-MM-dd') }}</el-tag>
          </el-col>
        </el-row>
        <el-row class="table">
          <el-col :span="6">
            投保人
            <span>{{ belongData.policy_holder_name }}</span>
          </el-col>
          <el-col :span="6">
            被保人
            <span>{{ belongData.policy_recognizee_name }}</span>
          </el-col>
          <el-col :span="6">
            保额
            <span>{{ belongData.guarantee_quota_str }}</span>
          </el-col>
          <el-col :span="6">
            保费
            <span>{{ belongData.premium }}元</span>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">
            投保单号
            <span>{{ belongData.proposal_sn }}</span>
          </el-col>
          <el-col :span="12">
            保单号
            <span>{{ belongData.policy_sn }}</span>
          </el-col>
        </el-row>
      </div>
      <el-form label-width="70px">
        <el-form-item label="归属成员">
          <el-select placeholder="请选择此订单归属的成员"
                     v-model="formdata.member">
            <el-option v-for="item in salesList"
                       :key="item.id"
                       :value="item.id"
                       :label="item.real_name">{{ item.real_name }}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { formatDate } from '@/utils/formatTime'
import { getManagementSalesList, setPolicyTransfer } from '@/apis/modules/achievement'
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    },
    belongData: {
      required: true,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      formatDate,
      companyList: [],
      salesList: [],
      formdata: {
        company: '',
        member: ''
      }
    }
  },
  watch: {
    show(v) {
      if (v) {
        this.getManagementSalesList()
        this.$nextTick(() => {
          this.formdata.company = this.belongData.sales_company_id || ''
          this.formdata.member = this.belongData.sales_id || ''
        })
      }
    }
  },
  methods: {
    submit() {
      const data = {
        policy_id: this.belongData.id,
        company_id: this.formdata.company,
        sales_id: this.formdata.member
      }
      setPolicyTransfer(data).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.$emit('update')
        this.close()
      })
    },
    getManagementSalesList() {
      getManagementSalesList().then(res => {
        this.salesList = res
      })
    },
    close() {
      this.$emit('update:show', false)
    }
  }
}
</script>