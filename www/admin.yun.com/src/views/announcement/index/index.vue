<template>
  <div class="announcement">
    <div class="header">
      <common-tabs-header v-model="tabIndex" :data="tabData"></common-tabs-header>
    </div>
    <div class="content" v-loading="loading">
      <div class="content-top">
        <div class="unread">
          {{ tabData.find(item => item.name.includes(tabIndex)).label }}
          <span>(未读{{ unread }})</span>
        </div>
        <div class="unread-filter">
          <!--筛选-->
          <filter-shell
            v-model="searchModel.read_type"
            :width="150"
            autoFocus
            auto-close
            no-margin
            @input="searchModel.read_type = ''"
          >
            <el-select v-model="searchModel.read_type"
                       class="block"
                       clearable
                       filterable
                       placeholder="请选择">
              <el-option
                v-for="item in readMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <template v-slot:label>{{ searchModel.read_type ? readMap.find(i => i.value === searchModel.read_type).label : '全部' }}
            </template>
          </filter-shell>
          <el-input v-model="searchModel.keyword"
                    style="width: 300px; margin: 0 20px"
                    placeholder="请输入需要搜索的公告内容或标题"
                    size="small" clearable></el-input>
          <el-button type="primary"
                     @click="searchModelChange"
                     size="small">搜索</el-button>
        </div>
      </div>
      <div class="content-wrap" v-if="list && list.length > 0" v-infinite-scroll="scroll2Bottom">
        <el-row align="middle" class="row" :class="{'is-top': item.is_emphasis, 'is-read': item.is_read != 0}" justify="space-between" type="flex" @click.native="toDetail(item.announcement_no)" v-for="item in list" :key="item.announcement_no">
          <el-col :span="22">
            <div class="row-title">{{item.is_top ? '【置顶】' : ''}}{{item.title}}</div>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <span class="row-date">{{item.put_up_at_str}}</span>
            <i class="el-icon-arrow-right"></i>
          </el-col>
        </el-row>
      </div>
      <div v-else class="tc mt30">暂无数据</div>
    </div>
  </div>
</template>

<script>
  import commonTabsHeader from '@/components/common-tabs-header'
  import FilterShell from '@/components/filters/filter-shell'
  import {
    getAnnouncementList,
    getRegulateList,
    getNewLinesList,
    logPlateClick,
    getUnreadCount
  } from '@/apis/modules/home'
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
          {name: 'new-lines', label: '新品上新', permission: '/home_page/manage', dot: 'new_lines_quantity'},
          {name: 'regulate', label: '商品调整', permission: '/home_page/manage', dot: 'regulate_quantity'},
          {name: 'announcement', label: '平台公告', permission: '/home_page/manage', dot: 'announcement_quantity'}
        ],
        readMap: Object.freeze([
          {label: '已读', value: 'read'},
          {label: '未读', value: 'unread'}
        ]),
        tabIndex: '',
        list: [],
        typeMap: Object.freeze({
          'new-lines': getNewLinesList,
          regulate: getRegulateList,
          announcement: getAnnouncementList
        }),
        unreadTypeMap: Object.freeze({
          'new-lines': 'new_lines_quantity',
          regulate: 'regulate_quantity',
          announcement: 'announcement_quantity'
        }),
        searchModel: {
          keyword: '',
          read_type: '',
          page: 1,
          page_size: 25
        },
        loading: false,
        unread: 0
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
        this.searchModel.page = 1
        this.searchModel.keyword = ''
        this.searchModel.read_type = ''
        this.ajaxListData()
      },
    },
    methods: {
      ...mapActions({updateDots: 'dotManage/updateDots'}),
      // 触底加载方法
      scroll2Bottom() {
        const {total, searchModel: {page, page_size}} = this
        if (page * page_size < total) {
          this.searchModel.page += 1
          this.ajaxListData()
        }
      },
      getUnreadCount(){
        getUnreadCount().then(res => {
          this.updateDots({
            ...this.dots,
            new_lines_quantity: res.new_product,
            regulate_quantity: res.product_adjust,
            announcement_quantity: res.platform
          })
        })
      },
      searchModelChange () {
        const func = debounce(() => {
          this.page = 1
          this.total = 0
          this.ajaxListData()
        }, 300)
        func()
        this.searchModelChange = func
      },
      toDetail (id) {
        logPlateClick({announcement_no: id})
        let url = this.$router.resolve({
          name: 'announcement-detail',
          query: {
            id
          }
        })

        window.open(url.href, '_blank')
      },
      ajaxListData () {
        this.loading = true
        this.typeMap[this.tabIndex](this.searchModel).then(res => {
          this.list = this.searchModel.page === 1 ? res.list.data : this.list.concat(res.list.data)
          this.total = res.list.total
          this.unread = res.un_read_count
          // 更新
          this.updateDots({...this.dots, [this.unreadTypeMap[this.tabIndex]]: res.un_read_count})
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.loading = false
        })
      },
    },
    created () {
      this.getUnreadCount()
    }
  }
</script>

<style lang="scss" scoped>
  .unread-filter {
    display: flex;
    align-items: center;
  }
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
        height: 750px;
        overflow-y: auto;

        .row {
          cursor: pointer;

          &.is-top {
            .row-date,
            .row-title {
              color: #FF4C4C !important;
            }
          }

          &.is-read{
            .row-date,
            .row-title {
              color: #999 !important;
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
