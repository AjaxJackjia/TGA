define([ 'backbone', 'metro' ], function(Backbone, Metro) {
	
	var InfoBtnView = Backbone.View.extend({
		
		className: 'info-btn-view menu-btn',
		
		events: {
			'click': 'show',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'show', 'over', 'out', 'setInfo');
			
			//info dialog
			this.dialog = $('<div data-role="dialog" id="info_dialog">');
			this.dialog.addClass('padding20');
			this.dialog.attr('data-width', '600');
			this.dialog.attr('data-close-button', 'true');
			this.dialog.append('<h1 style="text-align: center;">Module Information</h1>');
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-question">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Detail Info...');
			
			$('body > .container').append($(this.el));
			$('body > .container').append(this.dialog);
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
			this.dialog.remove();
		},
		
		show: function() {
			var dialog = $('#info_dialog').data('dialog');
	        dialog.open();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}, 
		
		setInfo: function(content) {
			this.dialog.append(content);
		}
	});
	
	return InfoBtnView;
});