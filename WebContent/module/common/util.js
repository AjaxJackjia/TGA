define(['jquery'], function($) {
	
	//load css file on demand
	var loadCss = function(p_cssPath) {
		//css path, 绝对地址url
		var cssUrl = p_cssPath || "";
				
		// 异步加载，防止阻塞
		$.ajax({
			url: cssUrl,
			success: function(cssContent) {
				
				//judge whether this css file is existed in <head> 
				var $existedCss = $('head style');
				var isExisted = false;
				$.each($existedCss, function(index, css) {
					if($(css).attr('module-href') === cssUrl) {
						isExisted = true;
					}
		        });

				if(!isExisted) {
					$style = $('<style>');
					$style.attr('module-href', cssUrl);
					$style[0].innerHTML = cssContent;
					$('head').append($style);
				}
			},
			error: function() {
				console.err("load css file error!");
			}
		});
	};
	
	return {
		loadCss: loadCss
	}
});