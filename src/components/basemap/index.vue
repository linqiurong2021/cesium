<template>
  <div>
    <div ref="cesiumContainer" id="cesiumContainer"></div>
    <div class="basemap-wrap" v-show="showCustomerBaseLayer">
      <div class="item" v-for="(item ,key) in imageryViewModels" :key="key" @click="changeBaseMap(item)">
        <div><img :src="item.iconUrl" /></div>
        <div>{{item.name}}</div>
      </div>
    </div>  
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import * as widget from "cesium/Widgets/widgets.css";
export default {
  name: "Basemap",
  props: {
    showCustomerBaseLayer: {
      type: Boolean,
      default() {
        return false
      }
    },
    config: {
      type: Array,
      default() {
        return [
          {
            id: 0,
            name: '天地图全国矢量',
            layers: '',
            type: 'WebMapTile',// ArcGis WebMapTile UrlTempl OpenStreet createTileMap WebMapService
            url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=4b350b4f343fa22cdb2047e93b4d8712",
            imgType: 'vec', // 'imgType','vecType'
            iconUrl: '',
            options: {}
          },{
            id: 1,
            name: '天地图全国影像',
            layers: '',
            type: 'WebMapTile',// ArcGis WebMapTile UrlTempl OpenStreet createTileMap WebMapService
            url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=4b350b4f343fa22cdb2047e93b4d8712",
            imgType: 'img', // 'imgType','vecType'
            iconUrl: '',
            options: {}
          },{
            id: 2,
            name: '厦门2019影像',
            layers: 'HB_CGCS_DOMMAP',
            type: 'ArcGisMapServer',// ArcGis WebMapTile UrlTempl OpenStreet createTileMap WebMapService
            url: "http://222.76.242.138/arcgis/rest/services/HB/CGCS_DOMMAP/MapServer/WMTS?service=WMTS&request=GetTile&layer=HB_CGCS_DOMMAP&style=default&TileMatrix={TileMatrix}&tilerow={TileRow}&tilecoL={TileCol}",
            imgType: 'img', // 'imgType','vecType'
            iconUrl: '',
            options: {}
          },{
            id: 3,
            name: 'OpenStreet',
            layers: 'OpenStreet',
            type: 'OpenStreet',// ArcGis WebMapTile UrlTempl OpenStreet createTileMap WebMapService
            url: "https://a.tile.openstreetmap.org/",
            imgType: 'img', // 'imgType','vecType'
            iconUrl: '',
            options: {}
          },{
            id: 4,
            name: '高德影像',
            layers: '',
            type: 'UrlTemplate',// ArcGis WebMapTile UrlTempl OpenStreet createTileMap WebMapService
            url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
            imgType: 'img', // 'imgType','vecType'
            iconUrl: '',
            options: {}
          },{
            id: 5,
            name: 'ArcGisMapServer',
            layers: '',
            type: 'ArcGisMapServer',// ArcGis WebMapTile UrlTempl OpenStreet createTileMap WebMapService
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
            imgType: 'img', // 'imgType','vecType'
            iconUrl: '',
            options: {}
          },
        ]
      }
    }
  },
  data() {
    return {
      imageryViewModels: []
    }
  },
  mounted() {
    // 如果开启自定义则不显示默认的
    const defaultShow = this.showCustomerBaseLayer ?  false : true
    let viewerOption = {
      geocoder: false, // 地理位置查询定位控件
      homeButton: false, // 默认相机位置控件
      timeline: false, // 时间滚动条控件
      navigationHelpButton: false, // 默认的相机控制提示控件
      fullscreenButton: false, // 全屏控件
      scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
      baseLayerPicker: defaultShow, // 底图切换控件
      animation: false ,// 控制场景动画的播放速度控件
    }
    //
    if(this.config.length > 0) {
      let models = this.initBaselayers();
      //
      this.imageryProviderViewModels = models
      this.imageryViewModels = models
      viewerOption = {
        geocoder: false, // 地理位置查询定位控件
        homeButton: false, // 默认相机位置控件
        timeline: false, // 时间滚动条控件
        navigationHelpButton: false, // 默认的相机控制提示控件
        fullscreenButton: false, // 全屏控件
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        baseLayerPicker: defaultShow, // 底图切换控件
        animation: false ,// 控制场景动画的播放速度控件
        imageryProviderViewModels: models
      }
    }
    let viewer = new Cesium.Viewer(this.$refs.cesiumContainer, viewerOption);
    viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
    this.viewer = viewer
  },
  methods: {
    initBaselayers() {
      let baseLayers = []
      this.config.map((item)=>{
        const layer = this.createProviderViewModel(item)
        baseLayers.push(layer)
      })
      console.error(baseLayers,'baseLayers')
      return baseLayers
    },
    // 创建底图
    createProviderViewModel(item) {
      let layer = null
      switch(item.type) {
        case 'WebMapTile' : layer = this.WebMapTileService(item) ;break;
        case 'WebMapService' : layer = this.WebMapService(item) ; break;
        case 'OpenStreet' : layer = this.OpenStreetMap(item) ;break;
        case 'UrlTemplate' : layer = this.UrlTemplate(item) ;break;
        case 'ArcGisMapServer' : layer = this.ArcGisMapServer(item) ; break;
      }
      const iconUrl = item.iconUrl!="" ? item.iconUrl : item.imgType == 'img' ? require('@/assets/images/img.png') : require('@/assets/images/vec.png');
      //
      console.error(iconUrl,'iconUrl')
      const model = new Cesium.ProviderViewModel({
          name : item.name,
          iconUrl : iconUrl,
          tooltip : item.name,
          creationFunction : function() {
            return layer
          }
      })
      // console.log(layer,'layer')
      return model
    },
    // 创建arcgisMapServer
    ArcGisMapServer(item) {
      return new Cesium.ArcGisMapServerImageryProvider({
        url: item.url,
        layer: item.id,
        style: "default",
        format: "image/png",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      });
    },
    WebMapTileService(item) {
      return new Cesium.WebMapTileServiceImageryProvider({
        url : item.url,
        layer: item.id,
        style: "default",
        format: "image/png",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      });
    },
    OpenStreetMap(item) {
      return new Cesium.OpenStreetMapImageryProvider({
        url: item.url,
        layer: item.id,
        style: "default",
        format: "image/png",
      });
    },
    // 高德
    UrlTemplate(item) {
      return new Cesium.UrlTemplateImageryProvider({
        url: item.url,
        layer: item.id,
        style: "default",
        format: "image/png",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      })
    },
    WebMapService(item) {
      return new Cesium.WebMapServiceImageryProvider({
        url : item.url,
        layers : item.layers,
      });
    },
    changeBaseMap(item){
      console.log(item,'item')
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
.basemap-wrap{
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
}
.basemap-wrap .item{
  width: 64px;
  padding: 5px 2px;
  font-size: 12px;
  word-break: break-all;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>