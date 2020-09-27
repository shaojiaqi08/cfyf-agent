<template>
  <!-- <el-scrollbar class="scrollbar" style="height: 94vh;"> -->
    <div class="company-info-card">
      <div class="company-info-header">
        <span>团队成员</span>
      </div>
      <el-scrollbar class="scrollbar company-info-body" style="height: 94vh;">
        <div class="block-header">
          <div class="main-title">
            {{ detailInfo.name }}
          </div>
          <div class="sub-title" v-if="detailInfo.parent_id">
            当前上级团队：{{ detailInfo.parent.name }}
          </div>
        </div>
        <div class="table-header">
          在职团队主管人数：{{ detailInfo.leader_count }} 人
        </div>
        <div class="ml16 mr16 mb16">
          <el-table :data="detailInfo.leader" border v-loading="loading">
            <el-table-column label="姓名" prop="real_name" width="162px" align="center"></el-table-column>
            <el-table-column label="账号" prop="username" width="162px" align="center"></el-table-column>
            <el-table-column label="手机号" prop="mobile" width="162px" align="center"></el-table-column>
            <el-table-column label="职位" prop="position_name" width="162px" align="center"></el-table-column>
            <el-table-column label="新增时间" prop="resignation_at_str" width="162px" align="center"></el-table-column>
            <el-table-column label="状态" prop="account_status_str" width="180px" align="center">
              <template slot-scope="{row}">
                <el-tag :type="tagType(row.account_status)">{{ row.account_status_str }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="注销时间" prop="close_at" align="center">
              <template slot-scope="{row}">
                {{ row.close_at ? formatDate(row.close_at * 1000, 'yyyy-MM-dd') : '-' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-header">
          在职团队成员人数：{{ detailInfo.member_count }} 人
        </div>
        <div class="ml16 mr16 mb16">
          <el-table :data="detailInfo.member" border v-loading="loading">
            <el-table-column label="姓名" prop="real_name" width="162px" align="center"></el-table-column>
            <el-table-column label="账号" prop="username" width="162px" align="center"></el-table-column>
            <el-table-column label="手机号" prop="mobile" width="162px" align="center"></el-table-column>
            <el-table-column label="职位" prop="position_name" width="162px" align="center"></el-table-column>
            <el-table-column label="新增时间" prop="resignation_at_str" width="162px" align="center"></el-table-column>
            <el-table-column label="状态" prop="account_status_str" width="180px" align="center">
              <template slot-scope="{row}">
                <el-tag :type="tagType(row.account_status)">{{ row.account_status_str }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="注销时间" prop="close_at" align="center">
              <template slot-scope="{row}">
                {{ row.close_at ? formatDate(row.close_at * 1000, 'yyyy-MM-dd') : '-' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-for="(item, index) in detailInfo.child_teams"
             :key="index">
          <div class="block-header mb16">
            <div class="main-title">
              {{ item.name }}
              <el-tag type="info">子团队</el-tag>
            </div>
          </div>
          <div class="ml16 mr16 mb16">
            <el-table :data="item.member" border v-loading="loading">
              <el-table-column label="姓名" prop="real_name" width="162px" align="center"></el-table-column>
              <el-table-column label="账号" prop="username" width="162px" align="center"></el-table-column>
              <el-table-column label="手机号" prop="mobile" width="162px" align="center"></el-table-column>
              <el-table-column label="职位" prop="position_name" width="162px" align="center"></el-table-column>
              <el-table-column label="新增时间" prop="resignation_at_str" width="162px" align="center"></el-table-column>
              <el-table-column label="状态" prop="account_status_str" width="180px" align="center">
                <template slot-scope="{row}">
                  <el-tag :type="tagType(row.account_status)">{{ row.account_status_str }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="注销时间" prop="close_at" align="center">
                <template slot-scope="{row}">
                  {{ row.close_at ? formatDate(row.close_at * 1000, 'yyyy-MM-dd') : '-' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-scrollbar>
    </div>
  <!-- </el-scrollbar> -->
</template>

<script>
import { getGroupInfo } from '@/apis/modules/company'
import { formatDate } from '@/utils/formatTime'
import { accountStatusMap } from '@/enums/user-manage'
export default {
  data() {
    return {
      visible: false,
      detailInfo: {},
      accountStatusMap,
      loading: false
    }
  },
  methods: {
    tagType(type) {
      switch (type) {
        case accountStatusMap.enable.value:
          return 'success'
        case accountStatusMap.disable.value:
          return 'danger'
        case accountStatusMap.cancel.value:
          return 'info'
        default:
          return 'info'
      }
    },
    formatDate,
    edit() {
      this.visible = true
    },
    getGroupInfo() {
      this.loading = true
      getGroupInfo().then(res => {
        this.detailInfo = res
      }).finally(() => this.loading = false)
    }
  },
  mounted() {
    this.getGroupInfo()
  }
}
</script>

<style lang="scss" scoped>
.company-info-card {
  margin: 0 auto 16px;
  width: 1200px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #E6E6E6;
  .company-info-header {
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    background-color: #F5F5F5;
    height: 56px;
    line-height: 56px;
    color: #1A1A1A;
    font-size: 16px;
    font-weight: 500;
    .tips {
      color: #999;
      font-size: 14px;
    }
  }
  .company-info-body {
    padding: 16px 0;
    padding-bottom: 60px;
    // color: #999;
    .block-header {
      margin: 0 16px 16px;
      padding: 16px;
      background-color: #F5F5F5;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      .main-title {
        color: #1A1A1A;
        font-size: 18px;
        font-weight: 500;
      }
      .sub-title {
        margin-top: 8px;
        color: #999999;
      }
    }
    .table-header {
      margin: 0 16px;
      padding: 20px;
      color: #1A1A1A;
      font-weight: 500;
      border-radius: 4px 4px 0 0;
      border: 1px solid #E6E6E6;
      border-bottom: 0;
      background-color: #F5F5F5;
    }
  }
}
</style>
