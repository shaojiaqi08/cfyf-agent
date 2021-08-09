<template>
<div class="announcement-detail">
  <div class="header">
    公告详情
  </div>
  <div class="content">
    <div class="announcement-content-title">
      新少儿平安4.0上线通知，各位商家可立即了解超长换行展示各位商家可立即了解超长换行展示各位商
      <div class="announcement-content-date">2021-01-01 09:33</div>
    </div>
    <div class="announcement-product-name">
      保险名称：<span class="product-name">同方全球凡尔赛1号重大疾病保险(赔保额)</span>
    </div>
    <div class="announcement-desc">
      配置公告内容，内容可能很多，会换行展示停售公告内容内容可能很多，会换行展示停售公告内容，内容可能很多，会换行展示停售公告内容内容可能很多配置公告内容，内容可能很多，会换行展示停售公告内容内容可能很多，会换行展示停售公告内容，内容可能很多，会换行展示停售公告内容内容可能很多
    </div>
    <div class="announcement-img-container">
      <div class="img-wrap" v-for="item in 9" :key="item">
        <img src="https://hbimg.huabanimg.com/ab591dcf46df0e0af48cd5b471137622977d78271a310-iTCqPO_fw658/format/webp" alt="">
      </div>
    </div>
    <div class="file-container">
      <el-button icon="el-icon-document" type="text">文件名.txt</el-button>
      <el-link target="_blank" :underline="false">
        <el-button type="primary" size="small"><i class="iconfont iconxiao16_xiazai"></i>&nbsp;下载</el-button>
      </el-link>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: "announcement-detail"
  }
</script>

<style scoped lang="scss">
.announcement-detail{
  padding: 0 20px;
  height: 100%;
  width: 1200px;
  margin: 0 auto;

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
    &>::v-deep .el-input {
      .el-input-group__prepend{
        background: #fff;
        padding: 0 4px;
      }
      .el-input__inner{
        border-left: transparent;
        padding-left: 4px;
        &:focus{
          border-color: rgb(220, 223, 230);
        }
      }
    }
    ::v-deep .keyword-type-filter{
      padding-bottom: 0 !important;
      // .filter-item{
      //     margin: 0;
      //     height: 24px;
      //     line-height: 21px;
      //     width: 106px;
      //     font-weight: normal;
      //     display: flex !important;
      //     align-items: center;
      //     justify-content: center;
      //     &.actived{
      //         color:#1A1A1A;
      //         background: #f5f5f5;
      //         border-color: #e6e6e6;
      //     }
      // }
    }

  }
  & > .content{
    background: #FFFFFF;
    padding: 30px 16px 40px;
    flex: 1;
    overflow: hidden;

    .announcement-content-title{
      font-size: 18px;
      color: #333333;
      position: relative;
      margin-bottom: 16px;
      text-align: center;
      font-weight: 600;

      .announcement-content-date{
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 12px;
        color: #999999;
      }
    }

    .announcement-product-name{
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      margin-bottom: 10px;

      .product-name{
        color: #1F78FF;
      }
    }

    .announcement-desc{
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      margin-bottom: 16px;
    }

    .announcement-img-container{
      display: flex;
      align-items: center;

      .img-wrap{
        width: 128px;
        height: 81px;
        margin-right: 10px;
        border-radius: 5px;
        overflow: hidden;

        img{
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }
    }
    .file-container{
      width: 560px;
      height:64px;
      background:rgba(245,245,245,1);
      border-radius:4px;
      border:1px solid #e6e6e6;
      margin: 16px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      & > ::v-deep .el-button:first-child{
        cursor: initial;
        i{
          color:#979797;
        }
        span{
          color:#333;
        }
      }
    }

    ::v-deep .el-scrollbar{
      flex: 1;
      .el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
  }
}
</style>
