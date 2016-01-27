/*---------------------
  :: DeletedList
  -> model
---------------------*/
var deleteUtils = require('../services/lib/account/destroy');
var  async = require('async');

module.exports = {
  
    attributes: {
    
        type        : 'integer',
        deleted_id  : 'integer',
        sync_time   : 'datetime',
        user_id   	: 'integer',
        account_id  : 'integer',
        directory_id: 'integer',
        permission  : 'string',

    },

    restore: function(options, cb){


        DeletedList.find({
            deleted_id : options.file_id 
        }).then(function (res) {

            async.auto({

                fileUpdate: function(cb){
                    File.update({
                        id: options.file_id
                    }, {
                        deleted         : null,
                        deleteDate      : null,
                        DirectoryId     : options.directory_id === '' ? res[0].directory_id : options.directory_id                    
                    }).exec(cb);


                    DeletedList.update({
                        id: res[0].directory_id
                    }, {
                        deleted_id   : null,
                        directory_id : null                    
                    }).then(function(per){
                    });

                }, 

                filePermissionUpdate:function(cb){
                    res.forEach(function (deletedlist) {
                        FilePermission.create({
                            type        : deletedlist.permission,
                            orphan      : null,
                            AccountId   : deletedlist.account_id,
                            FileId      : deletedlist.deleted_id
                        }).exec(cb);


                        DeletedList.update({
                            id: deletedlist.id
                        }, {
                            deleted_id   : null,
                            directory_id : null                    
                        }).then(function(per){

                        });

                    });
                }
            }, function(err, result){
                if (err) cb(null ,err);
                cb(null, result);
            });
        });
    },


    restoreParent: function(options, cb){

        var array = [];
        var arrayFile = [];

        DeletedList.find({
            directory_id : options.file_id 
        }).then(function (res) {

            res.forEach(function (deletedlist) {
                if( deletedlist.type === 2 ) {
                    if(array.length > 0){
                        if(array.indexOf(deletedlist.deleted_id) === -1){
                            array.push(deletedlist.deleted_id);
                            var opt = { file_id : deletedlist.deleted_id, directory_id : deletedlist.directory_id };
                            DeletedList.udpateDirectory(opt, function(err, file){
                                DeletedList.restoreParent(opt, function(err,file){
                                });
                            });
                        }
                    }else{
                        array.push(deletedlist.deleted_id);
                        var opt = { file_id : deletedlist.deleted_id, directory_id : deletedlist.directory_id };
                        DeletedList.udpateDirectory(opt, function(err, file){
                            DeletedList.restoreParent(opt, function(err,file){
                            });
                        });
                    }
               }else{

                    var fileopt = { file_id : deletedlist.deleted_id, directory_id : deletedlist.directory_id };
                    if(arrayFile.length > 0){
                        if(arrayFile.indexOf(deletedlist.deleted_id) === -1){
                            arrayFile.push(deletedlist.deleted_id);
                            DeletedList.updateFile(fileopt, function(err, file){
                                return cb && cb(null, file);
                            });
                        }
                    }else{
                        arrayFile.push(deletedlist.deleted_id);
                        DeletedList.updateFile(fileopt, function(err, file){
                            return cb && cb(null, file);
                        });
                    }
                }
            });
        });
    },


    updateFile : function(options, cb){

        async.auto({

            fileUpdate: function(cb){

                File.update({
                    id: options.file_id
                }, {
                    deleted         : null,
                    deleteDate      : null,
                    DirectoryId     : options.directory_id === '' ? res[0].directory_id : options.directory_id                    
                }).exec(cb);
            }, 

            filePermissionUpdate:function(cb){
                DeletedList.find({
                    deleted_id : options.file_id 
                }).then(function (res) {
                    res.forEach(function (deletedlist) {
                        
                        FilePermission.create({
                        
                            type        : deletedlist.permission,
                            orphan      : null,
                            AccountId   : deletedlist.account_id,
                            FileId      : deletedlist.deleted_id
                        }).exec(cb);

                        DeletedList.update({
                            id: options.file_id
                        }, {
                            deleted_id   : null,
                            directory_id : null                    
                        }).then(function(per){

                        });
                    });
                });
            }
        }, function(err, result){
            if (err) cb(null ,err);
            cb(null, result);
        });
    },


    udpateDirectory : function(options, cb){

        async.auto({
            fileUpdate: function(cb){
                Directory.update({
                    id: options.file_id
                }, {
                    deleted         : null,
                    deleteDate      : null,
                    DirectoryId     : options.directory_id === '' ? res[0].directory_id : options.directory_id                    
                }).exec(cb);
            }, 

            filePermissionUpdate:function(cb){
                
                DeletedList.find({
                    deleted_id  : options.file_id, 
                    type        : 2 
                }).then(function (res) {
                    res.forEach(function (deletedlist) {

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



                    }, cb());
                });
            }

        }, function(err, result){
            if (err) cb(null ,err);
            cb(null, result);
        });
    }
};
