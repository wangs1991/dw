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
    <dragable-panle></dragable-panle>
  </div>
</template>

<script>
import DragablePanle from '../components/dragable-panel'

export default {
  name: 'Index',
  data () {
    return {
      msg: 'Hello 番茄派'
    }
  },
  components: {
    DragablePanle
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
