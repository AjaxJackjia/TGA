define(['jquery', 'metro'], function($, metro) {
	
	/*
		@param: 
		1. tileClasses is an array which contains a series of tile attributes, such as
			1.1 tileSize, such as
				.tile-small			 ==> 70x70
				.tile / .tile-square ==> 150x150
				.tile-wide			 ==> 310x150
				.tile-large 		 ==> 310x310
			1.2 bgColor (bg-*) or fgColor (fg-*), such as 
				bg-red, fg-white
			1.3 isSelected: true/false
			1.4 effect, such as
				slideLeft, slideRight, slideLeftRight, 
				slideUp, slideDown, slideUpDown

		2. tileContent settings:
			2.1 tileLabel (label name)
			2.2 tileContent: icon / image

			//icon
			2.2.1 iconName: text
			2.2.2 tileBadge: number
			2.2.3 badgeColor: bg-*

			//image
			2.2.4 imageStyle: 
				image, imageCover, carousel, slideCover, 
				imageZooming, imageEffect
			2.2.5 imageUrl: url

			//image - image
			2.3.6  
			//image - imageCover
			2.3.7 coverText: text
			2.3.7 coverColor: op-*
			//image - carousel
			2.3.8  ignore
			//image - slideCover
			2.3.9 coverColor: op-*
			2.3.10 coverText: text
			2.3.11 slideDirection: add to tile content
			//image - zooming
			2.3.12 zoomingType: zooming / zooming-out
			//image - imageEffect
			2.3.13 imageUrls: array of urls

		Simplified version of options:
		{
			//tileClasses
			tileSize: "tile-wide",  // essential
			bgColor: "bg-red",     
			fgColor: "fg-white",   
			isSelected: false,     
			effect: slideLeft,     

			//tileContent
			tileLabel: "Label Name",   
			tileContent: icon / image, // essential

			iconName: text,    // essential
			tileBadge: number, 
			badgeColor: bg-*,  

			imageStyle: image, imageCover, carousel, slideCover, 
				imageZooming, imageEffect // essential
			imageUrl: url, // essential

			coverText: text, 
			coverColor: op-*, 
			slideDirection: slide-(up/down/left/right), slide-(up/down/left/right)-2 
			imageUrls: array of urls
			zoomingType: zooming / zooming-out
		}
	*/

	var createTile = function(tileOptions) {
		/*
		 * tile classes check
		 * */
		var $tile = $('<div data-role="tile">');
		//check tile size
		if(_attrIsValid(tileOptions, "tileSize")) {
			$tile.addClass(tileOptions.tileSize);
		}else{
			$tile.addClass("tile");
		}
		//check bg color
		if(_attrIsValid(tileOptions, "bgColor")) {
			$tile.addClass(tileOptions.bgColor);
		}
		//check fg color
		if(_attrIsValid(tileOptions, "fgColor")) {
			$tile.addClass(tileOptions.fgColor);
		}
		//check element is selected or not
		if(_attrIsValid(tileOptions, "isSelected") && tileOptions.isSelected) {
			$tile.addClass("element-selected");
		}
		
		/*
		 * tile content check
		 * */
		var $tileContent = $('<div class="tile-content">');
		//check tile label
		if(_attrIsValid(tileOptions, "tileLabel")) {
			var $tileLabel = $('<div class="tile-label">');
			$tileLabel.html(tileOptions.tileLabel);
			$tileContent.append($tileLabel);
		}
		//check tile content type
		if(_attrIsValid(tileOptions, "tileContent") && tileOptions.tileContent === 'icon') {
			/*
			 * icon options check
			 * */
			$tileContent.addClass("iconic");
			
			var $icon = $('<span class="icon">');
			if(_attrIsValid(tileOptions, "iconName")) {
				$icon.addClass(tileOptions.iconName);
				$tileContent.append($icon);
			}
			
			if(_attrIsValid(tileOptions, "tileBadge")) {
				var $badge = $('<span class="tile-badge">');
				$badge.html(tileOptions.tileBadge);
				if(_attrIsValid(tileOptions, "badgeColor")) {
					$badge.addClass(tileOptions.badgeColor);
				}else{
					$badge.addClass("bg-yellow");
				}
				$tileContent.append($badge);
			}
		}else if(_attrIsValid(tileOptions, "tileContent") && tileOptions.tileContent === 'image') {
			/*
			 * image options check
			 * */
			if(!_attrIsValid(tileOptions, "imageStyle")) {
				console.error("Image Style options is invalid!");
				return;
			}
			
			if(!_attrIsValid(tileOptions, "imageUrl") && !_attrIsValid(tileOptions, "imageUrls")) {
				console.error("Image url or Image urls options is invalid!");
				return;
			}
			
			var imageSizeClass = (tileOptions.tileSize === 'tile-wide') ? 
					'image-format-hd' : 'image-format-square';
			var imageHeight = (tileOptions.tileSize === 'tile-small') ? 
					'70px'  : (tileOptions.tileSize === 'tile' || 
							   tileOptions.tileSize === 'tile-square' || 
							   tileOptions.tileSize === 'tile-wide') ?
					'150px' : (tileOptions.tileSize === 'tile-large') ?
					'310px' : '100%';
			var imageWidth = (tileOptions.tileSize === 'tile-small') ? 
					'70px'  : (tileOptions.tileSize === 'tile' || 
							   tileOptions.tileSize === 'tile-square') ?
					'150px' : (tileOptions.tileSize === 'tile-wide' ||
							   tileOptions.tileSize === 'tile-large') ?
					'310px' : '100%';
			
			if(tileOptions.imageStyle === 'image') {
				var $imageContainer = $('<div class="image-container">');
				var $imageFrame = _createImage(imageHeight, tileOptions.imageUrl);
				
				$imageContainer.append($imageFrame);
				$tileContent.append($imageContainer);
			}else if(tileOptions.imageStyle === 'imageCover') {
				var $imageContainer = $('<div class="image-container">');
				var $imageFrame = _createImage(imageHeight, tileOptions.imageUrl);
				var $imageOverlay = $('<div class="image-overlay">');
				if(_attrIsValid(tileOptions, "coverColor")) {
					$imageOverlay.addClass(tileOptions.coverColor);
				}
				if(_attrIsValid(tileOptions, "coverText")) {
					$imageOverlay.html(tileOptions.coverText);
				}
				
				$imageContainer.append($imageFrame);
				$imageContainer.append($imageOverlay);
				$tileContent.append($imageContainer);
			}else if(tileOptions.imageStyle === 'carousel') {
				var $carousel = $('<div class="carousel" data-role="carousel" data-controls="false" data-markers="true">');
				var $carouselBullets = $('<div class="carousel-bullets">');
				for(var index = 0; index < tileOptions.imageUrls.length; ++index) {
					var url = tileOptions.imageUrls[index];
					var $slide = $('<div class="slide">');
					var $bullet = $('<a class="carousel-bullet" href="javascript:void(0)" data-num="'+ index +'">')
					$slide.append(_createImage(imageHeight, url));
					$carousel.append($slide);
					$carouselBullets.append($bullet);
				}
				
				$carousel.append($carouselBullets);
				$tileContent.append($carousel);
			}else if(tileOptions.imageStyle === 'slideCover') {
				if(!_attrIsValid(tileOptions, "slideDirection")) {
					console.error("Image slideDirection options is invalid!");
					return;
				}
				$tileContent.addClass(tileOptions.slideDirection);
				var $slide = $('<div class="slide">');
				$slide.append(_createImage(imageHeight, tileOptions.imageUrl));
				$slideOver = $('<div class="slide-over text-small padding10">');
				if(_attrIsValid(tileOptions, "coverColor")) {
					$slideOver.addClass(tileOptions.coverColor);
				}
				if(_attrIsValid(tileOptions, "coverText")) {
					$slideOver.html(tileOptions.coverText);
				}
				
				$tileContent.append($slide);
				$tileContent.append($slideOver);
			}else if(tileOptions.imageStyle === 'imageZooming') {
				if(_attrIsValid(tileOptions, "zoomingType")) {
					$tileContent.addClass(tileOptions.zoomingType);
				}else{
					$tileContent.addClass("zooming");
				}
				var $slide = $('<div class="slide">');
				$slide.append(_createImage(imageHeight, tileOptions.imageUrl));
				
				$tileContent.append($slide);
			}else if(tileOptions.imageStyle === 'imageEffect') {
				for(var index = 0; index < tileOptions.imageUrls.length; ++index) {
					var url = tileOptions.imageUrls[index];
					var $liveSlide = (index == 0) ? 
							$('<div class="live-slide" style="left: 0px; display: block;">') :
							$('<div class="live-slide" style="left: -'+ imageWidth +'; display: block;">');
					var $imageContainer = $('<div class="image-container image-format-fill">');
					
					$imageContainer.append(_createImage(imageHeight, url));
					$liveSlide.append($imageContainer);
					$tileContent.append($liveSlide);
				}
			}
		}
		
		$tile.append($tileContent);
		
		return $tile;
	};
	
	function _test_case() {
		var $icon2 = tileUtil.createTile({
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-red",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Label Name",
			tileContent: "icon",
			iconName: "mif-envelop"
		});
		
		var $icon3 = tileUtil.createTile({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Label Name",
			tileContent: "icon",
			iconName: "mif-cogs",
			tileBadge: 123, 
			badgeColor: "bg-grey",  
		});
		
		var $icon3 = tileUtil.createTile({
			//tile classes
			tileSize: "tile-small", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Label Name",
			tileContent: "icon",
			iconName: "mif-cloud",
			isSelected: true
		});
		
		var $icon4 = tileUtil.createTile({
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Cloud",
			tileContent: "icon",
			iconName: "mif-cloud"
		});
		
		var $icon5 = tileUtil.createTile({
			//tile classes
			tileSize: "tile-large", 
			bgColor: "bg-yellow",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Plain Image",
			tileContent: "image",
			imageStyle: "image",
			imageUrl: "res/images/menu/1.jpg"
		});
		
		var $icon6 = tileUtil.createTile({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-yellow",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Image Cover",
			tileContent: "image",
			imageStyle: "imageCover",
			imageUrl: "res/images/menu/2.jpg",
			coverText: "test test test test test", 
			coverColor: "op-green"
		});
		
		var $icon7 = tileUtil.createTile({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-yellow",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Image Carousel",
			tileContent: "image",
			imageStyle: "carousel",
			imageUrls: [ 
			             "res/images/menu/1.jpg",
			             "res/images/menu/2.jpg",
			             "res/images/menu/3.jpg",
			             "res/images/menu/4.jpg",
			             "res/images/menu/5.jpg"
			           ]
		});
		
		var $icon8 = tileUtil.createTile({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-yellow",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Image Slide Cover",
			tileContent: "image",
			imageStyle: "slideCover",
			imageUrl: "res/images/menu/3.jpg",
			coverText: "12222222222222sdfasdfsfa", 
			coverColor: "op-pink", 
			slideDirection: "slide-down"
		});
		
		var $icon9 = tileUtil.createTile({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-yellow",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Image Slide Cover",
			tileContent: "image",
			imageStyle: "slideCover",
			imageUrl: "res/images/menu/3.jpg",
			coverText: "12222222222222sdfasdfsfa", 
			coverColor: "op-pink", 
			slideDirection: "slide-right-2"
		});
		
		var $icon10 = tileUtil.createTile({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-yellow",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Image Zooming",
			tileContent: "image",
			imageStyle: "imageZooming",
			imageUrl: "res/images/menu/3.jpg",
			zoomingType: "zooming-out"
		});
		
		var $icon11 = tileUtil.createTile({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-yellow",     
			fgColor: "fg-white", 
			effect: "slideRight",

			//tile content
			tileLabel: "Image Effect",
			tileContent: "image",
			imageStyle: "imageEffect",
			imageUrls: [ 
			             "res/images/menu/1.jpg",
			             "res/images/menu/2.jpg",
			             "res/images/menu/3.jpg",
			             "res/images/menu/4.jpg",
			             "res/images/menu/5.jpg"
			           ]
		});
	}
	
	function _attrIsValid(tileOptions, attr) {
		return tileOptions.hasOwnProperty(attr) && tileOptions.attr !== "" ? 
			true : false;
	}
	
	function _createImage(p_imageHeight, p_imageUrl) {
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

	return {
		createTile: createTile
	}
});