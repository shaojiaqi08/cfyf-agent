<template>
  <div class="renewal-container page-container">
    <div class="header">
      <common-tabs-header :data="tabsData" v-model="tabIndex" @tab-click="tabChange" :disabled="tableLoading"></common-tabs-header>
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
            v-model="searchModel.products"
            autoFocus
            class="mb16"
            @input="searchModelChange"
        >
          <el-select
              class="block"
              v-model="searchModel.products"
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
          >{{ hasValue(searchModel.products) ? '保险产品' + productList.find(i => i.id_type === searchModel.products[0]).name : '保险产品' }}</template>
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
          >{{ hasValue(searchModel.supplier_id) ? 'B端公司' + supplierList.find(i => i.id === searchModel.supplier_id[0]).name : 'B端公司' }}</template>
        </filter-shell>

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
          <i class="iconfont iconxiao16_gengduoxinxi"></i>
          <el-checkbox-group v-model="page">
            <el-checkbox label="待续保"></el-checkbox>
            <el-checkbox label="续保失败"></el-checkbox>
            <el-checkbox label="已续保"></el-checkbox>
            <el-checkbox label="无需续保"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div>
          <span>跟踪状态</span>
          <i class="iconfont iconxiao16_gengduoxinxi"></i>
          <el-checkbox-group v-model="page">
            <el-checkbox label="全部"></el-checkbox>
            <el-checkbox label="未跟踪"></el-checkbox>
            <el-checkbox label="已跟踪"></el-checkbox>
            <el-checkbox label="未联系上"></el-checkbox>
            <el-checkbox label="放弃续保"></el-checkbox>
            <el-checkbox label="已续保"></el-checkbox>
            <el-checkbox label="其他"></el-checkbox>
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
                  <span class="primary">{{ statisticInfo.company_actually_commission }}</span>
                </template>
              </div>
              <div>
                长险已续保费(元)
                <span class="primary">{{ statisticInfo.sales_position_commission }}</span>
              </div>
              <div>
                长险应续保单
                <span class="primary">{{ statisticInfo.sales_position_commission }}</span>
              </div>
              <div>
                长险已续保单
                <span class="primary">{{ statisticInfo.sales_position_commission }}</span>
              </div>
            </div>
            <div class="item-block">
              <div>
                短险应续保费(元)
                <span class="primary">{{ statisticInfo.actual_underwrite_total_premium }}</span>
              </div>
              <div>
                短险已续保费(元)
                <span class="primary">{{ statisticInfo.actual_underwrite_total_count }}</span>
              </div>
              <div>
                短险应续保单
                <span class="primary">{{ statisticInfo.actual_underwrite_average_premium }}</span>
              </div>
              <div>
                短险已续保单
                <span class="primary">{{ statisticInfo.actual_underwrite_average_premium }}</span>
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
        <el-table-column label="团队" prop="sales_team_name" align="center" width="150px" fixed="left"></el-table-column>
        <el-table-column label="出单人" prop="sales_real_name" align="center" width="150px" fixed="left"></el-table-column>
        <el-table-column label="保险公司" prop="supplier_name" align="center" width="250px"></el-table-column>
        <el-table-column label="产品名称" prop="product_name" align="center" width="250px"></el-table-column>
        <el-table-column label="应续日期" prop="proposal_at_str" width="170px" align="center"></el-table-column>
        <el-table-column label="宽限日期" prop="policy_at_str" width="170px" align="center"></el-table-column>
        <el-table-column label="投保人" prop="policy_holder_basic_info_str" width="180px" align="center"></el-table-column>
        <el-table-column label="被保人" prop="recognizee_basic_info" width="180px" align="center">
          <template slot-scope="{row}">
            <div
                v-for="(item, index) in row.recognizee_basic_info"
                :key="index"
            >{{ item.basic_info }}</div>
          </template>
        </el-table-column>
        <el-table-column label="应收保费" prop="actually_premium" align="center" width="100px"></el-table-column>
        <el-table-column label="续收期间" prop="guarantee_quota_str" align="center"></el-table-column>
        <el-table-column label="缴费期限" prop="payment_period_desc" align="center"></el-table-column>
        <el-table-column label="保单号" prop="policy_sn" align="center" width="200px"></el-table-column>
        <el-table-column label="投保人手机号" prop="order_no" align="center" width="210px"></el-table-column>
        <el-table-column label="续保状态" prop="policy_status_str" align="center"></el-table-column>
        <el-table-column label="续保链接" prop="visit_status_str" align="center">
          <template v-slot="{ row }">
            <text-hidden-ellipsis :popoverTip="'aaa' + row.link" width="248px"></text-hidden-ellipsis>
          </template>
        </el-table-column>
        <el-table-column label="跟踪状态" prop="visit_at_str" width="170px" align="center"></el-table-column>
        <el-table-column label="最近跟踪人员" prop="over_hesitation_at_str" width="170px" align="center"></el-table-column>
        <el-table-column label="最近跟踪记录" prop="is_hesitate_surrender_str" width="170px" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150px" align="center">
          <template slot-scope="{row}">
            <el-link
              type="primary"
              @click="trace(row)"
              class="mr8">跟踪</el-link>
            <el-link
              type="primary"
              @click="copyLink(row)"
              class="mr8">复制链接</el-link>
            <el-link
              type="primary"
              @click="showQrCode(row)"
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
      :data="detailObj"></letter-dialog>
  </div>
