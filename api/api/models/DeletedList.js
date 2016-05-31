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
    },

    deleteParent: function(options, cb){

        console.log('vgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvgvg');
        var array = [];
        var arrayFile = [];

        DeletedList.find({
            directory_id : options.file_id 
        }).then(function (res) {

            res.forEach(function (deletedlist) {
                if( deletedlist.type === 2 ) {
                    console.log('hmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhmhm');
                    console.log(deletedlist);
                    if(array.length > 0){
                        if(array.indexOf(deletedlist.deleted_id) === -1){
                            array.push(deletedlist.deleted_id);
                            var opt = { file_id : deletedlist.deleted_id, directory_id : deletedlist.directory_id };
                            DeletedList.deleteDirectory(opt, function(err, file){
                                DeletedList.deleteParent(opt, function(err,file){
                                });
                            });
                        }
                    }else{
                        array.push(deletedlist.deleted_id);
                        var opt = { file_id : deletedlist.deleted_id, directory_id : deletedlist.directory_id };
                        DeletedList.deleteDirectory(opt, function(err, file){
                            DeletedList.deleteParent(opt, function(err,file){
                            });
                        });
                    }
               }else{
                    console.log('hnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhnhn');
                    console.log(deletedlist);
                    var fileopt = { file_id : deletedlist.deleted_id, directory_id : deletedlist.directory_id };
                    /*if(arrayFile.length > 0){
                        if(arrayFile.indexOf(deletedlist.deleted_id) === -1){
                            arrayFile.push(deletedlist.deleted_id);
                            DeletedList.deleteFile(fileopt, function(err, file){
                                console.log('callback file 111: '+file);
                                return cb && cb(null, file);
                            });
                        }
                    }else{*/
                        arrayFile.push(deletedlist.deleted_id);
                        DeletedList.deleteFile(fileopt, function(err, file){
                            console.log('callback file 222: '+file);
                            return cb && cb(null, file);
                        });
                    // }
                }
            });
        });


    },


    

    deleteFile : function(options, cb){

        async.auto({

            fileDelete: function(cb){

                console.log('deleting file:::::::::::::::::::::'+options.file_id);
                console.log(options);
                console.log(options.file_id);
                File.findOne(options.file_id).then(function (file) {
                    console.log('S3 START------------file');
                    console.log(file.fsName);

                    // TrashController.deletePermanent();
                    var receiver = global[sails.config.receiver + 'Receiver'].deleteobject({
                        id: file.fsName
                    },function(err,data){
                        console.log('err');
                        console.log(err);
                        console.log(data);
                        console.log('data');

                        var fs = require('fs');

                        DeletedList.destroy({deleted_id:options.file_id}).exec(function (err){
                          if (err) {
                            console.log(err);
                          }
                          console.log('Any file with deleted_id : '+options.file_id+' have now been deleted, if there were any.');
                          // return res.ok();

                            fs.unlink('/var/www/html/olympus/api/files/' + file.fsName, function(err){
                              // if (err) console.log(err);
                            });
                            fs.unlink('/var/www/html/olympus/api/files/thumbnail-' + file.fsName, function(err){
                              // if (err) console.log(err);
                            });
                            fs.unlink('/var/www/html/olympus/api/files/thumbnail-thumbnail-' + file.fsName, function(err){
                              // if (err) console.log(err);
                            });
                            fs.unlink('/var/www/html/olympus/master/public/images/thumbnail/'+file.name, function(err){
                              // if (err) console.log(err);
                            });
                            console.log('returning callback for '+file.fsName);
                            return cb && cb();
                        });
                    });
                    console.log('S3 END------------file');
                });
                console.log('END deleting file:::::::::::::::::::::'+options.file_id);
                // var receiver = global[sails.config.receiver + 'Receiver'].deleteobject({
                //     id: req.param('fsName')
                // },function(err,data){
                //     console.log(err);
                //     console.log(data);
                // });

                // File.destroy({
                //     id: options.file_id
                // }).exec(cb);
            }, 

            // filePermissionUpdate:function(cb){
            //     DeletedList.find({
            //         deleted_id : options.file_id 
            //     }).then(function (res) {
            //         res.forEach(function (deletedlist) {
                        
            //             FilePermission.create({
                        
            //                 type        : deletedlist.permission,
            //                 orphan      : null,
            //                 AccountId   : deletedlist.account_id,
            //                 FileId      : deletedlist.deleted_id
            //             }).exec(cb);

            //             DeletedList.update({
            //                 id: options.file_id
            //             }, {
            //                 deleted_id   : null,
            //                 directory_id : null                    
            //             }).then(function(per){

            //             });


            //         });
            //     });
            // }

        }, function(err, result){
            if (err) cb(null ,err);
            cb(null, result);
        });
    },


    deleteDirectory : function(options, cb){

        async.auto({
            fileDelete: function(cb){

                console.log('deleting directory:::::::::::::::::::::'+options.file_id);
                Directory.destroy({
                    id: options.file_id
                }).exec(cb);
            }, 

            // filePermissionUpdate:function(cb){
                
            //     DeletedList.find({
            //         deleted_id  : options.file_id, 
            //         type        : 2 
            //     }).then(function (res) {
            //         res.forEach(function (deletedlist) {

            //             DirectoryPermission.create({
            //                 type        : deletedlist.permission,
            //                 orphan      : null,
            //                 AccountId   : deletedlist.account_id,
            //                 DirectoryId : deletedlist.deleted_id
            //             }).then(function (perm) {
            //                 // return perm;
            //             });

            //             DeletedList.update({
            //                 id: deletedlist.id
            //             }, {
            //                 deleted_id   : null,
            //                 directory_id : null 
            //             }).then(function(per){

            //             });



            //         }, cb());
            //     });
            // }

        }, function(err, result){
            if (err) cb(null ,err);
            cb(null, result);
        });
    }
};
