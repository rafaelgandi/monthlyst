navigator.define('Touch', function (undefined) {
	var z = Zepto;
	//var isMobile =  !! navigator.userAgent.toLowerCase().match(/android/i);
	var isMobile =  !(z(window).width() > 800),
		longTapTimer;
	function longTap(_$elem, _callback) {
		// See: http://stackoverflow.com/a/2625240
		_callback = _callback || function () {};
		_$elem
		.on('touchend', function () {
			clearTimeout(longTapTimer);
			return false;
		})
		.on('touchstart', function () {
			console.log('>>> touchstart');
			longTapTimer = setTimeout(function () {
				_callback.call(_$elem);
			}, 1000);
			return false;
		});
		return _$elem;
	}
	
	if (! isMobile) {
		return {
			tap: 'click',
			doubleTap: 'dblclick',
			longTap: longTap
		};
	}
	
	return {
		tap: 'tap',
		doubleTap: 'doubleTap',
		longTap: longTap
	};
});