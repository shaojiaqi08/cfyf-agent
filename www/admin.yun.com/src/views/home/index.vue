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
        <div class="sector">
          <el-button type="primary" @click="toMore('new-lines')">新品更多</el-button>
        </div>
        <div class="sector">
          <el-button type="primary" @click="toMore('regulate')">调整更多</el-button>
        </div>
        <div class="sector">
          <el-button type="primary" @click="toMore('announcement')">公告更多</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data(){
    return {
      imgList: [
        'https://hbimg.huabanimg.com/9b7670df2b854924c8f527d15449edde57719f4a3e5fb-ohj3Qk_fw658/format/webp',
        'https://hbimg.huabanimg.com/c2c34bd77d79fc39f2e3f63b1d4689533e65e395137d6-TTHWQb_fw658/format/webp',
        'https://hbimg.huabanimg.com/59e21a6330c0d2c4119e22b040bd549a47a61a00eba6-amBScH_fw658/format/webp'
      ]
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
    }
  }
};
</script>

<style lang="scss" scoped>
.home-page{
  padding: 0 20px;
  height: 100%;

  .page-container{
    background: #fff;

    .banner{
      width: 100%;
      padding-top: 20px;

      .banner-img{
        width: 100%;
        object-fit: cover;
      }
    }

    .announcement-sector{
      display: flex;
      justify-content: space-between;
      align-items: center;

      .sector{
        width: 30%;
      }
    }
  }
}
</style>
