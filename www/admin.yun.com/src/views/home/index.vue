<template>
  <div class="home-page">
    <div class="page-container">
      <div class="banner" v-if="bannerList">
        <el-carousel arrow="hover" trigger="click">
          <el-carousel-item v-for="item in bannerList" :key="item.banner_no">
            <img :src="item.banner_pic_url" :alt="item.title" class="banner-img" @click="bannerHandle(item)">
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="announcement-sector">
        <template v-for="item in filterAnnouncementList">
          <div class="sector" v-loading="item.loading" :key="item.key" v-if="item.data.length" :style="{width: (100 / filterAnnouncementList.length <= 50 ? 100 / filterAnnouncementList.length - 1 : 100 / filterAnnouncementList.length) + '%'}">
            <div class="common-sector-header">
              <span class="title"><span class="title-text">{{ item.title }}</span></span>
              <span class="more" @click="toMore(item.key)">
              更多
              <i class="el-icon-arrow-right"></i>
            </span>
            </div>
            <div class="sector-content">
              <div class="sector-row" v-for="post in item.data" :key="post.announcement_no" @click="toDetail(post.announcement_no)">
                <div class="row-header">
                  <div class="row-title">{{post.title}}</div>
                  <div class="row-date">{{formatYYMMDD(post.put_up_at * 1000, '-')}}</div>
                </div>
                <div class="row-desc">{{post.desc || post.content}}</div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="performance-count" v-if="hasStatisticsAuth" v-loading="performanceLoading">
        <div class="common-sector-header">
          <div class="header-left-wrap">
            <span class="title"><span class="title-text">业绩统计</span></span>
            <div class="performance-tabs">
              <el-tabs v-model="activePerformanceName" @tab-click="performanceChange">
                <el-tab-pane :label="item.name + '业绩'" :name="item.start + ',' + item.end" v-for="item in dateRange" :key="item.name"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div>
            <span style="color: #999999; font-size: 14px; margin-right: 15px">查看范围</span>
            <el-radio-group v-model="viewRange" @change="viewRangeChange">
              <template v-for="item in viewRangeMap">
                <el-radio :label="item.value" v-if="item.show" :key="item.value">{{item.label}}</el-radio>
              </template>
            </el-radio-group>
          </div>
        </div>

        <div class="performance-main">
          <div class="common-main">
            <div class="main-wrap">
              <div class="main-title">新增保单（个）</div>
              <div class="main-count">{{ performanceStatistics.actual_underwrite_total_count }}</div>
            </div>
          </div>
          <div class="common-main">
            <div class="main-wrap">
              <div class="main-title">投保客户（个）</div>
              <div class="main-count">{{ performanceStatistics.cumulative_customer }}</div>
            </div>
          </div>
          <div class="common-main">
            <div class="main-wrap">
              <div class="main-title">累计保费（元）</div>
              <div class="main-count">{{ performanceStatistics.actual_underwrite_total_premium }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="sales-top"  v-if="hasStatisticsAuth" v-loading="salesTopLoading">
        <div class="common-sector-header">
          <div class="header-left-wrap">
            <span class="title"><span class="title-text">商品销量TOP5</span></span>
          </div>
          <div>
            <span style="color: #999999; font-size: 14px; margin-right: 15px">筛选</span>
            <div class="date-range">
              <el-date-picker
                @change="salesTopDateChange"
                style="width: 262px"
                size="mini"
                v-model="topSalesDate"
                type="daterange"
                value-format="yyyyMMdd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
        </div>

        <div class="sales-main">
          <el-table :data="topSalesList"
                    height="100%"
                    border
                    stripe
                    ref="table">
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="产品名称" prop="product_name" align="center"></el-table-column>
            <el-table-column label="销量（个）" prop="underwrite_quantity" align="center"></el-table-column>
            <el-table-column label="总保费（元）" prop="underwrite_premium" align="center"></el-table-column>
          </el-table>
        </div>
      </div>

      <div class="insurance-type" v-if="hasStatisticsAuth" v-loading="insuranceClassLoading">
        <div class="common-sector-header">
          <div class="header-left-wrap">
            <span class="title"><span class="title-text">险种分析销售</span></span>
          </div>
          <div>
            <span style="color: #999999; font-size: 14px; margin-right: 15px">筛选</span>
            <div class="date-range">
              <el-date-picker
                style="width: 262px"
                size="mini"
                v-model="insuranceTypeDate"
                @change="insuranceTypeDateChange"
                type="daterange"
                value-format="yyyyMMdd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
        </div>

        <div class="insurance-type-main">
          <div class="pieChart" id="pieChart" ref="pieChart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Chart} from '@antv/g2';
  import {getPerformance, getSalesTop, getInsuranceClass, getBannerList, logBannerClick, getAnnouncementList, getRegulateList, logPlateClick, getNewLinesList} from '@/apis/modules/home'
  import { getDateRange } from '@/apis/modules/achievement'
  import {formatYYMMDD} from '@/utils/formatTime'
  import {
    mapState,
    mapActions
  } from 'vuex'
export default {
  name: "Home",
  data(){
    let now = new Date()
    let year = now.getFullYear()
    let month = +now.getMonth() + 1 >= 10 ? +now.getMonth() + 1 : '0' + (+now.getMonth() + 1).toString()
    let day = now.getDate() >= 10 ? now.getDate().toString() : '0' + now.getDate()
    let today = `${year}${month}${day},${year}${month}${day}`
    return {
      bannerList: [],
      announcementList: [
        {
          title: '新品上线',
          key: 'new-lines',
          loading: false,
          data: []
        },
        {
          title: '商品调整',
          key: 'regulate',
          loading: false,
          data: []
        },
        {
          title: '平台公告',
          key: 'announcement',
          loading: false,
          data: []
        }
      ],
      viewRange: '',
      viewRangeMap: [
        {label: '公司', value: 'company', show: this.$checkAuth('/statistics_manage/company_statistics_list')},
        {label: '团队', value: 'team', show: this.$checkAuth('/statistics_manage/team_statistics_list')},
        {label: '个人', value: 'self', show: this.$checkAuth('/statistics_manage/self_statistics_list')},
      ],
      activePerformanceName: today,
      performanceStatistics: {},
      topSalesDate: [],
      insuranceTypeDate: [],
      topSalesList: [],
      insuranceClassList: [],
      pieChart: null,
      performanceLoading: false,
      salesTopLoading: false,
      insuranceClassLoading: false,
      dateRange: [],
      regulateLoading: false,
      announcementLoading: false,
      newLinesLoading: false,
    }
  },
  methods: {
    ...mapActions({updateDots: 'dotManage/updateDots'}),
    formatYYMMDD,
    getRegulateList(){
      let regulate = this.announcementList.find(item => item.key.includes('regulate'))
      regulate.loading = true
      getRegulateList({page: 1, page_size: 3, read_type: ''}).then(res => {
        res.list ? regulate.data = res.list.data : ''
        this.updateDots({...this.dots, regulate_quantity: res.un_read_count})
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        regulate.loading = false
      })
    },
    getNewLinesList(){
      let newLines = this.announcementList.find(item => item.key.includes('new-lines'))
      newLines.loading = true
      getNewLinesList({page: 1, page_size: 3, read_type: ''}).then(res => {
        res.list ? newLines.data = res.list.data : ''
        this.updateDots({...this.dots, new_lines_quantity: res.un_read_count})
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        newLines.loading = false
      })
    },
    getAnnouncementList(){
      let announcement = this.announcementList.find(item => item.key.includes('announcement'))
      announcement.loading = true
      getAnnouncementList({page: 1, page_size: 3, read_type: ''}).then(res => {
        res.list ? announcement.data = res.list.data : ''
        this.updateDots({...this.dots, announcement_quantity: res.un_read_count})
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        announcement.loading = false
      })
    },
    bannerHandle(banner){
      if(banner.file_url || banner.target_url) {
        logBannerClick({banner_no: banner.banner_no})
        let url = banner.file_url || banner.target_url
        window.open(url, '_blank')
      }
    },
    getBannerList(){
      getBannerList().then(res => {
        this.bannerList = res
      })
    },
    viewRangeChange(){
      this.init()
    },
    insuranceTypeDateChange(){
      this.getInsuranceClassList()
    },
    salesTopDateChange(){
      this.getSalesTopList()
    },
    performanceChange(){
      this.getPerformanceList()
    },
    getDateRange(){
      getDateRange().then(res => {
        this.dateRange = res.filter(item => item.name !== '上周' && item.name !== '上月')
      })
    },
    init(){
      if(this.hasStatisticsAuth){
        this.getPerformanceList()
        this.getSalesTopList()
        this.getInsuranceClassList()
      }
    },
    getInsuranceClassList(){
      this.insuranceClassLoading = true
      let data = this.insuranceTypeDate && this.insuranceTypeDate.length > 0 ? {proposal_at_start: this.insuranceTypeDate[0], proposal_at_end: this.insuranceTypeDate[1]} : {}
      getInsuranceClass(this.viewRange,data).then(res => {
        console.log(res)
        this.insuranceClassList = res
        this.$nextTick(() => {
          if(this.pieChart){
            this.pieChart.destroy()
          }
          this.renderChart()
        })
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.insuranceClassLoading = false
      })
    },
    getSalesTopList(){
      this.salesTopLoading = true
      let data = this.topSalesDate && this.topSalesDate.length > 0 ? {proposal_at_start: this.topSalesDate[0], proposal_at_end: this.topSalesDate[1]} : {}
      getSalesTop(this.viewRange, data).then(res => {
        this.topSalesList = res
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.salesTopLoading = false
      })
    },
    getPerformanceList(){
      this.performanceLoading = true
      let date = this.activePerformanceName.split(',')
      let params = {
        proposal_at_start: date[0],
        proposal_at_end: date[1]
      }
      getPerformance(this.viewRange, params).then(res => {
        this.performanceStatistics = res
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.performanceLoading = false
      })
    },
    toMore(type){
      this.$router.push({
        path: '/announcement',
        query: {
          tab: type
        }
      })
    },
    toDetail(id){
      logPlateClick({announcement_no: id})
      let url = this.$router.resolve({
        path: '/announcement-detail',
        query: {
          id
        }
      })

      window.open(url.href, '_blank')
    },
    renderChart(){
      const data = this.insuranceClassList.map(item => {
        return {
          ...item,
          item: item.insurance_class_name,
          percent: item.underwrite_premium_rate
        }
      })

      this.pieChart = new Chart({
        container: 'pieChart',
        // container: this.$refs.pieChart,
        autoFit: true,
        width: 630,
        height: 300
      });

      this.pieChart.coordinate('theta', {
        radius: 0.75,
      });

      this.pieChart.data(data);

      this.pieChart.scale('underwrite_premium_rate', {
        formatter: (val) => {
          val = val + '%';
          return val;
        },
      });

      this.pieChart.tooltip({
        showTitle: false,
        showMarkers: false,
        customContent: (name, items) => {
          const container = document.createElement('div');
          container.className = 'g2-tooltip';
          let listItem = '';
          items.forEach((item) => {
            listItem += `<li class="g2-tooltip-list-item" data-index={index}>
                  <div style="margin-bottom: 10px;">
                    <span >比例:</span><span>${item.data.underwrite_premium_rate}%</span>
                  </div>
                  <div style="margin-bottom: 10px;">
                    <span >保单数:</span><span>${item.data.underwrite_quantity}</span>
                  </div>
                  <div style="margin-bottom: 10px;">
                    <span >投保客户数:</span><span>${item.data.customer_total}</span>
                  </div>
                  <div style="margin-bottom: 10px;">
                    <span>保费:</span><span>${item.data.underwrite_premium}</span>
                  </div>
            </li>`;
          });
          container.innerHTML = listItem;
          return container;
        }
      });

      this.pieChart
        .interval()
        .adjust('stack')
        .position('underwrite_premium_rate')
        .color('item', ['#2C68FF', '#FF8601', '#FF8601', '#00CBCB', '#71EFE3', '#08DAAA', '#FCEE51', '#1431CA'])
        .tooltip( 'underwrite_premium_rate');
      // let legendData = data.map(item => {
      //   return {
      //     name: item.insurance_class_name + ' : ' + item.underwrite_premium_rate + '%'
      //   }
      // })
      this.pieChart.legend({
        position: 'right',
        itemValue: {
          formatter: (text, item, idx) => {
            return `: ${data[idx].percent}%`
          }
        }
        // items: legendData
      })
      this.pieChart.interaction('element-active');
      this.pieChart.render();
    }
  },
  created () {
    let filterViewRange = this.viewRangeMap.filter(item => item.show)
    this.viewRange = filterViewRange && filterViewRange.length ? filterViewRange[0].value : ''
    this.getDateRange()
    this.init()
    this.getBannerList()
    this.getNewLinesList()
    this.getAnnouncementList()
    this.getRegulateList()
  },
  computed: {
    ...mapState('dotManage', ['dots']),
    filterAnnouncementList(){
      return this.announcementList.filter(item => item.data.length > 0)
    },
    checkCompany(){
      return this.$checkAuth('/statistics_manage/company_statistics_list')
    },
    checkTeam(){
      return this.$checkAuth('/statistics_manage/team_statistics_list')
    },
    checkSelf(){
      return this.$checkAuth('/statistics_manage/self_statistics_list')
    },
    hasStatisticsAuth(){
      return this.checkCompany || this.checkTeam || this.checkSelf
    }
  },
};
</script>

<style lang="scss" scoped>
.home-page{
  padding: 0 20px;
  height: 100%;

  .page-container{
    background: #f5f5f5;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 20px;

    .common-sector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #E6E6E6;

      .date-range{
        display: inline-block;

        /deep/ .el-date-editor .el-range-separator{
          width: 8% !important;
        }
      }

      /deep/ .el-tabs__header{
        margin: 0 !important;
      }

      /deep/ .el-tabs {
        .el-tabs__item{
          height: 32px !important;
        }
      }

      .header-left-wrap{
        display: flex;
        align-items: center;
      }

      .title {
        font-size: 16px;
        color: #1A1A1A;
        margin-right: 50px;

        .title-text{
          display: inline-block;
          vertical-align: middle;
          margin-left: 8px;
          font-weight: bold;
        }

        &:before{
          display: inline-block;
          content: '';
          height: 16px;
          width: 3px;
          background: #1F78FF;
          vertical-align: middle;
        }
      }

      .more {
        font-size: 14px;
        font-weight: 400;
        color: #1A1A1A;
        cursor: pointer;
      }
    }

    .banner{
      width: 100%;
      padding-top: 20px;
      margin-bottom: 16px;

      .banner-img{
        width: 100%;
        object-fit: cover;
      }
    }

    .announcement-sector{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .sector {
        //width: 32.5%;
        background: #FFFFFF;
        border-radius: 5px;

        .sector-content {
          padding: 8px;
          height: 196px;

          .sector-row {
            cursor: pointer;
            padding: 8px;
            transition: all .4s;

            &:hover{
              background: #F3F8FF;

              .row-date,
              .row-title,
              .row-desc{
                color: #1F78FF !important;
              }
            }
            .row-header {
              transition: all .4s;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 5px;
              transition: all .4s;

              .row-title {
                transition: all .4s;
                flex: 1;
                font-size: 14px;
                font-weight: bold;
                color: #1A1A1A;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }

              .row-date {
                margin-left: 10px;
                font-size: 12px;
                font-weight: 400;
                color: #1A1A1A;
              }
            }

            .row-desc {
              transition: all .4s;
              font-size: 12px;
              font-weight: 400;
              color: #999999;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }

    .performance-count{
      background: #fff;
      margin-bottom: 15px;

      .performance-main{
        display: flex;
        justify-content: space-between;
        align-items: center;

        .common-main{
          padding: 20px 0;
          width: calc(100% / 3);

          &:last-child{
            .main-wrap{
              border-right: none;
            }
          }

          .main-wrap{
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-right: 1px solid #e6e6e6;

            .main-title{
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              margin-bottom: 8px;
            }

            .main-count{
              font-size: 32px;
              font-weight: bold;
              color: #1A1A1A;
            }
          }
        }
      }
    }

    .sales-top{
      background: #fff;
      width: calc(50% - 8px);
      display: inline-block;

      .sales-main{
        box-sizing: border-box;
        height: 332px;
        padding: 16px;
      }
    }

    .insurance-type{
      float: right;
      background: #fff;
      width: calc(50% - 8px);
      display: inline-block;

      .insurance-type-main{
        box-sizing: border-box;
        height: 332px;
        padding: 16px;
      }
    }
  }
}
</style>
