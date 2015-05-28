Mast.registerModel('AccountPermission',{
	defaults: function() {
		return {

			owned_by: {
				avatar		: '/images/avatar_anonymous.png',
				name		: 'someName'
			},
			
			permission	: 'unknown',

			permissionItems	: [
				// {
				// 	method	: 'canView',
				// 	name	: 'Can view',
				// 	iconSrc	: '/images/icon_dropdown_download.png'
				// },
				{
					method	: 'canComment',
					name	: 'Can comment',
					iconSrc	: '/images/icon_dropdown_comment.png'
				},
				{
					method	: 'canEdit',
					name	: 'Can edit',
					iconSrc	: '/images/icon_dropdown_Sharing.png'
				},
				{
					method	: 'isAdmin',
					name	: 'Is admin',
					iconSrc	: '/images/icon_dropdown_update.png'
				}
			]
		};
	},

	marshal: function (model) {
		return _.extend(model,{
			id: model.owned_by.id,
			permission: 
				(model.permission=='read') ? 'Can view' :
				(model.permission=='comment') ? 'Can comment' :
				(model.permission=='write') ? 'Can edit' :
				(model.permission=='admin') ? 'Is admin' :
				'Unknown'
		});
	}
});

Mast.registerCollection('AccountPermissions',{
	
	
	
	// Marshal server-side API into presentable data format
	marshal: function (models) {
		var self = this;
		// Get the current user's permissions for the node.  We need this
		// to set the initial editable state of the row.  Rows are editable
		// (i.e. the permissions can be changed) if they are a) not for the
		// logged in user and b) the logged-in user has admin permissions
		// for the node.
		var accountPerm = null;
		_.each(models,function(model){
			if (model.owned_by.id == Mast.Session.Account.id) {
				accountPerm = model.permission;
			}
		});
		return _.map(models,function(model,index) {
			return _.extend(self.get(model.id) || {},self.model.prototype.marshal(model),{editable:!_.isUndefined(model.editable) ? model.editable : model.owned_by.id != Mast.Session.Account.id && accountPerm == "admin"});
		});
	},
	
	load: function(inodeAttrs, callback) {
		var self = this;

		// Determine which url(controller) to request (depends on whether this is a directory or a file)
		this.url = ((inodeAttrs.type=='directory') ?
			"/directory" : "/file") + "/permissions";

		// Ask the server for current viewers
		Mast.Socket.request(this.url,
		{id: inodeAttrs.id},
		function(res) {	

			// Reset this collection with the viewers from the server
			self.reset(self.marshal(res));
			callback && callback();
		});
	},

	getByEmail: function(email) {
		var account = null;
		_.each(this.models, function(model) {
			if (model.get('owned_by').email == email) {
				account = email;
			}
        });
        return account;
	},
	
	model: 'AccountPermission'
});


Mast.accountData = [
	{
		label: 'Ben Bazzrea <ben@balderdash.co>',
		value: {id: 1}
	},
	{
		label: 'Gabe Hernandez <gabe@balderdash.co>',
		value: {id: 2}
	},
	{
		label: 'Heather White <heather@balderdash.co>',
		value: {id: 3}
	},
	{
		label: 'Mike McNeil <mike@balderdash.co>',
		value: {id: 4}
	},
	{
		label: 'Rachael Shaw <rachael@balderdash.co>',
		value: {id: 5}
	}
]

