define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/common/BackBtnView',
		'view/common/InfoBtnView',
		'view/tools/SectionSelectionBtnView'
       ], function(Backbone, MapView, BackBtnView, InfoBtnView, SectionSelectionBtnView) {
	
	var Controller = function() {
		console.log("This is tools controller module!");
		
		//map
		var map = new MapView();
		map.setZoom(16);
		
		//left menu
		var back = new BackBtnView();
		var info = new InfoBtnView();
		var moduleInfo = '<p>' +
						 '	此模块是关于区域内特定section选择的工具' +
						 '</p>';
		info.setInfo(moduleInfo);
		var menu = new SectionSelectionBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			info.unrender();
			menu.unrender();
		};
	};
	
	return Controller;
});