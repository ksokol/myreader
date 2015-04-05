/***********************************************************/
/*                    LiveFilter Plugin                    */
/*                      Version: 1.4                       */
/*                      Mike Merritt                       */
/*             	   Updated: Aug 26, 2012                   */
/* 					    Kamill Sokol                       */
/***********************************************************/

;(function($){
	$.fn.liveFilter = function (option) {
		var options = $.extend({}, { inputElement: 'input[type="text"]' }, option);
		var keyDelay = -1;
		var cache = $($(this)).find('tbody tr');
		
		$(options.inputElement).keypress(function(e){
		    if ( e.which == 13 ) {
		        e.preventDefault();
		    }
		});	
		
		$(options.inputElement).keyup(function() {
			var input = $(this);
			clearTimeout(keyDelay);

			keyDelay = setTimeout(function () { 
				var filter = input.val().toLowerCase();
				
				cache.each(function(i) {
					text = $(this).text().toLowerCase();
					if (text.indexOf(filter) >= 0) {
						$(this).show();
					} else {
						$(this).hide();
					}
				});
				
				clearTimeout(keyDelay);
			}, 0);		
		});
	};
})(jQuery);