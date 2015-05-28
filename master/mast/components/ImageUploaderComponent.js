Mast.registerComponent('ImageUploaderComponent', {

	model: {
		uploading: false
	},

	template: '.image-uploader-template',

	regions: {
		'.uploader': 'Uploader'
	},

	bindings: {
		uploading: function(newVal) {
			if (newVal) {
				this.$('.loading-spinner').show();
			} else {
				this.$('.loading-spinner').hide();
			}
		}
	},

	init: function(){
		var self = this;
		this.on('addFile',function(files){
			self.set('uploading',true);
			self.uploadImage();
		});

		this.on('uploadComplete',this.afterUpload);
	},

	// Gives permission for upload process to take place
	uploadImage: function() {
		this.children['.uploader'].trigger('submit');
	},

	// Sets uploading to false which will stop the spinner when the file is uploaded
	afterUpload: function (data) {
		var self = this;
		this.$('.loading-spinner').hide();
		if (data.success == false) {
			switch (data.error) {
				case 'toobig':
					alert('The file you uploaded was too big.  Please limit files to 5 megabytes.');
					break;
				default:
					alert('An error occurred; please try again later.');
					break;
			}
		} else {
			// Set the avatar image source to the new image.
			this.$('.profile-pic').attr('src',data.url);
			// Set a callback for when the avatar finishes downloading, so that we can show the loading spinner until then.
			if (this.$('.profile-pic').imagesLoaded) {
				this.$('.profile-pic').imagesLoaded({done:function($images){self.set('uploading',false);}});
			}
		}
	}


});