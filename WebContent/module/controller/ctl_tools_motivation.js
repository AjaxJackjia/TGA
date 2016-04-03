define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/common/BackBtnView',
		'view/common/InfoBtnView',
		'view/tools/MotivationBtnView'
       ], function(Backbone, MapView, BackBtnView, InfoBtnView, MotivationBtnView) {
	
	var Controller = function() {
		console.log("This is online anomaly detection motivation controller module!");
		
		//map
		var map = new MapView();
		
		//left menu
		var back = new BackBtnView();
		var info = new InfoBtnView();
		var moduleInfo = '<p>' +
						 '	此模块绘制异常检测的动机示意图。' +
						 '</p>';
		info.setInfo(moduleInfo);
		var menu = new MotivationBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			info.unrender();
			menu.unrender();
		};
	};
	
	return Controller;
});