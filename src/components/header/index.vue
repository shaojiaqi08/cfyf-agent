<template>
  <div class="header">
    <div class="logo"></div>
    <el-popover
      placement="bottom"
      title="标题"
      width="200"
      trigger="click"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
      <div class="user-info" slot="reference">
        <div class="user">
          <div class="avatar"></div>
          <div class="name">颠三倒四的是</div>
        </div>
        <div class="permission">
          管理员角色
          <i class="iconfont iconxiao16_xiajiantou"></i>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #E6E6E6;
  .logo {
    width: 200px;
    height: 24px;
    background-color: #ccc;
  }
  .user-info {
    display: flex;
    align-items: center;
    height: 24px;
    cursor: pointer;
    .user {
      display: flex;
      align-items: center;
      margin-right: 8px;
      .avatar {
        display: inline-block;
        margin-right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        overflow: hidden;
        background: url(../../assets/images/avatar.png) no-repeat;
        background-size: cover;
      }
      .name {
        display: inline-block;
      }
    }
    .permission {
      display: inline-block;
      color: #999999;
    }
  }
}
</style>