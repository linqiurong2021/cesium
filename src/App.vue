<template>
  <div id="app">
    <component :is="componentName" />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    'Map': ()=> import('./components/Map')
  },

  data(){
    return {
      componentName: 'Map'
    }
  }
}
</script>

<style>
#app {
}
</style>
