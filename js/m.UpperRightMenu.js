navigator
.require('js/m.Cholog.js')
.require('js/m.Config.js')
.require('js/Routes.js')
.require('js/Fakegap.js');

navigator.define('m\UpperRightMenu', [
	'm\Cholog',
	'm\Config',
	'Routes',
	'Fakegap'
], function (z, undefined) {	
	var $root = z(document),
		$menuCon = z('#m_dropdown_menu'),
		config = navigator.mod('m\Config'),
		routes = navigator.mod('Routes'),
		fakegap = navigator.mod('Fakegap'),
		IS_VISIBLE = false;
		
	function show() {
		IS_VISIBLE = true;
		$menuCon.fadeIn(200);
	}
	
	function hide() {
		IS_VISIBLE = false;
		$menuCon.hide();
	}
	
	$root.on('touchstart', function (e) {
		if (! IS_VISIBLE) { return true; }
		var $me = z(e.target),
			fromMenuButton = $me.closest('#m_dropdown_menu').length;
		if (! fromMenuButton) {
			hide();
		}
		return true;
	});
	
	$root.on('touchstart', '#m_dropdown_menu_button', show);
	$root.on('touchend', '#m_dropdown_menu div', function () {
		var $me = z(this);
		if ($me.attr('data-m-value') === 'about') {
			routes.gotoPage('about_page');
		}
		else { 
			setTimeout(function () {
				fakegap.exit();
			}, config.actionDelay);			
		}
		hide();
	});
	
	return { 
		show: show
	};	
});