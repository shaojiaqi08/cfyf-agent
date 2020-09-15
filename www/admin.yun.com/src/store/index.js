import Vue from "vue";
import Vuex from "vuex";
import users from './modules/users'
import goodManage from './modules/goodManage'
import createPersistedState  from 'vuex-persistedstate'

Vue.use(Vuex)

const persistedState = createPersistedState({
  storage: window.localStorage,
  paths: [
    'users.userInfo'
  ]
})

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  plugins: [persistedState],
  modules: {
    users,
    goodManage
  }
});
