Mast.registerTree('LogTable', {

	extendsFrom: 'UITableComponent',
	model: {

		column1: {
			name: 'User Name',
			className: 'log-user-column'
		},
		
		column2: {
			name: 'Activity',
			className: 'log-activity-column'
		},
		column3: {
			name: 'ClientIp',
			className: 'log-clientip-column'
		},
		column4: {
			name: 'Date',
			className: 'log-date-column'
		},

		selectedModel: null
	},
	
	template: '.log-template',
	events: {
		'click .search-details'  :'searchdata',
    },

    searchdata: function(){
        Mast.Session.from 		= $('input[name="from"]').val();
        Mast.Session.to 		= $('input[name="to"]').val();
        Mast.Session.activity 	= $('select[name="activity"]').val();
		Mast.Session.from_page 	= window.location.hash;
		Mast.navigate('searchdate');
    },


// branch properties
	emptyHTML      : '<div class="loading-spinner"></div>',
	branchComponent: 'LogRow',
	branchOutlet   : '.log-outlet',

	collection     : {
		url: '/logging/listLog',
		model: Mast.Model.extend({
			defaults: {
				highlighted 	: false,
				name			: "-" ,
				ent_name   	: "-",
				text_message    : "-",
                                ip_address       : "-",
				created_at   	: "Default"
				
			},
			selectedModel: this
		})
	},

});

// log row component
Mast.registerComponent('LogRow', {
	template: '.log-row-template',

	events: {
		'click .log-user-column' : 'logUserDetails'
	},

	logUserDetails:function(){
		this.model.attributes.id = this.model.attributes.user_id;
		Mast.Session.User = this.model.attributes;
		Mast.navigate('#user/details');
	},

});
