# 

[Transforms](https://cesium.com/docs/cesiumjs-ref-doc/Transforms.html?classFilter=Transforms)

## 经纬度坐标转换笛卡尔坐标

查看链接: [经纬度与地心笛卡尔坐标系转换](https://blog.csdn.net/chunyexiyu/article/details/98254632)

### 笛卡尔球心坐标系

1. 首先：明确缺省采用的WGS84坐标系所使用的地球半径
ellipsoid.xyz = (6378137.0, 6378137.0, 6356752.3142451793));
X,Y 方向使用地球的赤道面的半径，也即经度面长半轴长度：6378137.0
Z 方向使用地球经度面短半轴长度：6356752.3142451793

2. 然后，明确圆心点和各个轴的指向：
以地球的球心为原点；
z轴指向北极；
x轴指向0度经线方向：0度经线（英国伦敦原格林威治天文台旧址）与赤道交点。
y轴指向90度经线方向：90度经线（该经线经过新疆、青海、西藏区域）与赤道交点。


### 经纬度转笛卡尔坐标:

  1. 已知，<font color="#ff0000"> 纬度代表的是与赤道面的夹角 </font>：
  北半球上，随着夹角的增大，纬度圈越向北极靠近；z值变大，纬度圈的半径也变短了。
  坐标z值 = 短半轴长度 * sin(a)
  经度圈半径 = 长半轴长度 * cos(a)

  2. 已知，<font color="#ff0000"> 经度代表与0度经度线的夹角，0度经线以东为正，以西为负</font>。
  另外我们还知道，x指向0度经线，0度经线x=R,y=0；同理90度经线处x=0,y=R。
  0-90度范围内，随着角度的增大，x值减小，y值增大
  x = 纬线圈半径 * cos(b)
  y = 纬线圈半径 * sin(b)

  3. 把x/y/z坐标去除半径部分，可以作为该经纬度的x/y/z向量指向：
  normal=(
  cos(a)*cos(b),
  cos(a)*sin(b),
  sin(a))
  单位化该向量，再乘以对应的半径
  Ellipsoid(6378137.0, 6378137.0, 6356752.3142451793)
  得到经纬度对应0平面的笛卡尔坐标位置

  4. 坐标修正：考虑到ellipsoid椭球体坐标并非是球体方法所能表达的，使用一些修正算法进行近似纠正：
  纠正算法采用的是：
  笛卡尔位置 = (normal * ellipsoidSquared) / dot(normal * sqrt((normal * ellipsoidSquared)))


  5. 对于带高程值的：
  上面我们求出了经纬度在0平面（高程为0）时的笛卡尔位置；
  加上高程值对应的矢量，就可以得出对应高程的位置；高程的指向和之前一致，所以也直接使用normal指向，所以 <font color="#ff000">增加量(高程值)=height * normal</font>，加到坐标上就得出带高程值的位置。


```javascript

//Cartesian3.fromDegrees =  a {x: -2847383.0422115843, y: 4659501.404998853, z: 3284729.700788161}
var fromDegrees = Cesium.Cartesian3.fromDegrees(daTAs.longitude, daTAs.latitude, daTAs.height);
var fromDegrees1 = Cesium.Cartesian3.fromDegrees(daTAs.longitude- 0.0005, daTAs.latitude- 0.0005, daTAs.height);

```

## 笛卡尔坐标转为经纬度坐标(弧度转经纬度)

### 笛卡尔坐标转经纬度
笛卡尔坐标转经纬度，是上个计算的反向运算，推导过程也和上个相对应。

  1. 首先使用把矢量长度规整到0平面长度上，把高程值去掉
  2. 然后使用z值计算出纬度，设a为纬度，b为经度，z = R * sin(a)，所以 a = arcsin(z/R)
  3. 有了纬度之后，对应的纬度圈就明确了，带入x/y的计算公式，再把经度求出来。

```javascript
var fromCartesian = Cesium.Cartographic.fromCartesian(fromDegrees);
```


## 角度转换为弧度 

公式:  π/180×角度

```javascript

//函数3：Math.toRadians =  0.5235987755982988
var toRadians = Cesium.Math.toRadians(daTAs.heading);

```

## 弧度转为角度

公式: 180/π×弧度

```javascript

var toDegrees = Cesium.Math.toDegrees(fromCartesian.longitude);

```



## 弧度转换成3X3的矩阵，

```javascript
var fromRotationZ = Cesium.Matrix3.fromRotationZ(toRadians);
```

## 3X3矩阵转换成4X4矩阵，前三行一样，第四行为（0 0 0 1）
```javascript
var fromRotationTranslation =Cesium.Matrix4.fromRotationTranslation(fromRotationZ);
```

## 计算两个矩阵的乘积
```javascript
var multiply = Cesium.Matrix4.multiply(eastNorthUpToFixedFrame, fromRotationTranslation, eastNorthUpToFixedFrame);
```




## 获得4X4矩阵左上角的3X3旋转矩阵
```javascript
var getRotation = Cesium.Matrix4.getRotation(multiply, new Cesium.Matrix3());
```

## Matrix3.multiplyByVector计算3X3矩阵和列向量的乘积

```javascript
var rotpos = new Cesium.Cartesian3(daTAs.range, 0.0, 0.0);
//multiplyByVector =  a {x: -30.19584661247208, y: -33.62908179425963, z: 21.384473456951262}
var multiplyByVector = Cesium.Matrix3.multiplyByVector(getRotation, rotpos, new Cesium.Cartesian3());

```

## 两个矩阵相加
```javascript
//fromDegrees =  a {x: -2847383.0422115843, y: 4659501.404998853, z: 3284729.700788161}
//addrotpos =  a {x: -2847413.238058197, y: 4659467.775917059, z: 3284751.085261618}
var addrotpos = Cesium.Cartesian3.add(fromDegrees, multiplyByVector, new Cesium.Cartesian3());
```

## 获取矩阵指定行的数据

```javascript
//Cesium.Matrix3.getColumn(matrix, index, result),获取矩阵指定行的数据
//xaxis = getRotation[0] = a {x: -0.6039169322494417, y: -0.6725816358851927, z: 0.4276894691390252}
var xaxis = Cesium.Matrix3.getColumn(getRotation, 0, new Cesium.Cartesian3());
var yaxis = Cesium.Matrix3.getColumn(getRotation, 1, new Cesium.Cartesian3());
var zaxis = Cesium.Matrix3.getColumn(getRotation, 2, new Cesium.Cartesian3());

```


## 两个矩阵相减
```javascript
//Cesium.Cartesian3.subtract(left, right, result)，两个矩阵相减
//subtract =  a {x: -25.058249244466424, y: -23.75879775546491, z: 11.900636777747422}
var subtract = Cesium.Cartesian3.subtract(addrotpos, fromDegrees1 , new Cesium.Cartesian3());
 
```

## 计算两个坐标的叉(外)积
```javascript
//Cesium.Cartesian3.cross(left, right, result) ，计算两个坐标的叉(外)积
//subtract X zaxis =  a {x: -20.99322632899841, y: 7.672236225656107, z: -28.886722231773863}
//zaxis X dir01 =  a {x: -25.05824176993303, y: -23.75880998690632, z: 11.900628097043635}
var dir01 = Cesium.Cartesian3.cross(subtract, zaxis, new Cesium.Cartesian3());
var dir02 = Cesium.Cartesian3.cross(zaxis, dir01, new Cesium.Cartesian3());
```

## 标准化
```javascript
//Cesium.Cartesian3.normalize(cartesian, result)，标准化
//dir02normalize =  a {x: -0.6039169322500869, y: -0.6725816358850737, z: 0.42768946913830164}
var dir02normalize = Cesium.Cartesian3.normalize(dir02, new Cesium.Cartesian3());
```


## 两个坐标的夹角，弧度表示

```javascript
//Cesium.Cartesian3.angleBetween(left, right),两个坐标的夹角，弧度表示
//angleBetween(xaxis, dir02normalize) =  0.13281132473930984
var angleBetween = Cesium.Cartesian3.angleBetween(xaxis, dir02normalize);
```


```javascript

var daTAs = {
    code: '',
    longitude: 121.42875949287559,
    latitude: 31.198376344961723,
    height: 6,
    heading: 90,
    scale: 1,
    range: 50,
    bimshow: true,
    iseidting: false,
    depthtest: false,
    mat: '',
};
/* CESIUM原装函数 */
/* CESIUM原装函数 */
/* CESIUM原装函数 */
/*
  new Cesium.Matrix3(
    column0Row0, column1Row0, column2Row0, 
    column0Row1, column1Row1, column2Row1, 
    column0Row2, column1Row2, column2Row2)
*/
// 经纬度坐标转换笛卡尔坐标
//Cartesian3.fromDegrees =  a {x: -2847383.0422115843, y: 4659501.404998853, z: 3284729.700788161}
var fromDegrees = Cesium.Cartesian3.fromDegrees(daTAs.longitude, daTAs.latitude, daTAs.height);
var fromDegrees1 = Cesium.Cartesian3.fromDegrees(daTAs.longitude- 0.0005, daTAs.latitude- 0.0005, daTAs.height);
 
//笛卡尔坐标转换成4X4的矩阵，Transfroms。第四行是笛卡尔坐标，前三行是旋转参数。
/**
  *  Computes a 4x4 transformation matrix from a reference frame with an east-north-up axes centered at the provided origin to the provided ellipsoid's fixed reference frame. The local axes are defined as:
  *  The x axis points in the local east direction.
  *  The y axis points in the local north direction.
  *  The z axis points in the direction of the ellipsoid surface normal which passes through the position.
*/

var eastNorthUpToFixedFrame = Cesium.Transforms.eastNorthUpToFixedFrame(fromDegrees);
 
//角度转换为弧度
//函数3：Math.toRadians =  0.5235987755982988
var toRadians = Cesium.Math.toRadians(daTAs.heading);
 
//弧度转换成3X3的矩阵，
var fromRotationZ = Cesium.Matrix3.fromRotationZ(toRadians);
 
//3X3矩阵转换成4X4矩阵，前三行一样，第四行为（0 0 0 1）
var fromRotationTranslation =Cesium.Matrix4.fromRotationTranslation(fromRotationZ);
 
//计算两个矩阵的乘积Cesium.Matrix4.multiply(a, b, a),a = a*b;
var multiply = Cesium.Matrix4.multiply(eastNorthUpToFixedFrame, fromRotationTranslation, eastNorthUpToFixedFrame);
 
//笛卡尔坐标转为经纬度坐标(longitude, latitude, height)，用经纬度用弧度
//fromCartesian.longitude = 2.1193316597629988
var fromCartesian = Cesium.Cartographic.fromCartesian(fromDegrees);
 
//函数8：弧度转为角度
//Math.toDegrees =  121.42875949287559
var toDegrees = Cesium.Math.toDegrees(fromCartesian.longitude);
 
//获得4X4矩阵左上角的3X3旋转矩阵
/*Matrix4.getRotation =  {
    0: -0.6039169322494417, 1: -0.6725816358851927, 2: 0.4276894691390252, 
    3: 0.6605635299913337, 4: -0.12206955725374125, 5: 0.7407798904109532, 
    6: -0.44602708638356436, 7: 0.7298855843636546, 8: 0.5180027721453959}*/
var getRotation = Cesium.Matrix4.getRotation(multiply, new Cesium.Matrix3());
 
//Matrix3.multiplyByVector计算3X3矩阵和列向量的乘积
//rotpos = new Cesium.Cartesian3 =  a {x: 50, y: 0, z: 0}
var rotpos = new Cesium.Cartesian3(daTAs.range, 0.0, 0.0);
//multiplyByVector =  a {x: -30.19584661247208, y: -33.62908179425963, z: 21.384473456951262}
var multiplyByVector = Cesium.Matrix3.multiplyByVector(getRotation, rotpos, new Cesium.Cartesian3());
 
//Cesium.Cartesian3.add(left, right, result)，两个矩阵相加
//fromDegrees =  a {x: -2847383.0422115843, y: 4659501.404998853, z: 3284729.700788161}
//addrotpos =  a {x: -2847413.238058197, y: 4659467.775917059, z: 3284751.085261618}
var addrotpos = Cesium.Cartesian3.add(fromDegrees, multiplyByVector, new Cesium.Cartesian3());
 
//Cesium.Matrix3.getColumn(matrix, index, result),获取矩阵指定行的数据
//xaxis = getRotation[0] = a {x: -0.6039169322494417, y: -0.6725816358851927, z: 0.4276894691390252}
var xaxis = Cesium.Matrix3.getColumn(getRotation, 0, new Cesium.Cartesian3());
var yaxis = Cesium.Matrix3.getColumn(getRotation, 1, new Cesium.Cartesian3());
var zaxis = Cesium.Matrix3.getColumn(getRotation, 2, new Cesium.Cartesian3());
 
//Cesium.Cartesian3.subtract(left, right, result)，两个矩阵相减
//subtract =  a {x: -25.058249244466424, y: -23.75879775546491, z: 11.900636777747422}
var subtract = Cesium.Cartesian3.subtract(addrotpos, fromDegrees1 , new Cesium.Cartesian3());
 
//Cesium.Cartesian3.cross(left, right, result) ，计算两个坐标的叉(外)积
//subtract X zaxis =  a {x: -20.99322632899841, y: 7.672236225656107, z: -28.886722231773863}
//zaxis X dir01 =  a {x: -25.05824176993303, y: -23.75880998690632, z: 11.900628097043635}
var dir01 = Cesium.Cartesian3.cross(subtract, zaxis, new Cesium.Cartesian3());
var dir02 = Cesium.Cartesian3.cross(zaxis, dir01, new Cesium.Cartesian3());
 
//Cesium.Cartesian3.normalize(cartesian, result)，标准化
//dir02normalize =  a {x: -0.6039169322500869, y: -0.6725816358850737, z: 0.42768946913830164}
var dir02normalize = Cesium.Cartesian3.normalize(dir02, new Cesium.Cartesian3());
 
//Cesium.Cartesian3.angleBetween(left, right),两个坐标的夹角，弧度表示
//angleBetween(xaxis, dir02normalize) =  0.13281132473930984
var angleBetween = Cesium.Cartesian3.angleBetween(xaxis, dir02normalize);
 
 
 
console.log('_____CESIUM原始函数_____');
console.log('函数1：Cesium.Cartesian3.fromDegrees');
console.log('fromDegrees =', fromDegrees);
console.log('fromDegrees1 =', fromDegrees1);
console.log('函数2：Transforms.eastNorthUpToFixedFrame = ', eastNorthUpToFixedFrame);
console.log('函数3：Math.toRadians = ', toRadians);
console.log('函数4：Matrix3.fromRotationZ = ', fromRotationZ);
console.log('函数5：Matrix4.fromRotationTranslation = ', fromRotationTranslation);
console.log('函数6：Matrix4.multiply = ',multiply);
console.log('函数7：Cartographic.fromCartesian = ', fromCartesian);
console.log('函数8：Math.toDegrees = ', toDegrees);
console.log('函数9：Matrix4.getRotation = ', getRotation);
console.log('函数10：Matrix3.multiplyByVector = ', multiplyByVector);
console.log('new Cesium.Cartesian3 = ', rotpos);
console.log('函数11：Cartesian3.add = ', addrotpos);
console.log('函数12：Cesium.Matrix3.getColumn');
console.log('xaxis = ', xaxis);
console.log('yaxis = ', yaxis);
console.log('zaxis = ', zaxis);
console.log('函数13：Cesium.Cartesian3.subtract');
console.log('Cartesian3.add — Cartesian3.fromDegrees = ');
console.log('subtract = ', subtract);
console.log('函数14：Cesium.Cartesian3.cross');
console.log('subtract X zaxis = ', dir01);
console.log('zaxis X dir01 = ', dir02);
console.log('函数15：Cesium.Cartesian3.normalize');
console.log('dir02normalize = ', dir02normalize);
console.log('函数16：Cesium.Cartesian3.angleBetween');
console.log('angleBetween(xaxis, dir02normalize) = ', angleBetween);
console.log('角度angleBetween = ', Cesium.Math.toDegrees(angleBetween));

```