define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/common/BackBtnView',
		'view/common/InfoBtnView',
		'view/tools/TripAnalysisBtnView'
       ], function(Backbone, MapView, BackBtnView, InfoBtnView, TripAanlysisBtnView) {
	
	var Controller = function() {
		console.log("This is tools controller module!");
		
		//map
		var map = new MapView();
		
		//left menu
		var back = new BackBtnView();
		var info = new InfoBtnView();
		var moduleInfo = '<p>' +
						 '	此模块是关于出租车轨迹单条轨迹的分析模块，包括Raw GPS、Assignment、Augment。' +
						 '</p>';
		info.setInfo(moduleInfo);
		var menu = new TripAanlysisBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			info.unrender();
			menu.unrender();
		};
	};
	
	return Controller;
});