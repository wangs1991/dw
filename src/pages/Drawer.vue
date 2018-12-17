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
    <style-chooser v-if="isNeedChoose" :styles="styles"></style-chooser>

    <publish :isPublish="isPublish"></publish>

    <dragable-panle :title="dragePanle.title"
                    :isPoped="isPopedShow"
                    :styleString="dragePanle.appearance"
                    @close="closeAttr">
      <slot>
        <operate :id="assetData.id"></operate>
        <component :is="AttrPanle"></component>
      </slot>
    </dragable-panle>
  </div>
</template>

<script>
import StyleChooser from '../components/style-chooser'
import AssetsList from '../components/AssetsList.vue'
import AssetsBaseList from '../components/AssetsBaseList.vue'
import DHeader from '../components/Header.vue'
import Pagination from '../components/Pagination.vue'
import DwZoomer from '../components/CanvasZoomer.vue'
import DwCanvas from '../components/DrawerCanvas'
import Operate from '../components/Attributes/AssetOperate.vue'
import AttrCanvas from '../components/Attributes/AttrCanvas.vue'
import AttrFont from '../components/Attributes/AttrFont.vue'
import AttrImg from '../components/Attributes/AttrImg.vue'
import AttrShape from '../components/Attributes/AttrShape.vue'
import DragablePanle from '../components/dragable-panel'
import Publish from '../pages/Publish'
import {getStyles, getBookDetail} from '../server/actions'
import {Listener} from '../assets/js/Utils'

export default {
  name: 'Drawer',
  data () {
    return {
      styles: [],
      dragePanle: {
        title: '属性设置',
        appearance: {left: '160px', top: '70px', width: '260px'}
      },
      isNeedChoose: true
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
    isPopedShow () {
      return !!this.$store.state.Editor.attributeData.id
    },
    isPublish () {
      return this.$store.state.Editor.isPublish
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
  methods: {
    closeAttr () {
      this.$store.commit('setAttributeData', {})
    },
    //    获取绘本详情
    getBookDetailById () {
      let id = this.$route.query.id

      this.isNeedChoose = false
      getBookDetail({
        id: id
      }).then(data => {
        let script = document.createElement('script')

        script.type = 'text/javascript'
        script.src = data.dataPath
        document.body.appendChild(script)
      })
    }
  },
  components: {
    StyleChooser,
    AssetsList,
    AssetsBaseList,
    Operate,
    DwCanvas,
    DwZoomer,
    DHeader,
    Pagination,
    DragablePanle,
    Publish
  },
  mounted () {
    let role = this.$route.query.role
    let series = this.$route.query.id
    let self = this

    this.$store.commit('updateLoginRole', role)

    Listener.listen('BOOK', data => {
      self.$store.commit('initBookData', data)
    })
//    如果存在id需要直接加载数据
    if (series) {
      this.getBookDetailById()
      return false
    }

    getStyles().then(data => {
      this.styles = data
    })
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
