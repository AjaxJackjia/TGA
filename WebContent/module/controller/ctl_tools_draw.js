define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/common/BackBtnView',
		'view/common/InfoBtnView',
		'view/tools/DrawElementsBtnView'
       ], function(Backbone, MapView, BackBtnView, InfoBtnView, DrawElementsBtnView) {
	
	var Controller = function() {
		console.log("This is basic elements drawing controller module!");
		
		//map
		var map = new MapView();
		
		//left menu
		var back = new BackBtnView();
		var info = new InfoBtnView();
		var moduleInfo = '<p>' +
						 '	此模块绘制基础的地图元素，如<a href="http://geojson.org/geojson-spec.html" target="_blank">GeoJSON</a>、' +
						 '	<a href="https://en.wikipedia.org/wiki/Well-known_text" target="_blank">WKT</a>、Node元素、Way元素、Segment元素、Section元素，' +
						 '	其中，Node、Segment和Section可以输入多个id，分隔符为小写的&nbsp;&nbsp;<b>,</b> 。' +
						 '</p>';
		info.setInfo(moduleInfo);
		var menu = new DrawElementsBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			info.unrender();
			menu.unrender();
		};
	};
	
	return Controller;
});