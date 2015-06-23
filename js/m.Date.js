navigator.require('js/Util.js');

navigator.define('m\Date', ['Util'], function (z, undefined) {	
	var now = new Date(),
		util = navigator.mod('Util'),
		monthNames = {
			0: 'NA',
			1: 'Jan',
			2: 'Feb',
			3: 'Mar',
			4: 'April',
			5: 'May',
			6: 'June',
			7: 'Jul',
			8: 'Aug',
			9: 'Sept',
			10: 'Oct',
			11: 'Nov',
			12: 'Dec'
		};
	
	function getCurrentTimestamp() {
		return (new Date()).getTime();
	}
	
	function getCurrentMonth() {
		return (now.getMonth()+1);
	}
	
	function getMonthName(_monthNum) {
		return monthNames[util.pint(_monthNum)];
	}
	
	function info(_timestamp) {
		_timestamp = _timestamp || now.getTime();
		var date = new Date(_timestamp);		
		return {
			month: (date.getMonth()+1),
			year: date.getFullYear()
		};
	}
	
	function getNormalizedMonthTimestamp(_month, _year) {
		_month = (_month-1) || now.getMonth();
		_year = _year || now.getFullYear();
		var date = new Date();
		date.setFullYear(_year);
		date.setMonth(_month);
		// Normalize the timestamp here //
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(59);
		date.setSeconds(59);
		date.setMilliseconds(0);
		return date.getTime();
	}
	
	function prevMonth(_month, _year) {
		_month = _month || (now.getMonth()+1);
		_year = _year || now.getFullYear();		
		_month = _month - 1;
		if (_month <= 0) {
			_month = 12
			_year = _year - 1;
		}
		return {
			month: _month,
			year: _year
		};
	}
	
	function nextMonth(_month, _year) {
		_month = _month || (now.getMonth()+1);
		_year = _year || now.getFullYear();
		_month = _month + 1;
		if (_month > 12) {
			_month = 1;
			_year = _year + 1;
		}
		return {
			month: _month,
			year: _year
		};
	}
	
	return { 
		getCurrentTimestamp: getCurrentTimestamp,
		getCurrentMonth: getCurrentMonth,
		info: info,
		getNormalizedMonthTimestamp: getNormalizedMonthTimestamp,
		getMonthName: getMonthName,
		prevMonth: prevMonth,
		nextMonth: nextMonth
	};	
});