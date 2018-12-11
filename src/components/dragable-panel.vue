<template>
  <div class="control-container__main"
       :style="applyPos"
       ref="DragPanel"
       @mousedown.left="mouseStartHandler"
       @mousemove="mouseMoveHandler"
       v-show="isPoped">
    <div class="control-container__header">
      属性
      <i class="control-btns__close">×</i>
    </div>
    <div class="control-container__body">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aperiam consectetur distinctio earum eius nihil odio pariatur, perferendis quibusdam vitae. Consequatur distinctio eum exercitationem explicabo molestias, numquam officia repellat sit?
      <slot name="panelContent"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dragable-panel',
  data () {
    return {
      movePos: {},
      isDown: false,
      panelOffset: {},
      panelStartGap: {}
    }
  },
  computed: {
    applyPos () {
      let ret = _.cloneDeep(this.movePos)
      let i

      for (i in this.position) {
        if (this.position.hasOwnProperty(i)) {
          ret[i] = ret[i] || this.position[i]
        }
      }
      return ret
    }
  },
  props: {
    title: {
      type: String,
      default: '属性面板'
    },
    isPoped: {
      type: Boolean,
      default: true
    },
    position: {
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
    mouseStartHandler () {
      debugger
      this.isDown = true
      this.panelOffset = $(this.$refs.DragPanel).offset()
    },
    mouseMoveHandler: (function () {
      return _.debounce(function (e) {
        if (!this.isDown) {
          return false
        }
        console.log(e)
      }, 200, {
        'leading': false,
        'trailing': true})
    })()
  },
  mounted () {
    let self = this

    $('body').on('mouseup', () => {
      self.isDown = false
    })
  }
}
</script>

<style lang="scss">
  .control-container__main {
    width: 280px;
    height: 400px;
    position: absolute;
    background: #fff;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .3);
    .control-container__header {
      background: #cdcdcd;
      cursor: move;
      font-size: 8px;
      height: 20px;
      line-height: 20px;
      padding-left: 5px;
      padding-right: 5px;
      .control-btns__close{
        float: right;
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
      height: 300px;
    }
  }
</style>
