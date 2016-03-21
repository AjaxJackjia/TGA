define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/common/BackBtnView',
		'view/common/InfoBtnView',
		'view/tools/RoadNetworkBtnView'
       ], function(Backbone, MapView, BackBtnView, InfoBtnView, RoadNetworkBtnView) {
	
	var Controller = function() {
		console.log("This is tools controller module!");
		
		//map
		var map = new MapView();
		
		//left menu
		var back = new BackBtnView();
		var info = new InfoBtnView();
		var moduleInfo = '<p>' +
						 '	此模块是城市路网模型的校验工具' +
						 '</p>';
		info.setInfo(moduleInfo);
		var menu = new RoadNetworkBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			info.unrender();
			menu.unrender();
		};
	};
	
	return Controller;
});