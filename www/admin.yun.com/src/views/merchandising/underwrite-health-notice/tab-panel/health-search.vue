<template>
  <div class="underwrite-search-container">
    <side-filter-list v-loading="loading" label-key="product_name" value-key="product_name" :showFilter="false" v-model="selVal" @change="showDetail" :disabled="detailLoading" style="width: 280px" :listData="tableData">
      <div slot="extraFilter">
        <div class="search-input-container">
          <el-input clearable placeholder="搜索产品名称" v-model="formData.product_name" prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon" @blur="search"></el-input>
        </div>
        <div class="">
          <el-form class="search-form common-form filter-container flex-between">
            <el-radio-group size="mini" v-model="formData.isReverse" @change="search" class="radio-group-wrap">
              <el-radio-button style="height: 28px" v-for="(item, index) in isReverseData" :key="index" :label="item.value">{{ item.label }}</el-radio-button>
            </el-radio-group>
            <filter-shell :value="noticeText" :width="340" @closePopover="reset">
              <div class="formData-notice">
                <el-form-item :label="'健康告知内容'+ (index+1)" v-for="(item, index) in formData.notice" :key="index">
                  <el-input v-model="formData.notice[index]" placeholder="请输入健康告知内容"></el-input>
                </el-form-item>
                <el-button type="warning" @click="search">确定</el-button>
              </div>
              <template v-slot:label> 筛选 </template>
            </filter-shell>
          </el-form>
          <div class="classify-box">
            <div :class="['classify-item', {'active': item.isSelect}]" v-for="item in classifyList" :key="item.value" @click="selectItem(item)">{{item.name}}</div>
          </div>
        </div>
      </div>
    </side-filter-list>
    <div class="detail-wrap health-search" v-loading="detailLoading">
      <template v-if="tableData && tableData.length">
        <div class="head flex-between">
          <p>产品健告</p>
          <div class="flex-center">
            调整字号
            <el-input-number class="ml16" :min="12" :max="24" v-model="fontSize" size="small"></el-input-number>
            <el-button v-if="$checkAuth('/underwrite-health-notice/generate_pictures')" class="ml16" type="primary" @click="createImg" size="small"><i class="iconfont iconxiao16_shengcheng"></i> 生成图片</el-button>
          </div>
        </div>
        <el-scrollbar style="height: 100%">
          <div ref="imageDom">
            <el-table :data="detailTableData" border :style="{ fontSize: fontSize + 'px' }">
              <el-table-column class-name="p16">
                <template slot="header">
                  <h3 style="color: #333333; margin: 0; line-height: 38px">{{ selVal }}</h3>
                </template>
                <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
                <el-table-column label="健康告知内容" prop="notice" class-name="tj"></el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </template>
      <div class="empty-tips" v-else>请选择左侧列表</div>
    </div>
  </div>
</template>

