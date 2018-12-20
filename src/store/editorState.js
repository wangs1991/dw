import dataUtils from '../assets/js/utils_mcdata'
import {Storage, generateId} from '../assets/js/Utils'

// 画布默认数据
const generateTpl = (flag) => {
  let id = generateId('ROOT_')
  let ret = {}

  ret[id] = {
    'id': id,
    'type': 0,
    'alisa': flag === 0 ? 'ASSET_CONTAINER' : 'ASSET_COMBINE',
    'previwer': '',
    'template': '<div class=\'asset-continer__root\'></div>',
    'style': {
      'root': {
        'width': '400px',
        'height': '400px',
        'backgroundColor': 'rgba(255, 255, 255, 0.5)',
        'transform': 'scaleX(1)',
        'zIndex': 1
      }
    },
    'prev': null,
    'next': null,
    'parent': null,
    'children': []
  }
  return ret
}
// 数据验证转化的正则
// "([_\-a-zA-Z\d#\.\(\),\s]*)"

export const Editor = {
  state: {
    editType: 0, // 当前编辑器编辑的类型 电子绘本: 0; 组件元素: 1
    currentEditData: {}, // 当前画布操作的数据
    // eslint-disable-next-line
    bookData: [], // 绘本书籍的数据 一般是一个集合 每个元素是一个对象，是当前页面的数据信息
    attributeData: {}, // 属性面板空的组件属性对象
    canvasScale: 1, // 画布缩放的控制属性
    resizeStamp: '', // 窗体resize时通知底部地图的中间变量
    styleChooserFlag: true,
    page: 0,
    bookBaseConfig: {
      style: 0,
      series: 0,
      dataPath: ''
    }, // 当前选中的风格系列数据
    assetsSubState: 'close',
    loginRole: 'common',
    isPublish: false,
    cacheData: {
      pageTpl: {}
    } // 全局数据缓存
  },
  mutations: {
    // 初始化书籍的参数
    initBookData (state, data) {
      state.bookData = data
      this.commit('setCurrentPage', 0)
    },
    // 更新某一页的数据
    updatePageData (state, data = {page: 0, data: {}}) {
      state.bookData.splice(data.page, 1, data.data)
      this.commit('setCurrentEditData', data.data)
    },
    // 设置当前编辑的页数
    setCurrentPage (state, data) {
      state.page = data
      this.commit('setCurrentEditData', state.bookData[data])
    },
    // 删除当前页面
    deletePage (state) {
      let page

      page = --state.page
      page = page < 0 ? 0 : page
      state.bookData.splice(state.page, 1)
      this.commit('setCurrentEditData', page)
    },
    // 添加页面
    insertPage (state, data = 0) {
      state.bookData.splice(data, 0, _.cloneDeep(state.bookData[data]))
      this.commit('setCurrentPage', ++data)
    },
    // 设置当前的编辑器编辑内容
    updateEditType (state, data = 0) {
      // step 1. 缓存当前数据
      Storage.set('canvasData', state.bookData)
      // step 2. 改变当前的编辑类型
      state.editType = data
      // step 3. 根据类型的变化，来初始化当前处理数据
      this.commit('initBookData', [])
      this.commit('setCurrentEditData')
    },
    /* 设置当前画布的数据信息 */
    setCurrentEditData (state, data = generateTpl(state.editType)) {
      state.currentEditData = data
    },
    /* 设置当前属性面板显示的数据 */
    setAttributeData (state, data) {
      state.attributeData = data
    },
    /* 画板缩放控制 */
    setCanvasScale (state, scale) {
      state.canvasScale = scale
    },
    // 新增页面
    appendPage (state) {
      // 新增页面，目前逻辑是  接入空页面，只默认加入页面的尺寸和设置
      let data = _.cloneDeep(state.currentEditData)
      let ID = generateId('ROOT_')
      let ret = {}
      data = dataUtils.getHead(data)
      data = dataUtils.removeAllChildren(data)

      // 去除页面的音乐属性
      // eslint-disable-next-line
      delete(data.music)
      // eslint-disable-next-line
      delete(data.bgMusic)

      data.id = ID
      ret[ID] = data
      state.bookData.push(ret)
      this.commit('setCurrentPage', state.bookData.length - 1)
    },
    // 更新页面改变大小的时间戳标记
    refreshResizeStamp (state) {
      state.resizeStamp = +new Date()
    },
    // 改变控制风格选择框的标记
    updataStyleChooser (state, data = false) {
      state.styleChooserFlag = data
    },
    // 存储当前选中的风格数据
    updateCurrentBookConfData (state, data = {}) {
      var i

      for (i in data) {
        console.log(i, data[i])
        data.hasOwnProperty(i) && (state.bookBaseConfig[i] = data[i])
      }
    },
    // 二级组件列表的展开关闭状态
    upateAssetsSubState (state, data = 'close') {
      state.assetsSubState = data
    },
    // 设置编辑器的使用权限
    updateLoginRole (state, data = 'common') {
      state.loginRole = data
    },
    // 切换发布弹框
    tooglePublish (state, data = false) {
      state.isPublish = data
    },
    // 更新背景音乐
    updateBgMusic (state, data = {}) {
      let Page = state.bookData[0]
      let Head = dataUtils.getHead(Page)

      Head.bgMusic = data
      state.bookData.splice(0, 1, Page)
    },
    // 更新页面配音文件
    updatePageMusic (state, data = {}) {
      let ret = _.cloneDeep(state.currentEditData)
      let Head = dataUtils.getHead(ret)
      Head.music = data

      this.commit('updatePageData', {
        page: state.page,
        data: ret
      })
    },
    resetStore (state) {
      state.bookData = []
      state.currentEditData = {}
      state.editType = 0
      state.attributeData = {}
      state.canvasScale = 1
      state.styleChooserFlag = true
      state.page = 0
      state.bookBaseConfig = {
        style: 0,
        series: 0,
        dataPath: ''
      }
      state.assetsSubState = 'close'
      state.loginRole = 'common'
      state.cacheData = {
        pageTpl: {}
      } // 全局数据缓存
    }
  },
  actions: {}
}
