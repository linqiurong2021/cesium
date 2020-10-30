<template>
  <div ref='cesiumContainer' id="cesiumContainer">
    <div id="slider"></div>
  </div>
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
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
        }),
        infoBox: false,
        animation: false // 控制场景动画的播放速度控件
      };
      let viewer = new Cesium.Viewer(this.$refs.cesiumContainer, viewerOption);
      viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
      //
      var layers = viewer.imageryLayers;

      // Provides tiled imagery using the Cesium ion REST API.
      // REST API的瓦片服务
      var earthAtNight = layers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 3812 })
      );
      // 设置在左边显示还是右边显示  Cesium.ImagerySplitDirection.RIGHT
      earthAtNight.splitDirection = Cesium.ImagerySplitDirection.LEFT; // Only show to the left of the slider.

      var slider = document.getElementById("slider");
      // Gets or sets the position of the Imagery splitter within the viewport. Valid values are between 0.0 and 1.0.
      // 设置显示范围 0.0 - 1.0 之间
      viewer.scene.imagerySplitPosition = slider.offsetLeft / slider.parentElement.offsetWidth;
      // Handles user input events. Custom functions can be added to be executed on when the user enters input.
      // 自定义事件
      var handler = new Cesium.ScreenSpaceEventHandler(slider);
      // Represents a mouse move event.
      // 鼠标移动
      handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      // Represents a change of a two-finger event on a touch surface.
      // 双指移动
      handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);
      // Represents a mouse left button down event.
      // 左键按下
      handler.setInputAction( () => { moveActive = true; }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      // Represents the start of a two-finger event on a touch surface.
      // 双指按下
      handler.setInputAction( () => { moveActive = true; }, Cesium.ScreenSpaceEventType.PINCH_START);
      // Represents a mouse left button up event.
      // 左键放开
      handler.setInputAction( () => { moveActive = false; }, Cesium.ScreenSpaceEventType.LEFT_UP);
      // Represents the end of a two-finger event on a touch surface.
      // 双指放开
      handler.setInputAction( () => { moveActive = false; }, Cesium.ScreenSpaceEventType.PINCH_END);


      // 

      var moveActive = false;

      function move(movement) {
      
        if (!moveActive) {
          return;
        }
        // 
        var relativeOffset = movement.endPosition.x;
        // 百分比
        var splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
        // 
        slider.style.left = 100.0 * splitPosition + "%";
        // 重置显示范围
        viewer.scene.imagerySplitPosition = splitPosition;
      }
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
#slider {
  position: absolute;
  left: 50%;
  top: 0px;
  background-color: #d3d3d3;
  width: 5px;
  height: 100%;
  z-index: 9999;
}

#slider:hover {
  cursor: ew-resize;
}
</style>