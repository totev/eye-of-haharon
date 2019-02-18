<template>
  <div id="app">
    <provider />
    <dropzone />
  </div>
</template>

<script>
import Dropzone from './components/Dropzone.vue'
import Provider from './components/provider/Provider.vue'

export default {
  name: 'app',
  components: {
    Dropzone,
    Provider
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
