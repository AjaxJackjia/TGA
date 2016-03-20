define([ 'backbone', 
         //view
		'view/menu/TileGroupView',
		//model
		'model/menu/TileModel'
       ], function(Backbone, TileGroupView, TileModel) {
	
	var Controller = function() {
		console.log("This is menu controller module!");
		
		//menu
		var $area = $('<div class="tile-area fg-white tile-area-scheme-dark">');
		var $areaTitle = $('<div class="tile-area-title">Taxi GPS Analysis System</div>');
		
		//introduction group
		var IntroductionGroup = new TileGroupView();
		IntroductionGroup.setWidth('three');
		IntroductionGroup.setTitle('项目介绍');
		var IntroductionCollection = [];
		IntroductionCollection.push(new TileModel({
			//tile classes
			tileSize: "tile-large", 
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
		}));
		IntroductionCollection.push(new TileModel({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Cloud",
			tileContent: "icon",
			iconName: "mif-cloud"
		}));
		IntroductionCollection.push(new TileModel({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-red",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Cloud",
			tileContent: "icon",
			iconName: "mif-cloud"
		}));
		IntroductionCollection.push(new TileModel({
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "!!!",
			tileContent: "icon",
			iconName: "mif-cogs",
			tileBadge: 123, 
			badgeColor: "bg-grey",  
		}));
		IntroductionCollection.push(new TileModel({
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Cloud",
			tileContent: "icon",
			iconName: "mif-cloud"
		}));
		IntroductionGroup.setTiles(IntroductionCollection);
		
		//tool group
		var ToolGroup = new TileGroupView();
		ToolGroup.setWidth('three');
		ToolGroup.setTitle('数据建模');
		var ToolCollection = [];
		ToolCollection.push(new TileModel({
			//module
			module: 'tools-draw',
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "查询绘制地图基础数据",
			tileContent: "icon",
			iconName: "mif-pencil"
		}));
		ToolCollection.push(new TileModel({
			//module
			module: 'tools-heatmap',
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "OD热度图",
			tileContent: "icon",
			iconName: "mif-map2"
		}));
		ToolCollection.push(new TileModel({
			//module
			module: 'tools-od',
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-red",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "出租车OD分析",
			tileContent: "icon",
			iconName: "mif-cloud"
		}));
		ToolCollection.push(new TileModel({
			//module
			module: 'tools-trip',
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "出租车轨迹分析",
			tileContent: "icon",
			iconName: "mif-cogs"
		}));
		ToolCollection.push(new TileModel({
			//module
			module: 'tools-section-selection',
			//tile classes
			tileSize: "tile", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "区域section选择工具",
			tileContent: "icon",
			iconName: "mif-table"
		}));
		ToolGroup.setTiles(ToolCollection);
		
		//application group
		var ApplicationGroup = new TileGroupView();
		ApplicationGroup.setWidth('two');
		ApplicationGroup.setTitle('应用范例');
		var ApplicationCollection = [];
		ApplicationCollection.push(new TileModel({
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Cloud",
			tileContent: "icon",
			iconName: "mif-cloud"
		}));
		ApplicationCollection.push(new TileModel({
			//tile classes
			tileSize: "tile-wide", 
			bgColor: "bg-blue",     
			fgColor: "fg-white", 

			//tile content
			tileLabel: "Cloud",
			tileContent: "icon",
			iconName: "mif-cloud"
		}));
		ApplicationGroup.setTiles(ApplicationCollection);
		
		$area.append($areaTitle);
		$area.append($(IntroductionGroup.render().el));
		$area.append($(ToolGroup.render().el));
		$area.append($(ApplicationGroup.render().el));
		
		$('body > .container').append($area);
		
		Controller.onRouteChange = function() {
			//remove title 
			$areaTitle.remove();
			
			//remove group
			IntroductionGroup.unrender();
			ToolGroup.unrender();
			ApplicationGroup.unrender();
			
			//remove area
			$area.remove();
		};
		
		//adjust tile area width
		var _setTilesAreaSize = function(){
	        var groups = $(".tile-group");
	        var tileAreaWidth = 80;
	        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	        
	        _.each(groups, function(group, index){
	            if (width <= 640) {
	                tileAreaWidth = width;
	            } else {
	                tileAreaWidth += $(group).outerWidth() + 80;
	            }
	        });
	        $(".tile-area").css({
	            width: tileAreaWidth
	        });
	    };
	    _setTilesAreaSize();
	    
	    //add mouse wheel event
	    var _addMouseWheel = function (){
	    	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	    	if(width <= 640) return;
	    	
	        $("body").mousewheel(function(event, delta, deltaX, deltaY){
	            var page = $(document);
	            var scroll_value = delta * 50;
	            page.scrollLeft(page.scrollLeft() - scroll_value);
	            return false;
	        });
	    };
	    _addMouseWheel();
		
	    //add tile loading animation
		var _tilesLoadingAnimation = function() {
			var tiles = $(".tile, .tile-small, .tile-sqaure, .tile-wide, .tile-large, .tile-big, .tile-super");

	        _.each(tiles, function(tile, index){
	            setTimeout(function(){
	                $(tile).css({
	                    opacity: 1,
	                    "-webkit-transform": "scale(1)",
	                    "transform": "scale(1)",
	                    "-webkit-transition": ".5s",
	                    "transition": ".5s"
	                });
	            }, Math.floor(Math.random()*500));
	        });

	        setTimeout(function(){
	        	$(".tile-group").animate({
	                left: 0
	            }, {
	            	speed: "fast"
	            });
	        }, 100);
		};
		_tilesLoadingAnimation();
	};
	
	return Controller;
});



