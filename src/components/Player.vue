<template>
  <div class="player-container__main">
    <div class="player-control__main">
      <div class="player-control__item" @click="setPage(-1)">&lt;</div>
      <div class="player-control__progress">{{currentPage}} / {{list.length - 1}}</div>
      <div class="player-control__item" @click="setPage(1)">&gt;</div>
    </div>
    <div class="player-screen__main">
    </div>
  </div>
</template>

<script>
import Drawer from '../assets/js/drawerTools'
import dataUtils from '../assets/js/utils_mcdata'
export default {
  data () {
    return {
      playIdx: '',
      rootId: ''
    }
  },
  computed: {
    list () {
      return this.$store.state.Editor.bookData
    },
    asset () {
      return this.$store.state.Editor.currentEditData
    },
    playContext () {
      if (this.list.length > 0) {
        return this.list[this.playIdx]
      }
      return this.asset
    },
    currentPage () {
      if (this.playIdx === 0) {
        return '封面'
      }
      if (this.playIdx === this.list.length - 1) {
        return '封底'
      }
      return this.playIdx
    }
  },
  watch: {
    playContext (n) {
      let Head = dataUtils.getHead(n)

      if (!Head) {
        return false
      }
      this.rootId = Head.id

      Drawer.updataAsset('.drawer-canvas__root', Head.style.root, undefined, true)
      Drawer.update(this.playContext, Head.id)

      // 清空当前画布内容
      Drawer.clearCanvas()
      dataUtils.everyChild(n, Head.id, n => {
        // 遍历每个子元素进行渲染
        // 渲染组件进画布
        Drawer.appendAsset(n)
      })
    }
  },
  methods: {
    setPage (step) {
      let current = this.playIdx + step

      if (step < 0) {
        current = current < 0 ? 0 : current
      }
      if (step > 0) {
        current = current > (this.list.length - 1) ? this.list.length - 1 : current
      }
      this.playIdx = current
    }
  },
  mounted () {
    Drawer.init({
      type: 'player',
      canvasSelector: '.player-screen__main',
      windowSelector: '.player-container__main'
    })

    this.$nextTick(function () {
      this.playIdx = 0
    })
  },
  created () {
    let _self = this

    // 绑定resize适配方法
    $(window).on('resize', _.debounce(function () {
      Drawer.update(_self.playContext, _self.rootId)
    }, 300, {
      'leading': false,
      'trailing': true}))
  }
}
</script>

<style lang="scss">
.player-container__main{
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  .player-control__main{
    position: absolute;
    z-index: 100;
    width: 300px;
    height: 30px;
    line-height: 30px;
    background: rgba(0, 0, 0, .5);
    text-align: center;
    bottom: 20px;
    left: 50%;
    margin-left: -150px;
    border-radius: 100px;
    display: flex;
    .player-control__item{
      width: 33.33%;
      text-align: center;
      cursor: pointer;
    }
    .player-control__progress{
      width: 33.33%;
    }
  }
  .player-screen__main{
    position: absolute;
    z-index: 10;
    background: #fff;
    width: 400px;
    height: 400px;
  }
}
</style>
