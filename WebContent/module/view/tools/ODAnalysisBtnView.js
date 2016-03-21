define([ 'backbone', 'metro', 'util', 
         'view/common/InputODView' 
       ], function(Backbone, Metro, Util, InputODView) {
	
	var ODAnalysisBtnView = Backbone.View.extend({
		
		className: 'od-analysis-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.odAnalysisView = new ODAnalysisView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-location">');
			$(this.el).html($button);
			$(this.el).attr('title', 'OD analysis setting...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.odAnalysisView.unrender();
			$(this.el).remove();
		},
		
		toggle: function() {
			this.odAnalysisView.toggle();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	var ODAnalysisView = Backbone.View.extend({
		
		className: 'od-analysis-view',
		
		events: {
			'click .draw': 'draw',
			'click .clean': 'clean'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'draw', 'clean');
			
			//initial status
			this.inputODView = new InputODView();
			
			//add to page
			this.render();
			
			//init map click event
			Backbone.trigger('MapView:initODAnalysisClick', null);
		},
		
		render: function() {
			var $radius = $('<div class="radius input-control text" data-role="input">');
			$radius.append('<input type="text" placeholder="radius">');
			
			
			var $btns = $('<div class="btns input-control">');
			$btns.append($('<button class="draw button primary">Draw</button>'));
			$btns.append($('<button class="clean button primary">Clean</button>'));
			
			$(this.el).append($radius);
			$(this.el).append($(this.inputODView.el));
			$(this.el).append($btns);
			$('body > .container').append($(this.el));
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		toggle: function() {
			$(this.el).css('display') == 'none' ? $(this.el).show() : $(this.el).hide();
		},
		
		draw: function() {
			var param = {};
			var od = this.inputODView.getOD();
			param.o_lng = od.from_lng;
			param.o_lat = od.from_lat;
			param.d_lng = od.to_lng;
			param.d_lat = od.to_lat;
			param.radius = $('.radius > input').val() || 1000;
			param.limit = 100000;
			param.is_across = false;
			
			$.get('api/od/trajectory', param, function(data){
				//clean
				Backbone.trigger('MapView:clean', null);
				
				var trajectoriesParam = {};
				trajectoriesParam.data = data;
				trajectoriesParam.options = {
					color: 'blue'	
				};
				
				Backbone.trigger('MapView:drawTrajectories', trajectoriesParam);
				Backbone.trigger('MapView:drawStartPoint', {lng: param.o_lng, lat: param.o_lat});
				Backbone.trigger('MapView:drawEndPoint', {lng: param.d_lng, lat: param.d_lat});
			});
		},
		
		clean: function() {
			this.inputODView.clean();
			$('.radius > input').val('');
			
			Backbone.trigger('MapView:clean', null);
		}
	});
	
	return ODAnalysisBtnView;
});