import Drawer from './drawerTools'
import {generateId} from './Utils.js'
import dataUtils from './utils_mcdata'
import Bus from '../../components/Bus'

// 默认数据
/* const containerTpl = {
  '000001': {
    id: '000001', // id标识
    type: 0, // 组件类型  0-空组件
    alisa: 'ASSET_CONTAINER',
    previwer: '', // 预览图片地址
    template: `<div class='asset-continer__root'></div>`, // html字符串
    style: {
      root: { // 限用属性【宽高、位置、边框、背景颜色】
        width: '800px',
        height: '1300px',
        'backgroundColor': 'rgba(255, 255, 255, 0.5)',
        transform: 'scaleX(1)',
        zIndex: 1
      }
    }, // style 样式对象
    prev: null,
    next: null,
    parent: null,
    children: null
  }
} */

// 工具方法
const Utils = {
  getFontBlockHeight: (function () {
    let $fontRuler

    return data => {
      let lineHeight
      let fontSize
      let letterSpacing
      let retHeight
      let cssTxt

      fontSize = data.style.content.fontSize
      letterSpacing = data.style.content.letterSpacing
      lineHeight = data.style.content.lineHeight

      cssTxt = {
        width: data.style.root.width,
        fontSize: fontSize,
        letterSpacing: letterSpacing,
        lineHeight: lineHeight,
        opacity: 0,
        wordWrap: 'break-word',
        wordBreak: 'break-all'
      }

      if ($fontRuler) {
        $fontRuler.css(cssTxt).html(data.content).show()
      } else {
        $fontRuler = $('<div/>').css(cssTxt).html(data.content)
        $fontRuler.appendTo('body')
      }
      retHeight = $fontRuler.height()
      console.log(retHeight)
      $fontRuler.hide()
      return retHeight
    }
  })(),
  getElementRatio: (function () {
    let ratioCache = {}

    return data => {
      if (!ratioCache[data.id]) {
        switch (data.alisa) {
          case 'ASSET_IMAGE':
            let offset

            offset = $('#' + data.id + ' img').offset()
            ratioCache[data.id] = offset.width / offset.height
            break
        }
      }
      return ratioCache[data.id]
    }
  })()
}
// 组件宽高改变方法的hanlder
const ResizeHandler = {
  ASSET_FONT (data, ret) {
    let retHeight

    // 根据虚拟dom点计算实际的高度适应计算
    retHeight = Utils.getFontBlockHeight(ret)
    ret.style.content.height = retHeight + 'px'
    Drawer.updataAsset('#' + ret.id, {'height': retHeight + 'px'}, undefined, true)
  },
  ASSET_IMAGE (data, ret) {
    let width
    let height

    // 借助工具方法获取图片的tatio，保证容器按照一定的宽高比进行缩放
    width = parseFloat(ret.style.root.width, 10)
    height = parseFloat(ret.style.root.height, 10)
    if (data.width) {
      height = ret.style.root.height = width / Utils.getElementRatio(ret) + 'px'
      Drawer.updataAsset('#' + ret.id, {'height': height + 'px'}, undefined, true)
    }
    if (data.height) {
      width = ret.style.root.width = height * Utils.getElementRatio(ret) + 'px'
      Drawer.updataAsset('#' + ret.id, {'width': width + 'px'}, undefined, true)
    }
  },
  ASSET_SHAPE (data, ret) {
  /* --------------------------------------------------------
    |            |    width/height   |     border*Width     |
    ---------------------------------------------------------
    |    root    | 直接设置传入值      |  忽略                |
    ---------------------------------------------------------
    |   content  |  传入值减去边框计算 |   直接设置，更新宽高   |
    ---------------------------------------------------------
  */
    let bwl = parseFloat(ret.style.content.borderLeftWidth, 10)
    let bwr = parseFloat(ret.style.content.borderRightWidth, 10)
    let bwt = parseFloat(ret.style.content.borderTopWidth, 10)
    let bwb = parseFloat(ret.style.content.borderBottomWidth, 10)
    let rootw
    let rooth
    let contentw
    let contenth

    if (data.width || data.height) {
      rootw = parseFloat(ret.style.root.width, 10) + 'px'
      rooth = parseFloat(ret.style.root.height, 10) + 'px'
      Drawer.updataAsset('#' + ret.id, {
        width: rootw,
        height: rooth
      }, undefined, true)
    }

    contentw = parseFloat(ret.style.root.width, 10) - bwl - bwr
    contenth = parseFloat(ret.style.root.height, 10) - bwt - bwb
    contentw = Math.max(contentw, 0)
    contenth = Math.max(contenth, 0)
    ret.style.content.width = contentw + 'px'
    ret.style.content.height = contenth + 'px'

    Drawer.updataAsset('#' + ret.id + ' .asset-shape__content', {
      width: contentw + 'px',
      height: contenth + 'px'
    }, undefined, true)
  }
}
// 组件插入方法
const InsertByOne = (gather, data, _self, isCombined) => {
  let item = _.cloneDeep(data)
  let nId = generateId('ID_')
  let parentId

  // 创建唯一的id标识
  item.id = nId
  dataUtils.updateId(gather, data.id, nId)

  if (isCombined) {
    parentId = item.parent
  } else {
    parentId = _self.root
  }
  dataUtils.pushChild(_self.assets, parentId, item, function (parent, item) {
    Drawer.appendAsset(item, isCombined)
  }, function (parent, target, prev) {
    // prev && _self.$set(_self.assets, prev.id, prev) // 不需要更新双向绑定数据
    prev && (_self.assets[prev.id] = prev)
    // _self.$set(_self.assets, target.id, target)
    _self.assets[target.id] = target

    // 更改定位，默认添加到画板正中心
    _self.assets[target.id].style.root.left = parseFloat(_self.assets[_self.root].style.root.width, 10) / 2 - parseFloat(_self.assets[target.id].style.root.width, 10) / 2 + 'px'
    _self.assets[target.id].style.root.top = parseFloat(_self.assets[_self.root].style.root.height, 10) / 2 - parseFloat(_self.assets[target.id].style.root.height, 10) / 2 + 'px'
    if (target.prev) {
      _self.assets[target.id].style.root.zIndex = _self.assets[target.prev].style.root.zIndex + 1
    } else {
      _self.assets[target.id].style.root.zIndex = parent.style.root.zIndex + 1
    }
  })
}

