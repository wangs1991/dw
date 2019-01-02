<template>
  <div id="app">
    <router-view/>
    <!-- Put it at the end of App.vue -->
    <dialogs-wrapper wrapper-name="default" />
  </div>
</template>

<script>
  export default {
    name: 'App'
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
