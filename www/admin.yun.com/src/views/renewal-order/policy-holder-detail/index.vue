<template>
  <div class="renewal-notify page-container">
    <div class="left-content">
      <div class="header">投保人信息</div>
      <div class="content-body">
        <el-row>
          <el-col :span="8">
            <span class="mr8">姓名</span>xxx
          </el-col>
          <el-col :span="8">
            <span class="mr8">手机号</span>xxx
          </el-col>
          <el-col :span="8">
            <span class="mr8">身份证号</span>xxx
          </el-col>
          <el-col :span="8">
            <span class="mr8">出生日期</span>xxx
          </el-col>
          <el-col :span="8" class="mt10 ">
            <span class="mr8">邮箱</span>xxx
          </el-col>
        </el-row>
        <div class="table-wrap">
          <p>关联家庭</p>
          <el-table
              height="calc(50% - 68px)"
              border
              stripe>
            <el-table-column label="产品种类" align="center" width="80px"></el-table-column>
            <el-table-column label="产品名称" align="center" width="200px"></el-table-column>
            <el-table-column label="续保状态" align="center" width="100px"></el-table-column>
            <el-table-column label="跟踪状态" align="center" width="100px"></el-table-column>
            <el-table-column label="续保链接" align="center" width="280px"></el-table-column>
            <el-table-column label="投保单号" align="center" width="160px"></el-table-column>
            <el-table-column label="保单号" align="center" width="160px"></el-table-column>
            <el-table-column label="投保人手机号" align="center" width="160px"></el-table-column>
            <el-table-column label="投保人" align="center" width="100px"></el-table-column>
            <el-table-column label="被保人" align="center" width="100px"></el-table-column>
            <el-table-column label="保费" align="center" width="100px"></el-table-column>
            <el-table-column label="应续日期" align="center" width="120px" ></el-table-column>
            <el-table-column label="宽限日期" align="center" width="120px"></el-table-column>
            <el-table-column label="操作" align="center" width="150px" fixed="right"></el-table-column>
          </el-table>
          <p>关联家庭保单</p>
          <el-table
              height="calc(50% - 68px)"
              border
              stripe>
            <el-table-column label="产品种类" align="center" width="80px"></el-table-column>
            <el-table-column label="产品名称" align="center" width="200px"></el-table-column>
            <el-table-column label="续保状态" align="center" width="100px"></el-table-column>
            <el-table-column label="跟踪状态" align="center" width="100px"></el-table-column>
            <el-table-column label="续保链接" align="center" width="280px"></el-table-column>
            <el-table-column label="投保单号" align="center" width="160px"></el-table-column>
            <el-table-column label="保单号" align="center" width="160px"></el-table-column>
            <el-table-column label="投保人手机号" align="center" width="160px"></el-table-column>
            <el-table-column label="投保人" align="center" width="100px"></el-table-column>
            <el-table-column label="被保人" align="center" width="100px"></el-table-column>
            <el-table-column label="保费" align="center" width="100px"></el-table-column>
            <el-table-column label="应续日期" align="center" width="120px" ></el-table-column>
            <el-table-column label="宽限日期" align="center" width="120px"></el-table-column>
            <el-table-column label="操作" align="center" width="150px" fixed="right"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="right-content">
      <div class="follow-head">
        <el-tooltip :content="curRenewalDetail.product_name" placement="top">
          <span class="order-name">{{curRenewalDetail.product_name}}</span>
        </el-tooltip>
        <el-dropdown>
          <span class="el-dropdown-link">
            {{curRenewalDetail.label}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :disabled="readonly"
              v-for="item in renewalOptions"
              :command="item.value"
              :key="item.value"
              :class="{ 'renewal-dropdown-active': item.value === curRenewalId }">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="step-wrap">
        <div
            v-for="(item, index) in stepData"
            :key="index"
            class="step-item"
            :class="{ active: item.value === step }">
          <i class="iconfont" :class="item.value === step ? 'icona-zhong20_duigou_xuanzhong' : 'icona-zhong20_duigou_weixuanzhong'"></i>
          <span>{{item.label}}</span>
        </div>
      </div>
      <div class="year-wrap">{{ currentYear }}</div>
      <el-scrollbar class="scrollbar">
        <div
          v-for="(item, index) in detail.follow_logs"
          :key="index"
          class="list-item active"
          :class="{ active: isToday(item.follow_at) }">
          <div class="date-wrap">
            <span>{{isToday(item.follow_at * 1000) ? '今天' : formatDate(item.follow_at * 1000, 'yyyy-MM')}}</span><br><span>{{formatDate(item.follow_at * 1000, 'hh:mm')}}</span>
          </div>
          <div class="content-wrap">
            <span class="title-wrap">
              <i class="status-dot"></i>
              <el-avatar v-if="item.action !== messageTypes.systemModifyFollowStatus" :src="item.cs_admin_avatar_url"></el-avatar>
              <span v-if="item.action !== messageTypes.systemModifyFollowStatus" class="name-span">{{item.cs_admin_name}}</span>
              <span v-if="item.action !== messageTypes.systemSendCustomerMessage && item.action !== messageTypes.systemModifyFollowStatus" class="name-span ml4">{{item.cs_admin_position}}</span>
              <span v-else-if="item.action === messageTypes.systemSendCustomerMessage" class="name-span ml4 mr4">将跟踪状态标记为</span>
              <span v-else-if="item.action === messageTypes.systemModifyFollowStatus" class="name-span ml4 mr4">系统 将跟踪状态标记为</span>
              <span
                class="status-block"
                :class="[item.renewal_status]"
                v-if="item.action === messageTypes.systemSendCustomerMessage || item.action === messageTypes.systemModifyFollowStatus">
                <i class="iconfont iconchaoxiao_kefu_shenhui"></i>{{messageStatus[item.renewal_status].label}}
              </span>
            </span>
            <div class="msg-wrap" v-if="item.action !== messageTypes.systemSendCustomerMessage && item.action !== messageTypes.systemModifyFollowStatus">
              <p>{{item.title}}</p>
              <span>{{item.remark}}</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="follow-footer" v-if="!readonly">
        <div>
          跟踪标题
          <el-input size="mini" placeholder="必填"></el-input>
        </div>
        <div>
          <div>
            跟踪内容
            <el-input
                :rows="2"
                resize="none"
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
// 投保人详情
import { formatDate } from '@/utils/formatTime'
import { getSalesDetail } from '@/apis/modules/renewal-order'
export default {
  name: 'PolicyHolderDetail',
  data() {
    return {
      readonly: false,
      loading: false,
      followLoading: false,
      sending: false,
      currentYear: new Date().getFullYear(),
      step: 'not_follow',
      stepData: Object.freeze([
        { label: '未跟踪', value: 'not_follow' },
        { label: '跟踪中', value: 'already_follow' },
        { label: '未联系上', value: 'cannot_get_in_touch' },
        { label: '放弃续保', value: 'refuse_renewal' },
        { label: '其他', value: 'other' }
      ]),
      list: [{}],
      curRenewalId: null,
      detail: {
        follow_logs: []
      },
      row: {
        current_renewal_stage: {}
      },
      messageTypes: {
        // 客服跟进
        following: 'following',
        // 客户修改跟进状态
        modifyFollowStatus: 'modify_follow_status',
        // 系统发送续期短信
        systemSendCustomerMessage: 'system_send_customer_message',
        // 系统修改跟进状态
        systemModifyFollowStatus: 'system_modify_follow_status'
      },
      messageStatus: {
        not_follow: '未跟踪',
        already_follow: '已跟踪',
        cannot_get_in_touch: '未联系上',
        refuse_renewal: '放弃续保',
        already_renewal: '已续保',
        other: '其他'
      }
    }
  },
  computed: {
    renewalOptions() {
      let { stage_list } = this.detail
      const { id } = this.row.current_renewal_stage
      stage_list = stage_list || []
      return stage_list.map(item => ({
        label: item.id === +id ? '本次续保' : `第${item.stage - 1}次续保`,
        value: item.id,
        stage: item.stage,
        follow_status: item.follow_status,
        product_name: item.policy.product_name,
        is_current: item.id === +id
      }))
    },
    curRenewalDetail() {
      return this.renewalOptions.find(i => i.value === this.curRenewalId) || {}
    }
  },
  methods: {
    formatDate,
    getData() {
      getSalesDetail().then(res => {
        console.log(res)
        this.detail = res
      })
    },
    send() {

    },
    isToday(timestamp) {
      return new Date(timestamp).toLocaleDateString() === new Date().toLocaleDateString()
    }
  },
  created() {
    this.getData()
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
    display: flex;
    flex-direction: column;
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
    .content-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px;
      box-sizing: border-box;
      .el-col {
        font-size: 14px;
        font-weight: bold;
        color: #1A1A1A;
        & > span {
          font-weight: normal;
          color: #4D4D4D;
        }
      }
      .table-wrap {
        flex: 1;
        overflow: hidden;
        & > p {
          margin: 28px 0 16px 0;
          line-height: 24px;
          font-size: 16px;
          color: #1A1A1A;
          font-weight: bold;
        }
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
            transform: translateX(-20.5px);
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
              &.cannot_get_in_touch, &.refuse_renewal {
                color: #ff5151;
                background: #ffeded;
                border: 1px solid rgba(255, 81, 81, 0.1);
              }
              &.already_renewal {
                color: #4497eb;
                background: #ecf4fd;
                border: 1px solid #daeafb;
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
  ::v-deep .el-table__empty-block{
    width: 100% !important;
  }
}
</style>
<style lang="scss">
.renewal-dropdown-active {
  background-color: rgba(31,120,255,.1) !important;
  color: #1f78ff !important;
}
</style>
