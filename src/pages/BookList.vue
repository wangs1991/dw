<template>
  <div class="container-main__block">
    <router-link class="btn-create" :to="{name: 'Drawer'}">创建绘本^_^</router-link>
    <ul class="book-list__ctner">
      <router-link v-for="(item, idx) in bookList" :key="idx" :to="{name: 'Player', query: {id: item.id, data: item.dataPath}}" target="_blank">
        <li class="book-item__ctner" :data-id="item.id">
          <div class="book-item__cover">
            <img :src="item.cover" alt="">
          </div>
          <div class="book-item__name">
            {{item.name}}
          </div>
        </li>
      </router-link>
    </ul>
  </div>
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
  .container-main__block{
    box-sizing: border-box;
    width: 980px;
    margin: 20px auto 20px;
    height: 100%;
    overflow: auto;
    padding-bottom: 10px;
    .btn-create{
      display: block;
      text-align: center;
      margin-bottom: 15px;
      background: rgba(255, 255, 255, .5);
      border-radius: 5px;
      margin-left: 10px;
      margin-right: 10px;
      line-height: 45px;
      &:hover{
        background: rgba(255, 255, 255, 1);
      }
    }
  }
  .book-list__ctner{
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
        padding-bottom: 100%;
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
