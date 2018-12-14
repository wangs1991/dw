<template>
  <div class="music-panel__item">
    <div class="music-item__label">
      <div>音频属性</div>
      <div class="music-item__warn">（全部页面有效）</div>
    </div>
    <div class="music-item__controler" v-show="item && item.resource">
      <span class="music-item__ctr" @click="palyeMusic">P</span>
      <span class="music-item__ctr" @click="delResource">D</span>
      <span class="music-item__ctr">
        <el-upload
          action="/tomato/uploadImg"
          :before-upload="fileCheck"
          :on-success="refreshResource">
          <el-button size="medium " type="primary">R</el-button>
        </el-upload>
      </span>
    </div>
    <div class="music-item__content" v-if="item && item.resource">
      <audio ref="player">
        <source :src="item.resource">
      </audio>
      <div class="music-item__cutter">
        <el-slider
          class="music-cutter"
          range
          :disabled="isPlaying"
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
    <div class="music-item__content" v-else>
      <el-upload
        action="/tomato/uploadImg"
        :before-upload="fileCheck"
        :on-success="refreshResource">
        <el-button class="empty-uploader" size="small" type="primary">点击上传音频</el-button>
      </el-upload>
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
        max: 5000,
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
        this.musicSteper.min = n[0]
        this.musicSteper.max = n[1]
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
        return {}
//        return {
//          resource: require('../../static/audio/demo.mp3'),
//          start: 0,
//          end: 2500,
//          volumn: 100,
//          isLoop: false,
//          type: ''
//        }
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
        self.$refs.player.addEventListener('timeupdate', function () {
          if (this.currentTime * 1000 >= self.musicSteper.max) {
            self.$refs.player.pause()
            self.isPlaying = false
          }
        })
      }
      audio.src = this.item.resource
    },
    refreshResource (response) {
      this.$emit('refresh', globalConfig.host + '/' + response.data)
    },
    delResource () {
      this.$emit('delete')
    },
    fileCheck (file) {
      var etcReg = /\.(ogg|mp3)/i

      return etcReg.test(file.name)
    }
  },
  mounted () {
    this.initMusic()
  }
}
</script>

<style lang="scss">
.music-panel__item{
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
    height: 60px;
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
    .empty-uploader,
    .el-upload{
      width: 100%;

      height: 60px;
      font-size: 16px;
      color: #333;
      background: transparent;
      border: 0;
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
