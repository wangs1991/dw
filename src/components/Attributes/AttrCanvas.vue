<template>
  <div class="control-panle__container" v-if="styleContent">
    <h5 class="control-panle__title">纸张</h5>

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
          <label for="">颜色:</label>
          <div class="control-input__group" style="position: relative;z-index: 3000;">
            <color-picker :show="colorPicker"
                          :color="backgroundColor"
                          @input="updateValue"></color-picker>
            <input class="ts-ipt" type="text"
                   :style="{background: backgroundColor}"
                   @focus="toggleCPicker">
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Bus from '../Bus'
import ColorPicker from './ColorPicker.vue'

require('./attrubute.scss')
export default {
  data () {
    return {
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
        ret = this.assetData.style.root
      } catch (e) {
        ret = false
      }
      return ret
    },
    backgroundColor: {
      get () {
        let ret = '#000'

        if (this.styleContent.backgroundColor) {
          ret = this.styleContent.backgroundColor
        }
        return ret
      },
      set (v) {
        this.modifyStyle('backgroundColor', v)
      }
    },
    width: {
      get () {
        let ret = 250

        if (this.styleContent.width) {
          ret = this.styleContent.width
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (!v) {
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

        if (this.styleContent.height) {
          ret = this.styleContent.height
        }
        return parseFloat(ret, 10)
      },
      set (v) {
        if (!v) {
          return false
        }
        if ((parseFloat(v, 10) !== v) && v !== '') {
          this.height = parseFloat(v, 10) || 250
          return false
        }
        this.modifyStyle('height', v + 'px')
      }
    }
  },
  methods: {
    toggleCPicker () {
      this.colorPicker = !this.colorPicker
    },
    updateValue (c) {
      this.colorPicker = false
      this.backgroundColor = c
    },
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

      Bus.$emit('canvasModifyed', {
        id: this.assetData.id,
        key: key,
        value: ret
      })
    }
  },
  components: {
    ColorPicker
  }
}
</script>
