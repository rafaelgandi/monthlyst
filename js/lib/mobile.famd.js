/* 
	Faux AMD Library (mobile edition)
		- Inspired by the AMD architecture. Extends the native Navigator object.
		- http://rafaelgandi.github.io/famd
	LM: 06-14-2015
	Author: Rafael Gandionco [www.rafaelgandi.tk]
 */
// Array.prototype.forEach() shiv //
// See: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
Array.prototype.forEach||(Array.prototype.forEach=function(a,b){var c,d;if(this==null)throw new TypeError(" this is null or not defined");var e=Object(this),f=e.length>>>0;if(typeof a!="function")throw new TypeError(a+" is not a function");arguments.length>1&&(c=b),d=0;while(d<f){var g;d in e&&(g=e[d],a.call(c,g,d,e)),d++}});
/* 
	Run When JS
		- Javascript code dependency checker	
	See: https://github.com/rafaelgandi/RunWhen
	LM: 10-09-14 
	Version: 0.2
*/
var runwhen=function(self){var cachedChecks={},TIMEOUT=800,check=function(_checks){var i=_checks.length;while(i--){if(!!cachedChecks[_checks[i]])continue;try{eval("if(typeof "+_checks[i]+" === 'undefined'){throw 'e';}"),cachedChecks[_checks[i]]=!0}catch(e){return!1}}return!0};return function(a,b){var c=1;a instanceof Array||(a=[a]),function d(){if(check(a))b.call(self);else{if(c>TIMEOUT)throw"RunWhen timeout reached for ["+a.join(", ")+"]";c++,self.setTimeout(d,10)}}()}}(self);
(function ($, self, undefined) {	
	var __modules = {},
		__loadedScripts = [],
		t = $.trim,
		NON_MODULE_INDICATOR = '@',
		$root = {};
	// Make sure that the methods we are about to inject to the native Navigator object is not aready defined. //	
	if (navigator.require !== undefined || 
		navigator.define !== undefined || 
		navigator.mod !== undefined) {
		throw 'One or more of the famd methods are already defined in the Navigator object';
		return;
	}	
	
	function __warn(_msg) {
		if (!! console) {
			console.warn(_msg);
		}
	}
	
	// See: http://www.nczonline.net/blog/2009/06/23/loading-javascript-without-blocking/
	function loadScript(url, callback){
		var script = document.createElement("script"),
			callback = callback || function () {};
		script.type = "text/javascript";  
		script.onload = function(){
			callback();
		};
		script.src = url + '?'+(new Date()).getTime(); // LM: 09-23-2014 [Now works on Android 4.1.2]
		document.body.appendChild(script);
	}
	
	function __collectLoadedScripts() {
		var $scripts = $('script').not('[data-famd-checked]'),
			queryStringRegExp = /\?.*$/;
		if ($scripts.length) {
			$scripts.each(function () {
				var $me = $(this),
					src = t($me.attr('src')).replace(queryStringRegExp, '');
				__loadedScripts.push(src);
				$me.attr('data-famd-checked', true);
			});	
		}
	}
	
	// Get all the src of all the currently loaded scripts before and on dom ready //
 	__collectLoadedScripts();
	$(function () {		
		__collectLoadedScripts();
		$root = $(document);
	});

	Navigator.prototype.famd = {
		getLoadedScripts: function () { // Get list of js paths that have already been loaded
			return __loadedScripts;
		},
		addPathAsLoaded: function (_src) { // Add a path to the internal array
			__loadedScripts.push(_src);
		},
		isPathLoaded: function (_src) { // Check if a certain path has already been loaded
			return ($.inArray(_src, __loadedScripts) > -1);
		}
	};	
	
	Navigator.prototype.require = function (_src, _callback) {
		$(function () { // Respect the DOM ready
			_src = t(_src);
			_callback = _callback || function () {};
			if ($.inArray(_src, __loadedScripts) === -1) {
				loadScript(_src, _callback);
				__loadedScripts.push(_src);
				return;
			}
			_callback();
		});
		return this;
	};
	
	Navigator.prototype.define = function (_moduleName, _dependencies, _callback) {
		var req = [];
		_moduleName = _moduleName.replace(NON_MODULE_INDICATOR, '');
		if (t(_moduleName) in __modules) { // Check if the module has already been defined and included in the page.		
			__warn('Module with name "'+_moduleName+'" has already been defined and included');
			return;
		}
		_callback = _callback || function () {};
		if (_dependencies instanceof Function) {
			_callback = _dependencies;
			_dependencies = undefined;
		}
		else if (_dependencies instanceof String) {
			_dependencies = [_dependencies]; // Force array
		}			
		// Register the module name right away to avoid duplicate 
		// running of module. But give it an undefined value.
		__modules[_moduleName];		
		if (_dependencies instanceof Array) {
			_dependencies.forEach(function (mod) {
				if (mod.indexOf(NON_MODULE_INDICATOR) !== -1) {
					// If one of the dependency is not a famd module then
					// load it directly. This is usually for 3rd party 
					// plugins or libraries. Just prefix an "@" symbol on 
					// the check string.
					req.push(t(mod.replace(NON_MODULE_INDICATOR, '')));
				}
				else {
					req.push('navigator.mod("'+t(mod)+'")');
				}
			});	
			runwhen(req, function () {
				$(function () {
					var run = _callback.call(self, $); // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
					__modules[_moduleName] = (run instanceof Object) ? run : {};
					$root.trigger(_moduleName, [__modules[_moduleName]]);
				});
			});
		}
		else {
			// When no dependencies are given, then run the callback right away after the dom is ready
			$(function () {
				var run = _callback.call(self, $);
				__modules[_moduleName] = (run instanceof Object) ? run : {};
				$root.trigger(_moduleName, __modules[_moduleName]);
			}); 
		}
	};
	
	Navigator.prototype.mod = function (_moduleName) {
		return __modules[_moduleName];
	};	
})(Zepto, self); // Dependent on Zepto when on mobile edition