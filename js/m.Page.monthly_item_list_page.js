navigator
.require('js/m.Toast.js')
.require('js/Routes.js')
.require('js/m.Config.js')
.require('js/m.Storage.js')
.require('js/Util.js')
.require('js/m.Date.js')
.require('js/TemplateBuilder.js')
.require('js/Fakegap.js')
.require('js/LongTap.js');

navigator.define('m\Page\monthly_item_list_page', [
	'Routes',
	'm\Config',
	'm\Storage',
	'Util',
	'm\Date',
	'TemplateBuilder',
	'Fakegap',
	'LongTap'
], function (z, undefined) {	
	var $root = z(document),
		routes = navigator.mod('Routes'),
		config = navigator.mod('m\Config'),
		storage = navigator.mod('m\Storage'),
		date = navigator.mod('m\Date'),
		util = navigator.mod('Util'),
		builder = navigator.mod('TemplateBuilder'),
		fakegap = navigator.mod('Fakegap'),
		longtap = navigator.mod('LongTap'),
		listItemTemplate = z('#m_list_item_template').html(),
		$monthChangerButton = $('#m_month_changer_button'),
		$listItemsCon = z('#m_list_item_con'),
		$contextDialog = z('#m_context_dialog'),
		MONTH_YEAR_INFO = {},
		MONTH_TIMESTAMP,
		icons = {
			yes: 'check',
			no: 'clear'
		};
 	
	function noListItems() {
		$listItemsCon.html('<em class="m_no_items">No items for this month</em>');
	}
	
	function populateList(_month, _year) {
		var html = [],
			items,
			itemDetails,
			tempItemDetails,
			d = date.info(),
			monthTimestamp;
		_month = _month || d.month;	
		_year = _year || d.year;	
		monthTimestamp = date.getNormalizedMonthTimestamp(_month, _year);
		MONTH_YEAR_INFO = {
			month: _month,
			year: _year
		};
		MONTH_TIMESTAMP = monthTimestamp;
		if (typeof self.MONTHLYST_DB !== 'undefined' && ! util.isEmptyObject(self.MONTHLYST_DB.items)) {
			items = self.MONTHLYST_DB.items;
			itemDetails = self.MONTHLYST_DB.item_details,
			done = false;
			for (var p in items) {
				tempItemDetails = (itemDetails[p] && itemDetails[p][monthTimestamp]) ? itemDetails[p][monthTimestamp] : undefined;							
				if (util.pint(items[p].repeat_type) === 1) { // Quarterly
					if (z.inArray(_month, config.quarterlyMonths) < 0) {						
						continue;
					}
				}
				done = (!!tempItemDetails && tempItemDetails.status !== undefined && util.pint(tempItemDetails.status) === 1)
				html.push(builder.tpl(listItemTemplate, {
					'item_id': p,
					'icon': (done) ? icons.yes : icons.no,
					'status_class': (done) ? 'yes' : 'no',
					'item_name': items[p].name,
					'item_notes': (!!tempItemDetails && !!tempItemDetails.notes) ? tempItemDetails.notes : ''
				}));
			}
			if (html.length) {
				$listItemsCon.html(html.reverse().join(''));
				// helpout with the layout //
				// TODO: maybe change this later
				$listItemsCon.find('.notes').each(function () {
					var $me = z(this);
					if ($me.text().trim() === '') {
						$me.parent().find('header').addClass('no_notes');
					}
				});
				setTimeout(function () {
					$listItemsCon.find('.m_monthly_list_item').css({
						marginBottom: '10px'
					});	
				}, 10);
				
			}
			else {
				noListItems();
			}
			$monthChangerButton.find('paper-material').text(date.getMonthName(_month)+' '+_year);
		}
		else {
			noListItems();
		}
	}
	populateList();
	
	$root.on('monthly_item_list_page', function (e, $page) {
		if (!! MONTH_YEAR_INFO.year && !! MONTH_YEAR_INFO.month) {						
			populateList(MONTH_YEAR_INFO.month, MONTH_YEAR_INFO.year);
			return;
		}
		populateList();
	});
	
	function deleteItem(_itemId) {
		storage.deleteItem(_itemId);
		// Remove/hide the card //
		z('div.m_monthly_list_item[data-m-item_id="'+_itemId+'"]')
			.closest('paper-material')
			.fadeOut();
		navigator.mod('m\Toast').notify('Item deleted');	
	}
	
	function closeContextDialog() {
		setTimeout(function () {
			$contextDialog.get(0).close();
		}, 300);
	}
	
	function simpleHighlight(_$elem) {
		var hclass = 'm_simple_highlight';
		_$elem.addClass(hclass);
		setTimeout(function () {
			_$elem.removeClass(hclass);
		}, 200);
	}
	
	var Events = {
		addItemButtonPressed: function (e) {
			routes.gotoPage('new_item_page', {
				action: 'add'
			});
		},
		toggleItemStatus: function (e) {
			var $me = z(this),
				icon = $me.attr('icon'),
				$parentDiv = $me.parent(),
				itemId = $parentDiv.attr('data-m-item_id');
			if (icon.trim() === icons.yes) {
				storage.saveItemDetails({
					id: itemId,
					monthTimestamp: MONTH_TIMESTAMP,
					status: 0
				});
				$me.attr('icon', icons.no); // failed :(
				$parentDiv.removeClass('yes').addClass('no')
			}
			else {
				storage.saveItemDetails({
					id: itemId,
					monthTimestamp: MONTH_TIMESTAMP,
					status: 1
				});
				$me.attr('icon', icons.yes); // did it
				$parentDiv.removeClass('no').addClass('yes')
			}
		},
		monthChangerButtonPressed: (function () {
			var monthChangerButtonTimer;
			return function (e) {
				var $me = z(this);
				clearTimeout(monthChangerButtonTimer);
				monthChangerButtonTimer = setTimeout(function () {	// Give the button ripple effect time to show in mobile				
					fakegap.datePicker({
						date: new Date(),
						mode: 'date'
					}, function (d) {				
						populateList((d.getMonth()+1), d.getFullYear());
					});	
				}, config.actionDelay);
			};
		})(),
		tapPrevNextButtons: (function () {
			var tapTimer;
			return function (e) {
				var $me = z(this),
					isPrev = (this.id.indexOf('prev') > -1);
				z('.m_monthly_list_item').css({
					opacity: 0
				});	
				clearTimeout(tapTimer);	
				tapTimer = setTimeout(function () { // Give the button ripple effect time to show in mobile
					if (isPrev) { // prev button pressed
						var prevDateInfo = date.prevMonth(MONTH_YEAR_INFO.month, MONTH_YEAR_INFO.year);
						populateList(prevDateInfo.month, prevDateInfo.year);
					}
					else {
						var nextDateInfo = date.nextMonth(MONTH_YEAR_INFO.month, MONTH_YEAR_INFO.year);
						populateList(nextDateInfo.month, nextDateInfo.year);
					}					
				}, config.actionDelay);				
			}			
		})(),
		longTapItem: function ($me) { // For context dialog
			var itemId = $me.attr('data-m-item_id');
			$contextDialog.find('paper-button').attr('data-m-item_id', itemId);
			simpleHighlight($me);
			$contextDialog.get(0).open();
		},
		tapContextMenuButtons: function (e) {
			var $me = z(this),
				itemId = $me.attr('data-m-item_id'),
				action = $me.attr('data-m-context_action');
			if (action === 'm_delete') { // delete
				setTimeout(function () {
					fakegap.confirm({
						title: 'Delete Item',
						message: 'Are your sure you want to delete this item?',
						callback: function (button) {
							if (button === 2 || button === true) { // If yes
								deleteItem(itemId);
							}
							closeContextDialog();
						},					
						buttons: 'Nope,Delete'
					});
				}, config.actionDelay);		
			}
			else if (action === 'm_edit') { // edit
				setTimeout(function () {
					closeContextDialog();
					routes.gotoPage('new_item_page', {
						itemId: itemId
					});			
				}, config.actionDelay);				
			}	
			else { // add note
				setTimeout(function () {
					closeContextDialog();
					routes.gotoPage('add_notes_page', {
						itemId: itemId,
						monthTimestamp: MONTH_TIMESTAMP
					});
				}, config.actionDelay);			
			}
		}
	};
	
	// Handlers //
	$root.on('tap', '#m_add_item_floating_button', Events.addItemButtonPressed);
	$root.on('tap', '.m_item_status_button', Events.toggleItemStatus);
	$root.on('tap', '#m_month_changer_button', Events.monthChangerButtonPressed);	
	$root.on('tap', '#m_prev_month_button, #m_next_month_button', Events.tapPrevNextButtons);
	longtap.bind('.m_monthly_list_item', Events.longTapItem);
	$root.on('tap', '#m_context_dialog paper-button', Events.tapContextMenuButtons);
	return {init:true};	
});