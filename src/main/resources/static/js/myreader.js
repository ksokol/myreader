window.write = function() {};

var app = {					
	conf : { 
		entryList : '#subscription-table',
		tree : '.subscription-tabs',
		scrollAnimation : { duration: 100, axis: 'y' },
		waypointAnimation : { offset: '100%' },
		scrollPositionOffset : 101,
		refreshInterval : 5 //minutes
	},

	log: function(msg) {
		if(console) {
			var dt = new Date();
			var dtFmt = dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
			console.log(dtFmt + " - " + msg);
		}
	},
	
	state : {
		checkBottom : 0,
		lastRefresh : 0,
		minimized : false,
		toggleMinimized : function() {							
			if('localStorage' in window && window['localStorage'] !== null) {
				localStorage.setItem('isMinimized', !app.state.isMinimized());
			}					
			app.state.minimized = !app.state.minimized;
		},
		isMinimized: function() {
			var hasStorage = 'localStorage' in window && window['localStorage'] !== null;					
			return (hasStorage && localStorage.getItem("isMinimized") !== null) ? (localStorage.getItem("isMinimized") === 'true') : app.state.minimized;
		}
	},
	
	events: {				
		propagate: function(event, param) {
			app.log('reader-' + event);
			
			if(param && param.currentTarget) {
				param.preventDefault();
				$(document).trigger('reader-' + event, param.currentTarget);
			} else {
				$(document).trigger('reader-' + event, param);
			}
			
			return this;
		},
		
		register: function(event, callback) {
			if(!event) throw "event not given in app.events.register(event, callback)";
			if(!callback && !(callback instanceof Function)) throw "callback not given in app.events.register(event, callback)";
			
			$.each($.makeArray(event), function(idx,val) {
				$(document).bind('reader-' + val, callback);
				});
				
				return this;
			}	
		}
	};
	
