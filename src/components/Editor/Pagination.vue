<template>
  <div class="pagination-panel__wraper">
    <!--<div class="pagination-item__pager" :class="{active: current === 0}" @click="selectPage(0)">
      <span class="pagination-item__preview"></span>
      <div class="pagination-item__number">封面</div>
    </div>-->

    <div class="pagination-item__pager"
         v-for="(item, idx) in list"
         :class="{active: current === idx}"
         @click="selectPage(idx)"
         :key="idx">
      <span class="pagination-item__preview">
        <div class="pagination-operate__wraper">
          <span class="pagination-operate__button" @click.stop="delPage">删除</span>
          <span class="pagination-operate__button" @click.stop="copyPage(idx)">复制</span>
        </div>
        <div class="pagination-item__number">{{idx+1}}</div>
      </span>
    </div>

    <div class="pagination-add__wraper"
         @click="addPage">
      <span class="pagination-add__icon"></span>
      <div class="pagination-item__label">新建页面</div>
    </div>

    <!--<div class="pagination-item__pager" :class="{active: current === list.length - 1}" @click="selectPage(list.length - 1)">
      <span class="pagination-item__preview"></span>
      <div class="pagination-item__number">封底</div>
    </div>-->
  </div>
</template>

<script>
export default{
  name: 'pagination',
  data () {
    return { }
  },
  computed: {
    list () {
      return this.$store.state.Editor.bookData
    },
    current () {
      return this.$store.state.Editor.page
    }
  },
  methods: {
    addPage () {
      this.$store.commit('appendPage')
      this.$nextTick(function () {
        this.$store.commit('setCurrentPage', this.list.length - 1)
      })
    },
    selectPage (n) {
      this.$nextTick(function () {
        this.$store.commit('setCurrentPage', n)
      })
    },
    copyPage (idx) {
      this.$store.commit('insertPage', idx)
    },
    delPage () {
      this.$store.commit('deletePage')
    }
  },
  mounted () {
    this.selectPage(0)
  }
}
</script>

<style lang="scss">
.pagination-panel__wraper{
  padding: 10px 0;
  height: 100%;
  overflow: auto;
  /*position: absolute;
  z-index: 10000;
  left: 120px;
  right: 280px;
  background: #fff;
  overflow: auto;
  border-top: 1px solid #ddd;*/
  .pagination-item__pager{
    margin: 7px 0;
    padding: 0 10px;
    &:hover .pagination-item__preview,
    &.active .pagination-item__preview {
      .pagination-item__number{
        color: #EB5648;
      }
    }
    .pagination-item__preview {
      display: block;
      width: 152px;
      height: 93px;
      background: #ddd;
      margin-bottom: 10px;
      position: relative;
      left: 19px;
      cursor: pointer;
      .pagination-operate__wraper {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -30px;
        background: #fff;
        display: flex;
        opacity: 0;
        transition: all ease .2s;
        .pagination-operate__button {
          font-size: 12px;
          line-height: 2em;
          cursor: pointer;
          text-align: center;
          width: 50%;
        }
      }
      &:hover .pagination-operate__wraper {
        bottom: -1px;
        opacity: 1;
      }
      .pagination-item__number{
        font-size: 10px;
        text-align: center;
        position: absolute;
        left: -20px;
        top: 5px;
        font-size: 16px;
        color: #101010;
      }
    }
  }
  .pagination-add__wraper{
    margin-top: 18px;
    border-top: 1px solid #BBBBBB;
    text-align: center;
    padding: 14px 5px;
    font-size: 14px;
    color: #8A8B93;
    cursor: pointer;
    .pagination-add__icon{
      display: inline-block;
      width: 24px;
      height: 24px;
      background: #f00;
    }
    .pagination-item__label{
      display: inline-block;
      vertical-align: top;
      line-height: 24px;
    }
  }
}
</style>
