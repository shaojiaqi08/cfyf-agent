<template>
  <div>
    <div class="login-logo">
      <div class="logo"></div>
      <div class="title">创富云服</div>
    </div>
    <div class="login-form">
      <div class="title">欢迎登录创富云服</div>
      <div class="form">
        <div class="form-item">
          <div class="label">账号</div>
          <div class="input">
            <el-input placeholder="请输入账号名"
                      v-model="username"
                      clearable
                      @focus="inputFocus"
                      @blur="inputBlur"></el-input>
          </div>
        </div>
        <div class="form-item">
          <div class="label">密码</div>
          <div class="input">
            <div class="click-block" @click="togglePasswordShow"></div>
            <el-input placeholder="请输入密码"
                      v-model="password"
                      :type="`${isPasswordShow ? 'text' : 'password'}`"
                      :suffix-icon="`iconfont fs14 ${isPasswordShow ? 'iconxiao16_dangqianchakan' : 'iconxiao16_dangqianyincang'}`"
                      @focus="inputFocus"
                      @blur="inputBlur"></el-input>
          </div>
        </div>
        <el-button type="primary"
                   size="medium"
                   class="block"
                   :loading="submitting"
                   :disabled="submitting"
                    @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {login, getUserDetail} from '@/apis/modules/index'
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      username: '',
      password: '',
      isPasswordShow: false,
      submitting: false
    }
  },
  methods: {
    ...mapActions('users', ['updateUserInfo']),
    login() {
      const {username, password} = this
      this.submitting = true
      login({
        username, password
      }).then(res => {
        // 更新token
        this.updateUserInfo(res)
        getUserDetail().then(ud => {
          this.updateUserInfo({...res, ...ud})
          const path = this.$route.query.redirect || '/user-info'
          this.$router.replace(path)
        }).finally(() => {
          this.submitting = false
        })
      }).catch(() => {
        this.submitting = false
      })
    },
    inputFocus(e) {
      e.target.parentElement.classList.add('focus')
    },
    inputBlur(e) {
      e.target.parentElement.classList.remove('focus')
    },
    togglePasswordShow() {
      this.isPasswordShow = !this.isPasswordShow
    },
    handleEnter(e) {
      if (e.keyCode === 13) {
        this.login()
      }
    }
  },
  created() {
    document.addEventListener('keyup', this.handleEnter)
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.handleEnter)
  }
}
</script>

<style lang="scss" scoped>
.login-logo {
  margin: 120px auto 0;
  width: 120px;
  height: 120px;
  .logo {
    margin: 0 auto;
    width: 72px;
    height: 72px;
    background-color: #FF9000;
    border-radius: 7px;
  }
  .title {
    margin-top: 10px;
    color: #1E1E1E;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
}
.login-form {
  margin: 18px auto;
  padding: 24px;
  width: 288px;
  height: 320px;
  // text-align: center;
  background-color: #fff;
  border-radius: 4px;
  .title {
    color: #1A1A1A;
    font-size: 28px;
    font-weight: bold;
  }
  .form {
    margin-top: 20px;
    .form-item {
      margin-bottom: 24px;
      .label {
        margin-bottom: 10px;
        text-align: left;
        color: #999;
        font-size: 14px;
      }
      .input {
        position: relative;
        .click-block {
          position: absolute;
          width: 36px;
          height: 36px;
          right: 0;
          top: 0;
          cursor: pointer;
          z-index: 1;
        }
        ::v-deep .el-input {

          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #E6E6E6;
          }
          &.focus:after {
            background-color: #FF9000;
          }
        }
        ::v-deep .el-input__inner {
          border: none !important;
          padding-left: 0;
          &:after {
            content: 'dsds';
            position: absolute;
            bottom: 0;
          }
        }
      }
    }
  }
}
.bottom-tips {
  margin-top: 20px;
  color: #999999;
  font-size: 14px;
  text-align: center;
}
</style>