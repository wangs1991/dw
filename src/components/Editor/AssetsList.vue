<template>
  <div class="menu-list__container">
    <ul class="menu-assets__list">
      <li class="menu-item__type"
          v-for="item in types"
          @click="openSublist(item.id)"
          :class="{'isActive': item.id === currentType}"
          :key="item.id">
        <i class="type-icon theme-icons"
           :class="item.className"></i>
        {{item.name}}
      </li>
    </ul>
    <!--二级-->
    <ul class="menu-children__list " :class="subListClass">
      <li class="menu-item__wp"
           v-for="item in assets"
           :key="item.id" @click="drawAsset(item)">
        {{item.name}}
        <img class="menu-item__preview" :src="item.preview" alt="" />
      </li>
      <li class="menu-item__wp"
          @click="addAsset"
          v-if="showAddButton">创建新的元素</li>
    </ul>
  </div>
</template>

<script>
import assets from '../../../static/database/assets.js'
import Bus from '../Bus'
// import dataUtils from '../assets/js/utils_mcdata'

export default {
  name: 'AssetsList',
  data () {
    return {
      currentType: '',
      types: [{
        id: 'scene',
        name: '场景',
        className: 'theme-icon__scene'
      }, {
        id: 'background',
        name: '背景',
        className: 'theme-icon__background'
      }, {
        id: 'figure',
        name: '人物',
        className: 'theme-icon__figure'
      }, {
        id: 'fonts',
        name: '文字',
        className: 'theme-icon__font'
      }, {
        id: 'tools',
        name: '道具',
        className: 'theme-icon__tool'
      }, {
        id: 'voice',
        name: '声音',
        className: 'theme-icon__voice'
      }, {
        id: 'mine',
        name: '我的',
        className: 'theme-icon__mine'
      }]
    }
  },
  computed: {
//    组件列表
    assets () {
      return assets
      /* let list = []

      console.log(assets)
      assets.forEach(n => {
        list.push(dataUtils.getHead(n))
      })
      return _.filter(list, (o) => {
        return o.alisa !== 'ASSET_CONTAINER'
      }) */
    },
//    二级组件列表的展开关闭控制类
    subListClass () {
      return this.$store.state.Editor.assetsSubState === 'open' ? 'state-opend' : ''
    },
//    权限判断
    showAddButton () {
      return this.$store.state.Editor.loginRole === 'admin'
    }
  },
  methods: {
//    组件添加到画布的方法
    drawAsset (data) {
      let pass = _.cloneDeep(data)

      Bus.$emit('initAssets', pass.data)
    },
//    选中一级选中与取消,对应展开和关闭二级分类
    openSublist (id) {
      this.currentType = this.currentType === id ? '' : id
      if (this.currentType === '') {
        this.$store.commit('upateAssetsSubState')
      } else {
        this.$store.commit('upateAssetsSubState', 'open')
      }
    },
//    添加组件的方法
    addAsset () {
//      判断当前画布数据并缓存下来
//      初始化组件添加界面可用的菜单项：隐藏页面管理、可新增类型为基本操作类型
      this.$store.commit('updateEditType', 1)
    }
  },
  mounted () {
    /* let i = 0
    let self = this */

    /* function next () {
      let ret = self.assets[i]
      if (ret) {
        Drawer.preview(ret).then(url => {
          self.assets[i].preview = url
          i++
          _.delay(function () {
            console.warn('html2pic', i, 'prev url', url)
            next()
          }, 500)
        })
      }
    }
    _.delay(function () {
      next()
    }, 1000) */
  }
}
</script>

<style lang="scss">
.menu-list__container {
  margin: 0;
  padding: 0;
  list-style: none;

  .menu-assets__list{
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-x: hidden;
    background: #fff;
  }

  .menu-children__list{
    border-top: 1px solid #e3e3e3;
    padding: 20px;
    position: absolute;
    z-index: 8;
    width: 160px;
    left: 0;
    bottom: 0;
    top: -1px;
    overflow: auto;
    background: #F6F7F8;
    transition:  all ease .2s;
    &.state-opend{
      left: -200px;
    }
    .menu-item__wp {
      margin-bottom: 12px;
      box-shadow: 0 0 5px rgba(0, 0, 0, .1);

      height: 60px;
      background: #dcdcdc;
      border-radius: 3px;

      font-size: 12px;
      text-align: center;
      line-height: 60px;
      color: #666;
      font-weight: bold;

      cursor: pointer;
    }
    .menu-item__preview{
      width: 100%;
      display: block;
    }
  }

  .menu-item__type {
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    padding: 14px 0 10px;
    i.type-icon{
      position: relative;
      left: -2px;
      display: block;
      width: 35px;
      height: 35px;
      font-size: 35px;
      text-align: center;
      line-height: 35px;
      margin-bottom: 8px;
      margin-left: auto;
      margin-right: auto;
    }
    &:before{
      content: ' ';
      display: inline-block;
      float: right;
      width: 5px;
      height: 86px;
      background: transparent;
      float: right;
      margin-top: -14px;
    }
    &.isActive{
      background: #F6F7F8;
      &:before{
        background-color: #EB5648;
      }
    }
  }

  .menu-button__add{
    width: 100%;
    border-radius: 5px;
    background: rgba(137, 245, 66, 1);
    color: #fff;
    text-align: center;
    line-height: 20px;
    font-size: 30px;
    padding: 10px 0;
    cursor: pointer;
    margin-bottom: 10px;
  }

}
</style>
