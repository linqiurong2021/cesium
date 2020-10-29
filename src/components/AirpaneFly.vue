<template>
 <div>

 </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import * as widget from "cesium/Widgets/widgets.css";

export default {
  name: 'AirpaneFly',
  mounted(){
    this.init()
  },
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
        animation: false ,// 控制场景动画的播放速度控件
        selectionIndicator: false, //Disable selection indicator
        shouldAnimate: true, // Enable animations
        terrainProvider: Cesium.createWorldTerrain(),
      };
      
      let viewer = new Cesium.Viewer(this.$el, viewerOption);
      //
      viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权

      // 启用光照
      viewer.scene.globe.enableLighting = true;
      // 不遮挡
      viewer.scene.globe.depthTestAgainstTerrain = true;
      // 设置随机种子
      Cesium.Math.setRandomNumberSeed(3);
      // 设置时间 2020-2-26 16:00:00
      var start = Cesium.JulianDate.fromDate(new Date(2020, 2, 25, 16));
      // 
      var stop = Cesium.JulianDate.addSeconds(
        start,
        360, // 360秒 
        new Cesium.JulianDate()
      );
      console.log(stop,'stop',start,'start')
      // 设置开始时间
      viewer.clock.startTime = start.clone();
      // 设置结束时间
      viewer.clock.stopTime = stop.clone();
      // 当前时间
      viewer.clock.currentTime = start.clone();
      // 当时间到stop后 时间将指向当前时间 当时间回退时 时间将不会指向过去
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
      // 将当前时间提前自上次调用乘以以来的系统时间
      viewer.clock.multiplier = 10;

      var position = this.computeCirclularFlight(118.110693, 24.4894841, 0.003, start, viewer);

      this.addEntity(viewer, position, start, stop)

      this.viewSide(viewer)
    },
    // 计算飞行路径
    computeCirclularFlight(lon, lat, radius,start, viewer) {
      var property = new Cesium.SampledPositionProperty();
      for (var i = 0; i <= 360; i += 45) {
        var radians = Cesium.Math.toRadians(i);
        var time = Cesium.JulianDate.addSeconds(
          start,
          i,
          new Cesium.JulianDate()
        );
        var position = Cesium.Cartesian3.fromDegrees(
          lon + radius * 1.5 * Math.cos(radians),
          lat + radius * Math.sin(radians),
          Cesium.Math.nextRandomNumber() * 500 + 350
        );
        property.addSample(time, position);

        //Also create a point for each sample we generate.
        viewer.entities.add({
          position: position,
          point: {
            pixelSize: 8,
            color: Cesium.Color.TRANSPARENT,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 3,
          },
        });
      }
      return property;
    },
    viewSide(viewer) {
      viewer.zoomTo(
        viewer.entities,
        new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(-90),
          Cesium.Math.toRadians(-15),
          7500
        )
      );
    },
    addEntity(viewer, position, start, stop) {
      var entity = viewer.entities.add({
        //Set the entity availability to the same interval as the simulation time.
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),

        //Use our computed positions
        position: position,

        //Automatically compute orientation based on position movement.
        orientation: new Cesium.VelocityOrientationProperty(position),

        //Load the Cesium plane model to represent the entity
        model: {
          uri: '/assets/models/Cesium_Air.glb',
          minimumPixelSize: 64,
        },

        //Show the path as a pink line sampled in 1 second increments.
        path: {
          resolution: 1,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.1,
            color: Cesium.Color.YELLOW,
          }),
          width: 10,
        },
      });
    }
  },
}
</script>

<style scoped>

</style>