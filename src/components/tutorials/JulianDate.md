# Cesium.JulianDate() 

  朱利安时间=UTC=GMT  北京时间 GMT + 8

```
代码：想让时钟显示 2017/10/20   13:30:00

var date1=new Date(2017,10,20,21,30,00);//时间为：2017/10/20  21:30:00

var julianTime=Cesium.JulianDate.fromDate(date1);//转为朱利安日期

//设置时钟的当前日期

viewer.clock.currentTime=julianTime.clone();//时钟上显示的时间为:2017/10/20   13:30:00

//如果保持北京时间和cesisum时间相同

var timeBeijing=new Date("2017/10/25 09:00:00");//北京时间

var utc=Cesium.JulianDate.fromDate(new Date("2017/10/25 09:00:00"));//UTC

viewer.clock.currentTime=Cesium.JulianDate.addHours(utc,8,new Cesium.JulianDate());//北京时间=UTC+8=GMT+8

```