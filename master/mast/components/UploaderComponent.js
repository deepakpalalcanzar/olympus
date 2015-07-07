/**
 * events emitted:
 * 	- addFile -
 * 	- uploadComplete -
 *
 * listens to:
 *  - submit -
*/

Mast.registerComponent('Uploader',{
	
	model : {
		endpoint: ''
	},
	template: '.template-uploader',
	
	init: function () {
		this.on('submit',this.beforeSubmit);
	},
	
	afterRender: function() {
		var self = this;
		// initialize fileuploader plugin on input element
		this.$('input').fileupload({
			


			progress: function(e, data) {
				if (self.formData) {
                			data.parentId = self.formData.id
    				}
                		Mast.trigger('UPLOAD_PROGRESS', data);
            		},

			// Assign add event.
			add: function(e, data) {
				if (self.parent.get('uploading')) {
					return false;
				}

				// Save collection of files in component
				self.files = data.files;
				
				// Trigger add file event to parent
				self.parent.trigger('addFile', self.files);
				
				// Increment global file count
				// (this is a hack!)
				Mast._uploadingFiles = (Mast._uploadingFiles || 0)+1;
				
				if (Mast._uploadingFiles === 1) {
					window.onbeforeunload = function(e) {
					  return 'You have a pending file upload in progress.  If you close this tab, you\'ll cancel that upload.';
					};
				}
			},

			error: function(err) {
				console.log(err);
				var msg;
				try {
					msg = JSON.parse(err.responseText).error;
					console.log(msg);
				} 
				catch(e) {
					msg = null;
				}

				if (msg == "reached maxUploadSize") {
					alert('Sorry, your quota for that directory has been reached.');
				} else if(msg == 'FileExist'){
					//fsx.unlink('/var/www/olympus/api/files/'+file.extra.fsName);
					//alert('File you are trying to uplaod already exists.');
				}else{
					alert('Sorry, an error occurred.  Please try again.');
				}

				Mast._uploadingFiles--;
				if (Mast._uploadingFiles <= 0) {
					window.onbeforeunload = undefined;
				}					

		        Mast.trigger('CANCEL_UPLOAD', {
		            files: self.files,
		            id: self.formData.id
    			});				

			},
			// Bind afterUpload method for when upload completes
			done: this.afterUpload
		});
	},
	
// Upload the files to the server, if any exist

	beforeSubmit: function (formData) {

        this.formData = formData;
		var encodedFormData = {
			data: JSON.stringify(formData)
		};
// Because of weird stringification requirement of blueimp, add id to top level (so built-in auth works)
		if (formData && formData.id) {
			encodedFormData.id = formData.id;
		}
			
// If no files have been added, do nothing
		if (this.files) {
			this.$("input").fileupload("send",{
				files: this.files,
// Pass the parent directory
				formData: encodedFormData
			});
		}

		console.log(formData);
		if (formData) {
        	Mast.trigger('NEW_UPLOADING_CHILD', {
            	files: this.files,
            	id: formData.id
        	});
		}
	},
	
	// Called when upload is complete
	afterUpload: function (e,data) {
		
		Mast._uploadingFiles--;
		if (Mast._uploadingFiles <= 0) {
			window.onbeforeunload = undefined;
		}
		this.parent.trigger('uploadComplete',data.result);
            var filename = data.result.entries.name;
          
             Mast.Socket.request('/account/createuploadlog',{name:filename}, function(res, err){
			if(res){
				Mast.navigate('#');
			}
			
		  }); 


                var newtest = data.result;

                

	}
});
