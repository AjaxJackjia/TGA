define([ 'backbone', 'metro', 'util', 
         'model/application/PointCollection',
         'model/application/AtrModel',
         'model/application/AtrCollection' 
       ], function(Backbone, Metro, Util, PointCollection, AtrModel, AtrCollection) {
	
	var ODView = Backbone.View.extend({
		
		className: 'od-view',
		
		events: {
			'click .front-od': 'putFront',
			'click .delete-od': 'deleteData'
		},
		
		initialize: function(){
			var self = this;
			//ensure correct scope
			_.bindAll(this, 'render', 'setData', 'deleteData', '_addGPSItem', 'putFront');
			
			//initial status
			this.od = new PointCollection();
			this.od.bind('add', this._addGPSItem);
			this.od.bind('remove', this._removeGPSItem);

			//render
			this.render();
		},
		
		render: function() {
			$(this.el).html('<div class="title">OD:</div>');
			$(this.el).append('<div class="status">');
			
			//update
			this._updateStatus();
			
			return this;
		},
		
		setData: function(data) {
			var self = this;
			_.each(data.models, function(model, index) {
				index == 0 ? model.set('type', 'O') : model.set('type', 'D');
				self.od.add(model);
			});
		},
		
		deleteData: function() {
			var self = this;
			
			var layerids = _.map(this.od.models, function(model) {
				return model.get('layerid'); 
			});
			
			_.each(this.od.models, function(model, index) {
				self.od.pop();
			});
			
			//remove od layer
			Backbone.trigger('MapView:removeElements', layerids);
			
			//update
			this._updateStatus();
		},
		
		putFront: function() {
			_.each(this.od.models, function(model, index) {
				Backbone.trigger('MapView:putLayerFront', model.get('layerid'));
			});
		},
		
		_addGPSItem: function(item) {
			//update
			this._updateStatus();
			
			//draw geojson
			var options = {
				color: 'red'	
			};
			item.set("options", options)
			Backbone.trigger('MapView:drawODPoint', item);
		},
		
		_updateStatus: function() {
			//status
			if(this.od.length == 0) {
				$(this.el).find('.status').removeClass('mif-star-full').addClass('mif-star-empty');
				$(this.el).find('.status').attr('title', 'data not set');
				$(this.el).find('.delete-od').remove();
				$(this.el).find('.front-od').remove();
			}else{
				$(this.el).find('.status').removeClass('mif-star-empty').addClass('mif-star-full');
				$(this.el).find('.status').attr('title', 'data already set up');
				if($(this.el).find('.delete-od').length == 0) {
					$(this.el).find('.status').after('<div class="delete-od mif-bin" title="delete data">');
					$(this.el).find('.status').after('<div class="front-od mif-zoom-in" title="put layer into front">');
				}
			}
		}
	});
	
	var GPSView = Backbone.View.extend({
		
		className: 'gps-view',
		
		events: {
			'click .front-gps': 'putFront',
			'click .delete-gps': 'deleteData'
		},
		
		initialize: function(){
			var self = this;
			//ensure correct scope
			_.bindAll(this, 'render', 'setData', 'deleteData', '_addGPSItem', 'putFront');
			
			//initial status
			this.gps = new PointCollection();
			this.gps.bind('add', this._addGPSItem);
			this.gps.bind('remove', this._removeGPSItem);

			//render
			this.render();
		},
		
		render: function() {
			$(this.el).html('<div class="title">GPS:</div>');
			$(this.el).append('<div class="status">');
			
			//update
			this._updateStatus();
			
			return this;
		},
		
		setData: function(data) {
			var self = this;
			_.each(data.models, function(model, index) {
				self.gps.add(model);
			});
		},
		
		deleteData: function() {
			var self = this;
			
			var layerids = _.map(this.gps.models, function(model) {
				return model.get('layerid'); 
			});
			
			_.each(this.gps.models, function(model, index) {
				self.gps.pop();
			});
			
			//remove gps layer
			Backbone.trigger('MapView:removeElements', layerids);
			//remove gps list
			$('.gps-list', this.el).remove();
			
			//update
			this._updateStatus();
		},
		
		putFront: function() {
			_.each(this.gps.models, function(model, index) {
				Backbone.trigger('MapView:putLayerFront', model.get('layerid'));
			});
		},
		
		_addGPSItem: function(item) {
			var $listItem = $('<div class="mylist" cid="'+ item.cid +'">');
			$listItem.append('<span class="index">' + item.cid + '</span>');
			
			var $list = $('.gps-list', this.el);
			if($list.length == 0) {
				$list = $('<div class="gps-list listview" data-role="listview">');
				$list.append('<div class="list-group">');
				$list.find('.list-group').append('<span class="list-group-toggle">Points</span>');
				$list.find('.list-group').append('<div class="list-group-content">');
				$(this.el).append($list);
			}
			$list.find('.list-group > .list-group-content').append($listItem);
			
			//update
			this._updateStatus();
			
			//draw geojson
			var options = {
				color: 'red'	
			};
			item.set("options", options)
			Backbone.trigger('MapView:drawGPSPoint', item);
		},
		
		_updateStatus: function() {
			//status
			if(this.gps.length == 0) {
				$(this.el).find('.status').removeClass('mif-star-full').addClass('mif-star-empty');
				$(this.el).find('.status').attr('title', 'data not set');
				$(this.el).find('.delete-gps').remove();
				$(this.el).find('.front-gps').remove();
			}else{
				$(this.el).find('.status').removeClass('mif-star-empty').addClass('mif-star-full');
				$(this.el).find('.status').attr('title', 'data already set up');
				if($(this.el).find('.delete-gps').length == 0) {
					$(this.el).find('.status').after('<div class="delete-gps mif-bin" title="delete data">');
					$(this.el).find('.status').after('<div class="front-gps mif-zoom-in" title="put layer into front">');
				}
			}
		}
	});
	
	var CurrentAtrView = Backbone.View.extend({
		
		className: 'current-atr-view',
		
		events: {
			'click .front-cur-atr': 'putFront',
			'click .delete-cur-atr': 'deleteData'
		},
		
		initialize: function(){
			var self = this;
			//ensure correct scope
			_.bindAll(this, 'render', 'setData', 'deleteData', 'putFront', 'highlight', 'notHighlight', '_addAtrItem', '_removeAtrItem');
			
			//initial status
			this.atrs = new AtrCollection();
			this.atrs.bind('add', this._addAtrItem);
			this.atrs.bind('remove', this._removeAtrItem);
			
			//render
			this.render();
		},
		
		render: function() {
			$(this.el).html('<div class="title">Current atr:</div>');
			$(this.el).append('<div class="status">');
			
			//update
			this._updateStatus();
			
			return this;
		},
		
		setData: function(data) {
			if(this.atrs.length == 0) {
				this.atrs.add(data);
			}
		},
		
		deleteData: function() {
			var self = this;
			_.each(this.atrs.models, function(model, index) {
				self.atrs.remove(model);
			});
		},
		
		putFront: function() {
			_.each(this.atrs.models, function(model, index) {
				_.each(model.get('layerids'), function(id, idIndex) {
					Backbone.trigger('MapView:putLayerFront', id);
				});
			});
		},
		
		highlight: function() {
			alert('highlight!');
		},
		
		notHighlight: function() {
			alert('not highlight!');
		},
		
		_addAtrItem: function(item) {
			//update
			this._updateStatus();
			
			//draw geojson
			item.fetch().done(function() {
				var options = {
					color: 'green'	
				};
				item.set("options", options)
				Backbone.trigger('MapView:drawCurAtr', item);
			});
		},
		
		_removeAtrItem: function(data) {
			//update
			this._updateStatus();
			
			//remove atr layer
			Backbone.trigger('MapView:removeElements', data.get("layerids"));
		},
		
		_updateStatus: function() {
			//status
			if(this.atrs.length == 0) {
				$(this.el).find('.status').removeClass('mif-star-full').addClass('mif-star-empty');
				$(this.el).find('.status').attr('title', 'data not set');
				$(this.el).find('.delete-cur-atr').remove();
				$(this.el).find('.front-cur-atr').remove();
			}else{
				$(this.el).find('.status').removeClass('mif-star-empty').addClass('mif-star-full');
				$(this.el).find('.status').attr('title', 'data already set up');
				$(this.el).append('<div class="front-cur-atr mif-zoom-in" title="put layer into front">');
				$(this.el).append('<div class="delete-cur-atr mif-bin" title="delete data">');
			}
		}
	});
	
	var RecommendAtrView = Backbone.View.extend({
		
		className: 'recommend-atr-view',
		
		events: {
			'click .highlight-atr': 'highlight',
			'click .not-highlight-atr': 'notHighlight',
			'click .delete-atr': 'deleteData'
		},
		
		initialize: function(){
			var self = this;
			//ensure correct scope
			_.bindAll(this, 'render', 'setData', 'deleteData', 'highlight', 'notHighlight', '_addAtrItem', '_removeAtrItem');
			
			//initial status
			this.atrs = new AtrCollection();
			this.atrs.bind('add', this._addAtrItem);
			this.atrs.bind('remove', this._removeAtrItem);

			//render
			this.render();
		},
		
		render: function() {
			$(this.el).html('<div class="title">Recommend atrs:</div>');
			$(this.el).append('<div class="status">');
			
			//update
			this._updateStatus();
			
			return this;
		},
		
		setData: function(data) {
			this.atrs.add(data);
		},
		
		deleteData: function(e) {
			var $current = $(e.target).closest('.mylist');
			if($current.length > 0) {
				var cid = $current.attr('cid');
				this.atrs.remove(cid);	
			}
		},
		
		highlight: function() {
			alert('highlight!');
		},
		
		notHighlight: function() {
			alert('not highlight!');
		},
		
		_addAtrItem: function(item) {
			var $listItem = $('<div class="mylist" cid="'+ item.cid +'">');
			$listItem.append('<span class="index">' + item.cid + '</span>');
//			$listItem.append('<div class="highlight-atr mif-zoom-in" title="highlight">');
//			$listItem.append('<div class="not-highlight-atr mif-zoom-out" title="not highlight">');
			$listItem.append('<div class="delete-atr mif-bin" title="delete data">');
			
			var $list = $('.atr-list', this.el);
			if($list.length == 0) {
				$list = $('<div class="atr-list listview" data-role="listview">');
				$list.append('<div class="list-group">');
				$list.find('.list-group').append('<span class="list-group-toggle">Atrs</span>');
				$list.find('.list-group').append('<div class="list-group-content">');
				$(this.el).append($list);
			}
			$list.find('.list-group > .list-group-content').append($listItem);
			
			//update
			this._updateStatus();
			
			//draw geojson
			item.fetch().done(function() {
				var options = {
					color: 'red'	
				};
				item.set("options", options)
				Backbone.trigger('MapView:drawRecAtr', item);
			});
		},
		
		_removeAtrItem: function(data) {
			var $list = $('.atr-list', this.el);
			$list.find('.mylist[cid=' + data.cid + ']').remove();
			
			//remove atr layer
			Backbone.trigger('MapView:removeElements', data.get("layerids"));
			
			if($list.find('.mylist').length == 0) {
				$list.remove();
			}
			
			//update
			this._updateStatus();
		},
		
		_updateStatus: function() {
			//status
			if(this.atrs.length == 0) {
				$(this.el).find('.status').removeClass('mif-star-full').addClass('mif-star-empty');
				$(this.el).find('.status').attr('title', 'data not set');
			}else{
				$(this.el).find('.status').removeClass('mif-star-empty').addClass('mif-star-full');
				$(this.el).find('.status').attr('title', 'data already set up');
			}
		}
	});

	var DataView = Backbone.View.extend({
		
		className: 'data-view',
		
		initialize: function(){
			var self = this;
			//ensure correct scope
			_.bindAll(this, 'render', 'unrender', 'setData');
			
			//initial param
			this.odView = new ODView();
			this.gpsView = new GPSView();
			this.currentAtrView = new CurrentAtrView();
			this.recommendAtrView = new RecommendAtrView();
			
			//add to page
			this.render();
		},
		
		render: function() {
			//od view
			$(this.el).append($(this.odView.el));
			
			//gps view
			$(this.el).append($(this.gpsView.el));
			
			//current atr view
			$(this.el).append($(this.currentAtrView.el));
			
			//recommend atr view
			$(this.el).append($(this.recommendAtrView.el));
			
			return this;
		},
		
		unrender: function() {
			$(this.el).remove();
		},
		
		setData: function(data) {
			var index = parseInt($('.input-type > select').val(), 10);
			switch(index) {
			case 1: //od
				this.odView.setData(data);
				break;
			case 2: //current gps points
				this.gpsView.setData(data);
				break;
			case 3: //current atr
				this.currentAtrView.setData(data);
				break;
			case 4: //recommendation atrs
				this.recommendAtrView.setData(data);
				break;
			}
		}
	});
	
	return DataView;
});