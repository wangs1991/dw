<template>
  <ul class="book-list__ctner">
    <li class="book-item__ctner" v-for="(item, idx) in bookList" :key="idx">
      <div class="book-item__cover">
        <img :src="item.cover" alt="">
      </div>
      <div class="book-item__name">
        {{item.name}}
      </div>
    </li>
  </ul>
</template>

<script>
import {getBookList} from '../server/actions'
export default {
  name: 'BookList',
  data () {
    return {
      bookList: []
    }
  },
  created () {
    this.$nextTick(() => {
      getBookList().then(data => {
        this.bookList = data
      })
    })
  }
}
</script>

<style lang="scss">
  @import '../assets/style/common';
  .book-list__ctner{
    width: 980px;
    margin: 20px auto 20px;
    @include clear();
    .book-item__ctner{
      width: 25%;
      float: left;
      box-sizing: border-box;
      padding: 0 10px;
      margin-bottom: 20px;
      .book-item__cover{
        width: 100%;
        height: 0;
        padding-bottom: 50%;
        overflow: hidden;
        img{
          display: block;
          width: 100%;
        }
      }
      .book-item__name{
        font-size: 16px;
        margin-top: 10px;
      }
    }
  }
</style>
