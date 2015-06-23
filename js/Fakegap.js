navigator.require('js/m.Cholog.js');

navigator.define('Fakegap', [
	'm\Cholog'
], function (z, undefined) {
	var $root = z(document);
	
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
	
	function exitApp() {
		if (window.PhoneGap) {
			try {
				navigator.app.exitApp();
			}
			catch(e) {
				alert('ERROR: navigator.app.exitApp() - '+e.toString());
				navigator.device.exitApp();
			}
			return;
		}
		alert('Phonegap Exit triggered');
	};
	
	function confirm(_o) {
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
			_o.callback.call(this, self.confirm(_o.message));
		}
	}
	
	function datePicker(_params, _callback) {
		// Run datepicker pg plugin
		// See: https://github.com/InformationLogisticsTeam/cordova-plugin-datepicker/blob/31cded7/README.md
		_callback = _callback || function () {};
		var defaultDate = new Date();
		_params.date = (!! _params.date) ? _params.date : defaultDate;
		_params.mode = (!! _params.mode) ? _params.mode : 'date';
		if (navigator.notification !== undefined && self.datePicker !== undefined) {
			cholog('Phongap datePicker plugin running...');
			self.datePicker.show({
				date: _params.date,
				mode: _params.mode
			}, function (date) {
				if (date.toString().toLowerCase().indexOf('invalid date') !== -1) { // Only accept valid dates
					cholog('Invalid date given to datePicker plugin');
					return; 
				} 
				cholog('window.datePicker() plugin result: ' + date);  
				_callback.call(self, date);
			});
		}
		else {
			var dateStr = prompt('Fill in a valid date format', _params.date.getFullYear()+'-'+(_params.date.getMonth()+1)+'-'+1),
				date = (dateStr !== null) ? new Date(dateStr) : false;
			if (! date) { return; }	
			if (date.toString().toLowerCase().indexOf('invalid date') !== -1) { // Only accept valid dates
				cholog('Invalid date given to datePicker plugin');
				return; 
			} 
			_callback.call(self, date);
		}
	}
	
	return {
		deviceReady: deviceReady,
		bindBackButton: backButton,
		bindMenuButton: menuButton,
		confirm: confirm,
		datePicker: datePicker,
		exit: exitApp
	};
});