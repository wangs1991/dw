<template>
  <div class="container-drawer__main">
    <!--顶部头-->
    <div class="header-container__main">
      <d-header></d-header>
    </div>
    <!--页面列表-->
    <div class="pager-container__main" :class="{'disabled': editType === 1}">
      <pagination></pagination>
    </div>
    <!--左侧组件列表，仅在管理员制作模板时显示-->
    <div class="baseAsets-container__main" v-if="editType !== 0">
      <AssetsBaseList/>
    </div>
    <!--右侧风格以及组件的列表栏，创作绘本时显示-->
    <div class="menu-container__main" :class="{'disabled': editType === 1}">
      <assets-list></assets-list>
    </div>
    <!--中心绘画区域，画布-->
    <div class="editor-container__main">
      <!--画布总的容器-->
      <div id="editor-window">
        <dw-canvas/>
      </div>
      <!--底部放大器控制区域以及全局地图拖拽-->
      <dw-zoomer></dw-zoomer>
    </div>
    <style-chooser :styles="styles"></style-chooser>
  </div>
</template>

<script>
import StyleChooser from '../components/style-chooser'
import AssetsList from './AssetsList.vue'
import AssetsBaseList from './AssetsBaseList.vue'
import DHeader from './Header.vue'
import Pagination from './Pagination.vue'
import DwZoomer from './CanvasZoomer.vue'
import DwCanvas from './DrawerCanvas'
import AttrCanvas from './Attributes/AttrCanvas.vue'
import AttrFont from './Attributes/AttrFont.vue'
import AttrImg from './Attributes/AttrImg.vue'
import AttrShape from './Attributes/AttrShape.vue'

const generateStyles = () => {
  let data = []
  let o = 0
  let oMax = 4
  let i = 0
  let iMax = 5
  let tmp = []
  for (; o < oMax; o++) {
    for (; i < iMax; i++) {
      tmp.push({
        id: i + '_' + i,
        name: '大耳朵图图' + o + i,
        cover: require('../../static/images/banner.jpg')
      })
    }
    data[o] = {
      id: o,
      name: '风格' + o,
      cover: require('../../static/images/login-bg.jpg'),
      series: tmp
    }
    /* data.push({
      id: o,
      name: '风格' + o,
      cover: require('../../static/images/login-bg.jpg'),
      series: tmp
    }) */
  }
  return data
}

export default {
  name: 'Drawer',
  data () {
    return {
      styles: generateStyles()
    }
  },
  watch: {
    '$route' (n) {
      let role = n.query.role

      this.$store.commit('updateLoginRole', role)
    }
  },
  computed: {
//    当前操作组件数据
    assetData () {
      return this.$store.state.Editor.attributeData
    },
//    属性面板的控制
    AttrPanle () {
      let ret = AttrCanvas
      if (this.assetData.alisa === 'ASSET_FONT') {
        ret = AttrFont
      }
      if (this.assetData.alisa === 'ASSET_IMAGE') {
        ret = AttrImg
      }
      if (this.assetData.alisa === 'ASSET_SHAPE') {
        ret = AttrShape
      }
      return ret
    },
//    编辑器编辑编辑类型
    editType () {
      return this.$store.state.Editor.editType
    }
  },
  components: {
    StyleChooser,
    AssetsList,
    AssetsBaseList,
    DwCanvas,
    DwZoomer,
    DHeader,
    Pagination
  },
  mounted () {
    let role = this.$route.query.role

    this.$store.commit('updateLoginRole', role)
  }
}
</script>

<style lang="scss">
  $header_height: 55px;
  $pager_width: 140px;
  $assets_width: 80px;

  .container-drawer__main {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .header-container__main {
    height: $header_height;
    line-height: $header_height;
    background: #fff;
    position: relative;
    z-index: 110;
  }

  .pager-container__main {
    width: $pager_width;
    position: absolute;
    z-index: 100;
    background: #fff;
    top: $header_height;
    bottom: 0;
    left: 0;
    transition: all ease .2s;
    &.disabled{
      left: -$pager_width
    }
  }
  .baseAsets-container__main{
    width: $pager_width;
    position: absolute;
    z-index: 100;
    background: #fff;
    top: $header_height;
    bottom: 0;
    left: 0;
    transition: all ease .2s;
  }

  .menu-container__main {
    width: $assets_width;
    position: absolute;
    z-index: 100;
    background: #fff;
    top: $header_height;
    bottom: 0;
    right: 0;
    &.disabled{
      &:before{
        content: ' ';
        position: absolute;
        z-index: 100;
        right: 0;
        top: 0;
        bottom: 0;
        width: 280px;
        cursor: not-allowed;
        background: rgba(0, 0, 0, .15);
      }
    }
  }

  .editor-container__main {
    position: absolute;
    z-index: 1;
    outline: 1px solid #f00;
    width: 100%;
    height: 100%;
    top: $header_height;
    left: 0;
    right: 0;
  }

  #editor-window {
    border: 1px solid #f00;
    position: absolute;
    z-index: 1;
    left: $pager_width;
    right: $assets_width;
    top: 0;
    bottom: 55px;
  }
</style>
