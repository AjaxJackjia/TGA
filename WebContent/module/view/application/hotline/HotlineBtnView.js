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
			//'click .generate': 'generate',
			//'click .generate': 'generateFirstPicClusters',
			'click .generate': 'generateSecondPicClusters',
			'click .clean': 'clean'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'generate', 'clean', 'generateFirstPicClusters', 'generateSecondPicClusters');
			
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
		
		generateFirstPicClusters: function() {
			//From: 坂田中心
			var bantian_param = {
				center_lng: 114.05511260032652,
				center_lat: 22.629400770949264,
				type: 'O',
				limit: 10000,
				color: 'red'
			};
			this._getSquareCluster(bantian_param);
			Backbone.trigger('MapView:drawTrafficZone', {
				lng: bantian_param.center_lng,
				lat: bantian_param.center_lat
			});
			
			//Domain 1: 民乐地铁站
			var minyue_param = {
				center_lng: 114.04383659362793,
				center_lat: 22.5993324189035,
				type: 'D',
				limit: 100,
				color: 'orange' 
			};
			this._getCircleCluster(minyue_param);
			
			//Domain 2: 深圳北站
			var shenzhenbei_param = {
				center_lng: 114.0294599533081,
				center_lat: 22.612644120749582,
				type: 'D',
				limit: 100,
				color: '#DF01A5' 
			};
			this._getCircleCluster(shenzhenbei_param);
			
			//Domain 3: 北京大学深圳医院
			var peking_param = {
				center_lng: 114.04422283172607,
				center_lat: 22.55756652694934,
				type: 'D',
				limit: 15,
				color: 'yellow' 
			};
			this._getCircleCluster(peking_param);
					
			//Domain 4: 深圳东站
			var szdong_param = {
				center_lng: 114.11288738250732,
				center_lat: 22.60575072162999,
				type: 'D',
				limit: 10,
				color: '#53FF53' 
			};
			this._getCircleCluster(szdong_param);
			
			//Domain 5: 华强北
			var huaqiang_param = {
				center_lng: 114.08121585845947,
				center_lat: 22.547162711675465,
				type: 'D',
				limit: 10,
				color: '#00A600' 
			};
			this._getCircleCluster(huaqiang_param);
		},
		
		generateSecondPicClusters: function() {
			//From: 民乐地铁站
			var minyue_param = {
				center_lng: 114.04383659362793,
				center_lat: 22.5993324189035,
				type: 'O',
				limit: 100,
				color: 'orange' 
			};
			this._getCircleCluster(minyue_param);
			Backbone.trigger('MapView:drawTrafficZone', {
				lng: minyue_param.center_lng,
				lat: minyue_param.center_lat
			});
			
			//To: 坂田中心
			var bantian_param = {
				center_lng: 114.05511260032652,
				center_lat: 22.629400770949264,
				type: 'D',
				limit: 70,
				color: 'red'
			};
			this._getSquareCluster(bantian_param);
			Backbone.trigger('MapView:drawTrafficZone', {
				lng: bantian_param.center_lng,
				lat: bantian_param.center_lat
			});
		},
		
		_getSquareCluster: function(options) {
			var scale_a = 375, scale_b = 375;
			
			var param = {};
			param.center_lng = options.center_lng;
			param.center_lat = options.center_lat;
			param.scale_a = scale_a;
			param.scale_b = scale_b;
			param.type = options.type;
			param.limit = options.limit;
			
			$.get('api/app/hotline/cluster_square', param, function(data){
				var clustersParam = {};
				clustersParam.geojson = $.parseJSON(data.cluster);
				clustersParam.options = {
					color: options.color
				};
				Backbone.trigger('MapView:drawSingleCluster', clustersParam);
			});
		},
		
		_getCircleCluster: function(options) {
			var radius = 400;
			
			var param = {};
			param.center_lng = options.center_lng;
			param.center_lat = options.center_lat;
			param.radius = radius;
			param.type = options.type;
			param.limit = options.limit;
			
			$.get('api/app/hotline/cluster_circle', param, function(data){
				//draw clusters
				var clustersParam = {};
				clustersParam.geojson = $.parseJSON(data.cluster);
				clustersParam.options = {
					color: options.color
				};
				Backbone.trigger('MapView:drawSingleCluster', clustersParam);
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