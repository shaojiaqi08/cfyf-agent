import { UPDATE_USER_INFO, LOGIN_OUT, GETNOTIFICATION } from '../mutation-types'
import { getNotification } from '@/apis/modules/index'

export default {
  namespaced: true,
  state: {
    userInfo: {},
    notificationInfo: {}
  },
  mutations: {
    [UPDATE_USER_INFO](state, userInfo) {
      state.userInfo = userInfo
    },
    [LOGIN_OUT](state) {
      state.userInfo = {}
      localStorage.clear()
    },
    [GETNOTIFICATION](state, data) {
      state.notificationInfo = data
    }
  },
  actions: {
    updateUserInfo({ commit }, userInfo) {
      commit(UPDATE_USER_INFO, userInfo)
    },
    getNotification({ commit }) {
      getNotification().then(res => {
        commit(GETNOTIFICATION, res)
      })
    },
    logout({ commit }) {
      commit(LOGIN_OUT)
    }
  }
}
