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
        <div class="list-item active">
          <div class="date-wrap">
            <span>08-08</span><br><span>09:33</span>
          </div>
          <div class="content-wrap">
            <span class="title-wrap">
              <i class="status-dot"></i>
              <el-avatar>
              </el-avatar>
              <span class="name-span">系统触发短信</span>
            </span>
            <div class="msg-wrap">
              <p>手工发送短信</p>
              <span>短信内容，超长换行超长换行超长换行超长换行超长换行</span>
            </div>
          </div>
        </div>
        <div class="list-item">
          <div class="date-wrap">
            <span>08-08</span><br><span>09:33</span>
          </div>
          <div class="content-wrap">
            <span class="title-wrap">
              <i class="status-dot"></i>
              <el-avatar>
              </el-avatar>
              <span class="name-span">系统触发短信</span>
            </span>
            <div class="msg-wrap">
              <p>手工发送短信</p>
              <span>短信内容，超长换行超长换行超长换行超长换行超长换行</span>
            </div>
          </div>
        </div>
        <div class="list-item completed">
          <div class="date-wrap">
            <span>08-08</span><br><span>09:33</span>
          </div>
          <div class="content-wrap">
            <span class="title-wrap">
              <i class="iconfont icona-zhong20_duigou_xuanzhong"></i>
              <el-avatar></el-avatar>
              <span class="name-span" :class="{ 'name-txt-overflow': true }" title="销售1">销售1</span>
              <span class="action-span">将跟踪状态标记为</span>
              <span class="status-block">
                <i class="iconfont iconchaoxiao_kefu_shenhui"></i>未跟踪
              </span>
            </span>
          </div>
        </div>
      </el-scrollbar>
      <div class="follow-footer">
        <div>
          跟踪标题
          <el-input size="mini" placeholder="必填"></el-input>
        </div>
        <div>
          <div>
            跟踪内容
            <el-input
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              size="mini"
              placeholder="必填"
              @keyup.ctrl.enter.native="send"
              class="mr8"></el-input>
          </div>
          <el-tooltip content="回车换行，Ctrl键+回车键发送" placement="top">
            <el-button
              type="primary"
              size="mini"
              :loading="sending"
              :disabled="sending"
              @click="send">发送</el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'renewal-notify',
  data() {
    return {
      sending: false,
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
  },
  methods: {
    send() {

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
        .date-wrap {
          width: 72px;
          height: 34px;
          box-sizing: border-box;
          color: #333;
          text-align: center;
          position: relative;
          font-size: 12px;
          margin-top: 8px;
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
          padding: 8px 16px 8px 12px;
          border-left: 1px solid #d8d8d8;
          box-sizing: border-box;
          .title-wrap {
            display: flex;
            align-items: center;
            color: #333;
            transform: translateX(-20px);
            height: 34px;
            & > .status-dot {
              color: #D8D8D8;
              box-sizing: border-box;
              border: 4px solid #fff;
              margin-right: 2px;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: #D8D8D8;
            }

            .el-avatar {
              width: 20px;
              height: 20px;
              margin-right: 8px;
            }
            .name-span {
              font-weight: 800;
            }
            .name-txt-overflow {
              display: inline-block;
              max-width: 70px;
              overflow: hidden;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .action-span {
              color: #999;
              margin: 0 4px;
            }
            .status-block {
              background-color: #F5F5F5;
              border-style: solid;
              border-width: 1px;
              border-color: rgba(204, 204, 204, 0.2);
              border-radius: 2px;
              height: 20px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              padding: 0 8px;
              color: #999;
              font-size: 12px;
              & > .iconfont {
                font-size: 12px;
                color: #999;
                margin-right: 4px;
              }
            }
          }
          .msg-wrap {
            background-color: #F5F5F5;
            padding: 16px;
            color: #131415;
            border-radius: 0px 12px 12px 12px;
            & > p {
              margin: 0 0 4px 0;
              line-height: 20px;
              font-size: 14px;
              font-weight: bold;
            }

            & > span {
              font-size: 14px;
              text-align: justify;
              line-height: 20px;
            }
          }
        }
        &.active {
          .date-wrap {
            color: #1F78FF;
          }
          .content-wrap {
            .iconfont {
              background-color: #1F78FF;
            }
            .msg-wrap {
              background-color: #1F78FF;
              color: #fff;
            }
          }
        }
        &.completed {
          .content-wrap {
            position: relative;
            &::after {
              content: '';
              width: 2px;
              position: absolute;
              background-color: #fff;
              left: -1px;
              top: 35px;
              bottom: 0;
            }
            .title-wrap > .iconfont {
              border: transparent;
              font-size: 16px;
              margin-right: 4px;
              background-color: #fff;
              color: #1F78FF;
              position: relative;
            }
          }
        }
      }
    }
    .follow-footer {
      min-height: 84px;
      overflow: hidden;
      border-top: 1px solid #E6E6E6;
      box-sizing: border-box;
      padding: 0 16px 13px 16px;
      display: flex;
      font-size: 12px;
      flex-direction: column;
      color: #ccc;
      & > div:first-child {
        height: 34px;
        display: flex;
        line-height: 20px;
        align-items: center;
        display: flex;
        align-items: center;
      }
      & > div:nth-child(2) {
        display: flex;
        align-items: center;
        & > div {
          flex: 1;
          display: flex;
          align-items: flex-start;
          line-height: 20px;
        }
      }

      ::v-deep .el-input, ::v-deep .el-textarea{
        flex: 1;
        font-size: 12px;
        margin-left: 8px;
        line-height: 20px;
        color: #ccc;
        resize: none;
        &::-webkit-input-placeholder {
          color: #ccc;
          font-size: 12px;
        }
        input, textarea {
          border: transparent;
          outline: transparent;
          padding: 0;
        }
      }
    }
  }
}
</style>
