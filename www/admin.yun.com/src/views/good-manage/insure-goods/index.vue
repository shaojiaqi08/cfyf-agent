<template>
  <div class="insure-goods-container">
    <div class="header">
      <common-tabs-header v-model="tabIndex" :data="tabsData"></common-tabs-header>
    </div>
    <div class="content">
      <side-filter-list v-model="selProductVal"
                        labelKey="title"
                        valueKey="id"
                        :showFilter="false"
                        :listData="filterList"
                        v-loading="loading"
                        customClass="left-filter-list">
        <div slot="extraFilter" class="filter-wrap">
          <div class="flex-between pb16">
            <el-input style="width: 100%;"
                      placeholder="搜索保险商品"
                      size="small"
                      v-model.trim="searchModel.title"
                      :readonly="loading"
                      clearable
                      @input="debounceAjaxListData">
              <i slot="prefix" class="ml4 fw400 iconfont iconxiao16_sousuo el-input__icon"></i>
            </el-input>
          </div>
          <div class="ml20">
            <filter-shell v-model="searchModel.first_product_category_id"
                          autoClose
                          :collapse="false"
                          :textOverflow="false"
                          :width="240"
                          @input="ajaxListData">
              <el-cascader
                      ref="focusRef"
                      popper-class="address-picker"
                      placeholder="请选择"
                      filterable
                      collapse-tags
                      :props="{
                        value: 'id',
                        label: 'name',
                        children: 'child_categories'
                      }"
                      :options="productCategoryData"
                      v-model="searchModel.first_product_category_id"
                      emitPath
                      @change="ajaxListData"
                      clearable
              ></el-cascader>
              <template v-slot:label>
                <span>
                    {{ hasValue(searchModel.first_product_category_id) ? getChildName(searchModel.first_product_category_id) : '险种' }}
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
          <el-button type="primary" class="export-btn" v-if="$checkAuth('/insure-goods/export_product_link') && tabIndex === 'all'"
                     :loading="exporting" size="small" @click="exportProcuctList"><i class="iconfont iconxiao16_xiazai mr4"></i>导出商品链接</el-button>
        </div>
        <template v-slot:list="{row}">
          <div class="list-item-content pl16 pr16 pt16 pb16 mb16" :class="noticeTypeClassMap[row.notice_type]">
            <div class="flex-between company-base-info mb16">
              <img :src="row.company_logo">
              <div>
                {{row.title}}
                <el-row class="mb16 mt8" :gutter="20">
                  <el-col :span="8" v-for="(item, index) in row.subtitles" :key="index" style="font-weight: 400;">
                    <text-hidden-ellipsis width="100%" :popoverTip="item"><i class="iconfont iconxiao16_duigou mr4"></i>{{item}}</text-hidden-ellipsis>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="flex-between">
              <div>
                <el-link v-if="$checkAuth('/insure-goods/liability') && row.duty_pic_url"
                         type="primary"
                         :underline="false"
                         class="mr20"
                         @click="handleViewPic(row.duty_pic_url)">
                  <i class="iconfont iconxiao16_baoxianzeren mr4"></i>保险责任
                </el-link>
                <el-link v-if="$checkAuth('/insure-goods/sale_notify') && row.inquiry_info"
                         type="primary"
                         :underline="false"
                         class="mr20"
                         @click="handleNotify(row.inquiry_info)">
                  <i class="iconfont iconxiao16_shouqiangaozhi  mr4"></i>售前告知
                </el-link>
                <el-link v-if="$checkAuth('/insure-goods/product_docs') && row.is_has_docs"
                         type="primary"
                         :underline="false"
                         class="mr20"
                         @click="handleViewMaterial(row)">
                  <i class="iconfont iconxiao16_ziliao mr4"></i>产品资料
                </el-link>
              </div>
              <div>
                <span class="ml16 span-price">{{row.isCpsData ? '' : `${row.min_price} 元起`}}</span>
                <el-button @click="viewProductDetail(row)" class="ml16" size="small" type="primary" plain><i class="iconfont iconxiao16_xiangqing mr4"></i>产品详情</el-button>
                <el-button @click="share(row)" type="primary" size="small"><i class="iconfont iconxiao16_fasong mr4"></i>转发客户</el-button>
              </div>
            </div>
            <div class="off-shelves-tips pt16" v-if="row.notice_type === 'off'">
              距离下架还有<span>{{row.put_down_count_down}}</span>
            </div>
          </div>
        </template>
      </side-filter-list>
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
    <el-dialog title="保险责任" :visible.sync="picVisible" width="1200px" class="pic-dialog">
      <el-image :src="picUrl" class="mb20"></el-image>
      <div slot="footer" class="flex-center">
        <el-button type="primary" @click="download"><i class="iconfont iconxiao16_xiazai mr4"></i>下载保险责任图片</el-button>
      </div>
    </el-dialog>
    <el-dialog
            title="转发客户"
            :visible.sync="dialogVisible"
            width="480px"
            class="dark-dialog">
      <div style="margin-bottom: 10px !important;
        color: #333 !important;
        font-size: 16px !important;
        font-weight: 500 !important;">{{ productObj.title }}</div>
      <el-image
              :src="qrcodeUrl"
              style="width: 200px;height: 200px">
        <div slot="error" style="width:200px;height:200px" class="flex-center">
          <i class="el-icon-loading fs28"></i>
        </div>
      </el-image>
      <p style="margin-top: 0;font-size: 14px" class="mb20">请使用微信扫描上方二维码后分享给客户</p>
    </el-dialog>
    <el-dialog class="docs-dialog" title="产品资料" :visible.sync="materialVisible" width="480px" destroy-on-close>
      <div v-loading="docsLoading" style="min-height: 200px;max-height: 600px;">
        <div class="category-wrap" v-for="(category, index) in productDocsData" :key="index">
          <p>{{category.name}}</p>
          <div class="docs-wrap flex flex-between" v-for="(doc, idx) in category.docs" :key="idx">
            <div class="flex">
              <i class="iconfont iconxiao16_ziliao mr4"></i>
              <span>{{doc.name}}</span>
              <span>{{'.' + doc.ext_name}}</span>
            </div>
            <el-link type="primary" @click="downloadDocs(doc)">下载</el-link>
          </div>
        </div>
        <div v-if="productDocsData.length === 0" class="flex-center">
          暂无数据
        </div>
      </div>
    </el-dialog>
    <product-detail-dialog :visible.sync="detaiDialoglVisible" :product-obj="productObj"  @share="share" @close="detailDialogClose"></product-detail-dialog>
  </div>