$(document).ready(function() {		
	app.events.register('bottom-edge', function() {			
	var $tfoot = $(app.conf.entryList + "> tfoot");
	
	if($tfoot.length > 0) {
		$tfoot.remove();
		
		if(!$(app.conf.tree).children('li').hasClass('open')) {
			$.get(window.location.pathname + $tfoot.find('a.more').attr('href'), function(data) {
				app.events.propagate('refresh-tree', data).propagate('add-page', data);						
			});
		} else {
			app.log("tree is open");
		}
	}
});

app.events.register('auto-refresh', function() {
	clearTimeout(app.state.lastRefresh);
	
	app.state.lastRefresh = setTimeout(function() {
		app.events.propagate('refresh-tree');
		app.log("refresh");
	}, app.conf.refreshInterval * 1000 * 60);
	app.log("tree refresh in " + (app.conf.refreshInterval) + " minutes" );			
});

app.events.register(['refresh-list', 'scroll-to-entry', 'check-bottom'], function(event, el) {
	clearTimeout(app.state.checkBottom);
	
	app.state.checkBottom = setTimeout(function() {
		var el = $('tfoot');
		var activeEntry = $(app.conf.entryList).find('.reader-active');
		
		if(el.length) {
			var viewPort = $(window).height();
			var elTop = el.offset().top - window.pageYOffset;			
			var offset = (viewPort * 0.25) + viewPort;					
			var isLast = (activeEntry.length) ? activeEntry.nextAll().length === 0 : false;
			
			if(elTop < offset || isLast) {
				app.events.propagate('bottom-edge');
			}
		}			
	}, 500);
});
		
app.events.register('refresh', function(event) {		
	$.get(window.location.href)
	.success(function (data) {
		app.events.propagate('refresh-tree', data).propagate('refresh-list', data);
	});			
});

app.events.register('refresh-list', function(event, el) {
	if(el && $(el).find(app.conf.entryList).length > 0) {								
		$(app.conf.entryList).children().replaceWith($(el).find(app.conf.entryList).children());	
	}
	
	if(app.state.isMinimized()) {				
		$(app.conf.entryList).find('tbody > tr').not('.reader-active').find('.entry-content, .entry-bar').hide();
	} else {
		$(app.conf.entryList).find('.entry-content, .entry-bar').show();
	}
});

app.events.register('add-page', function(event, el) {
	if(el && $(el).find(app.conf.entryList).length > 0) {							
		var $tr = $(el).find(app.conf.entryList + ' > tbody > tr');
		var $tfoot = $(el).find(app.conf.entryList + ' > tfoot');
		
		$(app.conf.entryList + ' > tbody').append($tr);
		$(app.conf.entryList).append($tfoot);
		app.events.propagate('refresh-list');
	}
});

app.events.register('refresh-tree', function(event, el) {
	app.events.propagate('auto-refresh');
	
	if(el && $(el).find(app.conf.tree).length > 0) {				
		$(app.conf.tree).replaceWith($(el).find(app.conf.tree));
	} else {					
		$.get(window.location.href)
		.success(function (data) {
			if($(data).find(app.conf.tree).length > 0) {
				$(app.conf.tree).replaceWith($(data).find(app.conf.tree));
			}
		});
	}
});

app.events.register('entry-toggle', function(event, el) {		
	var entry = ($(el).is('tr')) ? $(el) : $(el).parents('tr');

	if(entry.hasClass('reader-active')) {
		app.events.propagate('entry-open', entry);
	} else {
		app.events.propagate('entry-close', entry);
	}
});

app.events.register('entry-close', function(event, entry) {
	$(entry).find('.entry-content, .entry-bar').hide();
	app.events.propagate('entry-closed', entry);
});

app.events.register('entry-open', function(event, entry) {				
	$(entry).find('.entry-content, .entry-bar').show();			
	app.events.propagate('scroll-to-entry', entry);
});

app.events.register('scroll-to-entry', function(event, entry) {			
	$(entry).prevAll().hide();			
	$(document).scrollTo(0);
});

app.events.register('next-entry', function() {
	var next = ($(app.conf.entryList).find('.reader-active').length > 0) ? $(app.conf.entryList).find('.reader-active').next() : $(app.conf.entryList + " tbody > tr:first");

	if(next.length > 0) {
		next.prev().hide();
		$(app.conf.entryList).find('tbody tr').removeClass('reader-active');
		app.events.propagate('entry-open', next.toggleClass('reader-active'));
		app.events.propagate('entry-mark-as-read', next);
	}
});

app.events.register('prev-entry', function() {			
	var prev = ($(app.conf.entryList).find('.reader-active').length > 0) ? $(app.conf.entryList).find('.reader-active').prev() : $();

	if(prev.length > 0) {
		prev.show();
		$(app.conf.entryList).find('tbody tr').removeClass('reader-active');
		app.events.propagate('entry-open', prev.toggleClass('reader-active'));
	}
});

app.events.register('entry-mark-as-read', function(event, el) {
	var entry = ($(el).is('tr')) ? $(el) : $(el).parents('tr');
	
	if(entry.length > 0 && entry.data('reader-unseen') === true) {				
		app.events.propagate('entry-change-read-state', entry);
	} else {
		app.log('entry already marked as seen');
	}
});

app.events.register('entry-change-read-state', function(event, el) {
	el = (el) ? $(el) : $(app.conf.entryList).find('.reader-active');
	var entry = ($(el).is('tr')) ? $(el) : $(el).parents('tr');
	
	if(entry.length > 0) {	
		var a = $(entry).find('.reader-unseen-flag a').toggleClass('hidden');				
		var url = $(entry).find('.reader-unseen-flag a:visible').attr('href');
		
		var loc = window.location.protocol + "//"+ window.location.host + url;		
		
		$.post(loc)
		.success(function() {				
			app.events.propagate('refresh-tree');
		});
	}
});

app.events.register('refresh-entry', function(event, id) {			
	var entry = $(app.conf.entryList).find("[data-entry-id="+id+"]");			
	
	if(entry.length > 0) {
		var href = (window.location.href.indexOf('?') === -1) ? window.location.href + '?' : window.location.href;				
		var url = href + '&entry=' + entry.data('entry-id');

		$.get(url)
		.success(function(data) {					
			$(entry).find('.entry-bar').replaceWith($(data).find('.entry-bar').removeClass('hidden'));
			app.events.propagate('refresh-tree');
		});
	}
});

//
$(app.conf.entryList).on('click', '.reader-entry-toggle', function(e) {				
	app.events.propagate('entry-toggle', e);			
});

$(document).bind('keyup', 'left', function() {			
	app.events.propagate('prev-entry');			
});
	
$(window).bind('keyup', 'right', function() {
	app.events.propagate('next-entry');			
});

$(app.conf.entryList).on('click', '.reader-unseen-flag', function(e) {
	app.events.propagate('entry-change-read-state', e);			
});

$(document).bind('keyup','return', function() {
	app.events.propagate('entry-change-read-state');
});

$(app.conf.tree + ' ul').on('click', 'li a', function(e) {	
	history.pushState({ path: this.path }, '', this.href);
	$(document).scrollTo(0);
	$(app.conf.tree).children('li').toggleClass('open');
	app.events.propagate('refresh', e);
});

$(window).bind('popstate', function() { 
	app.events.propagate('refresh'); 
});

$('#reader-forward').click(function(e) {
	app.events.propagate('next-entry', e);	
});

$('#reader-backward').click(function(e) {
	app.events.propagate('prev-entry', e);	
});

$('#reader-refresh').click(function(e) {
	app.events.propagate('refresh', e);	
});

//scroll to bottom
var top = $(window).scrollTop();  
$(window).scroll(function(){	      
    var curTop = $(window).scrollTop();
    if(top < curTop) {
    	app.events.propagate('check-bottom');
    }
    top = curTop;	       
});

$(app.conf.entryList).on('click', '.entry-bar > *, h5 > a', function() {
	$(app.conf.entryList).find('.reader-active').removeClass('reader-active');
	$(this).parents('tr').addClass('reader-active');
});		

/*
$(window).bind('keyup', 'h', function() {			
	$('.reader-show-details').not('.hidden').find('a').click();
});

if(app.state.isMinimized()) {
	$('.reader-show-details').toggleClass('hidden');
}
*/
app.events.propagate('refresh-list').propagate('auto-refresh');

//Modal Dialog

//http://stackoverflow.com/questions/12286332/twitter-bootstrap-remote-modal-shows-same-content-everytime

$('body').on('hidden', '#modal', function () {
	  $(this).removeData('modal');
});

$('#modal').on('click', '.reader-read-button', function() {
	$('#unseen').attr('value',$(this).data('unseen'));
});

$('#modal').on('click', '#modal-save', function (e) {
	e.preventDefault();
	  
	var url = $('#modal').data('modal').options.remote;
	
	$.post(url, $('#modal').find('form').serialize() )
	.success(function() {
		var id = $('#modal').find('form').find('input[name="id"]').val();
		$.notification({type : 'success', message : 'updated'});			   
	   	app.events.propagate('refresh-entry', id);
	   	$('#modal').modal('hide');
	})
	.error(function() {
		$.notification({type : 'error', message : 'error during update'});
		$('#modal').modal('hide');
		});
	});
});


