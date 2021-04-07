const UPDATE_DOTS = 'UPDATE_DOTS'

export default {
    namespaced: true,
    state: {
        dots: {}
    },
    mutations: {
        [UPDATE_DOTS](state, dots) {
            state.dots = dots
        }
    },
    actions: {
        updateDots({ commit }, dots) {
            commit(UPDATE_DOTS, dots)
        }
    }
}
