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
        <span class="page-type__item"
              :class="{'active': type === 0}" @click="selecteType({id: 0})">全部</span>
        <span class="page-type__item"
              :class="{'active': type === item.id}"
              v-for="(item, idx) in typeList"
              @click="selecteType(item)"
              :key="idx">
          {{item.type}}
        </span>
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

import {getBookList, getStyles, getSeriesByStyle} from '../server/actions'
export default {
  name: 'SiftList',
  data () {
    return {
      bookName: '',
      type: 0,
      bookList: [],
      typeList: []
    }
  },
  methods: {
    selecteType (item) {
      this.type = item.id
      if (item.id === 0) {
        getBookList().then(data => {
          this.bookList = data
        })
        return false
      }
      getSeriesByStyle({custom: item.id}).then(data => {
        this.bookList = data
      }, () => { }).catch(e => {})
    },
    initTabData () {
      getStyles().then(data => {
        this.typeList = data
      })
    }
  },
  components: {
    BaseHeader,
    BookList
  },
  created () {
    this.$nextTick(() => {
      this.selecteType({id: 0})

      this.initTabData()
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
