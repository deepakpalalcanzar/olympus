<?php 

class Configuration {

	var $dataBase_Configuration; 
	var $adaptor_Configuration; 
	var $mandrill_Configuration; 
	var $localConfig; 
	var $path; 
	

/**
*	@author: Abhishek
*	Used to create a new database before installation 
*	Update the data credentials in all files of olympus where it is required
*		api/local.js
*		master/localConfig.js
*		master/local.js
*/

	function saveDataBase($postData){

		if(!empty($postData)){
			// connect to the mysql database server.

			$con = mysql_connect($postData['database_hostname'], $postData['username'], $postData["password"]);
			// Check connection

			if($con === FALSE){
				 $_SESSION['msg'] = "Unable to connect database.";
				 header("Location:index.php");
			}else{

		    // If we couldn't, then it either doesn't exist, or we can't see it.
				$query="CREATE DATABASE IF NOT EXISTS $postData[database_name]";

				if (mysql_query($query)) {
					
					$_SESSION['databaseName'] = $postData['database_name'];
					$_SESSION['hostname'] 	  = $postData['database_hostname'];
					$_SESSION['domain_name']  = $postData['domain_hostname'];
					$_SESSION['username'] 	  = $postData['username'];
					$_SESSION['password']	  = $postData['password'];
					$_SESSION['serverName']	  = $postData['server_hostname'];
					$_SESSION['protocal']	  = $postData['protocal'];
					$url = "http://".$_SESSION['serverName']."/olympus/installer/mandrill.php";
					echo '<script>window.location.href="'.$url.'"</script>';

				} else {
					$_SESSION['msg'] = "Error in creating database.";
					$url = "http://".$_SESSION['serverName']."/olympus/installer/index.php";
					//echo '<script>window.location.href="'.$url.'"</script>';

				}
  			}
		}

	}

/**
*	@author: Abhishek
*	This function is used to save data of mandrill configuration.
*	Mandrill api is used to send mail on request and adding new users.
*	If Mandrill credentials are not provided then admin is not able to send mail.
*/

	function saveMandrill($mandrillConfig){
		$_SESSION['mandrill_api_key'] = $mandrillConfig['mandrill_key'];
		// print_r($_SESSION['serverName']);
		$url = "http://".$_SESSION['serverName']."/olympus/installer/admin-login.php";
		echo '<script>window.location.href="'.$url.'"</script>';
	}


/**
	*	@author: Abhishek
	*	This function is used to store admin login information 
	*	Email and password here are going to be used for the user login
*/
	function adminLogin($adminLogin){
		$_SESSION['login_email'] 		= $adminLogin['email'];
		$_SESSION['login_password'] 	= $adminLogin['password'];
		$url = "http://".$_SESSION['serverName']."/olympus/installer/storage.php";
		echo '<script>window.location.href="'.$url.'"</script>';

	}

/*
	This function is used to save data of file storage location and 
*/
	function saveStorageLocation($selectedStorage){

		$distribution_version 	=  exec("lsb_release -r | cut -f2"); 
		if($distribution_version == '12.04'){
			$path = "/var/www";
		}else if ($distribution_version == '14.04'){
			$path = "/var/www/html";
		}else{
			$path = "/var/www/html";
		}

		$fileAdapter 			= '';
		$localConfigFileAdaptor = '';
		switch($selectedStorage['storage']){

			case 'S3' :

// File store adapter configuration
				$fileAdapter = "fileAdapter: { \n
									// Which adapter to use \n
										adapter: 's3', \n
									// Amazon S3 API credentials \n
										s3: { \n
											accessKeyId		: '".$selectedStorage['api_key']."', \n
											secretAccessKey	: '".$selectedStorage['api_secret_key']."', \n
											bucket			: '".$selectedStorage['bucket']."', \n
											region			: '".$selectedStorage['region']."' \n
										}, \n
										// OpenStack Swift API credentials \n
											swift: { \n
												host  		: 'SWIFT_HOST', \n
												port 		: 'SWIFT_PORT', \n
												serviceHash : 'SWIFT_HASH', \n
												container 	: 'SWIFT_CONTAINER', \n
											}, \n
										// Keystone API credentials \n
											keystone: { \n
												host    : '', \n
												port    : '', \n
												tenant  : '', // tenant === 'project' in Horizon dashboard \n
												username: '', \n
												password: '' \n
											} \n
										},\n ";


				$localConfigFileAdaptor = "exports.fileAdapter = { \n // Choose a file adapter for uploads / downloads \n
	 								adapter: 's3', \n
							// Amazon s3 credentials \n
									s3: { \n
										accessKeyId		: '".$selectedStorage['api_key']."', \n
										secretAccessKey	: '".$selectedStorage['api_secret_key']."', \n
										bucket			: '".$selectedStorage['bucket']."', \n
										region			: '".$selectedStorage['region']."' \n
									}, \n
							// OpenStack Swift API credentials \n
							// OpenStack Swift API credentials \n
									swift: { \n
										host 		: 'SWIFT_HOST', \n
										port 		: 'SWIFT_PORT', \n
										serviceHash : 'SWIFT_HASH', \n
										container   : 'SWIFT_CONTAINER' \n
									}, \n
								}";

