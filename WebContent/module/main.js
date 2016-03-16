(function(win){
	require.config({
		paths: {
			'jquery': '../lib/jquery/dist/jquery.min',
			'metro': '../lib/metro/build/js/metro.min',
			'backbone': '../lib/backbone/backbone',
			'underscore': '../lib/underscore/underscore-min',
			'cookie' : '../lib/jquery.cookie/jquery.cookie',
			'MD5' : '../lib/js-md5/build/md5.min',
			'text': '../lib/text/text',
			'util': './util/Util'
		},
		
		shim: {
	        'underscore': {
	            exports: '_'
	        },
	        'jquery': {
	            exports: '$'
	        },
	        'backbone': {
	            deps: ['underscore', 'jquery'],
	            exports: 'Backbone'
	        },
	        'metro' : {
		    	deps : [ 'jquery' ],
		    	exports : 'metro'
		    },
	       'MD5' : {
	    	   exports: 'MD5'
	       }
		}  
	});

	require([ 'backbone', 'router' ], function(Backbone, RouterCtl) {
		//start monitoring
	    Backbone.history.start();
	});
})(window);
