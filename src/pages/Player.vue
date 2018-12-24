<template>
  <div class="player-layout__main">
    <div class="player-header__wraper">
      <PlayHeader></PlayHeader>
    </div>

    <div class="player-control__main">
      <div class="player-control__item nav_prev" @click="setPage(-1)">&lt;</div>
      <div class="player-control__item nav_next" @click="setPage(1)">&gt;</div>
    </div>

    <div class="player-container__main">
      <audio ref="background" muted autoplay="true" data-id="background"></audio>
      <audio ref="pageMusic" muted autoplay="true" data-id="pageMusic"></audio>
      <div class="player-screen__main">
      </div>
    </div>

    <!--分享弹框-->
    <div class="share-float__win" v-if="isShare" @click="hideShare">
      <div class="share-float__content">
        <div class="share-content__header">{{bookName}}</div>
        <div class="share-content__body">
          <canvas ref="canvas"></canvas>
        </div>
        <div class="share-content__footer">微信扫码观看</div>
      </div>
    </div>
  </div>
</template>

<script>
import Drawer from '../assets/js/drawerTools'
import dataUtils from '../assets/js/utils_mcdata'
import {Listener, loadScript} from '../assets/js/Utils'
import {getBookDetail} from '../server/actions'
import QRious from 'qrious'

import PlayHeader from '../components/Player/Header.vue'
let task

export default {
  data () {
    return {
      playIdx: '',
      rootId: '',
      bookName: '',
      isShare: false
    }
  },
  computed: {
    list () {
      return this.$store.state.Player.bookData
    },
    asset () {
      return this.$store.state.Player.currentPlayData
    },
    playContext () {
      if (this.list.length > 0) {
        return this.list[this.playIdx]
      }
      return this.asset
    },
    bgMusic () {
      let data = this.list[0]
      let set = dataUtils.getHead(data)

      return set ? set.bgMusic : {}
    },
    pageMusic () {
      let set = dataUtils.getHead(this.asset)

      return set ? set.music : {}
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
    },
    playIdx (n) {
      if (this.$refs.pageMusic) {
        this.$refs.pageMusic.pause()
      }
      this.$store.commit('setCurrentPlayPage', n)
    },
    bgMusic (n) {
      let background = this.$refs.background
      let self = this

      if (!n || !n.resource) {
        return false
      }

      background.addEventListener('timeupdate', function () {
        if (background.currentTime * 1000 >= n.end) {
          self.playSet(background, n)
        }
      })
      background.src = n.resource
      self.playSet(background, n)
    },
    pageMusic: {
      deep: true,
      handler (n) {
        let pageMusic = this.$refs.pageMusic
        let self = this

        if (!n || !n.resource) { // 没有背景音乐定时切换
          this.intervalTask(5000)
          return false
        }
        pageMusic.addEventListener('timeupdate', function () {
          if (pageMusic.currentTime * 1000 >= n.end) {
            pageMusic.pause()
//            self.setPage(1)
            self.intervalTask(1000)
          }
        })
        pageMusic.src = n.resource
        self.playSet(pageMusic, n)
      }
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
    },
    loadData () {
      let id = this.$route.query.id

      if (id) {
        getBookDetail({
          id: id
        }).then(data => {
          this.bookName = data.name
          loadScript(data.dataPath)
        })
      }
    },
    playSet (audio, options) {
      audio.currentTime = options.start
      audio.volume = options.volume / 100
      audio.play()
    },
    intervalTask (delay = 3000) {
      let self = this

      clearInterval(task)
      task = null
      task = setInterval(function () {
        clearInterval(task)
        task = null
        self.setPage(1)
      }, delay)
    },
    share () {
      this.isShare = true
      this.$nextTick(() => {
        const code = new QRious({
          element: this.$refs.canvas,
          level: 'M'
        })

        code.value = window.location.href
        code.size = 220
      })
    },
    hideShare () {
      this.isShare = false
    }
  },
  components: {
    PlayHeader
  },
  mounted () {
    let self = this

    Drawer.init({
      type: 'player',
      canvasSelector: '.player-screen__main',
      windowSelector: '.player-container__main'
    })

    this.$nextTick(function () {
      this.playIdx = 0
    })

    Listener.listen('BOOK', data => {
      self.$store.commit('initBookDataOfPlayer', data)
    })
    this.loadData()
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
  $header_height: 65px;
.player-layout__main{
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #63656F;
  .player-header__wraper{
    height: $header_height;
    background: #fff;
    padding: 0 20px;
  }
  .player-container__main{
    position: absolute;
    top: $header_height;
    bottom: 0;
    left: 100px;
    right: 100px;
    z-index: 10;
  }
  .share-float__win{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, .8);
    .share-float__content{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      box-shadow: 0 0 5px rgba(0, 0, 0, .3);
      border-radius: 12px;
      width: 300px;
      margin: 0 auto;
      padding: 15px 20px;
      .share-content__header{
        text-align: center;
        font-size: 16px;
        margin-bottom: 10px;
      }
      .share-content__body{
        text-align: center;
        padding-bottom: 20px;
      }
      .share-content__footer{
        font-size: 12px;
        color: #ababab;
        text-align: center;

      }
    }
  }
  .player-control__main{
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 150px;
    line-height: 30px;
    text-align: center;
    top: 50%;
    left: 0;
    color: #fff;
    margin-top: -75px;
    .player-control__item{
      font-size: 0;
      width: 85px;
      height: 190px;
      border-radius: 50% / 50%;
      background: rgba(0, 0, 0, .3);
      text-align: center;
      cursor: pointer;
      position: absolute;
      top: 0;
      z-index: 10;
      transition: all ease-in .1s;
      &:hover{
        background: rgba(0, 0, 0, .6);
      }
      &.nav_prev{
        left: -40px;
      }
      &.nav_next{
        right: -40px;
      }
    }
  }
  .player-screen__main{
    position: absolute;
    z-index: 20;
    top: 50px;
    width: 400px;
    height: 400px;
    *{
      cursor: default!important;
    }
    .asset-font__content{
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
</style>
