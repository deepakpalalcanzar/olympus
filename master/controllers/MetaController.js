var MetaController = {
	
	// Optionally identify the controller here
	// Otherwise name will be based off of filename
	// CASE-INSENSITIVE
	id: 'meta',
	
	home: function (req,res) {

		async.auto({
            syncBox: function(cbmain) {

                // UploadPaths.find({where:{isActive:1}}).done(cb);
                console.log('test99999999999999999999999999999999', req.session.Account.id);
				SyncBox.find({where:{account_id: req.session.Account.id}}).done(function (err, tokenrow) {
		            if (err){
		            	console.log(err, ' :ERRROR');
		                return cbmain();
		            }

		            if( tokenrow ){

		            	//var node_dropbox = require('node-dropbox');
		            	var box = require('node-box-sdk');

		            	box.configure({
						  client_id: 'cbev0e1mrb9jrmvc90gdvwmyworca1nx',             // REQUIRED
						  client_secret: 'UHa0J0epfLX0WoYOQ1JCmYpxvGLyDv8k',     // REQUIRED
						  api_key: 'cbev0e1mrb9jrmvc90gdvwmyworca1nx',              // REQUIRED
						  encrypt: { password: '' }        // OPTIONAL
						});
		                //Set it as Active
		                console.log('Dropbox Token Found: '+tokenrow.access_token);


	                		console.log('callback node_dropbox AccessToken');
							access_token = tokenrow.access_token;
							console.log('access-token - '+access_token);

						if( ( typeof access_token ) != 'undefined'){
								console.log('access_token is retrieved');

								//api = node_dropbox.api(access_token);

		                    async.auto({

		                        checkdir: function (cb) {



								        var sql = "SELECT dir.*, dp.type FROM directory dir JOIN directorypermission dp ON dir.id = dp.DirectoryId  where dir.OwnerId =? AND dir.isWorkgroup = 1";//where dp.AccountId =?
								        sql = Sequelize.Utils.format([sql, req.session.Account.id]);
								        sequelize.query(sql, null, {
								            raw: true
								        }).success(function (workgroup) {

								            if(workgroup.length > 0){
							                var sql = "SELECT dir.*, dp.type FROM directory dir JOIN directorypermission dp ON dir.id = dp.DirectoryId  where dir.DirectoryId = ? AND dir.isOlympusBoxDir = 1";//where dp.AccountId =?
							                sql = Sequelize.Utils.format([sql, workgroup[0].id]);


				                            // console.log(sql);
								                            sequelize.query(sql, null, {
								                                raw: true
								                            }).success(function (directory) {
								                                if(directory.length > 0){
								                                    console.log('directoryFOUNDdirectoryFOUNDdirectoryFOUND');
								                                    cb(null, directory[0]);
								                                }else{
								                                    console.log('creatingDRIVEcreatingDRIVEcreatingDRIVEcreatingDRIVE');
								                                    Directory.create({
								                                        name: 'BOX',
				                                        directoryId: workgroup[0].id,
				                                        isOlympusBoxDir: true,
				                                        uploadPathId: tokenrow.id
								                                    }).done(function(err, newdir){

								                                        if(err)
								                                            return res.send(err, 500);

								                                        DirectoryPermission.create({
								                                            type: 'admin',
								                                            accountId: req.session.Account.id,
								                                            directoryId: newdir.id
								                                        }).done(function(donepermission){
				                                            // console.log(donepermission);
								                                            cb(null, newdir);
								                                        });
								                                    });
				                                }
				                            }).error(function (e) {
				                                return res.send(e, 500);
				                                // throw new Error(e);
				                            });
				                        }else{
							                return res.send(500, "No Workgroup Found for this account.");
								                                }
								                            }).error(function (e) {
								                                return res.send(e, 500);
								                                // throw new Error(e);
								                            });
								                        },
								                        newDirectory: ['checkdir', function (cb, r) { // Create the new directory
		                            console.log(r.checkdir.id);
		                            parentDir = r.checkdir;

		                            //=============================================================================
		                            //Call Recursive sync function for box
		                            //=============================================================================
		                            MetaController.syncBoxRecursive(req, box, access_token, parentDir, 'root', tokenrow, cbmain);
		                            //cbmain();
		                            //=============================================================================
		                        }]
		                    });
						}else{
							console.log('access token undefined');
							cbmain();
						}
					}else{
						cbmain();
					}
		        });
				//cbmain();
            },
            goHome: ['syncBox', function(cbmain, up) {

            	console.log('syncBox: DONE DONE DONE DONE DONE DONE DONE DONE DONE');
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
				req.session.Account.ip = ip;
				var enterpriseLogo, hideSetting=0;

				Account.find({
					where: { id: req.session.Account.id }
				}).done(function(err, account) {

					if (err) return res.send(500,err);

					Account.find({
						where: { id : account.created_by }
					}).done(function(errs, createdBy){

						if(createdBy){
							if(createdBy.enterprise_fsname !== null && createdBy.enterprise_fsname !== '' ){
								if(createdBy.isSuperAdmin !== 1){
									enterpriseLogo = createdBy.enterprise_fsname;
								}else{
									enterpriseLogo = account.enterprise_fsname;
								}

							}else{

								if(account.enterprise_fsname !== null && account.enterprise_fsname !== ''){
									enterpriseLogo = account.enterprise_fsname;
								}else{
									enterpriseLogo = '';
								}
							}
							hideSetting= 1;
						}else{

							enterpriseLogo = account.enterprise_fsname;

						}

						if(account.isSuperAdmin){

							Theme.find({
								where : { account_id: req.session.Account.id  }
							}).done(function(err, theme){
								var sql = "SELECT (SUM(size)/1000000000) as total_space_used FROM file";//directory: Rishabh, subfolder size(3gb)+parent folder size(3gb) makes it double the size, so better consider file
								sql = Sequelize.Utils.format([sql]);
								sequelize.query(sql, null, {
									raw: true
								}).success(function(dir) {

									if(theme === null){

										res.view('meta/superadmin',{
											is_super_admin	: '1',
											apps 			: account.created_by,
											email 			: account.email,
											enterprise_logo : enterpriseLogo,
											avatar 			: account.avatar_image,
											setting 		: hideSetting,
											header_color 	 : '#FFFFFF',
											navigation_color : '#4f7ba9',
											body_background  : '#f9f9f9',
											footer_background: '#f9f9f9',
											font_family 	 : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
											font_color 	 	 : '#585858',
											total_space_used : dir[0].total_space_used?parseFloat(dir[0].total_space_used).toFixed(3):"0"
										});

									}else{

										res.view('meta/superadmin',{
											is_super_admin	: '1',
											apps 			: account.created_by,
											email 			: account.email,
											enterprise_logo : enterpriseLogo,
											avatar 			: account.avatar_image,
											setting 		: hideSetting,
											header_color 	 : theme.header_background 	!== '' ? (theme.header_background).replace(/^#*/g, "#") : '#FFFFFF',
											navigation_color : theme.navigation_color 	!== '' ? (theme.navigation_color).replace(/^#*/g, "#") : '#4f7ba9',
											body_background  : theme.body_background 	!== '' ? (theme.body_background).replace(/^#*/g, "#") : '#f9f9f9',
											footer_background: theme.footer_background 	!== '' ? (theme.footer_background).replace(/^#*/g, "#") : '#f9f9f9',
											font_family 	 : theme.font_family 		!== '' ? theme.font_family : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
											font_color 	 	 : theme.font_color 		!== '' ? (theme.font_color).replace(/^#*/g, "#") : '#585858',
			 								total_space_used : dir[0].total_space_used?parseFloat(dir[0].total_space_used).toFixed(3):"0"
										});
									}
								});					});

						}else{

							if(req.session.Account.isAdmin === true){

								Theme.find({
									where : { account_id: req.session.Account.id  }
								}).done(function(err, theme){

									if(theme === null){

									res.view('meta/workgroupadmin',{
										is_super_admin	: '0',
										apps 			 : account.created_by,
										email 			 : account.email,
										enterprise_logo  : enterpriseLogo,
										avatar 			 : account.avatar_image,
										setting 		 : hideSetting,
										header_color 	 : '#FFFFFF',
										navigation_color : '#4f7ba9',
										body_background  : '#f9f9f9',
										footer_background: '#f9f9f9',
										font_family 	 : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
										font_color 	 	 : '#585858'
									});

									}else{
										res.view('meta/workgroupadmin',{
											is_super_admin	: '0',
											apps 			 : account.created_by,
											email 			 : account.email,
											enterprise_logo  : enterpriseLogo,
											avatar 			 : account.avatar_image,
											setting 		 : hideSetting,
											header_color 	 : theme.header_background 	!== '' ? (theme.header_background).replace(/^#*/g, "#") : '#FFFFFF',
											navigation_color : theme.navigation_color 	!== '' ? (theme.navigation_color).replace(/^#*/g, "#") : '#4f7ba9',
											body_background  : theme.body_background 	!== '' ? (theme.body_background).replace(/^#*/g, "#") : '#f9f9f9',
											footer_background: theme.footer_background 	!== '' ? (theme.footer_background).replace(/^#*/g, "#") : '#f9f9f9',
											font_family 	 : theme.font_family 		!== '' ? theme.font_family : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
											font_color 	 	 : theme.font_color 		!== '' ? (theme.font_color).replace(/^#*/g, "#") : '#585858'
										});
									}
								});


							}else{
		/******profile condition******/
								var sql = "SELECT au.*,p.* FROM adminuser au JOIN profile p on "+
								"au.admin_profile_id=p.id WHERE user_id=?";
								sql = Sequelize.Utils.format([sql, account.id]);
								sequelize.query(sql, null, {
									raw: true
								}).success(function(adminuser) {


									Theme.find({
										where : { account_id: account.created_by  }
									}).done(function(err, theme){

										if(theme === null){

											res.view('meta/home',{
												is_super_admin	: '0',
												apps 			 : account.created_by,
												email 			 : account.email,
												enterprise_logo  : enterpriseLogo,
												avatar 			 : account.avatar_image,
												profile			 : adminuser,
												setting 		 : hideSetting,
												header_color 	 : '#FFFFFF',
												navigation_color : '#4f7ba9',
												body_background  : '#f9f9f9',
												footer_background: '#f9f9f9',
												font_family 	 : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
												font_color 	 	 : '#585858'
											});

										}else{

											res.view('meta/home',{
												is_super_admin	: '0',
												apps 			 : account.created_by,
												email 			 : account.email,
												enterprise_logo  : enterpriseLogo,
												avatar 			 : account.avatar_image,
												profile			 : adminuser,
												setting 		 : hideSetting,
												header_color 	 : theme.header_background 	!== '' ? (theme.header_background).replace(/^#*/g, "#") : '#FFFFFF',
												navigation_color : theme.navigation_color 	!== '' ? (theme.navigation_color).replace(/^#*/g, "#") : '#4f7ba9',
												body_background  : theme.body_background 	!== '' ? (theme.body_background).replace(/^#*/g, "#") : '#f9f9f9',
												footer_background: theme.footer_background 	!== '' ? (theme.footer_background).replace(/^#*/g, "#") : '#f9f9f9',
												font_family 	 : theme.font_family 		!== '' ? theme.font_family : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
												font_color 	 	 : theme.font_color 		!== '' ? (theme.font_color).replace(/^#*/g, "#") : '#585858'
											});
										}
									});

									// res.view('meta/home',{
									// 	apps			: account.created_by,
									// 	email			: account.email,
									// 	profile			: adminuser,
									// 	enterprise_logo: enterpriseLogo,
									// 	avatar: account.avatar_image,
									// 	setting: hideSetting

									// });

								}).error(function(e) {
									throw new Error(e);
								});
		/******end profile condition******/
							}
						}
					});
				});
            }]
        });






















// 		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
// 		req.session.Account.ip = ip;
// 		var enterpriseLogo, hideSetting=0; 

// 		Account.find({
// 			where: { id: req.session.Account.id }
// 		}).done(function(err, account) {

// 			if (err) return res.send(500,err);
			
// 			Account.find({
// 				where: { id : account.created_by }
// 			}).done(function(errs, createdBy){
				
// 				if(createdBy){
// 					if(createdBy.enterprise_fsname !== null && createdBy.enterprise_fsname !== '' ){
// 						if(createdBy.isSuperAdmin !== 1){
// 							enterpriseLogo = createdBy.enterprise_fsname;
// 						}else{
// 							enterpriseLogo = account.enterprise_fsname;
// 						}

// 					}else{

// 						if(account.enterprise_fsname !== null && account.enterprise_fsname !== ''){
// 							enterpriseLogo = account.enterprise_fsname;
// 						}else{
// 							enterpriseLogo = '';
// 						}
// 					}
// 					hideSetting= 1;
// 				}else{

// 					enterpriseLogo = account.enterprise_fsname;

// 				}

// 				if(account.isSuperAdmin){

// 					Theme.find({
// 						where : { account_id: req.session.Account.id  }
// 					}).done(function(err, theme){
// 						var sql = "SELECT (SUM(size)/1000000000) as total_space_used FROM file";//directory: Rishabh, subfolder size(3gb)+parent folder size(3gb) makes it double the size, so better consider file
// 						sql = Sequelize.Utils.format([sql]);
// 						sequelize.query(sql, null, {
// 							raw: true
// 						}).success(function(dir) {

// 							if(theme === null){

// 								res.view('meta/superadmin',{
// 									is_super_admin	: '1',
// 									apps 			: account.created_by,
// 									email 			: account.email,
// 									enterprise_logo : enterpriseLogo,
// 									avatar 			: account.avatar_image,
// 									setting 		: hideSetting,
// 									header_color 	 : '#FFFFFF',
// 									navigation_color : '#4f7ba9',
// 									body_background  : '#f9f9f9',
// 									footer_background: '#f9f9f9',
// 									font_family 	 : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
// 									font_color 	 	 : '#585858',
// 									total_space_used : dir[0].total_space_used
// 								});

// 							}else{

// 								res.view('meta/superadmin',{
// 									is_super_admin	: '1',
// 									apps 			: account.created_by,
// 									email 			: account.email,
// 									enterprise_logo : enterpriseLogo,
// 									avatar 			: account.avatar_image,
// 									setting 		: hideSetting,
// 									header_color 	 : theme.header_background 	!== '' ? (theme.header_background).replace(/^#*/g, "#") : '#FFFFFF',
// 									navigation_color : theme.navigation_color 	!== '' ? (theme.navigation_color).replace(/^#*/g, "#") : '#4f7ba9',
// 									body_background  : theme.body_background 	!== '' ? (theme.body_background).replace(/^#*/g, "#") : '#f9f9f9',
// 									footer_background: theme.footer_background 	!== '' ? (theme.footer_background).replace(/^#*/g, "#") : '#f9f9f9',
// 									font_family 	 : theme.font_family 		!== '' ? theme.font_family : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
// 									font_color 	 	 : theme.font_color 		!== '' ? (theme.font_color).replace(/^#*/g, "#") : '#585858',
// 	 								total_space_used : dir[0].total_space_used
// 								});
// 							}
// 						});					});

// 				}else{

// 					if(req.session.Account.isAdmin === true){

// 						Theme.find({
// 							where : { account_id: req.session.Account.id  }
// 						}).done(function(err, theme){

// 							if(theme === null){

// 							res.view('meta/workgroupadmin',{
// 								is_super_admin	: '0',
// 								apps 			 : account.created_by,
// 								email 			 : account.email,
// 								enterprise_logo  : enterpriseLogo,
// 								avatar 			 : account.avatar_image,
// 								setting 		 : hideSetting, 
// 								header_color 	 : '#FFFFFF',
// 								navigation_color : '#4f7ba9',
// 								body_background  : '#f9f9f9',
// 								footer_background: '#f9f9f9',
// 								font_family 	 : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
// 								font_color 	 	 : '#585858'
// 							});
	
// 							}else{
// 								res.view('meta/workgroupadmin',{
// 									is_super_admin	: '0',
// 									apps 			 : account.created_by,
// 									email 			 : account.email,
// 									enterprise_logo  : enterpriseLogo,
// 									avatar 			 : account.avatar_image,
// 									setting 		 : hideSetting, 
// 									header_color 	 : theme.header_background 	!== '' ? (theme.header_background).replace(/^#*/g, "#") : '#FFFFFF',
// 									navigation_color : theme.navigation_color 	!== '' ? (theme.navigation_color).replace(/^#*/g, "#") : '#4f7ba9',
// 									body_background  : theme.body_background 	!== '' ? (theme.body_background).replace(/^#*/g, "#") : '#f9f9f9',
// 									footer_background: theme.footer_background 	!== '' ? (theme.footer_background).replace(/^#*/g, "#") : '#f9f9f9',
// 									font_family 	 : theme.font_family 		!== '' ? theme.font_family : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
// 									font_color 	 	 : theme.font_color 		!== '' ? (theme.font_color).replace(/^#*/g, "#") : '#585858'
// 								});
// 							}
// 						});


// 					}else{
// /******profile condition******/
// 						var sql = "SELECT au.*,p.* FROM adminuser au JOIN profile p on "+
// 						"au.admin_profile_id=p.id WHERE user_id=?";
// 						sql = Sequelize.Utils.format([sql, account.id]);
// 						sequelize.query(sql, null, {
// 							raw: true
// 						}).success(function(adminuser) {


// 							Theme.find({
// 								where : { account_id: account.created_by  }
// 							}).done(function(err, theme){
								
// 								if(theme === null){

// 									res.view('meta/home',{
// 										is_super_admin	: '0',
// 										apps 			 : account.created_by,
// 										email 			 : account.email,
// 										enterprise_logo  : enterpriseLogo,
// 										avatar 			 : account.avatar_image,
// 										profile			 : adminuser,		
// 										setting 		 : hideSetting, 
// 										header_color 	 : '#FFFFFF',
// 										navigation_color : '#4f7ba9',
// 										body_background  : '#f9f9f9',
// 										footer_background: '#f9f9f9',
// 										font_family 	 : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
// 										font_color 	 	 : '#585858'
// 									});
	
// 								}else{
									
// 									res.view('meta/home',{
// 										is_super_admin	: '0',
// 										apps 			 : account.created_by,
// 										email 			 : account.email,
// 										enterprise_logo  : enterpriseLogo,
// 										avatar 			 : account.avatar_image,
// 										profile			 : adminuser,
// 										setting 		 : hideSetting, 
// 										header_color 	 : theme.header_background 	!== '' ? (theme.header_background).replace(/^#*/g, "#") : '#FFFFFF',
// 										navigation_color : theme.navigation_color 	!== '' ? (theme.navigation_color).replace(/^#*/g, "#") : '#4f7ba9',
// 										body_background  : theme.body_background 	!== '' ? (theme.body_background).replace(/^#*/g, "#") : '#f9f9f9',
// 										footer_background: theme.footer_background 	!== '' ? (theme.footer_background).replace(/^#*/g, "#") : '#f9f9f9',
// 										font_family 	 : theme.font_family 		!== '' ? theme.font_family : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif',
// 										font_color 	 	 : theme.font_color 		!== '' ? (theme.font_color).replace(/^#*/g, "#") : '#585858'
// 									});
// 								}
// 							});
	
// 							// res.view('meta/home',{
// 							// 	apps			: account.created_by,
// 							// 	email			: account.email,
// 							// 	profile			: adminuser,
// 							// 	enterprise_logo: enterpriseLogo,
// 							// 	avatar: account.avatar_image,
// 							// 	setting: hideSetting 

// 							// });
	
// 						}).error(function(e) {
// 							throw new Error(e);
// 						});
// 						/******end profile condition******/
// 					}
// 				}	
// 			});
// 		});
	},


	syncBoxRecursive: function (req, box, tokens, parentDir, boxDir, SyncBox, cbmain) {
		console.log('boxDirboxDirboxDirboxDirboxDir');
		//console.log(tokens);
		box.content.folder.items((boxDir == 'root') ? 0 : boxDir, { tokens: tokens }, function(err, res, tokens) {
			
			console.log('hiiiiii');console.log(err);
			if(err)
			{
				console.log('1111111');
				return cbmain();				
			}

			//console.log(res);
			//console.log(res.text);

			var result = JSON.parse(res.text);
			//console.log(result);
			
			//console.log(result.total_count);
			//console.log(result.entries);
				

			if(typeof res != 'undefined'){
				var boxnodes = result.entries;
				var accountId = req.session.Account.id;
				if(result.total_count > 0){
					async.forEach(boxnodes, function (boxnode, dbItemCallback){
						console.log(boxnode.name);
						if(boxnode.type == 'folder'){
							console.log('parent_id :'+parentDir.id+' & folder_name : '+boxnode.name);

							Directory.findAll({where:{
		                        'name': boxnode.name,
		                        'DirectoryId': parentDir.id//drivenode.parentId
		                        // 'md5checksum': drivenode.md5checksum
		                    }}).done(function(err, dirModel){
		                    	//console.log('Deepak check.');return cbmain();
		                        if(err)
		                            dbItemCallback();//return res.send(err, 500);

		                        if(dirModel && dirModel.length){
		                            console.log('Folder already exists.');//If directory with same name and parent id exists do not create another
		                            // dbItemCallback();// tell async that the iterator has completed
		                            //console.log(dirModel);
		                            console.log('syncDbRecursivesyncDbRecursivesyncDbRecursivesyncDbRecursive');
		                            MetaController.syncBoxRecursive(req, box, tokens, dirModel[0], boxnode.id, SyncBox, dbItemCallback);
		                        }else{
		                        	async.auto({
		                                // Get the permissions linked with the parent directory
		                                parentPermissions: function (cb, res) {
		                                    DirectoryPermission.findAll({
		                                        where: {DirectoryId: parentDir.id}//req.param('parent').id
		                                    }).done(cb);
		                                },
		                                // Make sure the name is unique, or make it so
		                                metadata: function (cb) {
		                                    // UniqueNameService.unique(Directory, req.param('name'), req.param('parent').id, cb);
		                                    UniqueNameService.unique(Directory, boxnode.name, parentDir.id, cb);
		                                },
		                                newDirectory: ['metadata', function (cb, r) { // Create the new directory
		                                        Directory.create({
		                                            name: r.metadata.fileName,
		                                            directoryId: parentDir.id,
		                                            isBoxDir: true,
		                                            uploadPathId: SyncBox.id,
		                                            driveFsName: boxnode.name,
		                                        }).done(cb);
		                                    }],
		                                // Cascade parent permissions to new directory
		                                newPermissions: ['newDirectory', 'parentPermissions', function (cb, res) {
		                                        var chainer = new Sequelize.Utils.QueryChainer();
		                                        _.each(res.parentPermissions, function (parentPermission, index) {
		                                            // The creator always gets admin perms
		                                            if (parentPermission.AccountId != accountId) {//req.session.Account.id
		                                                chainer.add(DirectoryPermission.create({
		                                                    type: parentPermission.type,
		                                                    accountId: parentPermission.AccountId,
		                                                    directoryId: res.newDirectory.id
		                                                }));
		                                            }
		                                        });
		                                        chainer.run().done(cb);
		                                    }],
		                                ownerPermissions: ['newDirectory', function (cb, res) {
		                                        DirectoryPermission.create({
		                                            type: 'admin',
		                                            accountId: accountId,//req.session.Account.id,
		                                            directoryId: res.newDirectory.id
		                                        }).done(cb);
		                                    }]

		                            }, function (err, results) {

		                                if (err){
		                                    console.log('error in creating directory: '+err);
		                                    return;// return res.send(500, err);
		                                }

		                                var apiResponse = APIService.Directory.mini(results.newDirectory);
		                                var parentDirRoomName = Directory.roomName(parentDir.id);//req.param('parent').id
		                                var newDirRoomName = Directory.roomName(results.newDirectory.id);

		                // Subscribe all of the parent dir's subscribers to updates from the new directory
		                                _.each(io.sockets.clients(parentDirRoomName), function (socket) {
		                                    socket.join(newDirRoomName);
		                                });

		                // And broadcast activity to all sockets subscribed to the parent
		                                SocketService.broadcast('ITEM_CREATE', parentDirRoomName, apiResponse);

		                // (Always return an object instead of a single-item list)
		                                apiResponse = (_.isArray(apiResponse)) ? apiResponse[0] : apiResponse;

		                // Assign admin permission ONLY for the user who created the folder
		                                apiResponse.permission = 'admin';

		                                /*Create logging*/
		                                Directory.find(parentDir.id).success(function (dirModel) {
		                                    var options = {
		                                        uri: 'http://localhost:1337/logging/register/',
		                                        method: 'POST',
		                                    };

		                                    options.json = {
		                                        user_id: accountId,//req.session.Account.id,
		                                        text_message: 'has created a sub directory named ' + results.newDirectory.name + ' inside root ' + dirModel.name + ' directory.',
		                                        activity: 'create',
		                                        on_user: accountId,//req.session.Account.id,
		                                        // ip: typeof req.session.Account.ip === 'undefined' ? req.headers['ip'] : req.session.Account.ip,
		                                        platform: 'Web application'//req.headers.user_platform,
		                                    };

		                                    // request(options, function (err, response, body) {
		                                    //     if (err)
		                                    //         return res.json({error: err.message, type: 'error'}, response && response.statusCode);
		                                    // });
		                                });
		                                // Respond with new directory
		                                // res.json(apiResponse);
		                                // dbItemCallback();// tell async that the iterator has completed
		                                MetaController.syncBoxRecursive(req, box, tokens, results.newDirectory, boxnode.id, SyncBox, dbItemCallback);
		                            });



		                        }


		                    });



						}
						else
						{
							console.log(boxnode);
							var options = {tokens: tokens};
							box.content.file.get(boxnode.id, options, function(err, res, tokens) {
								//console.log(err);console.log(res);
								if(err)
									dbItemCallback();
								else
								{
									if(res.body.size)
									{
										File.findAll({where:{
					                        // 'fsName': dropboxnode.rev,//Do not depend on revision, gets updated on file rename and move also
					                        'downloadLink': res.body.id,
					                        'isOnBox' : 1,
					                        // 'md5checksum': dropboxnode.md5checksum
					                    }}).done(function(err, fileModel){
					                        if(err){
					                        	console.log(err);
					                            return dbItemCallback();//return res.send(err, 500);
					                        }

					                        if(fileModel.length > 0){
					                            //var apiResponse = APIService.File.mini(fileModel);
					                            //apiResponse_entries.push(apiResponse);

					                            console.log('apiResponse.entriesapiResponse.entriesapiResponse.entries');
					                            dbItemCallback();// tell async that the iterator has completed
					                            // console.log(apiResponse);
					                            // apiResponse.parent.id = options.parentId;
					                        }else{
					                        	var UUIDGenerator = require('node-uuid');
					                        	var fsName = UUIDGenerator.v1();
					                            File.handleUpload({
					                                name: boxnode.name,
					                                size: res.body.size,
					                                //type: dropboxnode.mime_type,
					                                fsName: boxnode.name,
					                                oldFile: 0,
					                                version: 0,//dropboxnode.version,
					                                parentId: parentDir.id,//parsedFormData.parent.id,
					                                // replaceFileId: req.param('replaceFileId'),
					                                account_id: req.session.Account.id, // AF
					                                //thumbnail: dropboxnode.thumb_exists,//"0",
					                                // md5checksum: dropboxnode.md5checksum,

					                                md5checksum: null,
					                                uploadPathId: SyncBox.id,
					                                isOnBox: 1,
					                                // viewLink: drivenode.webViewLink,
					                                downloadLink: res.body.id,
					                                //iconLink: dropboxnode.icon,
					                            }, function (err, resultSet) {

					                                if (err)
					                                    dbItemCallback();//return res.send(err, 500);
					                                // var response = {
					                                //     total_count: resultSet.length,
					                                //     entries: resultSet
					                                // };
					                                dbItemCallback();
					                                // return res.json(response);
					                            });
					                        }
					                    });
									}
									else
									{
										console.log('ignored 0 byte file: ');
									}
								}

							});

							
						}

						dbItemCallback();
					}, function(err) {
					    console.log('iterating done');

		                console.log('responseresponseresponseresponseresponse');
		                // console.log(response);
		                // return res.json(response);
		                // console.log(dropboxnodes);
						cbmain();
					});

				}
				else
				{
					console.log('222222222222');
					cbmain();
				}


				
			}
			else
			{
				console.log('3333333333');
				return cbmain();
			}
			//cbmain();


			

		});
		// api.getMetadata( (boxDir == 'root') ? '' : boxDir, function(err, res, boxroot) {

			
  //       });
        
	},



	error: function (req,res) {
		res.view('500', {
			title: 'Error (500)'
		});
	},

	notfound: function (req,res) {
		res.view('404', {
			title: 'Not Found (404)'
		});
	},

	denied: function (req,res) {
		res.view('403', {
			title: 'Access Denied (403)'
		});
	},

	syncBox: function (req,res) {
		var access_token;
		if(!req.session.Account || !req.query.code)
		{
			return res.redirect('/');
		}
		else
		{
			var box = require('node-box-sdk');

			box.configure({
			  client_id: 'cbev0e1mrb9jrmvc90gdvwmyworca1nx',             // REQUIRED
			  client_secret: 'UHa0J0epfLX0WoYOQ1JCmYpxvGLyDv8k',     // REQUIRED
			  api_key: 'cbev0e1mrb9jrmvc90gdvwmyworca1nx',              // REQUIRED
			  encrypt: { password: '' }        // OPTIONAL
			});

			box.generateToken({ authorization_code: req.query.code }, function(err, tokens) { 
			  	console.log(tokens); console.log(err);
			  	if (err){
            		console.log(':::::777777777777777777777777777');
            		return res.redirect('/');
            	}

        		access_token = tokens; 

        		box.content.folder.get(0, { tokens: tokens }, function(err1, res1, tokens1) {
        			console.log(res1.req._headers);
        			//console.log(res.text);
        			var access_token_1 = res1.req._headers.authorization.split("Bearer ").pop();
        			//console.log(access_token_1);

        			console.log('boxboxbox');
					console.log(req.query.code);

					//Find Adapter with same configuration
			        SyncBox.find({where:{account_id: req.session.Account.id}}).done(function (err, tokenrow) {
			            if (err)
			                return res.redirect('/');// res.json({success: false, error: err});

			            if(tokenrow){
			                //Set it as Active
			                console.log('already exists : ');
			                tokenrow.access_token = access_token;
			                tokenrow.access_token_2 = access_token_1;
			                tokenrow.save().done(function(err) {
			                    return res.redirect('/');
			                });
			            }else{
			                console.log('New BOX.NET Token Being Added for account ID : '+req.session.Account.id);

			                SyncBox.create({

			                    account_id			: req.session.Account.id,
			                    access_token		: access_token,
			                    access_token_2		: access_token_1,
								//token_type      	: body.token_type,
							    //uid             	: body.uid,
							    //dbxaccount_id   	: body.account_id

			                }).done(function foundAdapter (err, tokenrow) {
			                	return res.redirect('/');
			                });


								
							
			            }
			        }); 
        		 });  


        		        	


			});


		}
		
	}
};
_.extend(exports,MetaController);
