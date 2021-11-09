<template>
  <div class="manpower-container page-container">
    <div class="header">
      <common-tabs-header v-model="tabIndex" :data="tabsData"></common-tabs-header>
      <el-input
        v-model="searchModel.keyword"
        placeholder="搜索投保人或被保人或产品名称"
        size="small"
        class="fw400"
        clearable
        @keyup.enter.native="searchModelChange">
        <i slot="prefix" class="ml4 iconfont iconxiao16_sousuo el-input__icon"></i>
        <el-button slot="append" @click="searchModelChange">搜索</el-button>
      </el-input>
    </div>
    <div class="page-content">
      <div class="sb-container pt16">
        <!--全部销售-->
        <filter-shell
            v-if="tabIndex !== tabsData[0].name"
            v-model="searchModel.sales_id"
            autoFocus
            class="mb16"
            placeholder="全部出单人"
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
          >{{hasValue(searchModel.sales_id) ? '出单人：' +salesList.find(i => i.id === searchModel.sales_id[0]).real_name : '出单人'}}</template>
        </filter-shell>
        <!--全部团队-->
        <filter-shell v-model="searchModel.sales_team_id" autoFocus class="mb16" @input="searchModelChange" v-if="tabIndex !== tabsData[1].name && tabIndex !== tabsData[0].name">
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
          >{{ hasValue(searchModel.sales_team_id) ? '团队：' + salesTeamList.find(i => i.id === searchModel.sales_team_id[0]).name : '团队' }}</template>
        </filter-shell>
        <!--人核状态-->
        <filter-shell v-model="searchModel.status"
                      autoFocus
                      autoClose
                      class="mb16"
                      @input="searchModelChange">
          <el-select class="block"
                     v-model="searchModel.status"
                     clearable
                     filterable
                     placeholder="请选择"
                     @change="searchModelChange">
            <el-option
                v-for="item in manpowerStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{ hasValue(searchModel.status) ? '人核状态：' +manpowerStatus.find(i => i.value === searchModel.status).label : '人核状态' }}
          </template>
        </filter-shell>
        <!--人核进度-->
        <filter-shell
          v-model="searchModel.action"
          autoFocus
          autoClose
          class="mb16"
          :textOverflow="false"
          @input="searchModelChange">
          <el-select
            class="block"
            v-model="searchModel.action"
            clearable
            filterable
            placeholder="请选择"
            @change="searchModelChange">
          <el-option
            v-for="item in manpowerAction"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
          </el-select>
          <template v-slot:label>
            {{ hasValue(searchModel.action) ? '人核进度：' + manpowerAction.find(i => i.value === searchModel.action).label : '人核进度' }}
          </template>
        </filter-shell>
        <!--人核结论-->
        <filter-shell
          v-model="searchModel.result"
          autoFocus
          autoClose
          class="mb16"
          :textOverflow="false"
          @input="searchModelChange">
          <el-select
            class="block"
           v-model="searchModel.result"
           clearable
           filterable
           placeholder="请选择"
           @change="searchModelChange">
            <el-option
              v-for="item in manpowerResult"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <template v-slot:label>
            {{ hasValue(searchModel.result) ? '人核结论：' +manpowerResult.find(i => i.value === searchModel.result).label : '人核结论' }}
          </template>
        </filter-shell>
        <!--申请时间-->
        <filter-shell
          v-model="searchModel.apply_at"
          :width="382"
          autoFocus
          autoClose
          :collapse="false"
          :textOverflow="false"
          class="mb16"
          @input="searchModelChange">
          <el-date-picker
            type="daterange"
            v-model="searchModel.apply_at"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="timestamp"
            @change="searchModelChange"></el-date-picker>
          <template v-slot:label>
            {{ hasValue(searchModel.apply_at) ? `申请时间：${formatDate(searchModel.apply_at[0], 'yyyy-MM-dd')} ~ ${formatDate(searchModel.apply_at[1], 'yyyy-MM-dd')}` : '申请时间' }}
          </template>
        </filter-shell>
        <!--更新时间-->
        <filter-shell
          v-model="searchModel.last_update_time"
          :width="382"
          autoFocus
          autoClose
          :collapse="false"
          :textOverflow="false"
          class="mb16"
          @input="searchModelChange">
          <el-date-picker
            type="daterange"
            v-model="searchModel.last_update_time"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="timestamp"
            @change="searchModelChange"></el-date-picker>
          <template v-slot:label>
            {{ hasValue(searchModel.last_update_time) ? `更新时间：${formatDate(searchModel.last_update_time[0], 'yyyy-MM-dd')} ~ ${formatDate(searchModel.last_update_time[1], 'yyyy-MM-dd')}` : '更新时间' }}
          </template>
        </filter-shell>
      </div>
      <div class="table-head">
        <span
          class="action-block"
          style="display: inline-flex">
          <span class="color-block" :style="{ 'background-color': '#FF4C4C'}"></span>
          <span>审核不通过、拒保</span>
        </span>
        <span
          class="action-block"
          style="display: inline-flex">
          <span class="color-block" :style="{ 'background-color': '#09ba08'}"></span>
          <span>问题下发、照会待回复</span>
        </span>
        <span
          class="action-block"
          style="display: inline-flex">
          <span class="color-block" :style="{ 'background-color': '#4497eb'}"></span>
          <span>审核通过、标准、次标准、次标准除责、通过、加费承保、除外承保、除责下发、限额承保</span>
        </span>
        <span
          class="action-block"
          style="display: inline-flex">
          <span class="color-block" :style="{ 'background-color': '#999'}"></span>
          <span>超时、撤件、无效单</span>
        </span>
      </div>
      <el-table
        :data="list"
        :max-height="tableMaxHeight"
        border
        stripe
        v-table-infinite-scroll="scroll2Bottom"
        v-loading="loading"
        :row-style="rowStyleFormat"
        ref="table">
        <el-table-column label="团队" prop="policy.sales_team_name" align="center" width="250px" v-if="tabIndex !== 'manpower-order-team'"></el-table-column>
        <el-table-column label="出单人" prop="policy.sales_real_name" align="center" v-if="tabIndex !== 'manpower-order-sales'" min-width="120px"></el-table-column>
        <el-table-column label="产品名称" prop="origin_product_name" align="center" width="250px"></el-table-column>
        <el-table-column label="保费" prop="policy.premium" align="center" width="100px"></el-table-column>
        <el-table-column label="保额" prop="policy.guarantee_quota_str" align="center"></el-table-column>
        <el-table-column label="保障期限" prop="policy.guarantee_period_desc" align="center"></el-table-column>
        <el-table-column label="缴费期限" prop="policy.payment_period_desc" align="center"></el-table-column>
        <el-table-column label="投保人" prop="policy_holder_name" width="180px" align="center"></el-table-column>
        <el-table-column label="被保人" prop="recognizee_policy_name" width="180px" align="center"></el-table-column>
        <el-table-column label="人核状态" prop="status_str" align="center" min-width="120px"></el-table-column>
        <el-table-column label="人核进度" prop="action_str" width="180px" align="center" min-width="120px"></el-table-column>
        <el-table-column label="人核结论" prop="result_str" width="180px" align="center" min-width="120px"></el-table-column>
        <el-table-column label="保单状态" min-width="120px" prop="policy.policy_status_str" align="center"></el-table-column>
        <el-table-column label="申请时间" prop="apply_at" width="180px" align="center">
          <template v-slot="{ row }">{{row.apply_at ? formatDate(row.apply_at * 1000, 'yyyy-MM-dd hh:mm:ss') : ''}}</template>
        </el-table-column>
        <el-table-column label="更新时间" prop="last_update_time" width="180px" align="center">
          <template v-slot="{ row }">{{row.last_update_time ? formatDate(row.last_update_time * 1000, 'yyyy-MM-dd hh:mm:ss') : ''}}</template>
        </el-table-column>
        <el-table-column label="过期时间" prop="last_update_time" width="180px" align="center">
          <template v-slot="{ row }">{{row.expire_at ? formatDate(row.expire_at * 1000, 'yyyy-MM-dd hh:mm:ss') : ''}}</template>
        </el-table-column>
        <el-table-column label="关联订单号" prop="policy.order_no" width="220px" align="center"></el-table-column>
        <el-table-column label="关联保单号" prop="policy.policy_sn" width="180px" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="180px" align="center">
          <template v-slot="{ row }">
            <el-link class="mr16" type="primary" @click="toDetail(row.policy.order_no)" v-if="showDetailBtn">详情</el-link>
            <el-link v-if="row.policy.underwrite_url" type="primary" @click="copyManpowerLink(row.policy.underwrite_url)">复制人核链接</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  manpowerListForSales,
  manpowerListForTeam,
  manpowerListForCompany,
  getManpowerOptions,
  getSalesData,
  getSalesTeamData
} from '@/apis/modules/achievement'
import { formatDate } from '@/utils/formatTime'
import { debounce} from '@/utils'
import { policyStatusArray, insuranceTypeArray } from '@/enums/common'
import FilterShell, { hasValue } from '@/components/filters/filter-shell'
import CommonTabsHeader from '@/components/common-tabs-header'
let reqId = 0
const routeMap = {
  'manpower-order-company': {
    apiFunc: manpowerListForCompany, // 接口函数
    relationRouteName: 'achievement-company-detail', // 关联订单路由名称,
    permission: 'manpower-order-company-detail' // 详情权限
  },
  'manpower-order-team': {
    apiFunc: manpowerListForTeam,
    relationRouteName: 'achievement-team-detail', // 关联订单路由名称,
    permission: 'manpower-order-team-detail' // 详情权限
  },
  'manpower-order-sales': {
    apiFunc: manpowerListForSales,
    relationRouteName: 'achievement-self-detail', // 关联订单路由名称,
    permission: 'manpower-order-sales-detail' // 详情权限
  }
}
// 人核订单
export default {
  name: 'manpower-order',
  components: {
    FilterShell,
    CommonTabsHeader
  },
  data() {
    return {
      loading: false,
      list: [],
      tabIndex: '',
      tabsData: Object.freeze([
        { label: '我的人核订单', name: 'manpower-order-sales', permission: 'manpower-order-sales'},
        { label: '团队人核订单', name: 'manpower-order-team', permission: 'manpower-order-team' },
        { label: '公司人核订单', name: 'manpower-order-company', permission: 'manpower-order-company' }
      ]),
      page: 1,
      page_size: 20,
      total: 0,
      policyStatusArray,
      insuranceTypeArray,
      salesList: [],
      salesTeamList: [],
      searchModel: {
        keyword: '',
        apply_at: [],
        last_update_time: [],
        status: '',
        result: '',
        action: '',
        sales_id: '',
        sales_team_id: ''
      },
      manpowerStatus: [],
      manpowerAction: [],
      manpowerResult: [],
      tableMaxHeight: null,
      actionMap: Object.freeze({
        cancel: {label: '审核不通过', color: '#FF4C4C'},
        refuse: {label: '拒保', color: '#FF4C4C'},
        waiting_reply: {label: '问题下发', color: '#09ba08'},
        waiting_counteroffer_reply: {label: '照会待回复', color: '#09ba08'},
        waiting_confirm_except: {label: '除责下发', color: '#4497eb'},
        pass: {label: '审核通过', color: '#4497eb'},
        overtime: {label: '超时', color: '#999999'}
      }),
      resultMap: Object.freeze({
        refuse: {label: '拒保', color: '#FF4C4C'},
        normal: {label: '标准', color: '#4497eb'},
        sub_normal: {label: '次标准', color: '#4497eb'},
        except: {label: '次标准除责', color: '#4497eb'},
        pass: {label: '通过', color: '#4497eb'},
        increases: {label: '加费承保', color: '#4497eb'},
        exclusions: {label: '除外承保', color: '#4497eb'},
        quota: {label: '限额承保', color: '#4497eb'},
        cancel: {label: '撤件', color: '#999999'}
      })
    };
  },
  computed: {
    showDetailBtn() {
      const obj = routeMap[this.tabIndex]
      return obj ? this.$checkAuth(obj.permission) : false
    },
    actionGroup() {
      const { actionMap, resultMap } = this
      const res = {}
      Object.keys(actionMap).forEach(key => {
        const cur = actionMap[key]
        const color = cur.color
        if (res[color]) {
          res[color].push(cur)
        } else {
          res[color] = [cur]
        }
      })
      Object.keys(resultMap).forEach(key => {
        if (key !== 'refuse') { // 结论拒保跟进度拒保重复, 跳过
          const cur = resultMap[key]
          const color = cur.color
          if (res[color]) {
            res[color].push(cur)
          } else {
            res[color] = [cur]
          }
        }
      })
      return res
    }
  },
  methods: {
    formatDate,
    rowStyleFormat({ row }) {
      const status = row.policy.policy_status
      if (status === 'accepted_insure' || status === 'accepted_insure' || status === 'terminated' || status === 'surrendered') return {}
      if (status === 'invalid') return { color: '#999' }
      return { color: (this.actionMap[row.action] || this.resultMap[row.result] || {}).color }
    },
    getData() {
      this.loading = true
      const id = ++reqId
      routeMap[this.tabIndex].apiFunc(this.searchModelFormat()).then(res => {
        if (id === reqId) {
          this.list = this.page === 1 ? res.data : this.list.concat(res.data)
          this.total = res.total
        }
      }).finally(() => {
        if (id === reqId) {
          this.loading = false
        }
      })
    },
    // 跳转到关联订单详情
    toOrderDetail(id) {
      window.open(this.$router.resolve({
        name: routeMap[this.$route.name].relationRouteName,
        params: { id }
      }).href)
    },
    copyManpowerLink(url) {
      this.$copyText(url).then(() => this.$message.success('人核链接已复制到粘贴板')).catch(e => this.$message.error(e))
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
    toDetail(id) {
      window.open(this.$router.resolve({
        name: `${this.tabIndex}-detail`,
        params: { id }
      }).href)
    },
    scroll2Bottom() {
      const {page, page_size, total} = this
      if (page * page_size < total) {
        this.loading = true
        this.page += 1
        this.getData()
      }
    },
    searchModelChange: debounce(function() {
      this.page = 1
      this.total = 0
      // 重置滚动条
      this.$refs.table.$el.querySelector('.el-table__body-wrapper').scrollTo(0, 0)
      this.getData()
    }, 300),
    hasValue,
    searchModelFormat() {
      const model = { ...this.searchModel }
      Object.keys(model).forEach(key => {
        const cur = model[key]
        if (key === 'apply_at' || key === 'last_update_time') {
          const [start, end] = cur
          const endDate = new Date(end)
          endDate.setHours(23)
          endDate.setMinutes(59)
          endDate.setSeconds(59)
          model[key + '_start'] = start ? parseInt(start / 1000) : ''
          model[key + '_end'] = end ? parseInt(endDate.getTime() / 1000) : ''
        }
      })
      delete model.apply_at
      delete model.last_update_time
      return model
    },
    calcTableHeight: debounce(function() {
      const bodyHeight = document.body.clientHeight
      const { top } = this.$refs.table.$el.getBoundingClientRect()
      this.tableMaxHeight = bodyHeight - top - 10
    }, 300)
  },
  watch: {
    tabIndex(v) {
      if (v) {
        this.page = 1
        this.total = 0
        this.searchModel = {
          keyword: '',
          apply_at: [],
          last_update_time: [],
          status: '',
          result: '',
          action: '',
          sales_id: '',
          sales_team_id: ''
        }
        this.list = []
        this.getData()
        const { salesList, salesTeamList, tabIndex, tabsData } = this
        if (!salesList.length && tabIndex !== tabsData[0].name) {
          this.getSalesData()
        }
        if (!salesTeamList.length && tabIndex !== tabsData[0].name && tabIndex !== tabsData[1].name) {
          this.getSalesTeamData()
        }
      }
    }
  },
  created() {
    // 人核选项数据
    getManpowerOptions().then(res => {
      this.manpowerAction = res.action
      this.manpowerStatus = res.status
      this.manpowerResult = res.result
    })
  },
  mounted() {
    this.$nextTick(() => this.calcTableHeight())
    window.addEventListener('resize', this.calcTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calcTableHeight)
  }
};
</script>
<style lang="scss" scoped>
.manpower-container {
  display: flex;
  flex-direction: column;
  ::v-deep .el-input-group__append {
    background-color: #1F78FF;
    border-color: #1F78FF;
    .el-button {
      color: #fff;
    }
  }
  & >.header {
    font-size: 16px;
    font-weight: bold;
    padding: 0 16px;
    height: 56px;
    background: #F5F5F5;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #E6E6E6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-input {
      width: 360px;
    }
  }
  & > .page-content {
    background-color: #fff;
    flex: 1;
    padding: 0 16px;
    overflow: hidden;
    ::v-deep .relation-order-btn {
      display: inline-block;
      width: 180px;
      & > span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .table-head {
      height: 45px;
      display: flex;
      align-items: center;
      background-color: #F5F5F5;
      padding: 0 16px;
      border: 1px solid #E6E6E6;
      border-bottom: transparent;
      .action-block {
        display: inline-flex;
        align-items: center;
        margin-right: 20px;
        & > .color-block {
          display: block;
          width: 12px;
          height: 12px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
