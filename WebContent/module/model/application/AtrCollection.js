define([ 'backbone', 'util', 'model/application/AtrModel' ], function(Backbone, util, AtrModel) {
	var Atrs = Backbone.Collection.extend({
		model: AtrModel
	});
	
	return Atrs;
});