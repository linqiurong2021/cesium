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
    'Fly': ()=> import('./components/tutorials/Fly'), // 飞
    'Buildings': ()=> import('./components/tutorials/Buildings'), // 飞
    'Demo': ()=> import('./components/Demo'), // 飞
  },

  data(){
    return {
      componentName: 'Demo'
    }
  }
}
</script>

<style>
#app {
}
</style>