							break;
			

			case 'swift' :

// File store adapter configuration
				$fileAdapter = "fileAdapter: { \n // Which adapter to use \n
											adapter: 'swift', \n
										// Amazon S3 API credentials \n
											s3: { \n
												accessKeyId		: 'AWS_ACCESS_KEY_ID', \n
												secretAccessKey	: 'AWS_SECRET_ACCESS_KEY', \n
												bucket			: 'AWS_BUCKET', \n
												region			: 'US_EAST_1' \n
											}, \n
										// OpenStack Swift API credentials \n
											swift: { \n
												host  		: 'SWIFT_HOST', \n
												port 		: 'SWIFT_PORT', \n
												serviceHash : 'SWIFT_HASH', \n
												container 	: 'SWIFT_CONTAINER', \n
											}, \n
										// Keystone API credentials \n
											keystone: { \n
												host    : '', \n
												port    : '', \n
												tenant  : '', // tenant === 'project' in Horizon dashboard \n
												username: '', \n
												password: '' \n
											} \n
										},\n ";


				$localConfigFileAdaptor = "exports.fileAdapter = { \n // Choose a file adapter for uploads / downloads \n
							adapter: 'swift', \n
				// Amazon s3 credentials \n
						s3: { \n
							accessKeyId		: 'AWS_ACCESS_KEY_ID', \n
							secretAccessKey	: 'AWS_SECRET_ACCESS_KEY', \n
							bucket			: 'AWS_BUCKET', \n
							region			: 'US_EAST_1' \n
						}, \n
				// OpenStack Swift API credentials \n
				// OpenStack Swift API credentials \n
						swift: { \n
							host: '".$selectedStorage['host']."', \n
							port: '".$selectedStorage['port']."', \n
							serviceHash: '".$selectedStorage['serviceHash']."', \n
							container: '".$selectedStorage['container']."', \n
						}, \n
					}\n";

				break;

			case 'Disk' :

