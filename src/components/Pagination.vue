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
          <span class="pagination-operate__button" @click="delPage">删除</span>
          <span class="pagination-operate__button" @click="copyPage">复制</span>
        </div>
      </span>
      <div class="pagination-item__number">第 {{idx+1}} 页</div>
    </div>

    <div class="pagination-item__pager" @click="addPage">
      <span class="pagination-item__preview"></span>
      <div class="pagination-item__number">点击新增</div>
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
    return {
      current: 0
    }
  },
  computed: {
    list () {
      return this.$store.state.Editor.bookData
    }
  },
  methods: {
    addPage () {
      this.$store.commit('appendPage')
      this.$nextTick(function () {
        this.current = this.list.length - 1
      })
    },
    selectPage (n) {
      this.$nextTick(function () {
        this.current = n
        this.$store.commit('setCurrentPage', n)
      })
    },
    copyPage () {

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
  padding: 10px;
  /*position: absolute;
  z-index: 10000;
  left: 120px;
  right: 280px;
  background: #fff;
  overflow: auto;
  border-top: 1px solid #ddd;*/
  .pagination-item__pager{
    margin: 10px 5px;
    &:hover .pagination-item__preview,
    &.active .pagination-item__preview {
      background: #f00;
      transform: scale(1.1);
    }
    .pagination-item__preview{
      display: block;
      height: 55px;
      background: #ddd;
      margin-bottom: 10px;
      border-radius: 2px;
      box-shadow: 0 0 3px rgba(0, 0, 0, .2);
      position: relative;
      .pagination-operate__wraper{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        display: flex;
        .pagination-operate__button{
          font-size: 14px;
          line-height: 2em;
          cursor: pointer;
          text-align: center;
        }
      }
    }
    .pagination-item__number{
      font-size: 10px;
      text-align: center;
    }
  }
}
</style>
