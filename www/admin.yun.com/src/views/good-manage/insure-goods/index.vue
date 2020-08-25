<template>
  <div class="insure-goods-container page-container">
    <div class="header">
      保险商品
      <div class="flex-between">
        <el-input placeholder="搜索保险商品" size="small" v-model="searchModel.title" clearable @input="debounceAjaxListData">
          <i slot="prefix" class="ml4 fw400 iconfont iconxiao16_sousuo el-input__icon"></i>
        </el-input>
      </div>
    </div>
    <div class="content">
      <side-filter-list v-model="selProductVal"
                        labelKey="title"
                        valueKey="id"
                        :showFilter="false"
                        :listData="list"
                        v-loading="loading"
                        @change="handleSelProduct"
                        customClass="left-filter-list">
        <div slot="extraFilter" class="filter-wrap">
          <filter-shell v-model="searchModel.first_product_category_id" autoFocus @input="ajaxListData">
            <el-select class="block"
                       v-model="searchModel.first_product_category_id"
                       clearable
                       filterable
                       multiple
                       @change="ajaxListData"
                       placeholder="请选择">
              <el-option
                      v-for="item in productCategoryData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              ></el-option>
            </el-select>
            <template v-slot:label>
              <span>
                  {{ hasValue(searchModel.first_product_category_id) ? productCategoryData.find(i => i.id === searchModel.first_product_category_id[0]).name : '险种' }}
              </span>
            </template>
            <template v-slot:close>
                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                   v-if="hasValue(searchModel.first_product_category_id)"
                   @click="searchModel.first_product_category_id = ''"></i>
            </template>
          </filter-shell>
          <filter-shell v-model="searchModel.age_id" autoFocus autoClose @input="ajaxListData">
            <el-select class="block"
                       v-model="searchModel.age_id"
                       clearable
                       filterable
                       @change="ajaxListData"
                       ref="focusRef"
                       placeholder="请选择">
              <el-option
                      v-for="item in productAgeData"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
              ></el-option>
            </el-select>
            <template v-slot:label>
            <span>
                {{ hasValue(searchModel.age_id) ? productAgeData.find(i => i.id === searchModel.age_id).title : '投保年龄' }}
            </span>
            </template>
          </filter-shell>
          <filter-shell v-model="searchModel.supplier_id" autoFocus @input="ajaxListData">
            <el-select class="block"
                       v-model="searchModel.supplier_id"
                       clearable
                       filterable
                       multiple
                       @change="ajaxListData"
                       ref="focusRef"
                       placeholder="请选择">
              <el-option
                      v-for="item in supplierData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              ></el-option>
            </el-select>
            <template v-slot:label>
            <span>
                {{ hasValue(searchModel.supplier_id) ? supplierData.find(i => i.id === searchModel.supplier_id[0]).name : '保险公司' }}
            </span>
            </template>
            <template v-slot:close>
                <i class="filter-clear iconfont iconxiao16_yuanxingchahao"
                   v-if="hasValue(searchModel.supplier_id)"
                   @click="searchModel.supplier_id=''"></i>
            </template>
          </filter-shell>
        </div>
        <template v-slot:list="{row}">
          <div class="list-item-wrap">
            <div>{{row.title}}</div>
            <div class="flex mb16">
              <div v-for="(item, index) in row.subtitles" :key="index" style="flex: 1">
                <text-hidden-ellipsis :width="230" :popoverTip="item">{{item}}</text-hidden-ellipsis>
              </div>
            </div>
            <div class="flex-between">
              <span>{{row.isCpsData ? '' : `${row.min_price} 元起`}}&nbsp;</span>
              <div class="flex">
                <el-link v-if="$checkAuth('/insure-goods/liability') && row.duty_pic_url"
                         type="primary"
                         :underline="false"
                         @click="handleViewPic(row.duty_pic_url)">
                  <i class="iconfont iconxiao16_baoxianzeren mr4"></i>保险责任
                </el-link>
                <el-link v-if="$checkAuth('/insure-goods/sale_notify') && row.inquiry_info"
                         type="primary"
                         :underline="false"
                         class="ml20"
                        @click="handleNotify(row.inquiry_info)">
                  <i class="iconfont iconxiao16_shouqiangaozhi  mr4"></i>售前告知
                </el-link>
              </div>
            </div>
          </div>
        </template>
      </side-filter-list>
      <div class="right">
        <iframe v-if="productUrl" :src="`${productUrl}&user_token=${$store.state.users.userInfo.agent_token}&platform=crm_web`"></iframe>
      </div>
    </div>
    <el-dialog title="售前告知" :visible.sync="notifyVisible" width="480px">
      <div class="pb20 fs14" style="line-height: 1.45" ref="notifyContent">
        {{notifyText}}
      </div>
      <div slot="footer" class="flex-center">
        <el-button type="primary"
                   v-clipboard:success="copy"
                   v-clipboard:copy="notifyText"><i class="iconfont iconxiao16_fuzhi mr4"></i>复制</el-button>
      </div>
    </el-dialog>
    <el-dialog title="保险责任" :visible.sync="picVisible" width="480px" class="pic-dialog">
      <el-image :src="picUrl" class="mb20"></el-image>
      <div slot="footer" class="flex-center">
        <el-button type="primary"
             @click="download"><i class="iconfont iconxiao16_xiazai mr4"></i>下载保险责任图片</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getInsureApiList, getInsureCpsList} from '@/apis/modules/good-manage'
