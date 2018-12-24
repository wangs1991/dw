<template>
  <ul class="pub-books__list">
    <!--可以编辑的书籍列表-->
    <template v-if="allowEdit">
      <li class="book-item__ctner book-style__card"
          v-for="(item, idx) in books"
          :style="{'width': 100 / pageCount + '%'}"
          :data-id="item.id"
          :key="idx">
        <router-link :to="{name: 'Player', query: {id: item.id}}"></router-link>
        <div class="book-item__wraper">
          <div class="book-item__cover">
            <img :src="item.cover" :alt="item.name" :title="item.name">
          </div>
          <div class="book-item__name">{{item.name}}</div>
          <div class="book-item__syncover">
            <!--操作的封面-->
            <div class="book-asyncover__btns">
              <router-link :to="{name: 'Player', query: {id: item.id}}"
                           target="_blank">
                <button class="pub-button__normal size-mini">预览作品</button>
              </router-link>
              <router-link :to="{name: 'Drawer', query: {id: item.id}}"
                           target="_blank">
                <button class="pub-button__normal size-mini">编辑作品</button>
              </router-link>
            </div>
            <!--价格作者信息-->
            <div class="book-syncover__info">
              <div class="price">价格：¥9.99</div>
              <div class="author">作者：浪德</div>
            </div>
          </div>
        </div>
      </li>
    </template>
    <!--不可编辑的书籍列表-->
    <template v-else>
      <li class="book-item__ctner"
          v-for="(item, idx) in books"
          :style="{'width': 100 / pageCount + '%'}"
          :data-id="item.id"
          :key="idx">
        <router-link :to="{name: 'Player', query: {id: item.id}}">
          <div class="book-item__wraper">
            <div class="book-item__cover">
              <img :src="item.cover" :alt="item.name" :title="item.name">
            </div>
          </div>
        </router-link>
      </li>
    </template>
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
    /*除去首页外，其他可编辑书籍页面的样式*/
    &.book-style__card{
      .book-item__wraper{
        position: relative;
        z-index: 1;
        overflow: hidden;
        box-shadow: 0 0 5px rgba(0, 0, 0, .1);
        .book-item__name{
          position: relative;
          z-index: 2;
          bottom: 0;
          left: 0;
          right: 0;
          font-size: 14px;
          color: #6A7686;
          text-align: center;
          height: 47px;
          line-height: 47px;
          padding-left: 10px;
          padding-right: 10px;
          @include els();
          transition: all ease .1s;
        }
        .book-item__syncover{
          position: absolute;
          z-index: 10;
          left: 0;
          bottom: -100%;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, .8);
          transition: all ease .2s;
          transition-delay: .1s;
          .book-asyncover__btns{
            position: absolute;
            z-index: 12;
            width: 120px;
            margin-left: -60px;
            left: 50%;
            top: 70px;
            text-align: center;
            opacity: 0;
            transition: all ease .1s;
            transition-delay: .3s;
            button{
              margin-bottom: 28px;
            }
          }
          .book-syncover__info{
            position: absolute;
            left: 0;
            right: 0;
            bottom: -40px;
            background: #fff;
            line-height: 1em;
            padding: 10px 20px;
            display: flex;
            font-size: 14px;
            color: #6A7686;
            .price{
              width: 40%;
            }
            .author{
              width: 55%;
              text-align: right;
            }
          }
        }

        &:hover{
          .book-item__name{
            bottom: -48px;
          }
          .book-item__syncover{
            bottom: 0;
            .book-asyncover__btns{
              opacity: 1;
            }
            .book-syncover__info{
              bottom: 6px;
            }
          }
        }
      }
    }
  }
}
</style>