// vue $bus 事件处理方法集合
export const busEmiter = {
  /*
   * 组件添加到画布处理方式
   * emiter：组件列表点击是触发
   */
  initAssets (data) {
    let _self = this

    function librateChild (cdata, item, id) {
      dataUtils.everyChild(cdata, id, (c, cid) => {
        InsertByOne.call(_self, cdata, c, _self, true)
        if (dataUtils.hasChild(c)) {
          librateChild.call(_self, cdata, c, id)
        }
      })
    }

    // 需要判断data是不是包含子组件的数据
    dataUtils.forEach(data, (item) => {
      InsertByOne.call(_self, data, item, _self)
      if (dataUtils.hasChild(item)) {
        // 进度循环方法
        librateChild.call(_self, data, item, item.id)
      }
    })
  },
  /*
   * 画布中组件被选中
   * emiter：画布中组件的click
   */
  assetGetSelected (data) {
    let ret
    let _self = this

    // 改变的是传给属性面板的数据，与是否显示
    if (data) {
      ret = _self.assets[data.id]
      _self.$store.commit('setAttributeData', ret)
    } else {
      _self.$store.commit('setAttributeData', _self.assets[_self.root])
    }
  },
  /*
   * 画布中组件被拖拽改变大小
   * emiter：drawerTool emit，仅可修改宽度，高度根据内容自适应
   */
  assetResizeByDrag (data) {
    let ret
    let _self = this

    ret = _self.assets[data.id]
    data.width && (ret.style.root.width = data.width / _self.scale + 'px')
    data.height && (ret.style.root.height = data.height / _self.scale + 'px')

    try {
      ResizeHandler[ret.alisa].call(this, data, ret)
    } catch (e) {
      console.log(ret.alisa + ' has no resize handler')
    }

    this.$store.commit('setAttributeData', ret)
  },
  /*
   * 画布中组件组件被拖拽移动
   * emiter：drawerTool emit
   */
  assetMove (data) {
    /* 减少交互耗能，只在防止的时候通知最终数据 */
    let copy
    let ret
    let _self = this

    ret = _self.assets[data.id]
    copy = ret
    copy.style.root.left = data.left / _self.scale + 'px'
    copy.style.root.top = data.top / _self.scale + 'px'
  },
  /*
   * 画布中文字组件文本被编辑
   * emiter：drawerTool emit
   */
  assetTxtChange (data) {
    let ret
    let $dom
    let _self = this

    ret = _self.assets[data.id]

    ret.content = data.text
    $dom = Drawer.updataAsset('#' + ret.id + ' .asset-font__content', 'text', data.text, true)
    // 获取现在文字容器的高度，给最外层容器
    ret.style.root.height = $dom.offset().height + 'px'
    $dom = null
  },
  /*
   * 画布中组件被从画布移除
   * emiter：公用控制面板的删除按钮
   */
  assetOprateDelete () {
    let _self = this
    let id = this.currentData.id

    dataUtils.delete(_self.assets, id, function () {
      // dom操作
      if (id) {
        Drawer.removeAsset('#' + id) // dom处理
      } else {
        Drawer.removeAsset('.asset-continer__root') // dom处理
      }
    }, function (target, prev, next) {
      if (id) {
        if (prev) {
          _self.$set(_self.assets, prev.id, prev)
        }
        if (next) {
          _self.$set(_self.assets, next.id, next)
        }
        _self.$delete(_self.assets, target.id)
      } else {
        let container = _.cloneDeep(_self.assets[_self.root])

        _self.assets = {
          'root': container
        }
      }
      _self.$store.commit('setAttributeData', _self.assets[_self.root])
    })

    /* 通知属性面板没有选中元素了 */
    _self.$store.commit('setAttributeData', _self.assets[_self.root])
  },
  /*
   * 画布中当前选中组件被复制
   * emiter：公用控制面板的复制按钮
   */
  assetOprateCopy () {
    let id = this.currentData.id
    let target = _.cloneDeep(this.assets[id])
    let _self = this

    // 包装数据
    target.id = generateId('ID_')
    target.style.root.left = parseFloat(target.style.root.left, 10) + 20 + 'px'
    target.style.root.top = parseFloat(target.style.root.top, 10) + 20 + 'px'
    target.style.root.zIndex = target.style.root.zIndex + 1

    dataUtils.pushChild(_self.assets, _self.root, target, function () {
      // dom操作
      Drawer.appendAsset(target).click()
    }, function (parent, target, prev) {
      if (prev) {
        _self.$set(_self.assets, prev.id, prev)
      }
      _self.$set(_self.assets, parent.id, parent)
      _self.$set(_self.assets, target.id, target)
      // 选中新添加的元素进行编辑
      _self.$nextTick(function () {
        Bus.$emit('assetsConfigInit', target)
        _self.$store.commit('setAttributeData', target)
      })
    })

    /* 通知属性面板没有选中元素了 */
    _self.$store.commit('setAttributeData', _self.assets[_self.root])
  },
  /*
   * 画布中当前选中组件组件层级改变
   * emiter：公用控制面板的置顶置底按钮
   */
  assetOprateLevel (step) {
    let _self = this
    let copy = _.cloneDeep(_self.assets[this.currentData.id])
    let target
    let lev

    step = step || 1
    if (step > 0) {
      target = copy.next || copy.prev
    } else {
      target = copy.prev || copy.next
    }
    if (!target || target === 'root') {
      return false
    }
    lev = _self.assets[target].style.root.zIndex + step
    lev = Math.max(lev, 1)
    copy.style.root.zIndex = lev
    _self.$set(_self.assets, copy.id, copy)
    Drawer.updataAsset('#' + copy.id, 'zIndex', lev, true)
  },
  /*
   * 画布中当前选中文字组件样式被更新
   * emiter：公用控制面板的置顶置底按钮
   */
  assetTxtModifyed (data) {
    let _self = this
    let specials = ['fontSize', 'letterSpacing', 'lineHeight']

    /* 如果收到了key，那么只更新相关的值 */
    if (data.key) {
      let copy = _.cloneDeep(_self.assets[data.id])
      let retHeight

      copy.style.content[data.key] = data.value
      if (specials.indexOf(data.key) >= 0) {
        retHeight = Utils.getFontBlockHeight(copy)
        copy.style.root.height = parseFloat(copy.style.root.height, 10) + 'px'
        Drawer.updataAsset('#' + data.id, 'height', retHeight + 'px', true)
      }
      Drawer.updataAsset('#' + data.id + ' .asset-font__content', data.key, data.value, true)
      _self.$set(_self.assets, data.id, copy)
      /* Bus.$emit('assetsConfigInit', copy) */
      _self.$store.commit('setAttributeData', copy)
      console.warn('recive attribute modify from panel control for font: ' + data.key + '： ' + data.value)
    }
  },
  /*
  * 画布中当前选中文字组件长宽兑换方法触发
  * emiter：属性调节面板
  */
  assetTxtResize (id) {
    let _self = this
    let copy = _.cloneDeep(_self.assets[id])
    let style = copy.style.root
    let width = style.width
    let height

    // 替换宽高值
    width = style.width = style.height
    style.height = height = Utils.getFontBlockHeight(copy) + 'px'

    /* copy.style.root.width = height
    copy.style.root.height = width */
    _self.$set(_self.assets, id, copy)
    /* Bus.$emit('assetsConfigInit', copy) */
    _self.$store.commit('setAttributeData', copy)
    Drawer.updataAsset('#' + id, {
      width: width,
      height: height
    }).updataAsset('#' + id)
  },
  /*
  * 画布中当前选中图片组件样式被更新
  * emiter：属性调节面板
  */
  assetImgModifyed (data) {
    let _self = this

    /* 如果收到了key，那么只更新相关的值 */
    if (data.key) {
      let copy = _.cloneDeep(_self.assets[data.id])

      if (data.key === 'src') {
        copy.content = data.value
        Drawer.updataAsset('#' + data.id + ' .asset-image__content', 'src', data.value, true)
      } else {
        copy.style.content[data.key] = data.value
        Drawer.updataAsset('#' + data.id + ' .asset-image__content', data.key, data.value, true)
      }
      _self.$set(_self.assets, data.id, copy)
      /* Bus.$emit('assetsConfigInit', copy) */
      _self.$store.commit('setAttributeData', copy)
      console.warn('recive attribute modify from panel control for image: ' + data.key + '： ' + data.value)
    }
  },
  /*
  * 图片样式被更新
  * emiter：属性调节面板
  */
  canvasModifyed (data) {
    let _self = this

    /* 如果收到了key，那么只更新相关的值 */
    if (data.key) {
      let copy = _.cloneDeep(_self.assets[data.id])
      let scale

      copy.style.root[data.key] = data.value
      Drawer.updataAsset('.drawer-canvas__root', data.key, data.value, true)

      _self.$set(_self.assets, data.id, copy)
      /* Bus.$emit('assetsConfigInit', copy) */
      _self.$store.commit('setAttributeData', copy)
      if (data.key === 'width' || data.key === 'height') {
        scale = Drawer.update(_self.assets, _self.root)
        _self.$store.commit('setCanvasScale', scale)
      }
      console.warn('recive attribute modify from panel control for canvas: ' + data.key + '： ' + data.value)
    }
  },
  /*
  * 画布中当前选中形状组件样式被更新
  * emiter：属性调节面板
  */
  assetShapeModifyed (data) {
    let copy
    let _self = this
    let args = {}
    let handlerCallers = ['width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth']

    /* 如果收到了key，那么只更新相关的值 */
    if (data.key) {
      copy = _.cloneDeep(_self.assets[data.id])
      if (handlerCallers.indexOf(data.key) >= 0) {
        copy.style.root[data.key] = data.value
        copy.style.content[data.key] = data.value
        if (!(data.key === 'width' || data.key === 'height')) {
          Drawer.updataAsset('#' + data.id + ' .asset-shape__content', data.key, data.value, true)
        }
        args.id = data.id
        args[data.key] = data.value
        ResizeHandler.ASSET_SHAPE(args, copy)
      } else {
        copy.style.content[data.key] = data.value
        Drawer.updataAsset('#' + data.id + ' .asset-shape__content', data.key, data.value, true)
      }

      _self.$set(_self.assets, data.id, copy)
      /* Bus.$emit('assetsConfigInit', copy) */
      _self.$store.commit('setAttributeData', copy)
      console.warn('recive attribute modify from panel control for shape: ' + data.key + '： ' + data.value)
    }
  }
}