import { getSupplierList, getProductAgeList, getProductCategory} from '@/apis/modules'
import { formatDate } from '@/utils/formatTime'
import FilterShell, { clearValue, hasValue } from '@/components/filters/filter-shell'
import SideFilterList from '@/components/side-filter-list'
import TextHiddenEllipsis from '@/components/text-hidden-ellipsis'
import { debounce, downloadFrameA} from "@/utils";
export default {
  name: 'insure-goods',
  components: {
    FilterShell,
    SideFilterList,
    TextHiddenEllipsis
  },
  data() {
    return {
      picVisible: false,
      picUrl: '',
      productUrl: '',
      notifyVisible: false, // 售前告知visible
      notifyText: '',
      loading: false,
      formatDate,
      filterValue: false,
      belongVisible: false,
      belongData: {},
      list: [],
      selProductVal: '',
      searchModel: {
        title: '',
        first_product_category_id: [],
        age_id: '',
        supplier_id: []
      },
      supplierData: [],
      productCategoryData: [],
      productAgeData: [],
      value: []
    };
  },
  methods: {
    download() {
      const url = `${process.env.VUE_APP_API_URL}/common/get_file_stream?file_url=${this.picUrl}`
      downloadFrameA(url, '责任图片.jpg')
    },
    handleViewPic(url) {
      this.picVisible = true
      this.picUrl = url
    },
    handleNotify(text) {
      this.notifyText = text
      this.notifyVisible = true
    },
    copy() {
      this.$message.success('售前告知内容已复制到粘贴板')
    },
    handleSelProduct(obj) {
      this.productUrl = obj.web_url
    },
    ajaxBaseData() {
      getSupplierList().then(res => {
        this.supplierData = res
      })
      getProductAgeList().then(res => {
        this.productAgeData = res
      })
      getProductCategory().then(res => {
        this.productCategoryData = res
      })
    },
    ajaxListData() {
      this.loading = true
      this.productUrl = ''
      this.selProductVal = ''
      const params = this.searchModel
      getInsureApiList(params).then(apiData => {
        getInsureCpsList(params).then(cpsData => {
          this.list = [...apiData, ...cpsData.map(i => ({
            ...i,
            title: i.share_title,
            duty_pic_url: i.share_cover,
            web_url: i.link,
            isCpsData: true
          }))]
        }).finally(() => {
          this.loading = false
        })
      })
    },
    debounceAjaxListData: debounce(function() {
      this.ajaxListData()
    }, 300),
    hasValue,
    clearValue,
    showInfoDialog(row) {
      this.$router.push({ path: `/order/detail/${row.id}` })
    },
    showBelongDialog(row) {
      this.belongData = row;
      this.belongVisible = true;
    }
  },
  watch: {
    belongVisible(v) {
      if (!v) {
        this.belongData = {};
      }
    }
  },
  created() {
    this.ajaxListData()
    this.ajaxBaseData()
  }
};
</script>
<style lang="scss" scoped>
.insure-goods-container {
  padding: 20px 20px 0 20px;
  .header {
    font-size: 16px;
    font-weight: bold;
    padding: 0 16px;
    height: 56px;
    background: #f5f5f5;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-input {
      width: 360px;
    }
  }
  .content{
    height: calc(100% - 56px);
    display: flex;
    background: #fff;
    ::v-deep .side-filter-container {
      .filter-wrap{
        height: 60px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e6e6e6;
      }
      .el-scrollbar{
        padding-top: 0;
      }
      .list-item{
        overflow: visible;
        &.active{
          border-left: 3px solid #1F78FF;
        }
      }
      .list-item-wrap{
        width: 100%;
        &>div:first-of-type{
          line-height: 24px;
          font-size: 16px;
          color: #1A1A1A;
          font-weight: bold;
          /*margin-bottom: 8px;*/
        }
        &>div:nth-of-type(2){
          line-height: 20px;
          color:#999;
        }
        &>div:nth-of-type(3){
          &>span{
            color:#FF4C4C;
            font-size: 16px;
            font-weight: bold;
            line-height: 24px;
          }
        }
      }
    }
    .right{
      flex: 1;
      height: 100%;
      border-left: 1px solid #E6E6E6;
      padding: 16px 0;
      &>iframe{
        height: 100%;
        width: 360px;
        border-radius:4px;
        border:1px solid #e6e6e6;
        margin: auto;
        display: block;
      }
    }
  }
  .left-filter-list {
    width: 884px;
    ::v-deep .el-scrollbar {
      .list-item-wrap{
        padding: 0;
      }
      .list-item{
        border-bottom: 1px solid #e6e6e6;
        padding: 16px;
        border-radius: 0;
        box-sizing: border-box;
        &:hover{
          background: #e6e6e6;
        }
        &.active{
          background: #f5f5f5;
          font-weight: bold;
        }
      }
    }

  }
  & ::v-deep .el-scrollbar {
    height: calc(100vh - 78px);
    padding-top: 16px;
    box-sizing: border-box;
    & .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }

    .el-scrollbar__bar {
      z-index: 999;
    }
  }

  ::v-deep .pic-dialog .el-dialog__body{
    text-align: center;
  }

  .el-dialog__wrapper ::v-deep .belong-dialog {
    width: 200px;
    .el-dialog__body {
      .card {
        background: #f5f5f5;
        border: 1px solid #e6e6e6;
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 20px;
        & > .el-row:nth-of-type(1) {
          .el-col:first-of-type {
            font-weight: bold;
            color: #1a1a1a;
          }
        }
        & > .el-row:nth-of-type(2) {
          margin-top: 16px;
          .el-col {
            display: flex;
            flex-direction: column;
            line-height: 20px;
            color: #999999;
            font-size: 14px;
            span {
              margin-top: 4px;
              color: #1a1a1a;
              font-weight: bold;
            }
          }
        }
        .el-divider {
          margin: 16px 0;
        }
        & > .el-row:nth-of-type(4) {
          margin-top: 16px;
          .el-col {
            display: flex;
            line-height: 20px;
            color: #999999;
            font-size: 14px;
            align-items: center;
            span {
              color: #1a1a1a;
              font-weight: 400;
              margin-left: 8px;
            }
          }
        }
      }
    }
    .el-dialog__footer {
      padding-top: 0;
    }
    .el-form-item .el-select {
      width: 100%;
    }
  }
}
::v-deep.el-popover{
  padding: 16px 20px;
}
::v-deep.filter-popover{
  padding: 0;
}
</style>