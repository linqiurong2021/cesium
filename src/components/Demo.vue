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
    'Layers': ()=> import('./demo/Layers'),
    'ArcgisMapServer': ()=> import('./demo/ArcgisMapServer'), // 加载MapServer下的所有图层
    'ArcgisMapService': ()=> import('./demo/ArcgisMapService') // 可加载某个图层 需要WMS支持
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