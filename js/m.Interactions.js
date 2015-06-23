navigator
.require('js/m.Cholog.js')
.require('js/Fakegap.js');

navigator.define('m\Interactions', [
	'm\Cholog',
	'Fakegap'
], function (z, undefined) {	
	var $root = z(document),
		fakegap = navigator.mod('Fakegap');
	
	cholog('m\\Interactions loaded!');
	
	var phonegapEvents = {
		backButton: function () {
			alert('back button');
		},
		menuButton: function () {},
	};

	// ================================ Handle events here ================================ //
	
	navigator.require('js/LongTap.js').then('LongTap', function (longtap) { // For long tap events
		
	});	
	// Phonegap Events //
	document.addEventListener('backbutton', phonegapEvents.backButton, false);		
	document.addEventListener('menubutton', phonegapEvents.menuButton, false);
	
	
	return {init:true};	
});