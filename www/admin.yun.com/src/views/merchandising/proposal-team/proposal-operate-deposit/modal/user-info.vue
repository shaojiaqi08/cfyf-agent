<template>
  <el-dialog width="324px"
             :visible="show"
             :close-on-click-modal="false"
             title="计划书个人展示"
             @close="modalClose">
    <!-- <div class="avatar"></div> -->
    <el-upload
      class="avatar"
      :action="imageUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="userInfo.avatar_url" :src="userInfo.avatar_url" class="avatar-image">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-form class="form" label-position="right">
      <el-form-item label="姓名">
        <el-input class="input"
                  v-model="userInfo.nickname"
                  placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-input class="input"
                  v-model="userInfo.role_name"
                  placeholder="请输入职位称号"></el-input>
      </el-form-item>
      <el-form-item label="介绍">
        <el-input class="input"
                  type="textarea"
                  rows="4"
                  v-model="userInfo.illustration"
                  placeholder="请输入内容介绍"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="modalClose">取消</el-button>
      <el-button type="primary"
                 @click="updateProposalMasterInfo"
                 :loading="isButtonLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { updateProposalMasterInfo } from '@/apis/modules/proposal'
export default {
  props: {
    show: {
      required: true,
      type: Boolean
    },
    userInfo: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      isButtonLoading: false,
      imageUrl: process.env.IMG_URL + '/api/images/upload'
    }
  },
  methods: {
    updateProposalMasterInfo() {
      this.isButtonLoading = true
      updateProposalMasterInfo(this.userInfo)
      .then(res => {
        this.isButtonLoading = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.modalClose()
      })
    },
    handleAvatarSuccess(res, file) {
      this.userInfo.avatar_url = URL.createObjectURL(file.raw)
      this.userInfo.avatar = res.data.img_id
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    modalClose() {
      this.$emit('update:show', false)
      this.$emit('fresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  margin: 0 auto;
  width: 92px;
  height: 92px;
  background-color: #e6e6e6;
  border-radius: 50%;
  overflow: hidden;
  .avatar-image {
    width: 100%;
    height: 100%;
  }
}
.form {
  margin-top: 20px;
  .el-form-item {
    margin: 0 0 20px!important;
    .input {
      width: 240px;
    }
  }
}
</style>
