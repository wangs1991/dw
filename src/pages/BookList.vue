<template>
  <div class="page-books__container">
    <!--头部导航-->
    <BaseHeader/>

    <div class="lyt-block__wraper">
      <div class="page-books__search">
        <el-input placeholder="请输入内容" v-model="bookName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="page-books__types">
        <span class="page-type__item">全部</span>
        <span class="page-type__item">中国古代</span>
        <span class="page-type__item">卡通动漫</span>
        <span class="page-type__item">经典绘本</span>
        <span class="page-type__item">大卫系列</span>
      </div>
    </div>

    <!--绘本列表-->
    <div class="lyt-block__wraper">
      <BookList :books="bookList" :allowEdit="true"></BookList>
    </div>
  </div>
</template>

<script>
import BaseHeader from '../components/BaseHeader.vue'
import BookList from '../components/BookList.vue'

import {getBookList} from '../server/actions'
export default {
  name: 'SiftList',
  data () {
    return {
      bookName: '',
      bookList: []
    }
  },
  components: {
    BaseHeader,
    BookList
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
  .page-books__search{
    width: 450px;
    margin: 0 auto 45px;
  }
  .page-books__types{
    text-align: center;
    font-size: 0;
    .page-type__item{
      display: inline-block;
      font-size: 16px;
      color: #6A6C8A;
      margin-left: 16px;
      margin-right: 16px;
      cursor: pointer;
      &.active,
      &:hover{
        color: #EB5648;
      }
    }
  }
</style>
