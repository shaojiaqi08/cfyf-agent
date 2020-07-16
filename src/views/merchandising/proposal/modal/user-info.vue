<template>
  <el-dialog width="480px"
             :visible="show"
             :close-on-click-modal="false"
             title="计划书个人展示"
             @close="modalClose">
    <el-form class="form" label-position="right">
      <el-form-item label="头像">
        <el-upload
                class="avatar"
                :action="imageUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
          <img :src="userInfo.avatar_url" class="avatar-image">
        </el-upload>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input class="input"
                  v-model="userInfo.nickname"
                  placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-input class="input"
                  v-model="userInfo.role_name"
                  placeholder="请输入职位"></el-input>
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
                 :loading="isButtonLoading" :disabled="isButtonLoading">确认</el-button>
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
      .then(() => {
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
  width: 48px;
  height: 48px;
  background-color: #f5f5f5;
  border: 1px solid #e6e6e6;
  border-radius: 50%;
  overflow: hidden;
  .avatar-image {
    width: 49px;
    height: 49px;
    transform: translate(-1px, -1px);
  }
}
.form {
  .el-form-item {
    margin: 0 0 20px!important;
    display: flex;
    align-items: center;
    .input {
      width: 394px;
    }
  }
}
</style>
