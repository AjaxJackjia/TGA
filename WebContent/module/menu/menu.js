define(['jquery', 'metro', 'common/util', 'common/tileUtil'], function($, metro, util, tileUtil) {
	//load css file
	util.loadCss('res/css/menu.css');
	var _appTitle = 'UBI Simulation System';
	
	var init = function() {
		/*
		 * tile area settings
		 * */
		var $tileArea = $('<div class="tile-area">');
		$tileArea.addClass('fg-white'); 
		$tileArea.addClass('tile-area-scheme-dark');
		$('.container').append($tileArea);
		
		/*
		 * tile area title
		 * */
		var $tileAreaTitle = $('<div class="tile-area-title">');
		$tileAreaTitle.html(_appTitle);
		$tileArea.append($tileAreaTitle);
		
		/*
		 * tile group
		 * */
		var $tileGroup = $('<div class="tile-group six">');
		var $groupTitle = $('<span class="tile-group-title">');
		$groupTitle.html('Common Analysis Tools');
		var $tileGroupContainer = $('<div class="tile-container">');
		
		$tileGroup.append($groupTitle);
		$tileGroup.append($tileGroupContainer);
		$tileArea.append($tileGroup);
		
		/*
		 * tile container tiles
		 * */
		var $tile1 = tileUtil.createTile({
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-red",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Label Name",
			tileContent: "icon",
			iconName: "mif-envelop"
		});
		
		var $tile2 = tileUtil.createTile({
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
		
		var $tile4 = tileUtil.createTile({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Cloud",
			tileContent: "icon",
			iconName: "mif-cloud"
		});
		
		var $tile5 = tileUtil.createTile({
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Cloud",
			tileContent: "icon",
			iconName: "mif-cloud"
		});
		
		var $tile6 = tileUtil.createTile({
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-yellow",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Plain Image",
			tileContent: "image",
			imageStyle: "image",
			imageUrl: "res/images/menu/1.jpg"
		});
		
		var $tile7 = tileUtil.createTile({
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
		
		var $tile8 = tileUtil.createTile({
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
		
		var $tile9 = tileUtil.createTile({
			//tile classes
			tileSize: "tile-wide", 
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
		
		var $tile10 = tileUtil.createTile({
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
		
		var $tile11 = tileUtil.createTile({
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
		
		var $tile12 = tileUtil.createTile({
			//tile classes
			tileSize: "tile-wide", 
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
		
		$tileGroupContainer.append($tile1);
		$tileGroupContainer.append($tile2);
		$tileGroupContainer.append($tile4);
		$tileGroupContainer.append($tile5);
		$tileGroupContainer.append($tile6);
		$tileGroupContainer.append($tile7);
		$tileGroupContainer.append($tile8);
		$tileGroupContainer.append($tile9);
		$tileGroupContainer.append($tile10);
		$tileGroupContainer.append($tile11);
		$tileGroupContainer.append($tile12);
	};
	
	return {
		init: init
	}
});