// File store adapter configuration
				$fileAdapter = "fileAdapter: { \n // Which adapter to use \n
										adapter: 'disk', \n
										// Amazon S3 API credentials \n
											s3: { \n
												accessKeyId		: 'AWS_ACCESS_KEY_ID', \n
												secretAccessKey	: 'AWS_SECRET_ACCESS_KEY', \n
												bucket			: 'AWS_BUCKET', \n
												region			: 'US_EAST_1' \n
											}, \n
										// OpenStack Swift API credentials \n
											swift: { \n
												host  		: 'SWIFT_HOST', \n
												port 		: 'SWIFT_PORT', \n
												serviceHash : 'SWIFT_HASH', \n
												container 	: 'SWIFT_CONTAINER', \n
											}, \n
										// Keystone API credentials \n
											keystone: { \n
												host    : '', \n
												port    : '', \n
												tenant  : '', // tenant === 'project' in Horizon dashboard \n
												username: '', \n
												password: '' \n
											} \n
										},\n ";


				$localConfigFileAdaptor = "exports.fileAdapter = { \n // Choose a file adapter for uploads / downloads \n
							adapter: 'disk', \n
				// Amazon s3 credentials \n
						s3: { \n
							accessKeyId		: 'AWS_ACCESS_KEY_ID', \n
							secretAccessKey	: 'AWS_SECRET_ACCESS_KEY', \n
							bucket			: 'AWS_BUCKET', \n
							region			: 'US_EAST_1' \n
						}, \n
				// OpenStack Swift API credentials \n
				// OpenStack Swift API credentials \n
						swift: { \n
							host: 'SWIFT_HOST', \n
							port: 'SWIFT_PORT', \n
							serviceHash: 'SWIFT_HASH', \n
							container: 'SWIFT_CONTAINER', \n
						}, \n
					}\n";		


				break;
		}


		$dataBaseConfiguration 	= "exports.datasource = {\n database: '".$_SESSION['databaseName']."', \n username: '".$_SESSION['username']."', \n password: '".$_SESSION['password']."' \n // Choose a SQL dialect, one of sqlite, postgres, or mysql (default mysql) \n // dialect:  'mysql', \n // Choose a file storage location (sqlite only) \n //storage:  ':memory:', \n // mySQL only \n // pool: { maxConnections: 5, maxIdleTime: 30} \n };\n
					// Self-awareness of hostname \n
					exports.host = '".$_SESSION['domain_name']."'; \n
					port: '".$_SESSION['protocal']."', // change to 80 if you're not using SSL\n";


		if($_SESSION['protocal'] == '80'){

			$masterConfigFile ="module.exports = {\n
									specialAdminCode: 'ad8h4FJADSLJah34ajsdajchALz2494gasdasdhjasdhj23bn',\n
									mandrillApiKey: '".$_SESSION['mandrill_api_key']."',\n
									bootstrap: function(bootstrap_cb) { \n
										if(bootstrap_cb) bootstrap_cb(); \n
									},\n
									
									$fileAdapter\n
								
								// Default title for layout\n
									appName: 'Olympus | Sharing the Cloud',\n
								
								// App hostname\n
									host: '".$_SESSION['domain_name']."', \n
								
								// App root path\n
									appPath: __dirname + '/..', \n
								
								// Port to run the app on \n
								
									port: '".$_SESSION['protocal']."', //5008, \n
								    //express: { \n
									//	serverOptions: { \n
									  // 		ca: fs.readFileSync(__dirname + '/../ssl/gd_bundle.crt'), \n
									   	//	key: fs.readFileSync(__dirname + '/../ssl/olympus.key'), \n
									   	//	cert: fs.readFileSync(__dirname + '/../ssl/olympus.crt') \n
										//} \n
									//}, \n

								// Development or production environment \n
									environment: 'development', \n
								
								// Path to the static web root for serving images, css, etc. \n
									staticPath: './public', \n
								
								// Rigging configuration (automatic asset compilation) \n
									rigging: { \n
										outputPath: './.compiled', \n
										sequence: ['./public/dependencies', './public/js/blueimp/vendor', './public/js/blueimp/cors', './public/js/blueimp/main', './mast'] \n
									}, \n
									
								// Prune the session before returning it to the client over socket.io \n
									sessionPruneFn: function(session) { \n
										var avatar = (session.Account && session.Account.id === 1) ? '/images/' + session.Account.id + '.png' : '/images/avatar_anonymous.png'; \n
										var prunedSession = { \n
											Account: _.extend(session.Account || {}, { \n
												avatar: avatar \n
											}) \n
										}; \n
										return prunedSession; \n
									}, \n
								// API token \n
									apiToken: 'Xw46nGv1Nrearden', \n
								// Information about your organization \n
									organization: { \n
										name: 'Olympus', \n
										copyright: '&copy; Olympus.io Inc.', \n
										squareLogoSrc: '/images/logo_square.png', \n
								// Configurable footer link endpoints \n
										links: { \n
											termsOfUse: 'http://www.olympus.io/terms-and-privacy/', \n
											privacyPolicy: 'http://www.olympus.io/privacy/', \n
											help: 'http://www.olympus.io/contact-us/' \n
										} \n
									}, \n
									publicLinksEnabledByDefault: true, \n
								// NOTE: This is just to test for privateDevelopment feature. Need to figure out \n
								// what determines this config options and implement that. \n
	    							privateDeployment: false, \n

								};\n";
		}else{

						$masterConfigFile ="module.exports = {\n
									specialAdminCode: 'ad8h4FJADSLJah34ajsdajchALz2494gasdasdhjasdhj23bn',\n
									mandrillApiKey: '".$_SESSION['mandrill_api_key']."',\n
									bootstrap: function(bootstrap_cb) { \n
										if(bootstrap_cb) bootstrap_cb(); \n
									},\n
									
									$fileAdapter\n
								
								// Default title for layout\n
									appName: 'Olympus | Sharing the Cloud',\n
								
								// App hostname\n
									host: '".$_SESSION['domain_name']."', \n
								
								// App root path\n
									appPath: __dirname + '/..', \n
								
								// Port to run the app on \n
								
									port: '".$_SESSION['protocal']."', //5008, \n
								    express: { \n
										serverOptions: { \n
									   		ca: fs.readFileSync(__dirname + '/../ssl/gd_bundle.crt'), \n
									   		key: fs.readFileSync(__dirname + '/../ssl/olympus.key'), \n
									   		cert: fs.readFileSync(__dirname + '/../ssl/olympus.crt') \n
										} \n
									}, \n

								// Development or production environment \n
									environment: 'development', \n
								
								// Path to the static web root for serving images, css, etc. \n
									staticPath: './public', \n
								
								// Rigging configuration (automatic asset compilation) \n
									rigging: { \n
										outputPath: './.compiled', \n
										sequence: ['./public/dependencies', './public/js/blueimp/vendor', './public/js/blueimp/cors', './public/js/blueimp/main', './mast'] \n
									}, \n
									
								// Prune the session before returning it to the client over socket.io \n
									sessionPruneFn: function(session) { \n
										var avatar = (session.Account && session.Account.id === 1) ? '/images/' + session.Account.id + '.png' : '/images/avatar_anonymous.png'; \n
										var prunedSession = { \n
											Account: _.extend(session.Account || {}, { \n
												avatar: avatar \n
											}) \n
										}; \n
										return prunedSession; \n
									}, \n
								// API token \n
									apiToken: 'Xw46nGv1Nrearden', \n
								// Information about your organization \n
									organization: { \n
										name: 'Olympus', \n
										copyright: '&copy; Olympus.io Inc.', \n
										squareLogoSrc: '/images/logo_square.png', \n
								// Configurable footer link endpoints \n
										links: { \n
											termsOfUse: 'http://www.olympus.io/terms-and-privacy/', \n
											privacyPolicy: 'http://www.olympus.io/privacy/', \n
											help: 'http://www.olympus.io/contact-us/' \n
										} \n
									}, \n
									publicLinksEnabledByDefault: true, \n
								// NOTE: This is just to test for privateDevelopment feature. Need to figure out \n
								// what determines this config options and implement that. \n
	    							privateDeployment: false, \n

								};\n";

		}



		$apiBootstrapConfig  ="module.exports.bootstrap = function (bootstrap_cb) { \n
								async.parallel([ \n
									function (cb) { \n
// If default administrator already exists, get out \n
										Account.find({ \n
											where: {email: '".$_SESSION['login_email']."'} \n
										}).done(function (err, account) { \n
											if (err) throw err;
											console.log('ACCOUNT FOUND:', account); \n
											if (account.length !== 0) return cb && cb(); \n
// Otherwise create a new administrator account \n
												Account.create({ \n
													name: 'Administrator', \n
													title: 'Administrator', \n 
													email: '".$_SESSION['login_email']."', \n
													password: '".$_SESSION['login_password']."', \n
													isAdmin: true, \n
													isSuperAdmin: true, \n
													verified: true, \n
													verificationCode: null, \n
													avatar_fname: null, \n
													avatar_mimetype: null, \n
													enterprise_fsname: null \n
												}).done(function done (err, account) { \n
													if (err) throw err;
													console.log('ACCOUNT CREATE:', account); \n
 // Now create a workgroup, assigning the new account as an admin \n
													Subscription.create({ \n
														features 	: 'Default Plan',\n
														price 		: '0',\n
														duration 	: '1200',\n
														users_limit : '5',\n
														is_default 	: true,\n
														is_active	: true,\n
														quota		: '100000000000'\n
													}).done(function done(err, subscription){ \n
														if (err) throw err; \n
														cb && cb(); \n
													}); \n
											}); \n
										}); \n
									}, \n
									function (cb) { \n
										// Also create a default API app developer \n
										Developer.find({ \n
											where: {api_key: '3y6gp1hz9de7cgvkn7xqjb3285p8udf2'} \n
										}).done(function (err, developer) { \n
											if (err) throw err; \n
											if (developer.length > 0) { return cb && cb(); } \n
											// Otherwise create a new administrator account \n
											Developer.create({ \n
												api_key: '3y6gp1hz9de7cgvkn7xqjb3285p8udf2', \n
												api_secret: 'ctDv8bIUmdJtChHP357xJ1ZspKh32rwq', \n
												app_name: 'Test API App', \n
												redirect_url: 'http://www.pigandcow.com/olympus_test_api_app' \n
											}).done(function done (err, developer) { \n
												if (err) throw err; \n
												AccountDeveloper.create({ \n
													api_key: '3y6gp1hz9de7cgvkn7xqjb3285p8udf2', \n
													account_id: 1, \n
													code: '', \n
													access_token: 'baudzVitCraHCB1', \n
													refresh_token: 'abcdefg', \n
													code_expires: '2020-01-01', \n
													access_expires: '2020-01-01', \n
													refresh_expires: '2020-01-01', \n
													scope: 3 \n
												}).done(function done(err, accountdeveloper){ \n
													if (err) throw err; \n
													else return cb && cb(); \n
												}); \n
											}); \n
										}); \n
									} \n
 								], function(err, results) {bootstrap_cb && bootstrap_cb();});\n
							};";


		$apiConfigApplicationJs = "module.exports = { \n
  // Port this Sails application will live on\n
  port: process.env.PORT || 1337,\n
  // The environment the app is deployed in\n
  // (`development` or `production`)\n
  // In `production` mode, all css and js are bundled up and minified\n
  // And your views and templates are cached in-memory.  Gzip is also used.\n
  // The downside?  Harder to debug, and the server takes longer to start.\n
  environment: process.env.NODE_ENV || 'development',\n
  // Used for sending emails\n
  hostName: '".$_SESSION['domain_name']."',\n
  protocol: 'https://',\n
  // TODO: make this an adapter config\n
  mandrill: {\n
    token: '".$_SESSION['mandrill_api_key']."'\n
  }\n
};";



		exec("sudo chmod 777 $path/olympus/master/config/localConfig.ex.js");
		exec("sudo scp $path/olympus/master/config/localConfig.ex.js $path/olympus/master/config/localConfig.js");
		exec("sudo chmod 777 $path/olympus/master/config/localConfig.js");

		exec("sudo scp $path/olympus/api/config/bootstrap.js /var/www/olympus/master/config/bootstrap.ex.js");


