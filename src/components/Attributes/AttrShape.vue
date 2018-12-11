<template>
  <div class="control-panle__container" v-if="styleContent">
    <h5 class="control-panle__title">形状</h5>

    <ul class="control-panel__attrs">
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">宽高:</label>
          <div class="control-input__group">
            <div class="ts-ipt-wp">
              <input type="text" v-model="width">
            </div>
            <div class="ts-ipt-wp">×</div>
            <div class="ts-ipt-wp">
              <input type="text" v-model="height">
            </div>
          </div>
        </div>
      </li>
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">底色:</label>
          <div class="control-input__group" style="position: relative;z-index: 3030;">
            <color-picker :show="colorPickerbg"
                          :color="backgroundColor"
                          @input="updateBgValue"></color-picker>
            <input class="ts-ipt" type="text"
                   :style="{background: backgroundColor}"
                   @focus="toggleCPicker(1)">
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
            v-model="opacity">
          </el-slider>
        </div>
      </li>
    </ul>
    <ul class="control-panel__attrs" style="border-top: 1px solid #ddd;">
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">边框色:</label>
          <div class="control-input__group" style="position: relative;z-index: 3000;">
            <color-picker :show="colorPickerbc"
                          :color="borderColor"
                          @input="updateBcValue"></color-picker>
            <input class="ts-ipt" type="text"
                   :style="{background: borderColor}"
                   @focus="toggleCPicker(2)">
          </div>
        </div>
      </li>
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">样式:</label>
          <div class="control-input__group">
            <v-select :options="borderStlies"
                      :value="borderStyle"
                      :style="{width: '100%','font-family': borderStyle.value}"
                      :onChange="selectStyle"
                      :maxHeight="'250px'">
              <template slot="option" slot-scope="option">
                <div :style="{'border-bottom': '3px '+ option.value +' '+borderColor, width: '100%', height: '30px'}"> {{option.label}} </div>
              </template>
            </v-select>
          </div>
        </div>
      </li>
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">描边:</label>
          <div class="control-input__group">
            <div class="border-panel">
              <i class="edf-icons ic-attr-relate btn-relateipt"
                 :class="{'active': widthRel}"
                 @click="setRel('width')"></i>
              <input type="text" name="bdtop" v-model="borderTopWidth">
              <input type="text"  name="bdright" v-model="borderRightWidth">
              <input type="text" name="bdbottom" v-model="borderBottomWidth">
              <input type="text" name="bdleft" v-model="borderLeftWidth">
            </div>
          </div>
        </div>
      </li>
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">圆角:</label>
          <div class="circle-panel">
            <i class="edf-icons ic-attr-relate btn-relateipt"
               @click="setRel('radius')"
               :class="{'active': radiusRel}"></i>
            <div class="circle-item">
              <input type="text"
                     class="radius-ipt"
                     name="topLeft"
                     v-model="borderTopLeftRadius">
              <input type="text"
                     class="radius-ipt"
                     name="topRight"
                     v-model="borderTopRightRadius">
            </div>
            <div>
              <input type="text"
                     class="radius-ipt"
                     name="bottomLeft"
                     v-model="borderBottomLeftRadius">
              <input type="text"
                     class="radius-ipt"
                     name="bottomRight"
                     v-model="borderBottomRightRadius">
            </div>
          </div>
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

require('./attrubute.scss')

let borderStlies = [{
  value: 'solid',
  label: '实线'
}, {
  value: 'dashed',
  label: '虚线'
}, {
  value: 'dotted',
  label: '点线'
}]

