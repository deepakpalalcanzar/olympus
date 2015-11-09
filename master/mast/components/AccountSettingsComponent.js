Mast.registerComponent('AccountSettingsComponent',{

	model: {
		selectedTab 	 : 'accountDetails',
		showSubscription : false,
		showSetting 	 : false
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
			}else if (newVal === 'accountAppearance') {
				this.$('li.accountAppearance').addClass('selected');
			}
			
		}
	},

	afterRender: function(){
		console.log(Mast.Session.Account);
		if(Mast.Session.Account.isAdmin && (Mast.Session.Account.isSuperAdmin === 1 || Mast.Session.Account.isSuperAdmin === null || Mast.Session.Account.isSuperAdmin===0)){
			this.set('showSetting', true);
			this.set('showSubscription', true);
		}else if (Mast.Session.Account.isEnterprise === 0){
			this.set('showSubscription', true);
		}
	},


// attach account details component to the account settings page region
	displayAccountDetails: function() {
		$('.upload-file').hide();
		this.attach('.account-settings-page', 'AccountDetails');
		this.set('selectedTab', 'accountDetails');
	},

// attach account password component to the account settings page region
	displayAccountPassword: function() {
		$('.upload-file').hide();
		this.attach('.account-settings-page', 'ChangePassword');
		this.set('selectedTab', 'accountPassword');
	},

	displayAccountNotifications: function() {
		$('.upload-file').hide();
		this.attach('.account-settings-page', 'EmailNotifications');
		this.set('selectedTab', 'accountNotifications');
	},

	displayAccountSettings: function() {
		$('.upload-file').hide();
		this.attach('.account-settings-page', 'SettingsComponent');
		this.set('selectedTab', 'settings');
	},

	displayAppearance: function() {
		$('.upload-file').hide();
		this.attach('.account-settings-page', 'AppearanceComponent');
		this.set('selectedTab', 'accountAppearance');
	},

// remove all selected classes from the list elemets.
	removeSelected: function($el) {
		this.$('li').removeClass('selected');
	},

	displaySubscribedPlan: function() {
		$('.upload-file').hide();
		this.attach('.account-settings-page', 'SubscriptionNotifications');
		this.set('selectedTab', 'accountSubscription');
	},

});
