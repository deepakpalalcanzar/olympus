Mast.registerComponent('AccountSettingsComponent',{

	model: {
		selectedTab 	 : 'accountDetails',
		showPassword	 : false,
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
		'click a.system-settings' 	   : 'displaySystemSettingsDomain',//'displaySystemSettings',
		'click a.system-domain' 	   : 'displaySystemSettingsDomain',
		'click a.system-adapter' 	   : 'displaySystemSettingsAdapter',
		'click a.system-email' 	   	   : 'displaySystemSettingsEmail',
		'click a.system-trash' 	   	   : 'displaySystemSettingsTrash',
		'click a.system-ldap' 	   	   : 'displaySystemSettingsLdap'
	},

	bindings: {
		// set the selected tab arrow to this el.
		selectedTab: function(newVal) {

			this.removeSelected();
			$('.systemPages').hide();

			if (newVal === 'accountDetails') {
				this.$('li.accountDetails').addClass('selected');
			} else if (newVal === 'accountPassword') {
				this.$('li.accountPassword').addClass('selected');
			} else if (newVal === 'accountNotifications') {
				this.$('li.accountNotifications').addClass('selected');
			}else if (newVal === 'accountSubscription') {
				this.$('li.accountSubscription').addClass('selected');
			}else if (newVal === 'settings') {
				this.$('li.settings').addClass('selected');
			}else if (newVal === 'systemSettings') {
				$('.systemPages').show();
				this.$('li.systemSettings').addClass('selected');
			}else if (newVal === 'accountAppearance') {
				this.$('li.accountAppearance').addClass('selected');
			}
		}
	},

	afterRender: function(){
		this.set('showPassword', true);
		// if(Mast.Session.Account.isAdmin && (Mast.Session.Account.isSuperAdmin === 1 || Mast.Session.Account.isSuperAdmin === null || Mast.Session.Account.isSuperAdmin===0))
		if(Mast.Session.Account.isSuperAdmin === 1)//Mast.Session.Account.isAdmin || 
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
				// $('.adapter-mod').show();
			});

			Mast.Socket.request('/sitesettings/getLdapSettings', {}, function (res, err) {
				if(err || res.success == false){
					console.log(err || res.error);
					return;
				}

				if(res.ldapopt.ldapOn == '1'){
					$('input[name="ldap_enbled"]').prop('checked', true);	
				}
				$('input[name="service_type"][value="' + res.ldapopt.ServiceType + '"]').prop('checked', true);

				if(res.ldapopt.ServiceType == '1'){

					$('#ldap_details').show();
					$('#ad_details').hide();

					$('#server_ip').val(res.ldapopt.ldapServerIp);
					$('#org_unit').val(res.ldapopt.ldapOU);
					$('#basedn').val(res.ldapopt.ldapBaseDN);
					$('#ldap_admin').val(res.ldapopt.ldapAdmin);
					$('#ldap_pass').val(res.ldapopt.ldapPassword);
				}else if(res.ldapopt.ServiceType == '2'){

					$('#ldap_details').hide();
					$('#ad_details').show();

					$('#server_ip_ad').val(res.ldapopt.ldapServerIp);
					// $('#org_unit').val(res.ldapopt.ldapOU);
					$('#basedn_ad').val(res.ldapopt.ldapBaseDN);
					$('#ldap_admin_ad').val(res.ldapopt.ldapAdmin);
					$('#ldap_pass_ad').val(res.ldapopt.ldapPassword);
				}else{
					$('#ldap_details').hide();
					$('#ad_details').hide();
				}
				
				if(res.ldapopt.ldapCreateUser == '1'){
					$('input[name="ldap_create_user"]').prop('checked', true);	
				}
				// $('.adapter-mod').show();
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
			if(Mast.Session.Account.isLdapUser || Mast.Session.Account.isADUser){
				this.set('showPassword', false);
			}
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
		$('.system-settings-template > div').hide();

		$('.domain-mod').show();

		this.attach('.account-settings-page', 'SystemSettingsComponent');
		this.set('selectedTab', 'systemSettings');
	},

	displaySystemSettingsDomain: function() {

		$('.upload-file').hide();
		$('.system-settings-template > div').hide();

		$('.domain-mod').show();

		// this.attach('.account-settings-page', 'SystemSettingsComponent');
		// this.set('selectedTab', 'systemSettings');
	},

	displaySystemSettingsAdapter: function() {

		$('.upload-file').hide();
		$('.system-settings-template > div').hide();

		$('.adapter-mod').show();

		// this.attach('.account-settings-page', 'SystemSettingsComponent');
		// this.set('selectedTab', 'systemSettings');
	},

	displaySystemSettingsEmail: function() {

		$('.upload-file').hide();
		$('.system-settings-template > div').hide();

		$('.email-mod').show();

		// this.attach('.account-settings-page', 'SystemSettingsComponent');
		// this.set('selectedTab', 'systemSettings');
	},

	displaySystemSettingsTrash: function() {

		$('.upload-file').hide();
		$('.system-settings-template > div').hide();

		$('.trash-mod').show();

		// this.attach('.account-settings-page', 'SystemSettingsComponent');
		// this.set('selectedTab', 'systemSettings');
	},

	displaySystemSettingsLdap: function() {

		$('.upload-file').hide();
		$('.system-settings-template > div').hide();

		$('.ldap-mod').show();

		// this.attach('.account-settings-page', 'SystemSettingsComponent');
		// this.set('selectedTab', 'systemSettings');
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
