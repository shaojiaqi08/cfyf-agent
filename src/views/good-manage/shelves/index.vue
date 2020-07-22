<template>
  <div class="rate-container">
    <div class="header">
      <el-tabs v-model="tabIndex">
        <el-tab-pane name="api" label="API"></el-tab-pane>
        <el-tab-pane name="cps" label="CPS"></el-tab-pane>
      </el-tabs>
      <el-button type="primary" @click="openRateDialog">
        <i class="iconfont iconxiao16_shezhi mr4"></i>批量上下架
      </el-button>
    </div>
    <div class="content">
      <Component :is="tabIndex"></Component>
    </div>
    <el-dialog
      title="批量上下架"
      width="480px"
      custom-class="shelves-dialog"
      :visible.sync="dialogVisible"
    >
      <el-form
        ref="form"
        :model="formModel"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="保险产品" prop="products" placeholder="请选择保险产品">
          <el-select v-model="formModel.products" multiple>
            <el-option
              v-for="(item, index) in productList"
              :key="index"
              :value="item.id_type"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="B端公司" prop="company_ids">
          <el-select v-model="formModel.company_ids" multiple>
            <el-option
              v-for="(item, index) in companyList"
              :key="index"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置状态" prop="status">
          <el-radio v-model="formModel.status" :label="1">上架</el-radio>
          <el-radio v-model="formModel.status" :label="0">下架</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="submit" :loading="submitting" :disabled="submitting" type="primary">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from "./tab-panel/api";
import cps from "./tab-panel/cps";
import { getAllProduct, getCompanyList, setBatchStatus } from "@/apis/modules/good-manage";
export default {
  name: "rate",
  components: {
    api,
    cps
  },
  data() {
    return {
      submitting: false,
      dialogVisible: false,
      tabIndex: "api",
      formModel: {
        products: [],
        company_ids: [],
        status: 0
      },
      rules: {},
      productData: [],
      companyData: [],
      productList: [],
      companyList: []
    };
  },
  methods: {
    getAllProduct() {
      getAllProduct().then(res => {
        this.productList = res
      })
    },
    getCompanyList() {
      getCompanyList().then(res => {
        this.companyList = res
      })
    },
    submit() {
        const { products, company_ids, status } = this.formModel
        const data = {
            products: products,
            company_ids: company_ids,
            status
        }
        setBatchStatus(data).then(() => {
            this.$message.success('批量更改成功')
            this.dialogVisible = false
        })
    },
    openRateDialog() {
      this.dialogVisible = true;
    },
    ajaxCompanyData() {},
    ajaxProductData() {}
  },
  watch: {
    dialogVisible(v) {
      !v && this.$refs.form.resetFields();
      if (v) {
        this.getAllProduct()
        this.getCompanyList()
      }
    }
  }
};
</script>

<style scoped lang="scss">
.rate-container {
  padding: 16px 16px 0 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .header {
    padding: 16px 0 0 16px;
    height: 56px;
    background: #f5f5f5;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #e6e6e6;
    position: relative;
    .el-button {
      position: absolute;
      top: 12px;
      right: 16px;
    }
  }
  .content {
    background-color: #fff;
    flex: 1;
    overflow: hidden;
    border: 1px solid #e6e6e6;
    border-top: transparent;
    box-sizing: border-box;
  }
}
</style>