exports.datasource = {
	database: 'olympus', 
	username: 'root', 
	password: 'refico' 
// Choose a SQL dialect, one of sqlite, postgres, or mysql (default mysql) 
// dialect:  'mysql', 
// Choose a file storage location (sqlite only) 
//storage:  ':memory:', 
// mySQL only 
// pool: { maxConnections: 5, maxIdleTime: 30} 
};

// Self-awareness of hostname 
exports.host = 'localhost'; 
port: '443', // change to 80 if you're not using SSL
exports.fileAdapter = { 
// Choose a file adapter for uploads / downloads 
	adapter: 'disk', 
	// Amazon s3 credentials 
	s3: { 
		accessKeyId		: 'AWS_ACCESS_KEY_ID', 
		secretAccessKey	: 'AWS_SECRET_ACCESS_KEY', 
		bucket			: 'AWS_BUCKET', 
		region			: 'US_EAST_1' 
	}, 

	// OpenStack Swift API credentials 
	swift: { 
		host: 'SWIFT_HOST', 
		port: 'SWIFT_PORT', 
		serviceHash: 'SWIFT_HASH', 
		container: 'SWIFT_CONTAINER', 
	}, 
}