//  API ADAPTERS FILE 
		$bootstrapFile = fopen("$path/olympus/api/config/bootstrap.js", "w");
		fwrite($bootstrapFile, $apiBootstrapConfig);
		fclose($bootstrapFile);	

//  API CONFIG APPLICATION JS FILE 
		$applicationFile = fopen("$path/olympus/api/config/local.js", "w");
		fwrite($applicationFile, $apiConfigApplicationJs);
		fclose($applicationFile);			

//  Database config
		$myfile = fopen("$path/olympus/master/config/localConfig.js", "w");
		fwrite($myfile, $dataBaseConfiguration);
		fclose($myfile);			

//  Append fileAdaptor Database config
		$myfile = fopen("$path/olympus/master/config/localConfig.js", "a");
		fwrite($myfile, $localConfigFileAdaptor);
		fclose($myfile);			

//Update Config File 
		exec("sudo scp $path/olympus/master/config/config.js $path/olympus/master/config/config.ex.js");
		exec("sudo chmod 777 $path/olympus/master/config/config.js");

//  Database config
		$configFile = fopen("$path/olympus/master/config/config.js", "w");
		fwrite($configFile, $masterConfigFile);
		fclose($configFile);	

		$apiLocalConfig = "module.exports = {
								s3: {
    								API_KEY   : '".$selectedStorage['api_key']."', \n
    								API_SECRET: '".$selectedStorage['api_secret_key']."', \n
    								BUCKET    : '".$selectedStorage['bucket']."', \n
  								}, \n
								MYSQL: { \n
    								PASS : '".$_SESSION['password']."', \n
    								DB   : '".$_SESSION['databaseName']."' \n
								}, \n
								receiver: '".$selectedStorage['storage']."' \n
							};\n";

		$filename = '$path/olympus/api/config/local.js';
		exec("sudo chmod 777 -R $path/olympus/api/config/");

