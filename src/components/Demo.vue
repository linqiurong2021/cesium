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
    'LoadTianditu': ()=> import('./demo/LoadTianditu'),
    'LoadBasemap': ()=> import('./demo/LoadBasemap'),
    'Basemap': ()=> import('./demo/Basemap'),
    'Layers': ()=> import('./demo/Layers')
  },
  data() {
    return {
      componentName: 'Layers'
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