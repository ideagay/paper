<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
import 'normalize.css'

export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 20px;
}
</style>
