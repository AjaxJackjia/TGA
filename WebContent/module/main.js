require.config({
	paths: {
		'jquery': '../lib/jquery/dist/jquery.min',
		'metro': '../lib/metro/build/js/metro.min'
	},

	shim : {
	    'metro' : {
	    	deps : [ 'jquery' ],
	    	exports : 'metro'
	    }
	}  
});

require(['common/util', 'menu/menu'], function(util, menu) {
	util.loadCss('res/css/main.css');
	
	menu.init();
});