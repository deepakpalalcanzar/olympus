Mast.components.SystemSettingsComponent  = Mast.Component.extend({
	
	template: '.system-settings-template',
	outlet: '#content',
	events: {
		// 'click .setting-save-button' : 'saveCompanyInfo',
		'click #saveDomain' : 'saveDomainInfo',
		'click #checkDatabase' : 'checkDatabase',
		'click #uploadSSL' : 'uploadSSL',
		'click #saveAdapter': 'saveAdapterInfo',
		'click #saveEmail'  : 'saveEmailInfo',
		'click #saveTrashSetting' : 'saveTrashSetting',
		'click #saveldapsettings' : 'saveLdapSettings',
		'change input[name="service_type"]' : 'toggleLdapSettings',
		'change input[name="adapter_type"]' : 'toggleAdapter',
		// 'click input[name="mail_service"]' : 'toggleMailService',
		'change input[name="mail_service"]' : 'toggleMailService',
		'change input[name="trash_setting"]' : 'toggleTrashSetting',
		'change input[name="disk_path"]' : 'checkdiskpath',
		'click .restart-server'					: 'restartServer',
		'click .update-code'					: 'updateCode',
		'click #checkforupdates' : 'checkForUpdates',
	},

	// saveCompanyInfo : function(){
	// 	alert("aaaaaaaaaaaaaaa");
	// }

	checkdiskpath: function(){
		console.log($('input[name="disk_adapter_path"]').val());
	},

	toggleAdapter : function(){
		console.log($('input[name="adapter_type"]:checked').val());
		if( $('input[name="adapter_type"]:checked').val() == 'Disk' ){
			$('#Disk_adapter_details').show();
			$('#S3_adapter_details').hide();
		}else{
			$('#Disk_adapter_details').hide();
			$('#S3_adapter_details').show();
		}
	},

	toggleMailService : function(){
		console.log($('input[name="mail_service"]:checked').val());
		if( $('input[name="mail_service"]:checked').val() == 'mandrill' ){
			$('#mandrill_details').show();
			$('#inernal_email_details').hide();
		}else{
			$('#mandrill_details').hide();
			$('#inernal_email_details').show();
		}
	},

	toggleLdapSettings : function(){
		console.log($('input[name="service_type"]:checked').val());
		if( $('input[name="service_type"]:checked').val() == '1' ){
			$('#ldap_details').show();
			$('#ad_details').hide();
		}else{
			$('#ldap_details').hide();
			$('#ad_details').show();
		}
	},

	toggleTrashSetting : function(){
		console.log($('input[name="trash_setting"]:checked').val());
		if( $('input[name="trash_setting"]:checked').val() == 'auto' ){
			$('#trash_auto_setting').show();
		}else{
			$('#trash_auto_setting').hide();
		}
	},

	uploadSSL : function(){
		//console.log($('#ssl_gd').prop('files')[0]);
		//alert('hi'+$('#ssl_gd').prop('files')[0]);

		if(!$('#ssl_gd').prop('files')[0])
		{
			alert('Select GD Bundle Crt file');
		}
		else if($('#ssl_gd').prop('files')[0].name != 'gd_bundle.crt')
		{
			alert('GD Bundle File Crt is invalid');
		}
		else if(!$('#ssl_olympus').prop('files')[0])
		{
			alert('Select Olympus Crt file');
		}
		else if($('#ssl_olympus').prop('files')[0].name != 'olympus.crt')
		{
			alert('Olympus Crt File is invalid');
		}
		else if(!$('#ssl_key').prop('files')[0])
		{
			alert('Select Olympus Key file');
		}
		else if($('#ssl_key').prop('files')[0].name != 'olympus.key')
		{
			alert('Olympus Key file is invalid');
		}
		else
		{
			var reader = new FileReader();
			var fileData;

			reader.onload = function(e) {
		    	Mast.Socket.request('/account/uploadSSL', {
					'formaction'		: 'uploadSSL',
					'uploadfile'		: 'uploadSSLGD',
					'ssl_gd'     : reader.result

				} , function(res, err){
					 if(err) alert(err);
					 else
					 {
					 	var reader1 = new FileReader();
						var fileData1;
						 reader1.onload = function(e) {
					    	Mast.Socket.request('/account/uploadSSL', {
								'formaction'		: 'uploadSSL',
								'uploadfile'		: 'uploadSSLOLYMPUS',
								'ssl_olympus'     : reader1.result

							} , function(res, err){
								 if(err) alert(err);
								 else
								 {
								 	var reader2 = new FileReader();
									var fileData2;

									 reader2.onload = function(e) {
									 	//console.log(reader2);
								    	Mast.Socket.request('/account/uploadSSL', {
											'formaction'		: 'uploadSSL',
											'uploadfile'		: 'uploadSSLKEY',
											'ssl_key'     : reader2.result

										} , function(res, err){
											 if(err) alert(err);
											 else
											 {
											 	alert('Successfully Uploaded');
											 }



								        });
								    }

								    reader2.readAsDataURL($('#ssl_key').prop('files')[0]);
								 }

								 

					        });
					    }

					    reader1.readAsDataURL($('#ssl_olympus').prop('files')[0]);
					 }
					 

		        });
		    }

		    reader.readAsDataURL($('#ssl_gd').prop('files')[0]);

			

		}


		


		
	},

	checkDatabase : function(){
		//console.log('hi');
		//alert('hi');

		Mast.Socket.request('/account/checkDatabase', {
				'formaction'		: 'checkDatabase',
				'host'     : $('#database_host').val(),
				'user'     : $('#database_user').val(),
				'password' : $('#database_pass').val(),
				'database' : $('#database_name').val()

			} , function(res, err){
				 console.log(res);
				 if(err) alert(err);
				 //else
				 $('#saveDatabase').hide();
				 if(res.error)
				 	alert('Connection Not ready. Error : '+res.error);
				 else if(res == 200)
				 {
				 	alert('Database Settings Successfully changed');
				 	//$('#saveDatabase').show();
				 }				 	
				 else
				 	alert('Some Error');
				// if((typeof res.status != 'undefined') && res.status == 'ok'){
				// 	$('#adapter_type').html($('#adapter_type').val());
				// 	alert('Ldap/AD Settings Updated.')
				// }else if(typeof res.error != 'undefined'){
				// 	alert(res.error);
				// }else{
				// 	alert('Some error occurred.');
				// }
	        });


		
	},

	saveDomainInfo : function(){

		//Regex for domain without any protocol(http:// or https://)
		var patt = new RegExp(/^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i);
		// var is_valid_domain = patt.test($('#domainname').val());
		
		if( ( $('#domainname').val() == 'localhost' ) || patt.test($('#domainname').val()) ){

			if(confirm('Olympus configuration will be mapped to given domain. You will be required to restart forevers(app.js and olympus.js) on your server after the process. Are you sure you want to continue?')){
				Mast.Socket.request('/account/changeDomainname', {
					'formaction'	: 'save_domain_info',
					'newdomain' 	: $('#domainname').val(),
				} , function(res, err){
					// console.log(res);
					if((typeof res.status != 'undefined') && res.status == 'ok'){
						$('#domaininfo').html($('#domainname').val());
						alert('Domain updated successfully. Now restart forevers.')
					}else if(typeof res.error != 'undefined'){
						alert(res.error);
					}else{
						alert('Some error occurred.');
					}
		        });
		    }
	    }else{
	    	alert('Domain should be like www.domain.com or \'localhost\'.');
	    }
	},

	restartServer: function(){
		if(confirm('Are you sure you want to restart the olympus server?')){
			console.log('sending request to restart the server.');
			Mast.Socket.request('/account/restartServer', {
				'formaction'		: 'restart-server'
			} , function(res, err){
				alert(err);
				// console.log(res);
				if( (typeof res.status != 'undefined') ){
					if( res.status == 'ok'){
						//Server would have restarted successfully
					}else if (res.status == 'restarterror'){
						console.log(res.message);
						alert('Some error occurred in restarting the server.');
					}
				}else if(typeof res.error != 'undefined'){
					console.log(res.error);
					alert('Some error occurred in restarting the server.');
				}else{
					alert('Some error occurred in restarting the server.');
				}
	        });
	        setTimeout(function(){
	         window.location.href = "https://"+$('#domaininfo').html(); }, 6000);
	    }
	},

	updateCode: function(){
		if(confirm('Are you sure you want to update the olympus code?')){
			console.log('sending request to update the code.');
			Mast.Socket.request('/account/updateCode', {
				'formaction'		: 'update-code'
			} , function(res, err){
				alert(err);
				// console.log(res);
				if( (typeof res.status != 'undefined') ){
					if( res.status == 'ok'){
						//Server would have restarted successfully
					}else if (res.status == 'githuberror'){
						console.log(res.message);
						alert('Some error occurred in updating the code.');
					}
				}else if(typeof res.error != 'undefined'){
					console.log(res.error);
					alert('Some error occurred in updating the code.');
				}else{
					alert('Some error occurred in updating the code.');
				}
	        });
	        // setTimeout(function(){
	        //  window.location.href = "https://"+$('#domaininfo').html(); }, 6000);
	    }
	},

	checkForUpdates: function(){

		function replaceAll(strng, search, replacement) {
		    return strng.replace(new RegExp(search, 'g'), replacement);
		}

		var organization 	= $('#git-organization').val();
		var username 	= $('#git-username').val();
		var password 	= $('#git-password').val();
		var repo 	= $('#git-repo').val();

		function replaceChars(organization){
			organization = replaceAll(organization,'@','%40');
			organization = replaceAll(organization,"'","%27");
			organization = replaceAll(organization,'/','%2F');
			organization = replaceAll(organization,':','%3A');
			return organization;
		}

		organization = replaceChars(organization);
		username = replaceChars(username);
		password = replaceChars(password);
		repo = replaceChars(repo);

		

		Mast.Socket.request('/account/checkForUpdates', {
			'formaction'		: 'check-for-updates',
			'organization' 	: organization,
			'username' 	: username,
			'password' 	: password,
			'repo' 	: repo,
		} , function(res, err){
			//alert(err);
			// console.log(res);
			if( (typeof res.status != 'undefined') ){
				if( res.status == 'ok'){
					//alert(res.currcommit.trim()+'hi'+res.avcommit.trim()+'hi1');
					if(res.currcommit.trim() == res.avcommit.trim())
	                {
	                    alert('No updates Available.');
	                    alert('I have updated some text to check updates');
	                    //return res.json({ status: 'noupdates'}, 200);
	                }
	                else
	                {
	                	//remote changes 1 2
	                    //alert('I have updated some text to check updates');
	                    //return res.json({ status: 'updatesavailable'}, 200);
	                    if(confirm('Updates available. Do you want to update the source code?')){
							console.log('sending request to update the code.');
							Mast.Socket.request('/account/updateCode', {
								'formaction'		: 'update-code',
								'organization' 	: organization,
								'username' 	: username,
								'password' 	: password,
								'repo' 	: repo,
							} , function(res, err){
								//alert(err);
								// console.log(res);
								if( (typeof res.status != 'undefined') ){
									if( res.status == 'ok'){
										//Server would have restarted successfully
										alert('Code Updated Successfully. Please restart the server to apply changes');
									}else if (res.status == 'githuberror'){
										console.log(res.message);
										alert('Some error occurred in updating the code.');
									}
								}else if(typeof res.error != 'undefined'){
									console.log(res.error);
									alert('Some error occurred in updating the code.');
								}else{
									alert('Some error occurred in updating the code.');
								}
					        });
					        // setTimeout(function(){
					        //  window.location.href = "https://"+$('#domaininfo').html(); }, 6000);
					    }
	                }
					//Server would have restarted successfully
				}else if (res.status == 'githuberror'){
					console.log(res.message);
					alert('Some error occurred.');
				}
			}else if(typeof res.error != 'undefined'){
				console.log(res.error);
				alert('Some error occurred.');
			}else{
				alert('Some error occurred.');
			}
        });
		
	},

	saveLdapSettings: function(){

		var server_ip = org_unit = basedn = ldap_admin = ldap_pass = ldap_create_user = '';
		var ldap_enabled 		= $('input[name="ldap_enbled"]').is(':checked');
		var service_type 		= $('input[name="service_type"]:checked').val();

		console.log(service_type);

		if(service_type == '1'){
			server_ip 			= $("input[name='server_ip']").val();
			org_unit 			= $("input[name='org_unit']").val();
			basedn 				= $("input[name='basedn']").val();
			ldap_admin 			= $("input[name='ldap_admin']").val();
			ldap_pass 			= $("input[name='ldap_pass']").val();
			ldap_create_user 	= $("input[name='ldap_create_user']").is(':checked');
		}else{
			server_ip 			= $("input[name='server_ip_ad']").val();
			// org_unit 			= $("input[name='org_unit']").val();
			basedn 				= $("input[name='basedn_ad']").val();
			ldap_admin 			= $("input[name='ldap_admin_ad']").val();
			ldap_pass 			= $("input[name='ldap_pass_ad']").val();
			// ldap_create_user 	= $("input[name='ldap_create_user']").is(':checked');
		}

		if( ldap_enabled && (service_type == '1') && (server_ip.trim() == '' || org_unit.trim() == '' || basedn.trim() == '' || ldap_admin.trim() == '' || ldap_pass.trim() == '' )){
			alert('Please enter LDAP details.');
			return false;
		}else if( ldap_enabled && (service_type == '2') && (server_ip.trim() == '' || basedn.trim() == '' || ldap_admin.trim() == '' || ldap_pass.trim() == '' )){
			alert('Please enter AD details.');
			return false;
		}
		console.log('proceeding...');

			Mast.Socket.request('/account/changeLdapSetting', {
				'formaction'		: 'save_ldap_info',
				'ldap_enabled'		: ldap_enabled,
				'service_type'		: service_type,
				'server_ip'			: server_ip,
				'org_unit'			: org_unit,
				'basedn'			: basedn,
				'ldap_admin'		: ldap_admin,
				'ldap_pass'			: ldap_pass,
				'ldap_create_user'	: ldap_create_user,
			} , function(res, err){
				// console.log(res);
				if((typeof res.status != 'undefined') && res.status == 'ok'){
					$('#adapter_type').html($('#adapter_type').val());
					alert('Ldap/AD Settings Updated.')
				}else if(typeof res.error != 'undefined'){
					alert(res.error);
				}else{
					alert('Some error occurred.');
				}
	        });
	},

	saveAdapterInfo : function(){

		var adapter_type = $('input[name="adapter_type"]:checked').val();
		var diskpath = $("input[name='disk_path']").val();
		var S3access = $("input[name='S3_access']").val();
		var S3secret = $("input[name='S3_secret']").val();
		var S3bucket = $("input[name='S3_bucket']").val();
		var S3region = $("input[name='S3_region']").val();

		if( adapter_type == 'Disk' ){

			if( diskpath.trim() == ''){
				alert('Please enter valid disk path.');
				return false;
			}

		}else if( adapter_type == 'S3' ){

			if( S3access.trim() == '' || S3secret.trim() == '' || S3bucket.trim() == '' || S3region.trim() == '' ){
				alert('Please enter S3 details.');
				return false;
			}

			// if(isNaN( smtpPort.trim())){
			// 	alert('Please enter Smtp details.');
			// 	return false;
			// }

		}else{
			alert('please select adapter type.');
			return false;
		}
		console.log('proceeding...');

			Mast.Socket.request('/account/changeAdapterSetting', {
				'formaction'	: 'save_adapter_info',
				'adapter_type': adapter_type,
				'diskpath': diskpath,
				'S3access': S3access,
				'S3secret': S3secret,
				'S3bucket': S3bucket,
				'S3region': S3region,
			} , function(res, err){
				// console.log(res);
				if((typeof res.status != 'undefined') && res.status == 'ok'){
					$('#adapter_type').html($('#adapter_type').val());
					alert('Adapter Settings Updated.')
				}else if(typeof res.error != 'undefined'){
					alert(res.error);
				}else{
					alert('Some error occurred.');
				}
	        });
	},

	saveEmailInfo : function(){

		var emailService = $('input[name="mail_service"]:checked').val();
		var mandrillKey  = $("input[name='mandrill_key']").val();
		var smtpHost = $("input[name='smtp_host']").val();
		var smtpPort = $("input[name='smtp_port']").val();
		var smtpUser = $("input[name='smtp_user']").val();
		var smtpPass = $("input[name='smtp_pass']").val();

		if( emailService == 'mandrill' ){

			if( mandrillKey.trim() == ''){
				alert('Please enter your mandrill api key.');
				return false;
			}

		}else if( emailService == 'internal' ){

			if( smtpHost.trim() == '' || smtpPort.trim() == '' || smtpUser.trim() == '' || smtpPass.trim() == '' ){
				alert('Please enter Smtp details.');
				return false;
			}

			if(isNaN( smtpPort.trim())){
				alert('Please enter Smtp details.');
				return false;
			}

		}else{
			alert('please select a mail service.');
			return false;
		}
		console.log('proceeding...');

			Mast.Socket.request('/account/changeDomainname', {
				'formaction'	: 'save_email_info',
				'mail_service': emailService,
				'mandrill_key': mandrillKey,
				'smtp_host': smtpHost,
				'smtp_port': smtpPort,
				'smtp_user': smtpUser,
				'smtp_pass': smtpPass,
			} , function(res, err){
				// console.log(res);
				if((typeof res.status != 'undefined') && res.status == 'ok'){
					$('#domaininfo').html($('#domainname').val());
					alert('Email Settings Updated.')
				}else if(typeof res.error != 'undefined'){
					alert(res.error);
				}else{
					alert('Some error occurred.');
				}
	        });
	},

	saveTrashSetting : function(){

		var trash_setting 		= $('input[name="trash_setting"]:checked').val();
		var days  				= $('select[name="trash_setting_days"]').val();
console.log(trash_setting);
console.log(days);
		/*if( trash_setting == 'auto' ){

			if( !isNaN(days) && parseInt(Number(days)) == days && !isNaN(parseInt(days, 10)) ){
				//is Int
			}else{
				alert('Please enter number only.');
				return false;
			}

		}*/
		console.log('proceeding...');

			Mast.Socket.request('/account/changeDomainname', {
				'formaction'		: 'save_trash_setting',
				'trash_setting'		: trash_setting,
				'trash_setting_days': days
			} , function(res, err){
				console.log(res);
				if((typeof res.status != 'undefined') && res.status == 'ok'){
					$('#domaininfo').html($('#domainname').val());
					alert('Trash Settings Updated.')
				}else if(typeof res.error != 'undefined'){
					alert(res.error);
				}else{
					alert('Some error occurred.');
				}
	        });
	}

});