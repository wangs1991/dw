<template>
  <div class="control-panle__container" v-if="styleContent">
    <h5 class="control-panle__title">文字样式</h5>
    <ul class="control-panel__attrs">
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">字号:</label>
          <input-select :list="fontSizeOpts"
                        :value="fontSize"
                        @change="selectFs"></input-select>
        </div>
      </li>
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">字体:</label>
          <v-select :options="fontFamOpts"
                    :value="fontFamily"
                    :style="{'font-family': fontFamily.value}"
                    :onChange="selectFf"
                    :maxHeight="'250px'">
            <template slot="option" slot-scope="option">
              <span :style="{'font-family': option.value}">{{option.label}}</span>
            </template>
          </v-select>
        </div>
      </li>
    </ul>

    <div class="control-text__group">
      <div class="control-text__icon">
        <i class="edf-icons ic-txt-bold"
           :class="{active: styleContent.fontWeight === 'bold'}"
           @click="modifyStyle('fontWeight')"></i>
      </div>
      <div class="control-text__icon">
        <i class="edf-icons ic-txt-italic"
           :class="{active: styleContent.fontStyle === 'italic'}"
           @click="modifyStyle('fontStyle')"></i>
      </div>
      <div class="control-text__icon">
        <i class="edf-icons ic-txt-unline"
           :class="{active: styleContent.textDecoration === 'underline'}"
           @click="modifyStyle('textDecoration', 'underline')"></i>
      </div>
      <div class="control-text__icon">
        <i class="edf-icons ic-txt-del"
           :class="{active: styleContent.textDecoration === 'line-through'}"
           @click="modifyStyle('textDecoration', 'line-through')"></i>
      </div>
      <div class="control-text__icon">
        <i class="edf-icons ic-txt-left"
           :class="{active: styleContent.textAlign === 'left'}"
           @click="modifyStyle('textAlign', 'left')"></i>
      </div>
      <div class="control-text__icon">
        <i class="edf-icons ic-txt-center"
           :class="{active: styleContent.textAlign === 'center'}"
           @click="modifyStyle('textAlign', 'center')"></i>
      </div>
      <div class="control-text__icon">
        <i class="edf-icons ic-txt-right"
           :class="{active: styleContent.textAlign === 'right'}"
           @click="modifyStyle('textAlign', 'right')"></i>
      </div>
      <div class="control-text__icon">
        <i class="edf-icons ic-txt-rotate"
           @click="resizeFrame()"></i>
      </div>
    </div>

    <ul class="control-panel__attrs">
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">颜色:</label>
          <div class="control-input__group" style="position: relative;z-index: 3000;">
            <color-picker :show="colorPicker"
                          :color="fontColor"
                          @input="updateValue"></color-picker>
            <input class="ts-ipt" type="text"
                   :style="{background: fontColor}"
                   @focus="toggleCPicker">
          </div>
        </div>
      </li>
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">透明度:</label>
          <el-slider
            :min="0"
            :max="100"
            :step="1"
            :show-tooltip="true"
            :show-input-controls="false"
            v-model="fontOpacity">
          </el-slider>
        </div>
      </li>
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">行间距:</label>
          <el-slider
            :min="0"
            :max="150"
            :step="2"
            :show-tooltip="true"
            :show-input-controls="false"
            v-model="fontLHeight">
          </el-slider>
        </div>
      </li>
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">字间距:</label>
          <el-slider
            :min="0"
            :max="100"
            :step="1"
            :show-tooltip="true"
            :show-input-controls="false"
            v-model="fontLSpace">
          </el-slider>
        </div>
      </li>
    </ul>
    <operate :id="assetData.id"></operate>
  </div>
</template>

<script>
import Bus from '../Bus'
import Operate from './AssetOperate.vue'
import VSelect from 'vue-select'
import ColorPicker from './ColorPicker.vue'
import inputSelect from '../inputs/input&select.vue'

import fSizes from '../../../static/database/fontSize'
import fFamilies from '../../../static/database/fontFamily'

