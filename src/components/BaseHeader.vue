<template>
  <div class="lyt-header__wraper">
      <router-link :to="{name: 'Index'}">
        <div class="header-ele__logo">番茄号</div>
      </router-link>

    <div class="header-ele__links">
      <a class="header-link__anchor" href="">下载</a>
      <a class="header-link__anchor" href="">创作教程</a>
      <a class="header-link__anchor" href="">创作社区</a>
      <a class="header-link__anchor" href="">绘本分发</a>
      <router-link class="header-link__anchor"
                   :to="{name: 'BookList'}">精选绘本</router-link>
      <router-link class="header-link__button"
                   :to="{name: 'Workbench'}"
                   v-if="udata && udata.name">进入工作台</router-link>
      <a class="header-link__button"
         href="javascript: void(0);"
         @click="register"
         v-else>加入番茄号</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseHeader',
    computed: {
      udata () {
        return this.$store.state.userData
      }
    },
    methods: {
      async register () {
        console.log(this.$register())
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/style/common';

  .lyt-header__wraper{
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

    .header-ele__links{
      font-size: 16px;
      color: #666565;
      float: right;
    }
    .header-link__anchor{
      margin-right: 20px;
      &:hover{
        color: #EB5648;
      }
    }
    .header-link__button{
      display: inline-block;
      width: 138px;
      height: 35px;
      border: 1px solid #EB5648;
      font-size: 14px;
      color: #EB5648;
      text-align: center;
      line-height: 35px;
      &:hover{
        background: #EB5648;
        color: #fff;
      }
    }
  }
</style>
