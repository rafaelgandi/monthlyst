//navigator.require('js/Util.js');
navigator.define('Routes', function (undefined) {
	var z = Zepto,
		$root = z(document),
		$pages = z('section.route_page'),
		pageCache = {},
		$CURRENT_PAGE = $pages.filter('.route_active_page'),
		$PREV_PAGE;
		
	function gotoPage(_page, _data) {
		var pageId = _page.trim().replace(/#/ig, ''),
			$page, // Page to show
			$otherPages; 	
		if (! (pageId in pageCache)) {	
			pageCache[pageId] = z('#'+pageId);
		}		
		if (! pageCache[pageId].length) {
			throw 'Unable to find any section page with id "'+pageId+'"';
			return;
		}
		$page = pageCache[pageId];
		$otherPages = $pages.not($page);
		$page.data('route_data', '');
		if (!! _data) {
			$page.data('route_data', _data);
		}
		$root.trigger('beforepagechange', [$CURRENT_PAGE]);
		$page.addClass('route_active_page').fadeIn(200);
		$otherPages.removeClass('route_active_page').hide();
		$PREV_PAGE = {
			$: $CURRENT_PAGE,
			data: $CURRENT_PAGE.data('route_data')
		};
		$CURRENT_PAGE = $page	
		$root.trigger('pagechange', [$page]);	
		$root.trigger(pageId, [$page]);	
	}	
	
	function gotoPrevPage() {
		if (! $PREV_PAGE) { return; }
		var id = $PREV_PAGE.$.attr('id'),
			data = $PREV_PAGE.data;
		gotoPage(id, data);	
		return $PREV_PAGE;
	}
	
	var Events = {
		tapLink: function (e) {
			e.preventDefault();
			var $me = z(this),
				pageId = $me.attr('data-route').trim(),
				data = $me.attr('data-route_data');
			if (!! data) {
				gotoPage(pageId, data);
				return;
			}	
			gotoPage(pageId);
		}
	};
	
	$root.on('tap', '[data-route]', Events.tapLink);
		
	return {
		gotoPage: gotoPage,
		gotoPrevPage: gotoPrevPage,
		root: $root
	};
});