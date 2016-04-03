define([ 'backbone', 'metro', 'util' ], function(Backbone, Metro, Util) {
	
	var MotivationBtnView = Backbone.View.extend({
		
		className: 'motivation-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.motivationView = new MotivationView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-compass">');
			$(this.el).html($button);
			$(this.el).attr('title', 'motivation...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.drawElementsView.unrender();
			$(this.el).remove();
		},
		
		toggle: function() {
			this.drawElementsView.toggle();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	var MotivationView = Backbone.View.extend({
		
		className: 'motivation-view',
		
		events: {
			'click .draw': 'draw',
			'click .clean': 'clean',
			'change .input-type > select': 'clean'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 
					 'drawMotivation', 'drawGPS', 'drawAssignedSection', 'drawAugmentedSection');
			
			//motivation param
			this.param = {};
			this.param.o_lng = 114.05604600906372;
			this.param.o_lat = 22.551225247189432;
			this.param.d_lng = 114.09120440483093;
			this.param.d_lat = 22.545463347318833;
			this.param.path = "33879,33880,33881,33882,33883,33884,33885,41084,421,422,423,2383,2377,2376,2334,2335,2565,2566,2567,2568,2569,2570,2571,2572,2573,39716,39717,39718,39719,39720,39721,39722,39723,448,39677,39678";
			
			//GPS param
			this.param.gps = "114.05538082122803,22.551086528436926#114.05844390392303,22.551324331927283#114.06151771545409,22.551264881093118#114.06260132789612,22.54908499948478#114.06269788742065,22.5456862971879#114.06271934509277,22.54315951091646#114.06271934509277,22.538938188315093#114.06284809112547,22.53441944644356";
			//assigned section param
			this.param.assign = "33878,33881,33883,2874,2877,2347,937,941";
			//augmented section param //33878,33879,33880,33881,33882,33883,2874,2875,2876,2877,2878,2347,935,936,937,938,939,940,941,
			this.param.augment = "33879,33880,33882,2875,2876,2878,935,936,938,939,940";
			
			//add to page
			this.render();
		},
		
		render: function() {
			//this.drawMotivation();
			
			this.drawAssignedSection();
			
			this.drawAugmentedSection();
			
			this.drawGPS();
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		toggle: function() {
			$(this.el).css('display') == 'none' ? $(this.el).show() : $(this.el).hide();
		},
		
		drawMotivation: function() {
			$.get('api/trajectories/motivation', this.param, function(data){
				Backbone.trigger('MapView:drawMotivation', data);
			});
		},
		
		drawGPS: function() {
			var self = this;
			setTimeout(function() {
				var points = self.param.gps.split('#');
				_.each(points, function(point_text, index) {
					var data = {};
					data.geojson = self._getPoint(point_text);
					data.options = {};
					
					Backbone.trigger('MapView:drawSampleGPSPoint', data);
				});
			}, 2000);
		},
		
		drawAssignedSection: function() {
			$.get('api/elements/sections', {id: this.param.assign}, function(data){
				Backbone.trigger('MapView:drawSampleAssignedSection', data);
			});
		},
		
		drawAugmentedSection: function() {
			$.get('api/elements/sections', {id: this.param.augment}, function(data){
				Backbone.trigger('MapView:drawSampleAugmentedSection', data);
			});
		},
		
		_getPoint: function(text) {
			var point = text.split(',');
			var geojson = {
				"type": "FeatureCollection",
				"features":[{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [parseFloat(point[0]), parseFloat(point[1])]
					}
				}]
			};
			
			return geojson;
		},
	});
	
	return MotivationBtnView;
});