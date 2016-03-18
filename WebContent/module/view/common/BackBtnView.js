define([ 'backbone' ], function(Backbone) {
	
	var BackBtnView = Backbone.View.extend({
		
		className: 'back-btn-view menu-btn',
		
		events: {
			'click': 'back',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'back', 'over', 'out');
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-arrow-left">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Back to menu...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		back: function() {
			location.href = 'index.html';
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	return BackBtnView;
});