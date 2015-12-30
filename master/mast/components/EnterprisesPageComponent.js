Mast.registerComponent('EnterprisesPage', {

	model   : 'Enterprises',
	template: '.enterprises-page-template',
	outlet  : '#content',
	regions: {
		'.enterprises-table-region'  : 'EnterprisesTable'
	},

	init: function() {
		this.on('openSidebar', this.createSidebar);
		var userId =  { name : '1' };
	},
	
	createSidebar: function(model) {
		this.attach('.enterprises-sidebar-region',
			Mast.components.EnterprisesSidebar.extend({
				model: model
			})
		);
	}

});


