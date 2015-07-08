Mast.registerComponent('SubscriptionNotifications', {

	model: {
		features 			: 'None',
		user_limit			: 'None',
		price				: '0.00',
		duration_from		: 'None',
		duration_to 	    : 'None',
	},

	template: '.subscription-notifications-template',

	afterConnect: function() {
		var self = this;
		var account = {'acc_id':Mast.Session.Account.id}
		Mast.Socket.request('/subscription/subscribedPlan', account, function(res, err){
			if(res){
				
    			// var duration_to = res[0].acc_created+parseInt(res[0].duration);
    			var duration_to = res[0].expiryDate;
    			console.log(res[0].acc_created);
    			console.log(duration_to);
				var data = {
					features 	: res[0].plan_name,
					user_limit	: res[0].users_limit,
					price		: res[0].price,
					duration_from   : res[0].acc_created,
					duration_to     : duration_to,
					quota     	: res[0].quota === '1000000' ? 'Unlimited' : res[0].quota,
				}
				self.set(data);
 			}
		});

	},

	events: {
		'click .upgrade-subscription': 'upgrade',
	},

	upgrade:function(){
		// window.location.href='subscription/upgrade';
		Mast.Session.subscription = this.model.attributes;
		Mast.navigate('subscription/upgrade');
	},

});
