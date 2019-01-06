<template>
  <div id="app">
    <loading/>
    <router-view/>
    <!-- Put it at the end of App.vue -->
    <dialogs-wrapper wrapper-name="default" />
  </div>
</template>

<script>
  import Loading from './components/loading'

  export default {
    name: 'App',
    components: {
      Loading
    }
  }
</script>

<style>
  html,
  body,
  #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    background: #ffffff;
  }
</style>
