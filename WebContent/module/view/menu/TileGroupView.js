define([ 'backbone', 'view/menu/TileView' ], function(Backbone, TileView) {
	
	var TileGroupView = Backbone.View.extend({
		
		className: 'tile-group',
		
		initialize: function(){
			//ensure correct scope
			_.bindAll(this, 'render', 'setWidth', 'setTitle', 'setTiles');
			
			this.width = 'two'; //default is two
			this.title = '';
			this.collection = [];
		},
		
		render: function() {
			//width
			$(this.el).addClass(this.width);
			
			var $title = $('<span class="tile-group-title">' + this.title + '</span>');
			
			var $collection = $('<div class="tile-container">');
			
			_.each(this.collection, function(tile, index) {
				var tileView = new TileView({
					model: tile
				});
				$collection.append($(tileView.el));
			});
			
			$(this.el).append($title);
			$(this.el).append($collection);
			
			return this;
		},
		
		setWidth: function(width) {
			this.width = width;
		},
		
		setTitle: function(title) {
			this.title = title;
		},
		
		setTiles: function(collection) {
			this.collection = collection;
		}
	});
	
	return TileGroupView;
});