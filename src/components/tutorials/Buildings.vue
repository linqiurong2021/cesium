<template>
 <div   ref="cesiumContainer"
    id="cesiumContainer">

 </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYWVmNTE1Zi02ZmYwLTQ4YjktYmZmZi01NWM2ZjQ4YTkzZDQiLCJpZCI6Mjk4NzEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTI4MTYyNTJ9.GzaornBtyu8pW9Z-VeFL0rkTqiBabE_2hvDu5HDqTCQ'
import * as widget from "cesium/Widgets/widgets.css";
export default {
  name: 'App',
  mounted() {
    this.loadMap()
  },
  methods: {
    loadMap() {
      const viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
        terrainProvider: Cesium.createWorldTerrain()
      });
      // Add Cesium OSM Buildings.
      const buildingsTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
      // Fly the camera to Denver, Colorado at the given longitude, latitude, and height.
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-104.9965, 39.74248, 4000)
      });
      // 过滤
      buildingsTileset.style = new Cesium.Cesium3DTileStyle({
        // Create a style rule to control each building's "show" property.
        show: {
          conditions : [
            // Any building that has this elementId will have `show = false`.
            ['${elementId} === 332469316', false],
            ['${elementId} === 332469317', false],
            ['${elementId} === 235368665', false],
            ['${elementId} === 530288180', false],
            ['${elementId} === 530288179', false],
            // If a building does not have one of these elementIds, set `show = true`.
            [true, true]
          ]
        },
        // Set the default color style for this particular 3D Tileset.
        // For any building that has a `cesium#color` property, use that color, otherwise make it white.
        color: "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')"
      });

    }
  }
}
</script>

<style scoped>

</style>