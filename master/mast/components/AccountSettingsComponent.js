Mast.registerComponent('AccountSettingsComponent',{

	model: {
		selectedTab 	 : 'accountDetails',
		showSystemSetting: false,
		showSubscription : false,
		showSetting 	 : false
	},

	template: 	'.account-settings-template',
	outlet: 	'#content',
	
	events: {
		'click a.account-details'      : 'displayAccountDetails',
		'click a.account-password'     : 'displayAccountPassword',
		'click a.account-notifications': 'displayAccountSettings',//'displayAccountNotifications',
		'click a.account-subscription' : 'displaySubscribedPlan',
		'click a.system-settings' 	   : 'displaySystemSettings'
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
		// console.log(Mast.Session.Account);
		// if(Mast.Session.Account.isAdmin && (Mast.Session.Account.isSuperAdmin === 1 || Mast.Session.Account.isSuperAdmin === null || Mast.Session.Account.isSuperAdmin===0))
		if(Mast.Session.Account.isAdmin || Mast.Session.Account.isSuperAdmin === 1)
		{
			$('#domainname').val($('#domaininfo').html());//Rishabh
			// $('#mail_service').val($('#emailservice').html());
			$('input[name="mail_service"][value="' + $('#emailservice').html() + '"]').prop('checked', true);
			if($('#emailservice').html() == 'mandrill'){
				$('#mandrill_details').show();
				$('#inernal_email_details').hide();
			}else{
				$('#mandrill_details').hide();
				$('#inernal_email_details').show();
			}

			// console.log($('input[name="mail_service"]').val());

			$('#mandrill_key').val($('#mandrillkey').html());
			$('#smtp_host').val($('#smtphost').html());
			$('#smtp_port').val($('#smtpport').html());
			$('#smtp_user').val($('#smtpuser').html());
			$('#smtp_pass').val($('#smtppass').html());

			$('input[name="trash_setting"][value="' + $('#trashopt').html() + '"]').prop('checked', true);

			if($('#trashopt').html() == 'auto'){
				$('#trash_auto_setting').show();
				trashoptdays = $('#trashoptdays').html();
				$('#trash_setting_days').val(trashoptdays);
				$('#trash_setting_days option[value='+trashoptdays+']').attr('selected','selected');
			}else{
				$('#trash_auto_setting').hide();
			}

			$('.adapter-mod').hide();
			Mast.Socket.request('/uploadpaths/getCurrentAdapter', {}, function (res, err) {
				if(err || res.success == false){
					console.log(err || res.error);
					return;
				}

				$('input[name="adapter_type"][value="' + res.adapter.type + '"]').prop('checked', true);
				$('#Disk_adapter_details span b').html(''+res.adapter.path);
				$('#S3_access').val(res.adapter.accessKeyId);
				$('#S3_secret').val(res.adapter.secretAccessKey);
				$('#S3_bucket').val(res.adapter.bucket);
				$('#S3_region').val(res.adapter.region);
				if(res.adapter.type == 'Disk'){
					$('#Disk_adapter_details').show();
					$('#S3_adapter_details').hide();
				}else{//S3
					$('#Disk_adapter_details').hide();
					$('#S3_adapter_details').show();
				}
				$('.adapter-mod').show();
			});

			this.set('showSystemSetting', true);
			this.set('showSetting', true);
			// this.set('showSubscription', true);//no subscription aplies to superadmin
		}else if (Mast.Session.Account.isEnterprise === 1){
			this.set('showSetting', true);
			this.set('showSystemSetting', false);
			this.set('showSubscription', true);
		}else if (Mast.Session.Account.isEnterprise === 0){
			this.set('showSetting', false);
			this.set('showSystemSetting', false);
			this.set('showSubscription', true);
		}
		//show to all
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

	displaySystemSettings: function() {
		$('.upload-file').hide();
		this.attach('.account-settings-page', 'SystemSettingsComponent');
		this.set('selectedTab', 'systemSettings');
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
