Mast.registerComponent('UserNavigationComponent', {

	template: '.user-nav-template',
	outlet  : '#user-nav-outlet',
	model: 'UserNavigation',
	autoRender: false,

	afterRender: function() {
		Olympus.ui.fileSystem.on('cd', this.updateButtonState);
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