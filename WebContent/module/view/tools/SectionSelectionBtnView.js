define([ 'backbone', 'metro', 'util' ], function(Backbone, Metro, Util) {
	
	var SectionSelectionBtnView = Backbone.View.extend({
		
		className: 'section-selection-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.sectionSelectionView = new SectionSelectionView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-table">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Section selection setting...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.sectionSelectionView.unrender();
			$(this.el).remove();
		},
		
		toggle: function() {
			this.sectionSelectionView.toggle();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	var SectionSelectionView = Backbone.View.extend({
		
		className: 'section-selection-view',
		
		events: {
			'click .draw': 'draw',
			'click .clean': 'clean'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'draw', 'clean');
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $textarea_section = $('<div class="section-textarea input-control textarea">');
			$textarea_section.append('<textarea placeholder="selected sections id, e.g. sectionid1,sectionid2,...,sectionidn"></textarea>');
			
			var $textarea_gps = $('<div class="gps-textarea input-control textarea">');
			$textarea_gps.append('<textarea placeholder="selected gps points, e.g. lng,lat#lng,lat#...#lng,lat"></textarea>');
		
			var $btns = $('<div class="btns input-control">');
			$btns.append($('<button class="draw button primary">Draw</button>'));
			$btns.append($('<button class="clean button primary">Clean</button>'));
			
			$(this.el).append($textarea_section);
			$(this.el).append($textarea_gps);
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
			
			var mapInfo = {};
			Backbone.trigger('MapView:getInfo', mapInfo);
			var param = {};
			param.zoom = mapInfo.zoom;
			param.left = mapInfo.bounds._southWest.lng;
			param.right = mapInfo.bounds._northEast.lng;
			param.up = mapInfo.bounds._northEast.lat;
			param.down = mapInfo.bounds._southWest.lat;
			
			$.get('api/elements/sectionList', param, function(data){
				//clean
				Backbone.trigger('MapView:clean', null);
				
				var param = {};
				param.data = data;
				param.options = {
					color: 'red'	
				};
				Backbone.trigger('MapView:drawSectionList', param);
			});
		},
		
		clean: function() {
			$('.section-textarea > textarea').val('');
			$('.gps-textarea > textarea').val('');
			
			Backbone.trigger('MapView:clean', null);
		}
	});
	
	return SectionSelectionBtnView;
});