</template>
<script>
import {
  getSalesData,
  getSalesTeamData,
  getDateRange,
  exportCompanyPolicy,
} from '@/apis/modules/achievement'
import { getRenewalList } from '@/apis/modules/renewal-order'
import { getAllProducts, getSupplierList } from '@/apis/modules/index'
import { formatDate, dateStr2Timestamp,formatYYMMDD } from '@/utils/formatTime'
import { debounce, downloadFrameA } from '@/utils'
import qs from 'qs'
import FilterShell, { hasValue } from '@/components/filters/filter-shell'
import textHiddenEllipsis from '@/components/text-hidden-ellipsis'
import CommonTabsHeader from '@/components/common-tabs-header'
import QrCodeDialog from './dialog/qrcode-dialog'
import LetterDialog from './dialog/letter-dialog'
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
      detailObj: null,
      loading: false,
      tabIndex: 'all',
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
      companyList: [],
      dateRange: [],
      statisticInfo: {},
      tableLoading: false,
      statisticLoading: false,
      exporting: false,
      tabsData: Object.freeze([
        { label: '全部续保续期', name: 'all' },
        { label: '短险续保', name: 'rank' },
        { label: '长期续保', name: 'statistics' }
      ]),
      searchModel: {
        keyword: '',
        policy_status: [],
        products: [],
        supplier_id: [],
        date_range: [+new Date(), +new Date()],
        sales_id: [],
        sales_team_id: [],
        include_child_team: '0'
      },
      tableMaxHeight: null
    }
  },
  methods: {
    formatYYMMDD,
    showQrCode({ src }) {
      this.qrCodeSrc = src
      this.qrCodeDialogVisible = true
    },
    showSendLetter(obj) {
      this.detailObj = obj
      this.letterDialogVisible = true
    },
    // 跟踪
    trace({ id }, isView) {
      window.open(this.$router.resolve({
        name: isView ? 'RenewalOrderView' : 'RenewalOrderTrace',
        params: { id }
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
    },
    copyLink({ src }) {
      this.$copyText(src).then(() => this.$message.success('链接已复制到粘贴板'))
    },
    policyExport() {
      const url = `${exportCompanyPolicy}?${qs.stringify({
        ...this.searchModelFormat(true),
      })}`
      this.exporting = true
      downloadFrameA(
          url,
          `订单数据-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`,
          'get',
          true
      )
          .then(() => {
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
      if (page * page_size < total) {
        this.tableLoading = true
        this.page += 1
      }
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
    searchModelFormat() {
      const model = { ...this.searchModel }
      Object.keys(model).forEach((key) => {
        const cur = model[key]
        if (key === 'date_range') {
          const [start, end] = model.date_range
          model.proposal_at_start = start ? formatDate(start, 'yyyyMMdd') : ''
          model.proposal_at_end = end ? formatDate(end, 'yyyyMMdd') : ''
        } else if (Array.isArray(cur)) {
          model[key] = model[key].join(',')
        }
      })
      // 没有选择团队删除包含子团队参数
      if (model.sales_team_id.length <= 0) {
        delete model.include_child_team
      }
      delete model.date_range
      return model
    },
    getData() {
      this.tableLoading = true
      getRenewalList(this.searchModelFormat()).then(res => {
        this.total = res.total
        this.list = this.page === 1 ? res.data : this.list.concat(res.data)
      }).finally(() => {
        this.tableLoading = false
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
    getDateRange() {
      getDateRange().then((res) => {
        this.dateRange = res
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
    this.getSalesData()
    this.getDateRange()
    this.getSalesTeamData()
    this.getAllProducts()
    this.getSupplierList()
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
