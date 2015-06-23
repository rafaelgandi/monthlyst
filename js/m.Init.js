/* 
	Monthlyst Bootstrap Script
 */

navigator
.require('js/m.Cholog.js')
.require('js/m.Storage.js')
.require('js/m.Config.js')
.require('js/TemplateBuilder.js')
.require('js/Routes.js');

navigator.define('m\Init', [
	'm\Cholog',
	'm\Storage',
	'Fakegap',
	'Routes',
	'TemplateBuilder'
], function (z, undefined) {		
	var $root = z(document),
		fakegap = navigator.mod('Fakegap'),
		routes = navigator.mod('Routes'),
		builder = navigator.mod('TemplateBuilder'),
		storage = navigator.mod('m\Storage');
	self.onerror = function (_errMsg, _url, _lineNum) {
		// LM: 09-30-2014 [Also log js errors]
		// See: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onerror
		cholog('JSERROR: "'+_errMsg+'" on '+_url+' @line: '+_lineNum);
		//return false;
	};	
	cholog('Init module loaded');	
	cholog('Building pages...');	
	builder
	.ajaxBuild('templates/list_page.html', '#monthly_item_list_page', function () {
		navigator.require('js/m.Page.monthly_item_list_page.js');
	})
	.ajaxBuild('templates/about_page.html', '#about_page')
	.ajaxBuild('templates/input_monthly_item.page.html', '#new_item_page', function () {
		navigator.require('js/m.Page.new_item_page.js');
	})
	.ajaxBuild('templates/input_notes_page.html', '#add_notes_page', function () {
		navigator.require('js/m.Page.add_notes_page.js');
	});
	
	navigator.require('js/m.DeviceDiagnostics.js').then('m\DeviceDiagnostics', function (deviceDiag) {
		deviceDiag.diagnose();
	});	
	
	// Device ready //	
	fakegap.deviceReady(function () {				
		cholog('deviceready event fired!');
		navigator.require('js/m.Interactions.js');		
	});
	
	$root.on('pagechange', function () {
		document.getElementById('paperDrawerPanel').closeDrawer();
		//z('#m_setting_list')[0].select('blah'); // <-- to disable highlighting when clicked
	});
	return {init:true};	
});