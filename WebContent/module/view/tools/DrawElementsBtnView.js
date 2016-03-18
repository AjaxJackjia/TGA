define([ 'backbone', 'metro', 'util' ], function(Backbone, Metro, Util) {
	
	var DrawElementsBtnView = Backbone.View.extend({
		
		className: 'draw-elements-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.drawElementsView = new DrawElementsView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-pencil">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Result...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.resultView.unrender();
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
	
	var DrawElementsView = Backbone.View.extend({
		
		className: 'draw-elements-view',
		
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
			$select.find('select').append('<option value="1">GeoJSON</option>');
			$select.find('select').append('<option value="2">WKT</option>');
			$select.find('select').append('<option value="3">Node id(s)</option>');
			$select.find('select').append('<option value="4">Way id</option>');
			$select.find('select').append('<option value="5">Segment id(s)</option>');
			$select.find('select').append('<option value="6">Section id(s)</option>');
			
			var $input = $('<div class="input-text textarea" data-role="input">');
			$input.append('<textarea>');
			
			var $btns = $('<div class="btns input-control">');
			$btns.append($('<button class="draw button primary">Draw</button>'));
			$btns.append($('<button class="clean button primary">Clean</button>'));
			
			$(this.el).append($select);
			$(this.el).append($input);
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
			var elementType = parseInt($('.input-type > select').val());
			var inputParam = $('.input-text > textarea').val();
			if(inputParam == '') {
				alert('Please input param!');
				return;
			}
			
			switch(elementType) {
			case 1: //GeoJSON
				//string to json
				this.drawGeoJSON($.parseJSON(inputParam));
				break;
			case 2: //WKT
				this.drawWKT(inputParam);
				break;
			case 3: //Node
				this.drawAjax('api/elements/nodes', inputParam);
				break;
			case 4: //Way
				this.drawAjax('api/elements/ways', inputParam);
				break;
			case 5: //Segment
				this.drawAjax('api/elements/segments', inputParam);
				break;
			case 6: //Section
				this.drawAjax('api/elements/sections', inputParam);
				break;
			}
		},
		
		drawGeoJSON: function(geojson) {
			var param = {};
			param.data = geojson;
			param.options = {
				color: 'red'	
			};
			Backbone.trigger('MapView:drawGeoJSON', param);
		},
		
		drawWKT: function(wkt) {
			var geojson = Util.WKT2GeoJSON(wkt);
			this.drawGeoJSON(geojson);
		},
		
		drawAjax: function(url, param) {
			var self = this;
			$.get(url, {id:param}, function(data){
				self.drawGeoJSON(data);
			});
		},
		
		clean: function() {
			$('.input-text > textarea').val('');
			Backbone.trigger('MapView:clean', null);
		}
	});
	
	return DrawElementsBtnView;
});