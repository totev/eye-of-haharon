<template>
  <div id="app">
    <provider @providerChanged="selectedProvider=$event"/>
    <dropzone :provider="selectedProvider"/>
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
  },
  data() {
    return {
      selectedProvider: null
    }
  },
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
