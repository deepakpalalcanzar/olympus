var TrashController = {

	restore: function(req, res){

		var options = {
			file_id : req.param('file_id'),
			type 	: req.param('type')
		};

		if(req.param('type') === 'file'){
			DeletedList.restore(options, function(err, account){
				if(err) return;
				return res.json(account, 200);
			});
		}else if (req.param('type') === 'directory'){

			DeletedList.find({
                deleted_id  : req.param('file_id'), 
                type        : 2 
            }).then(function (res) {
            	
				Directory.update({
	                id: res[0].deleted_id
	            }, {
	                deleted         : null,
	                deleteDate      : null,
	                DirectoryId     : res[0].directory_id                   
				}).exec(function(err, dir){

					res.forEach(function (deletedlist) {
						console.log(deletedlist);
                        DirectoryPermission.create({
                            type        : deletedlist.permission,
                            orphan      : null,
                            AccountId   : deletedlist.account_id,
                            DirectoryId : deletedlist.deleted_id
                        }).then(function (perm) {
                            // return perm;
                        });

                        DeletedList.update({
                            id: deletedlist.id
                        }, {
                            deleted_id   : null,
                            directory_id : null 
                        }).then(function(per){

                        });

                        
                    });

					DeletedList.restoreParent(options, function(err, account){
						// if(err) return;
						// return res.send(200);
					});
				});

			});

		}
	}
	
};

module.exports = TrashController;