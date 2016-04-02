define([ 'backbone', 'leaflet', 'leaflet-heatmap' ], function(Backbone, L, Heatmap) {
	var MapView = Backbone.View.extend({
		
		id: 'map',
		
		className: 'map-view',
		
		events: {
			
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'clean', 'getInfo', 'setZoom', 'toggleLayer',
					'drawGeoJSON', 'drawHeatmap', 'drawTrip', 'drawSectionList', 
					'initODAnalysisClick', 'drawTrajectories', 'drawStartPoint', 'drawEndPoint',
					'drawODPoint', 'drawGPSPoint', 'drawCurAtr', 'drawRecAtr', 'removeElements', 'putLayerFront',
					'drawClusters');
			
			/*
			 * initial status settings
			 * */
			this.map = null;
			this._center = [ 22.562, 114.026 ];
			this._zoom = 12;
			
			this._mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
							'Imagery © <a href="http://mapbox.com">Mapbox</a>';
			this._mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
			
			this._layers = {
				defaultLayer: L.tileLayer(this._mbUrl, {id: 'mapbox.streets', attribution: this._mbAttr}),
				streetsLayer: L.tileLayer(this._mbUrl, {id: 'mapbox.streets'}),
				grayLayer	: L.tileLayer(this._mbUrl, {id: 'mapbox.light'}),
			    emptyLayer	: L.tileLayer('api/img/{z}/{x}/{y}.png', {})
			};
			
			this._baseMaps = {
				'Default'	: this._layers.defaultLayer,
				'Streets'	: this._layers.streetsLayer,
		        'Gray'		: this._layers.grayLayer,
		        'Empty'		: this._layers.emptyLayer
		    };
			
			this._layersControl = new L.Control.Layers(this._baseMaps);
			
			//layer container
			this._layersContainer = {};
			
			//heatmap settings
			this._heatmapSetting = {
				  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
				  // if scaleRadius is false it will be the constant radius used in pixels
				  "radius": 0.001,
				  "maxOpacity": 0.4, 
				  // scales the radius based on map zoom
				  "scaleRadius": true, 
				  // if set to false the heatmap uses the global maximum for colorization
				  // if activated: uses the data maximum within the current map boundaries 
				  //   (there will always be a red spot with useLocalExtremas true)
				  "useLocalExtrema": true,
				  // which field name in your data represents the latitude - default "lat"
				  latField: 'lat',
				  // which field name in your data represents the longitude - default "lng"
				  lngField: 'lng',
				  // which field name in your data represents the data value - default "value"
				  valueField: 'count'
			};
			
			//trip layer setting
			this._trip_gps_setting = {
				radius: 8,
				fillColor: "#ff7800",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			};
			
			this._trip_segment_setting = {
				fillColor: "#ff7800",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			};
			
			this._trip_augment_segment_setting = {
				fillColor: "#ff7800",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			};
			
			//online detection layer setting
			
			/*
			 * register global events
			 * */
			Backbone.
				off('MapView:clean').
				on('MapView:clean', this.clean, this);
			Backbone.
				off('MapView:getInfo').
				on('MapView:getInfo', this.getInfo, this);
			Backbone.
				off('MapView:drawGeoJSON').
				on('MapView:drawGeoJSON', this.drawGeoJSON, this);
			Backbone.
				off('MapView:drawHeatmap').
				on('MapView:drawHeatmap', this.drawHeatmap, this);
			Backbone.
				off('MapView:drawTrip').
				on('MapView:drawTrip', this.drawTrip, this);
			Backbone.
				off('MapView:toggleLayer').
				on('MapView:toggleLayer', this.toggleLayer, this);
			Backbone.
				off('MapView:drawSectionList').
				on('MapView:drawSectionList', this.drawSectionList, this);
			Backbone.
				off('MapView:initODAnalysisClick').
				on('MapView:initODAnalysisClick', this.initODAnalysisClick, this);
			Backbone.
				off('MapView:drawTrajectories').
				on('MapView:drawTrajectories', this.drawTrajectories, this);
			Backbone.
				off('MapView:drawStartPoint').
				on('MapView:drawStartPoint', this.drawStartPoint, this);
			Backbone.
				off('MapView:drawEndPoint').
				on('MapView:drawEndPoint', this.drawEndPoint, this);
			Backbone.
				off('MapView:drawODPoint').
				on('MapView:drawODPoint', this.drawODPoint, this);
			Backbone.
				off('MapView:drawGPSPoint').
				on('MapView:drawGPSPoint', this.drawGPSPoint, this);
			Backbone.
				off('MapView:drawCurAtr').
				on('MapView:drawCurAtr', this.drawCurAtr, this);
			Backbone.
				off('MapView:drawRecAtr').
				on('MapView:drawRecAtr', this.drawRecAtr, this);
			Backbone.
				off('MapView:removeElements').
				on('MapView:removeElements', this.removeElements, this);
			Backbone.
				off('MapView:putLayerFront').
				on('MapView:putLayerFront', this.putLayerFront, this);
			Backbone.
				off('MapView:drawClusters').
				on('MapView:drawClusters', this.drawClusters, this);
			
			this.render();
		},
		
		render: function() {
			$('body > .container').append($(this.el));
			
			this.map = L.map('map', {
				center: this._center,
				zoom: this._zoom,
				layers: this._layers.defaultLayer
			});

			L.control.layers(this._baseMaps).addTo(this.map);
			L.control.scale().addTo(this.map);
			
			return this;
		},
		
		unrender: function() {
			$('#map').remove();
		},
		
		clean: function() {
			var self = this;
			_.each(this._layersContainer, function(layer, key) {
				self.map.removeLayer(layer);
			});
			this._layersContainer = {};
		},
		
		getInfo: function(param) {
			param.center = this.map.getCenter();
			param.zoom = this.map.getZoom();
			param.bounds = this.map.getBounds();
		},
		
		setZoom: function(zoomLevel) {
			this.map.setZoom(zoomLevel);
		},
		
		toggleLayer: function(param) {
			if(!this._layersContainer.hasOwnProperty(param.layerid)) {
				alert('Invalid layer id!');
				return;
			}
			
			if(!param.status) {
				this.map.removeLayer(this._layersContainer[param.layerid]);
			}else{
				this.map.addLayer(this._layersContainer[param.layerid]);
			}
		},
		
		drawGeoJSON: function(param) {
			var self = this;
			
			var data = param.data; //feature collection
			var options = param.options;
			
			//geojson center
			var center = {};
			center.lng = 0;
			center.lat = 0;
			center.count = 0;
			
			//draw geojson
			_.each(data.features, function(feature, index) {
				var mapLayer = L.geoJson(feature, {
				    style: function (feature) {
				        return {color: options.color};
				    },
				    onEachFeature: function (feature, layer) {
				    	var popupHtml = '';
				    	_.each(feature.geometry.properties, function(value, key) {
				    		popupHtml += key + ' : ' + value + '<br/>';
				    	});
				    	popupHtml != '' && layer.bindPopup(popupHtml);
				    	
				    	//calculate feature center
				    	if(feature.geometry.type == 'Point') {
				    		center.lng += _.first(feature.geometry.coordinates); //lng
				    		center.lat += _.last(feature.geometry.coordinates);  //lat
				    		center.count++; //number
			    		}else if(feature.geometry.type == 'LineString') {
			    			_.each(feature.geometry.coordinates, function(pnt, index) {
			    				center.lng += _.first(pnt); //lng
					    		center.lat += _.last(pnt);  //lat
					    		center.count++; //number
					    	});
			    		}
				    }
				}).addTo(self.map);
				
				self._layersContainer[mapLayer._leaflet_id] = mapLayer;
			});
			
			//adjust map view
			if(center.count != 0 && center.lng != 0) {
				center.lng /= center.count;
				center.lat /= center.count;
				this.map.setView({lon: center.lng, lat: center.lat});
				this.map.setZoom(13);
			}
		},
		
		drawHeatmap: function(data) {
			/*
			 * data format:
			 * 	[{lat: 37.7962, lng:-122.4400, count: 1}, ..., {lat: 37.8004, lng:-122.4202, count: 1}]
			 * */
			this.clean();
			
			var layer = new HeatmapOverlay(this._heatmapSetting);
			this.map.addLayer(layer);
			this._layersContainer[layer._leaflet_id] = layer;
			
			var heatmapData = {};
			heatmapData.data = data;
			layer.setData(heatmapData);
		},
		
		_drawPointLayer: function(latlng, option) {
			return L.circleMarker(latlng, option);
		},
		
		_drawLineLayer: function(latlngs, option) {
			return L.polyline(latlngs, option);
		},
		
		_drawPolygonLayer: function() {
			
		},
		
		_drawTripFeature: function(feature, option) {
			var self = this;
			var layer = L.geoJson(feature, {
			    style: function (feature) {
			        return option;
			    },
			    onEachFeature: function (feature, layer) {
			    	var popupHtml = '';
			    	_.each(feature.geometry.properties, function(value, key) {
			    		popupHtml += key + ' : ' + value + '<br/>';
			    	});
			    	popupHtml != '' && layer.bindPopup(popupHtml);
			    },
			    pointToLayer: function (feature, latlng) {
			    	if(feature.geometry.type == 'Point') {
			    		return self._drawPointLayer(latlng, self._trip_gps_setting);
			    	}else if(feature.geometry.type == 'LineString') {
			    		return self._drawPointLayer(latlng, self._trip_segment_setting);
			    	}
				}
			}).addTo(this.map);
			
			this._layersContainer[layer._leaflet_id] = layer;
			
			return layer._leaflet_id;
		},
		
		drawTrip: function(data) {
			var gpsLayerCfg = {
				color: '#a20025'
			};
			var assignLayerCfg = {
				color: '#f0a30a'
			};
			var augmentLayerCfg = {
				color: '#fa6800'
			};
			
			data.gpsLayerId = this._drawTripFeature(data.gpsData, gpsLayerCfg);
			data.assignLayerId = this._drawTripFeature(data.assignData, assignLayerCfg);
			data.augmentLayerId = this._drawTripFeature(data.augmentData, augmentLayerCfg);
		},
		
		drawSectionList: function(param) {
			var self = this;
			
			var data = param.data;
			var options = param.options;
			
			//interactive function
			var clickFunc = function(e) {
				var targetLayer = e.target;
				var properties = targetLayer.feature.geometry.properties;
				if(properties.hasOwnProperty('section_id')) {
					var value = $('.section-textarea > textarea').val() + properties.section_id + ',';
					$('.section-textarea > textarea').val(value);
				}
			};
			var highlightFeatureFunc = function(e) {
				var highlightLayer = e.target;

				highlightLayer.setStyle({
					weight: 5,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.7
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					highlightLayer.bringToFront();
				}
			};
			
			//draw geojson
			_.each(data.features, function(feature, index) {
				var mapLayer = L.geoJson(feature, {
				    style: function (feature) {
				        return {color: options.color};
				    },
				    onEachFeature: function (feature, layer) {
				    	layer.on({
				    		click: clickFunc,
				            mouseover: highlightFeatureFunc,
				            mouseout: function(e) {
				            	mapLayer.resetStyle(e.target);
				            }
				        });
				    }
				}).addTo(self.map);
				
				self._layersContainer[mapLayer._leaflet_id] = mapLayer;
			});
			
			//add click event to map
			this.map.off('click').on('click', function(e) {
				var point = e.latlng;
				var value = $('.gps-textarea > textarea').val() + point.lng + ',' + point.lat + '#';
				$('.gps-textarea > textarea').val(value);
			});
		},
		
		/*
		 * od analysis view function
		 * */
		initODAnalysisClick: function() {
			this.map.off('click').on('click', function(e) {
				var point = e.latlng;
				//start
				if($('.start > input').val() == '') {
					Backbone.trigger('InputODView:setStartPoint', point);
				}else if($('.end > input').val() == '') {
					Backbone.trigger('InputODView:setEndPoint', point);
				}
			});
		},
		
		drawStartPoint: function(point) {
			var layer = this._drawPointLayer(point, {
				radius : 8,
				fillColor : "green",
				color : "#000",
				weight : 1,
				opacity : 1,
				fillOpacity : 0.9
			}).addTo(this.map);
			layer.bringToFront();
			this._layersContainer[layer._leaflet_id] = layer;
			return layer;
		},
		
		drawEndPoint: function(point) {
			var layer = this._drawPointLayer(point, {
				radius : 8,
				fillColor : "red",
				color : "#000",
				weight : 1,
				opacity : 1,
				fillOpacity : 0.9
			}).addTo(this.map);
			layer.bringToFront();
			this._layersContainer[layer._leaflet_id] = layer;
			return layer;
		},
		
		drawTrajectories: function(param) {
			var self = this;
			
			var data = param.data;
			var options = param.options;
			
			//interactive function
			var clickFunc = function(e) { //remove from map
				var targetLayer = e.target;
		    	self.map.removeLayer(targetLayer);
			};
			var highlightFeatureFunc = function(e) {
				var highlightLayer = e.target;

				highlightLayer.setStyle({
					weight: 5,
					color: 'brown',
					dashArray: '',
					fillOpacity: 0.7
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					highlightLayer.bringToFront();
				}
			};
			
			//draw geojson
			_.each(data.features, function(feature, index) {
				var mapLayer = L.geoJson(feature, {
				    style: function (feature) {
				        return {
				        	fillOpacity : 0.5,
							stroke : true,
							opacity : 0.5,
							color : 'blue',
							weight : 2
				        };
				    },
				    onEachFeature: function (feature, layer) {
				    	layer.on({
				    		click: clickFunc,
				            mouseover: highlightFeatureFunc,
				            mouseout: function(e) {
				            	mapLayer.resetStyle(e.target);
				            }
				        });
				    }
				}).addTo(self.map);
				
				self._layersContainer[mapLayer._leaflet_id] = mapLayer;
			});
		},
		
		/*
		 * draw online detection elements
		 * */
		drawODPoint: function(param) {
			var self = this;
			
			var data = param.get('geojson');
			var feature = data.features[0];
			var point = {
				lng: param.get('lng'), 
				lat: param.get('lat')
			};
			if(param.get('type') == 'O') {
				var OLayer = this.drawStartPoint(point);
				param.set('layerid', OLayer._leaflet_id);
			}else{
				var DLayer = this.drawEndPoint(point);
				param.set('layerid', DLayer._leaflet_id);
			}
		},
		
		drawGPSPoint: function(param) {
			var self = this;
			
			var data = param.get('geojson');
			var options = param.get('options');
			
			var _highlightStyle = {
					fillOpacity : 0.8,
					pointRadius : 5
			};
			var _normalStyle = {
					fillColor : 'yellow',
					stroke : true,
					color : 'black',
					weight: 2, fill: true,
					strokeWidth : 1,
					fillOpacity : 0.9,
					radius: 4
	        };
			
			//interactive function
			var clickFunc = function(e) { //remove from map
				var targetLayer = e.target;
				var popupHtml = '';
		    	_.each(targetLayer.feature.geometry.properties, function(value, key) {
		    		popupHtml += key + ' : ' + value + '<br/>';
		    	});
		    	popupHtml != '' && targetLayer.bindPopup(popupHtml);
			};
			
			var highlightFeatureFunc = function(e) {
				var highlightLayer = e.target;

				highlightLayer.setStyle(_highlightStyle);

				if (!L.Browser.ie && !L.Browser.opera) {
					highlightLayer.bringToFront();
				}
			};
			
			//draw geojson
			_.each(data.features, function(feature, index) {
				var mapLayer = L.geoJson(feature, {
				    style: function (feature) {
				        return _normalStyle;
				    },
				    onEachFeature: function (feature, layer) {
				    	layer.on({
				    		click: clickFunc,
				            mouseover: highlightFeatureFunc,
				            mouseout: function(e) {
				            	mapLayer.resetStyle(e.target);
				            }
				        });
				    },
				    pointToLayer: function (feature, latlng) {
				    	return self._drawPointLayer(latlng, _normalStyle);
					}
				}).addTo(self.map);
				
				self._layersContainer[mapLayer._leaflet_id] = mapLayer;
				param.set('layerid', mapLayer._leaflet_id);
			});
		},
		
		_drawAtr: function(param, normalStyle) {
			var self = this;
			
			var data = param.get('geojson');
			var options = param.get('options');
			
			var _atr_normalStyle = normalStyle;
			
			var _atr_highlightStyle = {
				weight: 7
			};
			
			//interactive function
			var clickFunc = function(e) { //remove from map
				var targetLayer = e.target;
				var popupHtml = '';
		    	_.each(targetLayer.feature.geometry.properties, function(value, key) {
		    		popupHtml += key + ' : ' + value + '<br/>';
		    	});
		    	popupHtml != '' && targetLayer.bindPopup(popupHtml);
			};
			var highlightFeatureFunc = function(e) {
				var highlightLayer = e.target;

				highlightLayer.setStyle(_atr_highlightStyle);

				if (!L.Browser.ie && !L.Browser.opera) {
					highlightLayer.bringToFront();
				}
			};
			
			//draw geojson
			var layerids = [];
			_.each(data.features, function(feature, index) {
				var mapLayer = L.geoJson(feature, {
				    style: function (feature) {
				        return _atr_normalStyle;
				    },
				    onEachFeature: function (feature, layer) {
				    	layer.on({
				    		click: clickFunc,
				            mouseover: highlightFeatureFunc,
				            mouseout: function(e) {
				            	mapLayer.resetStyle(e.target);
				            }
				        });
				    },
				    pointToLayer: function (feature, latlng) {
				    	return self._drawLineLayer(latlng, _atr_highlightStyle);
					}
				}).addTo(self.map);
				
				self._layersContainer[mapLayer._leaflet_id] = mapLayer;
				layerids.push(mapLayer._leaflet_id);
			});
			param.set('layerids', layerids);
		},
		
		drawCurAtr: function(param) {
			var normalStyle = {
				fillOpacity : 0.8,
				stroke: true,
				opacity: 0.8,
				color: 'red',
				weight: 4,
				dashArray: "5, 15"
			};
			this._drawAtr(param, normalStyle);
		},
		
		drawRecAtr: function(param) {
			var normalStyle = {
				fillOpacity : 0.5,
				stroke: true,
				opacity: 0.5,
				color: 'blue',
				weight: 4
			};
			this._drawAtr(param, normalStyle);
		},
		
		removeElements: function(ids) {
			var self = this;
			_.each(ids, function(id, index) {
				var layer = self._layersContainer[id];
				self.map.removeLayer(layer);
				delete self._layersContainer[id];
			});
		},
		
		putLayerFront: function(id) {
			this._layersContainer[id] && this._layersContainer[id].bringToFront();
		},
		
		drawClusters: function(param) {
			var self = this;
			
			var data = param.geojson;
			var options = param.options;
			
			var _highlightStyle = {
					fillColor : 'red',
					fillOpacity : 0.8,
					pointRadius : 5
			};
			var _normalStyle = {
					fillColor : 'yellow',
					stroke : true,
					color : 'black',
					weight: 2, fill: true,
					strokeWidth : 1,
					fillOpacity : 0.9,
					radius: 4
	        };
			
			//interactive function
			var clickFunc = function(e) { //remove from map
				var targetLayer = e.target;
				var popupHtml = '';
		    	_.each(targetLayer.feature.geometry.properties, function(value, key) {
		    		popupHtml += key + ' : ' + value + '<br/>';
		    	});
		    	popupHtml != '' && targetLayer.bindPopup(popupHtml);
			};
			
			var highlightFeatureFunc = function(e) {
				console.log(e);
				var highlightLayer = e.target;

				highlightLayer.setStyle(_highlightStyle);

				if (!L.Browser.ie && !L.Browser.opera) {
					highlightLayer.bringToFront();
				}
			};
			
			//draw geojson
			_.each(data.features, function(feature, index) {
				var mapLayer = L.geoJson(feature, {
				    style: function (feature) {
				        return _normalStyle;
				    },
				    onEachFeature: function (feature, layer) {
				    	layer.on({
				    		click: clickFunc,
				            mouseover: highlightFeatureFunc,
				            mouseout: function(e) {
				            	mapLayer.resetStyle(e.target);
				            }
				        });
				    },
				    pointToLayer: function (feature, latlng) {
				    	return self._drawPointLayer(latlng, _normalStyle);
					}
				}).addTo(self.map);
				
				self._layersContainer[mapLayer._leaflet_id] = mapLayer;
			});
		}
		
	});
	
	return MapView;
});
