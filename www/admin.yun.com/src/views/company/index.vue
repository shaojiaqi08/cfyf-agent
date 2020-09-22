<template>
  <el-scrollbar class="scrollbar" style="height: 94vh;" v-loading="loading">
    <div class="company-info-card">
      <div class="company-info-header">
        <span>企业信息</span>
        <span class="tips">如公司资料有误，请联系创富云服管理员</span>
      </div>
      <div class="company-info-body">
        <el-row>
          <el-col class="mb12" :span="6">
            <span class="item-label">主体类型</span>
            <span class="item-value">{{ companyInfo.subject_str }}</span>
          </el-col>
          <el-col class="mb12" :span="6">
            <span class="item-label">渠道</span>
            <span class="item-value">{{ companyInfo.sale_channel_str }}</span>
          </el-col>
          <el-col class="mb12" :span="6">
            <span class="item-label">企业名称</span>
            <span class="item-value">
              <text-hidden-ellipsis class="ellipsis-block" :width="200" :popoverTip="companyInfo.name">
                {{ companyInfo.name }}
              </text-hidden-ellipsis>
            </span>
          </el-col>
          <el-col class="mb12" :span="6">
            <span class="item-label">企业营业执照</span>
            <span class="item-value">{{ companyInfo.business_license_file_state_desc }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="mb12" :span="6">
            <span class="item-label">服务费发票类型</span>
            <span class="item-value">{{ companyInfo.invoice_type_str }}</span>
          </el-col>
          <el-col class="mb12" :span="6">
            <span class="item-label">发票税点</span>
            <span class="item-value">{{ companyInfo.invoice_tax_point }}%</span>
          </el-col>
          <el-col class="mb12" :span="6">
            <span class="item-label">所属城市</span>
            <span class="item-value">{{ companyInfo.province_name }}{{ companyInfo.city_name }}</span>
          </el-col>
          <el-col class="mb12" :span="6">
            <span class="item-label">详细地址</span>
            <span class="item-value">
              <text-hidden-ellipsis class="ellipsis-block" :width="200" :popoverTip="companyInfo.address">
                {{ companyInfo.address }}
              </text-hidden-ellipsis>
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="mb12" :span="6">
            <span class="item-label">固定电话</span>
            <span class="item-value">{{ companyInfo.telephone }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="company-info-card">
      <div class="company-info-header">
        财务信息
      </div>
      <div class="company-info-body">
        <el-row>
          <el-col class="mb12" :span="6">
            <span class="item-label">账户类型</span>
            <span class="item-value">{{ companyInfo.company_finance.account_type_str }}</span>
          </el-col>
          <el-col class="mb12" :span="6">
            <span class="item-label">户名</span>
            <span class="item-value">{{ companyInfo.company_finance.account_name }}%</span>
          </el-col>
          <el-col class="mb12" :span="6">
            <span class="item-label">开户地址</span>
            <span class="item-value">{{ companyInfo.company_finance.account_addr }}</span>
          </el-col>
          <el-col class="mb12" :span="6">
            <span class="item-label">开户银行</span>
            <span class="item-value">{{ companyInfo.company_finance.bank_name }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="mb12" :span="6">
            <span class="item-label">银行卡号</span>
            <span class="item-value">{{ companyInfo.company_finance.account_number }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="company-info-card">
      <div class="company-info-header">
        <span>品牌信息</span>
        <span class="tips">
          请完善品牌信息，获得更好的分享体验
          <el-button icon="iconfont iconxiao16_bianji"
                     type="primary"
                     size="small"
                     class="ml16"
                     @click="edit"> 编辑</el-button>
        </span>
      </div>
      <div class="company-info-body">
        <div class="preview-card mb16">
          <div class="preview-images">
            <div class="image">
              <div class="title">计划书PDF左上角LOGO</div>
              <div class="content logo">
                <img width="100%"
                     height="100%"
                     :style="{ opacity: `${!companyInfo.company_details.proposal_log_pic_url ? 0 : 1}` }"
                     :src="companyInfo.company_details.proposal_log_pic_url"
                     alt="">
              </div>
            </div>
            <div class="image">
              <div class="title">计划书PDF左下角角标</div>
              <div class="content small-logo">
                <img width="100%"
                     height="100%"
                     :style="{ opacity: `${!companyInfo.company_details.proposal_corner_pic_url ? 0 : 1}` }"
                     :src="companyInfo.company_details.proposal_corner_pic_url"
                     alt="">
              </div>
            </div>
          </div>
          <div class="preview-total">
            <div class="title">效果预览</div>
            <div class="content">
              <div class="preview-logo"
                   :style="{ opacity: `${!companyInfo.company_details.proposal_log_pic_url ? 0 : 1}` }">
                <img width="100%"
                     height="100%"
                     :src="companyInfo.company_details.proposal_log_pic_url"
                     alt="">
              </div>
              <div class="preview-small-logo"
                   :style="{ opacity: `${!companyInfo.company_details.proposal_corner_pic_url ? 0 : 1}` }">
                <img width="100%"
                     height="100%"
                     :src="companyInfo.company_details.proposal_corner_pic_url"
                     alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="preview-card">
          <div class="preview-images">
            <div class="image">
              <div class="title">计划书微信分享缩略图</div>
              <div class="content wechat">
                <img width="100%"
                     height="100%"
                     :style="{ opacity: `${!companyInfo.company_details.proposal_share_pic_url ? 0 : 1}` }" 
                     :src="companyInfo.company_details.proposal_share_pic_url"
                     alt="">
              </div>
            </div>
            <div class="image">
              <div class="title">计划书微信分享描述</div>
              <div class="content">
                {{ companyInfo.company_details.proposal_share_description }}
              </div>
            </div>
          </div>
          <div class="preview-total">
            <div class="title">效果预览</div>
            <div class="content share-card">
              <div class="share-image"
                   :style="{ opacity: `${!companyInfo.company_details.proposal_share_pic_url ? 0 : 1}` }" >
                <img width="100%"
                     height="100%"
                     :src="companyInfo.company_details.proposal_share_pic_url"
                     alt="">
              </div>
              <div class="share-title">计划书微信分享标题</div>
              <div class="share-desc">
                {{ companyInfo.company_details.proposal_share_description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <edit-company-info :visible.sync="visible" :info="companyInfo" @fresh="getCompanyDetail"></edit-company-info>
  </el-scrollbar>
</template>

<script>
import editCompanyInfo from './modal/index'
import { getCompanyDetail } from '@/apis/modules/company'
import textHiddenEllipsis from '@/components/text-hidden-ellipsis'
export default {
  components: { 
    editCompanyInfo,
    textHiddenEllipsis
  },
  data() {
    return {
      visible: false,
      loading: false,
      companyInfo: {}
    }
  },
  methods: {
    edit() {
      this.visible = true
    },
    getCompanyDetail() {
      this.loading = true
      getCompanyDetail().then(res => {
        this.companyInfo = res
      }).finally(() => this.loading = false)
    }
  },
  mounted() {
    this.getCompanyDetail()
  }
}
</script>

<style lang="scss" scoped>
.company-info-card {
  margin: 0 auto 16px;
  width: 1200px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #E6E6E6;
  .company-info-header {
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    background-color: #F5F5F5;
    height: 56px;
    line-height: 56px;
    color: #1A1A1A;
    font-size: 16px;
    font-weight: 500;
    .tips {
      color: #999;
      font-size: 14px;
    }
  }
  .company-info-body {
    padding: 16px;
    color: #999;
    .item-label {
      color: #4D4D4D;
    }
    .item-value {
      margin-left: 8px;
      font-weight: 500;
      color: #1A1A1A;
      .ellipsis-block {
        display: inline-flex;
      }
    }
    .preview-card {
      display: flex;
      justify-content: space-between;
      width: 100%;
      background-color: #F5F5F5;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      .preview-images {
        width: 320px;
        height: 376px;
        .image {
          width: 100%;
          height: 188px;
          border-right: 1px solid #E6E6E6;
          background-color: #fff;
          overflow: hidden;
          .title {
            margin: 20px auto;
            color: #1A1A1A;
            text-align: center;
          }
          .content {
            margin: 0 auto;
            width: 280px;
            height: 104px;
            line-height: 20px;
            background-size: contain;
            background-position: 50%;
            background-repeat: no-repeat;
            &.logo {
              background-image: url(../../assets/images/proposal-logo-placeholder.png);
            }
            &.small-logo {
              background-image: url(../../assets/images/proposal-small-logo-placeholder.png);
            }
            &.wechat {
              background-image: url(../../assets/images/proposal-share-placeholder.png);
            }
          }
        }
      }
      .preview-total {
        width: 848px;
        .title {
          padding: 20px 0;
          text-align: center;
          color: #1A1A1A; 
        }
        .content {
          position: relative;
          margin: 0 auto;
          width: 212px;
          height: 300px;
          background-color: #fff;
          border-radius: 4px;
          background-image: url(../../assets/images/proposal-logo-placeholder.png),
                            url(../../assets/images/proposal-content-placeholder.png),
                            url(../../assets/images/proposal-small-logo-placeholder.png);
          background-repeat: no-repeat;
          background-size: 45%, 85%, 45%;
          background-position: 16px 20px, 16px 58px, 16px 274px;
          .preview-logo {
            position: absolute;
            top: 16px;
            left: 16px;
            width: 96px;
            height: 24px;
          }
          .preview-small-logo {
            position: absolute;
            bottom: 18px;
            left: 16px;
            width: 90px;
            height: 10px;
          }
          &.share-card {
            position: relative;
            padding: 14px;
            margin-top: 100px;
            width: 256px;
            height: 107px;
            background-image: url(../../assets/images/proposal-share-placeholder.png);
            background-repeat: no-repeat;
            background-size: 20%;
            background-position: 190px 36px;
            .share-image {
              position: absolute;
              top: 36px;
              right: 14px;
              width: 52px;
              height: 52px;
            }
            .share-title {
              text-align: left;
              color: #1A1A1A;
              font-size: 16px;
              font-weight: 500;
            }
            .share-desc {
              margin-top: 6px;
              width: 168px;
              font-size: 13px;
              line-height: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
