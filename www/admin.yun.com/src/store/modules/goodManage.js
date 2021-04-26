const UPDATE_PRODUCT_ID = 'UPDATE_PRODUCT_ID'

export default {
  namespaced: true,
  state: {
    productId: null
  },
  mutations: {
    [UPDATE_PRODUCT_ID](state, id) {
      state.productId = id
    }
  },
  actions: {
    updateProductId({ commit }, id) {
      commit(UPDATE_PRODUCT_ID, id)
    }
  }
}