<script>
import SideFilterList from "@/components/side-filter-list";
import FilterShell, { hasValue } from "@/components/filters/filter-shell";
import { getHealthNoticeProductList, getHealthNoticeDetail } from "@/apis/modules/underwriting";
import { debounce } from "@/utils";
import html2canvas from "html2canvas";
export default {
  name: "health-search",
  components: {
    SideFilterList,
    FilterShell,
  },
  data() {
    return {
      formData: {
        product_name: "",
        notice: ["", "", "", "", ""],
        isReverse: "0",
      },
      loading: false,
      detailLoading: false,
      selVal: "",
      detailTableData: [],
      tableData: [],
      searchModel: {
        product_name: "",
        notice: "",
        condition_search: "",
        is_reverse: "0",
      },
      isReverseData: [
        { label: "正向条件", value: "0" },
        { label: "反向条件", value: "1" },
      ],
      isShowList: {
        notice: false
      },
      classifyList: [
        {
          name: '重疾险',
          value: 1,
          isSelect: false
        },
        {
          name: '医疗险',
          value: 2,
          isSelect: false
        },
        {
          name: '寿险',
          value: 3,
          isSelect: false
        },
        {
          name: '其他',
          value: 9999,
          isSelect: false
        }
      ],
      fontSize: 14,
    };
  },
  computed: {
    noticeText() {
      let str = ''
      str = this.formData.notice.filter(function (item) {return item && item.trim()}).join(',')
      return str || ''
    }
  },
  methods: {
    // 生成图片
    createImg() {
      if (this.isCreateImgLock) {
        return false
      }
      this.isCreateImgLock = true
      this.$nextTick(() => {
        let self = this
        console.log(this)
        html2canvas(this.$refs.imageDom).then(canvas => {
          // 转成图片，生成图片地址
          self.imgUrl = canvas.toDataURL('image/png')
          // 创建隐藏的可下载链接
          let eleLink = document.createElement('a')
          eleLink.href = self.imgUrl // 转换后的图片地址
          eleLink.download = self.curProduct.product_name
          // 触发点击
          document.body.appendChild(eleLink)
          eleLink.click()
          // 然后移除
          document.body.removeChild(eleLink)
        })
        self.isCreateImgLock = false
      })
    },
    selectItem(item) {
      item.isSelect = !item.isSelect
      this.requestList()
    },
    requestList() {
      this.loading = true
      var notice = this.formData.notice.filter(function (item) {
        return item && item.trim()
      })
      let insuranceList = this.classifyList.filter(item => {
        return item.isSelect
      })
      let insurance_class
      if (insuranceList) {
        console.log(insuranceList)
        insurance_class = insuranceList.map(item => {
          return item.name
        })
      }
      let params = {
        product_name: this.formData.product_name,
        notice: notice.join(','),
        is_reverse: this.formData.isReverse,
        insurance_class: insurance_class ? insurance_class.join(',') : ''
      }
      this.searchConditionData = { ...this.formData }
      this.curProduct = {}
      this.detailTableData = []
      getHealthNoticeProductList(params)
        .then((res) => {
          this.tableData = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    requestDetail() {
      this.detailTableData = []
      this.loadingDetail = true
      var notice = this.formData.notice.filter(function (item) {
        return item && item.trim()
      })
      getHealthNoticeDetail({
        notice: notice.join(','),
        is_reverse: this.formData.isReverse,
        product_name: this.curProduct.product_name,
        file_log_id: this.curProduct.file_log_id
      })
        .then((res) => {
          this.detailTableData = res
          console.log(this.detailTableData)
        })
        .finally(() => {
          this.loadingDetail = false
        })
    },
    search() {
      // this.isShowList = {
      //   notice: false
      // }
      document.body.click()
      this.requestList()
    },
    reset(){
      this.formData.notice = ["", "", "", "", ""]
      this.requestList()
    },
    showDetail(data) {
      this.curProduct = data
      this.showProductDetail = true
      this.requestDetail()
    },
    closeDetailModal() {
      this.showProductDetail = false
      this.setFontSize = 14
    },
    closeSearchConditionTips() {
      this.searchConditionData = {}
      this.formData = {}
      this.isReverse = 0
      this.formData.isReverse = 0
      this.requestList()
    },
    // old
    hasValue,
    handleSelProduct(obj) {
      const { product_name } = obj;
      this.selVal = product_name;
      this.ajaxDetail(product_name);
    },
    ajaxDetail(product_name) {
      this.detailLoading = true;
      getHealthNoticeDetail({
        ...this.searchModel,
        product_name,
      })
        .then((res) => {
          this.detailTableData = res;
        })
        .catch(() => {})
        .finally(() => {
          this.detailLoading = false;
        });
    },
    ajaxProductData() {
      this.loading = true;
      this.detailTableData = [];
      this.selVal = "";
      getHealthNoticeProductList({ ...this.searchModel })
        .then((res) => {
          this.productData = res;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    debounceAjaxProductData: debounce(function () {
      this.ajaxProductData();
    }, 300)
  },
  created() {
    this.requestList()
  },
};
</script>

<style scoped lang="scss">
.underwrite-search-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  .search-input-container {
    padding: 16px;
  }
  .filter-container {
    padding: 0 16px;
  }
  .detail-wrap.health-search {
    flex: 1;
    padding: 16px;
    box-sizing: border-box;
    max-width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .head {
      height: 48px;
      position: relative;
      font-size: 14px;
      color: #4d4d4d;
      align-items: flex-start;
      & > p {
        line-height: 32px;
        color: #1a1a1a;
        font-size: 18px;
        margin: 0 0 2px 0;
        font-weight: bold;
      }
      .el-input-number {
        width: 140px;
      }
    }
    ::v-deep .el-scrollbar {
      flex: 1;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
  .side-filter-container {
    border-right: 1px solid #e6e6e6;
  }
  ::v-deep .filter-bar {
    // width: 72px;
    .filter-item {
      // width: 100%;
      margin-right: 0;
      text-align: center;
      display: flex;
      height: 28px;
      align-items: center;
      justify-content: center;
    }
    .filter-badge {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      background-color: #1f78ff;
      color: #fff;
    }
  }
  ::v-deep .is-reverse-filter {
    width: 100px;
    .filter-item {
      margin-right: 0;
      width: initial;
      border: none;
      background: #fff;
    }
  }
  ::v-deep .radio-group-wrap {
    .el-radio-button {
      .el-radio-button__inner {
        padding: 6px 8px;
        background: #f5f5f5;
        border-color: #e6e6e6;
      }
      &.is-active .el-radio-button__inner {
        background: #fff;
        color: #1f78ff;
        box-shadow: none;
      }
    }
  }
}

// new
.customer-health-search {
  margin-top: 48px;
  .el-card__body {
    height: 100%;
    padding: 0 16px;
    .not-content {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }

  .search-form {
    position: relative;
    background: #fff;
    left: 0;
    width: 100%;
    padding: 10px 20px;
    z-index: 2;
    display: flex;
    .supper-search{
      position: absolute;
      right: 16px;
      .el-icon-search{
        margin-right: 5px;
      }
    }
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 36px !important;
    }
  }

  h2 {
    font-size: 20px;
    color: #303133;
    font-weight: 500;
    margin-right: 24px;
    margin-top: 0;
    margin-bottom: 0;
  }

  .customer-health-search-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .customer-health-search-list {
    height: 89.6vh;
    overflow: hidden;
    margin-top: 0;
    .customer-health-search-list-box{
      height: 100%;
      .customer-health-search-left{
        min-width: 280px;
        border-right: 1px solid #E6E6E6;
        height: 100%;
        padding: 20px 16px 16px 0;
        box-sizing: border-box;
        .customer-health-list{
          overflow: hidden;
          height: 75vh;
          .customer-health-item{
            cursor: pointer;
            line-height: 1.5;
            padding: 12px 8px;
            font-size: 14px;
            box-sizing: border-box;
            &.active{
              background: rgba(255, 144, 0, 0.1);
              color: #1F78FF;
            }
          }
        }
      }
      .customer-health-search-right{
        padding: 16px 16px 0 16px;
        .table-box{
          height: 82.7vh;
          overflow: hidden;
        }
      }
    }
  }
  .el-col-12 {
    margin-bottom: 24px;
  }
}

.formData-notice{
  margin: 4px;
  .el-form-item--medium{
    display: flex;
  }
  .el-form-item{
    margin-right: 0px !important;
  }
  .el-button--medium{
    color: #fff;
    background-color: #1F78FF;
    border-color: #1F78FF;
    width: 100%;
  }
}
.formData-notice-box{
  margin-right: 16px;
}

.formData-condition_search{
  .el-form-item--medium{
    display: flex;
  }
  .el-form-item{
    margin-right: 0px !important;
  }
  .el-button--medium{
    width: 100%;
  }
}
.formData-condition_search-box{
  margin-right: 16px;
}

.formData-cover{
  .el-form-item--medium{
    display: flex;
  }
  .el-form-item{
    margin-right: 0px !important;
  }
  .el-button--medium{
    width: 100%;
  }
}
.customer-health-search{
  .search-form{
    display: inline-block;
    vertical-align: middle;
    .button-small-select{
      padding: 3px 8px;
      background: #f5f5f5;
      line-height: 1.6;
      color: #333;
    }
  }
  .el-radio-group{
    border-radius: 4px;
    padding: 2px;
    margin-right: 18px;
    background: #f5f5f5;
    border: 1px solid #E6E6E6;
    .el-radio-button--medium{
      .el-radio-button__inner{
        border-radius: 4px;
        background: #f5f5f5;
        color: #1a1a1a;
        padding: 2px 8px;
        box-shadow: none;
        line-height: 1.5;
        border: 0px;
      }
      &.is-active{
        .el-radio-button__inner{
          font-weight: bold;
          background: #fff;
          color: #1F78FF;
          border: 0;
        }
      }
    }
  }
}
.classify-box{
  padding: 16px 16px 16px 16px;
  font-size: 14px;
  .classify-item{
    cursor: pointer;
    display: inline-block;
    padding: 6px 8px;
    background: #F5F5F5;
    border: 1px solid #E6E6E6;
    color: #333;
    border-radius: 4px;
    line-height: 1;
    margin-right: 8px;
    &.active{
      background: rgba(255, 144, 0, 0.1);
      color: #1F78FF;
    }
  }
}
</style>
