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
      viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权

      this.loadKml(viewer);
    },
    loadKml(viewer) {
      var options = {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas
      };
      var dataSourcePromise = viewer.dataSources.add(
        Cesium.KmlDataSource.load("/assets/kml/clustering.kml", options)
      );
      // 步骤
      // 数据加载
      // 开启聚合并设置最小个数与像素范围
      // 创建聚合显示效果
      // 监听聚合事件并重置效果
      // 重新追踪
      dataSourcePromise.then(function(dataSource) {

        var pixelRange = 10;
        var minimumClusterSize = 5;
        var enabled = true;
        // 开启聚合
        dataSource.clustering.enabled = enabled;
        // 像素范围
        dataSource.clustering.pixelRange = pixelRange;
        // 最小个数
        dataSource.clustering.minimumClusterSize = minimumClusterSize;

        var removeListener;
        // 图标
        var pinBuilder = new Cesium.PinBuilder();
        // 图标显示
        //  https://cesium.com/docs/cesiumjs-ref-doc/PinBuilder.html?classFilter=PinBuilder
        var pin50 = pinBuilder.fromText("50+", Cesium.Color.RED, 48).toDataURL();
        var pin40 = pinBuilder.fromText("40+", Cesium.Color.ORANGE, 48).toDataURL();
        var pin30 = pinBuilder.fromText("30+", Cesium.Color.YELLOW, 48).toDataURL();
        var pin20 = pinBuilder.fromText("20+", Cesium.Color.GREEN, 48).toDataURL();
        var pin10 = pinBuilder.fromText("10+", Cesium.Color.BLUE, 48).toDataURL();

        // 2到9个的样式
        var singleDigitPins = new Array(8);
        for (var i = 0; i < singleDigitPins.length; ++i) {
          singleDigitPins[i] = pinBuilder.fromText("" + (i + 2), Cesium.Color.VIOLET, 48).toDataURL();
        }

        function customStyle() {
          if (Cesium.defined(removeListener)) {
            removeListener();
            removeListener = undefined;
          } else {
            // 监听聚合事件
            removeListener = dataSource.clustering.clusterEvent.addEventListener(
              function(clusteredEntities, cluster) {
                cluster.label.show = false;
                // 显示图标
                cluster.billboard.show = true;
                cluster.billboard.id = cluster.label.id;
                // 图标位置
                cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                // 自定义样式
                if (clusteredEntities.length >= 50) {
                  cluster.billboard.image = pin50;
                } else if (clusteredEntities.length >= 40) {
                  cluster.billboard.image = pin40;
                } else if (clusteredEntities.length >= 30) {
                  cluster.billboard.image = pin30;
                } else if (clusteredEntities.length >= 20) {
                  cluster.billboard.image = pin20;
                } else if (clusteredEntities.length >= 10) {
                  cluster.billboard.image = pin10;
                } else {
                  // 
                  cluster.billboard.image = singleDigitPins[clusteredEntities.length - 2];
                }
              }
            );
          }

          // force a re-cluster with the new styling
        // 重置
        var pixelRange = dataSource.clustering.pixelRange;
          dataSource.clustering.pixelRange = 0;
          dataSource.clustering.pixelRange = pixelRange;
        }

        // start with custom style
        customStyle();

        var viewModel = { pixelRange: pixelRange,minimumClusterSize: minimumClusterSize};
        Cesium.knockout.track(viewModel);

        // 点击事件
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(movement) {
          var pickedLabel = viewer.scene.pick(movement.position);
          if (Cesium.defined(pickedLabel)) {
            var ids = pickedLabel.id;
            if (Array.isArray(ids)) {
              for (var i = 0; i < ids.length; ++i) {
                ids[i].billboard.color = Cesium.Color.RED;
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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