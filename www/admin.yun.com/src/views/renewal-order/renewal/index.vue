<template>
  <div class="renewal-container page-container">
    <div class="header">
      <common-tabs-header :data="tabsData" v-model="searchModel.product_insurance_duration_type" @tab-click="tabChange" :disabled="loading"></common-tabs-header>
      <el-input
          v-model="searchModel.keyword"
          placeholder="搜索单号或投被保人信息"
          size="small"
          class="fw400"
          clearable
          @input="searchModelChange"
      >
        <i slot="prefix" class="ml4 iconfont iconxiao16_sousuo el-input__icon"></i>
      </el-input>
    </div>
    <div class="scroll-box p16" ref="content" v-loading="loading">
      <div>
        <!--应续日期-->
        <filter-shell
            v-model="searchModel.date_range"
            :width="300"
            :textOverflow="false"
            :collapse="false"
            autoClose
            autofocus
            class="mb16"
            @input="searchModelChange"
        >
          <el-date-picker
              v-model="searchModel.date_range"
              type="daterange"
              style="width: 265px;"
              value-format="timestamp"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              @change="searchModelChange"
          ></el-date-picker>
          <template
              v-slot:label
          >{{ searchModel.date_range.length ? `${formatDate(searchModel.date_range[0], 'yyyyMMdd')} ~ ${formatDate(searchModel.date_range[1], 'yyyyMMdd')}` : '应续日期' }}</template>
          <template v-slot:link>
            <div class="link-content">
              <span
                  v-for="(date, index) in dateRange"
                  :key="index"
                  class="date-item"
                  :class="{ active: date.start === formatDate(searchModel.date_range[0], 'yyyyMMdd') && date.end === formatDate(searchModel.date_range[1], 'yyyyMMdd') }"
                  @click.stop="dateSelect(date)"
              >{{ date.name }}</span>
            </div>
          </template>
        </filter-shell>
        <!--出单人-->
        <filter-shell
            v-model="searchModel.sales_id"
            autoFocus
            class="mb16"
            @input="searchModelChange"
        >
          <el-select
              class="block"
              v-model="searchModel.sales_id"
              clearable
              filterable
              multiple
              placeholder="请选择"
              @change="searchModelChange"
          >
            <el-option
                v-for="item in salesList"
                :key="item.id"
                :label="item.real_name"
                :value="item.id"
            ></el-option>
          </el-select>
          <template
              v-slot:label
          >{{hasValue(searchModel.sales_id) ? '出单人' + salesList.find(i => i.id === searchModel.sales_id[0]).real_name : '出单人'}}</template>
        </filter-shell>

        <!--保险产品-->
        <filter-shell
            v-model="searchModel.product_id_type"
            autoFocus
            class="mb16"
            @input="searchModelChange"
        >
          <el-select
              class="block"
              v-model="searchModel.product_id_type"
              multiple
              clearable
              filterable
              placeholder="请选择"
              @change="searchModelChange"
          >
            <el-option
                v-for="item in productList"
                :key="item.id_type"
                :label="item.name"
                :value="item.id_type"
            ></el-option>
          </el-select>
          <template
              v-slot:label
          >{{ hasValue(searchModel.product_id_type) ? '保险产品' + productList.find(i => i.id_type === searchModel.product_id_type[0]).name : '保险产品' }}</template>
        </filter-shell>

        <!--保险公司-->
        <filter-shell
            v-model="searchModel.supplier_id"
            autoFocus
            class="mb16"
            @input="searchModelChange"
        >
          <el-select
              class="block"
              v-model="searchModel.supplier_id"
              multiple
              clearable
              filterable
              placeholder="请选择"
              @change="searchModelChange"
          >
            <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
          <template
              v-slot:label
          >{{ hasValue(searchModel.supplier_id) ? '保险公司' + supplierList.find(i => i.id === searchModel.supplier_id[0]).name : '保险公司' }}</template>
        </filter-shell>

        <!--B端公司-->
        <!-- <filter-shell
            v-model="searchModel.sales_company_id"
            autoFocus
            class="mb16"
            @input="searchModelChange"
        >
          <el-select
              class="block"
              v-model="searchModel.sales_company_id"
              multiple
              clearable
              filterable
              placeholder="请选择"
              @change="searchModelChange"
          >
            <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
          <template
              v-slot:label
          >{{ hasValue(searchModel.sales_company_id) ? 'B端公司' + companyList.find(i => i.id === searchModel.sales_company_id[0]).name : 'B端公司' }}</template>
        </filter-shell> -->

        <!--全部团队-->
        <filter-shell
          autoFocus
          v-model="searchModel.sales_team_id"
          class="mb16"
          @input="searchModelChange">
          <el-select
              class="block"
              v-model="searchModel.sales_team_id"
              multiple
              clearable
              filterable
              placeholder="请选择"
              @change="searchModelChange"
          >
            <el-option
                v-for="item in salesTeamList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
          <div class="mt20 mb10 flex-between">
            包含子团队
            <el-switch
                :disabled="searchModel.sales_team_id.length<=0"
                style="float: right"
                inactive-value="0"
                active-value="1"
                v-model="searchModel.include_child_team"
                @change="searchModelChange"
            ></el-switch>
          </div>
          <template
              v-slot:label
          >{{ hasValue(searchModel.sales_team_id) ? salesTeamList.find(i => i.id === searchModel.sales_team_id[0]).name : '团队' }}</template>
        </filter-shell>
      </div>
      <div class="status-filter-wrap">
        <div>
          <span>续保状态</span>
          <el-tooltip content="续保状态为系统内该续保续期订单的续保状态" placement="top">
            <i class="iconfont iconxiao16_gengduoxinxi"></i>    
          </el-tooltip>
          <el-checkbox-group v-model="searchModel.renewal_status" @change="searchModelChange">
            <el-checkbox
              size="small"
              v-for="item in renewalStatusOptions"
              :label="item.value"
              :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div>
          <span>跟踪状态</span>
          <el-tooltip content="跟踪状态为跟踪人员手工选择状态，不代表真实的续保状态" placement="top">
            <i class="iconfont iconxiao16_gengduoxinxi"></i>
          </el-tooltip>
          <el-checkbox class="mr30" label="全部" v-model="isCheckAll" @change="handleCheckAll"></el-checkbox>
          <el-checkbox-group v-model="searchModel.follow_status" @change="handleCheckFollow">
            <el-checkbox size="small"
               v-for="item in followStatusOptions"
               :type="item.value === searchModel.follow_status ? 'primary' : 'default'"
               :label="item.value"
               :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="flex-between" style="align-items: flex-end;">
        <div class="data-row" ref="dataRow">
          <div class="scroll-wrap">
            <div class="item-block">
              <div>
                长险应续保费(元)
                <template>
                  <span class="primary">{{ statisticInfo.long_predict_premium }}</span>
                </template>
              </div>
              <div>
                长险已续保费(元)
                <span class="primary">{{ statisticInfo.long_success_premium }}</span>
              </div>
              <div>
                长险应续保单
                <span class="primary">{{ statisticInfo.long_predict_count }}</span>
              </div>
              <div>
                长险已续保单
                <span class="primary">{{ statisticInfo.long_success_count }}</span>
              </div>
            </div>
            <div class="item-block">
              <div>
                短险应续保费(元)
                <span class="primary">{{ statisticInfo.short_predict_premium }}</span>
              </div>
              <div>
                短险已续保费(元)
                <span class="primary">{{ statisticInfo.short_success_premium }}</span>
              </div>
              <div>
                短险应续保单
                <span class="primary">{{ statisticInfo.short_predict_count }}</span>
              </div>
              <div>
                短险已续保单
                <span class="primary">{{ statisticInfo.short_success_count }}</span>
              </div>
            </div>
          </div>
        </div>
        <el-button
            size="small"
            type="primary"
            class="mb16"
            :loading="exporting"
            icon="iconfont iconxiao16_xiazai mr4"
            v-if="$checkAuth('/company_performance/export')"
            @click="policyExport"
        >导出数据</el-button>
      </div>
      <el-table
          :data="list"
          :max-height="tableMaxHeight"
          v-table-infinite-scroll="scroll2Bottom"
          border
          stripe
          ref="table"
      >
        <el-table-column label="团队" prop="policy.sales_team_name" align="center" width="150px" fixed="left"></el-table-column>
        <el-table-column label="出单人" prop="policy.sales_real_name" align="center" width="150px" fixed="left"></el-table-column>
        <el-table-column label="保险公司" prop="policy.supplier_name" align="center" width="250px"></el-table-column>
        <el-table-column label="产品名称" prop="policy.product_name" align="center" width="250px"></el-table-column>
        <el-table-column label="应续日期" prop="renewal_date_format" width="170px" align="center"></el-table-column>
        <el-table-column label="宽限日期" prop="policy_at_str" width="170px" align="center">
          <template v-slot="{ row }">
            <div v-if="row.grace_start_at && row.grace_end_at">
              {{ formatDate(row.grace_start_at * 1000, 'yyyyMMdd') }}
              -
              {{ formatDate(row.grace_end_at * 1000, 'yyyyMMdd') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="投保人" prop="policy.policy_holder_info.name" width="180px" align="center"></el-table-column>
        <el-table-column label="被保人" prop="policy.recognizee_policy_name" width="180px" align="center"></el-table-column>
        <el-table-column label="应收保费" prop="premium" align="center" width="100px"></el-table-column>
        <el-table-column label="续收期间" prop="renewal_date" align="center"></el-table-column>
        <el-table-column label="缴费期限" prop="policy.payment_period_desc" align="center"></el-table-column>
        <el-table-column label="保单号" prop="policy_sn" align="center" width="200px"></el-table-column>
        <el-table-column label="投保人手机号" prop="policy.policy_holder_info.mobile" align="center" width="210px"></el-table-column>
        <el-table-column label="续保状态" prop="renewal_status_name" align="center"></el-table-column>
        <el-table-column label="续保链接" prop="renewal_link" align="center">
          <template v-slot="{ row }">
            <text-hidden-ellipsis :popoverTip="row.renewal_link" width="248px" @click="copyRenewalLink(row.renewal_link)"></text-hidden-ellipsis>
          </template>
        </el-table-column>
        <el-table-column label="跟踪状态" prop="follow_status_name" width="170px" align="center"></el-table-column>
        <el-table-column label="最近跟踪人员" prop="follow_obj_name" width="170px" align="center"></el-table-column>
        <el-table-column label="最近跟踪记录" prop="last_customer_follow_log_content" width="170px" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150px" align="center">
          <template slot-scope="{row}">
            <el-link
              type="primary"
              @click="trace(row)"
              class="mr8">跟踪</el-link>
            <el-link
              type="primary"
              @click="copyLink(row)"
              v-if="row.renewal_link !== ''"
              class="mr8">复制链接</el-link>
            <el-link
              type="primary"
              @click="showQrCode(row)"
              v-if="row.renewal_link !== ''"
              class="mr8">链接二维码</el-link>
            <el-link
              type="primary"
              @click="showSendLetter(row)"
              class="mr8">发送短信</el-link>
            <el-link
              type="primary"
              @click="trace(row, true)"
              class="mr8">查看</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <qr-code-dialog
      :visible.sync="qrCodeDialogVisible"
      :src="qrCodeSrc"></qr-code-dialog>
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
import {
  getSalesData,
  getSalesTeamData,
  getDateRange
} from '@/apis/modules/achievement'
import { 
  getRenewalCompanyList, 
  getRenewalTeamList, 
  getRenewalSalesList,
  getStatisticsForSales,
  getStatisticsForTeam,
  getStatisticsForCompany,
  getMsgTemplate,
  sendCustomerMsg,
  exportSalesPolicy,
  exportTeamPolicy,
  exportCompanyPolicy
} from '@/apis/modules/renewal-order'
import { getAllProducts, getSupplierList } from '@/apis/modules/index'
import { formatDate, dateStr2Timestamp,formatYYMMDD } from '@/utils/formatTime'
import { debounce, downloadFrameA } from '@/utils'
import qs from 'qs'
import FilterShell, { hasValue } from '@/components/filters/filter-shell'
import textHiddenEllipsis from '@/components/text-hidden-ellipsis'
import CommonTabsHeader from '@/components/common-tabs-header'
import QrCodeDialog from './dialog/qrcode-dialog'
import LetterDialog from '../component/dialog/letter-dialog.vue'
import QRCode from 'qrcode'
// 续保续期订单
export default {
  name: 'renewal-order',
  components: {
    FilterShell,
    textHiddenEllipsis,
    CommonTabsHeader,
    QrCodeDialog,
    LetterDialog
  },
  data() {
    return {
      qrCodeDialogVisible: false,
      qrCodeSrc: '',
      letterDialogVisible: false,
      detailObj: {
        message: ''
      },
      sendLoading: false,
      loading: false,
      formatDate,
      filterValue: false,
      belongVisible: false,
      belongData: {},
      list: [],
      page: 1,
      page_size: 20,
      total: 0,
      productList: [],
      salesList: [],
      salesTeamList: [],
      supplierList: [],
      // companyList: [],
      dateRange: [],
      statisticInfo: {},
      tableLoading: false,
      statisticLoading: false,
      exporting: false,
      tabsData: Object.freeze([
        { label: '全部续保续期', name: ' ' },
        { label: '短险续保', name: '0' },
        { label: '长期续保', name: '1' }
      ]),
      searchModel: {
        product_insurance_duration_type: '',
        keyword: '',
        renewal_status: [],
        follow_status: [],
        policy_status: [],
        product_id_type: [],
        supplier_id: [],
        date_range: [+new Date(), +new Date()],
        sales_id: [],
        sales_team_id: [],
        include_child_team: '0'
      },
      tableMaxHeight: null,
      followStatusOptions: Object.freeze([
        { label: '未跟踪', value: 'not_follow' },
        { label: '已跟踪', value: 'already_follow' },
        { label: '未联系上', value: 'cannot_get_in_touch' },
        { label: '放弃续保', value: 'refuse_renewal' },
        { label: '已续保', value: 'already_renewal' },
        { label: '其他', value: 'other' }
      ]),
      isCheckAll: false,
      renewalStatusOptions: Object.freeze([
        { label: '待续保', value: 'need_renewal' },
        { label: '续期失败', value: 'renewal_failed' },
        { label: '已续保', value: 'already_renewal' },
        { label: '无需续保', value: 'not_need_renewal' },
        { label: '不可续保', value: 'cannot_renewal' }
      ]),
      renewalApiMap: Object.freeze({
        renewalCompany: getRenewalCompanyList, 
        renewalTeam: getRenewalTeamList, 
        RenewalOrder: getRenewalSalesList
      }),
      templateVersion: '',
      exportApiMap: Object.freeze({
        renewalCompany: exportCompanyPolicy, 
        renewalTeam: exportTeamPolicy, 
        RenewalOrder: exportSalesPolicy
      })
    }
  },
  methods: {
    formatYYMMDD,
    handleCheckAll(v) {
      this.searchModel.follow_status = v ? this.followStatusOptions.map(i => i.value) : []
      this.searchModelChange()
    },
    getStaticData() {
      let getApiRequest = Object.freeze({
        RenewalOrder: getStatisticsForSales, 
        renewalTeam: getStatisticsForTeam, 
        renewalCompany: getStatisticsForCompany
      })
      let getStatic = getApiRequest[this.$route.name];
      getStatic(this.searchModelFormat(true)).then(res => {
        this.statisticInfo = res
      })
    },
    handleCheckFollow(v) {
      this.isCheckAll = v.length === this.followStatusOptions.length
      this.searchModelChange()
    },
    copyRenewalLink(link) {
      this.$copyText(link).then(() => this.$message.success('续保链接已复制到粘贴板'))
    },
    showQrCode({ renewal_link }) {
      QRCode.toDataURL(renewal_link).then(result => {
        this.qrCodeSrc = result
        this.qrCodeDialogVisible = true
      })
    },
    //获取消息模板
    showSendLetter(obj) {
      this.letterDialogVisible = true
      this.sendLoading = true
      this.templateVersion = obj.version
      getMsgTemplate({version: obj.version}).then(res => {
        this.sendLoading = false
        this.detailObj = res
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
    // 跟踪
    trace({version}, isView) {
      let paths = {
        'renewalCompany': isView? 'RenewalOrderViewMyCompany' : "RenewalOrderTraceCompany",
        'renewalTeam': isView? 'RenewalOrderViewMyTeam' : 'RenewalOrderTraceTeam',
        'RenewalOrder': isView? 'RenewalOrderViewMy' : 'RenewalOrderTraceMy'
      }
      let pathName = ''
      Object.keys(paths).filter(v => {
        if(v === this.$route.name) {
          pathName = paths[v]
        }
      })
      window.open(this.$router.resolve({
        name: pathName,
        params: { version }
      }).href)
    },
    tabChange() {
      Object.assign(this.searchModel, {
        keyword: '',
        policy_status: [],
        products: [],
        supplier_id: [],
        date_range: [+new Date(), +new Date()],
        sales_id: [],
        sales_team_id: [],
        include_child_team: '0',
      })
      this.getData()
      this.getStaticData()
    },
    copyLink({ renewal_link }) {
      this.$copyText(renewal_link).then(() => this.$message.success('链接已复制到粘贴板'))
    },
    policyExport() {
      let exportData = this.exportApiMap[this.$route.name];
      const url = `${exportData}?${qs.stringify({
        ...this.searchModelFormat(true),
      })}`
      this.exporting = true
      downloadFrameA(
          url,
          `订单数据-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`,
          'get',
          true
      ).then(() => {
        // this.$message.success('导出成功')
      })
      .finally(() => {
        this.exporting = false
      })
    },
    dateSelect(date) {
      const start = dateStr2Timestamp(date.start)
      const end = dateStr2Timestamp(date.end)
      if (!start && !end) {
        this.searchModel.date_range = ''
      } else {
        this.searchModel.date_range = [
          dateStr2Timestamp(date.start),
          dateStr2Timestamp(date.end),
        ]
      }
      this.searchModelChange()
    },
    scroll2Bottom() {
      const { page, page_size, total } = this
      if(total < 20) {
        return
      }
      if (page * page_size < total) {
        this.tableLoading = true
        this.page += 1
      }
      this.getData()
    },
    searchModelChange() {
      const func = debounce(() => {
        this.tableLoading = true
        this.statisticLoading = true
        this.page = 1
        this.total = 0
        this.statisticInfo = {}
        // 重置滚动条
        this.$refs.table.$el
            .querySelector('.el-table__body-wrapper')
            .scrollTo(0, 0)
        this.getData()
        this.getStaticData()
      }, 300)
      func()
      this.searchModelChange = func
    },
    hasValue,
    showInfoDialog(row) {
      // 20210525 LiuZicong 改为传订单号order_no
      let routeUrl = this.$router.resolve(`/achievement-company/detail/${row.order_no}`)
      window.open(routeUrl.href, '_blank')

      // let routeUrl = this.$router.resolve(
      //   `/achievement-company/detail/${row.id}`
      // )
      // window.open(routeUrl.href, '_blank')
      // this.$router.push({ path: `/achievement-company/detail/${row.id}` })
    },
    searchModelFormat(withPage = false) {
      let model = { ...this.searchModel }
      Object.keys(model).forEach((key) => {
        if (key === 'date_range') {
          const [start, end] = model.date_range
          model.policy_renewal_date_start = start ? formatDate(start, 'yyyyMMdd') : ''
          model.policy_renewal_date_end = end ? formatDate(end, 'yyyyMMdd') : ''
        }
      })
      // 没有选择团队删除包含子团队参数
      if (model.sales_team_id.length <= 0) {
        delete model.include_child_team
      }
      delete model.date_range
      if (withPage) {
        model = Object.assign(model, {
          page: this.page,
          page_size: 20
        })
      }
      console.log('model',model)
      return model
    },
    getData() {
      this.loading = true;
      let getList = this.renewalApiMap[this.$route.name];
      getList(this.searchModelFormat(true)).then(res => {
        this.list = this.page === 1 ? res.data : this.list.concat(res.data)
        this.total = res.total
        this.page = res.current_page
      }).finally(() => {
        this.loading = false
      })
    },
    getSalesData() {
      getSalesData()
          .then((res) => {
            this.salesList = res
          })
          .catch((err) => console.log(err))
    },
    getSalesTeamData() {
      getSalesTeamData()
          .then((res) => {
            this.salesTeamList = res
          })
          .catch((err) => console.log(err))
    },
    getAllProducts() {
      getAllProducts()
          .then((res) => {
            this.productList = res
          })
          .catch((err) => console.log(err))
    },
    getSupplierList() {
      getSupplierList()
          .then((res) => {
            this.supplierList = res
          })
          .catch((err) => console.log(err))
    },
    // getCompanyList() {
    //   getCompanyList().then(res => {
    //     this.companyList = res
    //   }).catch(err => console.log(err))
    // },
    getDateRange() {
      getDateRange().then((res) => {
        const arrDate = ['今天', '昨天', '本年', '全部']
        this.dateRange = res.filter(v => {
          if(!arrDate.includes(v.name)) {
            return v
          }
        })  
        // 确定表格top值, 可以计算表格最高度
        this.$nextTick(() => this.calcTableHeight())
      })
    },
    calcTableHeight: debounce(function() {
      const bodyHeight = document.body.clientHeight
      const { top } = this.$refs.table.$el.getBoundingClientRect()
      this.tableMaxHeight = bodyHeight - top - 10
    }, 300)
  },
  created() {
    this.getData()
    this.getStaticData()
    this.getSalesData()
    this.getDateRange()
    this.getSalesTeamData()
    this.getAllProducts()
    this.getSupplierList()
    // this.getCompanyList()
  },
  mounted() {
    window.addEventListener('resize', this.calcTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calcTableHeight)
  }
}
</script>
<style lang="scss" scoped>
.renewal-container {
  padding: 0 20px 0 20px;
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

  .scroll-box {
    // padding: 16px 16px 0 16px;
    background-color: #fff;
    flex: 1;
    overflow: hidden;
  }

  .data-row {
    padding: 0 0 16px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    .scroll-wrap {
      float: left;
      transition: all 0.3s ease-out;
      .item-block {
        background: #f5f5f5;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        display: inline-flex;
        margin-right: 16px;

        & > div {
          margin: 8px;
          padding: 0 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          line-height: 20px;
          color: #333;

          & > span {
            font-weight: bold;
            font-size: 16px;
            line-height: 24px;
            height: 24px;
            display: block;
            white-space: nowrap;
            &.primary {
              color: #1F78FF;
            }
            &.warning {
              color: #4497eb;
            }
            &.danger {
              color: #ff5151;
            }
            &.info{
              color: #FF9000;
            }
          }
        }
      }
      .item-block:last-of-type {
        margin-right: 0;
      }
    }

    .el-button {
      position: absolute;
      padding: 0;
      min-width: initial;
      width: 36px;
      top: 50%;
      transform: translateY(-50%);
      box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.1);
      border: transparent;
      color: #1F78FF;
      z-index: 99;
      &.left {
        left: 16px;
      }
      &.right {
        right: 16px;
      }
    }
  }

  .el-dialog__wrapper ::v-deep .belong-dialog {
    width: 200px;
    .el-dialog__body {
      overflow: visible;
      .card {
        background: #f5f5f5;
        border: 1px solid #e6e6e6;
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 20px;
        & > .el-row:nth-of-type(1) {
          .el-col:first-of-type {
            font-weight: bold;
            color: #1a1a1a;
          }
        }
        & > .el-row:nth-of-type(2) {
          margin-top: 16px;
          .el-col {
            display: flex;
            flex-direction: column;
            line-height: 20px;
            color: #999999;
            font-size: 14px;
            span {
              margin-top: 4px;
              color: #1a1a1a;
              font-weight: bold;
            }
          }
        }
        .el-divider {
          margin: 16px 0;
        }
        & > .el-row:nth-of-type(4) {
          margin-top: 16px;
          .el-col {
            display: flex;
            line-height: 20px;
            color: #999999;
            font-size: 14px;
            align-items: center;
            span {
              color: #1a1a1a;
              font-weight: 400;
              margin-left: 8px;
            }
          }
        }
      }
    }
    .el-dialog__footer {
      padding-top: 0;
    }
    .el-form-item .el-select {
      width: 100%;
    }
  }

  .status-filter-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    & > div {
      border: 1px solid #E6E6E6;
      border-radius: 4px;
      background-color: #f5f5f5;
      min-height: 32px;
      padding: 6px 0 6px 12px;
      display: flex;
      align-items: center;
      color: #1A1A1A;
      margin-right: 16px;
      & > span {
        white-space: nowrap;
      }
      .el-checkbox {
        margin-right: 18px;
      }
      .iconfont {
        margin-right: 18px;
        margin-left: 2px;
        color: #1F78FF;
        font-size: 16px;
        line-height: 16px;
        cursor: pointer;
      }
    }
  }
}
.link-content {
  position: relative;
  border-left: 1px solid #e6e6e6;
  padding-left: 4px;
  .date-item {
    display: inline-block;
    padding: 2px 8px;
    text-align: center;
    &:hover,
    &.active {
      background-color: #fff;
      border-radius: 4px;
      color: #1F78FF;
      font-weight: bold;
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
    }
  }
}

::v-deep .el-tabs__header {
  margin-bottom: 0;
}

.table-header {
  margin-bottom: 16px;
  height: 32px;
  font-size: 16px;
  font-weight: 500;
  line-height: 32px;
}

.link-content {
  position: relative;
  border-left: 1px solid #e6e6e6;
  padding-left: 4px;
  .date-item {
    display: inline-block;
    padding: 2px 8px;
    text-align: center;
    &:hover,
    &.active {
      background-color: #fff;
      border-radius: 4px;
      color: #1F78FF;
      font-weight: bold;
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
