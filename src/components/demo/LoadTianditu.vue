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
    this.loadChinaTianditu();
    // this.loadXmTdt()
  },
  beforeDestroy() {},
  methods: {
    loadChinaTianditu() {
      let token = '4b350b4f343fa22cdb2047e93b4d8712'
      const imageryViewModels = this.gettBaseLayer()
      let viewerOption = {
        geocoder: false, // 地理位置查询定位控件
        homeButton: false, // 默认相机位置控件
        timeline: false, // 时间滚动条控件
        navigationHelpButton: false, // 默认的相机控制提示控件
        fullscreenButton: false, // 全屏控件
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        baseLayerPicker: true, // 底图切换控件
        animation: false, // 控制场景动画的播放速度控件
        // imageryProvider : new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+token,
        //   layer: "tdtVecBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible", // The identifier of the TileMatrixSet to use for WMTS requests.
        // })
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+token,
        //   layer: "tdtBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        //   show: false
        // }),
        imageryProviderViewModels : imageryViewModels
      };

      // 全球矢量地图服务
      /**
      imageryProvider : new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+token,
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible", // The identifier of the TileMatrixSet to use for WMTS requests.
        })
      */
      // 全球影像地图服务
      /**
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+token,
        layer: "tdtBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      })
      */

      // 全球影像中文注记服务

      let viewer = new Cesium.Viewer(this.$el, viewerOption);
      viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权

      // 全球影像中文注记服务
      viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk="+token,
        layer: "tdtAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      }));

      // 全球矢量中文注记服务
      // viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
      //   url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk="+token,
      //   layer: "tdtAnnoLayer",
      //   style: "default",
      //   format: "image/jpeg",
      //   tileMatrixSetID: "GoogleMapsCompatible"
      // }));

    },
    loadXmTdt() {
      // 
      let viewerOption = {
        geocoder: false, // 地理位置查询定位控件
        homeButton: false, // 默认相机位置控件
        timeline: false, // 时间滚动条控件
        navigationHelpButton: false, // 默认的相机控制提示控件
        fullscreenButton: false, // 全屏控件
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        baseLayerPicker: true, // 底图切换控件
        animation: false, // 控制场景动画的播放速度控件
        // imageryProvider : new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+token,
        //   layer: "tdtVecBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible", // The identifier of the TileMatrixSet to use for WMTS requests.
        // })
        // 添加厦门天地图(Wms无4490限制)
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          url: "http://222.76.242.138/arcgis/rest/services/HB/CGCS_DOMMAP/MapServer/WMTS?service=WMTS&request=GetTile&layer=HB_CGCS_DOMMAP&style=default&TileMatrix={TileMatrix}&tilerow={TileRow}&tilecoL={TileCol}",
          layer: "tdtBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      };
      let viewer = new Cesium.Viewer(this.$el, viewerOption);
      viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权

      viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(118, 24.48, 15000.0)
      })
    },
    // 修改底图
    gettBaseLayer() {
      let token = '4b350b4f343fa22cdb2047e93b4d8712'
      var imageryViewModels = [];
      imageryViewModels.push(new Cesium.ProviderViewModel({
          name : '全国天地图影像',
          iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
          tooltip : 'HelloWorlld',
          creationFunction : function() {
              return new Cesium.WebMapTileServiceImageryProvider({
                  url : "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+token,

                      layer: "tdtBasicLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: false
              });
          }
      }))

       imageryViewModels.push(new Cesium.ProviderViewModel({
          name : '全国天地图矢量',
          iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
          tooltip : '全国天地图矢量',
          creationFunction : function() {
              return new Cesium.WebMapTileServiceImageryProvider({
                  url : "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+token,
                      layer: "tdtBasicLayer2",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: false
              });
          }
      }))


       imageryViewModels.push(new Cesium.ProviderViewModel({
          name : '天地图*厦门',
          iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
          tooltip : '天地图*厦门',
          creationFunction : function() {
              return new Cesium.ArcGisMapServerImageryProvider({
                url: "http://222.76.242.138/arcgis/rest/services/HB/CGCS_DOMMAP/MapServer/WMTS?service=WMTS&request=GetTile&layer=HB_CGCS_DOMMAP&style=default&TileMatrix={TileMatrix}&tilerow={TileRow}&tilecoL={TileCol}",
                layer: "tdtBasicLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: false
              });
          }
      }))

      return imageryViewModels

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