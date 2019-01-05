<template>
  <div class="dialog-common__cover" @click="close">
    <div class="share-float__content">
      <div class="share-content__header">{{bookName}}</div>
      <div class="share-content__body">
        <canvas ref="canvas"></canvas>
      </div>
      <div class="share-content__footer">微信扫码观看</div>
    </div>
  </div>
</template>

<script>
  import QRious from 'qrious'

  export default {
    name: 'ShareDialog',
    methods: {
      close () {
        this.$close()
      }
    },
    mounted () {
      const code = new QRious({
        element: this.$refs.canvas,
        level: 'M'
      })

      code.value = this.url || window.location.href
      code.size = 220
    }
  }
</script>

<style lang="scss">
  .share-float__content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, .3);
    border-radius: 12px;
    width: 30%;
    min-width: 300px;
    margin: 0 auto;
    padding: 15px 20px;
    .share-content__header {
      text-align: center;
      font-size: 20px;
      color: #101010;
      margin-bottom: 60px;
    }
    .share-content__body {
      text-align: center;
      padding-bottom: 20px;
    }
    .share-content__footer {
      font-size: 12px;
      color: #ababab;
      text-align: center;

    }
  }
</style>
