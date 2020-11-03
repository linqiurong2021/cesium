<template>
  <div>
    <div ref="cesiumContainer" id="cesiumContainer"></div>
    <el-tree
      class="layers"
      :data="layers"
      show-checkbox
      ref="tree"
      node-key="id"
      @check-change="checkChange"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"
      :props="defaultProps">
    </el-tree>
  </div>

</template>

<script>
import * as Cesium from "cesium/Cesium";
import * as widget from "cesium/Widgets/widgets.css";
import { Tree } from 'element-ui'
import ImageProvider from '../ImageProvider'

import layers from './layers.json'
export default {
  name: "CesiumScene",
  data() {
    return {
      viewer: null,
      // layers: layers,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      layers: layers,
    };
  },
  components: {
    ElTree: Tree
  },
  mounted() {
    this.init();
    this.businessLayers()
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
      
      let viewer = new Cesium.Viewer(this.$refs.cesiumContainer, viewerOption);
      viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
      this.viewer = viewer
      console.log(viewer.scene.imageryLayers)
    },
    // 业务图层
    businessLayers() {
      let layers = []
      this.filterLayers(this.layers, layers)
      console.log(layers,'layers')
      let allLayers = []
      layers.map((layer)=> {
        const layerId = layer.pg.LAYER_TABLE
        const url = layer.pg.SERVICE_URL
        // console.log(url + '/' + layerId,'url')
        let item = {
          id: layerId,
          url: url,
          alpha: layer.pg.ALPHA,
          layers: layerId, // 某个图层
          type: layer.pg.LAYER_TYPE
        }
        
        const tmpLayer = this.createLayers(item)
        console.error(tmpLayer,'tmpLayer')
        tmpLayer ? allLayers.push(tmpLayer): ''
      })

      allLayers.map((provider)=>{
         console.log(provider,'provider')
         this.viewer.imageryLayers.addImageryProvider(provider)
      })
      console.log(allLayers,'all')
    },
    // 创建图层
    createLayers(item) {
      //
      let layer = null
      switch(item.type) {
        case 'WebMapTile' : layer = ImageProvider.WebMapTileService(item) ;break;
        case '3' : layer = ImageProvider.WebMapService(item) ; break;
        case 'OpenStreet' : layer = ImageProvider.OpenStreetMap(item) ;break;
        case 'UrlTemplate' : layer = ImageProvider.UrlTemplate(item) ;break;
        case 'ArcGisMapServer' : layer = ImageProvider.ArcGisMapServer(item) ; break;
      }
      return layer
    },
    // 获取业务
    filterLayers(layers, arr = []) {
      layers.map((layer)=>{
        layer.pg.DIR_TYPE == 2 ? arr.push(layer):  this.filterLayers(layer.children, arr)
      })
    },
    // 选择变更
    checkChange: function(item,isChecked){
      if(item.pg) {
        //
       
      }
      //
      // remove add contains
      // 
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
.layers{
  position: absolute;
  top: 10px;
  min-width: 160px;
  /* background: red; */
  /* color: #ffffff; */
  width: auto;
  right: 10px;
}
</style>