<template>
  <div class="renewal-notify page-container">
    <div class="left-content">
      <div class="header">投保人信息</div>
    </div>
    <div class="right-content">
      <div class="follow-head">
        <el-tooltip content="复星联合康乐一生重大疾病保超长…" placement="top">
          <span class="order-name">复星联合康乐一生重大疾病保超长…</span>
        </el-tooltip>
        <el-dropdown>
          <span class="el-dropdown-link">
            本次续保<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>a</el-dropdown-item>
            <el-dropdown-item>b</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="step-wrap">
        <div
          v-for="(item, index) in stepData"
          :key="index"
          class="step-item"
          :class="{ active: index <= stepIndex }">
          <i class="iconfont" :class="index <= stepIndex ? 'icona-zhong20_duigou_xuanzhong' : 'icona-zhong20_duigou_weixuanzhong'"></i>
          <span>{{item.label}}</span>
        </div>
      </div>
      <div class="year-wrap">2021</div>
      <el-scrollbar class="scrollbar">
        <div class="list-item">
          <div class="date-wrap">
            <span>08-08</span><br><span>09:33</span>
          </div>
          <div class="content-wrap">
            <span class="title-wrap">
              <i class="iconfont"></i>
              <el-avatar v-if="false"></el-avatar>
              系统触发短信
            </span>
            <div class="msg-wrap">
              <p></p>
              <span></span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'renewal-notify',
  data() {
    return {
      stepIndex: 2,
      stepData: Object.freeze([
        { label: '未跟踪', value: 'no_follow'},
        { label: '跟踪中', value: 'following'},
        { label: '未联系上', value: 'no_link'},
        { label: '放弃续保', value: 'give_up_renewal'},
        { label: '其他', value: 'other'}
      ]),
      list: [{}]
    }
  }
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
        align-items: center;
        color: #ccc;
        font-size: 12px;
        .iconfont {
          color: #CCCCCC;
          font-size: 20px;
          margin-bottom: 4px;
        }
        span {
          line-height: 17px;
        }
        &.active {
          color: #1F78FF;
          .iconfont {
            color: #1F78FF;
          }
        }
      }
    }
    .year-wrap {
      height: 35px;
      line-height: 35px;
      color: #333;
      font-size: 16px;
      text-align: center;
      border-top: 1px solid #E6E6E6;
      border-bottom: 1px solid #E6E6E6;
      font-weight: bold;
    }
    .el-scrollbar {
      flex: 1;
      overflow: hidden;
      .list-item {
        display: flex;
        padding: 18px 0;
        .date-wrap {
          width: 72px;
          height: 34px;
          box-sizing: border-box;
          border-right: 1px solid #d8d8d8;
          color: #333;
          text-align: center;
          position: relative;
          font-size: 12px;
          span {
            line-height: 17px;
          }
          &.active {
            color: #1F78FF;
          }
        }
        .content-wrap {
          flex: 1;
          font-size: 12px;
          padding: 0 12px;
          .title-wrap {
            display: flex;
            align-items: center;
            color: #333;
            transform: translateX(-20px);
            height: 34px;
            .iconfont {
              color: #D8D8D8;
              box-sizing: border-box;
              border: 4px solid #fff;
              margin-right: 2px;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: #D8D8D8;
            }
          }
          .msg-wrap {

          }
        }
        &.active {

        }
      }
    }
    .follow-footer {
      height: 84px;
      overflow: hidden;
    }
  }
}
</style>
