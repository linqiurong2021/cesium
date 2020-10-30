# cesium

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Cesium 配置

在根目录新建 vue.config.js


```js
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
  // 基本路径
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 5000,
    https: false,
    hotOnly: false
  },
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        cesium: path.resolve(__dirname, cesiumSource)
      }
    },
    plugins: [
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false
    }
  }
};

```

# Cesium 使用

```js
import * as Cesium from "cesium/Cesium"; 
// 或 import {Viewer} from "cesium/Cesium"; 
import * as widget from "cesium/Widgets/widgets.css";
```


# Head Pitch Roll

[查看链接](https://blog.csdn.net/qq_37796475/article/details/79188477)

## Head
::: tip 
  默认0度为朝向东 数值增大时 顺时针转向 数值减少时逆时针转向

  Head是围绕Y轴旋转，也叫偏航角
:::

## Pitch

::: tip
  默认0度时朝向正前方 数值增大时 仰视  数值减少时 俯视
  
  pitch是X轴旋转，也叫做俯仰角
:::

## Roll

::: tip
  默认0度时朝向正前方 数值增大时 绕x轴 向左旋转  数值减少时 绕x轴 向右旋转

  roll是围绕Z轴旋转，也叫翻滚角
:::
