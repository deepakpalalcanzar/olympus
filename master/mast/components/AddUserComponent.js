/*Mast.components.AddUserComponent  = Mast.Component.extend({*/

Mast.registerComponent('AddUserComponent',{

	template: '.add-user-template',
	outlet: '#content',
	events:{
		'click .setting-save-button': 'addUser',
	},
	collection	: 'Account',

	init: function(){
		var lock =  { id : '12' };
		$('.searchbar').hide();
	},

	afterRender: function(){

		var lock =  { id : '12' };
		Mast.Socket.request('/account/listWorkgroup', lock, function(res, err){
			if(res){
				var options = "<option value=''>Select Workgroup</option>";				$.each( res, function( i, val ) {
					options = options + '<option value="'+ val.id +'">' + val.name + '</option>'; 
				});
				$('#list_workgroup').html(options);
 			}
		});

		Mast.Socket.request('/subscription/getSubscription', null, function(res, err){
			if(res){
				var options;
				$.each( res, function( i, val ) {
					if(val.is_default === 1){
						options = options + '<option selected value="'+ val.id +'">' + val.features + '</option>'; 
					}else{
						options = options + '<option value="'+ val.id +'">' + val.features + '</option>'; 
					}
				});
				if(options){
					$('#subscription-drop').html(options);
					$('.add-subs-cont').remove();
				}else{
					$('.add-subs-cont').show();
 					$('.ent-form-cont').remove();		
				}
 			}
		});
	},

	addUser:function(){

		var self = this;
		var userData = this.getFormData();
		if(self.validateForm()){ // Validate form
			Mast.Socket.request('/profile/checkUsersLimit', null, function(re, er){
				if(re.not_subscriber && Mast.Session.Account.isSuperAdmin!= true){
					alert('You have not subscribed any plan yet!');
					Mast.navigate('#account/subscription');
				}else{

				if(re.error){
					alert('You can not exceed allowed users limit');
				}else{
					
					Mast.Socket.request('/enterprises/getQuota', {sub_id:userData.subscription}, function(reso, erro){
					var q = (reso[0].quota*1000000000);
					userData.quota = ""+q+"";
					if(reso){
						Mast.Socket.request('/profile/register', userData, function(res, err){

							if(res){


								//var options = { 
								//	user_id: typeof(res.account) === 'undefined' ? res.id : res.account.id,
								//	admin_profile_id: 	'2' 
								//};
                                                                var options = { 
									user_id: typeof(res.account) === 'undefined' ? res.id : res.account.id,
									admin_profile_id: 	'2',
									email_msg  : (res.email_msg == 'email_exits') ?'email_exits':' ', 
								};
 



							Mast.Socket.request('/adminuser/create', options, function(resadmin, err){

							if(resadmin){
								self.addPermissionViaEmail();	
								self.clearForm();
								//alert('Account has been created.');
                                                        if(resadmin.adminuser.email_msg == 'email_exits'){
                                                             alert('User already exits and added to workgroup.');
								}else{
								alert('Account has been created.');
							        }
								Mast.navigate('#listusers');
								}
							
							});
						}
					
						});
					}
		  			});
		 		}
		 	}
			});

		}
	},

	getFormData:function(){

		var name, first_name, last_name, userName, email, title,
			workgroup, role, password, quota;

		first_name 	= this.$('input[name="first_name"]').val();
		last_name	= this.$('input[name="last_name"]').val();
		userName 	= first_name+' '+last_name;

		return {
			name 	 : userName,
			email	 : this.$('input[name="email"]').val(),
			workgroup: this.$('select[name="workgroup"]').val(),
			role	 : this.$('select[name="role"]').val(),
			password : this.$('input[name="password"]').val(),
			title	 : this.$('input[name="title"]').val(),
			subscription : this.$('select[name="subscription"]').val()			
		};
	},

	clearForm: function(){

		this.$('input[name="first_name"]').val('');
		this.$('input[name="last_name"]').val('');
		this.$('input[name="email"]').val('');
		this.$('select[name="workgroup"]').val('');
		this.$('select[name="role"]').val('');
		this.$('input[name="password"]').val('');
		this.$('input[name="title"]').val('');
		this.$('input[name="quota"]').val('');

	},

	validateForm: function(){
		if (this.$('input[name="first_name"]').val() === '') {
			alert('Please enter first name !');
			return false;
		}else if(this.$('input[name="last_name"]').val() ===''){
			alert('Please enter last name !');
			return false;
		}else if(this.$('input[name="email"]').val() ===''){
			alert('Please enter email !');
			return false;
		}else if(this.$('select[name="workgroup"]').val() !=='' && this.$('select[name="role"]').val() ===''){
			alert('Please select role !');
			return false;
		}else if(this.$('input[name="password"]').val() ===''){
			alert('Please enter password !');
			return false;
		}else if(this.$('select[name="subscription"]').val() ===''){
			alert('Please select subscription !');
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

// send addPermission request to server user by email
	addPermissionViaEmail: function () {

// If there is no input, then do nothing. useful for pressEnter event
		if (this.$('input[name="email"]').val() === '') {
			return;
		}

		var self = this;
// Get the contents of the "Share with someone else" input
		var emails 		= this.$('input[name="email"]').val();
		var workgroup 	= this.$('select[name="workgroup"]').val();
		var role		= this.$('select[name="role"]').val();

// Check that a user with the specified email doesn't already have permissions
/*		if (this.collection.getByEmail(emails)) {
			console.log('User with email '+emails+' already has permissions...');
			return;
		}
*/
		var re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(emails) === false) {
// alert('The email address you entered was invalid; please check and try again.');
		}

// Send a request to add permission for this user, who may or may not exist.
// If they don't exist, they'll be added
		else {
			console.log("WORKED!",emails);
			Mast.Socket.request('/directory/addPermission',{
				id: workgroup,
				email: emails,
				permission: role,
				type: 'permission'
			});
		}
	}

});
