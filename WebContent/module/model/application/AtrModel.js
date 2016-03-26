define([ 'backbone', 'util' ], function(Backbone, util) {
	var Atr = Backbone.Model.extend({
		defaults: {
			'sectionids': 0,
			'geojson': ''
		},
		
		parse: function(response) {
			response.geojson = $.parseJSON(response.geojson);
		    return response;
		}
	});
	
	return Atr;
});