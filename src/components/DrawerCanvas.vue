<template>
  <div class="drawer-canvas__root">
  </div>
</template>

<script>
import Drawer from '../assets/js/drawerTools'
import Bus from '../components/Bus'
import dataUtils from '../assets/js/utils_mcdata'
import {busEmiter} from '../assets/js/drawerBridge'

// import assets from '../../static/database/assets'

export default {
  name: 'DWCanvas',
  data () {
    return {
      root: ''
    }
  },
  computed: {
    assets () { // 当前画布编辑的数据信息结合
      return this.$store.state.Editor.currentEditData
    },
    currentData () { // 当前画布集合数据中正在编辑的子元素
      return this.$store.state.Editor.attributeData
    },
    scale () { // 画布的缩放比例
      return this.$store.state.Editor.canvasScale
    }
  },
  watch: {
    scale (n) {
      Drawer.update(this.assets, this.root, n)
      this.$store.commit('refreshResizeStamp')
    },
    assets (n) {
      let scale
      let Head = dataUtils.getHead(n)

      this.root = Head.id
      // 应用一下画布的样式
      Drawer.updataAsset('.drawer-canvas__root', Head.style.root, undefined, true)
      scale = Drawer.update(this.assets, Head.id)
      this.$store.commit('setCanvasScale', scale)
      this.$store.commit('refreshResizeStamp')

      console.log(n)
      // 清空当前画布内容
      Drawer.clearCanvas()
      dataUtils.everyChild(n, this.root, n => {
        // 遍历每个子元素进行渲染
        // 渲染组件进画布
        Drawer.appendAsset(n)
      })
    }
  },
  mounted () {
    Drawer.init({
      type: 'editor',
      watcher: Bus,
      canvasSelector: '.drawer-canvas__root',
      windowSelector: '#editor-window'
    })

    /* let _self = this
    let canvas = assets[0] // 默认的画布配置

    // 默认添加一个容器配置的数据
    _self.root = generateId('ROOT_')
    canvas.id = _self.root
    dataUtils.push(this.assets, canvas, function (canvas) {
      let scale
      // 初始化绘本编辑器工具方法插件
      Drawer.init({
        type: 'editor',
        watcher: Bus,
        canvasSelector: '.drawer-canvas__root',
        windowSelector: '#editor-window'
      })

      // 应用一下画布的样式
      Drawer.updataAsset('.drawer-canvas__root', canvas.style.root, undefined, true)
      scale = Drawer.update(_self.assets, _self.root)
      _self.$store.commit('setCanvasScale', scale)
    }, function (target, prev) {
      prev && _self.$set(_self.assets, prev.id, prev)
      _self.$set(_self.assets, target.id, target)
      _self.$nextTick(() => {
        _self.$store.commit('setAttributeData', target)
      })
    }) */
  },
  created () {
    let _self = this

    // 绑定resize适配方法
    $(window).on('resize', _.debounce(function () {
      let scale = Drawer.update(_self.assets, _self.root)
      _self.$store.commit('setCanvasScale', scale)
    }, 300, {
      'leading': false,
      'trailing': true}))
    // 事件接收集合
    // 组件添加到画布 from 组件列表点击
    Bus.$on('initAssets', data => {
      busEmiter.initAssets.call(this, data)
    })
    // 组件被选中 from 画布中组件的click
    Bus.$on('assetGetSelected', data => {
      busEmiter.assetGetSelected.call(this, data)
    })
    // 组件被拖拽改变大小 from drawerTool emit，仅可修改宽度，高度根据内容自适应
    Bus.$on('assetResizeByDrag', data => {
      busEmiter.assetResizeByDrag.call(this, data)
    })
    // 组件被拖拽移动 from drawerTool emit
    Bus.$on('assetMove', data => {
      busEmiter.assetMove.call(this, data)
    })
    // 文字组件文本被编辑 from drawerTool emit
    Bus.$on('assetTxtChange', data => {
      busEmiter.assetTxtChange.call(this, data)
    })
    // 组件被从画布移除 from 公用控制面板的删除按钮
    Bus.$on('assetOprateDelete', () => {
      busEmiter.assetOprateDelete.call(this)
    })
    // 组件被从画布复制一份 from 公用控制面板的复制按钮
    Bus.$on('assetOprateCopy', () => {
      busEmiter.assetOprateCopy.call(this)
    })
    // 组件层级改变 from 公用控制面板的置顶置底按钮
    Bus.$on('assetOprateLevel', step => {
      busEmiter.assetOprateLevel.call(this, step)
    })
    // 文字组件样式被更新 from 属性调节面板
    Bus.$on('assetTxtModifyed', (data) => {
      busEmiter.assetTxtModifyed.call(this, data)
    })
    // 文字组件长宽兑换方法触发 from 属性调节面板
    Bus.$on('assetTxtResize', id => {
      busEmiter.assetTxtResize.call(this, id)
    })
    // 图片组件样式被更新 from 属性面板调节
    Bus.$on('assetImgModifyed', data => {
      busEmiter.assetImgModifyed.call(this, data)
    })
    // 图片组件样式被更新 from 属性面板调节
    Bus.$on('canvasModifyed', _.debounce(data => {
      busEmiter.canvasModifyed.call(this, data)
    }, 300, {
      'leading': false,
      'trailing': true}))

    // 形状组件样式被更新 from 属性面板调节
    Bus.$on('assetShapeModifyed', data => {
      busEmiter.assetShapeModifyed.call(this, data)
    })
  }
}
</script>

