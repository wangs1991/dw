<template>
  <div class="header-panel__content">
    <div class="header-button__back">
      <i class="theme-icons theme-icon__back"></i>编辑
    </div>
    <div class="header-func__wraper">
      <div class="header-button__item">全屏</div>
      <div class="header-button__item">分享</div>
      <div class="header-button__item">设置</div>
      <div class="header-button__mode">
        <i class="theme-icons theme-icon__back"></i> 自动播放
      </div>
    </div>
    <div class="header-text__title">
      <h2>小美过生日</h2>
      <p>By: 浪德</p>
    </div>
  </div>
</template>

<style lang="scss">
  @import "../../assets/style/common";
  .header-panel__content{
    @include clear();
    padding: 12px 0;
    .header-button__back{
      float: left;
      border: 1px solid #8A8B93;
      color: #8A8B93;
      font-size: 18px;
      padding: 4px 15px;
      line-height: 1em;
    }

    .header-text__title{
      float: left;
      color: #101010;
      font-weight: normal;
      padding-left: 20px;
      h2{
        font-weight: normal;
        font-size: 20px;
        line-height: 24px;
        margin: 0;
      }
      p{
        font-size: 12px;
        margin: 0;
      }
    }

    .header-func__wraper{
      float: right;
    }
    .header-button__mode{
      display: inline-block;
      border: 1px solid #8A8B93;
      color: #8A8B93;
      font-size: 18px;
      padding: 4px 15px;
      line-height: 1em;
    }
    .header-button__item{
      vertical-align: middle;
      display: inline-block;
      width: 24px;
      height: 24px;
      background: #f00;
      text-indent: -999px;
      overflow: hidden;
      margin-left: 18px;
      margin-right: 18px;
      cursor: pointer;
    }
  }
</style>
