<template>
  <div class="control-panle__container" v-if="styleContent">
    <h5 class="control-panle__title">图片样式</h5>

    <ul class="control-panel__attrs">
      <li class="control-item__wraper">
        <el-upload
          class="upload-editor"
          drag
          ref="uploader"
          action="/tomato/uploadImg"
          :on-success="readImg">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </li>
    </ul>
    <ul class="control-panel__attrs">
      <li class="control-item__wraper">
        <div class="control-lyt__group">
          <label for="">透明度:</label>
          <el-slider
            :min="0"
            :max="100"
            :step="1"
            :show-tooltip="true"
            :show-input-controls="false"
            v-model="imgOpacity">
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

require('./attrubute.scss')
export default {
  data () {
    return {
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
    imgOpacity: {
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
    }
  },
  methods: {
    readImg (response, file, fileList) { // 图片上传完获取图片信息
      this.modifyStyle('src', globalConfig.host + '/' + response.data)
    },
    modifyStyle (key, value) {
      let ret

      if (value) {
        ret = value
      }

      Bus.$emit('assetImgModifyed', {
        id: this.assetData.id,
        key: key,
        value: ret
      })
    }
  },
  components: {
    Operate
  }
}
</script>
