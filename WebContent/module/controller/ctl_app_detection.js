define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/common/BackBtnView',
		'view/common/InfoBtnView',
		'view/application/detection/OnlineDetectionBtnView'
       ], function(Backbone, MapView, BackBtnView, InfoBtnView, OnlineDetectionBtnView) {
	
	var Controller = function() {
		console.log("This is app controller module!");
		
		//map
		var map = new MapView();
		
		//left menu
		var back = new BackBtnView();
		var info = new InfoBtnView();
		var moduleInfo = '<p>' +
						 '	此模块实时在线出租车异常轨迹分析模块' +
						 '</p>';
		info.setInfo(moduleInfo);
		var menu = new OnlineDetectionBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			info.unrender();
			menu.unrender();
		};
	};
	
	return Controller;
});