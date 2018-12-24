<template>
  <div class="lyt-footer__block">
    <div class="lyt-block__wraper">
      <dl class="block-help">
        <dt>
          使用帮助
        </dt>
        <dd>
          绘本创作教程
        </dd>
        <dd>
          番茄号使用教程
        </dd>
        <dd>
          创作大咖分享
        </dd>
      </dl>
      <dl class="block-product">
        <dt>产品服务</dt>
        <dd>
          产品下载
        </dd>
        <dd>
          产品建议
        </dd>
        <dd>
          安装教程
        </dd>
      </dl>
      <dl class="block-folow">
        <dt>关注我们</dt>
        <dd class="wx-code">
          <img :src="wxCode" alt="关注我们">
        </dd>
      </dl>
      <dl class="block-contact">
        <dt>
          联系我们
        </dt>
        <dd>
          593762813  交流群
        </dd>
        <dd>
          010-593762813
        </dd>
        <dd>
          metoovr@163.com
        </dd>
        <dd>
          北京市朝阳区兆维大厦
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseFooter',
    data () {
      return {
        wxCode: require('../../static/images/wxcode.jpg')
      }
    }
  }
</script>

<style lang="scss">
  @import "../assets/style/common";

  .lyt-footer__block {
    background: #464545;
    color: #A4A4A4;
    overflow: hidden;
    .lyt-block__wraper{
      display: flex;
      padding-left: 100px;
      padding-right: 100px;
      margin-top: 0;
      margin-bottom: 30px;
      dl{
        width: 25%;
        color: #A4A4A4;
        dt{
          font-size: 20px;
          margin-bottom: 48px;
        }
        .wx-code{
          width: 230px;
          margin-left: -65px;
          img{
            display: block;
            max-width: 100%;
          }
        }
        dd{
          margin: 0;
          font-size: 18px;
          margin-bottom: 24px;
        }
      }
    }
  }
</style>
