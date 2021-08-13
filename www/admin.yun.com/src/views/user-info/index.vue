<template>
  <div>
    <div class="user-info" v-loading="loading">
      <div class="header">
        个人信息
      </div>
      <div class="body">
        <div class="item">
          <div class="label">头像</div>
          <div class="value">
            <el-upload
                    class="avatar"
                    :action="imageUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
              <div class="avatar" :style="{backgroundImage: `url('${userInfo.avatar_url || require('../../assets/images/avatar.png')}')`}"></div>
            </el-upload>
          </div>
        </div>
        <div class="item">
          <div class="label">姓名</div>
          <div class="value">{{userInfo.real_name || '-'}}</div>
        </div>
        <div class="item">
          <div class="label">邮箱</div>
          <div class="value">{{userInfo.email || '-'}}</div>
        </div>
        <div class="item">
          <div class="label">账号</div>
          <div class="value">{{userInfo.username  || '-'}}</div>
        </div>
        <div class="item">
          <div class="label">手机号</div>
          <div class="value">{{userInfo.mobile || '-'}}</div>
        </div>
        <div class="item">
          <div class="label">角色</div>
          <div class="value">{{userInfo.sales_position && userInfo.sales_position.name || '-'}}</div>
        </div>
        <div class="item">
          <div class="label">密码</div>
          <div class="value">
            <el-button type="text"
                       style="margin-right: -12px;"
                       @click="changePassword">
              <i class="iconfont iconxiao16_bianji"></i>
              修改密码
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <modify-password :show.sync="isModiifyPasswordShow"></modify-password>
  </div>
</template>

<script>
  import modifyPassword from './modal/modify-password'
  import {uploadHeadImg, getUserDetail} from '@/apis/modules'
  import {mapState, mapActions} from 'vuex'
  export default {
    components: {
      modifyPassword
    },
    data() {
      return {
        isModiifyPasswordShow: false,
        loading: false
      }
    },
    computed: {
      ...mapState('users', ['userInfo']),
      imageUrl() {
        return process.env.VUE_APP_IMG_URL + '/api/images/upload'
      }
    },
    methods: {
      ...mapActions('users', ['updateUserInfo']),
      changePassword() {
        this.isModiifyPasswordShow = true
      },
      handleAvatarSuccess(res) {
        const {img_id: avatar_id, url} = res.data
        uploadHeadImg({avatar_id}).then(() => {
          this.$store.dispatch('users/updateUserInfo',{
            ...this.userInfo,
            avatar_id,
            avatar_url: url
          })
          this.$message.success('头像更新成功!')
        })
      },
      beforeAvatarUpload(file) {
        if (!/.*\.(jpg|png)$/i.test(file.name)) {
          this.$message.error('上传文件格式错误，请上传 jpg | png 格式')
          return false
        }
        if (file.size / 1024 / 1024 > 2) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
          return false
        }
        return true
      },
      getUserDetail() {
        this.loading = true
        getUserDetail().then(ud => {
          this.updateUserInfo({...this.userInfo, ...ud})
        }).finally(() => {
          this.loading = false
        })
      }
    },
    created() {
      this.getUserDetail()
    }
  }
</script>

<style lang="scss" scoped>
  .user-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 320px;
    height: 452px;
    border: 1px solid rgba(230,230,230,1);
    border-radius: 4px;
    .header {
      padding: 16px;
      width: 100%;
      background-color: #F5F5F5;
      color: #1A1A1A;
      font-size: 18px;
      line-height: 1.6;
      font-weight: bold;
      border-bottom: 1px solid rgba(230,230,230,1);
    }
    .body {
      background-color: #fff;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px;
        font-weight: bold;
        line-height: 1.45;
        .label {
          color: #999999;
        }
        .value {
          color: #1A1A1A;
          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            background: no-repeat;
            background-size: cover;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
