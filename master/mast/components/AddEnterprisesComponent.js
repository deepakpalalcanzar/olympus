Mast.registerComponent('AddEnterprisesComponent',{

	template: '.add-enterprises-template',
	outlet: '#content',
	events:{
		'click .add-enterprises': 'addEnterprise',
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
									alert('Data has been saved.');
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
		if (this.$('input[name="enterprises_name"]').val() === '') {
			alert('Please enter enterprise name !');
			return false;
		}else if(this.$('input[name="email"]').val() ===''){
			alert('Please enter email !');
			return false;
		}else if(this.$('input[name="password"]').val() ===''){
			alert('Please enter password !');
			return false;
		}else if(!this.isValidPassword()){
			alert('Password and confirm password did not match !');
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

		// var lock =  { id : '12' };
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

});
