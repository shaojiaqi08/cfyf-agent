import { UPDATE_USER_INFO, LOGIN_OUT } from '../mutation-types'

export default {
  namespaced: true,
  state: {
    userInfo: {}
  },
  mutations: {
    [UPDATE_USER_INFO](state, userInfo) {
      state.userInfo = userInfo
    },
    [LOGIN_OUT](state) {
      state.userInfo = {}
    }
  },
  actions: {
    updateUserInfo({ commit }, userInfo) {
      commit(UPDATE_USER_INFO, userInfo)
    },
    logout({ commit }) {
      commit(LOGIN_OUT)
    }
  }
}