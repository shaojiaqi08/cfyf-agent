<template>
  <el-dialog
    title="添加产品"
    :visible="visible"
    width="400px"
    :close-on-click-modal="false"
    @close="closeDialog">
    <el-button type="primary" @click="addDiyProduct" style="width: 100%" class="mb20">添加自定义产品</el-button>
    <el-input
      v-model="keyword"
      style="margin-bottom: 1px"
      clearable
      @keyup.enter.native="search"
      placeholder="搜索产品名称">
      <el-button
        slot="append"
        type="primary"
        @click="search">搜索</el-button>
    </el-input>
    <el-scrollbar ref="scrollbar" v-loading="loading">
      <div class="list-group mt20" v-for="(group, index) in data" :key="index">
        <p>{{group.name}}</p>
        <div class="list-item" v-for="(item, index) in group.products" :key="index">
          {{item.proposal_product_name}}
          <el-button :disabled="!visible" @click="addProduct(item, group.name)" type="primary" size="small" plain icon="el-icon-plus">添加</el-button>
        </div>
      </div>
      <div class="flex-center mt16" v-if="data.length <= 0 && !loading">暂无数据</div>
    </el-scrollbar>
    <add-diy-product-dialog :show.sync="showDiyProductDialog" @diyProductSubmit="addProduct"></add-diy-product-dialog>
  </el-dialog>
</template>
<script>
  import { getDepositProductList } from '@/apis/modules/proposal'
  import AddDiyProductDialog from './add-diy-product'
  import { productFrom } from '../config'
  export default {
    name: 'add-product-dialog',
    props: {
      visible: Boolean
    },
    components: {
      AddDiyProductDialog
    },
    data() {
      return {
        loading: false,
        keyword: '',
        data: [],
        originData: [],
        showDiyProductDialog: false
      }
    },
    methods: {
      search() {
        const { keyword, originData } = this
        if (keyword) {
          const res = []
          originData.filter(i => {
            const filter = i.products.filter(i => i.proposal_product_name.includes(keyword))
            if (filter.length) {
              res.push({
                ...i,
                products: filter
              })
            }
          })
          this.data = res
        } else {
          this.data = [...originData]
        }
        this.resetScroll()
      },
      addProduct(item, supplier_name, isDiy = false) {
        const obj = {
          ...item,
          supplier_name
        }
        if (!isDiy) {
          obj.source = productFrom.FROM_INSURANCE
        }
        this.$emit('addProductSubmit', JSON.parse(JSON.stringify(obj)))
        // 重置滚动条
        this.resetScroll()
        this.closeDialog()
      },
      resetScroll() {
        this.$refs.scrollbar.$el.querySelector('.el-scrollbar__wrap').scrollTo(0, 0)
      },
      // 添加自定义产品
      addDiyProduct() {
        this.showDiyProductDialog = true
      },
      // 自定义产品提交
      diyProductSubmit(data, type) {
        this.$emit('diyProductSubmit', data, type)
      },
      closeDialog() {
        this.$emit('update:visible', false)
      }
    },
    watch: {
      visible(v) {
        // 没有数据的话加载数据
        if (v && this.data.length <= 0) {
          this.loading = true
          getDepositProductList().then(res => {
            this.originData = res
            this.data = res
          }).finally(() => {
            this.loading = false
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/ .el-dialog__body {
    .el-scrollbar {
      height: 500px;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .list-group {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        & > p {
          margin: 0 0 16px 0;
          color: #131415;
          font-size: 16px;
        }
        .list-item {
          padding: 16px;
          box-sizing: border-box;
          background-color: #F5F5F5;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          margin-bottom: 16px;
          color: #131415;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
</style>
