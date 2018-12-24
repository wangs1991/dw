<template>
  <div class="menu-list__container">
    <ul class="menu-base__list">
      <li class="menu-item__wp"
          v-for="item in assets"
          :key="item.id" @click="drawAsset(item)">
        {{item.name}}
        <img class="menu-item__preview" :src="item.preview" alt="" />
      </li>
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
    }
  },
  computed: {
//    组件列表
    assets () {
      let list = ['ASSET_FONT', 'ASSET_IMAGE', 'ASSET_SHAPE']

      return _.filter(assets, (o) => {
        return list.indexOf(o.type) >= 0
      })
    }
  },
  methods: {
//    组件添加到画布的方法
    drawAsset (data) {
      Bus.$emit('initAssets', _.cloneDeep(data).data)
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

  .menu-base__list{
    padding: 20px 20px;
    position: absolute;
    z-index: 8;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    overflow: auto;
    background: #fff;
    transition:  all ease .2s;
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
    }
    .menu-item__preview{
      width: 100%;
      display: block;
    }
  }
}
</style>
