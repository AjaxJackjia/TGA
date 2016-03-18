(function(win){
	require.config({
		paths: {
			'backbone': '../lib/backbone/backbone',
			'cookie' : '../lib/jquery.cookie/jquery.cookie',
			'jquery': '../lib/jquery/dist/jquery.min',
			'jstsutil': '../lib/jsts/javascript.util',
			'jsts': '../lib/jsts/jsts',
			'leaflet': '../lib/leaflet/dist/leaflet',
			'heatmap': '../lib/leaflet/dist/heatmap.min',
			'leaflet-heatmap': '../lib/leaflet/dist/leaflet-heatmap',
			'OpenLayers': '../lib/OpenLayers-2.13.1/OpenLayers',
			'MD5' : '../lib/js-md5/build/md5.min',
			'metro': '../lib/metro/build/js/metro.min',
			'text': '../lib/text/text',
			'underscore': '../lib/underscore/underscore-min',
			'util': './util/Util'
		},
		
		shim: {
			'backbone': {
	            deps: ['underscore', 'jquery'],
	            exports: 'Backbone'
	        },
	        'jquery': {
	            exports: '$'
	        },
	        'jsts' : {
		    	deps : [ 'jstsutil' ],
		    	exports : 'jsts'
		    },
	        'leaflet': {
	        	exports: 'L'
	        },
	        'leaflet-heatmap': {
	        	deps : [ 'heatmap' ],
	        	exports: 'leaflet-heatmap'
	        },
	        'metro' : {
		    	deps : [ 'jquery' ],
		    	exports : 'metro'
		    },
	        'MD5' : {
	    	    exports: 'MD5'
	        },
	        'underscore': {
	            exports: '_'
	        }
		}  
	});

	require([ 'backbone', 'router' ], function(Backbone, RouterCtl) {
		//start monitoring
	    Backbone.history.start();
	});
})(window);
