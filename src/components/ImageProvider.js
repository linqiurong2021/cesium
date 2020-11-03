
import * as Cesium from "cesium/Cesium";

class ImageProvider {
  // 创建arcgisMapServer
  static ArcGisMapServer(item) {
    return new Cesium.ArcGisMapServerImageryProvider({
      url: item.url,
      layer: item.id,
      style: "default",
      format: "image/png",
      tileMatrixSetID: "GoogleMapsCompatible",
      show: false
    });
  }
  static WebMapTileService(item) {
    return new Cesium.WebMapTileServiceImageryProvider({
      url: item.url,
      layer: item.id,
      style: "default",
      format: "image/png",
      tileMatrixSetID: "GoogleMapsCompatible",
      show: false
    });
  }
  static OpenStreetMap(item) {
    return new Cesium.OpenStreetMapImageryProvider({
      url: item.url,
      layer: item.id,
      style: "default",
      format: "image/png",
    });
  }
  // 高德
  static UrlTemplate(item) {
    return new Cesium.UrlTemplateImageryProvider({
      url: item.url,
      layer: item.id,
      style: "default",
      format: "image/png",
      tileMatrixSetID: "GoogleMapsCompatible",
      show: false
    })
  }
  // WMS
  static WebMapService(item) {
    return new Cesium.WebMapServiceImageryProvider({
      url: item.url,
      layers: item.layers,
      defaultAlpha: item.alpha,
    });
  }
}

export default ImageProvider