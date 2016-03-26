define([ 'backbone', 'metro', 'util'
       ], function(Backbone, Metro, Util) {
	
	var CalculationResultView = Backbone.View.extend({
		
		className: 'calculation-result-view',
		
		events: {
			'click .set': 'set',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'set');
			
			//initial param
			
			
			//add to page
			this.render();
		},
		
		render: function() {
			$(this.el).html('<div class="title">Result:</div>');
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		set: function() {
			
		}
	});
	
	return CalculationResultView;
});