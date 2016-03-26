define([ 'backbone', 'metro', 'util', 
         'model/application/PointModel',
         'model/application/PointCollection',
         'model/application/AtrModel',
         'model/application/AtrCollection'
       ], function(Backbone, Metro, Util, 
    	PointModel, PointCollection, AtrModel, AtrCollection) {
	
	var InputView = Backbone.View.extend({
		
		className: 'input-view',
		
		events: {
			'change .input-type > select': 'selectChange'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'getData', 'selectChange');
			
			//initial param
			this.placeholder = [
			    '',
			    'please input OD data, e.g. O\'s lng,O\'s lat#D\'s lng,D\'s lat ',
			    'please input GPS points data, e.g. lng,lat#lng,lat#...#lng,lat#lng,lat ',
			    'please input current atr data, e.g. id,id,...,id,id ',
			    'please input recommendation atrs data, e.g. id,id,...,id,id '
			];
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $select = $('<div class="input-type input-control select">');
			$select.append('<select>');
			$select.find('select').append('<option value="1">OD</option>');
			$select.find('select').append('<option value="2">GPS points</option>');
			$select.find('select').append('<option value="3">Current atr</option>');
			$select.find('select').append('<option value="4">Recommendation atrs</option>');
			
			var $btns = $('<div class="btns input-control">');
			$btns.append($('<button class="set button primary">Set up</button>'));
			
			var $textarea = $('<div class="input-data input-control textarea">');
			$textarea.append('<textarea placeholder="' + this.placeholder[1] + '"></textarea>');
			
			$(this.el).append($select);
			$(this.el).append($btns);
			$(this.el).append($textarea);
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		selectChange: function() {
			var index = parseInt($('.input-type > select', this.el).val(), 10);
			$('.input-data > textarea', this.el).attr('placeholder', this.placeholder[index]);
			$('.input-data > textarea', this.el).val('');
		},
		
		getData: function() {
			var index = parseInt($('.input-type > select', this.el).val(), 10);
			var value = $('.input-data > textarea', this.el).val();
			if(value == '') {
				alert('please input valid value!');
				return;
			}
			switch(index) {
			case 1: //od
			case 2: //current gps points
				return this._getPoints(value);
				break;
			case 3: //current atr
			case 4: //recommendation atrs
				return this._getAtr(value);
				break;
			}
		},
		
		_getPoints: function(text) {
			var self = this;
			var points = text.split('#');
			var array = new PointCollection();
			_.each(points, function(p, i) {
				array.add(self._getPoint(p));
			});
			return array;
		},
		
		_getPoint: function(text) {
			var point = text.split(',');
			var model = new PointModel();
			model.set('lng', parseFloat(point[0]));
			model.set('lat', parseFloat(point[1]));
			var geojson = {
				"type": "FeatureCollection",
				"features":[{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [parseFloat(point[0]), parseFloat(point[1])]
					}
				}]
			};
			model.set('geojson', geojson);
			
			return model;
		},
		
		_getAtr: function(text) {
			var self = this;
			var sectionids = text;
			var atr = new AtrModel();
			atr.url = '/TGA/api/elements/atrs/' + sectionids;
			atr.set('sectionids', sectionids);
			return atr;
		}
	});
	
	return InputView;
});