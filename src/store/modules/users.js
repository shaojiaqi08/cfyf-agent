import { UPDATE_USER_INFO } from '../mutation-types'

export default {
  namespaced: true,
  state: {
    userInfo: {}
  },
  mutations: {
    [UPDATE_USER_INFO](state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    updateUserInfo({ commit }, userInfo) {
      commit(UPDATE_USER_INFO, userInfo)
    }
  }
}