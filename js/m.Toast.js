navigator
.require('js/m.Cholog.js');

navigator.define('m\Toast', ['m\Cholog'],  function (z, undefined) {	
	var $toast = z('#m-toast');
	if (! $toast.length) {
		cholog('ERROR: No toast element found');
	}
	return { 
		notify: function (_msg) {
			$toast.attr('text', _msg.trim())[0].show();
		}
	};	
});