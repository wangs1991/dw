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
    bookData: [{'ROOT_ebafdcc3-7814-4ba4-bab7-36b59fba3825':{'id':'ROOT_ebafdcc3-7814-4ba4-bab7-36b59fba3825','type':0,'alisa':'ASSET_CONTAINER','previwer':'','template':"<div class='asset-continer__root'></div>",'style':{'root':{'width':'400px','height':'400px','backgroundColor':'rgba(255, 255, 255, 0.5)','transform':'scaleX(1)','zIndex':1}},'prev':null,'next':null,'parent':null,'children':['ID_7d9c1bf1-1b1a-491a-90fd-370d2b53e60d','ID_57a1a77d-812a-4fa5-9fa6-9058e1301742','ID_23a65149-ab40-46cb-8111-d511a067e39c']},'ID_7d9c1bf1-1b1a-491a-90fd-370d2b53e60d':{'id':'ID_7d9c1bf1-1b1a-491a-90fd-370d2b53e60d','type':1,'alisa':'ASSET_FONT','previwer':'','template':"<div class='asset-continer__root'>\n              <div class='asset-font__root'>\n                  <div class='asset-font__content'>双击修改文字</div>\n                </div>\n            </div>",'content':"HELLO 番茄号",'style':{'root':{'width':'100px','height':'18px','display':'inline-block','cursor':'move','position':'absolute','left':'135.21126760563382px','top':'281.13555908203125px','zIndex':3},'content':{'color':'#f00','fontFamily':'Microsoft YaHei UI','fontSize':'12px','lineHeight':'18px','letterSpacing':'0px','opacity':1}},'prev':null,'next':'ID_57a1a77d-812a-4fa5-9fa6-9058e1301742','parent':'ROOT_ebafdcc3-7814-4ba4-bab7-36b59fba3825','children':[]},'ID_57a1a77d-812a-4fa5-9fa6-9058e1301742':{'id':'ID_57a1a77d-812a-4fa5-9fa6-9058e1301742','type':2,'alisa':'ASSET_IMAGE','previwer':'','template':"<div class='asset-continer__root'>\n              <div class='asset-container__wraper'>\n                <div class='asset-image__root'>\n                  <div class='asset-image__content'>\n                    <img src='' alt='' style=\"width: 100%; display: block;\"/>\n                  </div>\n                </div>\n                </div>\n              </div>",'content':"../../static/images/default_img.jpg",'style':{'root':{'width':'118px','height':'85px','display':'inline-block','cursor':'move','position':'absolute','left':'65.64262282680458px','top':'251.16196753273547px','zIndex':2},'content':{'opacity':1}},'prev':'ID_7d9c1bf1-1b1a-491a-90fd-370d2b53e60d','next':'ID_23a65149-ab40-46cb-8111-d511a067e39c','parent':'ROOT_ebafdcc3-7814-4ba4-bab7-36b59fba3825','children':[]},'ID_23a65149-ab40-46cb-8111-d511a067e39c':{'id':'ID_23a65149-ab40-46cb-8111-d511a067e39c','type':3,'alisa':'ASSET_SHAPE','previwer':'','template':"<div class='asset-continer__root'>\n                <div class='asset-container__wraper'>\n                <div class='asset-shape__root'>\n                  <div class='asset-shape__content'></div>\n                </div>\n              </div>\n        </div>",'style':{'root':{'display':'inline-block','cursor':'move','width':'200px','height':'200px','position':'absolute','left':'24.647887323943664px','top':'54.225352112676056px','zIndex':1},'content':{'width':'190px','height':'190px','opacity':1,'backgroundColor':'rgba(0, 0, 0, 0.5)','borderTopWidth':'5px','borderRightWidth':'5px','borderBottomWidth':'5px','borderLeftWidth':'5px','borderTopColor':'#f0f','borderRightColor':'#f0f','borderBottomColor':'#f0f','borderLeftColor':'#f0f','borderStyle':'solid','borderTopLeftRadius':'10px','borderTopRightRadius':'4px','borderBottomLeftRadius':'10px','borderBottomRightRadius':'10px'}},'prev':'ID_57a1a77d-812a-4fa5-9fa6-9058e1301742','next':null,'parent':'ROOT_ebafdcc3-7814-4ba4-bab7-36b59fba3825','children':[]}}], // 绘本书籍的数据 一般是一个集合 每个元素是一个对象，是当前页面的数据信息
    attributeData: {}, // 属性面板空的组件属性对象
    canvasScale: 1, // 画布缩放的控制属性
    resizeStamp: '', // 窗体resize时通知底部地图的中间变量
    styleChooserFlag: true,
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
      data = dataUtils.removeAllChildren(data)

      state.bookData.push(data)
      state.currentEditData = data
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
    tooglePublish (state, data = false) {
      state.isPublish = data
    }
  },
  actions: {}
}
