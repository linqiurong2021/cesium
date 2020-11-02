# viewer.camera.flyTo和viewer.flyTo的区别

  首先二者定位目标不同，viewer.camera.flyTo针对的是<font color="#ff0000">某点或rectangle</font>，而viewer.flyTo(target, options)针对的是<font color="#ff0000">实体</font>（基于点的广告牌或rectangle等）。参数配置区别：

如果在场景中已经添加了各个要素，需要定位到某个目标，显然viewer. fyTo()是比较合适的；也就是说目标是要素，viewer. fyTo()比较合适。比如定位到某个坐标；如果是设置相机位置，Camera. fyTo()比较合适