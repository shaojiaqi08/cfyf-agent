<template>
  <div class="share-container">
    <!-- <el-input v-model="otherModel.keyword"
                  prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
                  class="search-input"
                  placeholder="搜索产品名称"
                  @input="debounceGetLogOther"
                  clearable></el-input> -->
    <div class="list" v-loading="loading">
      <div class="search-input-container">
        <el-input
          v-model="otherModel.keyword"
          prefix-icon="ml4 iconfont iconxiao16_sousuo el-input__icon"
          placeholder="搜索产品名称"
          @keyup.enter.native="debounceGetLogOther"
          clearable
          ><el-button slot="append" @click="debounceGetLogOther"
            >搜索</el-button
          ></el-input
        >
      </div>
      <template v-if="otherDateArr.length > 0">
        <div class="list-content">
          <el-scrollbar
            wrapClass="scroll-bar-wap-other"
            viewClass="prospectus-list"
            class="scroll-bar"
            style="height: calc(100% - 68px); overflow: hidden"
          >
            <div v-infinite-scroll="nextPage" :infinite-scroll-delay="400">
              <div
                v-for="(item, index) in otherDateArr"
                :key="index"
                class="scroll-bar-other-item"
              >
                <div class="time" :class="{ fixed: otherFixedIndex === index }">
                  <span>{{ item }}</span>
                </div>
                <div class="auto-fixed" v-if="otherFixedIndex === index"></div>
                <div
                  class="item pointer"
                  v-for="it in otherData[item]"
                  :key="it.original_id"
                  @click="getOtherDetail(it)"
                  :class="{ active: fixedIndex === it.original_id }"
                >
                  <div class="flex-between gray mb12 active-vague">
                    <div v-if="it.type === 'product' || it.type === 'cps'">
                      分享了产品
                    </div>
                    <div v-if="it.type === 'article'">分享了文章</div>
                    <div
                      v-if="it.type === 'drop_game' || it.type === 'evaluating'"
                    >
                      分享了展业工具
                    </div>
                    <div>{{ it.share_minute_time_text }}</div>
                  </div>
                  <div class="fs16 word-break mb12 bold">
                    {{ it.target_name }}
                  </div>
                  <div
                    class="gray active-vague"
                    v-if="it.type === 'evaluating' || it.type === 'drop_game'"
                  >
                    共有{{ it.uv_read_count }}位微信好友浏览，{{
                      it.finished_evaluating_count
                    }}人完成{{ it.type === "drop_game" ? "答题" : "测评" }}
                  </div>
                  <div class="gray active-vague" v-else>
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
      <div v-if="otherDetail.caption" class="detail-warp">
        <div class="time main-time flex-between">
          <span>分享时间</span>
          <span>{{ otherDetail.caption["share_date_time_text"] }}</span>
        </div>
        <div class="detail-content border-bottom">
          <div class="mb12" v-if="otherDetail.caption.tags.length > 0">
            <el-tag
              type="minor"
              :class="{ mr10: index !== otherDetail.caption.tags.length - 1 }"
              v-for="(item, index) in otherDetail.caption.tags"
              :key="index"
              >{{ item }}
            </el-tag>
          </div>
          <div
            class="fs16 word-break mb12 bold"
            v-if="otherDetail.caption.type === 'cps'"
          >
            {{ otherDetail.caption.target_name }}
          </div>
          <div class="fs16 word-break mb12 bold" v-else>
            {{ otherDetail.caption.title }}
          </div>
          <div
            class="gray"
            v-if="
              otherDetail.caption.type === 'evaluating' ||
                otherDetail.caption.type === 'drop_game'
            "
          >
            共有{{ otherDetail.caption.uv_read_count }}位微信好友浏览，{{
              otherDetail.caption.finished_evaluating_count
            }}人完成{{
              otherDetail.caption.type === "drop_game" ? "答题" : "测评"
            }}
          </div>
          <div class="gray" v-else>
            共有{{
              otherDetail.caption.uv_read_count
            }}位微信好友浏览，平均时长{{
              otherDetail.caption.pv_read_time_text
            }}
          </div>
        </div>
        <template
          v-if="
            otherDetail.caption.type === 'evaluating' ||
              otherDetail.caption.type === 'drop_game'
          "
        >
          <div class="test-friend">
            <el-scrollbar class="scroll-bar" wrapClass="scroll-bar-wap-friend">
              <div class="scroll-bar-friend-item">
                <div
                  class="time border-bottom"
                  :class="{ fixed: friendIndex === 0 }"
                >
                  <span>完成测评的好友</span>
                </div>
                <template v-if="otherDetail['finished'].length > 0">
                  <div class="auto-fixed" v-if="friendIndex === 0"></div>
                  <div
                    class="list-user"
                    @click="openFinished(item)"
                    :class="{ active: activeFinishIndex === item.id }"
                    v-for="(item, index) in otherDetail.finished"
                    :key="index"
                  >
                    <div class="flex-between">
                      <el-avatar :size="50" :src="item.user_avatar"></el-avatar>
                      <div class="flex-item ml10">
                        <div class="flex-between mb10">
                          <span class="fs14 text-ellipsis">{{
                            item.user_nickname
                          }}</span>
                          <span class="gray active-vague fs12">{{
                            item.read_date_time_text
                          }}</span>
                        </div>
                        <div class="flex-between fs12">
                          <span
                            v-if="otherDetail.caption.type !== 'drop_game'"
                            class="gray active-vague"
                            >{{
                              item.has_complete_info === 0
                                ? "未填写姓名和手机号"
                                : item.user_name + " " + item.user_mobile
                            }}</span
                          >
                          <span v-else class="gray active-vague">{{
                            item.evaluating_result_str
                          }}</span>
                          <span class="gray active-vague">{{
                            item.read_minute_time_text
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="p20 gray tc" v-else>暂无数据</div>
              </div>
              <div class="scroll-bar-friend-item">
                <div
                  class="time border-bottom"
                  :class="{ fixed: friendIndex === 1 }"
                >
                  <span>未完成测评的好友</span>
                </div>
                <template v-if="otherDetail['noFinished'].length > 0">
                  <div class="auto-fixed" v-if="friendIndex === 1"></div>
                  <div class="detail-personnel">
                    <div
                      class="list-no-finish-user"
                      v-for="(item, index) in otherDetail.noFinished"
                      :key="index"
                    >
                      <div class="flex-between">
                        <el-avatar
                          :size="50"
                          :src="item.user_avatar"
                        ></el-avatar>
                        <div class="flex-item ml10">
                          <div class="flex-between mb10">
                            <span class="fs14 text-ellipsis">{{
                              item.user_nickname
                            }}</span>
                            <span class="gray fs12">{{
                              item.read_date_time_text
                            }}</span>
                          </div>
                          <div class="flex-between fs12">
                            <span
                              v-if="otherDetail.caption.type !== 'drop_game'"
                              class="gray"
                              >{{
                                item.user_name + " " + item.user_mobile
                              }}</span
                            >
                            <span class="gray" v-else>{{
                              item.evaluating_result_str
                            }}</span>
                            <span class="gray">{{
                              item.read_minute_time_text
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="p20 gray tc" v-else>暂无数据</div>
              </div>
            </el-scrollbar>
          </div>
        </template>
        <template v-else>
          <div
            class="detail-personnel"
            v-if="otherDetail.users && otherDetail.users.length > 0"
          >
            <el-scrollbar class="scroll-bar">
              <div class="list-personnel">
                <div
                  class="flex-between"
                  :class="{ mb20: index !== otherDetail.users.length - 1 }"
                  v-for="(item, index) in otherDetail.users"
                  :key="index"
                >
                  <el-avatar
                    :size="50"
                    :src="item.user_avatar || DefaultAvatar"
                  ></el-avatar>
                  <div class="flex-item ml10">
                    <div class="flex-between mb10">
                      <span class="fs14 text-ellipsis">{{
                        item.user_nickname
                      }}</span>
                      <span class="gray fs12">{{
                        item.read_date_time_text
                      }}</span>
                    </div>
                    <div class="flex-between fs12">
                      <span class="gray"
                        >浏览时长：{{ item.read_time_text }}</span
                      >
                      <span class="gray">{{ item.read_minute_time_text }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </template>
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
          <template
            v-if="
              (otherDetail.caption &&
                otherDetail.caption.type === 'evaluating') ||
                (otherDetail.caption &&
                  otherDetail.caption.type === 'drop_game')
            "
          >
            <iframe
              v-if="activeFinishUrl"
              class="iframe-item"
              scrolling="yes"
              frameBorder="0"
              :src="activeFinishUrl"
            ></iframe>
            <div class="no-content gray" v-else>
              <div class="tc">
                <i class="el-icon-view mb5 fs18"></i>
                <div>点击列表查看内容详情</div>
              </div>
            </div>
          </template>
          <template
            v-else-if="
              otherDetail.caption && otherDetail.caption.type === 'article'
            "
          >
            <iframe
              class="iframe-item"
              scrolling="yes"
              frameBorder="0"
              :src="otherDetail.caption.target_url"
            ></iframe>
          </template>
          <template v-else>
            <div class="no-content gray">
              <div class="tc">
                <i class="el-icon-view mb5 fs18"></i>
                <div
                  v-if="
                    otherDetail.caption &&
                      (otherDetail.caption.type === 'cps' ||
                        otherDetail.caption.type === 'product')
                  "
                >
                  请在手机端查看产品详情
                </div>
                <div v-else>点击列表查看内容详情</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  interactiveLogOther,
  interactiveLogOtherArticle,
  interactiveLogOtherApi,
  interactiveLogOtherCps,
  interactiveLogOtherPit,
  interactiveLogOtherRisk,
} from "@/apis/modules/interactive";
import DefaultAvatar from "@/assets/images/default-avatar.png";
import { debounce } from "@/utils";
export default {
  name: "share",
  data() {
    return {
      DefaultAvatar,
      loading: false,
      otherModel: {
        page: 1,
        page_size: 20,
        keyword: "",
      },
      otherTotal: 0,
      otherDateArr: [],
      originData: [],
      otherData: {},
      fixedIndex: null,
      otherFixedIndex: null,
      offsetTopOtherArr: [],
      activeFinishIndex: null,
      activeFinishUrl: null,
      otherDetail: {},
      detailLoading: false,
      offsetTopFriendArr: [],
      friendIndex: null,
    };
  },
  mounted() {
    this.getInteractiveLogOther();
  },
  beforeDestroy() {
    let scrollBarOther = document.querySelector(".scroll-bar-wap-other");
    if (scrollBarOther) {
      scrollBarOther.removeEventListener(
        "scroll",
        this.scrollBarWapOtherFn,
        false
      );
    }
    let scrollBarFriend = document.querySelector(".scroll-bar-wap-friend");
    if (scrollBarFriend) {
      scrollBarFriend.removeEventListener(
        "scroll",
        this.scrollBarWapFriendFn,
        false
      );
    }
  },
  methods: {
    nextPage() {
      const { otherTotal, otherModel } = this;
      const { page, page_size } = otherModel;
      if (page_size * page < otherTotal) {
        this.otherModel.page += 1;
        this.getInteractiveLogOther();
      }
    },
    debounceGetLogOther: debounce(function() {
      this.otherModel.page = 1;
      this.total = 0;
      this.getInteractiveLogOther();
    }, 300),
    handleOtherCurrentChange(v) {
      this.otherModel.page = v;
      this.getInteractiveLogOther();
    },
    // 互动记录-其他-详情
    getOtherDetail(item) {
      console.log(item);
      if (!item.original_id) return;
      this.fixedIndex = item.original_id;
      this.activeFinishIndex = null;
      this.activeFinishUrl = null;
      this.otherDetail = {};
      if (item.type === "article") {
        this.getInteractiveLogOtherArticle(item.original_id);
      }
      if (item.type === "product") {
        this.getInteractiveLogOtherApi(item.original_id);
      }
      if (item.type === "cps") {
        this.getInteractiveLogOtherCps(item.original_id);
      }
      if (item.type === "drop_game") {
        this.getInteractiveLogOtherPit(item.original_id);
      }
      if (item.type === "evaluating") {
        this.getInteractiveLogOtherRisk(item.original_id);
      }
    },
    // 文章阅读详情
    getInteractiveLogOtherArticle(id) {
      if (!id) return;
      this.otherDetail = {};
      this.detailLoading = true;
      interactiveLogOtherArticle({ id: id })
        .then((res) => {
          console.log("文章阅读详情", res);
          res.caption.tags = res.caption.tags.split(",");
          this.otherDetail = res;
          this.detailLoading = false;
        })
        .catch(() => {
          this.otherDetail = {};
          this.detailLoading = false;
        });
    },
    // api产品详情
    getInteractiveLogOtherApi(id) {
      if (!id) return;
      this.detailLoading = true;
      interactiveLogOtherApi({ id: id })
        .then((res) => {
          console.log("api产品详情", res);
          this.detailLoading = false;
          res.caption.tags = res.caption.tags.split(",");
          this.otherDetail = res;
        })
        .catch(() => {
          this.detailLoading = false;
        });
    },
    // cps产品详情
    getInteractiveLogOtherCps(id) {
      if (!id) return;
      this.detailLoading = true;
      interactiveLogOtherCps({ id: id })
        .then((res) => {
          console.log("cps产品详情", res);
          this.detailLoading = false;
          res.caption.tags = res.caption.tags.split(",");
          this.otherDetail = res;
        })
        .catch(() => {
          this.detailLoading = false;
        });
    },
    // 避坑游戏详情
    getInteractiveLogOtherPit(id) {
      if (!id) return;
      this.detailLoading = true;
      interactiveLogOtherPit({ id: id })
        .then((res) => {
          console.log("避坑游戏详情", res);
          res.caption.tags = res.caption.tags.split(",");
          res.finished = res["users"].filter(
            (item) => item.finished_evaluating === 1
          );
          res.noFinished = res["users"].filter(
            (item) => item.finished_evaluating === 0
          );
          console.log(res);
          this.otherDetail = res;
          this.detailLoading = false;
          this.offsetTopFriendArr = [];
          this.friendIndex = null;
          this.$nextTick(() => {
            document.querySelector(".scroll-bar-wap-friend").scrollTo(0, 0);
            this.initScrollFriend();
          });
        })
        .catch(() => {
          this.detailLoading = false;
        });
    },
    // 风险测评详情
    getInteractiveLogOtherRisk(id) {
      if (!id) return;
      this.detailLoading = true;
      interactiveLogOtherRisk({ id: id })
        .then((res) => {
          console.log("风险测评详情", res);
          res.caption.tags = res.caption.tags.split(",");
          res.finished = res.users.filter(
            (item) => item.finished_evaluating === 1
          );
          res.noFinished = res.users.filter(
            (item) => item.finished_evaluating === 0
          );
          console.log(res);
          this.otherDetail = res;
          this.detailLoading = false;
          this.offsetTopFriendArr = [];
          this.friendIndex = null;
          this.$nextTick(() => {
            document.querySelector(".scroll-bar-wap-friend").scrollTo(0, 0);
            this.initScrollFriend();
          });
        })
        .catch(() => {
          this.detailLoading = false;
        });
    },
    openFinished(item) {
      console.log(item);
      this.activeFinishIndex = item.id;
      this.activeFinishUrl = item.target_url;
    },
    // 互动记录-其他-列表
    getInteractiveLogOther() {
      this.loading = true;
      const { page } = this.otherModel;
      interactiveLogOther(this.otherModel)
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
          this.otherData = formatData;
          this.otherTotal = res.total;
          this.otherDateArr = Object.keys(formatData);
          this.loading = false;
          if (this.otherDateArr.length > 0) {
            this.$nextTick(() => {
              this.initScrollOther();
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    initScrollOther() {
      let scrollBarOther = document.querySelector(".scroll-bar-wap-other");
      if (!scrollBarOther) return;
      let offsetTopArr = [];
      let itemList = [...document.querySelectorAll(".scroll-bar-other-item")];
      for (let i = 0; i < itemList.length; i++) {
        offsetTopArr.push(itemList[i].offsetTop);
      }
      this.offsetTopOtherArr = offsetTopArr;
      console.log(offsetTopArr);
      scrollBarOther.addEventListener(
        "scroll",
        this.scrollBarWapOtherFn,
        false
      );
    },
    scrollBarWapOtherFn(e) {
      let scrollTop = e.target.scrollTop;
      if (scrollTop === 0) {
        this.otherFixedIndex = null;
        return;
      }
      for (let i = 0; i < this.offsetTopOtherArr.length; i++) {
        if (this.offsetTopOtherArr[i + 1]) {
          if (
            scrollTop > this.offsetTopOtherArr[i] &&
            scrollTop < this.offsetTopOtherArr[i + 1]
          ) {
            this.otherFixedIndex = i;
            return;
          }
        } else {
          if (scrollTop > this.offsetTopOtherArr[i]) {
            this.otherFixedIndex = i;
            return;
          }
        }
      }
    },
    initScrollFriend() {
      let scrollBarFriend = document.querySelector(".scroll-bar-wap-friend");
      if (!scrollBarFriend) return;
      let offsetTopArr = [];
      let itemList = [...document.querySelectorAll(".scroll-bar-friend-item")];
      for (let i = 0; i < itemList.length; i++) {
        offsetTopArr.push(itemList[i].offsetTop);
      }
      this.offsetTopFriendArr = offsetTopArr;
      console.log(offsetTopArr);
      scrollBarFriend.addEventListener(
        "scroll",
        this.scrollBarWapFriendFn,
        false
      );
    },
    scrollBarWapFriendFn(e) {
      let scrollTop = e.target.scrollTop;
      if (scrollTop === 0) {
        this.fixedIndex = null;
        return;
      }
      for (let i = 0; i < this.offsetTopFriendArr.length; i++) {
        if (this.offsetTopFriendArr[i + 1]) {
          if (
            scrollTop > this.offsetTopFriendArr[i] &&
            scrollTop < this.offsetTopFriendArr[i + 1]
          ) {
            this.friendIndex = i;
            return;
          }
        } else {
          if (scrollTop > this.offsetTopFriendArr[i]) {
            this.friendIndex = i;
            return;
          }
        }
      }
    },
  },
  watch: {
    "searchModel.keyword"() {
      // this.searchModel.page = 1;
      // this.debounceGetProposal();
    },
  },
};
</script>
<style scoped lang="scss">
.share-container {
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
      padding: 16px;
    }
    .detail-personnel {
      display: flex;
      flex-direction: column;
      flex: 1;
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
    color: #1a1a1a;
    font-weight: 500;
    background-color: #f5f5f5;
    text-align: center;
    border-radius: 4px;
    &.main-time {
      background-color: #fff;
      margin: 16px 12px 0;
    }
  }
  .no-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
