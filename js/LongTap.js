navigator.define('LongTap', function (z, undefined) {
	var longTapTimer,
		$root = z(document);
	function longTap(_selector, _callback) {
		// See: http://stackoverflow.com/a/2625240
		_callback = _callback || function () {};
		$root
		.on('touchend', _selector, function () {
			//console.log('>>> touchend');
			clearTimeout(longTapTimer);
		})
		.on('touchmove', _selector, function () {
			clearTimeout(longTapTimer);
		})
		.on('touchstart', _selector, function () {
			//console.log('>>> touchstart');
			var $me = z(this);
			longTapTimer = setTimeout(function () {
				_callback.call(self, $me);
			}, 1000);
		});
	}
	return {
		bind: longTap
	};
});