require('./attrubute.scss')
export default {
  data () {
    return {
      fontSizeOpts: fSizes,
      fontFamOpts: fFamilies,
      colorPicker: false
    }
  },
  computed: {
    assetData () {
      return this.$store.state.Editor.attributeData
    },
    styleContent () { // 必要的文字样式抽离
      let ret
      try {
        ret = this.assetData.style.content
      } catch (e) {
        ret = false
      }
      return ret
    },
    fontSize () { // 字号根据传入参数计算
      let ret = {}
      let value

      if (this.styleContent.fontSize) {
        value = this.styleContent.fontSize
        ret.value = parseInt(value, 10)
        ret.label = value
      }
      return ret
    },
    fontFamily () { // 字体据传入参数计算
      let ret = {}
      let value

      if (this.styleContent.fontFamily) {
        value = this.styleContent.fontFamily
        value = value.value ? value.value : value
        ret.value = value
        ret.label = _.find(fFamilies, n => {
          return n.value === value
        }).label
      }
      return ret
    },
    fontOpacity: {
      get () {
        let ret = 100

        if (this.styleContent.opacity) {
          ret = this.styleContent.opacity * 100
        }
        return ret
      },
      set (v) {
        if (v > 100) {
          v = 100
        }
        this.modifyStyle('opacity', v / 100)
      }
    },
    fontLHeight: {
      get () {
        let ret = 18

        if (this.styleContent.lineHeight) {
          ret = parseFloat(this.styleContent.lineHeight, 10) / 2
        }
        return ret
      },
      set (v) {
        if (v > 150) {
          v = 150
        }
        this.modifyStyle('lineHeight', v * 2 + 'px')
      }
    },
    fontLSpace: {
      get () {
        let ret = 0

        if (this.styleContent.letterSpacing) {
          ret = parseFloat(this.styleContent.letterSpacing, 10)
        }
        return ret
      },
      set (v) {
        if (v > 150) {
          v = 150
        }
        this.modifyStyle('letterSpacing', v + 'px')
      }
    },
    fontColor: {
      get () {
        let ret = '#000'

        if (this.styleContent.color) {
          ret = this.styleContent.color
        }
        return ret
      },
      set (v) {
        this.modifyStyle('color', v)
      }
    }
  },
  methods: {
    toggleCPicker () {
      this.colorPicker = !this.colorPicker
    },
    updateValue (c) {
      this.colorPicker = false
      this.fontColor = c
    },
    resizeFrame () { // 长宽兑换兑换方法
      Bus.$emit('assetTxtResize', this.assetData.id)
    },
    selectFs: _.debounce(function (value) { // 字号选择完成
      let lines
      let perWidth
      let tWidth

      perWidth = parseFloat(this.assetData.style.content.fontSize, 10)
      tWidth = parseFloat(this.assetData.style.root.width, 10)
      lines = perWidth * this.assetData.content.length / tWidth
      lines = Math.ceil(lines)

      Bus.$emit('assetTxtModifyed', {
        id: this.assetData.id,
        key: 'fontSize',
        value: value + 'px'
      })
      Bus.$emit('assetTxtModifyed', { // 更新行高
        id: this.assetData.id,
        key: 'lineHeight',
        value: value * 3 / 2 + 'px'
      })
      Bus.$emit('assetTxtModifyed', {
        id: this.assetData.id,
        key: 'height',
        value: value * 3 / 2 * lines + 'px'
      })
    }, 300, {
      'leading': false,
      'trailing': true}),
    selectFf: (function () {
      let old

      return _.debounce(function (v) { // 字号选择完成
        if (old && old.value === v.value) {
          return false
        }
        old = v

        Bus.$emit('assetTxtModifyed', {
          id: this.assetData.id,
          key: 'fontFamily',
          value: v.value
        })
      }, 300, {
        'leading': false,
        'trailing': true})
    })(),
    modifyStyle (key, value) {
      let ret

      /* 根据传入的key。来判断需要应用的value */
      switch (key) {
        case 'fontWeight':
          ret = this.styleContent.fontWeight === 'bold' ? 'normal' : 'bold'
          break
        case 'fontStyle':
          ret = this.styleContent.fontStyle === 'italic' ? 'normal' : 'italic'
          break
        case 'textDecoration':
          ret = this.styleContent.textDecoration === value ? 'none' : value
          break
        default:
          ret = value || ret
          break
      }

      Bus.$emit('assetTxtModifyed', {
        id: this.assetData.id,
        key: key,
        value: ret
      })
    }
  },
  components: {
    Operate,
    VSelect,
    inputSelect,
    ColorPicker
  }
}
</script>
