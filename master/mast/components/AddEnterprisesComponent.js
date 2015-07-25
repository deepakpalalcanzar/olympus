Mast.registerComponent('AddEnterprisesComponent',{

	template: '.add-enterprises-template',
	outlet: '#content',
	events:{
		'click .add-enterprises': 'addEnterprise',
		'blur  .email'			: 'checkForEmail',
	},
	
	addEnterprise: function(){

		var self = this;
		var entData = this.getFormData();
	  	Mast.Socket.request('/enterprises/getQuota', {sub_id:entData.subscription}, function(reso, erro){
			entData.quota = ""+ reso[0].quota +"";
			if(reso){
				if(self.validateForm()){
					Mast.Socket.request('/enterprises/register', entData, function(res, err){
						if(res){

							if(res.id && res.error){
                                var accData = {
									account_id  : res.id,
							 		subscription_id	: entData.subscription,
								};
								Mast.Socket.request('/enterprises/updateUserAccount', accData, function(respo, erro){
									if(respo){
									}
								});
							}

							var data = {
								name    		:  entData.owner_name,
								error			:  res.error,
								quota			:  entData.quota,
								account_id 		:  res.error?res.id:res.account.id,
							 	enterprises_name:  entData.name,
							 	sub_id			:  entData.subscription // for transactiondetails
							}
                            
                            Mast.Socket.request('/enterprises/create', data, function(response, error){
								if(response){
									self.clearForm();
									alert('Account created successfully.');
									Mast.navigate('enterprises');
								}
							});	
                        }
					});	
				}
			}
		});
	},

	getFormData:function(){
		var name, email, password,subscription;
		return {
			name 	 		: this.$('input[name="enterprises_name"]').val(),
			owner_name 	 	: this.$('input[name="owner_name"]').val(),
			email	 		: this.$('input[name="email"]').val(),
			password		: this.$('input[name="password"]').val(),
			subscription 	: this.$('select[name="subscription"]').val(),
		};
	},

	clearForm: function(){
		this.$('input[name="enterprises_name"]').val('');
		this.$('input[name="owner_name"]').val('');
		this.$('input[name="email"]').val('');
		this.$('input[name="password"]').val('');
	},

	validateForm: function(){

		$(".enterprise_name .error_span").remove();
		$(".owner_name .error_span").remove();
		$(".password .error_span").remove()
		$(".confirmPassword .error_span").remove()

    	$(".enterpriseName").css({ "border" : "1px solid #d7dbdc" });
    	$(".ownerName").css({ "border" : "1px solid #d7dbdc" });
    	$(".enter_password").css({ "border" : "1px solid #d7dbdc" });
    	$(".confirm_password").css({ "border" : "1px solid #d7dbdc" });

		if (this.$('input[name="enterprises_name"]').val() === '') {

			$(".enterprise_name").append("<span class='error_span'> Please enter a enterprise name. </span>");
    		$(".enterpriseName").css({ "border" : "1px solid red" });
			return false;

		}else if(this.$('input[name="owner_name"]').val() === ''){

			$(".owner_name").append("<span class='error_span'> Please enter a owner name. </span>");
    		$(".ownerName").css({ "border" : "1px solid red" });
			return false;

		}else if(this.$('input[name="password"]').val() === ''){
			
			if($(".password").attr('style') !== 'display: none;'){
				$(".password").append("<span class='error_span'> Please enter a password. </span>");
	    		$(".enter_password").css({ "border" : "1px solid red" });
				return false;
			}

		}else if(!this.isValidPassword()){

			if($(".confirmPassword").attr('style') !== 'display: none;'){
				$(".confirmPassword").append("<span class='error_span'> Confirm password does not match. </span>");
	    		$(".confirm_password").css({ "border" : "1px solid red" });
				return false;
			}

			return false;

		}else{
			return true;
		}
	},

	isValidPassword: function() {
		var password, checkPassword;
		password      = this.$('input[name="password"]').val();
		checkPassword = this.$('input[name="c_password"]').val();
		return password === checkPassword;
	},

	afterRender: function() {
		var self = this;

		// Create new autocomplete for use with the textarea. Do this only if this olympus app
		// is not a private deployment.
        if (!Olympus.isPrivateDeployment) {
    		self.$('input.accounts').autocomplete({
    			source: self.searchAccounts,
    			autoFocus: true,
    			appendTo: self.$('.permission-form'),

    			// item in autocomplete dropdown is selected
    			select: self.addPermission
    		});
        }

		// This code seems to be called twice, so we'll do an unbind to make sure that
		// we don't bind the click event to the button more than once
		$('.addSharedUser-button').unbind('click');
		Mast.Socket.request('/subscription/getSubscription', null, function(res, err){
			if(res){
				var options;
				$.each( res, function( i, val ) {
					options = options + '<option value="'+ val.id +'">' + val.features + '</option>'; 
				});
				if(options){
					$('#subscription-drop').html(options);
					this.$('.add-subs-cont').remove();
				}else{
					this.$('.add-subs-cont').show();
 					this.$('.ent-form-cont').remove();		
				}
 			}
		});

	},

	searchAccounts: function(req, callback) {
		var searchTerm = req.term;

		Mast.Socket.request('/account/fetch',{
			email	: searchTerm,
			name	: searchTerm,
			isPrivateDeployment: true
		}, function(res) {
			if (res.status === 403) {
				return;
			}

			accounts = _.map(res, function(value) {
				return {
					label: value.name+' <'+value.email+'>',
					value: value.email,
					account: value
				};
			});
			callback(accounts);
		});
	},

	checkForEmail: function(){
		$(".user_email .error_span").remove();
		var email = this.$('input[name="email"]').val();
		var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    
    	if (filter.test(email)) {

    		$(".email").css({ "border" : "1px solid #d7dbdc" });
    		var data = { email :  email }
			Mast.Socket.request('/account/checkEmail', data, function(response, error){
				if(response.msg === "email_exists"){
					$(".password").hide();					
					$(".confirmPassword").hide();					
				}else if (response.msg === "no_record"){
					$(".password").show();					
					$(".confirmPassword").show();	
				}
			});	

    	}else {

    		$(".user_email").append("<span class='error_span'> Email entered is not valid. </span>");
    		$(".email").css({ "border" : "1px solid red" });

    	}

	}

});
