navigator
.require('js/Routes.js')
.require('js/m.Storage.js')
.require('js/m.Toast.js')
.require('js/m.Date.js')
.require('js/m.Config.js')
.require('js/Util.js');

navigator.define('m\Page\new_item_page', [
	'Routes', 
	'm\Storage',
	'm\Toast',
	'm\Date',
	'm\Config',
	'Util'
], function (z, undefined) {	
	var $root = z(document),
		routes = navigator.mod('Routes'),
		storage = navigator.mod('m\Storage'),
		toast = navigator.mod('m\Toast'),
		date = navigator.mod('m\Date'),
		config = navigator.mod('m\Config'),
		util = navigator.mod('Util'),
		$page = z('#new_item_page'),
		$okButton = z('#input_item_ok'),
		$cancelButton = z('#input_item_cancel'),
		$itemNameField = $page.find('paper-input'),
		$repeatTypeField = z('#m_repeat_type'),
		ITEM_ID,
		repeatTypeNames = {
			0: 'monthly',
			1: 'quarterly'
		};		
	
	function getFormValues() {
		var returnObj = {};
		returnObj.repeatType = $repeatTypeField.find('paper-radio-button[checked]').attr('value');
		returnObj.itemName = $itemNameField.get(0).value;
		return returnObj;
	}
	
	function validate() {
		return $itemNameField.get(0).validate();
	}
	
	function reset() {
		$itemNameField.get(0).value = '';
		$repeatTypeField.get(0).select('monthly');
	}
	
	$root.on('new_item_page', function (e, $page) {
		var data = $page.data('route_data'),
			itemDetails;	
		reset();
		if (!!data && !!data.itemId) { // if edit is the action
			ITEM_ID = data.itemId;
			itemDetails = storage.getItemById(ITEM_ID);
			if (! itemDetails) {
				cholog('Unable to find any items with id "'+ITEM_ID+'" when trying to edit');
				return;
			}
			// populate the fields //
			$itemNameField.get(0).value = itemDetails.name;
			$repeatTypeField.get(0).select(repeatTypeNames[util.pint(itemDetails.repeat_type)]);
		}
	});	
	
	var Events = {
		cancelButtonPressed: (function () {
			var cancelButtonTimer;
			return function (e) {
				clearTimeout(cancelButtonTimer);				
				setTimeout(function () {
					reset();
					routes.gotoPage('monthly_item_list_page');
				}, config.actionDelay);				
			};
		})(),
		
		okButtonPressed: (function () {
			var okButtonTimer;
			return function (e) {
				clearTimeout(okButtonTimer);	
				if (! validate()) { return; }
				setTimeout(function () {
					var values = getFormValues();
					storage.saveItem({
						id: (!! ITEM_ID) ? ITEM_ID : date.getCurrentTimestamp(),
						name: values.itemName,
						repeatType: values.repeatType
					});
					toast.notify((!! ITEM_ID) ? 'Item updated' : 'New item added');
					routes.gotoPage('monthly_item_list_page');
				}, config.actionDelay);		
			};
		})()
	};
	
	// Handle events //
	$root.on('tap', '#input_item_cancel', Events.cancelButtonPressed);
	$root.on('tap', '#input_item_ok', Events.okButtonPressed);
	
	
	return {init:true};	
});