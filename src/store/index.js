import Vue from 'vue'
import Vuex from 'vuex'
import {Editor} from './editorState'
import {Player} from './playerState'

Vue.use(Vuex)

/* eslint-disable */
export default new Vuex.Store({
  state: {
    isLoading: false,
    userData: {}
  },
  mutations: {
    loading (state, data = false) {
      state.isLoading = data
    },
    cacheUser (state, data = {}) {
      Vue.set(state.userData, 'id', data.id)
      Vue.set(state.userData, 'name', data.name)
      Vue.set(state.userData, 'avator', data.headimgUrl)
    }
  },
  actions: {},
  modules: {
    Editor,
    Player
  }
})
