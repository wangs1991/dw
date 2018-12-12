<template>
  <div class="control-container__main"
       :style="renderPos"
       ref="DragPanel"
       v-show="isPoped">
    <div class="control-container__header">
      <div class="control-header__title" @mousedown.left="mouseStartHandler">{{title}}</div>
      <i class="control-btns__close" @click="closePanle">×</i>
    </div>
    <div class="control-container__body">
      <slot></slot>
    </div>
    <div class="hiden-field">{{renderPos}}{{x}}</div>
  </div>
</template>

<script>
export default {
  name: 'dragable-panel',
  data () {
    return {
      renderPos: {},
      isDown: false,
      panelOffset: {},
      panelStartGap: {},
      x: 0
    }
  },
  props: {
    title: {
      type: String,
      default: '属性面板'
    },
    isPoped: {
      type: Boolean,
      default: false
    },
    styleString: {
      type: Object,
      default () {
        return {
          left: '10px',
          top: '10px'
        }
      }
    }
  },
  methods: {
    mouseStartHandler (e) {
      e.preventDefault()
      this.isDown = true
      this.panelOffset = $(this.$refs.DragPanel).offset()
      this.panelStartGap.top = e.pageY - this.panelOffset.top
      this.panelStartGap.left = e.pageX - this.panelOffset.left
    },
    mouseMoveHandler (e) {
      if (!this.isDown) {
        return false
      }
      this.x = e.pageX
      this.renderPos.top = e.pageY - this.panelStartGap.top + 'px'
      this.renderPos.left = e.pageX - this.panelStartGap.left + 'px'
    },
    initStyle () {
      let i

      for (i in this.styleString) {
        if (this.styleString.hasOwnProperty(i)) {
          this.$set(this.renderPos, i, this.styleString[i])
        }
      }
    },
    closePanle () {
      this.$emit('close')
    }
  },
  mounted () {
    let self = this

    $('body').on('mouseup', () => {
      self.isDown = false
    })
    document.addEventListener('mousemove', (e) => {
      self.mouseMoveHandler(e)
    })

    this.$nextTick(this.initStyle)
  },
  beforeDestroy () {
    document.addEventListener('mousemove', null)
  }
}
</script>

<style lang="scss">
  .control-container__main {
    width: 280px;
    height: 400px;
    position: fixed;
    background: #fff;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 500;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .3);
    overflow: hidden;
    .control-container__header {
      background: #cdcdcd;
      cursor: move;
      font-size: 8px;
      height: 20px;
      line-height: 20px;
      padding-left: 5px;
      padding-right: 5px;
      position: relative;
      .control-btns__close{
        position: absolute;
        right: 0;
        top: 0;
        font-size: 18px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
      }
    }
    .control-container__body {
      padding: 15px;
      overflow: hidden;
      overflow-y: auto;
      height: 360px;
    }
    .hiden-field{
      display: none!important;
    }
  }
</style>
