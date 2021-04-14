<template>
  <div class="header">
    <div class="logo normal-transition"></div>
    <div class="right-function-button-group">
      <el-tooltip v-if="$checkAuth('/edit_api_configure')" effect="dark" content="开发对接" placement="bottom">
        <div class="function-botton" @click="$router.push('/dev-interface')">
          <i class="iconfont iconda24_kaifaduijie fs24"></i>
        </div>
      </el-tooltip>
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
        v-if="hasAnnAuth"
        placement="bottom"
        width="420"
        v-model="isAnnouncementShow"
        class="ml16"
        popper-class="popper-box"
        trigger="click">
        <div class="function-botton" slot="reference">
          <el-tooltip effect="dark" content="消息通知" placement="bottom">
            <el-badge is-dot :hidden="!showRedDot">
              <i class="iconfont iconda24_tongzhi fs24"></i>
            </el-badge>
          </el-tooltip>
        </div>
        <div class="announcement-container">
          <div class="ann-container-header">
            <span>通知</span>
            <el-button type="text" :loading="readAllSubmitting" :disabled="readAllSubmitting" @click="readAll" v-if="hasAnnUnread">全部已读</el-button>
          </div>
          <el-scrollbar ref="annScrollbar"
                        class="announcement-scroll-bar scroll-bar"
                        wrapClass="scroll-bar-wap"
                        viewClass="body-list"
                        v-loading="annLoading">
            <div v-infinite-scroll="annScroll2Bottom">
              <div
                class="announcement-block"
                :key="item.id"
                v-for="item in annList"
                @click="showAnnouncement(item)">
                <div class="ann-title">
                  <span class="text-wrap">{{item.title}}</span>
                  <div>
                    <el-badge is-dot :hidden="item.one_sales_read_log.status !== readMap.unread.value">
                      <span class="date">{{formatNoticeAt(item.notice_at * 1000)}}</span>
                    </el-badge>
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <p class="content text-wrap">{{item.content}}</p>
              </div>
            </div>
            <div v-if="annList.length <= 0" class="tc p20 gray">暂无数据</div>
          </el-scrollbar>
        </div>
      </el-popover>
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
              <div class="departmant">{{ (userInfo.company || {}).name }}</div>
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
    <announcement-dialog :visible.sync="annDialogShow" :id="annId"></announcement-dialog>
  </div>
</template>

<script>
  import { loginOut, getAnnouncementList, setAnnouncementReadAll, getAnnNoReadCnt } from '@/apis/modules'
  import { mapState, mapActions } from 'vuex'
  import { formatDate } from '@/utils/formatTime'
  import AnnouncementDialog from '@/components/announcement-dialog'
  import { socketConnection } from '../../scoket'
  export default {
    components: {
      AnnouncementDialog
    },
    data() {
      return {
        readMap: Object.freeze({
          unread: {
            label: '未读',
            value: 'unread'
          },
          read: {
            label: '已读',
            value: 'read'
          }
        }),
        isPopoverShow: false,
        isAnnouncementShow: false,
        submitting: false,
        annList: [],
        annPage: 1,
        annPageSize: 20,
        annTotal: 0,
        annLoading: false,
        annId: '',
        annDialogShow: false,
        readAllSubmitting: false,
        socket: null,
        showRedDot: false
      }
    },
    computed: {
      ...mapState('users', ['userInfo', 'notificationInfo']),
      // 是否有公告列表权限
      hasAnnAuth() {
        return this.$checkAuth('/company_announcement/read')
      },
      hasAnnUnread() {
        return this.annList.some(i => i.one_sales_read_log.status === this.readMap.unread.value)
      }
    },
    methods: {
      ...mapActions('users', ['getNotification']),
      annScroll2Bottom() {
        if (this.annPage * this.annPageSize < this.annTotal) {
          this.annPage += 1
          this.getAnnouncementList()
        }
      },
      readAll() {
        setAnnouncementReadAll().then(() => {
          this.annPage = 1
          this.showRedDot = false
          this.getAnnouncementList()
        })
      },
      showAnnouncement(row) {
        this.annId = row.id
        // 修改为已读
        row.one_sales_read_log.status = this.readMap.read.value
        this.annDialogShow = true
        if (!this.hasAnnUnread) {
          this.showRedDot = false
        }
      },
      formatNoticeAt(timestamp) {
        return formatDate(timestamp, `${new Date().toDateString() === new Date(timestamp).toDateString() ? '' : 'yyyy-MM-dd '}hh:mm`)
      },
      jump2UserInfo() {
        this.$router.push({ path: '/user-info' })
        this.isPopoverShow = false
      },
      loginOut() {
        if (this.submitting) return
        this.submitting = true
        loginOut().finally(() => this.$store.dispatch('users/logout'))
        this.$router.replace({ path: '/login' })
      },
      getAnnouncementList() {
        this.annLoading = true
        getAnnouncementList({
          page: this.annPage,
          page_size: this.annPageSize
        }).then(res => {
          this.annList = this.annPage === 1 ? res.data : this.annList.concat(res.data)
          this.annTotal = res.total
        }).finally(() => {
          this.annLoading = false
        })
      }
    },
    created() {
      this.getNotification()
    },
    mounted() {
      if (this.hasAnnAuth) {
        this.socket = socketConnection()
        this.socket.on('sales:receive-announcement', () => {
          this.showRedDot = true
        })
        this.socket.on('sales:remove', () => {
          this.socket.disconnect()
          this.socket = null
        })

        getAnnNoReadCnt().then(res => {
          if (res.not_read_count > 0) {
            this.showRedDot = true
          }
        })
      }
    },
    watch: {
      isAnnouncementShow(v) {
        if (v) {
          this.annPage = 1
          this.getAnnouncementList()
        } else {
          this.annList = []
        }
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
.announcement-container{
  padding: 0 !important;
  .announcement-scroll-bar{
    height: 409px;
    padding-bottom: 8px;
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .ann-container-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    border-bottom: 1px solid #e6e6e6;
    padding: 0 20px;
    span {
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .announcement-block{
    cursor: pointer;
    position: relative;
    padding:12px 20px;
    &:after{
      content: '';
      display: inline-block;
      position: absolute;
      height: 1px;
      left:20px;
      right:20px;
      bottom: 0;
      background: #e6e6e6;
    }
    &:last-of-type:after{
      height: 0;
    }
    &:hover{
      background:rgba(245,245,245,1);
    }
    .text-wrap{
      display: inline-block;
      overflow:hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 控制显示的行数 */
      line-height: 24px;        /* 对不支持浏览器的 */
      max-height: 48px;
    }
    .ann-title{
      display: flex;
      justify-content: space-between;
      line-height: 24px;
      align-items: flex-start;
      &>span{
        font-size:16px;
        font-family:PingFang-SC-Bold,PingFang-SC;
        font-weight:bold;
        color:rgba(51,51,51,1);
        margin-right:10px;
      }
      &>div{
        display: flex;
        align-items: center;
        height: 24px;
        i{
          font-size: 16px;
          font-weight: bold;
        }
      }
      .el-icon-arrow-right{
        color:#D8D8D8;
        font-size: 9px;
        margin-left: 10px;
      }
      .date{
        font-size:12px;
        font-weight:400;
        color:rgba(153,153,153,1);
      }
      ::v-deep .el-badge__content {
        right: 0;
        top: 3px;
        width: 10px;
        height: 10px;
      }
    }
    &>p{
      margin: 6px 0 0 0;
      line-height: 20px !important;
    }
    .content{
      font-size:14px;
      font-weight:400;
      color:#999;
    }
  }
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
