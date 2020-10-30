<template>
  <div>
    <div ref="cesiumContainer" id="cesiumContainer"></div>
    <div class="model-list">
      <div class="item" v-for="(item) in entityDataList" :key="item.id" @click="changeModel(item)"> {{item.name}}</div>
    </div>
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYWVmNTE1Zi02ZmYwLTQ4YjktYmZmZi01NWM2ZjQ4YTkzZDQiLCJpZCI6Mjk4NzEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTI4MTYyNTJ9.GzaornBtyu8pW9Z-VeFL0rkTqiBabE_2hvDu5HDqTCQ'
import * as widget from "cesium/Widgets/widgets.css";
export default {
  name: "CesiumScene",
  data() {
    return {
      viewer: null,
      id: '',
      entityDataList: [
        {url: '/assets/models/Cesium_Air.glb', name: 'Cesium_Air.glb', id: 'Cesium_Air', point: {x:118.1744619, y:  24.503706,z: 1000.0}, headerPitchRoll: {head: 0, pitch:0, roll:0}},
        {url: '/assets/models/GroundVehicle.glb', name: 'GroundVehicle.glb', id: 'GroundVehicle', point: {x:118.1744619, y: 24.503706,z: 0.0}, headerPitchRoll: {head: 45, pitch:0, roll:0}},
        {url: '/assets/models/CesiumBalloon.glb', name: 'CesiumBalloon.glb', id: 'CesiumBalloon', point: {x:118.1744619, y: 24.503706,z: 5000.0}, headerPitchRoll: {head: 0, pitch:0, roll:0}},
        {url: '/assets/models/CesiumMilkTruck.glb', name: 'CesiumMilkTruck.glb', id: 'CesiumMilkTruck1', point: {x:118.1744619, y: 24.503706,z: 0.0}, headerPitchRoll: {head: 90, pitch:0, roll:0}},
        {url: '/assets/models/Cesium_Man.glb', name: 'Cesium_Man.glb', id: 'Cesium_Man', point: {x:118.1744619, y: 24.503706,z: 0.0}, headerPitchRoll: {head: 0, pitch:0, roll:0}},
        // {url: '/assets/models/CesiumMilkTruck.gltf', name: 'CesiumMilkTruck.gltf', id: 'CesiumMilkTruck', point: {x:118.1744619, y: 24.503706,z: 0.0}, headerPitchRoll: {head: 0, pitch:0, roll:0}},
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 度数转弧度
    degreesToRadians(degree) {
      return Cesium.Math.toRadians(degree)
    },
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
      
      let viewer = new Cesium.Viewer(this.$refs.cesiumContainer, viewerOption);
      this.viewer = viewer
      viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
    },
    // 创建模型
    createModel(entityData) {
      //
      const viewer = this.viewer
      // 移除实体
      if(viewer) {
        viewer.entities.removeById(this.id)
      };
      this.id = entityData.id
      const point = entityData.point
      const headerPitchRoll = entityData.headerPitchRoll
      // 实体位置信息 x,y,z
      var position = Cesium.Cartesian3.fromDegrees(
        point.x,
        point.y,
        point.z
      );
      // 将度数转弧度 Converts degrees to radians 请查看 HeadPitchRoll.md文件
      const heading = this.degreesToRadians(headerPitchRoll.head);
      const pitch = this.degreesToRadians(headerPitchRoll.pitch);
      const roll = this.degreesToRadians(headerPitchRoll.roll);
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      // 根据参考帧计算四元数，该参考帧的坐标轴是根据以提供的原点为中心的航向-俯仰-倾角所计算的。
      // 航向是从局部北向旋转，其中正角向东增加。俯仰是从本地东西向平面的旋转。正俯仰角在平面上方。
      // 负俯仰角在平面下方。横摇是绕局部东轴应用的第一次旋转。
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      // 
      var entity = viewer.entities.add({
        id: entityData.id, // 
        name: entityData.name,
        position: position,
        orientation: orientation,
        model: {
          uri: entityData.url,
          minimumPixelSize: 128,
          maximumScale: 20000,
        },
      });
      //
      // console.log(entity,'entity')
      viewer.trackedEntity = entity;
    },
    changeModel(entity) {
      this.createModel(entity)
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
.model-list{
  position: absolute;
  top: 0px;
  right: 0px;
  background: darkgray;
}
.model-list .item{
  padding: 5px 10px;
  cursor: pointer;
}
</style>