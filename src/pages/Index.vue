<template>
  <div class="page-home__container">
    <!--头部导航-->
    <BaseHeader/>
    <!--首屏介绍页面-->
    <div class="lyt-block__wraper home-first__main">
      <div class="lyt-cols2__wraper">
        <div class="lyt-image__left">
          <img :src="mainInfo.cover" alt="">
        </div>
        <div class="lyt-text__right">
          <h1>{{mainInfo.slogan}}</h1>
          <p v-html="mainInfo.description"></p>
          <div class="user-c__button">
            <router-link :to="{name: 'Drawer'}">
              <button class="pub-button__emphasize">开始创作</button>
            </router-link>
          </div>
        </div>
      </div>

      <ul class="home-features__main">
        <li v-for="(item, idx) in mainInfo.features" :key="idx">
          <i :style="{'background-image': 'url('+ item.icon +')'}"
             class="feature-item__icon"
             :title="item.slogan"></i>
          <h2 class="feature-item__title">{{item.slogan}}</h2>
          <p class="feature-item__description" v-html="item.description"></p>
        </li>
      </ul>
    </div>

    <!--精选原创绘本-->
    <div class="lyt-block__wraper home-books__main">
      <h2 class="pub-title__main">精选原创绘本</h2>
      <p class="pub-title__sub">使用番茄号创作的绘本</p>
      <el-tabs v-model="bookType"
               :stretch="true"
               ref="bookTypes"
               :activeName="activeName"
               @tab-click="switchBooks">
        <el-tab-pane v-for="item in tabsData"
                     :key="item.label"
                     :label="item.type"
                     :name="item.id+''">
          <BookList :books="bookList"></BookList>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--应用场景介绍-->
    <div class="lyt-block__wraper home-scenes__main">
      <h2 class="pub-title__main">应用场景</h2>
      <p class="pub-title__sub">绘本创作  教学资源  亲自互动  绘本出售</p>
      <ul class="home-scenes__list">
        <li v-for="(scene, idx) in scenes"
            class="home-scene__item"
            :key="idx">
          <div class="home-scene__item-wraper">
            <div class="home-scene__item-cover"
                 :style="{'background-image': 'url('+ scene.cover +')'}"></div>
            <h3 class="home-scene__item-role">{{scene.role}}</h3>
            <p class="home-scene__item-info" v-html="scene.description"></p>
          </div>
        </li>
      </ul>
    </div>

    <!--产品介绍-->
    <div class="home-intro__main">
      <h2 class="pub-title__main">产品介绍</h2>
      <div class="intro-item"
           v-for="(item, idx) in introductions"
           :key="idx">
        <div class="lyt-block__wraper">
          <div class="intro-image">
            <img :src="item.cover" :alt="item.title">
          </div>
          <div class="intro-infoes">
            <h2 class="intro-title">{{item.title}}</h2>
            <ul class="intro-list">
              <li v-for="(f, idx) in item.features"
                  :key="idx">
                {{f}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!--合作单位-->
    <Cooperator/>
    <!--底部-->
    <BaseFooter/>
  </div>
</template>

<script>
import {getBookList, getStyles, getSeriesByStyle} from '../server/actions'

import BaseHeader from '../components/BaseHeader.vue'
import BookList from '../components/BookList.vue'
import BaseFooter from '../components/BaseFooter.vue'
import Cooperator from '../components/Cooperator.vue'

export default {
  name: 'Index',
  data () {
    return {
      mainInfo: {
        cover: require('../../static/images/editor-show.png'),
        slogan: '绘本创作  就选番茄号',
        description: '教育在改变，番茄号为您的教育注入创新与智能</br>绘本创作.交互课件制作.教学资源创作，就用番茄号',
        features: [{
          icon: require('../assets/images/feature-1.png'),
          slogan: '绘本创作更简单',
          description: '强大素材库，AI智能配音、抠图，<br/>无需绘画基础，每个家长朋友都可以<br/>为孩子创作绘本'
        }, {
          icon: require('../assets/images/feature-2.png'),
          slogan: '全阶段教学资源更丰富',
          description: '2016年国家提倡去小学化幼儿园教学改革<br/>绘本教学，游戏教学，活动教学为3大教学模式<br/>每个教师都可以创造更丰富个性的教学资源'
        }, {
          icon: require('../assets/images/feature-3.png'),
          slogan: '绘本发售标准化',
          description: '一键发布到亚马逊，当当，京东<br/>绘本出版社定期签售优质绘本<br/>激励国内绘本作家，促进原创绘本行业发展<br/>每位绘本作家都能发售原创绘本'
        }]
      },
      bookType: 'first',
      bookList: [],
      scenes: [
        {
          cover: require('../../static/images/default_img.jpg'),
          role: '教师',
          description: '为课堂授课创作有针对性的互动课件；<br/>' +
          '为远程授课创作可交互可协同的课件；<br/>' +
          '个性化教学资源随时随地创建。'
        }, {
          cover: require('../../static/images/default_img.jpg'),
          role: '绘本作家',
          description: '草稿分镜也能丰富多彩；<br/>' +
          '分享发行，为您的作品找到真实的观众；<br/>' +
          '绘本电商链接，让您的作品实现价值。'
        }, {
          cover: require('../../static/images/default_img.jpg'),
          role: '学生',
          description: '随心创作，让你的创造力成为作品；<br/>' +
          '自我介绍可以做成绘本啦；<br/>' +
          '与全球小伙伴组成团队，协作完成绘本。'
        }, {
          cover: require('../../static/images/default_img.jpg'),
          role: '家长',
          description: '记录给孩子讲述的故事；<br/>' +
          '与孩子一起创作绘本<br/>' +
          '每个家长小伙伴都应该给孩子送一本绘本。'
        }
      ],
      introductions: [
        {
          cover: require('../../static/images/editor-show.png'),
          title: '海量素材',
          features: [
            '1000万+优质原创插画素材',
            '1000万+精选绘本模版',
            '满足教育、亲子及商业场景用途',
            '简单易用，绘本创作无门槛'
          ]
        },
        {
          cover: require('../../static/images/editor-show.png'),
          title: 'AI配音帮大忙',
          features: [
            '创作绘本，输入文字，即可产生配音',
            '众多明星配音任你选择',
            '好的配音让您的绘本更有趣'
          ]
        },
        {
          cover: require('../../static/images/editor-show.png'),
          title: 'AI智能抠图，所见即所得',
          features: [
            '智能抠图，全网素材、手绘素材、照片素材随时用；',
            '无需美术功底，只需基础软件操作；',
            '云端安全存储，随时随地任性创作；',
            '原创模版素材永久归属作者，并受版权保护。'
          ]
        },
        {
          cover: require('../../static/images/editor-show.png'),
          title: '多阅读平台分发出售',
          features: [
            '一键上架亚马逊，当当网，腾讯阅读，京东阅读；',
            '优质绘本出版社定期签约出版热门绘本；',
            '自营绘本商店，线上线下绘本馆，社交媒体，海外大赛，触手可及；',
            '拥有番茄号，您只需安心创作。'
          ]
        }
      ],
      tabsData: [],
      activeName: ''
    }
  },
  methods: {
    switchBooks (tab, event) {
      this.getSublist(tab.name)
    },
    getSublist (id) {
      getSeriesByStyle({custom: id}).then(data => {
        this.bookList = data
      }, () => { }).catch(e => {})
    },
    initTabData () {
      getStyles().then(data => {
        this.tabsData = data
        this.$nextTick(() => {
          this.$refs.bookTypes.setCurrentName(data[0].type)
          this.activeName = data[0].id + ''
          this.getSublist(data[0].id)
        })
      })
    }
  },
  components: {
    BaseHeader,
    BookList,
    BaseFooter,
    Cooperator
  },
  mounted () {
    this.$nextTick(() => {
      getBookList().then(data => {
        this.bookList = data
      })

      this.initTabData()
    })
  }
}
</script>

<style lang="scss">
  @import '../assets/style/common.scss';

  .page-home__container{
    background: #fff;
    min-height: 100%;
    /*主标题*/
    .pub-title__main{
      font-size: 48px;
      font-weight: normal;
      color: #51525E;
      text-align: center;
      margin: 0 0 6px 0;
    }
    /*副标题*/
    .pub-title__sub{
      font-size: 16px;
      color: #6A6C8A;
      text-align: center;
      margin: 0;
    }

    .lyt-block__wraper{
      margin-top: 26px;
      margin-bottom: 80px;
    }

    /*首屏介绍*/
    .home-first__main{
      .lyt-image__left img{
        display: block;
        width: 100%;
      }
      .lyt-text__right{
        text-align: center;
        h1{
          color: #000000;
          font-size: 36px;
          font-weight: normal;
          margin-bottom: 60px;
          margin-top: 40px;
        }
        p{
          font-size: 20px;
          color: #080808;
          line-height: 40px;
        }
        .user-c__button{
          margin-top: 60px;
        }
        .pub-button__emphasize{
          font-size: 18px;
        }
      }

      .home-features__main{
        @include clear();
        margin-top: 80px;
        li{
          float: left;
          width: 33.333%;
          text-align: center;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          padding: 0 10px;
          .feature-item__icon{
            display: inline-block;
            width: 91px;
            height: 91px;
            margin: 0 auto;
            -webkit-background-size: 80% auto;
            background-size: 80% auto;
            background-repeat: no-repeat;
            background-position: center center;
          }
          .feature-item__title{
            font-size: 18px;
            color: #101010;
            line-height: 1em;
            font-weight: normal;
            margin-top: 3px;
            margin-bottom: 15px;
          }
        .feature-item__description{
            color: #6A6C8A;
            font-size: 18px;
            line-height: 2em;
          }
        }
      }
    }

    /*第二屏绘本展示*/
    .home-books__main{
      .el-tabs__nav{
        width: 100%;
      }
      .el-tabs__item{
        width: 20%;
        font-size: 16px;
        color: #51525E;
        text-align: center;
        &:nth-child(2){
          text-align: left;
        }
        &:last-child{
          text-align: right;
        }
        &:focus{
          outline: 0;
          border: 0;
        }
      }
      .el-tabs__nav-wrap::after{
        height: 1px;
        background: #BBBBBB;
      }
      .el-tabs__active-bar{
        height: 2px;
        background: #EB5648;
      }
    }

    /*第三屏，应用场景介绍*/
    .home-scenes__main{
      .home-scenes__list{
        @include clear();
        margin-top: 60px;
        margin-left: -28px;
      }
      .home-scene__item{
        width: 25%;
        float: left;
        .home-scene__item-wraper{
          margin-left: 28px;
        }
        .home-scene__item-cover{
          width: 100%;
          height: 0;
          padding-bottom: 80%;
          -webkit-background-size: cover;
          background-size: cover;
          background-repeat: no-repeat;
        }
        .home-scene__item-role{
          font-size: 20px;
          line-height: 1em;
          margin-top: 15px;
          margin-bottom: 5px;
          color: #101010;
        }
        .home-scene__item-info{
          font-size: 14px;
          color: #6A6C8A;
          line-height: 2em;
          margin-top: 0;
          margin-bottom: 0;
        }
      }
    }

    /*产品介绍*/
    .home-intro__main{
      .intro-item{
        margin-top: 80px;
        border-bottom: 1px solid #BBBBBB;
        &:last-child{
          border-bottom: 0;
        }
        .intro-image{
          width: 50%;
          img{
            display: block;
            width: 82%;
            margin: 0 auto;
          }
        }
        .lyt-block__wraper{
          @include clear();
        }
        .intro-infoes{
          padding-top: 60px;
          .intro-title{
            font-size: 24px;
            color: #EB5648;
            font-weight: normal;
          }
          .intro-list{
            font-size: 16px;
            color: #101010;
            line-height: 1.5em;
            text-align: left;
          }
        }
        &:nth-child(even){
          .intro-image{
            float: left;
          }
          .intro-infoes{
            padding-left: 65%;
          }
        }
        &:nth-child(odd){
          .intro-image{
            float: right;
          }
          .intro-infoes{
            padding-left: 10%;
          }
        }
      }
    }
  }
</style>
