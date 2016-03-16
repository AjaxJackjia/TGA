define([ 'backbone' ], function(Backbone) {
	var TileModel = Backbone.Model.extend({
		defaults: {
			//tile redirect module name
			'module'		: null,
			//tile classes
			'tileSize'		: null,
			'bgColor'		: null,
			'fgColor'		: null,
			'isSelected'	: null,
			'effect'		: null,
			
			//tile content
			'tileLabel'		: null,
			'tileContent'	: null,  // icon / image 
			
			// if content is "icon"
			'iconName'		: null,
			'tileBadge'		: null,
			'badgeColor'	: null,	// bg-*
			
			// if content is "image"
			'imageStyle'	: null,
			'imageUrl'		: null,

			'coverText'		: null,
			'coverColor'	: null,	// op-*
			'slideDirection': null, 	// add to tile content
			'zoomingType'	: null,	// zooming / zooming-out
			'imageUrls'		: []	// array of urls
		}
	});
	
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
	
	return TileModel;
});