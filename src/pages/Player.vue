<template>
  <div class="player-layout__main">
    <component :is="player"></component>
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
  import {platform} from '../assets/js/Utils'
  import QRious from 'qrious'

  import PcPlayer from '../components/Player/PcPlayer.vue'
  import MobilePlayer from '../components/Player/MobilePlayer.vue'

  export default {
    data () {
      return {
        isShare: false
      }
    },
    computed: {
      player () {
        if (platform() === 'mobile') {
          return MobilePlayer
        } else {
          return PcPlayer
        }
      }
    },
    methods: {
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
    }
  }
</script>

<style lang="scss">
  .player-layout__main{
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
