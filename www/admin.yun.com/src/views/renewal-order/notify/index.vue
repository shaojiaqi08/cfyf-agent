<template>
  <div class="renewal-notify page-container">
    <div class="left-content">
      <div class="header">投保人信息</div>
    </div>
    <div class="right-content">
      <div class="follow-head">
        <span class="order-name">复星联合康乐一生重大疾病保超长…</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            本次续保<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="step-wrap">
        <div class="step-item">
          <i></i>
          <span>未跟踪</span>
        </div>
        <div class="step-item">
          <i></i>
          <span>跟踪中</span>
        </div>
        <div class="step-item">
          <i></i>
          <span>未联系上</span>
        </div>
        <div class="step-item">
          <i></i>
          <span>放弃续保</span>
        </div>
        <div class="step-item">
          <i></i>
          <span>其他</span>
        </div>
      </div>
      <el-scrollbar></el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "renewal-notify"
}
</script>

<style scoped lang="scss">
.renewal-notify {
  display: flex;
  height: 100%;
  .left-content {
    flex: 1;
    margin-right: 12px;
    overflow: hidden;
    background-color: #fff;
    .header {
      font-size: 16px;
      font-weight: bold;
      padding: 0 16px;
      height: 56px;
      background: #f5f5f5;
      border-radius: 4px 4px 0px 0px;
      border: 1px solid #e6e6e6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-input {
        width: 360px;
      }
    }
  }
  .right-content {
    background-color: #fff;
    width: 400px;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .follow-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 49px;
      padding: 0 16px;
      & > .order-name {
        display: block;
        width: 256px;
        color: #131415;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .step-wrap {
      padding: 0 16px 12px 16px;
      display: flex;
      align-items: center;
      .step-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        i {

        }
        span {
          line-height: 17px;
        }
      }
    }
  }
}
</style>
