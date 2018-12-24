<template>
  <div class="lyt-coop__wraper">
    <div class="lyt-block__wraper">
      <div class="coop-content__list">
        <div class="coop-title">
          合作平台
        </div>
        <div class="coop-content__item"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Cooperator'
  }
</script>

<style lang="scss">
  @import '../assets/style/common';
  .lyt-coop__wraper{
    overflow: hidden;
    background: #464545;
    color: #FFFFFF;
    .lyt-block__wraper{
      margin-bottom: 0;
      &:after{
        content: '';
        display: block;
        height: 1px;
        background: #BBBBBB;
      }
    }
    .coop-content__list{
      margin-left: 90px;
      margin-bottom: 30px;
      @include clear();
      .coop-title{
        float: left;
        margin-left: -90px;
        line-height: 60px;
      }
      .coop-content__item{
        margin-left: 60px;
        margin-right: 60px;
        width: 60px;
        height: 60px;
        background: #dedede;
      }
    }
  }
</style>
