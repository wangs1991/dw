<template>
  <div class="hello">
    <!--<h1>{{ msg }}</h1>
    <ul>
      <li>
        <router-link
          :to="{name: 'Drawer'}"
          target="_blank"
        >
          绘本编辑器
        </router-link>
      </li>
      <li>
        <router-link
          :to="{name: 'Player'}"
          target="_blank"
        >
          绘本阅读器
        </router-link>
      </li>
    </ul>-->
    <div style="width: 350px; margin: 10px auto;">
      <AudioItem></AudioItem>
    </div>
  </div>
</template>

<script>
import AudioItem from '../components/AudioItem.vue'
export default {
  name: 'Index',
  data () {
    return {
      msg: 'Hello 番茄派'
    }
  },
  components: {
    AudioItem
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    width: 980px;
    margin: 0 auto;
  }
</style>
