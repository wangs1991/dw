import Vue from 'vue'
import Vuex from 'vuex'
import {Editor} from './editorState'
import {Player} from './playerState'

Vue.use(Vuex)

/* eslint-disable */
export default new Vuex.Store({
  state: {
    isLoading: false
  },
  mutations: {
    loading (state, data = false) {
      state.isLoading = data
    }
  },
  actions: {},
  modules: {
    Editor,
    Player
  }
})