//test
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile-wide", 
//	bgColor: "bg-red",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Label Name",
//	tileContent: "icon",
//	iconName: "mif-envelop"
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile", 
//	bgColor: "bg-blue",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Label Name",
//	tileContent: "icon",
//	iconName: "mif-cogs",
//	tileBadge: 123, 
//	badgeColor: "bg-grey"
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile-small", 
//	bgColor: "bg-blue",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Label Name",
//	tileContent: "icon",
//	iconName: "mif-cloud",
//	isSelected: true
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile-wide", 
//	bgColor: "bg-blue",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Cloud",
//	tileContent: "icon",
//	iconName: "mif-cloud"
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile-large", 
//	bgColor: "bg-yellow",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Plain Image",
//	tileContent: "image",
//	imageStyle: "image",
//	imageUrl: "res/images/menu/1.jpg"
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile", 
//	bgColor: "bg-yellow",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Image Cover",
//	tileContent: "image",
//	imageStyle: "imageCover",
//	imageUrl: "res/images/menu/2.jpg",
//	coverText: "test test test test test", 
//	coverColor: "op-green"
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile", 
//	bgColor: "bg-yellow",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Image Carousel",
//	tileContent: "image",
//	imageStyle: "carousel",
//	imageUrls: [ 
//	             "res/images/menu/1.jpg",
//	             "res/images/menu/2.jpg",
//	             "res/images/menu/3.jpg",
//	             "res/images/menu/4.jpg",
//	             "res/images/menu/5.jpg"
//	           ]
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile", 
//	bgColor: "bg-yellow",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Image Slide Cover",
//	tileContent: "image",
//	imageStyle: "slideCover",
//	imageUrl: "res/images/menu/3.jpg",
//	coverText: "12222222222222sdfasdfsfa", 
//	coverColor: "op-pink", 
//	slideDirection: "slide-down"
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile", 
//	bgColor: "bg-yellow",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Image Slide Cover",
//	tileContent: "image",
//	imageStyle: "slideCover",
//	imageUrl: "res/images/menu/3.jpg",
//	coverText: "12222222222222sdfasdfsfa", 
//	coverColor: "op-pink", 
//	slideDirection: "slide-right-2"
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile", 
//	bgColor: "bg-yellow",     
//	fgColor: "fg-white", 
//
//	//tile content
//	tileLabel: "Image Zooming",
//	tileContent: "image",
//	imageStyle: "imageZooming",
//	imageUrl: "res/images/menu/3.jpg",
//	zoomingType: "zooming-out"
//}));
//IntroductionCollection.push(new TileModel({
//	//tile classes
//	tileSize: "tile", 
//	bgColor: "bg-yellow",     
//	fgColor: "fg-white", 
//	effect: "slideRight",
//
//	//tile content
//	tileLabel: "Image Effect",
//	tileContent: "image",
//	imageStyle: "imageEffect",
//	imageUrls: [ 
//	             "res/images/menu/1.jpg",
//	             "res/images/menu/2.jpg",
//	             "res/images/menu/3.jpg",
//	             "res/images/menu/4.jpg",
//	             "res/images/menu/5.jpg"
//	           ]
//}));