$(document).ready(function() {
	$('.icon-chevron-right').on('click', function(e) {
		e.preventDefault();
		
		var idx = $(this).data('idx');
		
		$('.leaf').filter(':not(.leaf-'+idx+')').addClass('hidden');				
		$('.icon-chevron-down').filter(':not([data-idx='+idx+'])').toggleClass('icon-chevron-down').toggleClass('icon-chevron-right');
		$('.leaf-'+idx).toggleClass('hidden');
		
		$(this).toggleClass('icon-chevron-down').toggleClass('icon-chevron-right');
		
	});	
	
	$(document).ready(function() {
		
		if($(".table-subscription").html()) {
			$("#subscription-table").tablesorter(); 
			
			//TODO: .table-subscription und #table-subscription vereinen. wird in subscription/index.jsp und collection.jsp benutzt
			$('.table-subscription').liveFilter({
				inputElement : '.search-query'
			});
		}
	});
	
	$('#delete-subscription').on('click', function(e) {					
		e.preventDefault();
		var a = $(this);
				
        bootbox.confirm("Are you sure?", function(confirmed) {
            if(confirmed) {
            	window.location.href = a.attr('href');
            }
        });
	});
	
	app.events.register('refresh-exclusions', function(event) {		
		var inputs = $('.table-exclusions tbody tr td input');
		
		$.each(inputs, function(idx,val) {
			$(val).attr("name", "exclusions["+idx+"].pattern").attr("id", null);
		});		
	});
	
	$('.btn-add-exclusion').on('click', function(e) {
		e.preventDefault();
		var table = $('.table-exclusions');
		var tr = $('<tr><td><input autocomplete="off" type="text" value=""></td><td>0</td><td><a class="btn btn-danger btn-delete-exclusion" href="#">delete</a></td></tr>');
		
		table.append(tr);
		app.events.propagate('refresh-exclusions');
		
	});
	
	$('.table-exclusions').on('click', '.btn-delete-exclusion', function(e) {
		e.preventDefault();
		$(this).parent().parent().remove();
		app.events.propagate('refresh-exclusions');
	});
});
