<template>
  <div class="music-panel__item">
    <div class="music-item__label">
      <div>{{text.title}}</div>
      <div class="music-item__warn">{{text.label}}</div>
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
      <audio ref="player" muted>
        <source :src="item.resource">
      </audio>
      <div class="music-item__cutter">
        <el-slider
          class="music-cutter"
          range
          :disabled="isPlaying"
          :step="musicSteper.step"
          v-model="mrange"
          :show-file-list="false"
          :max="musicSteper.duration">
        </el-slider>
      </div>
      <div class="music-item__info">
        <label for="">Vol: </label>
        <div class="music-volume">
          <el-slider
            :step="volSteper.stop"
            v-model="volSteper.volume"
            ref="uploader1"
            :max="volSteper.max">
          </el-slider>
        </div>
      </div>
    </div>
    <div class="music-item__content" v-else>
      <el-upload
        action="/tomato/uploadImg"
        :before-upload="fileCheck"
        :show-file-list="false"
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
      this.update()
    },
    musicSteper: {
      deep: true,
      handler: function (n) {
        this.update()
      }
    },
    'item.resource' (n) {
      this.$nextTick(() => {
        this.initMusic()
      })
    }
  },
  props: {
    item: {
      required: false,
      type: Object,
      default () {
        return {}
        /* return {
          resource: require('../../static/audio/demo.mp3'),
          start: 0,
          end: 2500,
          volumn: 100,
          isLoop: false,
          type: ''
        } */
      }
    },
    text: {
      required: true,
      type: Object,
      default () {
        return {
          title: '背景音乐',
          label: '（对所有页面有效）'
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

      console.log(this.item)
      audio.oncanplay = function () {
        self.musicSteper.duration = audio.duration * 1000
      }
      self.$refs.player.addEventListener('timeupdate', function () {
        if (this.currentTime * 1000 >= self.musicSteper.max) {
          self.isPlaying = false
          self.$refs.player.pause()
        }
      })
      audio.src = this.item.resource
    },
    refreshResource (response) {
      this.update(response.data)
      this.initMusic()
    },
    delResource () {
      this.$emit('delete')
    },
    fileCheck (file) {
      var etcReg = /\.(ogg|mp3)/i

      return etcReg.test(file.name)
    },
    update (source) {
      this.$nextTick(function () {
        let ret = {}

        ret.resource = source || this.item.resource
        ret.start = this.musicSteper.min
        ret.end = this.musicSteper.max
        ret.volume = this.volSteper.volume

        this.$emit('update', ret)
      })
    }
  },
  mounted () {
    this.initMusic()
  }
}
</script>

<style lang="scss">
.music-panel__item{
  margin-left: 7em;
  margin-right: 8em;
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
      box-shadow: 0 0 5px rgba(0, 0, 0, .3);
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
