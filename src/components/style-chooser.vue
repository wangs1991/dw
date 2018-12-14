<template>
  <el-dialog
    class="dialog-style-chooser"
    :title="'Hi @' + dialogTitle + ',   请选择素材风格'"
    :top="'6vh'"
    :visible.sync="typePrompt"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="1000px"
    center>
    <h2 class="el-dialog__subtitle">
      (选择相应的风格后，场景页/背景/人物/文字/道具/形状等素材将会切换为对应风格的素材)
    </h2>
    <div class="template-container__scroll">
      <div class="template-list__group">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item) in styles"
                        class="template-item__ctner"
                        :key="item.id"
                        @click="chooseType(item)">
            <label class="template-item__title" :for="'tpl' + item.id">
              {{item.type}}
            </label>
            <input type="radio"
                   name="tpl"
                   v-model="selectedStyle"
                   :id="'tpl' + item.id"
                   :value="item.id"/>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="template-container__scroll">
      <div class="template-series__group">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item) in seriesList"
                        :style="{'background-image': 'url('+ item.cover +')'}"
                        :key="item.id">
            <label class="template-item__title"
                   :for="'series' + item.id">
              {{item.name}}
            </label>
            <input type="radio"
                   name="series"
                   v-model="selectedSeries"
                   :id="'series' + item.id"
                   :value="item.id"/>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {getSeriesByStyle} from '../server/actions'
require('swiper/dist/css/swiper.css')
export default {
  name: 'style-chooser',
  data () {
    return {
      dialogTitle: 'Vonshine',
      selectedStyle: '',
      selectedSeries: '',
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 20,
        freeMode: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      seriesList: []
    }
  },
  props: {
    styles: {
      type: Array,
      default () {
        return {}
      }
    }
  },
  watch: {
    selectedSeries (n) {
      let ret = {
        style: n
      }

      this.styles[this.selectedStyle].series.forEach(n => {
        if (this.selectedSeries === n.id) {
          ret.series = n
        }
      })

//      通知store关闭风格选择框
      this.$store.commit('updataStyleChooser')
      // 选中当前风格和系列数据
      this.$store.commit('updateCurrentBookConfData', ret)
    },
    selectedStyle () {
      // 根据选择的风格选择对应的系列
      getSeriesByStyle({custom: this.selectedStyle}).then(data => {
        if (data.length < 1) {
          //      通知store关闭风格选择框
          this.$store.commit('updataStyleChooser')
          // 选中当前风格和系列数据
          this.$store.commit('updateCurrentBookConfData', {
            style: this.selectedStyle
          })
        } else {
          this.seriesList = data
        }
      }, () => {
          //      通知store关闭风格选择框
          this.$store.commit('updataStyleChooser')
          // 选中当前风格和系列数据
          this.$store.commit('updateCurrentBookConfData', {
            style: this.selectedStyle
          })
      }).catch(e => {})
    }
  },
  computed: {
    typePrompt: {
      get () {
        return this.$store.state.Editor.styleChooserFlag
      },
      set (n) {
        this.$store.commit('updataStyleChooser', n)
      }
    }
  },
  methods: {
    chooseType (data) {
      this.selectedStyle = data.id
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style lang="scss">
  /*风格系列选择，列表*/
  .template-container__scroll {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: hidden;
    overflow-x: auto;
    padding-top: 10px;
    padding-left: 10px;
    margin-left: -10px;
    input[type="radio"] {
      display: none;
    }
    * {
      transition: all ease .12s;
    }
    .template-list__group {
      margin-bottom: 10px;
      &:after {
        content: '';
        display: table;
        clear: both;
      }
      .swiper-wrapper{
        padding: 10px;
      }
      .template-item__ctner {
        width: 186px;
        height: 330px;
        overflow: hidden;
        box-shadow: 0 0 8px rgba(0, 0, 0, .2);
        float: left;
        margin-right: 40px;
        border-radius: 6px;
        position: relative;
        background: url('../../static/images/login-bg.jpg') no-repeat;
        -webkit-background-size: cover;
        background-size: cover;
        &:hover,
        &.active {
          box-shadow: 0 0 12px rgba(0, 0, 0, .2);
          transform: scale(1.02);
        }
        .template-item__title {
          position: absolute;
          z-index: 2;
          left: 0;
          right: 0;
          height: 80px;
          bottom: 0;
          background: #fff;
          text-align: center;
          font-size: 14px;
          line-height: 70px;
          &:before {
            content: '';
            display: inline-block;
            border-top: 20px solid transparent;
            border-right: 130px solid #fff;
            border-bottom: 20px solid #fff;
            border-left: 130px solid transparent;
            position: absolute;
            top: -35px;
            left: -50px;
          }
        }
      }
    }
    .template-series__group {
      margin-left: -10px;
      .swiper-wrapper{
        padding: 10px;
      }
      &:after {
        content: '';
        display: table;
        clear: both;
      }
      .swiper-slide {
        width: 186px;
        height: 100px;
        overflow: hidden;
        box-shadow: 0 0 8px rgba(0, 0, 0, .2);
        float: left;
        margin-right: 15px;
        border-radius: 6px;
        position: relative;
        background-repeat: no-repeat;
        -webkit-background-size: cover;
        background-size: cover;
        &:hover,
        &.active {
          box-shadow: 0 0 12px rgba(0, 0, 0, .2);
          transform: scale(1.02);
        }
        .template-item__title {
          position: absolute;
          z-index: 2;
          left: 0;
          right: 0;
          height: 100%;
          bottom: 0;
          background: rgba(255, 255, 255, .5);
          color: #000;
          text-align: center;
          font-size: 18px;
          line-height: 100px;
        }
      }
    }
  }

  /*el-dialog样式定制*/
  .dialog-style-chooser {
    background: rgba(255, 255, 255, .85);
    .el-dialog__headerbtn {
      font-size: 28px;
      right: -50px;
      top: -10px;
    }
    .el-dialog {
      background: transparent;
      box-shadow: none;
    }
    .el-dialog__header {
      text-align: left;
    }
    .el-dialog__subtitle {
      font-weight: normal;
      font-size: 14px;
    }
    .el-dialog__body {
      padding-top: 0;
    }
  }
</style>
