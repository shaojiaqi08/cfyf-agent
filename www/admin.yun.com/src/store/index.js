import Vue from "vue";
import Vuex from "vuex";
import users from './modules/users'
import goodManage from './modules/goodManage'
import dotManage from './modules/dotManage'
import announcement from './modules/announcement'
import createPersistedState  from 'vuex-persistedstate'

Vue.use(Vuex)

const persistedState = createPersistedState({
  storage: window.localStorage,
  paths: [
    'users.userInfo',
    'dotManage.dots',
    'announcement.announcementList'
  ]
})

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  plugins: [persistedState],
  modules: {
    users, // 用户信息
    goodManage, // 商品管理
    dotManage, // 红点
    announcement // 公告
  }
});
