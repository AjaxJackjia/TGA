define([ 'backbone', 'metro', 'util' ], function(Backbone, Metro, Util) {
	
	var InputView = Backbone.View.extend({
		
		className: 'input-view',
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'getData');
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $center = $('<div class="center input-control text" data-role="input">');
			$center.append('<input type="text" placeholder="center(lng,lat)" value="114.0471,22.597986">');
			
			var $scale = $('<div class="scale input-control">');
			$scale.append('<div class="scale-a input-control text" data-role="input"><input type="text" placeholder="a (meter)" value="500"/></div>');
			$scale.append('<div class="scale-b input-control text" data-role="input"><input type="text" placeholder="b (meter)" value="500"/></div>');
			
			var $param = $('<div class="param input-control">');
			$param.append('<div class="param-epsilon input-control text" data-role="input"><input type="text" placeholder="epsilon" value="100"/></div>');
			$param.append('<div class="param-epsilon-cluster input-control text" data-role="input"><input type="text" placeholder="epsilon-cluster" value="50"/></div>');
			$param.append('<div class="param-minPts input-control text" data-role="input"><input type="text" placeholder="minPts" value="30"/></div>');
			
			var $btns = $('<div class="btns input-control">');
			$btns.append($('<button class="generate button primary">Generate</button>'));
			$btns.append($('<button class="clean button primary">Clean</button>'));
			
			$(this.el).append($center);
			$(this.el).append($scale);
			$(this.el).append($param);
			$(this.el).append($btns);
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		getData: function() {
			var center = this._getCenter();
			var scale = this._getScale();
			var param = this._getParam();
			
			if(center == null || scale == null || param == null) {
				alert('please input param!');
			}
			
			return {
				center: center,
				scale: scale,
				param: param
			}
		},
		
		_getCenter: function() {
			var point = {};
			var value = $('.center > input', this.el).val();
			if(value != '') {
				var v = value.split(',');
				point.lng = v[0];
				point.lat = v[1];
				return point;
			}
			return null;
		},
		
		_getScale: function() {
			var a = $('.scale-a > input', this.el).val();
			var b = $('.scale-b > input', this.el).val();
			if(a != '' && b != '') {
				return {
					a: a,
					b: b
				}
			}
			return null;
		},
		
		_getParam: function(text) {
			var epsilon = $('.param-epsilon > input', this.el).val();
			var epsilon_cluster = $('.param-epsilon-cluster > input', this.el).val();
			var minPts = $('.param-minPts > input', this.el).val();
			if(epsilon != '' && minPts != '' && epsilon_cluster != '') {
				return {
					epsilon: epsilon,
					epsilon_cluster: epsilon_cluster,
					minPts: minPts
				}
			}
			return null;
		}
	});
	
	return InputView;
});