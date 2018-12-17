/**
 * Created by vonsh on 2018/10/15
 */
import html2canvas from 'html2canvas'
import dataUtils from './utils_mcdata'

let Drawer = function (options) {
  this.previewCache = []
  this.canvas = null
  this.winFrame = null
  this.scale = 1
  this.config = {
    type: 'editor',
    watcher: null,
    canvasSelector: 'drawer-canvas__root'
  }
  this.scaleMap = {
    width: true,
    height: true,
    borderWidth: true,
    borderTopWidth: true,
    borderRightWidth: true,
    borderBottomWidth: true,
    borderLeftWidth: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderBottomLeftRadius: true,
    borderBottomRightRadius: true,
    fontSize: true,
    lineHeight: true,
    letterSpacing: true,
    left: true,
    top: true
  }
  this.handlers = {
    'ASSET_IMAGE': function (root, item) {
      return this.scale
    }
  }
}

Drawer.prototype = {
  constructor: 'Drawer',
  init (config) {
    _.extend(this.config, config)
    this.canvas = $(this.config.canvasSelector)
    this.winFrame = $(this.config.windowSelector)
    // this.setCanvas()
    if (this.config.type === 'editor') {
      this.bindEvt()
    }
  },
  parseHtml (assets) {
    // 获取模板字符
    let template = assets.template
    // 依据模板字符创建dom元素
    let $dom = $('<div/>')
    let root
    let content

    root = this.computeScaledStyle(assets.style.root)
    content = this.computeScaledStyle(assets.style.content)

    $dom.html(template)
    // 分别应用样式
    $dom.find('.asset-continer__root').css(root).attr('id', assets.id).addClass(assets.alisa).attr('data-type', assets.alisa).attr('data-parent', assets.parent)
      .find('[class^=asset-][class$=__content]').css(content)

    // 如果是图片需要替换路径
    if (assets.alisa === 'ASSET_IMAGE') {
      $dom.find('img').attr('src', assets.content)
    }
    // 如果是文字需要把内容加进去
    if (assets.alisa === 'ASSET_FONT') {
      $dom.find('.asset-font__content').html(assets.content)
    }

    template = $dom.html()
    $dom = null
    return template
  },
  appendAsset (data, isCombined) {
    var template = this.parseHtml(data)
    var $template = $(template)
    var $container

    if (isCombined) {
      $container = $('#' + data.parent)
    } else {
      $container = this.canvas
    }
    $template = $template.attr('id', data.id)
    if (this.config.type === 'editor') {
      this.appendEditHandler().forEach(n => {
        $template.append(n)
      })
    }
    $container.append($template)
    return $template
  },
  appendEditHandler () {
    let $resizer = $('<div/>', {
      'class': 'resize-handler'
    })
    let $rotater = $('<div/>', {
      'class': 'rotate-handler edf-icons'
    })

    return [$resizer, $rotater]
  },
  updataAsset: (function () {
    let cache = {}
    function applyUpdate (selector, data) {
      let $dom = $(selector)

      if (data.text) {
        let height

        $dom.html(data.text)
        // 更新父级容器的高度
        height = $dom.offset().height + 'px'
        $dom.parents('.asset-continer__root').css('height', height)
      }
      if (data.src) {
        $dom.find('img').attr('src', data.src)
      }
      data = this.computeScaledStyle(data)
      $dom.css(data)
      cache[selector] = {}
      $dom = null
    }
    return function (selector, key, value, force) {
      cache[selector] = cache[selector] || {}
      if (value === undefined) { // 传入的样式是对象
        let i
        for (i in key) {
          cache[selector][i] = key[i]
        }
      }
      if (key === undefined && value === undefined) { // 只传入选择器，应用样式更新
        applyUpdate.call(this, selector, cache[selector])
      }
      if (key && value) { // 单个样式更新
        cache[selector][key] = value
      }
      if (force) { // 单个样式直接更新
        applyUpdate.call(this, selector, cache[selector])
      }
      return this
    }
  })(),
  removeAsset (selector) {
    if (selector) {
      this.canvas.find(selector).remove()
    }
  },
  clearCanvas () {
    this.canvas.html('')
  },
  preview (asset, config) {
    this.previewCache.push({
      asset,
      config
    })

    return this.executePreview()
  },
  executePreview () {
    let data = this.previewCache.shift()
    let template = this.parseHtml(data.asset)
    let $dom = $('<div/>')
    let config = {}
    $dom.css({position: 'relative', 'zIndex': -10})
    $dom.html(template)
    $('body').append($dom)

    if (data.asset.style.root.width) {
      config.width = parseFloat(data.asset.style.root.width, 10)
    }

    if (data.asset.style.root.height) {
      config.width = parseFloat(data.asset.style.root.height, 10)
    }

    return new Promise((resolve, reject) => {
      _.delay(function () {
        html2canvas($dom[0], config).then(canvas => {
          $dom.remove()
          $dom = null
          resolve(canvas.toDataURL())
        })
      }, 5000)
    })
  },
  bindEvt () {
    // 绑定所有组件的拖动事件 + // 绑定所有组件的拖拽改变大小事件
    this.bindDrag()
    // 绑定所有的组件选中状态
    this.bindClick2Select()
    // 绑定文字组件双击编辑
    this.bindDBclickEdit()
    // 绑定图片组件双击替换资源
    this.bindDBclickReplace()
  },
  bindDrag () {
    let isDown = false // 鼠标是否在按下，判断拖拽resize用
    let $assets
    let domBodundary
    let gap
    let __self = this
    let ret
    let isMoved = false
    let isEdit = false
    let isSelected = false
    let isResized = false
    let assetType
    let evtType = 'drag' // v-resize、 h-resize、 rotate、 drag
    let winBodundary
    let $parentGather
    // let originPot
    let evtHanlders = {
      'drag': {
        handler (id, e) {
          ret = {
            id: id
          }
          ret.top = (__self.canvasBoundary.top - winBodundary.top) > 0 ? (e.pageY - __self.canvasBoundary.top - gap.top) : (e.pageY - gap.top - __self.canvasBoundary.top)
          ret.left = (__self.canvasBoundary.left - winBodundary.left) > 0 ? (e.pageX - __self.canvasBoundary.left - gap.left) : (e.pageX - gap.left - __self.canvasBoundary.left)

          // 判断边界
          /* if (ret.top + domBodundary.height > __self.canvasBoundary.height || // 超出下线
            ret.left < 0 || // 超出左线
            ret.left + domBodundary.width > __self.canvasBoundary.width || // 超出右线
            ret.top < 0) { // 超出上限
            isDown = false
            return false
          } */
          $assets.css(ret)
          isMoved = true
          console.log('set assets style by drag')
          return false
        }
      },
      'h-resize': {
        handler (id, e) {
          ret = {
            id: id,
            width: e.pageX - domBodundary.left + (domBodundary.width - gap.left)
          }
          if (ret.height <= 6) {
            return false
          }
          $assets.css(ret)
          isResized = true
        }
      },
      'v-resize': {
        handler (id, e) {
          ret = {
            id: id,
            height: e.pageY - domBodundary.top + (domBodundary.height - gap.top)
          }
          if (ret.width <= 6) {
            return false
          }
          $assets.css(ret)
          isResized = true
        }
      },
      'vh-resize': {
        handler (id, e) {
          ret = {
            id: id,
            width: e.pageX - domBodundary.left + (domBodundary.width - gap.left),
            height: e.pageY - domBodundary.top + (domBodundary.height - gap.top)
          }
          if (ret.height <= 6 || ret.width <= 6) {
            return false
          }
          $assets.css(ret)
          isResized = true
        }
      },
      'rotate': {
        handler (id, e) {
          let transform

          ret = {
            id: id
          }
          transform = $assets.css('transform')
          transform = transform === 'none' ? '' : transform
          ret.transform = transform + ' rotate(8deg)'
          $assets.css(ret)
        }
      }
    }
    // 通知界面渲染变化的方法 100s防抖，延时间隔尾执行
    let mouseUpHandler = _.debounce(() => {
      if (__self.config.watcher) {
        if (isMoved) {
          __self.config.watcher.$emit('assetMove', ret)
          console.log('trigger watcher listener __ update positon')
          isMoved = false
        }
        if (isResized) {
          __self.config.watcher.$emit('assetResizeByDrag', ret)
          console.log('trigger watcher listener __ update size')
          isResized = false
        }
      }
    }, 100, {
      'leading': false,
      'maxWait': 10,
      'trailing': true
    })

    this.canvas.delegate('.asset-continer__root', 'mousedown', function (e) {
      e.stopPropagation()
      e.preventDefault()
      // 校准事件对象一定在root元素上
      if ($(e.target).hasClass('asset-continer__root')) {
        $assets = $(e.target)
      } else {
        $assets = $(e.target).closest('.asset-continer__root') // 最近一级匹配父级元素
      }
      // 获取当前状态下画布的边界值和当前操作元素的边界信息
      domBodundary = $assets.offset()

      $parentGather = $assets.closest('.ASSET_COMBINE')
      if ($parentGather && $parentGather.length > 0 && $assets.attr('id') !== $parentGather.attr('id')) {
        __self.canvasBoundary = $parentGather.offset()
      }
      winBodundary = __self.winFrame.offset()

      // 获取当前鼠标事件触发点距离当前元素左上各个边界的值
      gap = {
        left: e.pageX - domBodundary.left,
        top: e.pageY - domBodundary.top
      }

      // 重置各种状态值
      isDown = true // 鼠标组件按下
      isMoved = false // 当前组件未被移动过
      isResized = false // 当前组件宽高未发生改变
      evtType = 'drag' // 当前默认事件类型是拖拽事件
      // 判断是否在编辑状态
      isEdit = $assets.find('[class$=__content]').attr('contenteditable')
      // 判断元素是否在选中状态
      isSelected = $assets.hasClass('asset_selected')
      // 判断元素的类型值
      assetType = $assets.attr('data-type')

      if (!isSelected) {
        return false // 如果当前组件未被选中，此时的点击拖拽只能触发drag事件
      }

      // 根据组件类型来区分各个可操作热区
      switch (assetType) {
        case 'ASSET_FONT':
          // 可触发的热区只有右边来改变宽度
          if (domBodundary.width - gap.left < 8) {
            evtType = 'h-resize'
          }
          break
        case 'ASSET_IMAGE':
        case 'ASSET_SHAPE':
          // 可触发的热区有右边和底边来改变宽高
          if (domBodundary.width - gap.left < 8) {
            evtType = 'h-resize'
          }
          if (domBodundary.height - gap.top < 8) {
            evtType = 'v-resize'
          }
          break
      }

      console.log('================' + evtType + '==================')
      // 判断鼠标落下区域，是否需要出发rotate事件 右下角 10 * 10 px区域
      // 右边框 改变宽度 h-resize
      /* if (domBodundary.width - gap.left < 8 && domBodundary.height - gap.top > 8) {
        evtType = 'h-resize'
      }
      // 底边框 改变高度 v-resize
      if (domBodundary.width - gap.left > 8 && domBodundary.height - gap.top < 8) {
        evtType = 'v-resize'
      }
      if (domBodundary.width - gap.left <= 12 && domBodundary.height - gap.top <= 12) {
        evtType = 'vh-resize'
        originPot = {
          x: domBodundary.left + domBodundary.width,
          y: domBodundary.top + domBodundary.height
        }

        console.log(originPot)
      } */
    })

    $('body').on('mouseup', function (e) {
      $assets = null
      isDown = false
      $parentGather = null
      __self.canvasBoundary = __self.canvas.offset()
      // 移动元素结束时要通知结果给 vue-canvas
      // mouseUpHandler()
    })

    $('body').on('mousemove', function (e) {
      if (isDown && !isEdit) {
        let id = $assets.attr('id')

        evtHanlders[evtType].handler(id, e)

        mouseUpHandler()
      }
    })
  },
  bindDBclickEdit () {
    let timer = 0
    let $assets
    let __self = this

    this.canvas.delegate('.asset-font__content', 'click', function (e) {
      let ct = +new Date()

      if (ct - timer < 500) {
        // 触发了双击事件
        if ($(e.target).hasClass('asset-font__content')) {
          $assets = $(e.target)
        } else {
          $assets = $(e.target).parents('.asset-font__content')
        }
        $assets.attr('contenteditable', true).css({'cursor': 'text'}).focus()
      }
      timer = ct
    })
    this.canvas.delegate('[contenteditable=true]', 'blur', function (e) {
      let ret

      $assets.removeAttr('contenteditable').css({'cursor': 'move'})
      ret = $assets.html()

      if (__self.config.watcher) {
        __self.config.watcher.$emit('assetTxtChange', {
          id: $assets.parents('.asset-continer__root').attr('id'),
          text: ret
        })
        console.log('trigger watcher listener __ update text of font_asset')
      }

      $assets = null
    })
  },
  bindDBclickReplace () {
    let timer = 0
    let $assets

    // 阻止浏览器默认的图片拖拽效果
    $('body').delegate('img', 'mousedown', function (e) {
      e.preventDefault()
    })
    // 双击替换图片
    this.canvas.delegate('.asset-image__content', 'click', function (e) {
      let ct = +new Date()

      if (ct - timer < 500) {
        // 触发了双击事件
        if ($(e.target).hasClass('asset-image__content')) {
          $assets = $(e.target)
        } else {
          $assets = $(e.target).parents('.asset-image__content')
        }
        console.log('调取图片替换', $assets)
      }
      timer = ct
    })
  },
  bindClick2Select () {
    let $assets
    let __self = this
    let selectedId
    let id

    // 点击添加选中类
    this.canvas.delegate('.asset-continer__root', 'click', function (e) {
      if ($(e.target).hasClass('asset-continer__root')) {
        $assets = $(e.target)
      } else {
        $assets = $(e.target).closest('.asset-continer__root')
      }
      $('.asset_selected').removeClass('asset_selected')
      $assets.addClass('asset_selected')
      id = $assets.attr('id')
      if (selectedId !== id && __self.config.watcher) {
        __self.config.watcher.$emit('assetGetSelected', {
          id: id
        })
        selectedId = id
        console.log('trigger watcher listener __ select assets' + id)
      }
      e.stopPropagation()
    })
    /* 点击画布取消选择 */
    $('body').delegate(this.canvas.selector, 'click', function (e) {
      $('.asset-continer__root').removeClass('asset_selected')
      if (selectedId !== undefined && __self.config.watcher) {
        __self.config.watcher.$emit('assetGetSelected')
        selectedId = undefined
        console.log('trigger watcher listener __ select assets none')
      }
      e.stopPropagation()
    })
  },
  computedScale (data) {
    let bodyBoundary
    let ratio
    let canvas
    let cw
    let ch

    bodyBoundary = this.winFrame.offset() // 获取到显示窗口的大小信息
    ratio = bodyBoundary.width / bodyBoundary.height
    canvas = data.style.root
    cw = parseFloat(canvas.width, 10)
    ch = parseFloat(canvas.height, 10)

    if (cw / ch >= ratio) { // 如果内容很宽
      if (cw <= bodyBoundary.width) { // 宽度比容器小那么宽度就设置成和容器一样大
        this.scale = bodyBoundary.width / cw
      } else { // 如果宽度大于容器宽度，就把高度拉成和容器一样
        this.scale = (bodyBoundary.height - 60) / ch
      }
    } else { // 如果内容很高
      this.scale = (bodyBoundary.height - 60) / ch
    }
    this.scale = this.scale.toFixed(2)
    return (this.scale = Math.min(this.scale, 2))
  },
  computeScaledStyle (data, scale) {
    let ret = {}
    let useScale = scale || this.scale

    if (!data) {
      return false
    }
    for (var i in data) {
      if (this.scaleMap[i]) {
        ret[i] = parseFloat(data[i], 10) * useScale + 'px'
      } else {
        ret[i] = data[i]
      }
    }
    return ret
  },
  setCanvas (data, scale) {
    let left
    let top
    let bodyBoundary
    let ret

    if (scale) {
      /* 如果传入缩放参数直接按比例缩放canvas */
      this.scale = scale
    } else if (Object.prototype.toString.call(data).indexOf('Object') > 0) {
      // 如果未传入缩放参数，需要根据参数进行计算最优显示尺寸再进行设置，否则直接根据现有的尺寸进行设置
      this.computedScale(data)
    }

    // 计算最有的显示比例 - 原则是 如果内容很宽，则显示高度完整；如果内容
    if (Object.prototype.toString.call(data).indexOf('Object') > 0) {
      ret = this.computeScaledStyle(data.style.root)
      this.canvas.css(ret)
    }
    this.canvasBoundary = this.canvas.offset()
    bodyBoundary = this.winFrame.offset() // 获取到显示窗口的大小信息
    // 屏幕中间定位画布
    left = (bodyBoundary.width - this.canvasBoundary.width) / 2 + 'px'
    top = (bodyBoundary.height - this.canvasBoundary.height) / 2 + 'px'
    this.canvas.css({left: left, top: top})
    this.canvasBoundary = this.canvas.offset()
    return this.scale
  },
  update (list, rootId, scale) {
    let args = Array.prototype.slice.call(arguments)
    let _self = this

    if (scale === this.scale) {
      return false
    }

    if (!list) {
      return false
    }
    if (args.length === 3) {
      this.setCanvas(list[rootId], scale)
    } else {
      this.setCanvas(list[rootId]) // 刷新适配画布
    }
    dataUtils.everyChild(list, rootId, function (n) {
      // TODO: 优化组件内在编辑的时候的显示转化
      // 给每一个组件重新计算样式并应用
      _self.updataAsset('#' + n.id, n.style.root, undefined, true)
      if (n.alisa === 'ASSET_FONT') {
        _self.updataAsset('#' + n.id + ' .asset-font__content', n.style.content, undefined, true)
      }
      if (n.alisa === 'ASSET_IMAGE') {
        _self.updataAsset('#' + n.id + ' .asset-image__content', n.style.content, undefined, true)
      }
      if (n.alisa === 'ASSET_SHAPE') {
        _self.updataAsset('#' + n.id + ' .asset-shape__content', n.style.content, undefined, true)
      }
    })
    return this.scale
  },
  updataCanvasPosition (position) {
    this.canvas.css(position)
    this.canvasBoundary = this.canvas.offset()
  },
  addHandler (type, handler, rewrite) {
    if (!this.handlers[type]) {
      this.handlers[type] = handler
      return true
    }
    if (this.handlers[type] && rewrite) {
      this.handlers[type] = handler
      return true
    }
    return false
  }
}

let drawer = new Drawer()

export default drawer
