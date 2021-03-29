<template>
  <div class="insure-goods-container">
    <div class="header">
      <common-tabs-header v-model="tabIndex" :data="tabsData"></common-tabs-header>
      <el-button v-if="$checkAuth('/rate/commission_management/batch_create') && tabIndex === 'commission-rate'" size="small" type="primary" @click="openRateDialog"><i class="iconfont iconxiao16_shezhi mr4"></i>批量设置佣金费率</el-button>
    </div>
    <div class="content">
      <Component :is="tabIndex"></Component>
    </div>
  </div>
</template>

<script>
import commonTabsHeader from '../../../components/common-tabs-header'
import Goods from './tab-panel/goods'
import UpShelves from './tab-panel/up-shelves'
import DownShelves from './tab-panel/down-shelves'
export default {
  name: 'insure-goods',
  components: {
    commonTabsHeader,
    Goods,
    UpShelves,
    DownShelves
  },
  data() {
    return {
      tabIndex: '',
      tabsData: [
        { name: 'goods', label: '全部商品'},
        { name: 'up-shelves', label: '新品上架', permission: '', dot: true},
        { name: 'down-shelves', label: '即将下架', permission: '', dot: false},
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
  .insure-goods-container {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .header{
      padding: 16px 0 0 18px;
      height: 56px;
      background: #F5F5F5;
      border-radius: 4px 4px 0px 0px;
      border: 1px solid #E6E6E6;
      position: relative;
      .el-button{
        position: absolute;
        top:12px;
        right: 16px;
      }
    }
    .content{
      background-color: #fff;
      flex: 1;
      height: 800px;
      overflow: hidden;
      border: 1px solid #e6e6e6;
      border-top: transparent;
      box-sizing: border-box;
    }
  }
</style>
