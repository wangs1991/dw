<template>
  <div class="player-layout__mobile">
    <div class="player-header__wraper">
      <div class="player-header__logo">
        番茄号
      </div>
      <div class="player-header__title">
        {{bookName}}
      </div>
      <div class="player-header__share"  @click="share">
        <i class="theme-icons theme-icon__share"></i>
      </div>
    </div>

    <div class="player-container__main">
      <audio ref="background" muted autoplay="true" data-id="background"></audio>
      <audio ref="pageMusic" muted autoplay="true" data-id="pageMusic"></audio>
      <div class="player-screen__main">
      </div>
    </div>

    <div class="player-container__footer">
      <div class="player-pager__ctner">{{playIdx + 1}}/{{list.length}}</div>
      <button class="player-play__btn" @click="play">
        <i class="theme-icons theme-icon__bookPlay"
           :class="{'theme-icon__bookStop': autoPlay}"></i>
      </button>
    </div>

  </div>
</template>

<script>
import Drawer from '../../assets/js/drawerTools'
import dataUtils from '../../assets/js/utils_mcdata'
import {Listener, loadScript} from '../../assets/js/Utils'
import {getBookDetail} from '../../server/actions'
// import QRious from 'qrious'

let task

export default {
  data () {
    return {
      playIdx: '',
      rootId: '',
      bookName: '',
      autoPlay: false
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
        this.startPlay()
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
      let data = this.$route.query.data

      if (data) {
        loadScript(data.dataPath)
        return false
      }
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
      if (!this.autoPlay) {
        return false
      }
      task = setInterval(function () {
        clearInterval(task)
        task = null
        self.setPage(1)
      }, delay)
    },
    play () {
      this.autoPlay = !this.autoPlay
      if (this.autoPlay) {
        this.startPlay()
      } else {
        this.stopPlay()
      }
    },
    startPlay () {
      let pageMusic = this.$refs.pageMusic
      let self = this

      if (!this.pageMusic || !this.pageMusic.resource) { // 没有背景音乐定时切换
        this.intervalTask(5000)
        return false
      }
      pageMusic.addEventListener('timeupdate', function () {
        if (pageMusic.currentTime * 1000 >= self.pageMusic.end) {
          pageMusic.pause()
//            self.setPage(1)
          self.intervalTask(1000)
        }
      })
      pageMusic.addEventListener('error', function () {
//          资源加载失败，定时任务切换
        self.intervalTask(5000)
      })
      pageMusic.src = this.pageMusic.resource
      self.playSet(pageMusic, this.pageMusic)
    },
    stopPlay () {
      this.intervalTask()
    },
    share () {
      this.$share(this.bookName)
    }
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
  @import '../../assets/style/common';
  $header_height: 55px;
  $footer_height: 130px;
  .player-layout__mobile{
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: #fff;
    overflow: hidden;
    .player-header__wraper{
      display: flex;
      padding: 10px 20px;
      border-bottom: 1px solid #BBBBBB;
      .player-header__logo{
        width: 63px;
        height: 34px;
        background: url('../../assets/images/logo.png') no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
        text-indent: -9999px;
      }
      .player-header__title{
        width: 100%;
        padding: 0 10px;
        text-align: center;
        @include els();
      }
      .player-header__share{
        width: 33px;
        height: 24px;
        text-align: center;
        line-height: 24px;
      }
    }
    .player-container__main{
      position: absolute;
      top: $header_height;
      bottom: $footer_height;
      left: 0;
      right: 0;
      z-index: 10;
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
    .player-container__footer{
      position: absolute;
      z-index: 100;
      height: $footer_height;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 20px;
      text-align: center;
      .player-pager__ctner{
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #101010;
      }
      .player-play__btn{
        color: #101010;
        display: inline-block;
        width: 42px;
        height: 42px;
        text-align: center;
        line-height: 42px;
        border: 0;
        outline: 0;
        background: transparent;
        .theme-icons{
          font-size: 30px;
        }
      }
    }
  }
</style>
