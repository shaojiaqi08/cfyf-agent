<template>
  <el-dialog width="480px"
             :visible="show"
             :close-on-click-modal="false"
             title="新建自定义产品"
             append-to-body
             @close="modalClose">
    <div class="auto-scroll">
      <el-form inline
              :rules="rules"
              label-width="80px"
              label-position="left"
              ref="ruleForm"
              :model="formdata">
        <el-form-item label="产品名称" prop="proposal_product_name">
          <el-input ref="prodInput" class="form-input" v-model="formdata.proposal_product_name"></el-input>
        </el-form-item>
        <el-form-item label="保险公司" prop="supplier_id">
          <el-select class="form-input" v-model="formdata.supplier_id" filterable>
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button @click="modalClose">取消</el-button>
        <el-button type="primary" @click="submit">添加</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  getSupplierList,
} from '@/apis/modules/proposal'
import {
  guaranteeTimeTypes,
  paytimeTypes,
  baseTypes
} from '../config'

export default {
  props: {
    show: {
      required: true,
      type: Boolean
    },
    title: {
      type: String
    },
    type: {
      type: String
    },
    diyData: {
      type: Object
    }
  },
  data() {
    return {
      rules: {
        proposal_product_name: [{
          required: true, message: '请填写产品名称', trigger: 'change'
        }],
        supplier_id: [{
          required: true, message: '请填写公司名称', trigger: 'change'
        }]
      },
      supplierList: [],
      companyList: [],
      guaranteeTimeTypes,
      paytimeTypes,
      baseTypes,
      formdata: {
        proposal_product_name: '',
        supplier_id: ''
      }
    }
  },
  watch: {
    show(v) {
      if (!v) {
        this.$refs.ruleForm.resetFields()
      } else {
        this.$nextTick(() => this.$refs.prodInput.focus())
      }
    }
  },
  mounted() {
    this.initForm()
    getSupplierList().then(res => {
      this.supplierList = res
    })
  },
  methods: {
    initForm() {
      this.formdata.guarantee_period = guaranteeTimeTypes
      this.formdata.pay_period = paytimeTypes
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const { proposal_product_name, supplier_id, guarantee_period, pay_period } = this.formdata
          this.$emit('diyProductSubmit', {
            proposal_product_name,
            supplier_id,
            guarantee_period,
            pay_period,
            is_support_reduction: true,
            source: 'manually_enter'
          }, this.supplierList.find(i => i.id === supplier_id).name, true)
          this.modalClose()
        } else {
          return false
        }
      })
    },
    dataReset() {
      this.formdata.proposal_product_name = ''
      this.formdata.supplier_id = ''
    },
    modalClose() {
      this.dataReset()
      this.$nextTick(() => this.$emit('update:show', false))
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-right: 0 !important;
}
.form-select {
  width: 348px !important;
}
.form-small-select {
  width: 80px !important;
}
.form-input {
  width: 348px !important;
}
.form-medium-input {
  margin-right: 8px;
  width: 260px;
}
.material-item {
  margin-bottom: 8px;
  background-color: #F5F5F5;
  border-radius: 4px;
  .title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
  .tip {
    font-size: 14px;
    color: #808080;
    line-height: 22px;
  }
  .qrcode {
    width: 128px;
    height: 128px;
  }
}
</style>
