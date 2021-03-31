import Vue from "vue";
import Vuex from "vuex";
import users from './modules/users'
import goodManage from './modules/goodManage'
import dotManage from './modules/dotManage'
import createPersistedState  from 'vuex-persistedstate'

Vue.use(Vuex)

const persistedState = createPersistedState({
  storage: window.localStorage,
  paths: [
    'users.userInfo',
    'dotManage.dots'
  ]
})

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  plugins: [persistedState],
  modules: {
    users,
    goodManage,
    dotManage
  }
});
