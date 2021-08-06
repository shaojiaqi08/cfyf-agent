<template>
  <div class="announcement">
    <div class="header">
      <common-tabs-header v-model="tabIndex" :data="tabData"></common-tabs-header>
    </div>
    <div class="content">
      <div class="content-top">
        <div class="unread">
          {{ tabData.find(item => item.name.includes(tabIndex)).label }}
          <span v-if="unReadLists.length > 0">(未读{{ unReadLists.length }})</span>
        </div>
        <div class="unread-filter">
          <!--筛选-->
          <filter-shell
            v-model="readFilter"
            :width="150"
            autoFocus
            no-margin
            @input="searchModelChange"
          >
            <el-select v-model="readFilter"
                       class="block"
                       clearable
                       placeholder="请选择"
                       @change="searchModelChange">
              <el-option
                v-for="item in readMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <template v-slot:label>{{ hasValue(readFilter) ? readMap.find(i => i.value === readFilter).label : '全部' }}
            </template>
          </filter-shell>
        </div>
      </div>
      <div class="content-wrap">
        <el-row align="middle" class="row" justify="space-between" type="flex" @click.native="toDetail(23)">
          <el-col :span="22">
            <div class="row-title">发达撒发俺的沙发撒地方阿斯蒂发撒大撒地方阿萨德发按时；的看法； 拉斯柯达； 分开；萨迪克；冯老师看；代付款萨的看法；卡士大夫撒点击费率加速度六块腹</div>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <span class="row-date">10:54</span>
            <i class="el-icon-arrow-right"></i>
          </el-col>
        </el-row>
        <el-row align="middle" class="row is-top" justify="space-between" type="flex">
          <el-col :span="22">
            <div class="row-title">发达撒发俺的沙发撒地方阿斯蒂发撒大撒地方阿萨德发按时；的看法； 拉斯柯达； 分开；萨迪克；冯老师看；代付款萨的看法；卡士大夫撒点击费率加速度六块腹</div>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <span class="row-date">10:54</span>
            <i class="el-icon-arrow-right"></i>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import commonTabsHeader from '@/components/common-tabs-header'
  import FilterShell, { hasValue } from '@/components/filters/filter-shell'
  import { debounce } from "@/utils";
  import {
    mapActions,
    mapState
  } from 'vuex'

  export default {
    name: "announcement",
    data () {
      return {
        tabData: [
          {name: 'new-lines', label: '新品上新', permission: '/rate/service_rate'},
          {name: 'regulate', label: '商品调整', permission: '/rate/commission_management', dot: 'regulate_quantity'},
          {name: 'announcement', label: '平台公告', permission: '/insure-goods/new_product_notice'}
        ],
        readMap: [
          {label: '已读', value: '1'},
          {label: '未读', value: '2'}
        ],
        tabIndex: '',
        readFilter: '',
        rowLists: [
          {title: 'dsf52a', create_at: '10:54', is_unread: 1},
          {title: 'dsfa23', create_at: '10:54', is_unread: 0},
          {title: 'dsfa42', create_at: '10:54', is_unread: 1},
          {title: 'dsfa52', create_at: '10:54', is_unread: 0},
        ],
        unReadLists: []
      }
    },
    components: {
      commonTabsHeader,
      FilterShell
    },
    computed: {
      ...mapState('dotManage', ['dots']),
    },
    watch: {
      tabIndex () {
        this.ajaxListData()
      },
    },
    methods: {
      ...mapActions({updateDots: 'dotManage/updateDots'}),
      hasValue,
      searchModelChange () {
        const func = debounce(() => {
          this.rowLoading = true
          this.page = 1
          this.total = 0
          this.ajaxListData()
        }, 300)
        func()
        this.searchModelChange = func
      },
      toDetail (id) {
        let url = this.$router.resolve({
          name: 'announcement-detail',
          query: {
            id
          }
        })

        window.open(url.href, '_blank')
      },
      tabChange (val) {
        console.log(val)
      },
      ajaxListData () {
        // let dots = {}
        // this.unReadLists = this.rowLists.filter(item => item.is_unread)
        // console.log(dots)
        // this.updateDots({...this.dots, ...dots})
      },
    },
  }
</script>

<style lang="scss" scoped>
  .announcement {
    padding: 0 20px;
    height: 100%;

    .header {
      padding-left: 16px;
      height: 56px;
      background: #F5F5F5;
      border-radius: 4px 4px 0px 0px;
      border: 1px solid #E6E6E6;
      position: relative;

      .el-button {
        position: absolute;
        top: 12px;
        right: 16px;
      }
    }

    .content {
      background-color: #fff;
      flex: 1;
      height: 800px;
      overflow: hidden;
      border: 1px solid #e6e6e6;
      border-top: transparent;
      box-sizing: border-box;

      .content-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding: 15px 27px 0;

        .unread {
          font-size: 16px;
          line-height: 22px;
          color: #1F78FF;
        }
      }

      .content-wrap {
        .row {
          cursor: pointer;

          &.is-top {
            .row-date,
            .row-title {
              color: #FF4C4C;
            }
          }

          margin: 0 8px;
          height: 37px;
          padding: 0 19px;
          transition: all .4s;

          &:hover {
            background: #F3F8FF;

            .row-date,
            .row-title {
              color: #1F78FF !important;
            }
          }

          .row-title {
            transition: all .4s;
            font-size: 14px;
            font-weight: bold;
            line-height: 24px;
            color: #1A1A1A;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .row-date {
            transition: all .4s;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #1A1A1A;
          }
        }
      }
    }

    .announcement-container {
      background: #fff;
    }
  }
</style>
