Mast.registerComponent('AccountSettingsComponent',{

	model: {
		selectedTab: 'accountDetails'
	},

	template: 	'.account-settings-template',
	outlet: 	'#content',
	
	events: {
		'click a.account-details'      : 'displayAccountDetails',
		'click a.account-password'     : 'displayAccountPassword',
		'click a.account-notifications': 'displayAccountNotifications',
		'click a.account-subscription': 'displaySubscribedPlan'
	},

	bindings: {
		// set the selected tab arrow to this el.
		selectedTab: function(newVal) {
			this.removeSelected();
			if (newVal === 'accountDetails') {
				this.$('li.accountDetails').addClass('selected');
			} else if (newVal === 'accountPassword') {
				this.$('li.accountPassword').addClass('selected');
			} else if (newVal === 'accountNotifications') {
				this.$('li.accountNotifications').addClass('selected');
			}else if (newVal === 'accountSubscription') {
				this.$('li.accountSubscription').addClass('selected');
			}
		}
	},

// attach account details component to the account settings page region
	displayAccountDetails: function() {
		this.attach('.account-settings-page', 'AccountDetails');
		this.set('selectedTab', 'accountDetails');
	},

// attach account password component to the account settings page region
	displayAccountPassword: function() {
		this.attach('.account-settings-page', 'ChangePassword');
		this.set('selectedTab', 'accountPassword');
	},

	displayAccountNotifications: function() {
		this.attach('.account-settings-page', 'EmailNotifications');
		this.set('selectedTab', 'accountNotifications');
	},

	displayAccountSettings: function() {
		this.attach('.account-settings-page', 'SettingsComponent');
		this.set('selectedTab', 'settings');
	},

// remove all selected classes from the list elemets.
	removeSelected: function($el) {
		this.$('li').removeClass('selected');
	},

	displaySubscribedPlan: function() {
		this.attach('.account-settings-page', 'SubscriptionNotifications');
		this.set('selectedTab', 'accountSubscription');
	},

});
