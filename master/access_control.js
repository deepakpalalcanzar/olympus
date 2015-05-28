// Some basic authentication middleware is bundled in the AuthenticationService
var policy = sails.policies;
module.exports = {
	'*': true,

	keystone: {
		"*": policy.authenticated
	},
	auth: {
		logout: policy.authenticated
	},
	meta: {
		home: policy.authenticated,
		denied: true,
		error: true,
		notfound: true
		// 403 is hard-coded to be enabled
	},

	inode: {
		'*': policy.authenticated
	},

	settings: {
		"*": policy.authenticated
	},

	account: {
		'*': policy.authenticated,
    register: policy.can('admin'),
    delete: policy.can('admin'),
		imageUpload: true,
		avatar: true
	},

	directory: {
		"*": policy.can('read'),
		workgroups: policy.can('read'),
		addComment: policy.can('comment'),
		removeComment: policy.can('admin'),
		read: policy.can('read'),
		mv: policy.can('admin'),
		rename: policy.can('write'),
		'delete': policy.can('admin'),
		mkdir: policy.can('write'),
		enablePublicLink: policy.can('admin'),
		enablePublicSubLinks: policy.can('admin'),
		addPermission: policy.can('admin'),
		updatePermission: policy.can('admin'),
		removePermission: policy.can('admin'),
		upload: policy.can('write')
	},

	file: {
		"*": policy.can('read'),
		download: policy.can('read'),
		'public': true,
		'retrieve': true,
		addComment: policy.can('comment'),
		removeComment: policy.can('admin'),
		upload: policy.can('write'),
		mv: policy.can('admin'),
		rename: policy.can('write'),
		'delete': policy.can('admin'),
		enablePublicLink: policy.can('admin'),
		addPermission: policy.can('admin'),
		updatePermission: policy.can('admin'),
		removePermission: policy.can('admin')
	},

	redirect: {
		"*": policy.authenticated
	}
};
