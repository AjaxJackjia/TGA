define([ 'backbone', 'metro', 'util', 'raphael' ], function(Backbone, Metro, Util, Raphael) {
	
	var RoadNetworkBtnView = Backbone.View.extend({
		
		className: 'road-network-btn-view menu-btn',
		
		events: {
			'click': 'toggle',
			'mouseover': 'over',
			'mouseout': 'out',
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'over', 'out');
			
			//initial param
			this.roadNetworkView = new RoadNetworkView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $button = $('<span class="mif-feed">');
			$(this.el).html($button);
			$(this.el).attr('title', 'Road network setting...');
			
			$('body > .container').append($(this.el));
			return this;
		},
		
		unrender: function() {
			this.roadNetworkView.unrender();
			$(this.el).remove();
		},
		
		toggle: function() {
			this.roadNetworkView.toggle();
		},
		
		over: function() {
			$(this.el).addClass('expand');
		},
		
		out: function() {
			$(this.el).removeClass('expand');
		}
	});
	
	var RoadNetworkView = Backbone.View.extend({
		
		className: 'road-network-view',
		
		events: {
			'click .draw': 'draw',
			'click .clean': 'clean'
		},
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'toggle', 'draw', 'clean',
					'drawSVG', '_drawNode', '_drawPath', '_get_xy');
			
			//initial status
			this.area = null;
			
			this.paper = {
				svg: "",
				width: 0,
				height: 0
			};
			
			this.scale = 0.5;//0<scale<1
			this.positionX = $( document ).width() * (1-this.scale)/2, positionY = $( document ).height() * (1-this.scale)/2;

			this.segNodeOptions = {
				radius: 3,
				fill: "#f00",
				'stroke-width': 0.6,
				stroke: "#fff"
			};

			this.secNodeOptions = {
				radius: 4,
				fill: "#00f",
				'stroke-width': 0.6,
				stroke: "#fff"
			};

			this.pathOptions = {
				fill: '#9cf',
				stroke: '#000',
				'stroke-width': 2,
				'stroke-linejoin': 'round',
			};
			
			//add to page
			this.render();
		},
		
		render: function() {
			var $btns = $('<div class="btns input-control">');
			$btns.append($('<button class="draw button primary">Draw</button>'));
			$btns.append($('<button class="clean button primary">Clean</button>'));
			
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
			this.param = {};
			this.param.zoom = mapInfo.zoom;
			this.param.left = mapInfo.bounds._southWest.lng;
			this.param.right = mapInfo.bounds._northEast.lng;
			this.param.up = mapInfo.bounds._northEast.lat;
			this.param.down = mapInfo.bounds._southWest.lat;
			this.area = {
				north: this.param.up,
				south: this.param.down,
				west:  this.param.left,
				east:  this.param.right
			};
			
			$.get('api/elements/roadnetwork', this.param, function(data){
				//clean
				$('#svg').remove();
				$('body').append('<div id="svg">');
				$('#svg').css('width', $( document ).width());
				$('#svg').css('height', $( document ).height());
				
				//draw
				var result = data.result;
				self.drawSVG(result.nodes, result.lines)
			});
		},
		
		drawSVG: function(nodes, lines) {
			//draw svg
			this.paper.height = $( document ).height() * this.scale;
			this.paper.width = this.paper.height * (this.area.east-this.area.west)/(this.area.north-this.area.south);
			this.paper.svg = Raphael("svg", this.paper.width, this.paper.height);
			
			//draw lines
			for(var i = 0;i<lines.length;i++) {
				this._drawPath(lines[i], this.pathOptions);
			}

			//draw points
			for(var i = 0;i<nodes.length;i++) {
				if(nodes[i].is_section_node == "no") {
					this._drawNode(nodes[i], this.segNodeOptions);
				}else{
					this._drawNode(nodes[i], this.secNodeOptions);
				}
			}
		},
		
		//structure
		/*
		node = {
			id: XXX,
			x: XXX,
			y: XXX,
			is_section_node: xxx	
		}

		line = {
			id: XXX,
			from_x: xxx,
			from_y: xxx,
			to_x: xxx,
			to_y: xxx,
			length: XXX,
			....
		}
		*/

		_drawNode: function(p_node, p_options) {
			var xy = this._get_xy(p_node.x, p_node.y);

			var _circle = this.paper.svg.circle(xy.x, xy.y, p_options.radius);
			_circle.attr(p_options);
			_circle.node.onclick = function() {
				alert(p_node.id + "\nlng:"+p_node.x + ",lat:"+p_node.y);
			}
			return _circle;
		},

		_drawPath: function(p_line, p_options) {
			var from_xy = this._get_xy(p_line.from_x, p_line.from_y);
			var to_xy = this._get_xy(p_line.to_x, p_line.to_y);

			var _startStr = "M " + from_xy.x + " " + from_xy.y + " ";
			var _moveStr = "l " + (to_xy.x - from_xy.x) + " " + (to_xy.y - from_xy.y) + " ";
			var _endStr = "z";
			var _lineStr = _startStr + _moveStr + _endStr;
			var _line = this.paper.svg.path(_lineStr);
			_line.attr(p_options);

			_line.node.onclick = function() {
			    alert(p_line.id + "\nlength:"+p_line.length);
			}
			return _line;
		},

		_get_xy: function(lng, lat){
			var bench = {x: this.area.west, y: this.area.north};
			var _scale = this.paper.height/(this.area.north - this.area.south);
			var x = Math.abs(lng - bench.x) * _scale;
			var y = Math.abs(lat - bench.y) * _scale;
			return {x:x, y:y};
		},
		
		clean: function() {
			Backbone.trigger('MapView:clean', null);
		}
	});
	
	return RoadNetworkBtnView;
});