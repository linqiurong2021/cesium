<template>
  <div id="app">
    <AirpaneFly />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    'Map': ()=> import('./components/Map'),
    'AirpaneFly': ()=> import('./components/AirpaneFly')
  }
}
</script>

<style>
#app {
}
</style>
