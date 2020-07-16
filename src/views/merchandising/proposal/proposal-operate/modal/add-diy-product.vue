<template>
  <el-dialog width="480px"
             :visible="show"
             :close-on-click-modal="false"
             :title="title"
             @close="modalClose">
    <div class="auto-scroll">
      <el-form inline
              :rules="rules"
              label-width="80px"
              label-position="left"
              ref="ruleForm"
              :model="formdata">
        <el-form-item label="险种类型" prop="source_category_id">
          <el-select class="form-select" v-model="formdata.source_category_id">
            <el-option v-for="item in categoryList"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
              {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="product_name">
          <el-input class="form-input" v-model="formdata.product_name"></el-input>
        </el-form-item>
        <el-form-item label="保额" prop="guarantee_quota_value">
          <el-input class="form-medium-input"
                    placeholder="请输入保额"
                    type="number"
                    v-model="formdata.guarantee_quota_value"></el-input>
          <el-select class="form-small-select"
                     v-model="formdata.guarantee_quota_unit"
                     placeholder="单位">
            <el-option v-for="item in baseTypes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">{{ item.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费期限" prop="pay_period_value">
          <el-input class="form-medium-input"
                    type="number"
                    :disabled="formdata.pay_period_unit == 5"
                    v-model="formdata.pay_period_value"
                    placeholder="请输入缴费期限"></el-input>
          <el-select class="form-small-select"
                     v-model="formdata.pay_period_unit"
                     placeholder="单位"
                     @change="payPeriodChange">
            <el-option v-for="item in paytimeTypes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">{{ item.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保障期限" prop="guarantee_period_value">
          <el-input class="form-medium-input"
                    type="number"
                    :disabled="formdata.guarantee_period_unit == 6"
                    v-model="formdata.guarantee_period_value"
                    placeholder="请输入保障期限"></el-input>
          <el-select class="form-small-select"
                     v-model="formdata.guarantee_period_unit"
                     placeholder="单位"
                     @change="guaranteePeriodChange">
            <el-option v-for="item in guaranteeTimeTypes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">{{ item.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保费(元)" prop="premium">
          <el-input class="form-input"
                    type="number"
                    v-model="formdata.premium"
                    placeholder="请输入保费"></el-input>
        </el-form-item>
        <el-form-item label="保障内容" prop="proposal_product_guarantee_content">
          <el-input class="form-input"
                    type="textarea"
                    rows="4"
                    v-model="formdata.proposal_product_guarantee_content"
                    placeholder="请输入保障内容"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button @click="modalClose">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  getProductCategoryList
} from '@/apis/modules/product'

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
        source_category_id: [{
          required: true, message: '请选择险种类型', trigger: 'change'
        }],
        product_name: [{
          required: true, message: '请选择产品名称', trigger: 'blur'
        }],
        guarantee_quota_value: [{
          required: true, message: '请输入保额', trigger: 'blur'
        }],
        pay_period_value: [{
          required: true, message: '请输入缴费期限', trigger: 'blur'
        }],
        guarantee_period_value: [{
          required: true, message: '请输入保障期限', trigger: 'blur'
        }],
        premium: [{
          required: true, message: '请输入保费', trigger: 'blur'
        }],
        proposal_product_guarantee_content: [{
          required: true, message: '请输入保障内容', trigger: 'blur'
        }]
      },
      categoryList: [],
      guaranteeTimeTypes,
      paytimeTypes,
      baseTypes,
      formdata: {
        source_category_id: '',
        product_name: '',
        proposal_product_id: null,
        premium: null,
        proposal_product_guarantee_content: '',
        category_name: '',
        category_icon: '',
        guarantee_period_unit: '1',
        guarantee_period_value: '',
        guarantee_quota_unit: 'yuan',
        guarantee_quota_value: '',
        pay_period_unit: '1',
        pay_period_value: ''
      }
    }
  },
  watch: {
    show(v) {
      if (v) {
        if (this.type === 'edit') {
          this.initForm()
        }
      }
    }
  },
  mounted() {
    this.getProductCategoryList()
  },
  methods: {
    initForm() {
      this.formdata.source_category_id = this.diyData.source_category_id
      this.formdata.product_name = this.diyData.product_name
      this.formdata.premium = this.diyData.total_premium
      this.formdata.proposal_product_guarantee_content = this.diyData.proposal_product_guarantee_content
      this.formdata.category_name = this.diyData.first_product_category_name
      this.formdata.category_icon = this.diyData.category_icon
      this.formdata.guarantee_period_unit = this.diyData.guarantee_period.split('_')[1]
      this.formdata.guarantee_period_value = this.diyData.guarantee_period.split('_')[0]
      this.formdata.guarantee_quota_unit = 'yuan'
      this.formdata.guarantee_quota_value = this.diyData.base_coverage_value
      this.formdata.pay_period_unit = this.diyData.pay_period.split('_')[1]
      this.formdata.pay_period_value = this.diyData.pay_period.split('_')[0]
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        console.log('sasas')
        if (valid) {
          const { source_category_id } = this.formdata
          const targetCategory = this.categoryList.find(i => i.id === source_category_id)
          this.formdata.category_name = targetCategory.name
          this.formdata.category_icon = targetCategory.icon
          this.$emit('diyProductSubmit', this.formdata, this.type)
          this.modalClose()
        } else {
          return false
        }
      })
    },
    payPeriodChange() {
      if (+this.formdata.pay_period_unit === 5) {
        this.formdata.pay_period_value = ''
      }
    },
    guaranteePeriodChange() {
      if (+this.formdata.guarantee_period_unit === 6) {
        this.formdata.guarantee_period_value = ''
      }
    },
    getProductCategoryList() {
      getProductCategoryList()
      .then(res => {
        this.categoryList = res
      })
    },
    modalClose() {
      this.$emit('update:show', false)
      this.formdata.source_category_id = ''
      this.formdata.product_name = ''
      this.formdata.proposal_product_id = null
      this.formdata.premium = null
      this.formdata.proposal_product_guarantee_content = ''
      this.formdata.category_name = ''
      this.formdata.category_icon = ''
      this.formdata.guarantee_period_unit = ''
      this.formdata.guarantee_period_value = ''
      this.formdata.guarantee_quota_unit = ''
      this.formdata.guarantee_quota_value = ''
      this.formdata.pay_period_unit = ''
      this.formdata.pay_period_value = ''
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
