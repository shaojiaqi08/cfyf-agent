<template>
  <div class="proposal-container">
    <!-- <el-input v-model="searchModel.keyword"
                  prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
                  class="search-input"
                  placeholder="搜索产品名称"
                  @input="debounceGetProposal"
                  clearable></el-input> -->
    <div class="list" v-loading="loading">
      <div class="search-input-container">
        <el-input
          v-model="searchModel.keyword"
          prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
          placeholder="搜索计划书名称"
          @keyup.enter.native="debounceGetProposal"
          clearable
          ><el-button slot="append" @click="debounceGetProposal"
            >搜索</el-button
          ></el-input
        >
      </div>
      <template v-if="proposalDateArr.length > 0">
        <div class="list-content">
          <el-scrollbar
            wrapClass="scroll-bar-wap-pro"
            viewClass="prospectus-list"
            class="scroll-bar"
            style="height: calc(100% - 68px); overflow: hidden"
          >
            <div v-infinite-scroll="nextPage" :infinite-scroll-delay="400">
              <div
                v-for="(item, index) in proposalDateArr"
                :key="index"
                class="scroll-bar-pro-item"
              >
                <div class="time" :class="{ fixed: proFixedIndex === index }">
                  <span>{{ item }}</span>
                </div>
                <div class="auto-fixed" v-if="proFixedIndex === index"></div>
                <div
                  class="item pointer"
                  v-for="it in proposalData[item]"
                  :key="it.id"
                  :class="{ active: proposalIndex === it.id }"
                  @click="getProposalDetail(it)"
                >
                  <div class="flex-between gray mb12 active-vague">
                    <div><i class="icon-prospectus"></i>分享了计划书</div>
                    <div>{{ it.share_minute_time_text }}</div>
                  </div>
                  <div class="fs16 mb12 word-break bold">
                    {{ it.proposal_name }}
                  </div>
                  <div class="gray active-vague">
                    共有{{ it.uv_read_count }}位微信好友浏览，平均时长{{
                      it.pv_read_time_text
                    }}
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </template>
      <div class="no-content gray" v-else>
        <div class="tc">
          <div>暂无数据</div>
        </div>
      </div>
    </div>
    <div class="detail" v-loading="detailLoading">
      <!--<div class="title border-bottom">互动记录详情</div>-->
      <div v-if="proposalDetail.id" class="detail-warp">
        <div class="time main-time flex-between">
          <span>分享时间</span>
          <span>{{ proposalDetail.share_date_time_text }}</span>
        </div>
        <div class="detail-content border-bottom">
          <div class="mb12">
            <el-tag type="minor">计划书</el-tag>
          </div>
          <div class="fs16 word-break mb12 bold">
            {{ proposalDetail.proposal_name }}
          </div>
          <div class="gray">
            共有{{ proposalDetail.uv_read_count }}位微信好友浏览，平均时长{{
              proposalDetail.pv_read_time_text
            }}
          </div>
        </div>
        <div class="detail-personnel" style="overflow: hidden;">
          <el-scrollbar class="scroll-bar" style="overflow: hidden;">
            <div
              class="list-personnel"
              v-for="item in proposalDetail.read_logs"
              :key="item.id"
            >
              <div class="flex-between">
                <el-avatar
                  :size="48"
                  :src="item.read_user_avatar_url"
                ></el-avatar>
                <div class="flex-item ml10">
                  <div class="flex-between mb10">
                    <span class="fs14 text-ellipsis">{{
                      item.read_user_nickname
                    }}</span>
                    <span class="fs12 gray">{{
                      item.read_date_time_text
                    }}</span>
                  </div>
                  <div class="flex-between fs12">
                    <span class="gray">浏览时长：{{ item.duration_text }}</span>
                    <span class="gray">{{ item.read_minute_time_text }}</span>
                  </div>
                </div>
              </div>
              <div
                class="item fs14 mt16"
                v-for="(it, index) in item['read_content_list']"
                :key="index"
              >
                <div class="mb5 bold">{{ it.title }}</div>
                <div class="word-break">{{ it.content }}</div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="no-content gray" v-else>
        <div class="tc">
          <i class="el-icon-view mb5 fs18"></i>
          <div>点击列表查看互动详情</div>
        </div>
      </div>
    </div>
    <div class="iframe">
      <div class="content">
        <div class="iframe-url" v-loading="detailLoading">
          <iframe
            v-if="proposalDetail.id"
            class="iframe-item"
            scrolling="yes"
            frameBorder="0"
            :src="proposalDetail['direct_url']"
          ></iframe>
          <div class="no-content gray" v-else>
            <div class="tc">
              <i class="el-icon-view mb5 fs18"></i>
              <div>点击列表查看互动详情</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  interactiveLogProposal,
  interactiveLogProposalDetail,
} from "@/apis/modules/interactive";
import { debounce } from "@/utils";
export default {
  name: "proposal",
  data() {
    return {
      loading: false,
      total: 0,
      proposalDateArr: [],
      proposalData: {},
      originData: [],
      searchModel: {
        proposal_name: "",
        page: 1,
        page_size: 20,
        keyword: "",
      },
      proFixedIndex: null,
      proposalIndex: null,
      offsetTopProArr: [],
      detailLoading: false,
      proposalDetail: {},
      activeFinishUrl: "",
    };
  },
  mounted() {
    this.getInteractiveLogProposal();
    this.$root.$on("proSearch", this.proSearch);
  },
  beforeDestroy() {
    let scrollBarPro = document.querySelector(".scroll-bar-wap-pro");
    if (scrollBarPro) {
      scrollBarPro.removeEventListener("scroll", this.scrollBarWapProFn, false);
    }
    this.$root.$off("proSearch", this.proSearch);
  },
  methods: {
    proSearch(keyword) {
      this.searchModel.keyword = keyword;
      this.searchModel.page = 1;
      this.getInteractiveLogProposal();
    },
    // 分页
    handleCurrentChange(v) {
      this.searchModel.page = v;
      this.getInteractiveLogProposal();
    },
    // 互动记录-计划书
    getInteractiveLogProposal() {
      this.loading = true;
      const { page } = this.searchModel;
      interactiveLogProposal(this.searchModel)
        .then((res) => {
          this.originData =
            page <= 1 ? res.data : [...this.originData, ...res.data];
          let formatData = this.originData.reduce((prev, next) => {
            const date = next["share_date_time_text"];
            if (prev[date]) {
              prev[date].push(next);
            } else {
              prev[date] = [next];
            }
            return prev;
          }, {});
          this.proposalData = formatData;
          this.total = res.total;
          this.proposalDateArr = Object.keys(formatData);
          this.loading = false;
          if (this.proposalDateArr.length > 0) {
            this.$nextTick(() => {
              this.initScrollProspectus();
            });
          } else {
            // 当前页没数据, 回到上一页
            this.searchModel.page = Math.max(1, page - 1);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    nextPage() {
      const { total, searchModel } = this;
      const { page, page_size } = searchModel;
      if (page_size * page < total) {
        this.searchModel.page += 1;
        this.total = 0;
        this.getInteractiveLogProposal();
      }
    },
    debounceGetProposal: debounce(function() {
      this.searchModel.page = 1;
      this.getInteractiveLogProposal();
    }, 300),
    // 滚动监听
    initScrollProspectus() {
      let scrollBarPro = document.querySelector(".scroll-bar-wap-pro");
      if (!scrollBarPro) return;
      let offsetTopArr = [];
      let itemList = [...document.querySelectorAll(".scroll-bar-pro-item")];
      for (let i = 0; i < itemList.length; i++) {
        offsetTopArr.push(itemList[i].offsetTop);
      }
      this.offsetTopProArr = offsetTopArr;
      console.log(offsetTopArr);
      scrollBarPro.addEventListener("scroll", this.scrollBarWapProFn, false);
    },
    scrollBarWapProFn(e) {
      let scrollTop = e.target.scrollTop;
      if (scrollTop === 0) {
        this.proFixedIndex = null;
        return;
      }
      for (let i = 0; i < this.offsetTopProArr.length; i++) {
        if (this.offsetTopProArr[i + 1]) {
          if (
            scrollTop > this.offsetTopProArr[i] &&
            scrollTop < this.offsetTopProArr[i + 1]
          ) {
            this.proFixedIndex = i;
            return;
          }
        } else {
          if (scrollTop > this.offsetTopProArr[i]) {
            this.proFixedIndex = i;
            return;
          }
        }
      }
    },
    // 计划书详情
    getProposalDetail(item) {
      console.log(item);
      if (!item.id) return;
      this.proposalIndex = item.id;
      this.detailLoading = true;
      this.proposalDetail = {};
      interactiveLogProposalDetail({ proposal_id: item.proposal_id })
        .then((res) => {
          console.log("计划书详情", res);
          this.detailLoading = false;
          this.proposalDetail = res;
        })
        .catch(() => {
          this.proposalDetail = {};
          this.detailLoading = false;
        });
    },
  },
  watch: {
    "searchModel.keyword"() {
    //   this.searchModel.page = 1;
    //   this.debounceGetProposal();
    },
  },
};
</script>
<style scoped lang="scss">
.proposal-container {
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  ::v-deep .el-input-group__append {
    background-color: #1f78ff;
    border-color: #1f78ff;
    .el-button {
      color: #fff;
    }
  }
  & > .list {
    width: 320px;
    border-right: 1px solid #e6e6e6;
    .search-input-container {
      padding: 16px;
    }
    ::v-deep .scroll-bar-wap-other {
      overflow-x: hidden;
    }
    .list-content {
      height: 100%;
    }
    .item {
      position: relative;
      margin: 0 8px;
      transition: all 0.2s ease-out;
      padding: 16px 8px;
      // border-bottom: 1px solid #e6e6e6;
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 8px;
        height: 1px;
        width: 286px;
        background-color: #e6e6e6;
      }
      &.active {
        color: #1f78ff !important;
        background: rgba(31, 120, 255, 0.1);
        border-radius: 4px;
        // border-bottom: none;
        &::after {
          height: 0;
        }
        .active-vague {
          color: #1f78ff !important;
        }
      }
      &:hover {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
      .icon-product {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-size: contain;
        vertical-align: top;
        margin-right: 5px;
        background: url("../../../../assets/images/icon-product.png") no-repeat
          center;
      }
      .icon-article {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-size: contain;
        vertical-align: top;
        margin-right: 5px;
        background: url("../../../../assets/images/icon-article.png") no-repeat
          center;
      }
      .icon-promote {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-size: contain;
        vertical-align: top;
        margin-right: 5px;
        background: url("../../../../assets/images/icon-promote.png") no-repeat
          center;
      }
    }
  }
  & > .detail {
    width: 360px;
    border-right: 1px solid #e6e6e6;
    .detail-warp {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .detail-content {
      padding: 16px 0;
      margin: 0 16px;
    }
    .list-personnel {
      padding: 16px 0;
      margin: 0 16px;
      color: #1a1a1a;
      border-bottom: 1px solid #e6e6e6;
      .item {
        & > div {
          line-height: 20px;
        }
        & > div:nth-of-type(2) {
          color: #999;
        }
      }
    }
    .detail-personnel {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding-bottom: 40px;
      .scroll-bar {
        flex: 1;
      }
    }
  }
  & > .iframe {
    flex: 1;
    .content,
    .iframe-url {
      height: 100%;
      padding: 16px 0;
    }
    .iframe-url {
      width: 360px;
      height: 100%;
      border-radius: 4px;
      border: 1px solid #e6e6e6;
      background: #f5f5f5;
      margin: auto;
      overflow: hidden;
      padding: 0;
      .iframe-item {
        height: 100%;
        width: 100%;
        outline: none;
        overflow: auto;
      }
    }
  }
  .search-input {
    width: 360px;
    position: fixed;
    top: 72px;
    right: 32px;
    z-index: 2;
  }
  .time {
    margin: 8px 16px;
    // height: 44px;
    // border-bottom: 1px solid #e6e6e6;
    padding: 6px;
    font-weight: 500;
    color: #1a1a1a;
    background-color: #f5f5f5;
    text-align: center;
    border-radius: 4px;
    &.main-time {
      background-color: #fff;
      margin: 16px 12px 0;
    }
  }
  .scroll-bar-pro-item {
    .item {
      // &:last-child {
      //     border-bottom: 1px solid #ededed;
      // }
    }
  }
  .no-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ::v-deep .scroll-bar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
