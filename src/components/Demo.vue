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
    'TerrainProvider': ()=> import('./demo/TerrainProvider'),
    'ArcgisMapServer': ()=> import('./demo/ArcgisMapServer'), // 加载MapServer下的所有图层
    'ArcgisMapService': ()=> import('./demo/ArcgisMapService'), // 可加载某个图层 需要WMS支持
    'KML_Clustering': ()=> import('./demo/KML_Clustering'),
    'CZML': ()=> import('./demo/CZML'),
    'KMZ': ()=> import('./demo/KMZ'),
    'LoadTileJSON': ()=> import('./demo/LoadTileJSON'),
    'LoadTileJSON2': ()=> import('./demo/LoadTileJSON2'),
     'Load3DTiles': ()=> import('./demo/Load3DTiles'),
  },
  data() {
    return {
      componentName: 'Load3DTiles'
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