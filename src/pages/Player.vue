<template>
  <div class="player-container__main">
    <div class="player-control__main">
      <div class="player-control__item" @click="setPage(-1)">&lt;</div>
      <div class="player-control__progress">{{playIdx+1}} / {{list.length}}</div>
      <div class="player-control__item" @click="setPage(1)">&gt;</div>
    </div>

    <audio ref="background" muted autoplay="true" data-id="background"></audio>
    <audio ref="pageMusic" muted autoplay="true" data-id="pageMusic"></audio>
    <div class="player-screen__main">
    </div>
  </div>
</template>

<script>
import Drawer from '../assets/js/drawerTools'
import dataUtils from '../assets/js/utils_mcdata'
import {Listener} from '../assets/js/Utils'

export default {
  data () {
    return {
      playIdx: '',
      rootId: ''
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

        if (!n || !n.resource) {
          this.intervalTask(5000)
          return false
        }
        pageMusic.addEventListener('timeupdate', function () {
          if (pageMusic.currentTime * 1000 >= n.end) {
            pageMusic.pause()
            self.setPage(1)
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
    loadScript () {
      let url = this.$route.query.dataPath
      let script = document.createElement('script')

      script.type = 'text/javascript'
      script.src = url
      document.body.appendChild(script)
    },
    playSet (audio, options) {
      audio.currentTime = options.start
      audio.volume = options.volume / 100
      audio.play()
    },
    intervalTask (delay = 3000) {
      let task
      let self = this

      task = setInterval(function () {
        clearInterval(task)
        task = null
        self.setPage(1)
      }, delay)
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
    this.loadScript()
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
