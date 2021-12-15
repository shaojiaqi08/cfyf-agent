<template>
  <div class="renewal-notify page-container">
    <div class="left-content" v-loading="contentLoading">
      <div class="header">投保人信息</div>
      <div class="content-body">
        <el-row>
          <el-row>
          <el-col :span="8" class="bottom-col">
            <span class="mr8">姓名</span>{{detail.customer.real_name}}
          </el-col>
          <el-col :span="8" class="bottom-col">
            <span class="mr8">手机号</span>{{detail.customer.mobile}}
          </el-col>
          <el-col :span="8" class="bottom-col">
            <span class="mr8">身份证号</span>{{detail.customer.certificate_number}}
          </el-col>
          <el-col :span="8" class="bottom-col">
            <span class="mr8">出生日期</span>{{detail.customer.format_birthday}}
          </el-col>
          <el-col :span="8" class="mt10 bottom-col" v-if="detail.customer.family_name !== ''">
            <span class="mr8">关联家庭</span>{{detail.customer.family_name}}
          </el-col>
        </el-row>
        </el-row>
        <div class="table-wrap">
          <!-- <p>关联家庭</p> -->
          <el-table
              ref="detailTable"
              highlight-current-row
              :data="detail.customer_policy"
              :resizable="false"
              height="calc(50% - 68px)"
              border
              stripe
              :header-cell-style="{ backgroundColor: '#EBEBEB', color: '#333333', borderTop: '1px solid rgba(0, 0, 0, .1)' }"
              @row-click="handleRowClick($event,'1')">
            <el-table-column label="产品种类" prop="product_insurance_class_name" align="center" width="80px"></el-table-column>
            <el-table-column label="产品名称" prop="product_name" align="center" width="200px"></el-table-column>
            <el-table-column label="续保状态" prop="current_renewal_stage.renewal_status_name" align="center" width="100px"></el-table-column>
            <el-table-column label="跟踪状态" prop="current_renewal_stage.follow_status_name" align="center" width="100px"></el-table-column>
            <el-table-column label="续保链接" align="center" width="130px">
              <template v-slot="{ row }">
                <text-hidden-ellipsis :popoverTip="row.current_renewal_stage.renewal_url" @click="copyRenewalLink(row.current_renewal_stage.renewal_url)"></text-hidden-ellipsis>
                <a class="copy-class" v-if="$checkAuth(perPreFixCopyLink)" href="javascript:;"><p class="p_margin" v-if="row.current_renewal_stage.renewal_url != ''" @click="copyRenewalLink(row.current_renewal_stage.renewal_url)">复制链接</p></a>
              </template>
            </el-table-column>
            <el-table-column label="投保单号" prop="proposal_sn" align="center" width="160px"></el-table-column>
            <el-table-column label="保单号" prop="policy_sn" align="center" width="160px"></el-table-column>
            <el-table-column label="投保人手机号" prop="policy_holder_info.mobile" align="center" width="160px"></el-table-column>
            <el-table-column label="投保人" prop="policy_holder_info.name" align="center" width="100px"></el-table-column>
            <el-table-column label="被保人" align="center" width="100px">
              <template v-slot="{ row }">
                <div v-if="row.policy_recognizee_policies.length">
                  {{row.policy_recognizee_policies | namefilter }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="保费" prop="actually_premium" align="center" width="100px"></el-table-column>
            <el-table-column label="应续日期" prop="current_renewal_stage.renewal_date_format" align="center" width="130px" ></el-table-column>
            <el-table-column label="宽限日期" width="170px" align="center">
              <template v-slot="{ row }">
                <div v-if="row.current_renewal_stage.grace_start_at && row.current_renewal_stage.grace_end_at">
                  {{ formatDate(row.current_renewal_stage.grace_start_at * 1000, 'yyyyMMdd') }}
                  -
                  {{ formatDate(row.current_renewal_stage.grace_end_at * 1000, 'yyyyMMdd') }}
                </div>
              </template>
          </el-table-column>
            <el-table-column label="操作" align="center" width="150px" fixed="right">
              <template slot-scope="{row}">
                <el-link
                  @click="insurancePolicy(row)"
                  type="primary"
                  v-if="$checkAuth(`${perPreFix}policy_detail`)"
                  class="mr8">保单详情</el-link>
                  <el-link
                  type="primary"
                  @click="showSendLetter(row)"
                  v-if="$checkAuth(perPreFixMessage)"
                  class="mr8"><p class="p_margin" v-if="!readonly">短信通知</p></el-link>
              </template>
            </el-table-column>
          </el-table>
          <p>关联家庭保单</p>
          <el-table
              ref="bottomDetailTable"
              highlight-current-row
              :data="detail.family_policy"
              :resizable="false"
              height="calc(50% - 68px)"
              border
              stripe
              :header-cell-style="{ backgroundColor: '#EBEBEB', color: '#333333', borderTop: '1px solid rgba(0, 0, 0, .1)' }"
              @row-click="handleRowClick($event,'2')">
            <el-table-column label="产品种类" prop="product_insurance_class_name" align="center" width="80px"></el-table-column>
            <el-table-column label="产品名称" prop="product_name" align="center" width="200px"></el-table-column>
            <el-table-column label="续保状态" prop="current_renewal_stage.renewal_status_name" align="center" width="100px"></el-table-column>
            <el-table-column label="跟踪状态" prop="current_renewal_stage.follow_status_name" align="center" width="100px"></el-table-column>
            <el-table-column label="续保链接" align="center" width="130px">
              <template v-slot="{ row }">
                <text-hidden-ellipsis :popoverTip="row.current_renewal_stage.renewal_url" @click="copyRenewalLink(row.current_renewal_stage.renewal_url)"></text-hidden-ellipsis>
                <a class="copy-class" v-if="$checkAuth(perPreFixCopyLink)" href="javascript:;"><p class="p_margin" v-if="row.current_renewal_stage.renewal_url != ''" @click="copyRenewalLink(row.current_renewal_stage.renewal_url)">复制链接</p></a>
              </template>
            </el-table-column>
            <el-table-column label="投保单号" prop="proposal_sn" align="center" width="160px"></el-table-column>
            <el-table-column label="保单号" prop="policy_sn" align="center" width="160px"></el-table-column>
            <el-table-column label="投保人手机号" prop="policy_holder_info.mobile" align="center" width="160px"></el-table-column>
            <el-table-column label="投保人" prop="policy_holder_info.name" align="center" width="100px"></el-table-column>
            <el-table-column label="被保人" align="center" width="100px">
              <template v-slot="{ row }">
                <div v-if="row.policy_recognizee_policies.length">
                  {{row.policy_recognizee_policies | namefilter }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="保费" prop="actually_premium" align="center" width="100px"></el-table-column>
            <el-table-column label="应续日期" prop="current_renewal_stage.renewal_date_format" align="center" width="130px" ></el-table-column>
            <el-table-column label="宽限日期" width="170px" align="center">
              <template v-slot="{ row }">
                <div v-if="row.current_renewal_stage.grace_start_at && row.current_renewal_stage.grace_end_at">
                  {{ formatDate(row.current_renewal_stage.grace_start_at * 1000, 'yyyyMMdd') }}
                  -
                  {{ formatDate(row.current_renewal_stage.grace_end_at * 1000, 'yyyyMMdd') }}
                </div>
              </template>
          </el-table-column>
            <el-table-column label="操作" align="center" width="150px" fixed="right">
              <template slot-scope="{row}">
                <el-link
                  @click="insurancePolicy(row)"
                  type="primary"
                  v-if="$checkAuth(`${perPreFix}policy_detail`)"
                  class="mr8">保单详情</el-link>
                  <el-link
                  type="primary"
                  @click="showSendLetter(row)"
                  v-if="$checkAuth(perPreFixMessage)"
                  class="mr8"><p class="p_margin" v-if="!readonly">短信通知</p></el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="right-content" v-loading="rightLoading">
      <div class="follow-head">
        <el-tooltip :content="curRenewalDetail.product_name" placement="top">
          <span class="order-name">{{curRenewalDetail.product_name}}</span>
        </el-tooltip>
        <el-dropdown @command="handleClick($event)">
          <span class="el-dropdown-link">
            {{curRenewalDetail.label}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in renewalOptions"
              :command="item.value"
              :key="item.value"
              :class="{ 'renewal-dropdown-active': item.value === obj.stage_version }"
            >{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="year-wrap">{{ currentYear }}</div>
      <div class="scrollbar scrollbar-theme" ref="body">
        <div class="scroll-content">
        <div
          v-for="(item, index) in followData.follow_logs"
          :key="index"
          class="list-item active"
          :class="{ active: isToday(item.follow_at) }">
          <div class="date-wrap" :class="isToday(item.follow_at * 1000) ? 'active':''">
            <span>{{isToday(item.follow_at * 1000) ? '今天' : formatDate(item.follow_at * 1000, 'MM-dd')}}</span><br><span>{{formatDate(item.follow_at * 1000, 'hh:mm')}}</span>
          </div>
          <div class="content-wrap">
            <span class="title-wrap">
              <i :class="isToday(item.follow_at * 1000) ?'cur-status-dot':'status-dot'"></i>
              <el-avatar v-if="item.action !== messageTypes.systemModifyFollowStatus && item.action !== messageTypes.systemSendCustomerMessage" :src="item.follow_obj_avatar_url"></el-avatar>
              <span v-if="item.action !== messageTypes.systemModifyFollowStatus" class="name-span">{{item.follow_obj_type === 'sales'? item.follow_obj_name : item.follow_obj_type === 'cfyf_admin'? '创富云服客服-'+item.follow_obj_name:''}}</span>
              <!-- <span v-if="item.action !== messageTypes.systemModifyFollowStatus" class="name-span">{{item.follow_obj_name}}</span> -->
              <!-- <span v-if="item.action !== messageTypes.systemSendCustomerMessage && item.action !== messageTypes.systemModifyFollowStatus" class="name-span ml4">{{item.cs_admin_position}}</span> -->
              <!-- <span v-else-if="item.action === messageTypes.systemSendCustomerMessage" class="name-span ml4 mr4">将跟踪状态标记为</span>
              <span v-else-if="item.action === messageTypes.systemModifyFollowStatus" class="name-span ml4 mr4">系统 将跟踪状态标记为</span> -->
              <!-- <span v-if="item.action === messageTypes.modifyFollowStatus" class="name-span ml4 mr4">将跟踪状态标记为</span>
              <span v-if="item.action === messageTypes.systemModifyFollowStatus" class="name-span ml4 mr4">系统 将跟踪状态标记为</span> -->
              <!-- <span
                class="status-block"
                :class="[item.renewal_status]"
                v-if="item.action === messageTypes.systemSendCustomerMessage || item.action === messageTypes.systemModifyFollowStatus">
                <i class="iconfont iconchaoxiao_kefu_shenhui"></i>
                {{messageStatus[item.renewal_status].label}}
              </span> -->
              <!-- <span
                class="status-block"
                :class="[item.renewal_status]"
                v-if="item.action === messageTypes.systemModifyFollowStatus || item.action === messageTypes.modifyFollowStatus"
              > -->
                <!-- <i class="iconfont iconchaoxiao_kefu_shenhui"></i> -->
                <!-- {{item.follow_status_str}}
              </span> -->
            </span>
            <div class="sign-block">
              <span v-if="item.action === messageTypes.modifyFollowStatus" class="name-span ml4 mr4">将跟踪状态标记为</span>
                <span v-if="item.action === messageTypes.systemModifyFollowStatus" class="name-span ml4 mr4">系统 将跟踪状态标记为</span>
                <!-- <span
                  class="status-block"
                  :class="[item.renewal_status]"
                  v-if="item.action === messageTypes.systemSendCustomerMessage || item.action === messageTypes.systemModifyFollowStatus">
                  <i class="iconfont iconchaoxiao_kefu_shenhui"></i>
                  {{messageStatus[item.renewal_status].label}}
                </span> -->
              <span
                class="status-block"
                :class="[item.renewal_status]"
                v-if="item.action === messageTypes.systemModifyFollowStatus || item.action === messageTypes.modifyFollowStatus"
              >
                <!-- <i class="iconfont iconchaoxiao_kefu_shenhui"></i> -->
                {{item.follow_status_str}}
              </span>
            </div>
            <div class="msg-wrap" v-if="item.action === messageTypes.systemSendCustomerMessage">
              <p>{{item.title}}</p>
              <span>{{item.remark}}</span>
            </div>
            <div v-if="item.action === messageTypes.following" class='ml5 message-item-info'>
              <div class='flex'>
                <span style='font-weight: 800' class="mr5">将跟踪状态标记为</span>
                <span
                  class="status-block"
                  :class="[item.renewal_status]">
                    {{item.follow_status_str}}
                  </span>
              </div>
              <div class='detail-info'>
                <div class='info-item flex' v-if='item.second_follow_status_str'>
                  <div class='item-label'>状态详情：</div>
                  <div class='item-content'>{{item.second_follow_status_str}}</div>
                </div>
                <div class='info-item flex'>
                  <div class='item-label'>跟踪方式：</div>
                  <div class='item-content'>{{item.follow_way_str || '无'}}</div>
                </div>
                <div class='info-item flex' v-if='item.title'>
                  <div class='item-label'>跟踪标题：</div>
                  <div class='item-content'>{{item.title}}</div>
                </div>
                <div class='info-item flex'>
                  <div class='item-label'>跟踪内容：</div>
                  <div class='item-content'>{{item.remark}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="item.action === messageTypes.systemModifyFollowStatus || item.action !== messageTypes.modifyFollowStatus">
              <div class="msg-wrap" v-if="item.action !== messageTypes.systemSendCustomerMessage && item.action !== messageTypes.systemModifyFollowStatus">
                <p>{{item.title}}</p>
                <span>{{item.remark}}</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div class="step-wrap">
        <div
          v-for="(item, index) in stepData"
          :key="index"
          class="step-item"
          :class="{ active: item.value === step }"
          @click="handleItem(item)"
        >
          <i class="iconfont" :class="item.value === step ? 'icona-zhong20_duigou_xuanzhong' : 'icona-zhong20_duigou_weixuanzhong'"></i>
          <span>{{item.label}}</span>
        </div>
      </div>
      <div class='child-track-status flex-between' v-if="secondFollowStatusMap[step] && secondFollowStatusMap[step].length">
        <div class='child-track-label'>
          状态详情
        </div>
        <div class='child-track-item'>
          <el-radio-group v-model='sendData.second_follow_status' :disabled="readonly">
            <el-radio
              class='mb10'
              :label='item.value'
              v-for='item in secondFollowStatusMap[step]'
              :key='item.value'>{{item.label}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class='child-track-status flex-between' v-if="optMap">
        <div class='child-track-label'>
          跟踪方式
        </div>
        <div class='child-track-item'>
          <el-radio-group v-model='sendData.follow_way' :disabled="readonly">
            <el-radio
              class='mb10'
              :label='item.value'
              v-for='item in optMap.follow_way'
              :key='item.value'>{{item.label}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="follow-footer" v-if="!readonly">
        <div>
          跟踪标题
          <el-input v-model="sendData.title" size="mini" placeholder="选填"></el-input>
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
                v-model="sendData.remark"
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
    <letter-dialog
      :visible.sync="letterDialogVisible"
      :data="detailObj"
      :sendLoading="sendLoading"
      @handleSuccess="handleSuccess"
    >
    </letter-dialog>
  </div>
</template>

<script>
// 投保人详情
import { formatDate } from '@/utils/formatTime'
import {
  getSalesDetail,
  getTeamDetail,
  getCompanyDetail,
  addFollowStatusLogs,
  modifyFollowStatus,
  getFollowLogs,
  getMsgTemplate,
  sendCustomerMsg,
  getFollowStatus
} from '@/apis/modules/renewal-order'
import LetterDialog from '../component/dialog/letter-dialog.vue'
import textHiddenEllipsis from '@/components/text-hidden-ellipsis'
export default {
  name: 'PolicyHolderDetail',
  components: {
    LetterDialog,
    textHiddenEllipsis
  },
  data() {
    return {
      letterDialogVisible: false,
      detailObj: {
        msg_template: ''
      },
      sendLoading: false,
      templateVersion: '',
      readonly: false,
      loading: false,
      followLoading: false,
      sending: false,
      currentYear: new Date().getFullYear(),
      step: '',
      optMap: null,
      stepData: Object.freeze([
        { label: '未跟踪', value: 'not_follow' },
        { label: '已跟踪', value: 'already_follow' },
        { label: '未联系上', value: 'cannot_get_in_touch' },
        { label: '放弃续保', value: 'refuse_renewal' },
        { label: '已续保', value: 'already_renewal' },
        { label: '已理赔', value: 'already_claim' },
        { label: '其他', value: 'other' }
      ]),
      list: [{}],
      curRenewalId: null,
      detail: {
        customer: {},
        customer_policy: [],
        family_policy: []
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
        already_claim: '已理赔',
        other: '其他'
      },
      sendData: {
        title: '', //标题写点什么
        remark: '', //内容
        follow_way: '', // 跟踪方式
        second_follow_status: ''  // 跟踪详情
      },
      rightLoading: false, //加载提示
      contentLoading: false, //内容加载提示
      obj: {
        stage_version: '', //续期记录version，列表中的version
        order_no: '' //订单号
      },
      followData: {
        follow_logs: [],
        stage_list: []
      },
      detailApiMap: Object.freeze({
        RenewalOrderTraceMy: getSalesDetail,
        RenewalOrderTraceTeam: getTeamDetail,
        RenewalOrderTraceCompany: getCompanyDetail,
        RenewalOrderViewMy: getSalesDetail,
        RenewalOrderViewMyTeam: getTeamDetail,
        RenewalOrderViewMyCompany: getCompanyDetail
      }),
      renewalOptions: [],
      current_version: '',
      onlyFirstStatus: Object.freeze([
        'not_follow',
        'already_renewal'
      ])
    }
  },
  computed: {
    secondFollowStatusMap(){
      const followStatus = {}
      this.optMap && this.optMap.follow_status.forEach(item => {
        followStatus[item.value] = item.second_follow_status
      })
      return followStatus
    },
    // renewalOptions() {
    //   let { stage_list } = this.followData
    //   const { id } = this.row.current_renewal_stage
    //   stage_list = stage_list || []
    //   return stage_list.map(item => ({
    //     label: item.id === +id ? '本次续保' : `第${item.stage - 1}次续保`,
    //     value: item.id,
    //     stage: item.stage,
    //     follow_status: item.follow_status,
    //     product_name: item.policy.product_name,
    //     is_current: item.id === +id
    //   }))
    // },
    curRenewalDetail() {
      return this.renewalOptions.find(i => i.value === this.obj.stage_version) || {}
    },
    perPreFix () {
      const map = {
        'RenewalOrderTraceCompany' : '/company_renewal/',
        'RenewalOrderTraceTeam' : '/team_renewal/',
        'RenewalOrderTraceMy' : '/sales_renewal/',
        'RenewalOrderViewMyCompany' : '/company_renewal/',
        'RenewalOrderViewMyTeam' : '/team_renewal/',
        'RenewalOrderViewMy' : '/sales_renewal/',
      }
      return map[this.$route.name]
    },
    // 权限值-复制链接
    perPreFixCopyLink () {
      const map = {
        'RenewalOrderTraceMy' : '/copy_renewal_link/sales',
        'RenewalOrderTraceTeam' : '/copy_renewal_link/team',
        'RenewalOrderTraceCompany' : '/copy_renewal_link/company',
        'RenewalOrderViewMy' : '/copy_renewal_link/sales',
        'RenewalOrderViewMyTeam' : '/copy_renewal_link/team',
        'RenewalOrderViewMyCompany' : '/copy_renewal_link/company'
      }
      return map[this.$route.name]
    },
    // 权限值-发送短信
    perPreFixMessage () {
      const map = {
        'RenewalOrderTraceMy' : '/policy_renewal/sales_send_msg',
        'RenewalOrderTraceTeam' : '/policy_renewal/team_send_msg',
        'RenewalOrderTraceCompany' : '/policy_renewal/company_send_msg',
        'RenewalOrderViewMy' : '/policy_renewal/sales_send_msg',
        'RenewalOrderViewMyTeam' : '/policy_renewal/team_send_msg',
        'RenewalOrderViewMyCompany' : '/policy_renewal/company_send_msg'
      }
      return map[this.$route.name]
    },
  },
  mounted() {
    let $scrollBody = this.$refs.body
    this.bindSetCurrentYear = this.setCurrentYear.bind(this)
    $scrollBody.addEventListener('scroll', this.bindSetCurrentYear)
    if ($scrollBody && $scrollBody.scrollHeight > $scrollBody.clientHeight) {
      $scrollBody.scrollTop = $scrollBody.scrollHeight
    }
  },
  beforeDestroy() {
    let $scrollBody = this.$refs.body
    $scrollBody.removeEventListener('scroll', this.bindSetCurrentYear)
  },
  methods: {
    getFollowStatus() {
      getFollowStatus()
        .then((res) => {
          this.optMap = res
        })
    },
    formatDate,
    setCurrentYear(e) {
      let $container = e && e.target ? e.target : this.$refs.body
      let clientHeight = $container.clientHeight
      let scrollHeight = $container.scrollHeight
      let messageItems = document.querySelectorAll(
        `.message-item`
      )
      if (!messageItems.length) {
        this.currentYear = new Date().getFullYear()
        return
      }
      if (clientHeight >= scrollHeight) {
        this.currentYear = new Date(
            parseInt(messageItems[messageItems.length - 1].getAttribute('data-date-time'))
          ).getFullYear()
        return
      }
      let scrollTop = $container.scrollTop || 0
      let offsetTopList = [...messageItems].map(item => item.offsetTop)
      for (let i = 0; i < offsetTopList.length; i++) {
        if (scrollTop >= offsetTopList[i]) {
          this.currentYear = new Date(
            parseInt(messageItems[i].getAttribute('data-date-time'))
          ).getFullYear()
        } else {
          break
        }
      }
    },
    copyRenewalLink(link) {
      this.$copyText(link).then(() => this.$message.success('续保链接已复制到粘贴板'))
    },
    //获取消息模板
    showSendLetter({current_renewal_stage}) {
      this.sendLoading = true
      this.templateVersion = current_renewal_stage.version
      getMsgTemplate({version: current_renewal_stage.version}).then(res => {
        this.sendLoading = false
        this.detailObj = res
        this.letterDialogVisible = true
      }).catch(() => {
        this.sendLoading = false
      })
    },
    handleSuccess(v) {
      if(v === 'send') {
        this.sendLoading = true
        sendCustomerMsg({version: this.templateVersion}).then(() => {
          this.$message.success(`发送成功!`)
          this.letterDialogVisible = false
          this.sendLoading = false
        }).catch(() => {
          this.sendLoading = false
          this.$notify({
            type: 'error',
            title: '',
            message: '发送失败!'
          })
        })
      } else if(v === 'modify') {
        this.$router.push('/user-info')
      }
    },
    getData() {
      let route = this.$route.params
      this.contentLoading = true;
      this.rightLoading = true;
      let getDataDetail = this.detailApiMap[this.$route.name];
      getDataDetail({version: route.version}).then(res => {
        this.detail = res
        if(res.customer_policy.length > 0 && res.customer_policy[0] !== null) {
          let customer_policy = res.customer_policy[0]
          this.obj.stage_version = customer_policy.current_renewal_stage.version //设置默认选中第一条data
          this.current_version = customer_policy.current_renewal_stage.version //设置默认选中第一条data
          this.obj.order_no = customer_policy.order_no //设置默认选中第一条data
          this.$refs.detailTable.setCurrentRow(customer_policy)
        }
        if(res.customer_policy.length === 0 && res.family_policy.length > 0) {
          let family_policy = res.family_policy[0]
          this.obj.stage_version = family_policy.current_renewal_stage.version //设置默认选中第一条data
          this.obj.order_no = family_policy.order_no //设置默认选中第一条data
          this.$refs.bottomDetailTable.setCurrentRow(family_policy)
        }
        this.contentLoading = false;
        if(this.obj.stage_version !== '') {
          this.getFollowLogs();
        } else {
          this.rightLoading = false;
        }
      }).catch(() => {
        this.contentLoading = false;
        this.rightLoading = false;
      })
    },
    // 保单详情
    insurancePolicy({order_no}) {
      let paths = {
        'RenewalOrderTraceMy': 'renewal-self-detail',
        'RenewalOrderTraceTeam': 'renewal-team-detail',
        'RenewalOrderTraceCompany': 'renewal-company-detail',
        'RenewalOrderViewMy': 'renewal-self-detail',
        'RenewalOrderViewMyTeam': 'renewal-team-detail',
        'RenewalOrderViewMyCompany': 'renewal-company-detail'
      }
      let pathName = paths[this.$route.name],
          id = order_no;

      console.log(pathName)
      window.open(this.$router.resolve({
        name: pathName,
        params: { id }
      }).href)
    },
    //选中跟踪状态
    handleItem(item) {
      if(this.obj.stage_version === '') {
        return
      }
      if(this.readonly) {
        return
      }
      this.step = item.value;
      this.sendData.second_follow_status = ''
      // this.modifyFollow();
    },
    handleClick(id) {
      this.rightLoading = true;
      this.obj.stage_version = id;
      this.followData.stage_list.forEach(k => {
        if(k.version === id) {
          this.obj.stage_version = k.version;
          this.obj.order_no = k.policy.order_no;
          this.readonly = k.is_editable === '0' || this.$route.name === 'RenewalOrderViewMy' || this.$route.name === 'RenewalOrderViewMyTeam' || this.$route.name === 'RenewalOrderViewMyCompany'? true : false;
          this.getFollowLogs();
        }
      })
    },
    modifyFollow() {
      let { obj, step } = this,
      data = {
        stage_version: obj.stage_version,
        follow_status: step
      };
      this.rightLoading = true
      modifyFollowStatus(data).then((res) => {
        this.getFollowLogs()
        this.$message.success(`修改跟踪状态成功!`)
        this.rightLoading = false
        this.detail.customer_policy.filter(v => {
          if(v.current_renewal_stage.version === obj.stage_version) {
            v.current_renewal_stage.follow_status_name = res.follow_status_str
          }
        })
        this.detail.family_policy.filter(v => {
          if(v.current_renewal_stage.version === obj.stage_version) {
            v.current_renewal_stage.follow_status_name = res.follow_status_str
          }
        })
      }).catch(() => {
        this.$message.error(`修改失败!`)
        this.rightLoading = false
      })
    },
    //获取跟进记录列表
    getFollowLogs() {
      let { obj } = this,
      data = {
        stage_version: obj.stage_version,
        order_no: obj.order_no
      };
      this.rightLoading = true
      getFollowLogs(data).then(res => {
        this.rightLoading = false
        console.log('res',res)
        this.followData = res;
        this.readonly = res.stage_list[0].is_editable === '0' || this.$route.name === 'RenewalOrderViewMy' || this.$route.name === 'RenewalOrderViewMyTeam' || this.$route.name === 'RenewalOrderViewMyCompany'? true : false;
        // this.step = stage_list.follow_status;
        this.renewalOptions = this.followData.stage_list.map(item => ({
          label: item.version === this.current_version ? '本次续保' : `第${item.stage - 1}次续保`,
          value: item.version,
          stage: item.stage,
          follow_status: item.follow_status,
          product_name: item.policy.product_name,
          is_current: item.version === obj.stage_version
        }))
        if (res.follow_logs.length) {
          const len = res.follow_logs.length
          this.$set(this.sendData, 'second_follow_status', res.follow_logs[len - 1].second_follow_status)
          this.$set(this.sendData, 'follow_way', res.follow_logs[len - 1].follow_way)
          this.$set(this, 'step', res.follow_logs[len - 1].follow_status)
        }
        this.$nextTick(() => {
          if (this.$refs.body) {
            if (this.$refs.body.scrollHeight <= this.$refs.body.clientHeight) {
              this.setCurrentYear()
            } else {
              this.$refs.body.scrollTop = this.$refs.body.scrollHeight
            }
            this.step = this.curRenewalDetail.follow_status || 'not_follow';
          }
        })
      }).catch(() => {
        this.rightLoading = false
      })
    },
    //点击tableRow
    handleRowClick(row, type) {
      if(type === '1') {
        this.$refs.bottomDetailTable.setCurrentRow({})
      } else if(type === '2') {
        this.$refs.detailTable.setCurrentRow({})
      }
      let { obj } = this;
      if(row.order_no === obj.order_no) {
        return;
      }
      obj.stage_version = row.current_renewal_stage.version;
      obj.order_no = row.order_no;
      this.getFollowLogs()
    },
    //发送
    send() {
      let d = this.sendData;
      if(this.step === '') {
        this.$notify({
          type: 'error',
          title: '',
          message: '请选择跟踪状态！'
        });
        return;
      }
      if(d.remark === '') {
        this.$notify({
          type: 'error',
          title: '',
          message: '请输入内容！'
        });
        return;
      }else if (!d.follow_way || !d.second_follow_status) {
        if (!this.onlyFirstStatus.includes(this.step) && !d.second_follow_status) {
          this.$notify({
            type: 'error',
            title: '',
            message: '请完善选项！'
          });
          return;
        }
      }
      let data = {
        stage_version: this.obj.stage_version, //续期记录version，列表中的version
        // title: d.title, //标题写点什么
        // remark: d.remark, //内容
        follow_status: this.step, //跟进状态
        ...this.sendData
      }
      this.rightLoading = true
      addFollowStatusLogs(data).then(() => {
        this.$message.success(`发送成功!`)
        this.rightLoading = false
        d.title = ''; //标题写点什么
        d.remark = ''; //内容
        this.getFollowLogs()
      }).catch(() => {
        this.$message.error(`发送失败!`)
        this.rightLoading = false
      })
    },
    isToday(timestamp) {
      return new Date(timestamp).toLocaleDateString() === new Date().toLocaleDateString()
    }
  },
  filters: {
    //被保人过滤器，并转化成字符串
    namefilter(v) {
      let arr = [];
      v.map(k => {
        arr.push(k.name)
      })
      return arr.join(',')
    }
  },
  created() {
    this.getFollowStatus()
    this.getData()
    let routeName = ['RenewalOrderViewMy', 'RenewalOrderViewMyTeam', 'RenewalOrderViewMyCompany']

    if(routeName.includes(this.$route.name)) {
      this.readonly = true;
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
      padding: 12px 16px 20px;
      display: flex;
      align-items: center;
      border-top: 1px solid #E6E6E6;
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
    .child-track-status{
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 5px 16px;

      .child-track-label{
        width: 80px;
        font-size: 14px;
        font-weight: 600;
        //margin-top: -3px;
      }
      .child-track-item{
        flex: 1;
        font-size: 14px;
      }
    }
    .year-wrap {
      height: 35px;
      line-height: 35px;
      color: #333;
      font-size: 16px;
      text-align: center;
      //border-top: 1px solid #E6E6E6;
      border-bottom: 1px solid #E6E6E6;
      font-weight: bold;
    }
    .follow-footer {
      min-height: 84px;
      overflow: hidden;
      //border-top: 1px solid #E6E6E6;
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
.bottom-col {
  margin-bottom: 14px;
}
.copy-class {
  text-decoration: underline;
  color: #1F78FF;
}
.copy-class:active {
  opacity: 0.6;
}
.scrollbar {
  flex: 1;
  overflow: auto;
  position: relative;
  .scrollbar-theme::-webkit-scrollbar {
    width: 6px;
    height: 10px;
    background-color: transparent;
  }
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
        & > .cur-status-dot {
          color: #D8D8D8;
          box-sizing: border-box;
          border: 4px solid #fff;
          margin-right: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #1F78FF;
        }

        .el-avatar {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          display: inline-block;
          text-align: center;
          /deep/ img {
            padding: 0;
            margin: auto;
          }
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
      }
      .message-item-info{
        padding-left: 22px;
        box-sizing: border-box;
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
        .name-span {
          font-weight: 800;
        }
        .detail-info{
          .info-item{
            align-items: flex-start!important;
            margin-top: 5px;
            .item-label{
              width: 60px;
              color: #333;
            }
            .item-content{
              flex: 1;
              color: #999;
              white-space: break-spaces;
              word-break: break-all;
              //font-weight: 600;
            }
          }
        }
      }
      .msg-wrap {
        width: 293px;
        background-color: #F5F5F5;
        padding: 16px;
        color: #131415;
        border-radius: 0px 12px 12px 12px;
        overflow: hidden;
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
          display: block;
          overflow: hidden;
        }
      }
      .sign-block {
        display: flex;
        align-items: center;
        padding-left: 22px;
        box-sizing: border-box;
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
      .name-span {
        font-weight: 800;
      }
    }
    &.active {
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
.scroll-content {
  width: 100%;
  height: 100%;
}
.p_margin {
  padding: 0;
  margin: 0;
}
</style>
<style lang="scss">
.renewal-dropdown-active {
  background-color: rgba(31,120,255,.1) !important;
  color: #1f78ff !important;
}
</style>
