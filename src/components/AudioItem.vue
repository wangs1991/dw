<template>
  <div class="music-panel__item">
    <div class="music-item__label">
      <div>音频属性</div>
      <div class="music-item__warn">（全部页面有效）</div>
    </div>
    <div class="music-item__controler">
      <span class="music-item__ctr" @click="palyeMusic">P</span>
      <span class="music-item__ctr">D</span>
      <span class="music-item__ctr">R</span>
    </div>
    <div class="music-item__content">
      <audio ref="player">
        <source :src="item.resource">
      </audio>
      <div class="music-item__cutter">
        <el-slider
          class="music-cutter"
          range
          :step="musicSteper.step"
          v-model="mrange"
          :max="musicSteper.duration">
        </el-slider>
      </div>
      <div class="music-item__info">
        <label for="">Vol: </label>
        <div class="music-volume">
          <el-slider
            :step="volSteper.stop"
            v-model="volSteper.volume"
            :max="volSteper.max">
          </el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AudioItem',
  data () {
    return {
      isPlaying: false,
      musicSteper: {
        step: 1,
        duration: 10000,
        max: 12000,
        min: 1000
      },
      volSteper: {
        step: 1,
        max: 100,
        volume: 100
      }
    }
  },
  computed: {
    mrange: {
      set (n) {
        this.musicSteper.max = n[0]
        this.musicSteper.min = n[1]
      },
      get () {
        return [this.musicSteper.max, this.musicSteper.min]
      }
    }
  },
  watch: {
    'volSteper.volume' (n) {
      this.$refs.player.volume = n / 100
    }
  },
  props: {
    item: {
      required: false,
      type: Object,
      default () {
        return {
          resource: require('../../static/audio/demo.mp3'),
          start: 0,
          end: 2500,
          volumn: 100,
          isLoop: false,
          type: ''
        }
      }
    }
  },
  methods: {
    palyeMusic () {
      if (!this.isPlaying) {
        this.$refs.player.currentTime = this.musicSteper.min / 1000
        this.$refs.player.play()
      } else {
        this.$refs.player.pause()
      }
      this.isPlaying = !this.isPlaying
    },
    initMusic () {
      var audio = document.createElement('audio')
      var self = this

      audio.oncanplay = e => {
        self.musicSteper.duration = audio.duration * 1000
        self.$refs.player.addEventListener('progress', e => {
          console.log(e)
        })
      }
      audio.src = this.item.resource
    }
  },
  mounted () {
    this.initMusic()
  }
}
</script>

<style lang="scss">
.music-panel__item{
  background: rgba(255, 0, 0, .2);
  margin-left: 50px;
  margin-right: 80px;
  font-size: 14px;
  .music-item__label {
    float: left;
    margin-left: -7em;
    text-align: center;
    width: 7em;
    margin-top: 12px;
    .music-item__warn{
      font-size: 10px;
    }
  }
  .music-item__content{
    padding-left: 10px;
    padding-right: 10px;
    .music-item__cutter{
      height: 25px;
      border-bottom: 1px solid #ededed;
      .music-cutter{
        position: relative;
        top: 6px;
        .el-slider__runway{
          margin-top: 5px;
          margin-bottom: 5px;
          height: 2px;
        }
      }
    }
    .music-item__info{
      height: 25px;
      margin-top: 10px;
      label{
        float: left;
        font-size: 10px;
        line-height: 1.5em;
        height: 1.5em;
      }
      .music-volume{
        margin-left: 30px;
        .el-slider__runway{
          margin-top: 6px;
          height: 2px;
        }
      }
    }
    .el-slider__bar{
      height: 2px;
    }
    .el-slider__button-wrapper{
      width: 10px;
      height: 10px;
      margin-top: -2px;
      &:before{
        content: '';
        display: inline-block;
        width: 0;
        height: 10px;
        top: 8px;
        left: 4px;
        position: relative;
        z-index: -1;
        border-right: 1px solid #000;
      }
    }
    .el-slider__button{
      width: 8px;
      height: 8px;
      border: 0;
      border-radius: 10px;
    }
  }
  .music-item__controler{
    float: right;
    margin-right: -8em;
    display: flex;
    width: 7em;
    .music-item__ctr{
      margin-top: 15px;
      width: 33%;
      text-align: center;
      height: 30px;
      line-height: 30px;
      background: #f00;
    }
  }
}
</style>
