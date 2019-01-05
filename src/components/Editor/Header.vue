<template>
  <div class="header-panel__container">
    <div class="header-panel__logo">
      <router-link class="header-logo__txt" :to="{}">
        <i class="theme-icons theme-icon__back"></i>我的绘本
      </router-link>
    </div>
    <div class="header-panel__func">
      <div class="header-panel__wraper">
        <!--右侧功能区-->
        <div class="header-func__right">
          <div class="header-item__link">
            <i class="theme-icons theme-icon__storage"></i>
            <div class="theme-icon__label">素材库</div>
          </div>
          <div class="header-item__link">
            <i class="theme-icons theme-icon__setting"></i>
            <div class="theme-icon__label">外观设置</div>
          </div>
          <div class="header-item__link" @click="previewBook">
            <i class="theme-icons theme-icon__preview"></i>
            <div class="theme-icon__label">预览</div>
          </div>
          <div class="header-item__link" @click="publishBook">
            <i class="theme-icons theme-icon__publish"></i>
            <div class="theme-icon__label">发布</div>
          </div>
        </div>
        <!--左侧功能区-->
        <div class="header-func__left">
          <div class="header-item__link">
            <i class="theme-icons theme-icon__save"></i>
            <div class="theme-icon__label">保存</div>
          </div>
          <div class="header-item__link">
            <i class="theme-icons theme-icon__undo"></i>
            <div class="theme-icon__label">撤销</div>
          </div>
          <div class="header-item__link">
            <i class="theme-icons theme-icon__redo"></i>
            <div class="theme-icon__label">重做</div>
          </div>
          <div class="header-item__link">
            <i class="theme-icons theme-icon__combine"></i>
            <div class="theme-icon__label">组合</div>
          </div>
          <div class="header-item__link">
            <i class="theme-icons theme-icon__break"></i>
            <div class="theme-icon__label">打散</div>
          </div>
          <div class="header-item__link">
            <i class="theme-icons theme-icon__lock"></i>
            <div class="theme-icon__label">锁定</div>
          </div>
        </div>
        <!--中间标题区域-->
        <div class="header-func__title">
          <!--title-->
        </div>
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
import {fileTransfer, generateId} from '../../assets/js/Utils'
import {uploadMeta} from '../../server/actions'
export default {
  name: 'v-header',
  data () {
    return {
    }
  },
  computed: {
    //    最终数据
    publishData () {
      return this.$store.state.Editor.bookData
    },
    //    当前选择的风格系列数据
    currentSerieData () {
      return this.$store.state.Editor.bookBaseConfig
    }
  },
  methods: {
    showStyleChooser () {
      this.$store.commit('updataStyleChooser', true)
    },
    asyncData () {
      // step.1: 上传文件
      var data = new FormData()

      data.append('file', fileTransfer(this.publishData, 'json', false), generateId() + '.js')
      return uploadMeta(data)
    },
    publishBook () {
      this.asyncData().then(res => {
        this.$store.commit('updateCurrentBookConfData', {
          dataPath: res
        })
//        this.$store.commit('tooglePublish', true)
        let query = _.cloneDeep(this.$route.query)

        query.type = 'publish'
        this.$router.push({name: 'Drawer', query: query})
      }, true)
    },
    previewBook () {
      this.asyncData().then(res => {
        window.open('#/player?data=' + res)
      }, true)
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
  @import "../../assets/style/common";
  .header-panel__container{
    position: relative;
    z-index: 1;
    .header-panel__logo{
      width: 194px;
      height: 62px;
      float: left;
      .header-logo__txt{
        display: block;
        font-size: 18px;
        line-height: 62px;
        padding-left: 20px;
        color: rgb(138, 139, 147);
      }
    }
    .header-panel__func{
      position: absolute;
      z-index: 1;
      left: 194px;
      right: 97px;
      .header-panel__wraper{
        @include clear();
        margin-left: -10px;
        header-func__left{
          float: left;
        }
        .header-func__right{
          float: right;
        }
        .header-func__title{
          position: relative;
          z-index: 3;
          right: -40px;
          margin-top: -60px;
          margin-left: auto;
          margin-right: auto;
          font-size: 20px;
          color: #595656;
          line-height: 1.5em;
          max-width: 40%;
          @include els();
        }
        .header-item__link{
          line-height: 1em;
          display: inline-block;
          padding-top: 10px;
          padding-left: 10px;
          padding-right: 10px;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          .theme-icons{
            display: inline-block;
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            font-size: 22px;
            /*font-weight: bold;*/
            /*background: #f0f;*/
            &:hover{
              color: #EB5648;
            }
          }
          .theme-icon__label{
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #595656;
            line-height: 18px;
          }
        }
      }
    }
    .header-panel__switcher{
      width: 97px;
      height: 62px;
      float: right;
      background: #fff;
      .header-panel__swBtn{
        height: 45px;
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
