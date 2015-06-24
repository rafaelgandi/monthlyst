navigator
.require('js/m.Cholog.js')
.require('js/m.Config.js')
.require('js/m.Storage.js')
.require('js/m.Toast.js')
.require('js/Fakegap.js')
.require('js/Routes.js');

navigator.define('m\BackupRestore', [
	'm\Cholog', 
	'm\Config', 
	'm\Storage', 
	'm\Toast', 
	'Fakegap',
	'Routes'
], function (z, undefined) {	
	var $root = z(document),
		routes = navigator.mod('Routes'),
		fakegap = navigator.mod('Fakegap'),
		config = navigator.mod('m\Config'),
		storage = navigator.mod('m\Storage'),
		toast = navigator.mod('m\Toast'),
		mFile = {
			FILE_SYS: 0,
			FILE_ENTRY: 0,
		},
		writeBackUp = function (_a, _b) { cholog('writeBackUp() nothing'); }, // backup
		readBackUp = function (_a) { cholog('readBackUp() nothing'); };	// restore
	
	cholog('Backup and Restore module loaded');
	cholog('Preparing file system...');
	
	var Events = {
		backupButtonPressed: function () {
			fakegap.confirm({
				message: 'Continue with backup?',
				callback: function (button) {
					if (button === 2 || button === true) {
						try {
							var data = storage.getStringyData();
							writeBackUp(data, function () {
								cholog('Backup made!!!');
								toast.notify('Backup made!!!');
								document.getElementById('paperDrawerPanel').closeDrawer();
							});
						}
						catch (e) {
							cholog('Error on file backup, try again');
						}	
					}
				},
				title: 'Backup',
				buttons: 'Nope,Backup'
			});	
		},
		restoreButtonPressed: function () {
			fakegap.confirm({
				message: 'Continue with restore? This will OVERWRITE THE BACKUP FILE!',
				callback: function (button) {
					if (button === 2 || button === true) {
						fakegap.confirm({
							message: 'ARE YOU SURE ABOUT THIS?',
							callback: function (b) {
								if (b === 2 || b === true) {
									readBackUp(function (res) {
										
										// TODO: something is wrong here 
									
										if (storage.import(res)) {
											routes.gotoPage('monthly_item_list_page');
											toast.notify('Finished restoring data.');
											document.getElementById('paperDrawerPanel').closeDrawer();
										}
										else {
											cholog('Sorry, unable to restore data.');
											alert('Sorry, unable to restore data.');
										}
									});		
								}
							},
							title: 'Are you really sure?',
							buttons: 'Nevermind, Yes I\'m sure'
						});						
					}
				},
				title: 'Restore',
				buttons: 'Nope,Restore'
			});	
		}
	};
	
	function failFS(evt) {
		cholog("File System Error: " + evt.target.error.code);
	}
	var readFail, writeFail;
	readFail = writeFail = function (error) {
		cholog("Create/Write Error: " + error.code);
	}
	
	// See: http://www.azoft.com/spotlight/2011/02/02/filesystem-apifile-api.html
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	self.PERSISTENT = (typeof LocalFileSystem !== 'undefined') ? LocalFileSystem.PERSISTENT : self.PERSISTENT;
	if (window.webkitStorageInfo !== undefined) { // Required for desktop testing
		var MB5 = (5*1024*1024);
		cholog('Webkit quota being used');
		window.webkitStorageInfo.requestQuota(self.PERSISTENT, MB5, runAll, failFS); // Depricated by chrome
	}
	else { runAll(0); }
	
	function runAll(_bytes) {
		try {
			function createGotNewFile(file) {
				cholog("Created: '" + file.fullPath + "'")
			}
			function createGotFileEntry(fileEntry) {
				mFile.FILE_ENTRY = fileEntry;
				fileEntry.file(createGotNewFile, writeFail);
			}
			function gotFS(fileSystem) {
				cholog('window.requestFileSystem worked!');
				mFile.FILE_SYS = fileSystem;
				cholog('fileSystem.name: '+fileSystem.name);
				cholog('fileSystem.root.name: '+fileSystem.root.name);
				fileSystem.root.getFile(config.backupFilename, {create: true, exclusive: false}, createGotFileEntry, writeFail);
			}
			
			if (mFile.FILE_SYS) {
				gotFS(mFile.FILE_SYS);
			} else {
				window.requestFileSystem(self.PERSISTENT, _bytes, gotFS, failFS);
			}
			
			// Writing to file/backup //
			writeBackUp = function (_backupString, _callback) {
				var data = 	(! fakegap.isMobile) ? (new Blob([_backupString],{})) : (_backupString+'');				
				_callback = _callback || function () {};
				if (mFile.FILE_ENTRY) {
					mFile.FILE_ENTRY.createWriter(function (writer) {
						cholog('created writer');
						try {
							// If something went wrong while writing to file. //
							writer.onerror = function (evt) {
								cholog('File writer error, unable to write data.');
							};
						}
						catch (err) {
							// If the onerror event did not worked //
							cholog('File writer onerror event failed.');
						}
						writer.onwriteend = function (evt) {
							_callback();
							cholog('New backup has been made!');
						};									
						writer.write(data);	
					}, writeFail);
				}
				else {					
					cholog('ERROR: Unable to write backup because FILE_ENTRY was not set.');
				}
			};
			
			// Read from file/backup //
			readBackUp = function (_callback) {
				_callback = _callback || function (res) {};
				if (mFile.FILE_ENTRY) {
					mFile.FILE_ENTRY.file(function (file) {
						// Read as text //
						var reader = new FileReader();
						 reader.onloadend = function (evt) {
							//console.log(evt.target.result);
							cholog('Finished reading backup file.');
							_callback(evt.target.result);
						};
						reader.readAsText(file);
					}, readFail);
				}
				else {
					cholog('ERROR: Unable to read backup because FILE_ENTRY was not set');
				}
			};
			
			// Handle events //
			$root.on('tap', '#m_backup_button', Events.backupButtonPressed);
			$root.on('tap', '#m_restore_button', Events.restoreButtonPressed);			
		}
		catch (fileErr) {
			cholog('FILE SYSTEM FAILED!!!');
		}
	}
	
	return { init:true };	
});