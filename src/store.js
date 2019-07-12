import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: null,
    loading: true
  },

  getters: {
    myData: state => {
      return state.data
    },
    loading: state => {
      return state.loading
    }
  },
  mutations: {
    setData: (state, payload) => {
      state.data = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    }

  },
  actions: {
    async getData ({ commit }) {
      await Axios.get('/test.json')
        .then(response => {
          commit('setData', response.data)
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(err)
          throw err
        })
    }
  }
})
