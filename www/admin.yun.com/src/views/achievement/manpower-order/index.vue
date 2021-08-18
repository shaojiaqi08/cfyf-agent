<template>
  <div class="manpower-container page-container">
    <div class="header">
      {{$route.meta.title}}
      <el-input
        v-model="searchModel.keyword"
        placeholder="搜索投保人或被保人或产品名称"
        size="small"
        class="fw400"
        clearable
        @input="searchModelChange">
        <i slot="prefix" class="ml4 iconfont iconxiao16_sousuo el-input__icon"></i>
      </el-input>
    </div>
    <div class="page-content">
      <div class="sb-container pt16">
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
      <el-table
        :data="list"
        :max-height="tableMaxHeight"
        border
        stripe
        v-table-infinite-scroll="scroll2Bottom"
        v-loading="loading"
        ref="table">
        <el-table-column label="出单人" prop="policy.sales_real_name" align="center" v-if="$route.name !== 'manpower-order-sales'" min-width="120px"></el-table-column>
        <el-table-column label="产品名称" prop="origin_product_name" align="center" width="250px"></el-table-column>
        <el-table-column label="投保人" prop="policy_holder_name" width="180px" align="center"></el-table-column>
        <el-table-column label="被保人" prop="recognizee_policy_name" width="180px" align="center"></el-table-column>
        <el-table-column label="人核状态" prop="status_str" align="center" min-width="120px"></el-table-column>
        <el-table-column label="人核进度" prop="action_str" width="180px" align="center" min-width="120px"></el-table-column>
        <el-table-column label="人核结论" prop="result_str" width="180px" align="center" min-width="120px"></el-table-column>
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
        <el-table-column label="保单状态" min-width="120px" prop="policy.policy_status_str" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="120px" align="center" v-if="showDetailBtn">
          <template v-slot="{ row }">
            <el-link type="primary" @click="toDetail(row.policy.order_no)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { manpowerListForSales, manpowerListForTeam, manpowerListForCompany, getManpowerOptions } from '@/apis/modules/achievement'
import { formatDate } from '@/utils/formatTime'
import { debounce} from '@/utils'
import { policyStatusArray, insuranceTypeArray,manualReview } from '@/enums/common'
import { visitStatus, visitStatusArray } from '@/enums/achievement'
import FilterShell, { hasValue } from '@/components/filters/filter-shell'
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
  },
  data() {
    return {
      loading: false,
      list: [],
      page: 1,
      page_size: 20,
      total: 0,
      policyStatusArray,
      insuranceTypeArray,
      visitStatus,
      visitStatusArray,manualReview,
      productList: [],
      supplierList: [],
      companyList: [],
      salesList: [],
      searchModel: {
        keyword: '',
        apply_at: [],
        last_update_time: [],
        status: '',
        result: '',
        action: ''
      },
      manpowerStatus: [],
      manpowerAction: [],
      manpowerResult: [],
      tableMaxHeight: null
    };
  },
  computed: {
    showDetailBtn() {
      return this.$checkAuth(routeMap[this.$route.name].permission)
    }
  },
  methods: {
    formatDate,
    getData() {},
    // 跳转到关联订单详情
    toOrderDetail(id) {
      window.open(this.$router.resolve({
        name: routeMap[this.$route.name].relationRouteName,
        params: { id }
      }).href)
    },
    toDetail(id) {
      window.open(this.$router.resolve({
        name: `${this.$route.name}-detail`,
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
  created() {
    this.getData = () => {
      this.loading = true
      const id = ++reqId
      routeMap[this.$route.name].apiFunc(this.searchModelFormat()).then(res => {
        if (id === reqId) {
          this.list = this.page === 1 ? res.data : this.list.concat(res.data)
          this.total = res.total
        }
      }).finally(() => {
        if (id === reqId) {
          this.loading = false
        }
      })
    }
    this.getData()
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
  }
}
</style>
