<template>
  <div>
    <div id="cesiumContainer" ref="cesiumContainer"></div>
    <div class="popup" :class="{'show': popupShow }" v-html="popupContent" @click="popupShow =false"></div>
  </div>
</template>

<script>
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYWVmNTE1Zi02ZmYwLTQ4YjktYmZmZi01NWM2ZjQ4YTkzZDQiLCJpZCI6Mjk4NzEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTI4MTYyNTJ9.GzaornBtyu8pW9Z-VeFL0rkTqiBabE_2hvDu5HDqTCQ'
import * as Cesium from "cesium/Cesium";
import * as widget from "cesium/Widgets/widgets.css";
import ImageProvider from '../ImageProvider'
export default {
  name: "CesiumScene",
  data() {
    return {
      popupShow: false,
      popupContent: ''
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
    
      let viewerOption = {
        infoBox: false, // 禁用右上角的弹窗
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
      viewer.scene.globe.depthTestAgainstTerrain = false; 
      //    
      // let terrainProvider = new Cesium.createWorldTerrain()
      // viewer.terrainProvider = terrainProvider

      // 需要wms 支持
      /*** arcgis 图层 */
      let item = {
        id: 19,
        layers: "0,1,2,3",
        url: '/dev_arcgis/services/clone/平潭六秀/MapServer/WmsServer?',
      }
      let result =  ImageProvider.WebMapService(item)
      viewer.imageryLayers.addImageryProvider(result)


      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      const that = this
      handler.setInputAction(function(click){
          //
          var pick = viewer.scene.pick(click.position);
          var ray = viewer.camera.getPickRay(click.position);
          var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
          if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            if (cartographic) {
              var xy = new Cesium.Cartesian2();
              var alti = viewer.camera.positionCartographic.height;
              var level = getLevel(alti);
              if (result.ready) {
                  xy = result.tilingScheme.positionToTileXY(cartographic, level, xy);
                  var promise = result.pickFeatures(xy.x, xy.y, level, cartographic.longitude, cartographic.latitude);
                  Cesium.when(promise, function (data) {
                    console.log(data,"data")
                    if(data.length > 0) {
                      that.popupShow = true;
                      that.popupContent = data[0].description ; //"<h1>HelloWorld</h1>"
                    }else{
                      that.popupShow = false
                      that.popupContent = ''
                    }
                    //
                    
                  });
              } 
            } 
          }
          // console.log('左键单击事件：',click.position);     
      },Cesium.ScreenSpaceEventType.LEFT_CLICK);

      function getLevel(height) {
           if (height > 48000000) {
              return 0;
           } else if (height > 24000000) {
              return 1;
           } else if (height > 12000000) {
              return 2;
           } else if (height > 6000000) {
              return 3;
           } else if (height > 3000000) {
              return 4;
           } else if (height > 1500000) {
              return 5;
           } else if (height > 750000) {
              return 6;
           } else if (height > 375000) {
              return 7;
           } else if (height > 187500) {
              return 8;
           } else if (height > 93750) {
              return 9;
           } else if (height > 46875) {
              return 10;
           } else if (height > 23437.5) {
              return 11;
           } else if (height > 11718.75) {
              return 12;
           } else if (height > 5859.38) {
              return 13;
           } else if (height > 2929.69) {
              return 14;
           } else if (height > 1464.84) {
              return 15;
           } else if (height > 732.42) {
              return 16;
           } else if (height > 366.21) {
              return 17;
           } else {
              return 18;
           }
       }


      viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(119.739067,25.455859, 5000.0)
      })
       /*** arcgis 图层 */
      /***倾斜摄影 */
      var tileset = new Cesium.Cesium3DTileset({
        url: "http://192.168.110.201:8088/tileset.json",
      });
      viewer.scene.primitives.add(tileset);
      tileset.readyPromise
        .then(function (tileset) {
          // 模型偏移
          var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
          var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
          var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0); // 400
          var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
          tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

          viewer.zoomTo( tileset);

        })
        .otherwise(function (error) {
          console.log(error);
        });
      
    

      // 弹窗
      // this.infoDiv()
    },
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
.popup {
  display: none;
  position: fixed;
  height: 200px;
  width: 200px;
  top: 0px;
  background: red;
  z-index: 9999;
}
.show {
  display: block;

}
</style>