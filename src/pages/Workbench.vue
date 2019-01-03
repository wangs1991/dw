<template>
  <div class="page-workbench__container">
    <!--工作台的header-->
    <div class="lyt-header__workbench">
      <router-link :to="{name: 'Index'}">
        <div class="header-ele__logo">番茄号</div>
      </router-link>

      <div class="header-ele__user">
        <img :src="require('../../static/images/avator-cus.png')" alt="">
      </div>

      <div class="header-ele__title">
        我的绘本
      </div>
    </div>
    <!--主要内容-->
    <div class="lyt-block__wraper block-ele__page">
      <div class="switcher-header__ctner">
        <router-link :to="{name: 'Drawer'}"
                     target="_blank" class="editor__btn">
          创作绘本
        </router-link>
        <a class="link-type" href="">全部</a>
        <a class="link-type" href="">已收藏</a>
        <a class="link-type" href="">已购买</a>
      </div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta dignissimos dolores eius esse excepturi explicabo, incidunt ipsa labore mollitia, obcaecati, pariatur porro praesentium sunt tempore voluptatum. Alias ea nobis numquam!
    </div>
  </div>
</template>

<script>
  export default{
    name: 'workbench',
    data () {
      return {

      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/style/common';

  .lyt-header__workbench{
    @include clear();
    height: 53px;
    line-height: 53px;
    padding: 0 33px;
    border-bottom: 1px solid #AAAAAA;
    .header-ele__logo{
      text-indent: -9999px;
      float: left;
      width: 70px;
      height: 36px;
      background: url('../assets/images/logo.png') no-repeat center center;
      -webkit-background-size: cover;
      background-size: cover;
      margin-top: 8px;
    }
    .header-ele__user{
      float: right;
      width: 40px;
      height: 40px;
      margin-top: 6px;
      border-radius: 40px;
      overflow: hidden;
      box-shadow: 0 0 5px rgba(0, 0, 0, .2);
      img{
        display: block;
        max-width: 100%;
      }
    }
    .header-ele__title{
      font-size: 18px;
      color: #080808;
      text-align: center;
    }
  }

  .block-ele__page{
    .switcher-header__ctner{
      height: 34px;
      padding: 7px 0;
      border-bottom: 1px solid #BBBBBB;
      line-height: 36px;
      .editor__btn{
        float: right;
        border: 1px solid #EB5648;
        border-radius: 4px;
        font-size: 14px;
        line-height: 34px;
        padding-left: 32px;
        padding-right: 32px;
        color: #EB5648;
        text-align: center;
        &:hover{
          background: #EB5648;
          color: #fff;
        }
      }
      .link-type{
        display: inline-block;
        margin-right: 24px;
        font-size: 18px;
        color: #6A6C8A;
      }
    }
  }
</style>
