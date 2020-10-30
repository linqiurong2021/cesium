<template>
  <div id="app">
    <component :is="componentName" />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    'Map': ()=> import('./components/Map'),
    'Models': ()=> import('./components/tutorials/Models'),
    'HeadPitchRoll': ()=> import('./components/tutorials/HeadPitchRoll'), // 航行
    'LocalToFixedFrame': ()=> import('./components/tutorials/LocalToFixedFrame'), // 定位
    'Split': ()=> import('./components/tutorials/Split'), // 分屏
  },

  data(){
    return {
      componentName: 'Split'
    }
  }
}
</script>

<style>
#app {
}
</style>
