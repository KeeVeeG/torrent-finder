import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    domain:
      process.env.NODE_ENV === 'production'
        ? 'https://young-brushlands-59138.herokuapp.com/'
        : 'http://localhost:80/',
  },
  mutations: {
    SetLoadingStatus(state, bool) {
      state.loading = bool
    },
  },
})
