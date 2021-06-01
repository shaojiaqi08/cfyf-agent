<template>
  <div class="order-detail-container">
    <div class="header">
      订单详情
      <el-button
          type="primary"
          :loading="downloading"
          v-if="baseInfo.policy_file_url && $checkAuth('/order/download_policy_file')"
          icon="iconfont iconxiao16_shouqiangaozhi"
          @click="download(baseInfo.policy_file_url)"
      >
        <span class="ml4">下载电子保单</span>
      </el-button>
    </div>
    <div id="detail-content" class="content" :style="{maxHeight: contentMaxHeight + 'px'}">
      <el-scrollbar>
        <!--保单基本信息-->
        <template v-if="$checkAuth(`${perPreFix}base`)">
          <h3 style="display:flex;align-items:center;">
            保单基本信息
            <i
                v-if="policyInfo.pay_link"
                v-clipboard:success="copy"
                v-clipboard:copy="policyInfo.pay_link"
                class="iconfont iconxiao16_fuzhi fs18 flex-center ml8"
                style="color: #1fa5ff;margin-left:3px;font-weight: normal;cursor: pointer;">
              <span style="font-size: 14px;margin-left: 2px;">订单链接</span>
            </i>
          </h3>
          <div class="item-block" v-loading="baseInfoLoading">
            <div class="item">
              <div class="label">保险公司：</div>
              <div class="content">{{baseInfo.supplier_name||'-'}}</div>
            </div>

            <div class="item">
              <div class="label">产品名称：</div>
              <div class="content">{{baseInfo.product_name||'-'}}</div>
            </div>
            <div class="item">
              <div class="label">监管分类：</div>
              <div class="content">
                {{baseInfo.product ? (baseInfo.product.cbirc_category_str||'-')
                  : (baseInfo.cps_product ? baseInfo.cps_product.cbirc_category_str : '-')}}
              </div>
            </div>
            <div class="item">
              <div class="label">订单号：</div>
              <div class="content">{{baseInfo.order_no || '-'}}</div>
            </div>

            <div class="item">
              <div class="label">保单号：</div>
              <div class="content">{{baseInfo.policy_sn||'-'}}</div>
            </div>

            <div class="item">
              <div class="label">投保单号：</div>
              <div class="content">{{baseInfo.proposal_sn||'-'}}</div>
            </div>

            <div class="item">
              <div class="label">保单状态：</div>
              <div class="content">{{baseInfo.policy_status_str||'-'}}</div>
            </div>

            <div class="item">
              <div class="label">保费(元)：</div>
              <div class="content">{{baseInfo.premium||'-'}}</div>
            </div>

            <div class="item">
              <div class="label">基本保额(元)：</div>
              <div class="content">{{baseInfo.guarantee_quota||'-'}}</div>
            </div>

            <div class="item">
              <div class="label">保障期限：</div>
              <div class="content">{{baseInfo.guarantee_period_desc||'-'}}</div>
            </div>
            <div class="item">
              <div class="label">缴费期间：</div>
              <div class="content">{{baseInfo.payment_period_desc||'-'}}</div>
            </div>

            <div class="item">
              <div class="label">投保时间：</div>
              <div class="content">{{baseInfo.proposal_at_str||'-'}}</div>
            </div>

            <div class="item">
              <div class="label">起保日期：</div>
              <div
                  class="content"
              >{{(baseInfo.policy_plan && baseInfo.policy_plan.guarantee_start_at) ? formatDate(baseInfo.policy_plan.guarantee_start_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
            </div>
            <el-divider></el-divider>
          </div>
          <el-divider></el-divider>
        </template>

        <!--客户信息-->
        <template v-if="$checkAuth(`${perPreFix}holder_recognize`)">
          <h3>客户信息</h3>
          <div v-loading="customerInfoLoading">
            <el-tabs v-model="tabIndex" lazy>
              <el-tab-pane label="投保人" name="1"></el-tab-pane>
              <el-tab-pane label="被保人" name="2"></el-tab-pane>
              <el-tab-pane label="受益人" name="3"></el-tab-pane>
            </el-tabs>
            <cust-info :data="customerInfo.policy_holder_info" v-if="tabIndex === '1'"></cust-info>
            <template
                v-for="(item, index) in customerInfo.policy_recognizee_policies"
                v-else-if="tabIndex === '2'"
            >
              <div :key="'policy_recognizee_policies' + index">
                <p style="color:#999;font-size: 14px">被保人{{index + 1}}：</p>
                <cust-info type="2" :data="item"></cust-info>
              </div>
            </template>
            <div
                v-for="(item, index) in customerInfo.policy_recognizee_policies"
                :key="'policy_recognizee_policies' + index"
                v-else
            >
              <div class="mb10 mt10">
                <span class="mr10" style="font-size: 14px">被保人{{index + 1}}的受益人类型</span>
                <el-radio-group :value="customerInfo.is_legal_beneficiary">
                  <el-radio :label="2">指定受益人</el-radio>
                  <el-radio :label="1">法定受益人</el-radio>
                  <el-radio :label="3">被保人本人</el-radio>
                </el-radio-group>
              </div>
              <div
                  class="pl10"
                  :key="'policy_beneficiaries' + index"
                  v-for="(item, index) in item.policy_beneficiaries"
              >
                <p style="color:#999;font-size: 14px">受益人{{index + 1}}：</p>
                <cust-info type="3" :data="item"></cust-info>
              </div>
            </div>
          </div>
          <el-divider></el-divider>
        </template>

        <!--险种信息-->
        <template v-if="$checkAuth(`${perPreFix}insurances`)">
          <h3>险种信息</h3>
          <div v-loading="insuranceInfoLoading">
            <el-table class="mt20" border stripe :data="insuranceInfo.policy_product_insurances">
              <el-table-column label="险种名称" prop="name"></el-table-column>
              <el-table-column label="基本保额(元)" prop="guarantee_quota"></el-table-column>
              <el-table-column label="保费(元)" prop="premium"></el-table-column>
            </el-table>
            <div class="item-block" style="width: 40%;margin: 0 0 0 auto;justify-content: flex-end">
              <div class="item" style="width: auto;display: inline-flex;">
                <div class="label">总保费(元)：</div>
                <div class="content">{{insuranceInfo.total_premium||'-'}}</div>
              </div>
            </div>
          </div>
          <el-divider class="mt4"></el-divider>
        </template>
        <!--人工核保信息-->
        <template v-if="$checkAuth(`${perPreFix}manpower`) && manPowerInfo">
          <h3>人工核保信息</h3>
          <div class="item-block">
            <div class="item">
              <div class="label">是否人核：</div>
              <div class="content">是</div>
            </div>
            <div class="item">
              <div class="label">申请时间：</div>
              <div class="content">{{manPowerInfo.base.add_time ? formatDate(manPowerInfo.base.add_time * 1000, 'yyyy-MM-dd') : '-'}}</div>
            </div>
            <div class="item">
              <div class="label">结论时间：</div>
              <div class="content">{{manPowerInfo.base.verify_at ? formatDate(manPowerInfo.base.verify_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
            </div>
            <div class="item">
              <div class="label">人核结论：</div>
              <div class="content">{{manPowerInfo.base.result||'-'}}</div>
            </div>
            <div class="item">
              <div class="label">人核状态：</div>
              <div class="content">{{manPowerInfo.base.status || '-'}}</div>
            </div>
            <div class="item">
              <div class="label">人核链接：</div>
              <div class="content">
                <el-link v-if="manPowerInfo.base.underwrite_url" type="primary" @click="copyLink(manPowerInfo.base.underwrite_url)">复制链接</el-link>
                <span v-else>-</span>
              </div>
            </div>
            <div class="item">
              <div class="label">人核过期时间：</div>
              <div class="content">{{manPowerInfo.base.expire_at ? formatDate(manPowerInfo.base.expire_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
            </div>
          </div>
          <!--客户资料-->
          <div class="mb10">
            <div class="flex-align-center mb10">
              <div class="label">客户资料：</div>
            </div>
            <div>
              <el-table border stripe :data="manPowerFileList">
                <el-table-column label="所属人" prop="owner"></el-table-column>
                <el-table-column label="文件名" prop="name"></el-table-column>
                <el-table-column label="提交时间">
                  <template v-slot="{row}">{{formatDate(row.add_time * 1000, 'yyyy-MM-dd')}}</template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot="header">
                    <div class="flex flex-align-center">
                      <span class="mr10">操作</span>
                      <el-link v-if="manPowerFileList.length > 0" type="primary" @click="downloadAllFile" :disabled="manPowerDownloading"><i class="el-icon-loading" v-if="manPowerDownloading" style="margin-right: 4px;"></i>下载所有</el-link>
                    </div>
                  </template>
                  <template v-slot="{row}">
                    <el-link type="primary" class="mr10" @click="previewManPowerImg(row)">预览</el-link>
                    <el-link type="primary" :href="row.full_url" target="_blank" download>下载</el-link>
                  </template>
                </el-table-column>
              </el-table>
              <div :title="custInfoCollapse ? '折叠' : '展开'" v-if="this.manPowerInfo && manPowerInfo.policy_manpower_underwriting_file.length > collapseCount" class="cust-info-collapse-block" @click="custInfoCollapse=!custInfoCollapse">
                <i :class="`${custInfoCollapse ? 'el-icon-arrow-up' : 'el-icon-arrow-down'}`"></i>
              </div>
            </div>
          </div>
          <!--人核轨迹-->
          <div>
            <div class="flex-align-center mb10">
              <div class="label">人核轨迹：</div>
            </div>
            <el-timeline>
              <el-timeline-item
                  v-for="(item, index) in manPowerInfo.manpower_line"
                  :key="index"
                  :timestamp="item.do_at ? formatDate(item.do_at * 1000, 'yyyy-MM-dd hh:mm:ss') : '-'">
                <div class="timeline-item" :class="{pointer: item.data}" @click="showManPowerDetail(item)">
                  <i v-if="item.data" class="el-icon-info" style="margin-right: 4px"></i>{{item.title}}<br>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <el-divider></el-divider>
        </template>

        <!--回访信息-->
        <template v-if="$checkAuth(`${perPreFix}visit_info`)">
          <h3 style="display: flex; align-items: center">回访信息
            <i
              v-if="visitInfo.visit_link != ''"
              type="primary"
              @click="copyLink(visitInfo.visit_link)"
              class="iconfont iconxiao16_fuzhi fs18 ml8"
              style="color: #1fa5ff;cursor: pointer;font-weight: normal;display: inline-flex; align-items: center"
            >
              <span style="font-size: 14px;margin-left: 2px;">回访链接</span>
            </i>
          </h3>
          <div class="item-block" v-loading="visitInfoLoading">
            <div class="item">
              <div class="label">回访状态：</div>
              <div class="content">{{visitInfo.visit_status||'-'}}</div>
            </div>
            <div class="item">
              <div class="label">回访时间：</div>
              <div
                  class="content"
              >{{visitInfo.visit_at ? formatDate(visitInfo.visit_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
            </div>
            <div class="item">
              <div class="label">回访方式：</div>
              <div class="content">{{visitInfo.visit_way_name||'-'}}</div>
            </div>
            <div class="item">
              <div class="label">回访失败原因：</div>
              <div class="content">{{visitInfo.visit_ques_reason||'-'}}</div>
            </div>
            <el-divider></el-divider>
          </div>
        </template>

        <!--销售信息-->
        <template v-if="$checkAuth(`${perPreFix}sales_info`)">
          <h3>销售信息</h3>
          <div class="item-block" v-loading="salesInfoLoading">
            <div class="item">
              <div class="label">所属公司：</div>
              <div class="content">{{salesInfo.sales_company_name||'-'}}</div>
            </div>
            <div class="item">
              <div class="label">所属团队：</div>
              <div class="content">{{salesInfo.sales_team_name||'-'}}</div>
            </div>
            <div class="item">
              <div class="label">出单人：</div>
              <div class="content">{{salesInfo.sales_real_name||'-'}}</div>
            </div>
          </div>
          <el-divider></el-divider>
        </template>
      </el-scrollbar>
    </div>
    <el-dialog
        title="续期信息"
        :visible.sync="renewalDialogVisible"
        @close="renewalDialogVisible = false"
        append-to-body
    >
      <el-table :data="renewalInfo.renewal_terms" border stripe>
        <el-table-column label="缴费期数" prop="stage"></el-table-column>
        <el-table-column label="缴费周期"></el-table-column>
        <el-table-column label="应缴日期" prop="renewal_date"></el-table-column>
        <el-table-column label="宽限期满日期" prop="grace_end_at"></el-table-column>
        <el-table-column label="期缴保费(元)" prop="premium"></el-table-column>
        <el-table-column label="预期保费(元)" prop="predict_premium"></el-table-column>
        <el-table-column label="续保状态" prop="renewal_status_name"></el-table-column>
        <el-table-column label="续期失败原因" prop="fail_reason"></el-table-column>
        <el-table-column label="实缴日期" prop="renewal_at"></el-table-column>
      </el-table>
      <span slot="footer">
          <el-button @click="renewalDialogVisible=false">关闭</el-button>
        </span>
    </el-dialog>
    <el-dialog :title="manPowerDetail.title"
               :visible.sync="manPowerDialogVisible"
               :width="manPowerDetail.type === 'customer_info' ? '1200px' : '1200px'"
               custom-class="manpower-dialog"
               :close-on-click-modal="false">
      <el-tabs v-model="activeName" v-if="manPowerDetail.type === 'customer_info'">
        <el-tab-pane :label="(item.role == 'recognizee' ? '被保人-' : '投保人-') + item.name" v-for="(item, index) in manPowerObj" :name="'' + index" :key="'recognizee' + index">
          <template>
            <div class="manpower-block block">
              <div class="item">
                <div class="label">疾病名称：</div>
                <div class="content">{{item.answer.disease_name||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">首次发病时间：</div>
                <div class="content">{{item.answer.first_morbidity_at ? formatDate(item.answer.first_morbidity_at * 1000, 'yyyy-MM-dd hh:mm:ss') : '-'}}</div>
              </div>
              <div class="item">
                <div class="label">最后发病时间：</div>
                <div class="content">{{item.answer.last_morbidity_at ? formatDate(item.answer.last_morbidity_at * 1000, 'yyyy-MM-dd hh:mm:ss') : '-'}}</div>
              </div>
              <div class="item" style="width: 100%;">
                <div class="label">主要症状：</div>
                <div class="content">{{item.answer.symptoms||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">疾病发作持续时间：</div>
                <div class="content">{{item.answer.disease_duration||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">疾病发作次数或频率：</div>
                <div class="content">{{item.answer.disease_frequency||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">是否需要治疗：</div>
                <div class="content">{{item.answer.still_treatment||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">最后一次治疗时间：</div>
                <div class="content">{{item.answer.last_treatment_at ? formatDate(item.answer.last_treatment_at * 1000, 'yyyy-MM-dd') : '-'}}</div>
              </div>
              <div class="item">
                <div class="label">是否包含药物治疗：</div>
                <div class="content">{{item.answer.medication_therapeutic||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">药物治疗备注：</div>
                <div class="content">{{item.answer.medication_therapeutic_remark||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">是否包含物理治疗：</div>
                <div class="content">{{item.answer.physics_therapeutic||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">物理治疗备注：</div>
                <div class="content">{{item.answer.physics_therapeutic_remark||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">是否包含其他治疗：</div>
                <div class="content">{{item.answer.other_therapeutic||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">其他治疗备注：</div>
                <div class="content">{{item.answer.other_therapeutic_remark||'-'}}</div>
              </div>
              <div class="item">
                <div class="label">治疗效果：</div>
                <div class="content">{{item.answer.treatment_effects||'-'}}</div>
              </div>
              <div class="item" style="width:100%">
                <div class="label">其它说明：</div>
                <div class="content">{{item.answer.other_illustrate||'-'}}</div>
              </div>
            </div>
          </template>
          <template v-if="manPowerDetail.type === 'customer_answer'">
            <div :key="index" v-for="(item, index) in manPowerObj">
              <span class="flex"><span style="font-weight: bold">Q：</span>{{item.question}}</span>
              <span class="flex"><span style="font-weight: bold">A：</span>{{item.answer}}</span>
              <el-divider v-if="index!==manPowerObj.length-1"></el-divider>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <template v-else-if="manPowerDetail.type === 'manpower_result_ques'">
        <div :key="index" v-for="(item, index) in manPowerObj">
          <span class="flex"><span style="font-weight: bold">Q：</span>{{item.question}}</span>
          <el-divider v-if="index!==manPowerObj.length-1"></el-divider>
        </div>
      </template>

      <template v-else-if="manPowerDetail.type === 'work_notification' || manPowerDetail.type === 'result_notification'">
        <manpower-table :data="manPowerDetail.data"></manpower-table>
      </template>

      <template v-else-if="manPowerDetail.type === 'manpower_result'">
        <template v-if="typeof manPowerDetail.data === 'string'">
          <span>{{manPowerDetail.data}}</span>
        </template>
        <template v-else>
          <div :key="index" v-for="(item, index) in manPowerDetail.data">
            <span>{{item.content}}</span>
            <el-divider v-if="index!==manPowerDetail.data.length - 1"></el-divider>
          </div>
        </template>
      </template>
    </el-dialog>
    <el-image-viewer
        v-if="isPreview"
        :on-close="closePreview"
        :url-list="previewUrl" />
  </div>
</template>

<script>
import {
  getPolicyBase,
  getPolicyHolder,
  getPolicyInsurances,
  getPolicySales,
  getManPowerInfo,
  getPolicyVisit
} from '@/apis/modules/achievement'
import { formatDate } from '@/utils/formatTime'
import { downloadFrameA } from '@/utils'
import custInfo from '../component/cust-info'
import manpowerTable from '../component/manpower-table.vue'

export default {
  name: 'order-detail',
  components: {
    custInfo,
    manpowerTable
  },
  data() {
    return {
      policyInfo: {},
      payInfo: {},
      baseInfo: {},
      baseInfoLoading: false,
      tabIndex: '1',
      downloading: false,
      contentMaxHeight: null,
      customerInfoLoading: false,
      insuranceInfoLoading: false,
      salesInfoLoading: false,
      payInfoLoading: false,
      visitInfoLoading: false,
      relationInfoLoading: false,
      renewalDialogVisible: false,
      renewalInfoLoading: false,
      salesInfo: {},
      customerInfo: {
        policy_holder_info: {},
        policy_recognizee_policies: [],
        policy_payment: {},
      },
      relationInfo: [],
      insuranceInfo: {
        policy_product_insurances: [],
      },
      renewalInfo: {
        renewal_insurance: {},
        renewal_terms: [],
      },
      payInfoPayment: {},
      visitInfo: {},
      manPowerInfoLoading: false,
      custInfoCollapse: false,
      manPowerDownloading: false,
      previewUrl: [],
      isPreview:false,
      manPowerDialogVisible: false,
      manPowerDetail: {},
      activeName: '0',
      collapseCount: 5,
      manPowerInfo: null
    }
  },
  computed: {
    manPowerObj() {
      return this.manPowerDetail.data || {}
    },
    manPowerFileList() {
      const list = this.manPowerInfo.policy_manpower_underwriting_file || []
      return this.custInfoCollapse ? list : list.slice(0, this.collapseCount)
    },
    // 权限值前缀
    perPreFix () {
      const map = {
        'achievement-company-detail': '/company_performance/',
        'achievement-team-detail': '/team_performance/',
        'achievement-self-detail': '/my_performance/'
      }
      return map[this.$route.name]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    formatDate,
    download(url) {
      window.open(url)
      // this.downloading = true
      // const params = { order_no: this.$route.params.order_no }
      // getPolicyFile(params)
      //   .then((res) => {
      //     if (res.policy_file_url) {
      //       window.open(res.policy_file_url)
      //     }
      //   })
      //   .finally(() => (this.downloading = false))
    },
    init() {
      const { perPreFix } = this
      // 获取保单基本信息
      this.$checkAuth(`${perPreFix}base`) && this.getPolicyBase_()
      // 获取客户信息
      this.$checkAuth(`${perPreFix}holder_recognize`) && this.getPolicyHolder_()
      // 获取险种信息
      this.$checkAuth(`${perPreFix}insurances`) && this.getPolicyInsurances_()
      // 获取人核信息
      this.$checkAuth(`${perPreFix}manpower`) && this.getManPowerInfo_()
      // 获取销售信息
      this.$checkAuth(`${perPreFix}sales_info`) && this.getPolicySales_()
      // 获取回访信息
      this.$checkAuth(`${perPreFix}visit_info`) && this.getPolicyVisit_()
      // 设置高度
      this.setHeight()
      window.addEventListener('resize', this.setHeight);
    },
    setHeight() {
      this.contentMaxHeight = innerHeight - document.querySelector('#detail-content').getBoundingClientRect().top - 20
    },
    copyLink(link) {
      this.$copyText(link).then(
          () => {
            this.$message.success('已复制到粘贴板')
          },
          (e) => {
            this.$message.error(e)
          }
      )
    },
    getManPowerInfo_() {
      const obj = {
        order_no: this.$route.params.id,
      }
      this.manPowerInfoLoading = true
      getManPowerInfo(obj).then(res => {
        this.manPowerInfo = res.manpower_data
      }).finally(() => {
        this.manPowerInfoLoading = false
      })
    },
    // 人核下载所有
    downloadAllFile() {
      const {id} = this.$route.params
      const url = `${process.env.DOMAIN}/policy/detail/manpower-zip?id=${id}`
      this.manPowerDownloading = true
      downloadFrameA(url, `${formatDate(new Date(), 'yyyyMMddhhmmss')}.zip`).finally(() => {
        this.manPowerDownloading = false
      })
    },
    // 预览人核图片
    previewManPowerImg(row) {
      this.isPreview = true
      this.previewUrl = [row.full_url]
    },
    showManPowerDetail(obj) {
      if (!obj.data) {
        return
      }
      this.activeName = '0'
      this.manPowerDetail = obj
      this.manPowerDialogVisible = true
    },
    closePreview() {
      this.isPreview = false
    },
    getPolicyVisit_() {
      const obj = {
        order_no: this.$route.params.id,
      }
      this.visitInfoLoading = true
      getPolicyVisit(obj).then((res) => {
        this.visitInfo = {
          ...res,
          ...(res.policy_sales || {}),
          ...(res.policy_customer || {}),
        }
        this.visitInfoLoading = false
      })
    },
    getPolicySales_() {
      const obj = {
        order_no: this.$route.params.id,
      }
      this.salesInfoLoading = true
      getPolicySales(obj).then((res) => {
        this.salesInfo = {
          ...res,
          ...(res.policy_sales || {}),
          ...(res.policy_customer || {}),
        }
        this.salesInfoLoading = false
      })
    },
    getPolicyInsurances_() {
      // 获取险种信息
      const obj = {
        order_no: this.$route.params.id,
      }
      this.insuranceInfoLoading = true
      getPolicyInsurances(obj).then((res) => {
        this.insuranceInfo = res
        this.insuranceInfoLoading = false
      })
    },
    getPolicyHolder_() {
      // 获取保单基本信息
      const obj = {
        order_no: this.$route.params.id,
      }
      this.customerInfoLoading = true
      getPolicyHolder(obj).then((res) => {
        res.policy_holder_info.policy_renewal = res.policy_renewal || {}
        this.customerInfo = res
        this.customerInfoLoading = false
      })
    },
    getPolicyBase_() {
      // 获取客户信息
      const obj = {
        order_no: this.$route.params.id,
      }
      this.baseInfoLoading = true
      getPolicyBase(obj).then((res) => {
        this.policyInfo = res
        this.baseInfo = res
        this.baseInfoLoading = false
      })
    },
    copy() {
      this.$message.success('支付链接已复制到粘贴板')
    },
  },
}
</script>

<style scoped lang="scss">
.order-detail-container {
  background-color: #fff;
  width: 1200px;
  margin: 20px auto;
  border: 1px solid #e6e6e6;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    padding: 0 16px;
    height: 56px;
    line-height: 56px;
    background: #f5f5f5;
    border-radius: 4px 4px 0px 0px;
    border-bottom: 1px solid #e6e6e6;
  }
  & > .content {
    padding: 0 16px 16px 16px;
    overflow: hidden;
    display: flex;
    ::v-deep .el-scrollbar {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    h4 {
      color: #1a1a1a;
      line-height: 24px;
      margin: 0 0 8px 0;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
      & > div {
        width: 25%;
        font-size: 14px;
        color: #4d4d4d;
        margin-bottom: 12px;
        line-height: 20px;
        & > span {
          color: #1a1a1a;
          margin-left: 8px;
          font-weight: bold;
        }
      }
    }
  }
}
.order-flex {
  display: flex;
  line-height: 24px;
  h4 {
    margin: 0 0 8px 0;
  }
  i {
    cursor: pointer;
    color: #40aaff;
  }
}
.item-block {
  display: flex !important;
  flex-wrap: wrap;
  margin-bottom: 16px;
  .item {
    width: 25%;
    box-sizing: border-box;
    display: flex;
    align-items: baseline;
    margin: 10px 0;
    font-size: 14px;
    & > .label {
      width: 120px;
      text-align: right;
      box-sizing: border-box;
      padding-right: 5px;
    }
    & > .content {
      flex: 1;
      overflow: hidden;
      word-break: break-all;      padding: 0;
      font-weight: 700;
    }
    &.one-line {
      width: 100%;
    }
  }
  &.manpower-block .label{
    width: 145px;
  }
  &.manpower-block .item {
    width: 33.3333%;
  }
  &:last-of-type .el-divider{
    display: none;
  }
}
::v-deep .el-timeline {
  display: inline-block;
  .timeline-item.pointer{
    cursor: pointer;
  }
}
::v-deep .el-collapse{
  border: transparent;
  .el-collapse-item__header{
    font-size: 18px;
    font-weight: bold;
    border:transparent;
  }
  &.cust-info-collapse .el-collapse-item__header{
    font-size: 12px !important;
    font-weight: normal !important;
  }
  .el-collapse-item__arrow{
    margin-left: 10px;
  }
  .el-collapse-item__wrap{
    border-bottom: transparent;
  }
}
::v-deep .manpower-dialog {
  .el-dialog__body {
    padding-bottom: 20px;
  }
}
</style>
