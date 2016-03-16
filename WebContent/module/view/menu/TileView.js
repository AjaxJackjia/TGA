define([ 'backbone', 'metro' ], function(Backbone, Metro) {
	
	var TileView = Backbone.View.extend({
		
		events: {
			'click': 'select'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'select', 'createLableTile', 'createImageTile');
			
			//default status
			this.default_tile_size = 'tile';
			this.default_bg_color  = 'bg-white';
			this.default_fg_color  = 'fg-black';
			
			this.render();
		},
		
		select: function() {
			//if has module, click then redirect
			if(this.model.has('module')) {
				location.href = 'index.html#' + this.model.get('module');
			}
		},
		
		render: function() {
			/*
			 * tile role
			 * */
			$(this.el).attr('data-role', 'tile');
			
			/*
			 * tile classes check
			 * */
			//check tile size
			$(this.el).addClass( this.model.has('tileSize') ? this.model.get('tileSize') : this.default_tile_size ); 
			//check bg color
			$(this.el).addClass( this.model.has('bgColor') ? this.model.get('bgColor') : this.default_bg_color ); 
			//check fg color
			$(this.el).addClass( this.model.has('fgColor') ? this.model.get('fgColor') : this.default_fg_color ); 
			//check element is selected or not
			$(this.el).addClass( _.isBoolean(this.model.get('isSelected')) ? 'element-selected' : '' ); 
			
			/*
			 * tile content check
			 * */
			//check tile content type
			if( this.model.has('tileContent') && this.model.get('tileContent') === 'icon') {
				$(this.el).append( this.createLableTile() );
			}else if(this.model.has('tileContent') && this.model.get('tileContent') === 'image') {
				$(this.el).append( this.createImageTile() );
			}
			
			return this;
		},
		
		createLableTile: function() {
			var $tileContent = $('<div class="tile-content">');
			
			//tile title
			var $tileLabel = $('<div class="tile-label">');
			$tileLabel.html(this.model.get('tileLabel'));
			$tileContent.append($tileLabel);
			
			//tile icon
			$tileContent.addClass("iconic");
			
			//tile icon name
			var $icon = $('<span class="icon">');
			$icon.addClass( this.model.has('iconName') ? this.model.get('iconName') : '' ); 
			$tileContent.append($icon);
			
			//tile icon badge
			if(this.model.has('tileBadge')) {
				var $badge = $('<span class="tile-badge">');
				$badge.html(this.model.get('tileBadge'));
				$badge.addClass( this.model.has('badgeColor') ? this.model.get('badgeColor') : 'bg-yellow' ); 
				$tileContent.append($badge);
			}
			
			return $tileContent;
		},
		
		createImageTile: function() {
			var IMAGE_TYPE_IMAGE_DEFAULT	= "image";
			var IMAGE_TYPE_IMAGE_COVER 		= "imageCover";
			var IMAGE_TYPE_IMAGE_CAROUSEL	= "carousel";
			var IMAGE_TYPE_IMAGE_SLIDEOVER	= "slideCover";
			var IMAGE_TYPE_IMAGE_ZOOMING 	= "imageZooming";
			var IMAGE_TYPE_IMAGE_EFFECT 	= "imageEffect";
			
			
			var $tileContent = $('<div class="tile-content">');
			
			//tile title
			var $tileLabel = $('<div class="tile-label">');
			$tileLabel.html(this.model.get('tileLabel'));
			$tileContent.append($tileLabel);
			
			//check image type error
			if( !this.model.has('imageStyle') ) {
				console.error("Image Style options is invalid!");
				return;
			}
			
			if(!this.model.has('imageUrl') && !this.model.has('imageUrls')) {
				console.error("Image url or Image urls options is invalid!");
				return;
			}
			
			//check image size
			var imageSizeClass = (this.model.get('tileSize') === 'tile-wide') ? 
					'image-format-hd' : 'image-format-square';
			var imageHeight = (this.model.get('tileSize') === 'tile-small') ? 
					'70px'  : (this.model.get('tileSize') === 'tile' || 
							   this.model.get('tileSize') === 'tile-square' || 
							   this.model.get('tileSize') === 'tile-wide') ?
					'150px' : (this.model.get('tileSize') === 'tile-large') ?
					'310px' : '100%';
			var imageWidth = (this.model.get('tileSize') === 'tile-small') ? 
					'70px'  : (this.model.get('tileSize') === 'tile' || 
							  this.model.get('tileSize') === 'tile-square') ?
					'150px' : (this.model.get('tileSize') === 'tile-wide' ||
							  this.model.get('tileSize') === 'tile-large') ?
					'310px' : '100%';
			
			//generate concrete image style
			switch(this.model.get('imageStyle')) {
			case IMAGE_TYPE_IMAGE_DEFAULT:
				var $imageContainer = $('<div class="image-container">');
				var $imageFrame = this._generateImageFrame(imageHeight, this.model.get('imageUrl'));
				
				$imageContainer.append($imageFrame);
				$tileContent.append($imageContainer);
				
				break;
			case IMAGE_TYPE_IMAGE_COVER:
				var $imageContainer = $('<div class="image-container">');
				var $imageFrame = this._generateImageFrame(imageHeight, this.model.get('imageUrl'));
				var $imageOverlay = $('<div class="image-overlay">');
				$imageOverlay.addClass( this.model.has('coverColor') ? this.model.get('coverColor') : '' );
				$imageOverlay.addClass( this.model.has('coverText') ? this.model.get('coverText') : '' );
				
				$imageContainer.append($imageFrame);
				$imageContainer.append($imageOverlay);
				$tileContent.append($imageContainer);
				
				break;
			case IMAGE_TYPE_IMAGE_CAROUSEL:
				var self = this;
				var $carousel = $('<div class="carousel" data-role="carousel" data-controls="false" data-markers="true">');
				var $carouselBullets = $('<div class="carousel-bullets">');
				_.each(this.model.get('imageUrls'), function(url, index) {
					var $slide = $('<div class="slide">');
					var $bullet = $('<a class="carousel-bullet" href="javascript:void(0)" data-num="'+ index +'">')
					
					$slide.append(self._generateImageFrame(imageHeight, url));
					$carousel.append($slide);
					$carouselBullets.append($bullet);
				});
				
				$carousel.append($carouselBullets);
				$tileContent.append($carousel);
				
				break;
			case IMAGE_TYPE_IMAGE_SLIDEOVER:
				$tileContent.addClass( this.model.has('slideDirection') ? this.model.get('slideDirection') : 'slide-up' );
				
				var $slide = $('<div class="slide">');
				$slide.append(this._generateImageFrame(imageHeight, this.model.get('imageUrl')));
				$slideOver = $('<div class="slide-over text-small padding10">');
				$slideOver.addClass( this.model.has('coverColor') ? this.model.get('coverColor') : '' );
				$slideOver.addClass( this.model.has('coverText') ? this.model.get('coverText') : '' );
				
				$tileContent.append($slide);
				$tileContent.append($slideOver);
				
				break;
			case IMAGE_TYPE_IMAGE_ZOOMING:
				$tileContent.addClass( this.model.has('zoomingType') ? this.model.get('zoomingType') : 'zooming' );
				
				var $slide = $('<div class="slide">');
				$slide.append(this._generateImageFrame(imageHeight, this.model.get('imageUrl')));
				
				$tileContent.append($slide);
				
				break;
			case IMAGE_TYPE_IMAGE_EFFECT:
				var self = this;
				_.each(this.model.get('imageUrls'), function(url, index) {
					var $liveSlide = (index == 0) ? 
							$('<div class="live-slide" style="left: 0px; display: block;">') :
							$('<div class="live-slide" style="left: -'+ imageWidth +'; display: block;">');
					var $imageContainer = $('<div class="image-container image-format-fill">');
					
					$imageContainer.append(self._generateImageFrame(imageHeight, url));
					$liveSlide.append($imageContainer);
					$tileContent.append($liveSlide);
				});
				
				break;
			}
			
			return $tileContent;
		},
		
		_generateImageFrame: function(p_imageHeight, p_imageUrl) {
			var $frame = $('<div class="frame">');
			var $image = $('<div>');
			$image.css('width', '100%');
			$image.css('height', p_imageHeight);
			$image.css('border-radius', '0px');
			$image.css('background-image', 'url('+p_imageUrl+')');
			$image.css('background-size', 'cover');
			$image.css('background-repeat', 'no-repeat');
			
			$frame.append($image);
			return $frame;
		}
	});
	
	return TileView;
});