</template>

<script>
import commonTabsHeader from '../../../components/common-tabs-header'
import { getInsureApiList, getInsureCpsList, getProductDocs, getProductShareLink, exportProductLink, getShelvesList} from '@/apis/modules/good-manage'
import { getSupplierList, getProductAgeList, getProductCategory} from '@/apis/modules'
import { formatDate } from '@/utils/formatTime'
import FilterShell, { clearValue, hasValue } from '@/components/filters/filter-shell'
import SideFilterList from '@/components/side-filter-list'
import TextHiddenEllipsis from '@/components/text-hidden-ellipsis'
import { debounce, downloadFrameA } from "@/utils";
import ProductDetailDialog from './modal/product-detail-dialog'
import QRCode from 'qrcode'
let reqId = 0
export default {
  name: 'insure-goods',
  components: {
    commonTabsHeader,
    FilterShell,
    SideFilterList,
    TextHiddenEllipsis,
    ProductDetailDialog
  },
  data() {
    return {
      noticeTypeClassMap: Object.freeze({
        on: 'new-arrival',
        off: 'off-shelves'
      }),
      tabIndex: '',
      tabsData: [
        { name: 'goods', label: '全部商品'},
        { name: 'on', label: '新品上架', permission: '/insure-goods/new_product_notice', dot: 'new_product_quantity'},
        { name: 'off', label: '即将下架', permission: '/insure-goods/product_off_notice', dot: 'off_product_quantity'},
      ],
      docsLoading: false,
      detaiDialoglVisible: false,
      dialogVisible: false,
      picVisible: false,
      materialVisible: false,
      qrcodeUrl: '',
      picUrl: '',
      productUrl: '',
      productObj: {},
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
        first_product_category_id: '',
        age_id: '',
        supplier_id: []
      },
      supplierData: [],
      productCategoryData: [],
      productAgeData: [],
      value: [],
      productDocsData: [],
      exporting: false,
    };
  },
  computed: {
    filterList() {
      return this.list.filter(i => i)
    }
  },
  methods: {
    exportProcuctList() {
      let params = JSON.parse(JSON.stringify(this.searchModel))
      if (params.first_product_category_id.length) {
        const [first, second] = params.first_product_category_id
        params.first_product_category_id = first
        params.second_product_category_id = second
      }
      if (!params.first_product_category_id) {
        params.first_product_category_id = ''
        params.second_product_category_id = ''
      }
      let urlSearch = this.getParams(params)
      const url = `${exportProductLink}?${urlSearch}`
      this.exporting = true
      downloadFrameA(url, `产品链接列表-${formatDate(new Date(), 'yyyy-MM-dd hh_mm')}.xlsx`, 'get', true).then(() => {
        // this.$message.success('导出成功')
      }).finally(() => {
        this.exporting = false
      })
    },
    //用&拼接对象成字符串
    getParams(params) {
      let paramStr = '';
      Object.keys(params).forEach((item) => {
        if (paramStr === '') {
          paramStr = `${item}=${params[item]}`;
        } else {
          paramStr = `${paramStr}&${item}=${params[item]}`;
        }
      });
      return paramStr;
    },
    downloadDocs({ download_file_url }) {
      window.open(download_file_url)
    },
    detailDialogClose() {
      this.productObj = {}
    },
    viewProductDetail(obj) {
      this.productObj = obj
      this.detaiDialoglVisible = true
    },
    getChildName(id) {
      const [firstId, secondId] = id
      const firstName = this.productCategoryData.find(i => i.id === firstId).name
      const secondName = this.productCategoryData.find(i => i.id === firstId).child_categories
              .find(i => i.id === secondId).name
      return `${firstName}/${secondName}`
    },
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
    // 查看产品资料
    handleViewMaterial(row) {
      this.materialVisible = true
      const { product_id, product_type, id } = row
      this.getProductDocs(product_type === 'cps' ? id : product_id, product_type)
    },
    getProductDocs(product_id, product_type) {
      this.docsLoading = true
      this.productDocsData = []
      getProductDocs({
        product_id,
        product_type
      }).then(res => {
        // 处理文件名和后缀
        res.forEach(cate => {
          cate.docs.forEach(doc => {
            const { name } = doc
            doc.ext_name = ''
            const match = name.match(/.([a-zA-Z]+)$/)
            if (match) {
              doc.ext_name = match[1].toLowerCase()
              doc.name = doc.name = name.replace(/.[a-zA-Z]+$/, '')
            }
          })
        })
        this.productDocsData = res
      }).finally(() => {
        this.docsLoading = false
      })
    },
    copy() {
      this.$message.success('售前告知内容已复制到粘贴板')
    },
    share(obj) {
      const { product_id, product_type, target_share_link, agent_id, share_at, cps_product_id, cps_branch_product_id } = obj
      if (product_type === 'cps') {
        const url = `${target_share_link}?agent_id=${agent_id}&share_at=${share_at}&cps_product_id=${cps_product_id}&cps_branch_product_id=${cps_branch_product_id}`
        QRCode.toDataURL(url).then(result => {
          this.qrcodeUrl = result
        })
      } else {
        getProductShareLink({ product_id, product_type }).then(res => {
          const share_link = res.share_link
          const query = {}
          const host = share_link.substring(0, share_link.indexOf('/proposal'))
          share_link.replace(/([^?&=]+)=([^&]+)/g, (_, key, value) => {
            query[key] = value
          });
          const url = `${host}/proposal/#/product/api-share?scode=${query.scode}`
          QRCode.toDataURL(url).then(result => {
            this.qrcodeUrl = result
          })
        })
      }
      this.productObj = obj
      this.dialogVisible = true
    },
    handleSelProduct(obj) {
      this.productUrl = ''
      setTimeout(() => {
        this.productUrl = obj.web_url
      }, 500)
      this.productObj = obj
    },
    ajaxBaseData() {
      getSupplierList().then(res => {
        this.supplierData = res
      })
      getProductAgeList().then(res => {
        this.productAgeData = res
      })
      getProductCategory().then(res => {
        res.map(i => {
          const addItem = { id: '', name: '全部' }
          i.child_categories.unshift(addItem)
        })
        this.productCategoryData = res
      })
    },
    ajaxListData() {
      this.loading = true
      this.productUrl = ''
      this.selProductVal = ''
      const params = JSON.parse(JSON.stringify(this.searchModel))
      if (params.first_product_category_id.length) {
        const [first, second] = params.first_product_category_id
        params.first_product_category_id = first
        params.second_product_category_id = second
      }
      if (!params.first_product_category_id) {
        params.first_product_category_id = ''
        params.second_product_category_id = ''
      }
      const id = ++reqId
      if (this.tabIndex === 'goods') {
        getInsureApiList(params).then(apiData => {
          getInsureCpsList(params).then(cpsData => {
            if (id === reqId) {
              this.list = [...apiData, ...cpsData.map(i => ({
                ...i,
                title: i.title,
                web_url: i.link,
                isCpsData: true
              }))]
            }
          }).finally(() => {
            if (id === reqId) {
              this.loading = false
            }
          })
        })
      } else {
        getShelvesList({
          notice_type: this.tabIndex,
          ...params
        }).then(res => {
          if (id === reqId) {
            this.list = res
          }
        }).finally(() => {
          if (id === reqId) {
            this.loading = false
          }
        })
      }
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
    },
    onCopy() {
      this.$message.success('链接已经复制到剪贴板')
    },
    onError() {
      console.log('复制失败')
    }
  },
  watch: {
    tabIndex() {
      this.ajaxListData()
    },
    belongVisible(v) {
      if (!v) {
        this.belongData = {};
      }
    },
    dialogVisible(v) {
      if (!v) {
        this.qrcodeUrl = ''
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
  .dark-dialog {
    .share-title-tips {
      margin-bottom: 10px;
      font-size: 14px;
      color: #999;
    }
    ::v-deep .el-dialog__body {
      text-align: center;
    }
  }
  .insure-goods-container {
    padding: 0 20px 0 20px;
    ::v-deep .text-hidden-ellipsis-component .icon{
      color: #999;
    }

    .header {
      font-size: 16px;
      font-weight: bold;
      padding: 0 16px;
      height: 56px;
      background: #f5f5f5;
      border-radius: 4px 4px 0px 0px;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-input {
        width: 360px;
      }
      ::v-deep .el-tabs__header {
        margin: 0;
      }
    }
    .content{
      height: calc(100% - 80px);
      display: flex;
      background: #fff;
      ::v-deep .side-filter-container {
        .filter-wrap {
          padding: 16px;
          display: flex;
          align-items: center;
          .flex-between {
            padding: 0 !important;
            input {
              width: 400px;
            }
          }
        }
        .el-scrollbar {
          padding-top: 0;
        }
        .list-item {
          overflow: visible;
          border-bottom: transparent !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          cursor: initial !important;
          .list-item-content {
            border: 1px solid #E6E6E6;
            border-radius: 4px;
          }
          &:hover, &.active {
            background-color: #fff !important;
          }
        }
        .list-item-content {
          width: 100%;
          border: transparent;
          background-repeat: no-repeat;
          background-position: right top;
          position: relative;
          &.off-shelves {
            background-image: url(../../../assets/images/off-shelves.png);
            &::after {
              content: '即将下架';
              color: #fff;
              position: absolute;
              right: 0;
              top: 0;
              width: 31px;
              height: 28px;
              line-height: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              word-break: break-word;
            }
          }
          &.new-arrival {
            background-image: url(../../../assets/images/new-arrival.png);
            &::after {
              content: '新品';
              color: #fff;
              position: absolute;
              right: 2px;
              top: 0;
              width: 31px;
              height: 28px;
              line-height: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              word-break: break-word;
            }
          }
          & > div:first-of-type {
            line-height: 24px;
            font-size: 16px;
            color: #1A1A1A;
            font-weight: bold;
          }
          .span-price {
            color: #FF4C4C;
            font-size: 16px;
            font-weight: bold;
            line-height: 24px;
          }
          .off-shelves-tips {
            font-size: 14px;
            color: #1A1A1A;
            & > span {
              color: #FF4C4C;
            }
          }
        }
      }
    }
    .left-filter-list {
      width: 100%;
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
      height: calc(100vh - 165px);
      padding-top: 16px;
      box-sizing: border-box;
      & .el-scrollbar__wrap {
        overflow-x: hidden !important;
      }
      .el-scrollbar__bar {
        z-index: 999;
      }
      .company-base-info {
        align-items: center;
        & > img {
          width: 59px;
        }
        & > div {
          height: 59px;
          flex: 1;
          margin-left: 20px;
          span {
            line-height: 20px;
            color: #999;
          }
        }
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
  ::v-deep.docs-dialog {
    .category-wrap {
      padding-top: 8px;
      &:first-of-type {
        padding-top: 0;
      }
      & > p {
        font-size: 16px;
        font-weight: bold;
        color: #1A1A1A;
        margin: 0 0 12px 0;
        padding-bottom: 12px;
        display: block;
        border-bottom: 1px solid #e6e6e6;
      }
      .docs-wrap {
        padding-bottom: 12px;
        margin-bottom: 12px;
        border-bottom: 1px solid #e6e6e6;
        color: #1A1A1A;
        font-size: 14px;
        & > div:first-of-type {
          overflow: hidden;
          flex: 1;
          padding-right: 24px;
        }
        .doc-name {
          flex: 1;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .export-btn{
    margin-left: auto;
  }

</style>
