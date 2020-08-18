<template>
  <div>
    <div class="login-logo">
      <div class="logo"></div>
    </div>
    <div class="login-form">
      <div class="title">欢迎登录创富云服</div>
      <div class="form">
        <div class="form-item">
          <!-- <div class="label">账号</div> -->
          <div class="input">
            <el-input placeholder="请输入账号名"
                      v-model.trim="username"
                      clearable
                      @focus="inputFocus"
                      @blur="inputBlur"></el-input>
          </div>
        </div>
        <div class="form-item">
          <!-- <div class="label">密码</div> -->
          <div class="input">
            <div class="click-block" @click="togglePasswordShow"></div>
            <el-input placeholder="请输入密码"
                      v-model.trim="password"
                      :type="`${isPasswordShow ? 'text' : 'password'}`"
                      :suffix-icon="`iconfont passage-word-icon fs14 ${isPasswordShow ? 'iconxiao16_dangqianchakan' : 'iconxiao16_dangqianyincang'}`"
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
import {login, getUserDetail, simulatedLogin, getPermission} from '@/apis/modules/index'
import {mapActions, mapState} from 'vuex'
export default {
  data() {
    return {
      username: '',
      password: '',
      isPasswordShow: false,
      submitting: false
    }
  },
  computed: {
    ...mapState('users', ['userInfo'])
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
        const path = this.$route.query.redirect
        // 获取权限
        getPermission().then(p => {
          this.updateUserInfo({...this.userInfo, permissions: p})
        })
        // 如果不是跳转到个人信息页就获取用户信息
        if (path && !path.includes('user-info')) {
          getUserDetail().then(ud => {
            this.updateUserInfo({...this.userInfo, ...ud})
            this.$router.replace(path)
          })
        } else {
          this.$router.replace('/user-info')
        }
      }).catch(err => {console.log(err)}).finally(() => {
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
      const {submitting, username, password} = this
      if (e.keyCode === 13 && !submitting && username && password) {
        this.login()
      }
    }
  },
  created() {
    const query = this.$route.query
    if (query._sign) {
      this.submitting = true
      simulatedLogin(query).then(res => {
        this.updateUserInfo(res)
        this.$router.replace('/user-info')
      }).finally(() => {
        this.submitting = false
      })
    }
    document.addEventListener('keyup', this.handleEnter)
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.handleEnter)
  }
}
</script>

<style lang="scss" scoped>
.login-logo {
  margin: 140px auto 0;
  width: 120px;
  height: 140px;
  .logo {
    margin: 0 auto;
    width: 120px;
    height: 140px;
    background: url(../../assets/images/login-logo.png) no-repeat;
    background-size: contain;
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
  height: 276px;
  // text-align: center;
  background-color: #fff;
  border-radius: 4px;
  .title {
    text-align: center;
    color: #1A1A1A;
    font-size: 28px;
    font-weight: bold;
  }
  .form {
    margin-top: 40px;
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
        ::v-deep .passage-word-icon {
          color: #4d4d4d;
        }
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
          .el-input__inner {
            // padding-left: 10px;
          }
          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #E6E6E6;
          }
          &.focus:after {
            background-color: #1F78FF;
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