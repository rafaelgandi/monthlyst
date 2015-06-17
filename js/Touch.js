navigator.define('Touch', function (undefined) {
	var z = Zepto;
	//var isMobile =  !! navigator.userAgent.toLowerCase().match(/android/i);
	var isMobile =  !(z(window).width() > 800);
	if (! isMobile) {
		return {
			tap: 'click',
			longTap: 'dblclick',
			doubleTap: 'dblclick'
		};
	}
	return {
		tap: 'tap',
		longTap: 'longTap',
		doubleTap: 'doubleTap'
	};
});