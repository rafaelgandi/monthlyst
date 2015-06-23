navigator
.require('js/m.Cholog.js')
.require('js/Routes.js')
.require('js/Fakegap.js');

navigator.define('m\Interactions', [
	'm\Cholog',
	'Routes',
	'Fakegap'
], function (z, undefined) {	
	var $root = z(document),
		routes = navigator.mod('Routes'),
		fakegap = navigator.mod('Fakegap');
	
	cholog('m\\Interactions loaded!');
	navigator.require('js/m.UpperRightMenu.js');
	
	var phonegapEvents = {
		backButton: function () {
			var $currentPage = z('.route_active_page'),
				pageId;
			if (! $currentPage.length) { return; }
			pageId = $currentPage.attr('id').trim();
			if (pageId === 'monthly_item_list_page') {
				alert('exit');
				fakegap.exit();
			}
			else {
				// Redirect to list page //
				routes.gotoPage('monthly_item_list_page');
			}
		},
		menuButton: function () {},
	};

	// ================================ Handle events here ================================ //
	// Phonegap Events //
	fakegap.bindBackButton(phonegapEvents.backButton);
	fakegap.bindMenuButton(phonegapEvents.menuButton);	
	
	return {init:true};	
});