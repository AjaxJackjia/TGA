define([ 'backbone', 'metro', 'util', 
         'view/application/hotline/InputView'
       ], function(Backbone, Metro, Util, InputView) {
	
	var HotlineBtnView = Backbone.View.extend({
		
		className: 'hotline-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.hotlineView = new HotlineView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-organization">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Hotline analysis...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.hotlineView.unrender();
			$(this.el).remove();
		},
		
		toggle: function() {
			this.hotlineView.toggle();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	var HotlineView = Backbone.View.extend({
		
		className: 'hotline-view',
		
		events: {
			'click .generate': 'generate',
			'click .clean': 'clean'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'generate', 'clean');
			
			//initial status
			this.inputView = new InputView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			$(this.el).append($(this.inputView.el));
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.inputView.unrender();
			
			$(this.el).remove();
		},
		
		toggle: function() {
			$(this.el).css('display') == 'none' ? $(this.el).show() : $(this.el).hide();
		},
		
		generate: function() {
			var self = this;
			
			var param = {};
			var data = this.inputView.getData();
			param.center_lng = data.center.lng;
			param.center_lat = data.center.lat;
			param.scale_a = data.scale.a;
			param.scale_b = data.scale.b;
			param.epsilon = data.param.epsilon;
			param.epsilon_cluster = data.param.epsilon_cluster;
			param.minPts = data.param.minPts;
			
			$.get('api/app/hotline/calculation', param, function(data){
				//draw clusters
				var clustersParam = {};
				clustersParam.geojson = $.parseJSON(data.clusters);
				clustersParam.options = {
					color: 'red'
				};
				Backbone.trigger('MapView:drawClusters', clustersParam);
				
				//draw charts
				var reachabilityDis = data.reachabilityDis;
				self._drawChart(reachabilityDis);
			});
		},
		
		clean: function() {
			Backbone.trigger('MapView:clean', null);
		},
		
		_drawChart: function(data) {
			$('#chart').highcharts({
		        title: {
		            text: 'reachability distance plot'
		        },
		        xAxis: {
		            allowDecimals: false,
		            labels: {
		                formatter: function () {
		                    return this.value; // clean, unformatted number for year
		                }
		            }
		        },
		        yAxis: {
		            title: {
		                text: 'epsilon'
		            }
		        },
		        tooltip: {
		            pointFormat: '{series.name}: <b>{point.x} - {point.y:,.0f}</b>'
		        },
		        plotOptions: {
		            area: {
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
		        series: [{
		            name: 'reachability distance',
		            data: data
		        }]
		    });
		}
		
	});
	
	return HotlineBtnView;
});