//Update Local File at api
		if (file_exists($filename)) {
			exec("sudo scp $path/olympus/api/config/local.js $path/olympus/api/config/local.ex.js");
		}else{
			exec("echo >> '$path/olympus/api/config/local.js'");
		}

//  Local config
		exec("sudo chmod 777 $path/olympus/api/config/local.js");
		$apiLocal = fopen("$path/olympus/api/config/local.js", "w");
		fwrite($apiLocal, $apiLocalConfig);
		fclose($apiLocal);	

		$url = "http://".$_SESSION['serverName']."/olympus/installer/ssl.php";
		echo '<script>window.location.href="'.$url.'"</script>';

	}


	function sslConfiguration($files){

		$distribution_version 	=  exec("lsb_release -r | cut -f2"); 
		if($distribution_version == '12.04'){
			$path = "/var/www";
		}else if ($distribution_version == '14.04'){
			$path = "/var/www/html";
		}else{
			$path = "/var/www/html";
		}

		if($files['ssl_cert']['name']['0']!='') {
			foreach($files['ssl_cert']['name'] as $key => $val){
				if($files['ssl_cert']['name']['0'] != 'gd_bundle.crt'){
					$_SESSION['msg'] = "Please upload valid gd_bundle crt file.";
					$url = "http://".$_SESSION['serverName']."/olympus/installer/ssl.php";
					echo '<script>window.location.href="'.$url.'"</script>';
					return;
				}

				if($files['ssl_cert']['name']['1'] != 'olympus.crt'){
					$_SESSION['msg'] = "Please upload valid crt file.";
					$url = "http://".$_SESSION['serverName']."/olympus/installer/ssl.php";
					echo '<script>window.location.href="'.$url.'"</script>';
					return;
				}

				if($files['ssl_cert']['name']['2'] != 'olympus.key'){

					$_SESSION['msg'] = "Please upload valid olympus key file.";
					$url = "http://".$_SESSION['serverName']."/olympus/installer/ssl.php";
					echo '<script>window.location.href="'.$url.'"</script>';

					return;

				}

				$originalImagePath = "olympus/master/ssl/" ;
	            $orgImg            = $originalImagePath.basename($val);
	            $originalImg       = move_uploaded_file($files['ssl_cert']['tmp_name'][$key], $orgImg);
			}
		}

		echo exec('$path/olympus/installer/lift_olympus.sh');
		$url = "http://".$_SESSION['serverName']."/olympus/installer/theme_setup.php";
		echo '<script>window.location.href="'.$url.'"</script>';

	}


	function launch(){
		
		$distribution_version 	=  exec("lsb_release -r | cut -f2"); 
		if($distribution_version == '12.04'){
			$path = "/var/www";
		}else if ($distribution_version == '14.04'){
			$path = "/var/www/html";
		}else{
			$path = "/var/www/html";
		}

		exec("sudo forever stopall");
		exec('$path/olympus/installer/lift_olympus.sh');	
		echo "<script>window.location = 'https://"+$_SESSION['serverName']+"'</script>";
	}


	function themesetup($postData){
		
		$con = mysql_connect($_SESSION['hostname'], $_SESSION['username'], $_SESSION["password"]);
			// Check connection
		if($con === FALSE){

			$_SESSION['msg'] = "Unable to connect database.";
			header("Location:index.php");

		}else{
				
        	$logo=str_replace("uploads/", "", $postData['logoimg']);
			$db_selected = mysql_select_db($_SESSION['databaseName'], $con);
			$SQL_CREATE_TABLE="CREATE TABLE IF NOT EXISTS `theme` ( `id` int(11) NOT NULL AUTO_INCREMENT, `header_background` varchar(10) NOT NULL, `footer_background` varchar(10) NOT NULL,
				`body_background` varchar(10) NOT NULL,`navigation_color` varchar(10) NOT NULL, `font_family` varchar(100) NOT NULL, `font_color` varchar(10) NOT NULL,
				`createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, `account_id` varchar(255) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=0 ;";
			$RESULT_CREATE_TABLE= mysql_query($SQL_CREATE_TABLE);
			
			if(mysql_num_rows(mysql_query("SHOW TABLES LIKE 'theme'"))!=1) {
                $_SESSION['msg'] =  "Table does not exist";
                header("Location:theme_setup.php");
			}
            
           	$logo=str_replace("uploads/", "", $postData['logoimg']);
           	$date=  date("Y-m-d H:i:s");
			$query="INSERT INTO theme SET header_background='#$postData[HeaderColor]',footer_background='#$postData[FooterColor]' ,body_background='#$postData[BodyColor]',navigation_color='#$postData[NavigationBarColor]',font_color='#$postData[FontColor]' ,font_family='$postData[FontFamily]',createdAt='$date',updatedAt='$date',account_id='1' ";
			
			if (mysql_query($query)) {
            	chmod ("installer/logo_crop/uploads/$logo", 0777);
                $source= 'logo_crop/uploads/'.$logo;
                $destination= '../master/public/images/enterprises/'.$logo;
                copy($source, $destination);
			}
            
            $query_logo="UPDATE account SET enterprise_fsname='$logo' WHERE isSuperAdmin='1'";
            $result_logo= mysql_query($query_logo);
                                
	        if($result_logo){
	//                                   
	            $files = glob('logo_crop/uploads/*'); // get all file names
	            foreach($files as $file){ // iterate files
	              if(is_file($file))
	                unlink($file); // delete file
	            }
	            
	            $files = glob('logo_crop/uploads/big/*'); // get all file names
	            foreach($files as $file){ // iterate files
	              if(is_file($file))
	                unlink($file); // delete file
	            }
	        }
	        
			$url = "http://".$_SESSION['serverName']."/olympus/installer/preview.php";
			echo '<script>window.location.href="'.$url.'"</script>';
		}
	}

}
?>
