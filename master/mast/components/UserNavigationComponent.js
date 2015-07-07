Mast.registerComponent('UserNavigationComponent', {

	template: '.user-nav-template',
	outlet  : '#user-nav-outlet',
	model: 'UserNavigation',
	autoRender: false,


	beforeRender:function() {
		Mast.Socket.request('/account/getImage', { pic_type: 'profile'}, function(res, err, next) {
			if(res.avatar !== '' && res.avatar!== null){
				$('.user-avatar').attr('src', "/images/profile/"+res.avatar);			
			}
		});
	},

	afterRender: function() {

		var d = this.get('dropdownItems');
		Olympus.ui.fileSystem.on('cd', this.updateButtonState);
		Mast.Socket.request('/account/getImage', { pic_type: 'profile'}, function(res, err, next) {
			if(res){
				if(res.enterprise!=1){
					d.splice('2', '1');
					$('.settings').remove();
				}
				if(res.avatar !== '' && res.avatar!== null){
					$('.user-avatar').attr('src', "/images/profile/"+res.avatar);			
				}
			}
		});

	},

	events: {
		'click .dropdown-button': 'showDropdown'
	},

	// create global dropdown instance and place it at the drop down button
	// on the user navigation component
	showDropdown: function(e) {
		Olympus.util.dropdownHelper.showDropdownAt(this.$(".dropdown-button"),-126,25,e,this,this.get('dropdownItems'));
	},

	// navigate to the acounts detail page
	viewProfile: function() {
		Mast.navigate('#account/details');
	},

	password: function() {
		Mast.navigate('#account/password');
	},

	notifications: function() {
		Mast.navigate('#account/notifications');
	},

	settings: function(){
		Mast.navigate('#account/settings');
	},
	// Sign out of the session
	signOut: function() {
		window.location = 'auth/logout';
	},

	// When the session information from the server is available
	afterConnect: function() {
		this.set(Mast.Session.Account);
	},

	subscription: function() {
		Mast.navigate('#account/subscription');
	},

});
