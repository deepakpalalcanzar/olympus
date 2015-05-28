// External database config
exports.datasource = {
    database: 'olympus',
    username: 'USERNAME',
    password: 'PASSWORD'

    // Choose a SQL dialect, one of sqlite, postgres, or mysql (default mysql)
    // dialect:  'mysql',

    // Choose a file storage location (sqlite only)
    //storage:  ':memory:',

    // mySQL only
    // pool: { maxConnections: 5, maxIdleTime: 30}
};

// Self-awareness of hostname
exports.host = 'localhost';


exports.fileAdapter = {
	// Choose a file adapter for uploads / downloads
	// adapter: 's3',

	// Amazon s3 credentials
	s3: {
		accessKeyId: 'AWS_ACCESS_KEY_ID',
		secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
		awsAccountId: 'AWS_ACCOUNT_ID',
		bucket: 'AWS_BUCKET',
		region: 'AWS_REGION'
	},

	// OpenStack Swift API credentials
	swift: {
		host: 'SWIFT_HOST',
		port: 'SWIFT_PORT',
		serviceHash: 'SWIFT_HASH',
		container: 'SWIFT_CONTAINER'
	}
}
