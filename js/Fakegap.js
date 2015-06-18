navigator.define('Fakegap', function (undefined) {
	var z = Zepto,
		$root = z(document);
	
	function deviceReady(_callback) {
		_callback = _callback || function () {};
		if (window.PhoneGap) {
			document.addEventListener('deviceready', _callback, true);
			return;
		}
		z(_callback);
	}
	
	function backButton(_callback) {
		_callback = _callback || function () {};
		if (window.PhoneGap) {
			document.addEventListener('backbutton', _callback, true);
			return;
		}
		$root.on('backbutton', _callback);
	}
	
	function menuButton(_callback) {
		_callback = _callback || function () {};
		if (window.PhoneGap) {
			document.addEventListener('menubutton', _callback, true);
			return;
		}
		$root.on('menubutton', _callback);
	}
	
	return {
		deviceReady: deviceReady,
		backButton: backButton,
		menuButton: menuButton,
		confirm: function (_o) {
			if (navigator.notification !== undefined && navigator.notification.confirm !== undefined) {
				navigator.notification.confirm(
					_o.message,
					function (button) {
						_o.callback.call(this, button);
					},
					_o.title, _o.buttons
				);
			}
			else { // old fashioned			
				_o.callback.call(this, confirm(_o.message));
			}
		}
	};
});