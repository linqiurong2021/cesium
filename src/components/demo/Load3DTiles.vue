<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import * as widget from "cesium/Widgets/widgets.css";
export default {
  name: "CesiumScene",
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
    
      let viewerOption = {
        geocoder: false, // 地理位置查询定位控件
        homeButton: false, // 默认相机位置控件
        timeline: false, // 时间滚动条控件
        navigationHelpButton: false, // 默认的相机控制提示控件
        fullscreenButton: false, // 全屏控件
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        baseLayerPicker: false, // 底图切换控件
        animation: false // 控制场景动画的播放速度控件
      };
      
      let viewer = new Cesium.Viewer(this.$el, viewerOption);
      viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
      viewer.scene.globe.depthTestAgainstTerrain = false
;

      var tileset = new Cesium.Cesium3DTileset({
        url: "http://192.168.110.201:8088/tileset.json",
      });
     
      // 模型偏移
      viewer.scene.primitives.add(tileset);


      tileset.readyPromise
        .then(function (tileset) {
          var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
          var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
          var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 400);
          var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
          tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

          viewer.zoomTo( tileset);

        })
        .otherwise(function (error) {
          console.log(error);
        });
    }
  }
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