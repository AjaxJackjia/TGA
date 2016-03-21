define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/common/BackBtnView',
		'view/common/InfoBtnView',
		'view/tools/ODAnalysisBtnView'
       ], function(Backbone, MapView, BackBtnView, InfoBtnView, ODAnalysisBtnView) {
	
	var Controller = function() {
		console.log("This is tools controller module!");
		
		//map
		var map = new MapView();
		
		//left menu
		var back = new BackBtnView();
		var info = new InfoBtnView();
		var moduleInfo = '<p>' +
						 '	此模块是出租车OD之间轨迹集合分析' +
						 '</p>';
		info.setInfo(moduleInfo);
		var menu = new ODAnalysisBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			info.unrender();
			menu.unrender();
		};
	};
	
	return Controller;
});