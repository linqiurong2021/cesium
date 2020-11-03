<template>
  <div>
    <BasemapLayer :showCustomerBaseLayer="showCustomerBaseLayer"/>
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import * as widget from "cesium/Widgets/widgets.css";
import BasemapLayer from '../basemap/index'
export default {
  name: "CesiumScene",
  data() {
    return {
      showCustomerBaseLayer: false,
    };
  },
  components: {
    BasemapLayer  
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