const UPDATE_ANNOUNCEMENT_LIST = 'UPDATE_ANNOUNCEMENT_LIST'

export default {
    namespace: 'announcement',
    state: {
        announcementList: []
    },
    mutations: {
        [UPDATE_ANNOUNCEMENT_LIST](state, list) {
            state.announcementList = list
        }
    },
    actions({ commit }, list) {
        commit(UPDATE_ANNOUNCEMENT_LIST, list)
    }
}
