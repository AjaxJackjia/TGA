define([ 'backbone', 'metro', 'util', 
         'view/application/detection/InputView',
         'view/application/detection/DataView',
         'view/application/detection/CalculationResultView'
       ], function(Backbone, Metro, Util, InputView, DataView, CalculationResultView) {
	
	var OnlineDetectionBtnView = Backbone.View.extend({
		
		className: 'online-detection-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.onlineDetectionView = new OnlineDetectionView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-search">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Online detection setting...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.onlineDetectionView.unrender();
			$(this.el).remove();
		},
		
		toggle: function() {
			this.onlineDetectionView.toggle();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	var OnlineDetectionView = Backbone.View.extend({
		
		className: 'online-detection-view',
		
		events: {
			'click .set': 'setUpData'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'setUpData');
			
			//initial status
			this.inputView = new InputView();
			this.dataView = new DataView();
			this.calculationResultView = new CalculationResultView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			$(this.el).append($(this.inputView.el));
			$(this.el).append($(this.dataView.el));
			$(this.el).append($(this.calculationResultView.el));
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.inputView.unrender();
			this.dataView.unrender();
			this.calculationResultView.unrender();
			
			$(this.el).remove();
		},
		
		toggle: function() {
			$(this.el).css('display') == 'none' ? $(this.el).show() : $(this.el).hide();
		},
		
		setUpData: function() {
			this.dataView.setData(this.inputView.getData());
		},
		
		clean: function() {
			Backbone.trigger('MapView:clean', null);
		}
	});
	
	return OnlineDetectionBtnView;
});