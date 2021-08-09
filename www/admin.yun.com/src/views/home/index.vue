<template>
  <div class="home-page">
    <div class="page-container">
      <div class="banner">
        <el-carousel arrow="hover" trigger="click">
          <el-carousel-item v-for="item in imgList" :key="item">
            <img :src="item" alt="" class="banner-img">
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="announcement-sector">
        <div class="sector" v-for="item in announcementList" :key="item.key">
          <div class="common-sector-header">
            <span class="title"><span class="title-text">{{ item.title }}</span></span>
            <span class="more" @click="toMore(item.key)">
              更多
              <i class="el-icon-arrow-right"></i>
            </span>
          </div>
          <div class="sector-content">
            <div class="sector-row" v-for="post in item.data" :key="post.title" @click="toDetail(43)">
              <div class="row-header">
                <div class="row-title">{{post.title}}</div>
                <div class="row-date">{{post.date}}</div>
              </div>
              <div class="row-desc">{{post.desc}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="performance-count">
        <div class="common-sector-header">
          <div class="header-left-wrap">
            <span class="title"><span class="title-text">业绩统计</span></span>
            <div class="performance-tabs">
              <el-tabs v-model="activePerformanceName">
                <el-tab-pane label="用户管理" name="first"></el-tab-pane>
                <el-tab-pane label="配置管理" name="second"></el-tab-pane>
                <el-tab-pane label="角色管理" name="third"></el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div>
            <span style="color: #999999; font-size: 14px; margin-right: 15px">查看范围</span>
            <el-radio-group v-model="viewRange">
              <el-radio label="company">公司</el-radio>
              <el-radio label="team">团队</el-radio>
              <el-radio label="person">个人</el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="performance-main">
          <div class="common-main" v-for="item in performanceStatistics" :key="item.label">
            <div class="main-wrap">
              <div class="main-title">{{ item.label }}</div>
              <div class="main-count">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="sales-top">
        <div class="common-sector-header">
          <div class="header-left-wrap">
            <span class="title"><span class="title-text">商品销量TOP5</span></span>
          </div>
          <div>
            <span style="color: #999999; font-size: 14px; margin-right: 15px">筛选</span>
            <div class="date-range">
              <el-date-picker
                style="width: 262px"
                size="mini"
                v-model="topSalesDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
        </div>

        <div class="sales-main">
          <el-table :data="topSalesList"
                    max-height="100%"
                    border
                    stripe
                    v-loading="salesTableLoading"
                    ref="table">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="产品名称" prop=""></el-table-column>
            <el-table-column label="销量（个）" prop=""></el-table-column>
            <el-table-column label="总保费（元）" prop=""></el-table-column>
          </el-table>
        </div>
      </div>

      <div class="insurance-type">
        <div class="common-sector-header">
          <div class="header-left-wrap">
            <span class="title"><span class="title-text">商品销量TOP5</span></span>
          </div>
          <div>
            <span style="color: #999999; font-size: 14px; margin-right: 15px">筛选</span>
            <div class="date-range">
              <el-date-picker
                style="width: 262px"
                size="mini"
                v-model="topSalesDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
        </div>

        <div class="insurance-type-main">
          <div class="pieChart" id="pieChart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Chart} from '@antv/g2';
  import DataSet from '@antv/data-set'
export default {
  name: "Home",
  data(){
    return {
      imgList: [
        'https://hbimg.huabanimg.com/9b7670df2b854924c8f527d15449edde57719f4a3e5fb-ohj3Qk_fw658/format/webp',
        'https://hbimg.huabanimg.com/c2c34bd77d79fc39f2e3f63b1d4689533e65e395137d6-TTHWQb_fw658/format/webp',
        'https://hbimg.huabanimg.com/59e21a6330c0d2c4119e22b040bd549a47a61a00eba6-amBScH_fw658/format/webp'
      ],
      announcementList: [
        {
          title: '新品上线',
          key: 'new-lines',
          data: [
            {
              title: '新少儿平安4.0上线通知11111',
              date: '2021-01-01',
              desc: '新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解'
            },
            {
              title: '新少儿平安4.0上线通知2222222222222222',
              date: '2021-01-01',
              desc: '新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解'
            },
            {
              title: '新少儿平安4.0上线通知3333',
              date: '2021-01-01',
              desc: '新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解'
            }
          ]
        },
        {
          title: '商品调整',
          key: 'regulate',
          data: [
            {
              title: '新少儿平安4.0上线通知11111',
              date: '2021-01-01',
              desc: '新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解'
            },
            {
              title: '新少儿平安4.0上线通知2222222222222222',
              date: '2021-01-01',
              desc: '新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解'
            },
            {
              title: '新少儿平安4.0上线通知3333',
              date: '2021-01-01',
              desc: '新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解'
            }
          ]
        },
        {
          title: '平台公告',
          key: 'announcement',
          data: [
            {
              title: '新少儿平安4.0上线通知11111',
              date: '2021-01-01',
              desc: '新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解'
            },
            {
              title: '新少儿平安4.0上线通知2222222222222222',
              date: '2021-01-01',
              desc: '新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解'
            },
            {
              title: '新少儿平安4.0上线通知3333',
              date: '2021-01-01',
              desc: '新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解新少儿平安4.0上线通知，各位商家可立即了解'
            }
          ]
        }
      ],
      viewRange: 'company',
      activePerformanceName: 'first',
      performanceStatistics: [
        {
          label: '新增保单（个）',
          count: 5001
        },
        {
          label: '投保客户（个）',
          count: 51
        },
        {
          label: '累计保费（元）',
          count: 789532
        }
      ],
      topSalesDate: [],
      salesTableLoading: false,
      topSalesList: [],
      pieChart: null
    }
  },
  methods: {
    toMore(type){
      this.$router.push({
        path: '/announcement',
        query: {
          tab: type
        }
      })
    },
    toDetail(id){
      let url = this.$router.resolve({
        path: '/announcement-detail',
        query: {
          id
        }
      })

      window.open(url.href, '_blank')
    }
  },
  mounted () {
    const data = [
      { item: '事例一', count: 40, percent: 0.4 },
      { item: '事例二', count: 21, percent: 0.21 },
      { item: '事例三', count: 17, percent: 0.17 },
      { item: '事例四', count: 13, percent: 0.13 },
      { item: '事例五', count: 9, percent: 0.09 },
    ];

    const chart = new Chart({
      container: 'pieChart',
      autoFit: true,
      width: 630,
      height: 300
    });

    chart.coordinate('theta', {
      radius: 0.75,
    });

    chart.data(data);

    chart.scale('percent', {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });

    chart.tooltip({
      showTitle: false,
      showMarkers: false,
    });

    chart
      .interval()
      .adjust('stack')
      .position('percent')
      .color('item')
      // .label('percent', {
      //   offset: '-30%',
      //   style: {
      //     textAlign: 'center',
      //     fontSize: 16,
      //     shadowBlur: 2,
      //     shadowColor: 'rgba(0, 0, 0, .45)',
      //   },
      // })
      .tooltip('item*percent', (item, percent) => {
        percent = percent * 100 + '%';
        return {
          name: item,
          value: percent,
        };
      });
    chart.legend({position: 'right'})
    chart.interaction('element-active');
    chart.render();
  }
};
</script>

<style lang="scss" scoped>
.home-page{
  padding: 0 20px;
  height: 100%;

  .page-container{
    background: #f5f5f5;
    overflow-y: auto;
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
        width: 32.5%;
        background: #FFFFFF;
        border-radius: 5px;

        .sector-content {
          padding: 8px;

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
