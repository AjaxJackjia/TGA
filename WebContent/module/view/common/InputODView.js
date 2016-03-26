define([ 'backbone', 'metro' ], function(Backbone, Metro) {
	
	var InputODView = Backbone.View.extend({
		
		className: 'input-od-view',
		
		events: {
			'click .exchange': 'exchange'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'exchange', 
					'setStartPoint', 'setEndPoint', 'getOD', 'clean');
			
			//initial status
			this.start = null;
			this.end = null;
			
			/*
			 * register global events
			 * */
			Backbone.
				off('InputODView:setStartPoint').
				on('InputODView:setStartPoint', this.setStartPoint, this);
			Backbone.
				off('InputODView:setEndPoint').
				on('InputODView:setEndPoint', this.setEndPoint, this);
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $start = $('<div class="start input-control text" data-role="input">');
			$start.append('<span class="mif-location prepend-icon" style="color: #128023"></span>');
			$start.append('<input type="text" placeholder="O (lat, lng)">');
			$start.append('<button class="button helper-button clear"><span class="mif-cross"></span></button>');
			
			var $end = $('<div class="end input-control text" data-role="input">');
			$end.append('<span class="mif-location prepend-icon" style="color: #da5a53"></span>');
			$end.append('<input type="text" placeholder="D (lat, lng)">');
			$end.append('<button class="button helper-button clear"><span class="mif-cross"></span></button>');
			
			var $exchange = $('<div class="exchange">');
			$exchange.append('<span class="mif-loop2"></span>');
			
			$(this.el).append($start);
			$(this.el).append($end);
			$(this.el).append($exchange);
			$('body > .container').append($(this.el));
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		toggle: function() {
			$(this.el).css('display') == 'none' ? $(this.el).show() : $(this.el).hide();
		},
		
		exchange: function() {
			var start = $('.start > input', this.el).val();
			var end = $('.end > input', this.el).val();
			
			$('.start > input', this.el).val(end);
			$('.end > input', this.el).val(start);
			
			var tmp = this.start;
			this.start = this.end;
			this.end = tmp;
			
			Backbone.trigger('MapView:clean', null);
			Backbone.trigger('MapView:drawStartPoint', this.start);
			Backbone.trigger('MapView:drawEndPoint', this.end);
		},
		
		setStartPoint: function(data) {
			if($('.start > input', this.el).val() == '') {
				var pointStr = data.lat + ',' + data.lng; 
				$('.start > input', this.el).val(pointStr);
				
				this.start = {};
				this.start.lng = data.lng;
				this.start.lat = data.lat;
				
				Backbone.trigger('MapView:drawStartPoint', this.start);
			}
		}, 
		
		setEndPoint: function(data) {
			if($('.end > input', this.el).val() == '') {
				var pointStr = data.lat + ',' + data.lng; 
				$('.end > input', this.el).val(pointStr);
				
				this.end = {};
				this.end.lng = data.lng;
				this.end.lat = data.lat;
				
				Backbone.trigger('MapView:drawEndPoint', this.end);
			}
		}, 
		
		_getStart: function() {
			var start = $('.start > input', this.el).val()
			if(start != '') {
				var p = start.split(',');
				
				this.start = {};
				this.start.lng = p[1];
				this.start.lat = p[0];
			}
		},
		
		_getEnd: function() {
			var end = $('.end > input', this.el).val()
			if(end != '') {
				var p = end.split(',');
				
				this.end = {};
				this.end.lng = p[1];
				this.end.lat = p[0];
			}
		},
		
		getOD: function() {
			if(this.start == null || this.end == null) {
				this._getStart();
				this._getEnd();
			}
			
			return {
				from_lng: this.start.lng,
				from_lat: this.start.lat,
				to_lng: this.end.lng,
				to_lat: this.end.lat
			}
		},
		
		clean: function() {
			this.start = null;
			this.end = null;
			
			$('.start > input', this.el).val('');
			$('.end > input', this.el).val('');
		}
	});
	
	return InputODView;
});