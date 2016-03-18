define([ 'backbone', 'metro' ], function(Backbone, Metro) {
	
	var ODBtnView = Backbone.View.extend({
		
		className: 'od-btn-view menu-btn',
		
		events: {
			'click': 'toggle', 
			'mouseover': 'over',
			'mouseout': 'out'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.inputView = new InputODView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-location">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Input OD info...');
			
			$('body > .container').append($(this.el));
			
			return this;
		},
		
		unrender: function() {
			this.inputView.unrender();
			$(this.el).remove();
		},
		
		toggle: function() {
			this.inputView.toggle();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	var InputODView = Backbone.View.extend({
		
		className: 'input-od-view',
		
		events: {
			'click .exchange': 'exchange'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'exchange');
			
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
			$(this.el).show();
			
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
		}
	});
	
	return ODBtnView;
});