<template>
  <div class="menu">
    <el-scrollbar class="menu-list scrollbar">
      <div class="menu-header">
        <i class="mr8 iconfont iconcebiandaohang20_yeji"></i>
        业绩
      </div>
      <div class="normal-transition menu-item actived">
        订单
      </div>
      <div class="menu-header">
        <i class="mr8 iconfont iconcebiandaohang20_shangpin"></i>
        商品管理
      </div>
      <div class="normal-transition menu-item">
        费率管理
      </div>
      <div class="normal-transition menu-item">
        商品上下架
      </div>
      <div class="menu-header">
        <i class="mr8 iconfont iconcebiandaohang20_yonghuguanli"></i>
        用户管理
      </div>
      <div class="normal-transition menu-item"
           title="B端公司">
        B端公司
      </div>
      <div class="normal-transition menu-item"
           title="内部管理员">
        内部管理员
      </div>
      <div class="normal-transition menu-item"
           title="内部管理员内部管理员内部管理员">
        内部管理员内部管理员内部管理员
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  top: 40px;
  left: 0;
  width: 180px;
  height: 1000px;
  .menu-list {
    padding: 20px 0 20px 20px;
    height: 96vh;
    .menu-header {
      margin-top: 24px;
      margin-bottom: 8px;
      padding: 3px 8px;
      width: 140px;
      color: #4D4D4D;
      font-size: 16px;
      &:first-child {
        margin-top: 0;
      }
    }
    .menu-item {
      padding: 10px 0 10px 36px;
      width: 140px;
      height: 40px;
      color: #999999;
      font-size: 14px;
      line-height: 22px;
      border-radius: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &.actived {
        color: #FF9000;
        &:hover {
          background-color: #F0F0F0;
        }
      }
      &:hover {
        background-color: #E6E6E6;
      }
    }
  }
}
</style>
