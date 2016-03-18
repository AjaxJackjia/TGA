define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/common/BackBtnView',
		'view/common/InfoBtnView',
		'view/tools/HeatmapBtnView'
       ], function(Backbone, MapView, BackBtnView, InfoBtnView, HeatmapBtnView) {
	
	var Controller = function() {
		console.log("This is tools controller module!");
		
		//map
		var map = new MapView();
		
		//left menu
		var back = new BackBtnView();
		var info = new InfoBtnView();
		var moduleInfo = '<p>' +
						 '	此模块绘制地图OD的分布情况' +
						 '</p>';
		info.setInfo(moduleInfo);
		var menu = new HeatmapBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			info.unrender();
			menu.unrender();
		};
	};
	
	return Controller;
});