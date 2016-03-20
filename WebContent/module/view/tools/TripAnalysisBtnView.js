define([ 'backbone', 'metro', 'util' ], function(Backbone, Metro, Util) {
	
	var TripAnalysisBtnView = Backbone.View.extend({
		
		className: 'trip-analysis-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.tripAnalysisView = new TripAnalysisView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-cab">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Trip analysis setting...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.tripAnalysisView.unrender();
			$(this.el).remove();
		},
		
		toggle: function() {
			this.tripAnalysisView.toggle();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	var TripAnalysisView = Backbone.View.extend({
		
		className: 'trip-analysis-view',
		
		events: {
			'click .draw': 'draw',
			'click .clean': 'clean',
			'change .input-control.checkbox > input': 'toggleLayer'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'draw', 'clean', 'toggleLayer');
			
			//initial status
			this.hasRequest = false;
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $tripId = $('<div class="trip-id input-control text">');
			$tripId.append('<input type="text" placeholder="trip id...">');
			
			var $rawGPSLayer = $('<label class="raw-layer input-control checkbox small-check">');
			$rawGPSLayer.append('<input type="checkbox">');
			$rawGPSLayer.append('<span class="check"></span>');
			$rawGPSLayer.append('<span class="caption">Raw GPS</span>');
			$rawGPSLayer.find('input').prop("checked", true);
			
			var $assignLayer = $('<label class="assign-layer input-control checkbox small-check">');
			$assignLayer.append('<input type="checkbox">');
			$assignLayer.append('<span class="check"></span>');
			$assignLayer.append('<span class="caption">Assignment</span>');
			$assignLayer.find('input').prop("checked", true);
			
			var $augmentLayer = $('<label class="augment-layer input-control checkbox small-check">');
			$augmentLayer.append('<input type="checkbox">');
			$augmentLayer.append('<span class="check"></span>');
			$augmentLayer.append('<span class="caption">Augment</span>');
			$augmentLayer.find('input').prop("checked", true);
			
			var $btns = $('<div class="btns input-control">');
			$btns.append($('<button class="draw button primary">Draw</button>'));
			$btns.append($('<button class="clean button primary">Clean</button>'));
			
			$(this.el).append($tripId);
			$(this.el).append($rawGPSLayer);
			$(this.el).append($assignLayer);
			$(this.el).append($augmentLayer);
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
			var self = this;
			
			var tripId = $('.trip-id > input').val();
			if(tripId == '') {
				alert('please input trip id');
				return;
			}
			
			$.get('api/trajectories/' + tripId, function(data){
				//clean
				Backbone.trigger('MapView:clean', null);
				
				data.gpsData 	 = $.parseJSON(data.gpsData);
				data.assignData  = $.parseJSON(data.assignData);
				data.augmentData = $.parseJSON(data.augmentData);
				
				Backbone.trigger('MapView:drawTrip', data);
				self.hasRequest = true;
				$('.raw-layer').find('input').prop("checked", true);
				$('.assign-layer').find('input').prop("checked", true);
				$('.augment-layer').find('input').prop("checked", true);
				
				//set layerid
				if(data.hasOwnProperty('gpsLayerId') && data.gpsLayerId != '') {
					$('.raw-layer').attr('layerid', data.gpsLayerId);
				}
				if(data.hasOwnProperty('assignLayerId') && data.assignLayerId != '') {
					$('.assign-layer').attr('layerid', data.assignLayerId);
				}
				if(data.hasOwnProperty('augmentLayerId') && data.augmentLayerId != '') {
					$('.augment-layer').attr('layerid', data.augmentLayerId);
				}
			});
		},
		
		toggleLayer: function(event) {
			if(!this.hasRequest) {
				return;
			}
			
			var param = {};
			param.layerid = $(event.target).parent().attr('layerid');
			param.status = $(event.target).is(':checked');
			
			Backbone.trigger('MapView:toggleLayer', param);
		},
		
		clean: function() {
			$('.trip-id > input').val('');
			
			$('.raw-layer').find('input').prop("checked", true);
			$('.assign-layer').find('input').prop("checked", true);
			$('.augment-layer').find('input').prop("checked", true);
			
			Backbone.trigger('MapView:clean', null);
			this.hasRequest = false;
		}
	});
	
	return TripAnalysisBtnView;
});