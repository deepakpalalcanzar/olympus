Mast.registerTree('LogTable', {

	extendsFrom: 'UITableComponent',
	model: {

		/*column1: {
			name: 'User Name',
			className: 'log-user-column'
		},
		column2: {
			name: 'Enterprise',
			className: 'log-enterprise-column'
		},
		column3: {
			name: 'Activity',
			className: 'log-activity-column'
		},
		column4: {
			name: 'Date',
			className: 'log-date-column'
		},*/
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
//////// by new ///////////////

	events: {
		'click .search-details'  :'searchdata',
    },

    searchdata: function(){

	 //   console.log('345dfgdfgdfg');
     //      var self = this;
	 //   var formdata = this.getdate();
     //      console.log(formdata);
		
     //       Mast.Socket.request('/account/datesearch', formdata, function(data){
           
            
     //           console.log(data);
           
		// });

        alert($('select[name="activity"]').val());

        Mast.Session.from = $('input[name="from"]').val();
        Mast.Session.to = $('input[name="to"]').val();
        Mast.Session.activity = $('select[name="activity"]').val();
       // Mast.Session.activity = $('activity').val();
		Mast.Session.from_page = window.location.hash;
		console.log(Mast.Session.term);
		Mast.navigate('searchdate');

    },

 //    getdate: function() {
	// 	var sdate, edate;
	// 	return {
			
	// 		sdate  : this.$('input[name="from"]').val(),
	// 		edate : this.$('input[name="to"]').val(),
	// 	};
	// },

    ////// by new /////////////////


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
		'click .log-user-column' : 'logUserDetails',
		// 'click .log-enterprise-column' : 'logEnterpriseDetails',
	},

	logUserDetails:function(){
		this.model.attributes.id = this.model.attributes.user_id;
		Mast.Session.User = this.model.attributes;
		Mast.navigate('#user/details');
	},

/*	logEnterpriseDetails:function(){
		this.model.attributes.id = this.model.attributes.ent_id;
		Mast.Session.enterprises = this.model.attributes;
		console.log(this.model.attributes);
		Mast.navigate('/#enterprises/updateenterprise');
	},*/

});
