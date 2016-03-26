define([ 'backbone', 'util' ], function(Backbone, util) {
	var Point = Backbone.Model.extend({
		defaults: {
			'lng': 0,
			'lat': 0,
			'geojson': ''
		}
	});
	
	return Point;
});