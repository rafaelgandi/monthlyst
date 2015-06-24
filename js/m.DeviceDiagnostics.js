
navigator.require('js/m.Cholog.js');
navigator.define('m\DeviceDiagnostics', ['m\Cholog'], function (z, undefined) {	
	//var device = device || {};
	function diagnose() {		
		// Device diagnostics //
		try {
			cholog('---------- DEVICE DIAGNOSTICS ---------');
			cholog(navigator.userAgent);
			cholog('SCREEN WIDTH: '+screen.width);
			cholog('SCREEN HEIGHT: '+screen.height);
			cholog('availwidth: '+screen.availWidth);
			cholog('availheight: '+screen.availHeight);
			cholog('colorDepth: '+screen.colorDepth);
			cholog('window.console: ' + (typeof self.console));
			
			// phonegap stuff //
			cholog('device name: '+device.name);
			cholog('cordova: '+device.cordova);
			cholog('platform: '+device.platform);
			cholog('os version: '+device.version);
			cholog('model: '+device.model);
			cholog('uuid: '+device.uuid);			
			cholog('---------------------------------------');
		}
		catch (err) {
			cholog('Something went wrong while trying to do device diagnostics');
		}			
	}
	
	return { diagnose: diagnose };	
});