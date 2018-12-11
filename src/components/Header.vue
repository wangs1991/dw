<template>
  <div class="header-panel__container">
    <div class="header-panel__logo">
      LOGO
    </div>
    <div class="header-panel__func">
      <div class="header-panel__wraper">
        <a class="header-item__link" href="">新建</a>
        <router-link class="header-item__link"
                     :to="{name: 'Player'}"
                     target="_blank">预览</router-link>
        <div class="header-item__link" @click="dwByFile">发布</div>
      </div>
    </div>
    <div class="header-panel__switcher">
      <div class="header-panel__swBtn"
           @click="showStyleChooser"
           :style="{'background-image': 'url('+ currentSerieData.cover +')'}"></div>
    </div>
  </div>
</template>

<script>
import {fileTransfer} from '../assets/js/Utils'
export default {
  name: 'v-header',
  data () {
    return {
    }
  },
  computed: {
//    最终数据
    publishData () {
      return this.$store.state.Editor.currentEditData
    },
    //    当前选择的风格系列数据
    currentSerieData () {
      return this.$store.state.Editor.currentStyleData
    }
  },
  methods: {
    showStyleChooser () {
      this.$store.commit('updataStyleChooser', true)
    },
    dwByFile () {
      var a = document.createElement('a')

      a.download = +new Date()
      a.href = URL.createObjectURL(fileTransfer(this.publishData, 'json', false))

      a.click()
    }
  }
}
</script>

<style lang="scss">
  .header-panel__container{
    position: relative;
    z-index: 1;
    .header-panel__logo{
      width: 120px;
      float: left;
    }
    .header-panel__func{
      position: absolute;
      z-index: 1;
      left: 120px;
      right: 280px;
      .header-panel__wraper{
        padding-left: 20px;
        padding-right: 20px;
        .header-item__link{
          display: inline-block;
          padding-left: 10px;
          padding-right: 10px;
          text-decoration: none;
          color: inherit;
        }
      }
    }
    .header-panel__switcher{
      width: 80px;
      float: right;
      background: #efefef;
      .header-panel__swBtn{
        height: 40px;
        border-radius: 5px;
        margin: 8px 10px;
        background: #fff;
        background-repeat: no-repeat;
        -webkit-background-size: cover;
        background-size: cover;
        cursor: pointer;
      }
    }
  }
</style>
