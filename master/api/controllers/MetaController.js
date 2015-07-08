var MetaController = {
	
	// Optionally identify the controller here
	// Otherwise name will be based off of filename
	// CASE-INSENSITIVE
	id: 'meta',
	
	home: function (req,res) {
		var enterpriseLogo, hideSetting=0; 
		Account.find({
			where: { id: req.session.Account.id }
		}).done(function(err, account) {

			if (err) return res.send(500,err);

			Account.find({
				where: { id : account.created_by }
			}).done(function(errs, createdBy){
				
				if(createdBy){
					if(createdBy.enterprise_fsname !== null && createdBy.enterprise_fsname !== ''){
						enterpriseLogo = createdBy.enterprise_fsname;
					}else{
						enterpriseLogo = '';
					}

					hideSetting= 1;

				}else{
					enterpriseLogo = account.enterprise_fsname;
				}

				if(account.isSuperAdmin){
				
					res.view('meta/superadmin',{
						apps: account.created_by,
						email: account.email,
						enterprise_logo: enterpriseLogo,
						avatar: account.avatar_image,
						setting: hideSetting 
					});

				}else{

					if(req.session.Account.isAdmin === true){

						res.view('meta/workgroupadmin',{
							apps: account.created_by,
							email: account.email,
							enterprise_logo: enterpriseLogo,
							avatar: account.avatar_image,
							setting: hideSetting 

						});

					}else{
/******profile condition******/
						var sql = "SELECT au.*,p.* FROM adminuser au JOIN profile p on "+
						"au.admin_profile_id=p.id WHERE user_id=?";
						sql = Sequelize.Utils.format([sql, account.id]);
						sequelize.query(sql, null, {
							raw: true
						}).success(function(adminuser) {
							res.view('meta/home',{
								apps			: account.created_by,
								email			: account.email,
								profile			: adminuser,
								enterprise_logo: enterpriseLogo,
								avatar: account.avatar_image,
								setting: hideSetting 

							});
						}).error(function(e) {
							throw new Error(e);
						});
/******end profile condition******/
					}
				}	
			});
		});
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
	}
};
_.extend(exports,MetaController);