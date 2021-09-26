<template>
  <div>
    <el-table
          :data="data"
          border
          stripe
          max-height="450px"
          style="width: 100%">
          <el-table-column
            prop="customer_type_str"
            label="客户类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="customer_name"
            label="客户姓名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="customer_certificate_type_str"
            label="客户证件类型"
            width="120px"
            align="center">
          </el-table-column>
          <el-table-column
            prop="customer_certificate_number"
            label="客户证件号码"
            width="160px"
            align="center">
          </el-table-column>
          <el-table-column
            prop="risk_code"
            label="险种编码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="risk_name"
            label="险种名称"
            width="200px"
            align="center">
            <template v-slot="{ row }">
              <div style="text-align: justify">{{row.risk_name}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="underwriting_status_str"
            label="人核状态"
            width="120px"
            align="center">
          </el-table-column>
          <el-table-column
            prop="reason"
            label="原因"
            width="200px"
            align="center">
          </el-table-column>
          <el-table-column
            prop="content"
            label="内容"
            width="200px"
            align="center">
            <template v-slot="{ row }">
              <div style="text-align: justify">{{row.content}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="下发时间"
            width="160px"
            align="center">
            <template slot-scope="scope">
              {{formatDate(scope.row.callback_at * 1000, 'yyyy-MM-dd hh:mm:ss')}}
            </template>
          </el-table-column>
        </el-table>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatTime'
export default {
  name: 'manpower-table',
  props: {
    data: {
      type: Array
    }
  },
  data () {
    return {}
  },
  methods: {
    formatDate,
  },
  created () {

  }
}
</script>

<style>
</style>
