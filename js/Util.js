
navigator.define('Util', function (z, undefined) {
	var $root = z(document);
	
	return {
		// See: http://stackoverflow.com/a/2673229
		isEmptyObject: function (obj) {
		  for (var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			  return false;
			}
		  }
		  return true;
		},
		
		getElementFromCache: (function () {
			var elems = {};
			return function (_selector, _useKey) {
				var selector = (typeof _useKey !== 'undefined') ? _useKey : _selector;		
				if (!elems[_selector]) {
					elems[_selector] = (typeof selector.selector !== 'undefined') ? selector : z(selector);
				}
				return elems[_selector];
			};			
		})(),
		
		removeEmptyObjects: function (_objs) {
			for (var p in _objs) {
				if (_objs.hasOwnProperty(p)) {
					if (Util.isEmptyObject(_objs[p])) {
						delete _objs[p];
					}
				}
			}
			return _objs;
		},
		
		findPos: function (obj) {
			// See: http://clifgriffin.com/2008/10/14/using-javascript-to-scroll-to-a-specific-elementobject/
			var curtop = 0;
			if (obj.offsetParent) {
				do {
					curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);
			return curtop;
			}
		},
		
		scrollTo: function (_elem) {
			// No really sure why i need a timeout here, but it only scrolls with a timeout.
			setTimeout(function () { 
				self.scrollTo(0, Util.findPos(_elem));
			}, 0);	
		},
		
		pint: function (_str) {
			var intValue = parseInt(_str, 10);
			if (isNaN(intValue)) {
				return 0;
			}
			return intValue;
		}
	};
});