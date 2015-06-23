navigator
.require('js/m.Cholog.js')
.require('js/Util.js');
navigator.define('m\Storage', ['m\Cholog'], function (z, undefined) {	
	var LS = self.localStorage,
		LS_KEY = 'monthlyst',
		util = navigator.mod('Util');	
	// Global variable that all the data is stored to //	
	self.MONTHLYST_DB = self.MONTHLYST_DB || {};
	self.MONTHLYST_DB.items = {};
	self.MONTHLYST_DB.item_details = {};
	
	cholog('m\\Storage module has loaded!');
	// See: http://www.jamescroft.co.uk/blog/web-dev/create-remaining-storage-bar-html5-localstorage/
	var currentStorageSpace = 1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(LS))).length; 
	cholog('Current Storage Space: ' + currentStorageSpace);
	
	/* 
	{
		"items":{
			"1434815194186":{"name":"this is a test item","repeat_type":"1"},
			"1434816468152":{"name":"sadfdasfasdfs","repeat_type":"0"},
			"1434816987707":{"name":"asdfsadfdsa","repeat_type":"1"},
			"1434817430737":{"name":"ryrty rtyrt rtyrtytyyuytutyuy","repeat_type":"0"},
			"1434817478593":{"name":"dfgdgdg","repeat_type":"1"}
		},
		"item_details":{
			"1434815194186" {
				"9809890890890890": {
					notes: '',
					status: '0 | 1'
				},
				"8686786786786787": {
					notes: '',
					status: '0 | 1'
				}
			}
		}
	}
	*/
	
	function mImport(_data) {
		// JSON parsing borrowed from Skycable app //
		var r = {};
		_data = _data.trim();
		try { r = JSON.parse(_data); }
		catch (e) { 
			try {
				eval('r='+_data+';');
			}
			catch(lastResort){
				alert('Unable to import, invalid JSON found.');
				cholog('INVALID JSON FOUND ON IMPORT');
				cholog(lastResort.toString());
				return false;
			}						
		}
		self.MONTHLYST_DB = r;
		store();
		cholog('Successfully imported');
		return true;
	}
	
	// Do the import here //
	if (!! LS.getItem(LS_KEY)) {
		mImport(LS.getItem(LS_KEY));
	}
	
	function store() {
		LS.setItem(LS_KEY, JSON.stringify(self.MONTHLYST_DB));
		cholog('All monthlyst data stored in local storage.');
	}
	
	function clear() {
		LS.clear();
		LS.setItem(LS_KEY, '{}');
		cholog('ALL LOCALSTORAGE DATA DELETED!');;
	}	
	
	function saveItem(_obj) {
		self.MONTHLYST_DB.items[_obj.id] = {
			name: _obj.name,
			repeat_type: _obj.repeatType
		};
		if (typeof self.MONTHLYST_DB.item_details[_obj.id] === 'undefined') {
			self.MONTHLYST_DB.item_details[_obj.id] = {};
		}
		store();
	}
	
	function deleteItem(_itemId) {
		delete self.MONTHLYST_DB.items[_itemId];
		delete self.MONTHLYST_DB.item_details[_itemId];
		store();
		cholog('Deleted item "'+_itemId+'"');
	}

	function saveItemDetails(_obj) {
		if (! self.MONTHLYST_DB.items[_obj.id]) {
			throw 'No item found with id "'+_obj.id+'"';
		}
		if (! self.MONTHLYST_DB.item_details[_obj.id]) {
			self.MONTHLYST_DB.item_details[_obj.id] = {};
		}
		if (! self.MONTHLYST_DB.item_details[_obj.id][_obj.monthTimestamp]) {
			self.MONTHLYST_DB.item_details[_obj.id][_obj.monthTimestamp] = {};
		}
		if (typeof _obj.status !== 'undefined') {
			self.MONTHLYST_DB.item_details[_obj.id][_obj.monthTimestamp]['status'] = _obj.status;
		}
		if (!! _obj.notes) {
			self.MONTHLYST_DB.item_details[_obj.id][_obj.monthTimestamp]['notes'] = _obj.notes;
		}		
		cholog('saveItemDetails save happend for item "'+self.MONTHLYST_DB.items[_obj.id].name+'"');
		//console.log(self.MONTHLYST_DB.item_details[_obj.id]);
		store();
	}

	function getItemDetailsByIdAndTimestamp(_id, _timestamp) {
		if (self.MONTHLYST_DB.item_details[_id] === undefined) { return !!0; }
		if (self.MONTHLYST_DB.item_details[_id][_timestamp] === undefined) { 
			self.MONTHLYST_DB.item_details[_id][_timestamp] = {
				status: 0,
				notes: ''
			};
		}
		return self.MONTHLYST_DB.item_details[_id][_timestamp];
	}

	function getItemById(_id) {
		if (self.MONTHLYST_DB.items[_id] === undefined) { return !!0; }
		return self.MONTHLYST_DB.items[_id];
	}
	
	return { 
		store: store,
		clear: clear,
		import: mImport,
		LS_KEY: LS_KEY,
		saveItem: saveItem,
		saveItemDetails: saveItemDetails,
		deleteItem: deleteItem,
		getItemDetailsByIdAndTimestamp: getItemDetailsByIdAndTimestamp,
		getItemById: getItemById
	};	
});