/*
 * 	Test case
 * */
//		var $icon2 = new TileModel({
//			//tile classes
//			tileSize: "tile-wide", 
//			bgColor: "bg-red",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Label Name",
//			tileContent: "icon",
//			iconName: "mif-envelop"
//		});
//		
//		var $icon3 = new TileModel({
//			//tile classes
//			tileSize: "tile", 
//			bgColor: "bg-blue",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Label Name",
//			tileContent: "icon",
//			iconName: "mif-cogs",
//			tileBadge: 123, 
//			badgeColor: "bg-grey",  
//		});
//		
//		var $icon3 = new TileModel({
//			//tile classes
//			tileSize: "tile-small", 
//			bgColor: "bg-blue",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Label Name",
//			tileContent: "icon",
//			iconName: "mif-cloud",
//			isSelected: true
//		});
//		
//		var $icon4 = new TileModel({
//			//tile classes
//			tileSize: "tile-wide", 
//			bgColor: "bg-blue",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Cloud",
//			tileContent: "icon",
//			iconName: "mif-cloud"
//		});
//		
//		var $icon5 = new TileModel({
//			//tile classes
//			tileSize: "tile-large", 
//			bgColor: "bg-yellow",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Plain Image",
//			tileContent: "image",
//			imageStyle: "image",
//			imageUrl: "res/images/menu/1.jpg"
//		});
//		
//		var $icon6 = new TileModel({
//			//tile classes
//			tileSize: "tile", 
//			bgColor: "bg-yellow",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Image Cover",
//			tileContent: "image",
//			imageStyle: "imageCover",
//			imageUrl: "res/images/menu/2.jpg",
//			coverText: "test test test test test", 
//			coverColor: "op-green"
//		});
//		
//		var $icon7 = new TileModel({
//			//tile classes
//			tileSize: "tile", 
//			bgColor: "bg-yellow",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Image Carousel",
//			tileContent: "image",
//			imageStyle: "carousel",
//			imageUrls: [ 
//			             "res/images/menu/1.jpg",
//			             "res/images/menu/2.jpg",
//			             "res/images/menu/3.jpg",
//			             "res/images/menu/4.jpg",
//			             "res/images/menu/5.jpg"
//			           ]
//		});
//		
//		var $icon8 = new TileModel({
//			//tile classes
//			tileSize: "tile", 
//			bgColor: "bg-yellow",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Image Slide Cover",
//			tileContent: "image",
//			imageStyle: "slideCover",
//			imageUrl: "res/images/menu/3.jpg",
//			coverText: "12222222222222sdfasdfsfa", 
//			coverColor: "op-pink", 
//			slideDirection: "slide-down"
//		});
//		
//		var $icon9 = new TileModel({
//			//tile classes
//			tileSize: "tile", 
//			bgColor: "bg-yellow",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Image Slide Cover",
//			tileContent: "image",
//			imageStyle: "slideCover",
//			imageUrl: "res/images/menu/3.jpg",
//			coverText: "12222222222222sdfasdfsfa", 
//			coverColor: "op-pink", 
//			slideDirection: "slide-right-2"
//		});
//		
//		var $icon10 = new TileModel({
//			//tile classes
//			tileSize: "tile", 
//			bgColor: "bg-yellow",     
//			fgColor: "fg-white", 
//
//			//tile content
//			tileLabel: "Image Zooming",
//			tileContent: "image",
//			imageStyle: "imageZooming",
//			imageUrl: "res/images/menu/3.jpg",
//			zoomingType: "zooming-out"
//		});
//		
//		var $icon11 = new TileModel({
//			//tile classes
//			tileSize: "tile", 
//			bgColor: "bg-yellow",     
//			fgColor: "fg-white", 
//			effect: "slideRight",
//
//			//tile content
//			tileLabel: "Image Effect",
//			tileContent: "image",
//			imageStyle: "imageEffect",
//			imageUrls: [ 
//			             "res/images/menu/1.jpg",
//			             "res/images/menu/2.jpg",
//			             "res/images/menu/3.jpg",
//			             "res/images/menu/4.jpg",
//			             "res/images/menu/5.jpg"
//			           ]
//		});
