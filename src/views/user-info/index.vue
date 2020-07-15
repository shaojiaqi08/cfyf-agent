<template>
  <div>
    <div class="user-info">
      <div class="header">
        个人信息
      </div>
      <div class="body">
        <div class="item">
          <div class="label">头像</div>
          <div class="value">
            <div class="avatar"></div>
          </div>
        </div>
        <div class="item">
          <div class="label">姓名</div>
          <div class="value">姓名</div>
        </div>
        <div class="item">
          <div class="label">邮箱</div>
          <div class="value">21ASD23DR31223@xxxx.com</div>
        </div>
        <div class="item">
          <div class="label">账号</div>
          <div class="value">VASDD23344</div>
        </div>
        <div class="item">
          <div class="label">手机号</div>
          <div class="value">13568689605</div>
        </div>
        <div class="item">
          <div class="label">角色</div>
          <div class="value">角色职位职称</div>
        </div>
        <div class="item">
          <div class="label">密码</div>
          <div class="value">
            <el-button type="primary"
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
export default {
  components: {
    modifyPassword
  },
  data() {
    return {
      isModiifyPasswordShow: false
    }
  },
  methods: {
    changePassword() {
      this.isModiifyPasswordShow = true
    }
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
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid rgba(230,230,230,1);
  }
  .body {
    background-color: #fff;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      .label {
        color: #999999;
      }
      .value {
        color: #1A1A1A;
        .avatar {
          width: 40px;
          height: 40px;
          background: url(../../assets/images/avatar.png) no-repeat;
          background-size: cover;
          overflow: hidden;
        }
      }
    }
  }
}
</style>