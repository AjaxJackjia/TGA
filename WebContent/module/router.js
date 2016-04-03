define([ 'backbone' ], function (Backbone) {
	
	// router basic settings (Tiles mapping settings)
	var routesMap = {
		//menu module
    	"": './controller/ctl_menu',
    	'menu': './controller/ctl_menu',
    	
    	//introduction modules
    	'intro-abstract': './controller/ctl_intro_abstract',
    	
    	//tools modules
    	'tools-draw': './controller/ctl_tools_draw',
    	'tools-heatmap': './controller/ctl_tools_heatmap',
    	'tools-od': './controller/ctl_tools_od_analysis',
    	'tools-trip': './controller/ctl_tools_trip_analysis',
    	'tools-section-selection': './controller/ctl_tools_section_selection',
    	'tools-road-network': './controller/ctl_tools_road_network',
    	'tools-motivation': './controller/ctl_tools_motivation',
    	
    	//application modules
    	'app-detection': './controller/ctl_app_detection',
    	'app-hotline': './controller/ctl_app_hotline',
    	
    	//error
        '*error': './error/default',
    };

    var Router = Backbone.Router.extend({
        routes: routesMap
    });

    var router = new Router();
    
    router.on('route', function (route, params) {
        require([route], function (controller) {
            if(router.currentController && router.currentController !== controller){
                router.currentController.onRouteChange && router.currentController.onRouteChange();
            }
            router.currentController = controller;
            controller.apply(null, params); 
        });
    });

    return router;
});
