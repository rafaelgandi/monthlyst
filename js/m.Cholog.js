navigator.define('m\Cholog', function (z, undefined) {	
	var logCon = document.getElementById('m_log_con'),
		nl = "\n";
	self.cholog = function (_msg, _type) {
		_type = _type || 'log';
		var con = logCon.innerHTML;
		logCon.innerHTML = con + nl + '> ' + _msg;
		if (self.console) {
			console[_type](_msg); // TODO enable later
		}		
	};	
	return { log: cholog };	
});