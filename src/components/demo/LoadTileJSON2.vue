<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import * as widget from "cesium/Widgets/widgets.css";
export default {
  name: "LoadTileJSON2",
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
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.clock.currentTime = new Cesium.JulianDate(2457522.154792);

      var tileset = new Cesium.Cesium3DTileset({
        url: "/assets/tile/batchTableHierarchy.json",
      });
      viewer.scene.primitives.add(tileset);
      viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0));
      // 着色  // https://cesium.com/docs/cesiumjs-ref-doc/Cesium3DTileStyle.html?classFilter=Cesium3DTileStyle
      tileset.style = new Cesium.Cesium3DTileStyle({
        // 定义变量
        // https://github.com/CesiumGS/3d-tiles/tree/master/specification/Styling
        defines: {
          suffix: "regExp('door(.*)').exec(getExactClassName())",
        },
        // 颜色
        color: {
            conditions: [
              ["${suffix} === 'knob'", "color('yellow')"],
              ["${suffix} === ''", "color('lime')"],
              ["${suffix} === null", "color('gray')"],
              ["true", "color('blue')"],
            ],
          },
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