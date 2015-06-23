navigator
.require('js/Routes.js')
.require('js/m.Storage.js')
.require('js/m.Toast.js');

navigator.define('m\Page\new_item_page', [
	'Routes', 
	'm\Storage',
	'm\Toast'
], function (z, undefined) {	
	var $root = z(document),
		routes = navigator.mod('Routes'),
		storage = navigator.mod('m\Storage'),
		toast = navigator.mod('m\Toast'),		
		$notesField = z('#item_note'),		
		ITEM_ID,
		MONTH_TIMESTAMP, 
		itemDetails;
	
	function reset() {
		$notesField.get(0).value = '';
	}
	
	$root.on('add_notes_page', function (e, $page) {
		var data = $page.data('route_data');
		if (! data.itemId) {
			cholog('No item id given when trying to add note');
			throw 'No item id given when trying to add note';
		}
		ITEM_ID = data.itemId;
		MONTH_TIMESTAMP = data.monthTimestamp;	
		itemDetails = storage.getItemDetailsByIdAndTimestamp(ITEM_ID, MONTH_TIMESTAMP);	
		if (! itemDetails) {
			throw 'Unable to find details for item with id "'+ITEM_ID+'"';
		}
		$notesField.get(0).value = (!! itemDetails.notes) ? itemDetails.notes : '';
	});	
	
	var Events = {
		cancelButtonPressed: function (e) {
			reset();
			routes.gotoPage('monthly_item_list_page');
		},
		
		okButtonPressed: function (e) {
			storage.saveItemDetails({
				id: ITEM_ID,
				monthTimestamp: MONTH_TIMESTAMP,
				notes: $notesField.get(0).value.trim()
			});
			toast.notify('Note added');
			routes.gotoPage('monthly_item_list_page');							
		}
	};
	
	// Handle events //
	$root.on('tap', '#note_cancel_button', Events.cancelButtonPressed);
	$root.on('tap', '#note_ok_button', Events.okButtonPressed);	
	
	return {init:true};	
});