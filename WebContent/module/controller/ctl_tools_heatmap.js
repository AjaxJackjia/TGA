define([ 'backbone', 
         //view
		'view/common/MapView',
		'view/tools/BackBtnView',
		'view/tools/ODBtnView',
		'view/tools/ResultBtnView'
       ], function(Backbone, MapView, BackBtnView, ODBtnView, ResultBtnView) {
	
	var Controller = function() {
		console.log("This is tools controller module!");
		
		//map
		var map = new MapView();
		
		//left menu
		var back = new BackBtnView();
		var od = new ODBtnView();
		var result = new ResultBtnView();
		
		Controller.onRouteChange = function() {
			map.unrender();
			back.unrender();
			od.unrender();
		};
	};
	
	return Controller;
});