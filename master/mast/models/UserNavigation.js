Mast.registerModel('UserNavigation', {
	defaults: function() {
		return {

			name: 'Loading...',
			avatar: '/images/avatar_anonymous.png',
			dropdownItems	: [
				{
					method	: 'viewProfile',
					name	: 'View Profile',
					iconSrc	: '/images/icon_dropdown_download.png'
				},
				{
					method	: 'password',
					name	: 'Change Password',
					iconSrc	: '/images/icon_dropdown_download.png'
				},
				// {
				// 	method	: 'notifications',
				// 	name	: 'Email Notification',
				// 	iconSrc	: '/images/icon_dropdown_download.png'
				// },
				{
					method	: 'subscription',
					name	: 'Subscription',
					iconSrc	: '/images/icon_dropdown_download.png'
				},
				{
					method	: 'signOut',
					name	: 'Sign Out',
					iconSrc	: '/images/icon_dropdown_comment.png'
				},
				
			]
			
		};
	}
});