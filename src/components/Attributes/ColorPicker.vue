<template>
  <div class="cpicker-panel__main" v-show="show">
    <sketch-picker v-model="ncolor" @input="updateValue" class="my-vcpicker"></sketch-picker>
    <div class="cp-btn__confirm" @click="getColor">确定</div>
  </div>
</template>

<script>
import {Sketch} from 'vue-color'
export default {
  data () {
    return {
      ncolor: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.5
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true,
      defalut: false
    },
    color: {
      type: String,
      default: 'rgba(0, 0, 0, 0.5)'
    }
  },
  methods: {
    updateValue (c) {
      this.ncolor = c.rgba
    },
    getColor () {
      let ret

      ret = 'rgba(' + this.ncolor.r + ', ' + this.ncolor.g + ', ' + this.ncolor.b + ', ' + this.ncolor.a + ')'
      this.$emit('input', ret)
    },
    computeColor () {
      // eslint-disable-next-line
      let rg = /[^rgba\(\) ]/ig
      let ret = this.color.match(rg).join('').split(',')

      this.ncolor.r = ret.shift()
      this.ncolor.g = ret.shift()
      this.ncolor.b = ret.shift()
      this.ncolor.a = ret.shift()
    }
  },
  components: {
    'sketch-picker': Sketch
  },
  created () {
    this.computeColor()
  }
}
</script>

<style labg="scss">
  .cpicker-panel__main{
    position: absolute;
    z-index: 500;
    right: -5px;
    top: 35px;
    width: 220px;
    box-sizing: initial;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 8px 16px rgba(0, 0, 0, .15);
  }
  .my-vcpicker{
    box-shadow: none!important;
    border-bottom: 1px solid #dddddd;
  }
  .cp-btn__confirm{
    cursor: pointer;
    width: 100%;
    text-align: center;
    font-size: 14px;
    line-height: 2em;
  }
</style>
