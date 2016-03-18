define([ 'backbone', 'metro', 'util' ], function(Backbone, Metro, Util) {
	
	var HeatmapBtnView = Backbone.View.extend({
		
		className: 'heatmap-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.heatmapView = new HeatmapView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-fire">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Heatmap setting...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.resultView.unrender();
			$(this.el).remove();
		},
		
		toggle: function() {
			this.heatmapView.toggle();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	var HeatmapView = Backbone.View.extend({
		
		className: 'heatmap-view',
		
		events: {
			'click .draw': 'draw',
			'click .clean': 'clean',
			'change .input-type > select': 'clean'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'draw', 'clean');
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $select = $('<div class="input-type input-control select">');
			$select.append('<select>');
			$select.find('select').append('<option value="1">O type</option>');
			$select.find('select').append('<option value="2">D type</option>');
			
			var $btns = $('<div class="btns input-control">');
			$btns.append($('<button class="draw button primary">Draw</button>'));
			$btns.append($('<button class="clean button primary">Clean</button>'));
			
			$(this.el).append($select);
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
			var type = parseInt($('.input-type > select').val());
			var mapInfo = {};
			Backbone.trigger('MapView:getInfo', mapInfo);
			var param = {};
			param.zoom = mapInfo.zoom;
			param.type = type;
			param.left = mapInfo.bounds._southWest.lng;
			param.right = mapInfo.bounds._northEast.lng;
			param.up = mapInfo.bounds._northEast.lat;
			param.down = mapInfo.bounds._southWest.lat;
			
			$.get('api/od/heatmap', param, function(data){
				Backbone.trigger('MapView:drawHeatmap', data);
			});
		},
		
		clean: function() {
			Backbone.trigger('MapView:clean', null);
		}
	});
	
	return HeatmapBtnView;
});