<template>
  <el-dialog title="品牌信息"
             :visible="visible"
             :close-on-click-modal="false"
             @close="closeDialog"
             width="660px">
    <div class="form-content mb20">
      <div class="preview-images">
        <div class="image mb30">
          <div class="title">计划书PDF左上角LOGO</div>
          <el-upload
            class="image-content"
            :action="imageUrl"
            :show-file-list="false"
            :on-success="(...a) => handleAvatarSuccess('proposal_logo_pic', ...a)"
            :before-upload="beforeAvatarUpload">
            <!-- <img v-if="formModel.proposal_logo_pic_url"
                 :src="formModel.proposal_logo_pic_url"
                 class="avatar"> -->
            <el-image
                  v-if="formModel.proposal_logo_pic_url"
                  style="width: 262px; height: 120px"
                  :src="formModel.proposal_logo_pic_url"
                  fit="contain"
                  class="avatar"></el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="tips">
            建议分辨率：560*120，jpg或png格式
          </div>
        </div>
        <div class="image">
          <div class="title">计划书PDF左下角角标</div>
          <el-upload
            class="image-content"
            :action="imageUrl"
            :show-file-list="false"
            :on-success="(...a) => handleAvatarSuccess('proposal_corner_pic', ...a)"
            :before-upload="beforeAvatarUpload">
            <!-- <img v-if="formModel.proposal_corner_pic_url"
                 :src="formModel.proposal_corner_pic_url"
                 class="avatar"> -->
            <el-image
                  v-if="formModel.proposal_corner_pic_url"
                  style="width: 262px; height: 120px"
                  :src="formModel.proposal_corner_pic_url"
                  fit="contain"
                  class="avatar"></el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="tips">
            建议分辨率：560*60，jpg或png格式
          </div>
        </div>
      </div>
      <div class="preview-content">
        <div class="title">效果预览</div>
        <div class="content">
          <div class="preview-logo"
               :style="{ opacity: `${!formModel.proposal_logo_pic_url ? 0 : 1}`, backgroundColor: '#fff' }">
            <!-- <img width="100%"
                     height="100%"
                     :src="formModel.proposal_logo_pic_url"
                     alt=""> -->
            <div class="preview-img" :style="{ width: '96px', height: '20px', background: `url(${formModel.proposal_logo_pic_url}) no-repeat` }"></div>
            <!-- <el-image
                  style="width: 96px; height: 20px;background-color: #fff;"
                  :src="formModel.proposal_logo_pic_url"
                  fit="contain"></el-image> -->
          </div>
          <div class="preview-small-logo"
               :style="{ opacity: `${!formModel.proposal_corner_pic_url ? 0 : 1}`, backgroundColor: '#fff' }">
            <!-- <img width="100%"
                  height="100%"
                  :src="formModel.proposal_corner_pic_url"
                  alt=""> -->
            <div class="preview-img" :style="{ width: '90px', height: '10px', background: `url(${formModel.proposal_corner_pic_url}) no-repeat` }"></div>
            <!-- <el-image
                  style="width: 90px; height: 10px;background-color: #fff;"
                  :src="formModel.proposal_corner_pic_url"
                  fit="contain"></el-image> -->
          </div>
        </div>
      </div>
    </div>
    <div class="form-content mb10">
      <div class="preview-images">
        <div class="image mb30">
          <div class="title">微信分享缩略图</div>
          <el-upload
            class="image-content"
            :action="imageUrl"
            :show-file-list="false"
            :on-success="(...a) => handleAvatarSuccess('proposal_share_pic', ...a)"
            :before-upload="beforeAvatarUpload">
            <!-- <img v-if="formModel.proposal_share_pic_url"
                 :src="formModel.proposal_share_pic_url"
                 class="avatar"> -->
            <el-image
                  v-if="formModel.proposal_share_pic_url"
                  style="width: 262px; height: 120px"
                  :src="formModel.proposal_share_pic_url"
                  fit="contain"
                  class="avatar"></el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="tips">
            建议分辨率：120*120，jpg或png格式
          </div>
        </div>
        <div class="image">
          <div class="title mb14">计划书微信分享描述</div>
          <el-input type="textarea"
                    rows="6"
                    :maxlength="100"
                    placeholder="请输入计划书微信分享描述"
                    v-model="formModel.proposal_share_description"></el-input>
        </div>
      </div>
      <div class="preview-content">
        <div class="title">效果预览</div>
        <div class="content share-card">
          <div class="share-image"
               :style="{ opacity: `${!formModel.proposal_share_pic_url ? 0 : 1}` }">
            <!-- <img width="100%"
                  height="100%"
                  :src="formModel.proposal_share_pic_url"
                  alt=""> -->
            <el-image
                  style="width: 52px; height: 52px;background-color: #fff;"
                  :src="formModel.proposal_share_pic_url"
                  fit="contain"></el-image>
          </div>
          <div class="share-title">计划书微信分享标题</div>
          <div class="share-desc">
            {{ formModel.proposal_share_description }}
          </div>
        </div>
      </div>
    </div>
    <span slot="footer">
        <el-button @click="closeDialog" :loading="submitting">取消</el-button>
        <el-button type="primary" :loading="submitting" :disabled="submitting" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { updateCompanyDetail } from '@/apis/modules/company'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object
    }
  },
  watch: {
    visible(v) {
      const { proposal_logo_pic_id,
              proposal_logo_pic_url,
              proposal_corner_pic_id,
              proposal_corner_pic_url,
              proposal_share_pic_id,
              proposal_share_pic_url,
              proposal_share_description } = this.info
      if (v) {
        Object.assign(this.formModel, {
          proposal_logo_pic_id,
          proposal_logo_pic_url,
          proposal_corner_pic_id,
          proposal_corner_pic_url,
          proposal_share_pic_id,
          proposal_share_pic_url,
          proposal_share_description
        })
      }
    }
  },
  data() {
    return {
      formModel: {
        proposal_logo_pic_id: null,
        proposal_logo_pic_url: '',
        proposal_corner_pic_id: null,
        proposal_corner_pic_url: '',
        proposal_share_pic_id: null,
        proposal_share_pic_url: '',
        proposal_share_description: ''
      },
      submitting: false,
      imageUrl: process.env.VUE_APP_IMG_URL + '/api/images/upload'
    }
  },
  methods: {
    ...mapActions('users', ['getNotification']),
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传的图片只能是 JPG / PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    handleAvatarSuccess(type, res) {
      this.formModel[`${type}_url`] = res.data.url
      this.formModel[`${type}_id`] = res.data.img_id
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.submitting = true
      updateCompanyDetail(this.formModel).then(() => {
        this.$message.success('修改成功')
        this.getNotification()
        this.closeDialog()
        this.$emit('fresh')
      }).finally(() => this.submitting = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 436px;
  border-radius: 4px;
  border: 1px solid #E6E6E6;
  .preview-images {
    padding: 20px;
    width: 50%;
    border-right: 1px solid #E6E6E6;
    .title {
      color: #4D4D4D;
      font-size: 14px;
    }
    .tips {
      margin-top: 8px;
      color: #999999;
      font-size: 14px;
    }
    .image-content {
      margin-top: 14px;
      width: 262px;
      height: 120px;
      border-radius: 4px;
      border: 1px dashed #E6E6E6;
    }
  }
  .preview-content {
    width: 50%;
    background-color: #F5F5F5;
    .title {
      padding: 26px;
      color: #1A1A1A;
      text-align: center;
    }
    .content {
      position: relative;
      margin: 10px auto;
      width: 212px;
      height: 300px;
      background-color: #fff;
      background-image: url(../../../assets/images/proposal-logo-placeholder.png),
                        url(../../../assets/images/proposal-content-placeholder.png),
                        url(../../../assets/images/proposal-small-logo-placeholder.png);
      background-repeat: no-repeat;
      background-size: 45%, 85%, 45%;
      background-position: 16px 20px, 16px 58px, 16px 274px;
      .preview-logo {
        position: absolute;
        top: 20px;
        left: 16px;
        width: 96px;
        height: 20px;
      }
      .preview-small-logo {
        position: absolute;
        bottom: 16px;
        left: 16px;
        width: 90px;
        height: 10px;
      }
      &.share-card {
        position: relative;
        margin-top: 100px;
        padding: 14px;
        width: 256px;
        height: 107px;
        background-image: url(../../../assets/images/proposal-share-placeholder.png);
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
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
      }
    }
  }
}
.preview-img {
  background-size: contain !important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 262px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 262px;
  height: 120px;
  display: block;
}
</style>