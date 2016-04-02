define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/common/BackBtnView',
		'view/common/InfoBtnView',
		'view/application/hotline/HotlineBtnView',
		'view/application/hotline/ChartBtnView'
       ], function(Backbone, MapView, BackBtnView, InfoBtnView, HotlineBtnView, ChartBtnView) {
	
	var Controller = function() {
		console.log("This is app controller module!");
		
		//map
		var map = new MapView();
		
		//left menu
		var back = new BackBtnView();
		var info = new InfoBtnView();
		var moduleInfo = '<p>' +
						 '	此模块公交交通热点聚类分析' +
						 '</p>';
		info.setInfo(moduleInfo);
		var menu = new HotlineBtnView();
		var chart = new ChartBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			info.unrender();
			menu.unrender();
			chart.unrender();
		};
	};
	
	return Controller;
});