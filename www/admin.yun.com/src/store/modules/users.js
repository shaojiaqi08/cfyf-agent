import { UPDATE_USER_INFO, LOGIN_OUT, GETNOTIFICATION, SETREADPERMISSION,  CLEARREADPERMISSION } from '../mutation-types'
import { getNotification } from '@/apis/modules/index'

export default {
  namespaced: true,
  state: {
    userInfo: {},
    readPermission: {},
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
    },
    [SETREADPERMISSION](state, [ key, value ]) {
      state.readPermission[key] = value
    },
    [CLEARREADPERMISSION](state) {
      state.readPermission = {}
    }
  },
  actions: {
    clearReadPermission({ commit }) {
      commit(CLEARREADPERMISSION)
    },
    setReadPermission({ commit }, data) {
      commit(SETREADPERMISSION, data)
    },
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