export default {
  data () {
    return {
      colorPickerbg: false,
      colorPickerbc: false,
      borderStlies: borderStlies,
      radiusRel: false,
      widthRel: false
    }
  },
  computed: {
    assetData () {
      return this.$store.state.Editor.attributeData
    },
    styleRoot () { // 必要的文字样式抽离
      let ret
      try {
        ret = this.assetData.style.root
      } catch (e) {
        ret = false
      }
      return ret
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
    width: {
      get () {
        let ret = 250

        if (this.styleRoot.width) {
          ret = this.styleRoot.width
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.width = parseFloat(v, 10) || 250
          return false
        }
        this.modifyStyle('width', v + 'px')
      }
    },
    height: {
      get () {
        let ret = 250

        if (this.styleRoot.height) {
          ret = this.styleRoot.height
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.height = parseFloat(v, 10) || 250
          return false
        }
        this.modifyStyle('height', v + 'px')
      }
    },
    backgroundColor: {
      get () {
        let ret = 'rgba(0, 0, 0, 0.5)'

        if (this.styleContent.backgroundColor) {
          ret = this.styleContent.backgroundColor
        }
        return ret
      },
      set (v) {
        this.modifyStyle('backgroundColor', v)
      }
    },
    opacity: {
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
    borderStyle: {
      get () {
        let value = 'solid'
        let ret = {
          value: 'solid',
          label: '实线'
        }

        if (this.styleContent.borderStyle) {
          value = this.styleContent.borderStyle
          ret = {
            value: value,
            label: _.find(borderStlies, n => {
              return n.value === value
            }).label
          }
        }
        return ret
      },
      set (v) {
        this.modifyStyle('borderStyle', v.value)
      }
    },
    borderColor: {
      get () {
        let ret = '#000'

        if (this.styleContent.borderTopColor) {
          ret = this.styleContent.borderTopColor
        }
        return ret
      },
      set (v) {
        this.modifyStyle('borderColor', v)
      }
    },
    borderTopWidth: {
      get () {
        let ret = 0

        if (this.styleContent.borderTopWidth) {
          ret = this.styleContent.borderTopWidth
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.borderTopWidth = parseFloat(v, 10) || 0
          return false
        }
        if (this.widthRel) {
          this.modifyStyle('borderRightWidth', v + 'px')
          this.modifyStyle('borderBottomWidth', v + 'px')
          this.modifyStyle('borderLeftWidth', v + 'px')
        }
        this.modifyStyle('borderTopWidth', v + 'px')
      }
    },
    borderRightWidth: {
      get () {
        let ret = 0

        if (this.styleContent.borderRightWidth) {
          ret = this.styleContent.borderRightWidth
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.borderRightWidth = parseFloat(v, 10) || 0
          return false
        }
        if (this.widthRel) {
          this.modifyStyle('borderTopWidth', v + 'px')
          this.modifyStyle('borderBottomWidth', v + 'px')
          this.modifyStyle('borderLeftWidth', v + 'px')
        }
        this.modifyStyle('borderRightWidth', v + 'px')
      }
    },
    borderBottomWidth: {
      get () {
        let ret = 0

        if (this.styleContent.borderBottomWidth) {
          ret = this.styleContent.borderBottomWidth
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.borderBottomWidth = parseFloat(v, 10) || 0
          return false
        }
        if (this.widthRel) {
          this.modifyStyle('borderTopWidth', v + 'px')
          this.modifyStyle('borderRightWidth', v + 'px')
          this.modifyStyle('borderLeftWidth', v + 'px')
        }
        this.modifyStyle('borderBottomWidth', v + 'px')
      }
    },
    borderLeftWidth: {
      get () {
        let ret = 0

        if (this.styleContent.borderLeftWidth) {
          ret = this.styleContent.borderLeftWidth
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.borderLeftWidth = parseFloat(v, 10) || 0
          return false
        }
        if (this.widthRel) {
          this.modifyStyle('borderTopWidth', v + 'px')
          this.modifyStyle('borderRightWidth', v + 'px')
          this.modifyStyle('borderBottomWidth', v + 'px')
        }
        this.modifyStyle('borderLeftWidth', v + 'px')
      }
    },
    borderTopLeftRadius: {
      get () {
        let ret = 0

        if (this.styleContent.borderTopLeftRadius) {
          ret = this.styleContent.borderTopLeftRadius
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.borderTopLeftRadius = parseFloat(v, 10) || 0
          return false
        }
        if (this.radiusRel) {
          this.modifyStyle('borderTopRightRadius', v + 'px')
          this.modifyStyle('borderBottomLeftRadius', v + 'px')
          this.modifyStyle('borderBottomRightRadius', v + 'px')
        }
        this.modifyStyle('borderTopLeftRadius', v + 'px')
      }
    },
    borderTopRightRadius: {
      get () {
        let ret = 0

        if (this.styleContent.borderTopRightRadius) {
          ret = this.styleContent.borderTopRightRadius
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.borderTopRightRadius = parseFloat(v, 10) || 0
          return false
        }
        if (this.radiusRel) {
          this.modifyStyle('borderTopLeftRadius', v + 'px')
          this.modifyStyle('borderBottomLeftRadius', v + 'px')
          this.modifyStyle('borderBottomRightRadius', v + 'px')
        }
        this.modifyStyle('borderTopRightRadius', v + 'px')
      }
    },
    borderBottomLeftRadius: {
      get () {
        let ret = 0

        if (this.styleContent.borderBottomLeftRadius) {
          ret = this.styleContent.borderBottomLeftRadius
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.borderBottomLeftRadius = parseFloat(v, 10) || 0
          return false
        }
        if (this.radiusRel) {
          this.modifyStyle('borderTopLeftRadius', v + 'px')
          this.modifyStyle('borderTopRightRadius', v + 'px')
          this.modifyStyle('borderBottomRightRadius', v + 'px')
        }
        this.modifyStyle('borderBottomLeftRadius', v + 'px')
      }
    },
    borderBottomRightRadius: {
      get () {
        let ret = 0

        if (this.styleContent.borderBottomRightRadius) {
          ret = this.styleContent.borderBottomRightRadius
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (v === '') {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.borderBottomRightRadius = parseFloat(v, 10) || 0
          return false
        }
        if (this.radiusRel) {
          this.modifyStyle('borderTopLeftRadius', v + 'px')
          this.modifyStyle('borderTopRightRadius', v + 'px')
          this.modifyStyle('borderBottomLeftRadius', v + 'px')
        }
        this.modifyStyle('borderBottomRightRadius', v + 'px')
      }
    }
  },
  methods: {
    setRel (t) {
      let ret

      if (t === 'radius') {
        this.radiusRel = !this.radiusRel
        if (this.radiusRel) {
          ret = Math.max(this.borderTopLeftRadius, this.borderTopRightRadius, this.borderBottomLeftRadius, this.borderBottomRightRadius)

          this.borderTopLeftRadius = ret
          this.borderTopRightRadius = ret
          this.borderBottomLeftRadius = ret
          this.borderBottomRightRadius = ret
        }
      }
      if (t === 'width') {
        this.widthRel = !this.widthRel
        if (this.widthRel) {
          ret = Math.min(this.borderTopWidth, this.borderRightWidth, this.borderBottomWidth, this.borderLeftWidth)

          this.borderTopWidth = ret
          this.borderRightWidth = ret
          this.borderBottomWidth = ret
          this.borderLeftWidth = ret
        }
      }
    },
    toggleCPicker (t) {
      if (t === 1) {
        this.colorPickerbg = !this.colorPickerbg
        return false
      }
      this.colorPickerbc = !this.colorPickerbc
    },
    updateBgValue (c) {
      this.colorPickerbg = false
      this.backgroundColor = c
    },
    updateBcValue (c) {
      this.colorPickerbc = false
      this.borderColor = c
    },
    selectStyle: (function () {
      let old

      return _.debounce(function (v) { // 字号选择完成
        if (old && old.value === v.value) {
          return false
        }
        old = v
        this.borderStyle = v
      }, 300, {
        'leading': false,
        'trailing': true})
    })(),
    modifyStyle (key, value) {
      let ret

      /* 根据传入的key。来判断需要应用的value */
      /* switch (key) {
        case 'fontWeight':
          ret = this.styleContent.fontWeight === 'bold' ? 'normal' : 'bold'
          break
        case 'fontStyle':
          ret = this.styleContent.fontStyle === 'italic' ? 'normal' : 'italic'
          break
      } */
      if (value) {
        ret = value
      }

      Bus.$emit('assetShapeModifyed', {
        id: this.assetData.id,
        key: key,
        value: ret
      })
    }
  },
  components: {
    ColorPicker,
    VSelect,
    Operate
  }
}
</script>
