export const Player = {
  state: {
    currentPlayData: {}, // 当前画布操作的数据
    // eslint-disable-next-line
    bookData: [], // 绘本书籍的数据 一般是一个集合 每个元素是一个对象，是当前页面的数据信息
    page: 0 // 当前页码
  },
  mutations: {
    // 初始化播放器书籍的参数
    initBookDataOfPlayer (state, data) {
      state.bookData = data
      this.commit('setCurrentEditData', data[0])
    },
    /* 设置当前画布的数据信息 */
    setCurrentPlayData (state, data) {
      state.currentPlayData = data
    },
    setCurrentPlayPage (state, data = 0) {
      state.page = data
      this.commit('setCurrentPlayData', state.bookData[data])
    }
  }
}
