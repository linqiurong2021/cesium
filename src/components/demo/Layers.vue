<template>
  <div>
    <div ref="cesiumContainer" id="cesiumContainer"></div>
      <el-tree
      :data="layers"
      show-checkbox
      node-key="id"
      ref="tree"
      class="layers"
      default-expand-all
      @check-change="checkChange"
      :expand-on-click-node="false">
      <!--@check="checkChange"-->
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <div>{{ data.name }} </div>
        <!--只有有图层的才显示-->
        <el-slider class="slider" @change="sliderChange($event,data)" v-model="data.pg.ALPHA" :step="0.01" :min="0" :max="1" input-size="mini" v-show="data.pg.DIR_TYPE == 2 && data.pg.SHOW_ALPHA == 1"/>
      </span>
    </el-tree>

  </div>

</template>

<script>
import * as Cesium from "cesium/Cesium";
import * as widget from "cesium/Widgets/widgets.css";
import { Tree, Slider } from 'element-ui'
import ImageProvider from '../ImageProvider'

import layers from './layers.json'
export default {
  name: "CesiumScene",
  data() {
    return {
      viewer: null,
      layers: layers,
      //
      imageProviders: [],
      // 未添加的
      allLayers: [],
      // 已添加的图层
      hasImageProviders: []
    };
  },
  components: {
    ElTree: Tree,
    ElSlider: Slider
  },
  mounted() {
    this.init();
    this.getImageProviders()
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
      viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(118.17, 24.48, 15000.0)
      })
    },
    // 业务图层
    getImageProviders() {
      let hasLayerArr = []
      this.filterLayers(this.layers, hasLayerArr)
      // console.log(hasLayerArr,'hasLayerArr')
      let imageProviders = []
      //
      hasLayerArr.map((layer)=> {
        const layerId = layer.pg.LAYER_TABLE
        const url = layer.pg.SERVICE_URL
        // console.log(url + '/' + layerId,'url')
        let item = {
          id: layerId,
          businessId: layer.id, // 图层业务ID
          url: url,
          alpha: layer.pg.ALPHA, // WebMapService 无效
          layers: layerId, // 某个图层
          type: layer.pg.LAYER_TYPE
        }
        const imageProvider = this.createImageProvider(item)
        imageProvider.businessId = layer.id
        imageProvider.alpha = layer.pg.ALPHA
        imageProvider ? imageProviders.push(imageProvider): ''
      })
      //
      this.imageProviders = imageProviders
    },
    // 创建图层
    createImageProvider(item) {
      //
      let imageProvider = null
      switch(item.type) {
        case 'WebMapTile' : imageProvider = ImageProvider.WebMapTileService(item) ;break;
        case '3' : imageProvider = ImageProvider.WebMapService(item) ; break;
        case 'OpenStreet' : imageProvider = ImageProvider.OpenStreetMap(item) ;break;
        case 'UrlTemplate' : imageProvider = ImageProvider.UrlTemplate(item) ;break;
        case 'ArcGisMapServer' : imageProvider = ImageProvider.ArcGisMapServer(item) ; break;
      }
      return imageProvider
    },
    // 获取业务
    filterLayers(layers, arr = []) {
      layers.map((layer)=>{
        layer.pg.DIR_TYPE == 2 ? arr.push(layer):  this.filterLayers(layer.children, arr)
      })
    },
    // 修改originData.SHOW_ALPHA
    changeOrignData(layers, checkedKeys ) {
      layers.map((layer)=>{
        if(layer.pg.DIR_TYPE == 2 && checkedKeys.indexOf(layer.id) >=0) {
          console.log('changeOrign', layer.pg.ALPHA)
          layer.pg.SHOW_ALPHA = 1 
        } else{
          // 如果没有则不显示
          layer.pg && layer.pg.SHOW_ALPHA ? layer.pg.SHOW_ALPHA = 0 : ''
          this.changeOrignData(layer.children, checkedKeys)
        }
      })
    },
    // 选择变更
    checkChange: function(node,checked){
      // 获取已勾选的数据
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // 修改数据 显示透明度条
      this.changeOrignData(this.layers, checkedKeys)
      // 
      let hasImageProviders = []
      if(checked) {
        checkedKeys.map((id)=>{
          // 添加未添加过的数据
          this.addImageViewer(id, hasImageProviders)
        })
      }else{
        // 删除无选中的数据
        this.removeImageViewer(checkedKeys)
      }
      // 已勾选的图层数据
      this.hasImageProviders = hasImageProviders
    },
    // 删除
    removeImageViewer(checkedKeys) {
      const layers = this.viewer.imageryLayers._layers
      layers.map((item, key)=>{
        if(typeof(item.businessId)!='undefined'){ // 选中有数据 且 不包括选中的值
          const businessId = item.businessId
          if(checkedKeys.length <= 0 || (checkedKeys.length > 0 && checkedKeys.indexOf(businessId)==-1)){
            this.viewer.imageryLayers.remove(item)
          }
        }
      })
      console.log(this.viewer.imageryLayers._layers)
    },
    // 判断图层是否已存在
    hasImageLayer(id) {
      // 获取已有图层数据
      const layers = this.viewer.imageryLayers._layers
      let has = false
      layers.map((item)=>{
        if(item.businessId == id) {
          has = true
        }
      })
      return has
    },
    // 添加图层
    addImageViewer(id, hasImageProviders) {
      // 需要过滤 如果图层中已有则直接返回
      if(this.hasImageLayer(id)) return
      // imageProviders 这里的数据图层
      this.imageProviders.map((provider, key)=>{
        // ID相等且不存在
        if(id == provider.businessId) {
          let layer = null
          layer = this.viewer.imageryLayers.addImageryProvider(provider)
          layer.businessId = provider.businessId
          layer.alpha = provider.alpha
          // 添加
          hasImageProviders.push(layer)
        }
      })
    },
    // 滑动(有bug 勾选第一个可以 勾选第二个后无法使用)
    sliderChange(value, data) {
      let id = data.id // 获取ID
      // 已添加的图层
      this.hasImageProviders.map((layer)=>{
        //
        if(layer.businessId == id) {
          layer.alpha = value
        }
      })
      // 所有imageProviders
      this.imageProviders.map((imageProvider)=>{
        if(imageProvider.businessId ==id) {
          imageProvider.alpha = value
        }
      })
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
.layers{
  position: absolute;
  top: 10px;
  min-width: 260px;
  /* background: red; */
  /* color: #ffffff; */
  width: auto;
  right: 10px;
}
.custom-tree-node{
  display: flex;
  align-items: center;
}
.custom-tree-node .slider {
  margin-left: 10px;
}
.custom-tree-node >>> .el-tooltip.el-slider__button{
  width:6px;
  height: 6px;
}
.custom-tree-node >>> .el-slider__runway{
  width: 50px;
}
</style>