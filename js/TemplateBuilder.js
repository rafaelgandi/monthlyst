navigator.require('js/SimpleAjax.js');
navigator.define('TemplateBuilder', ['SimpleAjax'], function (z, undefined) {		
	var ajax = navigator.mod('SimpleAjax'),
		$root = z(document);
	// Tweet Size Template Engine
	// See: http://mir.aculo.us/2011/03/09/little-helpers-a-tweet-sized-javascript-templating-engine/
	function tweetTpl(s,d) {
		for(var p in d)
			s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
		return s;
	};
	
	var builder = {
		ajaxBuild: function (_url, _containerSelector, _callback) {
			_callback = _callback || function () {};
			ajax.get(_url, function (res) {
				z(_containerSelector).html(res);
				$root.trigger(_url, [res]);
				_callback.call(self, res);
			});
			return builder;
		}
	};
	
	return {
		tpl: tweetTpl,
		ajaxBuild: builder.ajaxBuild
	};
});