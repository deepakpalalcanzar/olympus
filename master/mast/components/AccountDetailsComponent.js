Mast.registerComponent('AccountDetails', {

	model: {
		name : 'Enter your Name',
		phone: 'Enter your phone number',
		email: 'Enter your email',
		title: 'Enter your title'
	},

	template: '.account-details-template',

	events: {
		'click .submit-details': 'updateAccountDetails',
		'click input': 'selectText',
		'click .delete-account': 'deleteAccount',
	},

	regions: {
		'.image-uploader': 'ImageUploaderComponent'
	},

	afterCreate: function () {
		// On tablet, hide the upload logo option
		if (Mast.isTouch) {
			this.$('.change-profile-pic').remove();
		}
	},

	// set model to the mast session account attributes. Useful for placing the attributes as
	// placeholder text.
	afterConnect: function() {
		this.set(Mast.Session.Account);
	},

	afterRender: function(){		
		// Set uploader endpoint.
		this.children['.image-uploader'].children['.uploader'].set('endpoint','/account/imageUpload');
		this.$('.profile-pic').attr('src','/account/avatar');
	},

	updateAccountDetails: function() {
		var self = this;
		var payload = this.getPayload();
		/*Mast.Socket.request('/account/update', payload, function(){
			alert('Your account has been updated.');
		});*/

                 /*$.get("https://ipinfo.io", function(response) {
            	 payload.ipadd =response.ip;*/
            	 Mast.Socket.request('/account/update', payload, function(){
			alert('Your account has been updated.');
		    });
          	/* }, "jsonp");*/

	},

// get account details payload and return that object
	getPayload: function() {
		var name, email, title, phone;
		return {
			name : this.$('input[name="name"]').val(),
			email: this.$('input[name="email"]').val(),
			title: this.$('input[name="title"]').val(),
			phone: this.$('input[name="phone"]').val()
		};
	},

	emptyForm: function() {
		this.$('input[name="name"]').val('');
		this.$('input[name="email"]').val('');
		this.$('input[name="title"]').val('');
		this.$('input[name="phone"]').val('');
	},

	selectText: function(e) {
		$(e.currentTarget).select();
	},

	deleteAccount: function(){
		var self = Mast.Session.Account;
		console.log(self);
		if(confirm('Are you sure ?')){
			Mast.Socket.request('/account/delOwnAccount', { id: self.id}, function(res, err){
				console.log(res);			
				if(res){
					window.location = 'auth/logout';
				}
			});
		}
	},

});
