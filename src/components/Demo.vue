<template>
   <component :is="componentName" />
</template>

<script>

export default {
  name: "Demo",
  data() {
    return {};
  },
  components: {
    'LoadTianditu': ()=> import('./demo/LoadTianditu')
  },
  data() {
    return {
      componentName: 'LoadTianditu'
    }
  },
};
</script>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>