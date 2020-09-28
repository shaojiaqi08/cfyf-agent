<template>
  <div class="header">
    <div class="logo normal-transition"></div>
    <div class="right-function-button-group">
      <el-tooltip v-if="$checkAuth('/company_info') || $checkAuth('/company_finance_info') || $checkAuth('/company_brand_info')" effect="dark" content="公司资料" placement="bottom">
          <div class="function-botton" @click="$router.push('/company')">
            <el-badge is-dot :hidden="notificationInfo && notificationInfo.company_profile && !notificationInfo.company_profile.is_show">
              <i class="iconfont iconda24_gongsiziliao1 fs24"></i>
            </el-badge>
          </div>
      </el-tooltip>
      <el-tooltip v-if="$checkAuth('/self_and_child_teams')" effect="dark" content="团队成员" placement="bottom">
        <div class="function-botton" @click="$router.push('/group')">
          <i class="iconfont iconda24_tuanduichengyuan1 fs24"></i>
        </div>
      </el-tooltip>
      <el-popover
              placement="bottom"
              width="120"
              v-model="isPopoverShow"
              popper-class="popper-box"
              trigger="click">
        <div class="menu-list">
          <div class="menu-list-item"
              @click="jump2UserInfo">
            <i class="mr4 iconfont iconxiao16_gerenxinxi"></i>
            个人信息
          </div>
          <div class="menu-list-item" @click="loginOut">
            <i class="mr4 iconfont iconxiao16_tuichudenglu"></i>
            退出登录
          </div>
        </div>
        <div class="user-info normal-transition" slot="reference">
          <div class="user">
            <div class="avatar" :style="{backgroundImage: `url('${userInfo.avatar_url || require('../../assets/images/avatar-default.png')}')`}"></div>
            <div>
              <div class="name">
                {{userInfo.real_name}}
                <span style="color: #C2C2C2;"> | </span>
                {{userInfo.sales_position && userInfo.sales_position.name}}</div>
              <div class="departmant">{{ userInfo.company.name }}</div>
            </div>
            <i class="iconfont iconxiao16_xiajiantou ml4"></i>
          </div>
          <!-- <div class="permission">
            {{userInfo.sales_position && userInfo.sales_position.name}}
            <i class="iconfont iconxiao16_xiajiantou ml4"></i>
          </div> -->
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
  import {loginOut} from '@/apis/modules'
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        isPopoverShow: false,
        submitting: false
      }
    },
    computed: {
      ...mapState('users', ['userInfo', 'notificationInfo'])
    },
    methods: {
      jump2UserInfo() {
        this.$router.push({ path: '/user-info' })
        this.isPopoverShow = false
      },
      loginOut() {
        if (this.submitting) return
        this.submitting = true
        loginOut().finally(() => this.$store.dispatch('users/logout'))
        this.$router.replace({ path: '/login' })
      }
    }
  }
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 30px;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #E6E6E6;
  background-color: #e1e3e6;
  z-index: 2;
  .right-function-button-group {
    display: flex;
    align-items: center;
    .function-botton {
      margin-left: 16px;
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 4px;
      color: #4d4d4d;
      // opacity: .6;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
      &:hover {
        color: #1a1a1a;
        opacity: 1;
        background-color: rgba(0, 0, 0, .1);
      }
    }
  }
  .logo {
    width: 280px;
    height: 32px;
    background: url(../../assets/images/navbar-logo.png) no-repeat;
    background-size: cover;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
  .user-info {
    display: flex;
    align-items: center;
    height: 24px;
    // opacity: 0.6;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
    .user {
      display: flex;
      align-items: center;
      margin-right: 8px;
      margin-left: 16px;
      .avatar {
        display: inline-block;
        margin-right: 8px;
        width: 32px;
        height: 32px;
        border-radius: 16px;
        overflow: hidden;
        background-size: cover;
      }
      .name {
        display: inline-block;
        font-weight: bold;
        font-size: 12px;
      }
      .departmant {
        margin-top: 2px;
        font-size: 12px;
        color: #999999;
      }
    }
    .permission {
      display: flex;
      align-items: center;
      color: #999;
    }
  }
}
::v-deep .el-badge__content.is-fixed.is-dot {
  top: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
}
</style>

<style lang="scss">
.popper-box {
  padding: 0 !important;
  min-width: 120px !important;
  .menu-list {
    margin-top: 8px;
    .menu-list-item {
      display: flex;
      justify-content: center;
      width: 100%;
      margin: 0 auto;
      align-items: center;
      white-space: nowrap;
      padding: 18px;
      color: #4D4D4D;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #1F78FF;
        background-color: rgba(31, 120, 255, 0.1);
      }
    }
  }
}
</style>