<style lang="scss">
  $canvas_height: 350px;
  $canvas_width: 900px;

  .drawer-canvas__root {
    position: absolute;
    z-index: 0;
    width: $canvas_width;
    height: $canvas_height;
    background: #fff;
    *{
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      &.asset-font__content{
        -webkit-touch-callout: initial;
        -webkit-user-select: initial;
        -khtml-user-select: initial;
        -moz-user-select: initial;
        -ms-user-select: initial;
        user-select: initial;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

  .asset-continer__root.ASSET_COMBINE{
    cursor: move;
    position: absolute;
    z-index: 0;
  }
  /*组件悬停选中是添加边框*/
  .asset-continer__root:hover,
  .asset-continer__root:focus,
  .asset-continer__root:active,
  .asset-continer__root.active,
  .asset-continer__root.asset_selected{
    outline: 1px dashed #f00;
  }
  /*宽高鼠标样式改变元素即 事件处理有效区域*/
  /*通用样式*/
  .resize-handler{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    &:before,
    &:after{
      content: ' ';
      display: block;
      position: absolute;
      pointer-events: auto;
      display: none;
    }
    &:before{
      width: 100%;
      height: 8px;
      right: 0;
      bottom: 0;
      cursor: row-resize;
    }
    &:after{
      top: 0;
      right: 0;
      width: 8px;
      height: 100%;
      cursor: col-resize;
    }
  }
  .asset_selected .resize-handler{
    &:before,
    &:after{
      display: block;
    }
  }
  /*字体仅仅允许修改宽度*/
  .ASSET_FONT.asset_selected .resize-handler{
    &:before{
      display: none;
    }
    &:after{
      width: 8px;
      height: 8px;
      background: #000;
      border-radius: 10px;
      top: 50%;
      margin-top: -5px;
      cursor: col-resize;
      border: 1px solid #f00;
    }
    &:after{
      right: -5px;
    }
  }
  /*图片可以修改宽度和高度，but都是等比改变，不想图片被拉伸变形
  */
  .ASSET_IMAGE.asset_selected .resize-handler,
  .ASSET_SHAPE.asset_selected .resize-handler{
    &:before,
    &:after{
      width: 8px;
      height: 8px;
      background: #000;
      border-radius: 10px;
      margin-top: -5px;
      border: 1px solid #f00;
    }
    &:before{
      top: 50%;
      right: -5px;
      cursor: col-resize;
    }
    &:after{
      top: auto;
      left: 50%;
      bottom: -5px;
      cursor: row-resize;
    }
  }

  /*旋转鼠标悬停控制元素即 事件处理有效区域*/
  .rotate-handler{
    position: absolute;
    width: 12px;
    height: 12px;
    right: 0;
    bottom: 0;
    z-index: 10;
    font-size: 12px;
    cursor: default;
    &:after{
      content: "\e60e";
      position: relative;
      top: 0;
      right: 0;
      visibility: hidden;
    }
    &:hover:after{
      visibility: visible;
    }
  }
</style>
