<template>
  <div class="container-drawer__main">
    <!--顶部头-->
    <div class="header-container__main">
      <d-header></d-header>
    </div>
    <!--页面列表-->
    <div class="pager-container__main" :class="{'disabled': editType === 1}">
      <div class="pagination-switcher__wraper">
        <div class="pagination-switcher__item active">
          页面
        </div>
        <div class="pagination-switcher__item">
          图层
        </div>
      </div>
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

    <!--拖拽的容器-->
    <dragable-panle :title="dragePanle.title"
                    :isPoped="isPopedShow"
                    :styleString="dragePanle.appearance"
                    @close="closeAttr">
      <slot>
        <operate :id="assetData.id"></operate>
        <component :is="AttrPanle"></component>
      </slot>
    </dragable-panle>

    <!--弹框显示的数据-->
    <el-dialog
      class="dialog-style-popup"
      :title="dialog.title"
      :top="dialog.top"
      :visible.sync="dialog.show"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="dialog.width"
      center>
      <component :is="dialog.component"></component>
    </el-dialog>
    <!--<publish :isPublish="isPublish"></publish>-->
  </div>
</template>

<script>
import StyleChooser from '../components/style-chooser'
import AssetsList from '../components/Editor/AssetsList.vue'
import AssetsBaseList from '../components/Editor/AssetsBaseList.vue'
import DHeader from '../components/Editor/Header.vue'
import Pagination from '../components/Editor/Pagination.vue'
import DwZoomer from '../components/Editor/CanvasZoomer.vue'
import DwCanvas from '../components/Editor/DrawerCanvas'
import Operate from '../components/Attributes/AssetOperate.vue'
import AttrCanvas from '../components/Attributes/AttrCanvas.vue'
import AttrFont from '../components/Attributes/AttrFont.vue'
import AttrImg from '../components/Attributes/AttrImg.vue'
import AttrShape from '../components/Attributes/AttrShape.vue'
import DragablePanle from '../components/dragable-panel'
import Publish from '../pages/Publish'
import {getStyles, getBookDetail} from '../server/actions'
import {Listener, loadScript} from '../assets/js/Utils'

export default {
  name: 'Drawer',
  data () {
    return {
      styles: [],
      dragePanle: {
        title: '属性设置',
        appearance: {left: '210px', top: '75px', width: '260px'}
      },
      isNeedChoose: true,
      dialog: {
        component: null,
        show: false,
        title: '',
        width: '600px',
        top: '6vh'
      }
    }
  },
  watch: {
    '$route' (n) {
      let role = n.query.role
      let type = n.query.type

      if (type) {
        switch (type) {
          case 'publish':
            this.dialog.show = true
            this.dialog.title = '发布绘本'
            this.dialog.component = Publish
            break
          case 'preview':
            this.dialog.tyitle = '发布绘本'
//            this.dialog.component = Play
            break
        }
      } else {
        this.initPage()
      }
      role && this.$store.commit('updateLoginRole', role)
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
        loadScript(data.dataPath)
      })
    },
    //    初始化页面
    initPage () {
      let series = this.$route.query.id

      //    如果存在id需要直接加载数据
      if (series) {
        this.getBookDetailById()
        return false
      }
      getStyles().then(data => {
        this.styles = data
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
    DragablePanle
  },
  mounted () {
    let role = this.$route.query.role
    let self = this

    this.$store.commit('updateLoginRole', role)

    Listener.listen('BOOK', data => {
      self.$store.commit('initBookData', data)
    })

    this.initPage()
  },
  beforeDestroy () {
    this.$store.commit('resetStore')
  }
}
</script>

<style lang="scss">
  @import '../assets/style/common';
  $header_height: 62px;
  $pager_width: 194px;
  $assets_width: 97px;

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
    border-top: 1px solid #E3E3E3;
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

    .pagination-switcher__wraper{
      @include clear();
      border-bottom: 1px solid #BBBBBB;
      background: #E3E3E3;
      .pagination-switcher__item{
        float: left;
        width: 50%;
        height: 50px;
        background: #E3E3E3;
        color: #8A8B93;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
        &.active{
          background: #fff;
          color: #EB5648;
        }
      }
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
    border-top: 1px solid #E3E3E3;
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
    background: #F7F3F3;
    position: absolute;
    z-index: 1;
    left: $pager_width;
    right: $assets_width;
    top: 0;
    bottom: 55px;
  }

  /*公用的弹框*/
  .dialog-style-popup{
    width: 100%;
    background: #63656F;
    .el-dialog--center{
      background: transparent;
      box-shadow: none;
      background: #fff;
      border-radius: 8px;
      padding: 23px 20px;
    }
    /*#101010 100%*/
    .el-dialog__header{
      padding: 0;
      font-size: 20px;
      color: #101010;
    }
    .el-dialog__body{
      padding-top: 40px;
    }
  }
</style>
