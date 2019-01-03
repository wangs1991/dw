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
      state.userData.id = data.id
      state.userData.name = data.name
    }
  },
  actions: {},
  modules: {
    Editor,
    Player
  }
})
