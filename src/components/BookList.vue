<template>
  <ul class="pub-books__list">
    <li class="book-item__ctner"
        v-for="(item, idx) in books"
        :style="{'width': 100 / pageCount + '%'}"
        :data-id="item.id"
        :key="idx">
      <div class="book-item__wraper">
        <div class="book-item__cover">
          <img :src="item.cover" :alt="item.name" :title="item.name">
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'PubList',
  props: {
    books: {
      type: Array,
      default () {
        return []
      },
      requried: true
    },
    allowEdit: {
      type: Boolean,
      deafault: true
    },
    pageCount: {
      type: Number,
      default: 4
    }
  }
}
</script>

<style lang="scss">
@import '../assets/style/common';
.pub-books__list{
  @include clear();
  margin-left: -28px;
  .book-item__ctner{
    float: left;
    margin-bottom: 20px;
    .book-item__wraper{
      margin-left: 28px;
      .book-item__cover{
        width: 100%;
        height: 0;
        padding-bottom: 80%;
        overflow: hidden;
        img{
          display: block;
          width: 100%;
        }
      }
    }
  }
}
</style>
