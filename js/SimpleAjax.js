// See: https://groups.google.com/forum/#!topic/phonegap/wdQ4ga5Lkp0
// See: https://code.google.com/p/android/issues/detail?id=21177
// See: http://simonmacdonald.blogspot.com/2011/12/on-third-day-of-phonegapping-getting.html
// See: https://groups.google.com/forum/#!msg/phonegap/1e0z4I9Ps68/pfxXSbzWIoMJ
// See: http://stackoverflow.com/questions/13639736/xmlhttprequest-read-local-file-not-working-on-all-browsers
navigator.define('SimpleAjax', function (z, undefined) {	
	function get(_path, _callback) {
		_callback = _callback || function (res) {};
		// See: http://osdir.com/ml/phonegap/2012-10/msg00885.html
		var req = new XMLHttpRequest(),
			//path = _path + ((! isMobileAndroid()) ? '?'+(new Date()).getTime() : '');
			path = _path + '?' + (new Date()).getTime(); // LM: 09-28-2014 [Always add a cache buster]
		req.open("GET", path, true);
		req.onreadystatechange = function () {
			if (req.readyState == 4) {
				if (req.status == 200 || req.status == 0) {
				  _callback(req.responseText);
				}
			}
		};
		req.send(null);
	}
	return { get: get };	
});