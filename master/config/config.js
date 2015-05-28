// var fs = require('fs');

module.exports = {

	specialAdminCode: 'ad8h4FJADSLJah34ajsdajchALz2494gasdasdhjasdhj23bn',
	mandrillApiKey: 'f137c8a3-296a-463b-b4b1-d5652b646942',

	bootstrap: function(bootstrap_cb) {
		if(bootstrap_cb) bootstrap_cb();
		// async.parallel([

		// 	function (cb) {

		// 		// If default administrator already exists, get out
		// 		Account.find({
		// 			where: {email: 'admin@olympus.io'}
		// 		}).done(function (err, account) {
		// 			if (err) throw err;
		// 			if (account) return cb && cb();

		// 			// Otherwise create a new administrator account
		// 			Account.create({
		// 				name: 'Administrator',
		// 				title: 'Administrator',
		// 				email: 'admin@olympus.io',
		// 				password: 'abc123',
		// 				isAdmin: true,
		// 				verified: true,
		// 				verificationCode: null,
		// 				avatar_fname: null,
		// 				avatar_mimetype: null
		// 			}).done(function done (err, account) {
		// 				if (err) throw err;

		// 				// Now create a workgroup, assigning the new account as an admin
		// 				Directory.createWorkgroup({
		// 					name: 'Sample Workgroup',
		// 					accountId: account.id
		// 				}, function(err, results) {
		// 					if (err) throw err;

		// 					cb && cb();
		// 				});
		// 			});
		// 		});
		// 	},

		// 	function (cb) {
		// 		// Also create a default API app developer
		// 		Developer.find({
		// 			where: {api_key: '3y6gp1hz9de7cgvkn7xqjb3285p8udf2'}
		// 		}).done(function (err, developer) {
		// 			if (err) throw err;
		// 			if (developer) return cb && cb();

		// 			// Otherwise create a new administrator account
		// 			Developer.create({
		// 				api_key: '3y6gp1hz9de7cgvkn7xqjb3285p8udf2',
		// 				api_secret: 'ctDv8bIUmdJtChHP357xJ1ZspKh32rwq',
		// 				app_name: 'Test API App',
		// 				redirect_url: 'http://www.pigandcow.com/olympus_test_api_app'
		// 			}).done(function done (err, developer) {
		// 				if (err) throw err;
		// 				else return cb && cb();
		// 			});

		// 			AccountDeveloper.create({
		// 				api_key: '3y6gp1hz9de7cgvkn7xqjb3285p8udf2',
		// 				account_id: 1,
		// 				code: '',
		// 				access_token: 'baudzVitCraHCB1',
		// 				refresh_token: 'abcdefg',
		// 				code_expires: '2020-01-01',
		// 				access_expires: '2020-01-01',
		// 				refresh_expires: '2020-01-01',
		// 				scope: 3
		// 			});
		// 		});
		// 	}
		// ], function(err, results) {bootstrap_cb && bootstrap_cb();});
	},

	// File store adapter configuration
	fileAdapter: {

		// Which adapter to use
		adapter: 's3',

		// Amazon S3 API credentials
	/*	s3: {
           accessKeyId: 'AKIAIUPRTVZFV3GJR6DA',
           secretAccessKey: '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',
           bucket: 'app.olympus.io',
           region: 'US_EAST_1'
       },*/

	s3: {
		
		accessKeyId: 'AKIAIUPRTVZFV3GJR6DA',
		secretAccessKey: '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',
		bucket: 'app.olympus.io',
		region: 'US_EAST_1'
	},


		// OpenStack Swift API credentials
		swift: {
			host: '209.99.54.131',
			port: '8080',
			serviceHash: 'AUTH_cba4c29df381471682041b859ce4d8ae',
			container: 'olympus_main'
		},

		// Keystone API credentials
		keystone: {
			host:		'209.99.54.131',
			port:		'5000',
			tenant:		'demo', // tenant === "project" in Horizon dashboard
			username:	'admin',
			password:	'truvan1x'
		}
	},

	// Default title for layout
	appName: "Olympus | Sharing the Cloud",

	// App hostname
	host: "localhost",

	// App root path
	appPath: __dirname + '/..',

	// Port to run the app on
	port: 443, //5008,

    express: {
		serverOptions: {
	   		ca: fs.readFileSync(__dirname + '/../ssl/gd_bundle.crt'),
		   	key: fs.readFileSync(__dirname + '/../ssl/olympus.key'),
		   	cert: fs.readFileSync(__dirname + '/../ssl/olympus.crt')
		}
 	},

	// Development or production environment
	environment: 'development',

	// Path to the static web root for serving images, css, etc.
	staticPath: './public',

	// Rigging configuration (automatic asset compilation)
	rigging: {
		outputPath: './.compiled',
		sequence: ['./public/dependencies', './public/js/blueimp/vendor', './public/js/blueimp/cors', './public/js/blueimp/main', './mast']
	},

	// Prune the session before returning it to the client over socket.io
	sessionPruneFn: function(session) {
		var avatar = (session.Account && session.Account.id === 1) ? '/images/' + session.Account.id + ".png" : '/images/avatar_anonymous.png';
		var prunedSession = {
			Account: _.extend(session.Account || {}, {
				avatar: avatar
			})
		};
		return prunedSession;
	},

	// API token
	apiToken: 'Xw46nGv1Nrearden',

	// Information about your organization
	organization: {

		name: "Olympus",

		copyright: "&copy; Olympus.io Inc.",

		squareLogoSrc: "/images/logo_square.png",

		// Configurable footer link endpoints
		links: {
			termsOfUse: 'http://www.olympus.io/terms-and-privacy/',
			privacyPolicy: 'http://www.olympus.io/privacy/',
			help: 'http://www.olympus.io/contact-us/'
		}
	},

	publicLinksEnabledByDefault: true,
    // NOTE: This is just to test for privateDevelopment feature. Need to figure out
    // what determines this config options and implement that.
    privateDeployment: false

		/*
	// Future:
	riggingSequence: {
	    "mobile": ['./public/dependencies', './public/mobile-ui'],
	    "desktop": ['./public/dependencies', './public/desktop-ui']
	}
	*/

	/*
	// To use HTTPS, just include a key and cert, for example:
	ssl: {
		key: fs.readFileSync('ssl/private.key.pem'),
		cert: fs.readFileSync('ssl/combined.crt')
	};
	*/

	// Override with any local configuration
};
