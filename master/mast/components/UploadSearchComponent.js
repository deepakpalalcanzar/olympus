/*	component consisting of both upload buttons
	as well as the search bar */
Mast.registerComponent('UploadSearchComponent',{

	model: {
		createFolderButton	: false,
		uploadFileButton	: false,
	},

	template: '.upload-search-template',
	outlet: '#topbar',
	autoRender: false,
	
	events: {
		'click .create-folder'	: 'createFolderOrWorkgroup',
		'click .upload-file'  	: 'createUploadDialog',
		'click .search-users'  	: 'searchUsers',
		// 'click .thumbnail'  	: 'thumbnailView',
		'click .detail-list'  	: 'dafaultView'
	},

	dafaultView: function(){
		Mast.navigate('#');
	},

/*
	thumbnailView: function(){
		Mast.navigate('thumbnail');
	},*/

	afterRender: function() {
		
		Olympus.ui.fileSystem.on('cd', this.updateButtonState);
// Create new autocomplete for use with the textarea. Do this only if this olympus app
// is not a private deployment.
	},

	afterCreate: function () {
		this.$el.disableSelection();
	},

// Allows super admin to create top level workgroup
	createWorkgroup: function(e) {
		var toplevel = Olympus.ui.fileSystem.pwd;

		// Find and return first model where editing is true, (ie. It will have the editing inode
		// input in its template).
		if (Olympus.ui.fileSystem.get('renaming') === true) {
			var editingInode = toplevel.collection.find(function(model) {
				return model.get('editing') === true;
			});

			if (editingInode) {
				editingInode.set({editing: false});
			}
		}

		Mast.Socket.request('/directory/mkdir', {
			name: 'New Workgroup'
		},

		// Once the folder is created, set it to edit mode so
		// that it can be named.
		function(res) {
			toplevel.collection.where({
				id: res.id
			})[0].set('editing',true);
		});

		e.stopPropagation();
	},

	createFolderAtPwd: function(e) {
		var currentInode = Olympus.ui.fileSystem.pwd;

		// Find and return first model where editing is true, (ie. It will have the editing inode
		// input in its template).
		if (Olympus.ui.fileSystem.get('renaming') === true){
			var editingInode = currentInode.collection.find(function(model){
				return model.get('editing') === true;
			});

			if (editingInode) {
				editingInode.set({editing: false});
			}
		}

		// Set filesystem renaming property to be true.
		// We need this so that we can have only one editing inode template at a time.
		Olympus.ui.fileSystem.set({renaming: true}, {silent: true});

		Mast.Socket.request('/directory/mkdir',{
				parent: {
					id: currentInode.get('id')
				},
				id: currentInode.get('id'),  // For access control purposes
				name: 'New Folder'
			},

			// Once the folder is created, set it to edit mode so
			// that it can be named.
			function(res, other) {

				// Add to collection
				// currentInode.collection.add([res]);

				currentInode.collection.where({
					id: res.id
				})[0].set('editing',true);
			});


		if (currentInode.get('state') !== 'expanded') {
			currentInode.expand(e);
		}

		e.stopPropagation();
	},

// creates a new folder at the present working directory
	createFolderOrWorkgroup: function(e) {
		if (Olympus.ui.fileSystem.pwd._class === 'FileSystem') {
			this.createWorkgroup(e);
		} else {
			this.createFolderAtPwd(e);
		}

	},

// create a file upload dialog component
	createUploadDialog: function(e) {
		if($('.progress-bar:visible').length){
			alert('Please wait for the upload to complete.');
		}else{
			var uploadDialog = new Mast.components.UploadFileDialogComponent();
		}
		e.stopPropagation();
	},

// When the session data is available
	afterConnect: function() {
		this.updateButtonState();
	},

	// Update the button state
	updateButtonState: function () {

		if (window.location.hash !== '') {
			this.set('uploadFileButton', false);
			this.set('createFolderButton', false);
		} else {

			var pwd 	= Olympus.ui.fileSystem.pwd;
			var state 	= {
				// If no directory is active, the "upload file button" is always disabled if no directory is active
				// If they have *write* or *admin* privileges on pwd(), the button will appear
				uploadFileButton: pwd.canWrite(),

				// If no directory is active, then the current user MUST BE AN ADMIN to see this button
				// If they have *write* or *admin* privileges on pwd(), the button will appear

				// createFolderButton: pwd.canWrite() || _.isUndefined(Olympus.ui.fileSystem.pwd.get('id')) && Mast.Session.Account.isAdmin 
				createFolderButton: pwd.canWrite() 
			};

			this.set(state);
		}
	},

	searchUsers: function(){
		Mast.Session.term = $('input[name="search"]').val();
		Mast.Session.from_page = window.location.hash;
		console.log(Mast.Session.term);
		Mast.navigate('search');
	}

});
