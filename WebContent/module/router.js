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
    	
    	//application modules
    	'app-detection': './controller/ctl_app_detection',
    	'app-hotline': '/controller/ctl_app_hotline',
    	
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
