define([ 'backbone', 'metro', 'highcharts' ], function(Backbone, Metro, Highcharts) {
	
	var ChartBtnView = Backbone.View.extend({
		
		className: 'chart-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out', 'setInfo');
			
			//info dialog
			this.dialog = $('<div data-role="dialog" id="chart_dialog">');
			this.dialog.addClass('padding20');
			this.dialog.attr('data-close-button', 'true');
			this.dialog.append('<div id="chart" style="min-width: 1200px; height: 500px; margin: 0 auto">');
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-chart-dots">');
			$(this.el).html($button);
			$(this.el).attr('title', 'chart plot...');
			
			$('body > .container').append($(this.el));
			$('body > .container').append(this.dialog);
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
			this.dialog.remove();
		},
		
		toggle: function() {
	        toggleMetroDialog('#chart_dialog');
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
	
	return ChartBtnView;
});