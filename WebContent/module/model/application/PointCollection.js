define([ 'backbone', 'util', 'model/application/PointModel' ], function(Backbone, util, PointModel) {
	var Points = Backbone.Collection.extend({
		model: PointModel
	});
	
	return Points;
});