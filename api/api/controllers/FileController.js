/*---------------------
 :: File
 -> controller
 ---------------------*/
var crypto = require('crypto'),
        uuid = require('node-uuid'),
        fileService = require('../services/lib/file/util');
        emailService = require('../services/email');
        knox = require('knox');
        fsx = require('fs-extra');
        path = require('path');

var NA = require("nodealytics");
NA.initialize('UA-47189718-1', 'https://www.olympus.io', function () {});

var easyimg = require('easyimage');
//var im = require('imagemagick');


/*%%%%%%%%%%%%%%%%%%%%%% For S3 Resize image file %%%%%%%%%%%%%%%%%%%%%%%%%%*/
//var request = require('request');
//var gm = require("gm");
//var multer = require('multer');
//var AWS = require('aws-sdk');
//var mime = require('mime');
/*%%%%%%%%%%%%%%%%%%%%%% For S3 Resize image file %%%%%%%%%%%%%%%%%%%%%%%%%%*/


var encryptedData = {};



var FileController = {
    /**
     * POST /files/:id/copy
     *
     * Copies a file to a new directory
     *
     * ACL should be done at the policy level before getting here
     * so we can just look up the Account by the `id` param.
     */

    copy: function (req, res) {

        if (!req.param('id')) {
            return res.json({
                error: new Error('Must include a File ID').message,
                type: 'error'
            }, 400);
        }

        // Find the Original File
        return File.findOne(req.param('id')).then(function (file) {
            if (!file) {
                return res.json({
                    error: new Error('No File found with Id ' + req.param('id')).message,
                    type: 'error'
                }, 400);
            }

            // Set the copy to directory, if no given use the current directory
            var dest = req.param('dest', file.DirectoryId);

            // Check to make sure this user has the proper permissions in the target directory
            var permissionCriteria = {
                AccountId: req.session.Account && req.session.Account.id,
                DirectoryId: req.param('dest'),
                type: ['admin', 'write']
            };

            DirectoryPermission.find(permissionCriteria).exec(function (err, perms) {

                if (err)
                    return res.json({
                        error: err.message,
                        type: 'error'
                    }, 400);

                if (perms.length < 1)
                    return res.send(403);

                // Set name if the param is passed in
                var name = req.param('name', file.name);
                file.name = name;

                // Copy the File and it's permissions to the new directory
                file.copy(dest, file.name, function (err, newFile) {
                    if (err)
                        return res.json({
                            error: err.message,
                            type: 'error'
                        }, 400);
                    res.json(newFile);
                });
            });
        }).fail(function (err) {
            sails.log.warn(err);
            return res.json({
                error: new Error('Error copying file').message,
                type: 'error'
            }, 400);
        });
    },
    share: function (req, res) {

	  NA.trackEvent('Share', 'Share', function (err, resp) {
            if (!err && resp.statusCode === 200) {
                console.log('Event has been tracked with Google Analytics');
            }
        });
	

        var fileId = req.params.id;
        var emails = req.param('emails', []);
        var type = req.param('type');

        if (!fileId || emails.length === 0 || !type) {
            return res.json({
                error: 'No file id and/or emails and/or type specified',
                type: 'error'
            });
        }

        var globalFile;
        File.findOne(fileId).then(function (file) {

            // hacks
            globalFile = file;

            // get accounts referenced by email, or create if they don't exist
            var accounts = emails.map(function (email) {

                return Account.findOne({
                    email: email
                }).then(function (account) {

                    if (account)
                        return account;
                    return Account.createAccount({email: email, isVerified: false, isAdmin: false}).then(function (account) {
                        // send an invite email
                        emailService.sendInviteEmail({
                            accountName: req.session.Account && req.session.Account.name || 'Someone',
                            account: account,
                            inode: file,
                            nodeType: 'file'
                        }, function (err, data) {
                            if (err)
                                sails.log.warn(err);
                        });
                        return account;
                    });
                }).fail(function (err) {
                    return null;
                });
            });

            sails.log('The file :: ', file);
            return accounts;

        }).all().then(function (accounts) {

            sails.log('The list of accounts :: ', accounts);
            // grant file permissions
            accounts.map(function (account) {
                if (!account)
                    return;
                globalFile.share(type, account.id, true);
            });

        }).then(function () {
            res.json({status: 'ok'});
        }).fail(function (err) {
            res.json({
                error: err && err.stack,
                type: 'error'
            });
        });
    },
    /**
     * GET /files/:id/share
     * Returns a public link for a file
     * ACL should be done at the policy level before getting here
     * so we can just look up the Account by the `id` param.
     */

    shareurl: function (req, res) {

        var fileId = req.params.id;
        var accountId = req.param('accountId', 1);

        File.findOne(fileId).then(function (file) {

            // If there's no such file, return a 404
            if (!file) {
                return res.json({
                    error: (new Error('No such file')).message,
                    type: 'error'
                }, 400);
            }

            // If the file's public link is disabled, send a 403
            else if (!file.public_link_enabled) {
                return res.json({
                    error: new Error('Forbidden. File public link disabled').message,
                    type: 'error'
                }, 403);
            }
            // Find the file's workgroup
            else {

                function workGroupFinder(dir) {
                    return Directory.findOne({
                        id: dir.DirectoryId
                    }).then(function (dir) {
                        // check if it's a workgroup
                        if (dir && dir.DirectoryId) {
                            return workGroupFinder(dir);
                        }
                        return dir;
                    });
                }

                return workGroupFinder(file).then(function (workgroup) {

                    // If the workgroup doesn't allow public links, send a 403
                    if (workgroup !== null && !workgroup.public_sublinks_enabled) {
                        return res.json({
                            error: new Error('Forbidden. Workgroup public sublinks disabled').message,
                            type: 'error'
                        }, 403);
                    }

                    // Otherwise send the link
                    var publicLink = sails.config.protocol + sails.config.hostName + '/file/public/' + file.fsName + '/' + file.name;
                    sails.log.verbose('Responding with public link for file ' + file.id + ' :: ', publicLink);
                    return res.json({
                        link: publicLink
                    });
                });
            }
        }).fail(function (err) {
            sails.log.warn(err);
            res.json({
                error: err.message,
                type: 'error'
            });
        });
    },
    postComment: function (req, res) {
        var access_token = req.param('account_id');
        AccountDeveloper.findOne({
            access_token: req.param('account_id')
        }).exec(function (err, account) {

            if(account){
                Comment.create({
                    payload: req.param('comment'),
                    AccountId: account.account_id,
                    FileId: req.param('file_id')
                }).exec(function (err, accounts) {
                    if (err)
                        return err;
                    Account.findOne(account.account_id).then(function (file) {
                        accounts.name = file.name;
                        return res.json(accounts, 200);
                    });
                });
            }else{
                return res.json({
                    error: 'No Account found with access_token ' + req.param('account_id'),
                    type: 'token_expire'
                }, 200);
            }
        });
    },
    /**
     * GET /files/:id/thumbnail
     *
     * Returns a thumbnail for the file
     *
     * ACL should be done at the policy level before getting here
     * so we can just look up the Account by the `id` param.
     */

    thumbnail: function (req, res) {
        if (!req.param('id')) {
            return res.json({
                error: new Error('Must include a File ID').message,
                type: 'error'
            }, 400);
        }

        File.findOne(req.param('id')).exec(function (err, file) {
            if (!file) {
                return res.json({
                    error: new Error('No File found with Id ' + req.param('id')).message,
                    type: 'error'
                }, 400);
            }
            res.json(file, 200);
        });
    },
    download: function (req, res) {
	  NA.trackEvent('Download', 'Download File', function (err, resp) {});


        async.auto({
            getAdapterId: function(cb) {

                File.findOne({where:{fsName:(req.param('id')).replace('thumbnail-','')}}).done(cb);
            },
            getAdapter: ['getAdapterId', function(cb, up) {

                uploadPaths.findOne({where:{id:up.getAdapterId.uploadPathId}}).done(cb);
            }],
            downloadTask: ['getAdapter', function(cb, up) {

                var current_receiver        = up.getAdapter.type;
                var current_receiverinfo    = up.getAdapter;
                console.log('File Receiver: '+current_receiver);

                var emitter = global[current_receiver + 'Receiver'].newEmitterStream({id: req.param('id'), stream: res, receiverinfo: current_receiverinfo});
                emitter.on('finish', function () {
                    res.end();
                });
                emitter.pipe(res);
            }]
        });
    },
    
 thumbnaildownload: function (req, res) {

        
    //Rishabh: START async.auto
    async.auto({
        getAdapterId: function(cb) {

            File.findOne({where:{fsName:(req.param('id')).replace('thumbnail-','')}}).done(cb);
        },
        getAdapter: ['getAdapterId', function(cb, up) {

            uploadPaths.findOne({where:{id:up.getAdapterId.uploadPathId}}).done(cb);
        }],
        thumbDownloadTask: ['getAdapter', function(cb, up) {

            var current_receiver        = up.getAdapter.type;
            var current_receiverinfo    = up.getAdapter;
            console.log('File Receiver: '+current_receiver);
            console.log(current_receiverinfo.path);

            var thumb   = path.resolve(current_receiverinfo.path||'/var/www/html/olympus/api/files/', 'thumbnail-'+req.param('id'));
            var mainFile= path.resolve(current_receiverinfo.path||'/var/www/html/olympus/api/files/', req.param('id'));

            fsx.exists(thumb, function(exists) { 

                if(exists){ 
                    // If thubnail exists then  create a stream of file and download that file
                    var emitter =   global[ 'DiskReceiver' ].newThumbEmitterStream({ id: req.param('id'), stream: res, thumb: '1', receiverinfo: current_receiverinfo });
                    emitter.on('finish', function () { res.end(); });
                    emitter.pipe(res); 
                } else {

                    if( current_receiver === 'Disk'){
                        // console.log('sails.config.disk.uploadPathHH');
                        // console.log(sails.config.disk.uploadPath);
                        fsx.exists((path.resolve(current_receiverinfo.path||'files', req.param('id'))), function(exists) {
                            if(exists){
                                easyimg.resize({
                                    src: (current_receiverinfo.path||'files/')+''+req.param('id'), 
                                    dst: ('files/')+'thumbnail-'+req.param('id'), width: 150, height: 150
                                }).then(
                                    function(image) {
                                        easyimg.resize({
                                            src: (current_receiverinfo.path||'files/')+''+req.param('id'), 
                                            dst: '/var/www/html/olympus/master/public/images/thumbnail-'+req.param('id'), width: 150, height: 150
                                        });
                                        console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
                                    },
                                    function (err) {
                                        console.log(err);
                                    }
                                );
                            }
                        });
                    }
                    if(current_receiver == 'Disk' || current_receiver == 'S3'){
                        // fsx.exists((path.resolve(sails.config.disk.uploadPath||'files', req.param('id'))), function(exists) {
                        //     if(exists){
                                // If thumbnail of file does not exists then make a call to its corresponding receiver
                                var emitter = global[ current_receiver + 'Receiver' ].newThumbEmitterStream({id: (req.param('id')).replace('thumbnail-',''), stream: res, thumb: '0', receiverinfo: current_receiverinfo });
                                if(emitter){//emitter is not null(maybe null when file does not exist)
                                    emitter.on('finish', function () { res.end(); });
                                    emitter.pipe(res);
                                }
                        //     }
                        // });
                    }
                }
            });
        }]
    });
        
},



    upload: function (req, res) {



        NA.trackEvent('Upload File', 'Upload File', function (err, resp) {});
        res.setTimeout(0);


        if (req.param('Filename')) {
            var uploadStream = req.file('Filedata');
        } else {
            var uploadStream = req.file('files[]');
        }

        console.log(uploadStream);

        if(uploadStream._files[0].stream.byteCount == 0){//Rishabh: Server Side Fix, if Client Side check bypassed
            // console.log(uploadStream._files[0].stream.byteCount);
            return res.end(JSON.stringify({error: 'empty_file_error'}), 'utf8');
        }

        uploadStream.on('error', function (err) {
            console.log('APIERRORAPIERRORAPIERRORAPIERRORAPIERRORAPIERRORAPIERROR');
            console.log(err);
            return res.end(JSON.stringify({error: err}), 'utf8');
        });


        if (req.param('data')) {
            data = JSON.parse(req.param('data'));
        } else if (req.param('id')) {
            data = {parent: {id: req.param('id')}};
        } else if (req.param('parent_id')) {
            data = {parent: {id: req.param('parent_id')}};
        }else{
            return res.end(JSON.stringify({error: "no data retrieved."}), 'utf8');
        }

// console.log('LLLLLLLLLLLLLLLLLLLLLLLLHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
// console.log(req);
// console.log('LLLLLLLLLLLLLLLLLLLLLLLLHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');

        if (typeof req.headers['user-agent'] != 'undefined' && req.headers['user-agent'].indexOf('AdobeAIR') > -1) {
            var user_platform = "desktopApp";
        } else {
            var user_platform = req.headers['user-agent'];
        }
        console.log(user_platform);

        console.log('checking...');
        //return res.end(JSON.stringify({error: 'empty_file_error'}), 'utf8');
        //Rishabh: START async.auto
        async.auto({
            getAdapter: function(cb) {
                //Check if it is Drive Synced Directory
                Directory.findOne({
                    id: data.parent.id//dir.DirectoryId
                }).then(function (dir) {
                    
                    if (dir && ( dir.isOlympusDriveDir || dir.isDriveDir) ) {//Do Drive Upload

                        console.log('sails.configsails.configsails.configsails.configsails.configsails.configsails.configsails.config');
                        fsx.readFile( sails.config.appPath + "/../master/public/drive_secret/" + 'client_secret.json', function processClientSecrets(err, content) {
                        
                            if (err) {
                                console.log('Error loading client secret file: ' + err);
                                return;
                            }

                            sails.controllers.directory.authorize('file_upload_by_pathID', dir.uploadPathId, null, JSON.parse(content), function (auth, driveUploadPathId) {

                                cb(null, { type: 'Drive',
                                    auth: auth,
                                    drivepathid: dir.uploadPathId,
                                    driveFsName: dir.driveFsName,
                                    isOlympusDriveDir: dir.isOlympusDriveDir,
                                });
                            });
                        });
                    }else if (dir && ( dir.isOlympusDropboxDir || dir.isDropboxDir) ) {//Do Dropbox Upload

                        SyncDbox.findOne({where:{id: dir.uploadPathId}}).done( function (err, tokenrow) {
                            if (err) {
                                console.log('Error loading client secret file: ' + err);
                                return;
                            }

                            if( tokenrow ){
                                cb(null, { type: 'Dropbox',
                                    auth: tokenrow,
                                    dbxpath: dir.driveFsName,
                                    isOlympusDropboxDir: dir.isOlympusDropboxDir,
                                });
                            }
                        });

                    }
                    else if (dir && ( dir.isOlympusBoxDir || dir.isBoxDir) ) {//Do Box Upload

                        SyncBox.findOne({where:{id: dir.uploadPathId}}).done( function (err, tokenrow) {
                            if (err) {
                                console.log('Error loading client secret file: ' + err);
                                return;
                            }

                            if( tokenrow ){
                                cb(null, { type: 'Box',
                                    auth: tokenrow,
                                    dbxpath: dir.driveFsName,
                                    isOlympusBoxDir: dir.isOlympusBoxDir,
                                });
                            }
                        });

                    }
                    else{//Do normal Disk/S3/Ormuco upload
                        uploadPaths.findOne({where:{isActive:1}}).done(cb);
                    }
                });
            },
            uploadFileTask: ['getAdapter', function(cb, up) {
        console.log('user-agent');
        //console.log(up);console.log(req.param('data'));
        //return res.end(JSON.stringify({error: 'adapter_error'}), 'utf8');
        
                var current_receiver        = up.getAdapter.type;
                var current_receiverinfo    = up.getAdapter;

                //  Get the current workgroup size
                Directory.workgroup({id: data.parent.id}, function (err, workgroup) {


                    /*if(current_receiver == 'S3'){//copy in Disk for checksum
                        var receiverdisk = global[ 'DiskReceiver'].newReceiverStream({
                            maxBytes: workgroup.quota - workgroup.size,
                            totalUploadSize: req.headers['content-length'],
                            receiverinfo: {receiverinfo:{path: '/var/www/html/olympus/api/files/'}}
                        });

                        receiverdisk.on('progress', function (progressData) {
                            console.log('77777777777777777777777777777777777777777');
                            progressData.parentId = typeof req.param('data') == 'undefined' ? req.param('parent_id') : data.parent.id;
                            res.write(JSON.stringify(progressData), 'utf8')
                        }).on('error', function(err){
                            console.log('hththththhthththththththhthththththththhthththththththhththt');
                            // return res.end(JSON.stringify({error: 'dashgdjashgdjsajdg'}), 'utf8');
                        });
                    }*/


console.log(current_receiverinfo);
                    var receiver = global[ current_receiver+ 'Receiver'].newReceiverStream({
                        maxBytes: workgroup.quota - workgroup.size,
                        totalUploadSize: req.headers['content-length'],
                        receiverinfo: current_receiverinfo
                    });


                    receiver.on('progress', function (progressData) {
                        console.log('22222222222222222222222222222222222222222222');
                        progressData.parentId = typeof req.param('data') == 'undefined' ? req.param('parent_id') : data.parent.id;
                        res.write(JSON.stringify(progressData), 'utf8')
                    }).on('error', function(err){
                        console.log(err);
                        console.log('hththththhthththththththhthththththththhthththththththhththt');
                        return res.end(JSON.stringify({error: 'adapter_error'}), 'utf8');
                    });
                    

        console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
        //return res.end(JSON.stringify({error: 'adapter_error'}), 'utf8');




        //Rishabh
        // In a FileController.js or similar controller...

        /*var d = require('domain').create()

        // Intentional noop - only fired when a file upload is aborted and the actual
        // error will be properly passed to the function callback below
        d.on('error', function (err) {console.log('testOOOtestOOOtestOOOtestOOOtestOOOtestOOOtestOOO');
            console.log(err);
            return res.end(JSON.stringify({error: 'dashgdjashgdjsajdg1'}), 'utf8');})
        //Rishabh

        d.run(function safelyUpload () {*/ //Rishabh
                    uploadStream.upload(receiver, function (err, files) {
                        console.log('333333333333333333333333333333333333333333');
                        //return res.end(JSON.stringify({error: 'adapter_error'}), 'utf8');

                        if (err) {
                            console.log('jhonjhonjhonjhonjhonjhonjhonjhonjhonjhonjhonjhonjhonjhon');
                            console.log(err);
                            console.log('jhon22jhon22jhon22jhon22jhon22jhon22jhon22jhon22jhon22jhon22');
                            return res.end(JSON.stringify({error: 'dashgdjashgdjsajdg2'}), 'utf8');
                        }
                        else if(files.length === 0){
                            // proceed without files
                            return res.end(500, {"error": "no file uploaded"});
                        }

                        var file = files[0];
                        if (file === undefined) {
                            return res.end(JSON.stringify({error: 'dashgdjashgdjsajdg3'}), 'utf8');
                        }

                        // if( (typeof file.extra.Code == 'undefined') && file.extra.Code == 'MalformedXML' ){
                        //     console.log('MalformedXMLHandledMalformedXMLHandledMalformedXMLHandled');
                        //     return res.end(JSON.stringify({error: 'MalformedXML'}), 'utf8');   
                        // }


                        var mimetype = 'application/octet-stream';
                        var ext = (file.filename).split(".").slice(1).pop();
                        ext = ext?ext:'';
                        console.log('original file extension: '+file.type);
                        console.log('file extension:'+ext);
                        switch('.'+ext){

                            case '.png':
                            mimetype='image/png';
                            break;

                            case '.jpg':
                            case '.jpeg':
                            mimetype='image/jpeg';
                            break;

                            case '.3gp':
                            mimetype='video/3gpp';
                            break;

                            case '.mp3': 
                            mimetype='audio/mp3';
                            break;

                            case '.mp4': 
                            mimetype='video/mp4';
                            break;

                            case '.MOV':
                            case '.Mov':
                            case '.mov':
                            mimetype='video/quicktime';
                            break;

                            case '.mkv': 
                            mimetype='audio/mpeg';
                            break;

                            case '.pdf': 
                            mimetype='application/pdf';
                            break;

                           case '.doc':
                           case '.dot': 
                           mimetype='application/msword';
                           break;

                           case '.html': 
                           mimetype='text/html';
                           break;

                           case '.exe': 
                           mimetype='application/octet-stream';
                           break;

                           case '.apk': 
                           mimetype='application/vnd.android.package-archive';
                           break;

                           case '.zip': 
                           mimetype='application/x-zip-compressed';
                           break;
                           
                           case '.docx': 
                           mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                           break;

                           case '.dotx': 
                           mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.template';
                           break;

                           case '.docm':
                           mimetype='application/vnd.ms-word.document.macroEnabled.12';
                           break;

                           case '.dotm': 
                           mimetype='application/vnd.ms-word.template.macroEnabled.12';
                           break;

                           case '.xls':
                           case '.xlt':
                           case '.xla':
                           mimetype='application/vnd.ms-excel';
                           break;

                           case '.xlsx':
                           mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                           break;

                           case '.xltx':
                           mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.template';
                           break;

                           case '.xlsm':
                           mimetype='application/vnd.ms-excel.sheet.macroEnabled.12';
                           break;

                           case '.xltm':
                           mimetype='application/vnd.ms-excel.template.macroEnabled.12';
                           break;

                           case '.xlam':
                           mimetype='application/vnd.ms-excel.addin.macroEnabled.12';
                           break;

                           case '.xlsb':
                           mimetype='application/vnd.ms-excel.sheet.binary.macroEnabled.12';
                           break;

                           case '.ppt':
                           case '.pot':
                           case '.pps':
                           case '.ppa':
                           mimetype='application/vnd.ms-powerpoint';
                           break;

                           case '.pptx': 
                           mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation';
                           break; 

                           case '.potx':
                           mimetype='application/vnd.openxmlformats-officedocument.presentationml.template';
                           break;

                           case '.ppsx':
                           mimetype='application/vnd.openxmlformats-officedocument.presentationml.slideshow';
                           break;

                           case '.ppam':
                           mimetype='application/vnd.ms-powerpoint.addin.macroEnabled.12';
                           break;

                           case '.pptm':
                           mimetype='application/vnd.ms-powerpoint.presentation.macroEnabled.12';
                           break;

                           case '.potm':
                           mimetype='application/vnd.ms-powerpoint.template.macroEnabled.12';
                           break;

                           case '.ppsm':
                           mimetype='application/vnd.ms-powerpoint.slideshow.macroEnabled.12';
                           break;

                           case '.sldx':
                           mimetype='application/vnd.openxmlformats-officedocument.presentationml.slide';
                           break;

                           case '.sldm':
                           mimetype='application/vnd.ms-powerpoint.slide.macroEnabled.12';
                           break;

                           case '.one':
                           case '.onetoc2':
                           case '.onetmp':
                           case '.onepkg':
                           mimetype='application/msonenote';
                           break;

                           case '.thmx':
                           mimetype='application/vnd.ms-officetheme';
                           break;

                           default:
                            mimetype=file.type;//file.type
                        }

                        console.log('Mimetype to be used: '+mimetype);




                        // Find the file with the same name in a database             
                        File.findOne({
                            name: file.filename,
                            DirectoryId: data.parent.id,
                        }).exec(function (err, fileData) {
                            // If File exist in a database then find the maximum version of that file 
        console.log('44444444444444444444444444444444444444');

                            if (fileData) {


                                var versionData = new Array();
                                var fileVersionData = new Array();

                                Version.find({
                                    parent_id: fileData.id
                                }).done(function (err, maxData) {
        console.log('55555555555555555555555555555555555555');
                                    if (maxData.length == '0') {

                                        if (fileData.size == file.size) {
                                            streamAdaptor.firstFile(
                                                    {first: fileData.fsName, second: file.extra.fsName, receiverpath: current_receiverinfo.path}, function (rmErr) {
                                                        console.log('666666666666666666666666666666666');
                                                var parsedResponse = JSON.parse(rmErr)
                                                if(rmErr.error === false){//Rishabh: check for error
                                                    if (parsedResponse.first === parsedResponse.second) {
                                                        // fsx.unlink('/var/www/html/olympus/api/files/' + file.extra.fsName);
                                                        // fsx.unlink('/home/alcanzar/api/files/'+file.extra.fsName);
                                                        if(user_platform == 'desktopApp'){
                                                            return res.end(JSON.stringify({error: "FileExist",filedata:fileData}), 'utf8');
                                                        }else{
                                                            return res.end(JSON.stringify({error: "FileExist"}), 'utf8');
                                                        }
                                                    }
                                                }else{
                                                    res.end(JSON.stringify({
                                                        origParams: req.params.all(),
                                                        name: file.filename,
                                                        size: file.size,
                                                        fsName: file.extra.fsName,
                                                        mimetype: mimetype,//file.type,
                                                        version: parseInt(findMax) + 1,
                                                        oldFile: fileData.id,
                                                        thumbnail: "1",
                                                    }), 'utf8');
                                                }
                                            });
                                        } else {
                                            console.log('77777777777777777777777777777777777');
                                            res.end(JSON.stringify({
                                                origParams: req.params.all(),
                                                name: file.filename,
                                                size: file.size,
                                                fsName: file.extra.fsName,
                                                mimetype: mimetype,//file.type,
                                                version: '1',
                                                oldFile: fileData.id,
                                                thumbnail: "1",
                                            }), 'utf8');
                                        }
                                    } else {
        console.log('888888888888888888888888888888888888');
                                        maxData.forEach(function (applicant) {
                                            versionData.push(applicant.version);
                                            fileVersionData.push(applicant.FileId);
                                        });
        console.log(versionData);
        console.log('fileVersionData');
        console.log(fileVersionData);
                                        var findMax = Math.max.apply(Math, versionData);
                                        var maxElementIndex = versionData.indexOf(Math.max.apply(Math, versionData));
        console.log('masElementIndex');
        console.log(maxElementIndex);
                                        File.findOne({
                                            id: fileVersionData[maxElementIndex]
                                        }).done(function (err, latestFile) {

                                            if (err) {
                                                return res.write(JSON.stringify({error: err}), 'utf8');
                                            }
                                            console.log('999999999999999999999999999999');
                                            console.log(file);
                                            console.log('747474747474747474747474747474');
                                            console.log(latestFile);

                                            console.log('sails.config.receiver'+sails.config.receiver);

                                            // if (latestFile.size == file.size && sails.config.receiver === 'Disk') 
                                            if (latestFile.size == file.size) 
                                            {
                                                console.log('latestFile.md5checksumlatestFile.md5checksumlatestFile.md5checksum');
                                                console.log(latestFile);
                                                console.log(latestFile.md5checksum);
                                                console.log('latestFile.md5checksumlatestFile.md5checksumlatestFile.md5checksum');
                                                async.auto({
                                                    first: function(cb) {
                                                        if(latestFile.md5checksum != ''){
                                                            cb(null, latestFile.md5checksum);
                                                        }else if(true){
                                                            console.log('handle empty checksum case of OLD FILES');
                                                            console.log('handle empty checksum case of OLD FILES');
                                                            console.log('handle empty checksum case of OLD FILES');
                                                            console.log('handle empty checksum case of OLD FILES');
                                                            console.log('handle empty checksum case of OLD FILES');
                                                            /*var hash = crypto.createHash('md5');
                                                            console.log('cbfirstcbfirstcbfirstcbfirstcbfirstcbfirst');
                                                            console.log(cb);
                                                            var s = fsx.createReadStream(('/var/www/html/olympus/api/files/' || 'files/')+'' + latestFile.fsName);
                                                            s.on('readable', function () {
                                                                console.log('firstFileReadable');
                                                                var chunk;
                                                                while (null !== (chunk = s.read())) {
                                                                    hash.update(chunk);
                                                                }
                                                            }).on('end', function () {
                                                                console.log('firstFileEnd');
                                                                console.log(cb);
                                                                // encryptedData["first"] = hash.digest('hex');
                                                                console.log(encryptedData);
                                                                cb(null, hash.digest('hex'));
                                                            }).on('error', function(e){
                                                                console.log('firstFileError');
                                                                console.log(e);
                                                                cb(null, 'ENOENT');
                                                            });*/
                                                        }
                                                    },
                                                    second: function(cb) {
                                                        /*var hs = crypto.createHash('md5');
                                                        var nw = fsx.ReadStream(('/var/www/html/olympus/api/files/' ||'files/')+'' + file.extra.fsName);
                                                        nw.on('readable', function () {
                                                            console.log('nwReadable');
                                                            var chunk;
                                                            while (null !== (chunk = nw.read())) {
                                                                hs.update(chunk);
                                                            }
                                                        }).on('end', function () {
                                                            console.log('nwEnd');
                                                            console.log(cb);
                                                            // encryptedData["second"] = hs.digest('hex');
                                                            console.log(encryptedData);
                                                            cb(null, hs.digest('hex'));
                                                        }).on('error', function(e){
                                                            console.log('nwError');
                                                            console.log(e);
                                                            cb(null, 'ENOENT');
                                                        });*/

                                                        if(current_receiver == 'S3'){
                                                            // console.log(file);
                                                            var emitter = global[ current_receiver + 'Receiver' ].md5EmitterStream({id: (file.extra.fsName).replace('thumbnail-',''), stream: res, thumb: '0', receiverinfo: current_receiverinfo },function(hasherr, hashresp){
                                                                console.log('checkfileS3###responsecheckfileS3###responsecheckfileS3###response');
                                                                if(hasherr){
                                                                    cb(null, 'ENOENT');
                                                                }
                                                                console.log(hashresp);
                                                                cb(null, hashresp);
                                                            });
                                                        }else if(current_receiver == 'Disk'){//Disk
                                                            var hash = crypto.createHash('md5');
                                                            console.log('cbfirstcbfirstcbfirstcbfirstcbfirstcbfirst');
                                                            console.log(cb);
                                                            var s = fsx.createReadStream((sails.config.appPath + '/files/' || 'files/')+'' + file.extra.fsName);
                                                            s.on('readable', function () {
                                                                console.log('firstFileReadable');
                                                                var chunk;
                                                                while (null !== (chunk = s.read())) {
                                                                    hash.update(chunk);
                                                                }
                                                            }).on('end', function () {
                                                                console.log('firstFileEnd');
                                                                console.log(cb);
                                                                // encryptedData["first"] = hash.digest('hex');
                                                                console.log(encryptedData);
                                                                cb(null, hash.digest('hex'));
                                                            }).on('error', function(e){
                                                                console.log('firstFileError');
                                                                console.log(e);
                                                                cb(null, 'ENOENT');
                                                            });
                                                        }else if(current_receiver == 'Ormuco'){
                                                            var hash = crypto.createHash('md5');
                                                            console.log('cbfirstcbfirstcbfirstcbfirstcbfirstcbfirst');
                                                            // console.log(file.extra)
                                                            // console.log(cb);
                                                            if(file.extra){
                                                                cb(null, file.extra.hash);
                                                            }else{
                                                                cb(null, 'ENOENT');
                                                            }
                                                        }else if(current_receiver == 'Drive'){
                                                            // var hash = crypto.createHash('md5');
                                                            console.log('cbfirstcbfirstcbfirstcbfirstcbfirstcbfirst');
                                                            // console.log(file.extra)
                                                            // console.log(cb);
                                                            if(file.extra){
                                                                cb(null, file.extra.md5Checksum);//md5Checksum != md5checksum
                                                            }else{
                                                                cb(null, 'ENOENT');
                                                            }
                                                        }
                                                    },
                                                    comparefiles: ['first','second', function(cb, response) {

                                                        console.log('upupupupupupupupupupupupupupupupupupup');
                                                        console.log(response);
                                                        console.log('upupupupupupupupupupupupupupupupupupup');

                                                        if(response.first !== 'ENOENT' && response.second !== 'ENOENT' && (response.first === response.second)){//Rishabh: check for error
                                                            console.log('SAME FILE WITH SAME NAME');
                                                            // if (parsedResponse.first === parsedResponse.second) {
                                                                // console.log('567567567567567567567567567567567567567567567');
                                                                // console.log(parsedResponse);
                                                                //fsx.unlink('/var/www/html/olympus/api/files/' + file.extra.fsName);
                                                                // fsx.unlink('/home/alcanzar/api/files/'+file.extra.fsName);
                                                                if(user_platform == 'desktopApp'){
                                                                    return res.end(JSON.stringify({error: "FileExist",filedata:latestFile}), 'utf8');
                                                                }else{
                                                                    console.log('414141414141414141414141');
                                                                    // res.end(JSON.stringify({
                                                                    //     origParams: req.params.all(),
                                                                    //     name: file.filename,
                                                                    //     size: file.size,
                                                                    //     fsName: file.extra.fsName,
                                                                    //     mimetype: file.type,
                                                                    //     version: 0,//parseInt(findMax) + 1,
                                                                    //     oldFile: 0,//fileData.id,
                                                                    //     thumbnail: "1",
                                                                    // }), 'utf8');
return res.end(JSON.stringify({error: "FileExist"}), 'utf8');
                                                                    return res.end(JSON.stringify({error: "FileExist",filedata:fileData}), 'utf8');
                                                                }
                                                            // }
                                                        }else{
                                                            console.log('234234234234234234234234234234234234234234234');
                                                            res.end(JSON.stringify({
                                                                origParams: req.params.all(),
                                                                name: file.filename,
                                                                size: file.size,
                                                                fsName: file.extra.fsName,
                                                                mimetype: mimetype,//file.type,
                                                                version: parseInt(findMax) + 1,
                                                                oldFile: fileData.id,
                                                                thumbnail: "1",
                                                                md5checksum: response.second
                                                            }), 'utf8');
                                                        }
                                                    }]
                                                });
                                            } else {
                                                console.log('1212121212121212121212121212121212');
                                                async.auto({
                                                    first: function(cb) {
                                                        if(current_receiver == 'S3'){
                                                            // console.log(file);
                                                            var emitter = global[ current_receiver + 'Receiver' ].md5EmitterStream({id: (file.extra.fsName).replace('thumbnail-',''), stream: res, thumb: '0', receiverinfo: current_receiverinfo },function(hasherr, hashresp){
                                                                console.log('checkfileS3###responsecheckfileS3###responsecheckfileS3###response');
                                                                if(hasherr){
                                                                    cb(null, 'ENOENT');
                                                                }
                                                                console.log(hashresp);
                                                                cb(null, hashresp);
                                                            });
                                                        }else{//Disk
                                                            var hash = crypto.createHash('md5');
                                                            console.log('cbfirstcbfirstcbfirstcbfirstcbfirstcbfirst');
                                                            console.log(cb);
                                                            var s = fsx.createReadStream(('/var/www/html/olympus/api/files/' || 'files/')+'' + file.extra.fsName);
                                                            s.on('readable', function () {
                                                                console.log('firstFileReadable');
                                                                var chunk;
                                                                while (null !== (chunk = s.read())) {
                                                                    hash.update(chunk);
                                                                }
                                                            }).on('end', function () {
                                                                console.log('firstFileEnd');
                                                                console.log(cb);
                                                                // encryptedData["first"] = hash.digest('hex');
                                                                console.log(encryptedData);
                                                                cb(null, hash.digest('hex'));
                                                            }).on('error', function(e){
                                                                console.log('firstFileError');
                                                                console.log(e);
                                                                cb(null, 'ENOENT');
                                                            });
                                                        }
                                                    },
                                                    comparefiles: ['first', function(cb, response) {

                                                        console.log('upupupupupupupupupupupupupupupupupupup');
                                                        console.log(response);
                                                        console.log('upupupupupupupupupupupupupupupupupupup');

                                                        if(response.first !== 'ENOENT'){//Rishabh: check for error
                                                                    
                                                            res.end(JSON.stringify({
                                                                origParams: req.params.all(),
                                                                name: file.filename,
                                                                size: file.size,
                                                                fsName: file.extra.fsName,
                                                                mimetype: mimetype,//file.type,
                                                                version: parseInt(findMax) + 1,
                                                                oldFile: fileData.id,
                                                                thumbnail: "1",
                                                                md5checksum: response.first
                                                            }), 'utf8');
                                                        }else{
                                                            res.end(JSON.stringify({
                                                                origParams: req.params.all(),
                                                                name: file.filename,
                                                                size: file.size,
                                                                fsName: file.extra.fsName,
                                                                mimetype: mimetype,//file.type,
                                                                version: parseInt(findMax) + 1,
                                                                oldFile: fileData.id,
                                                                thumbnail: "1",
                                                                md5checksum: 'nochecksum'
                                                            }), 'utf8');
                                                        }
                                                    }]
                                                });
                                            }
                                        });
                                    }
                                });

                            } else {
                                console.log('apiFILEapiFILEapiFILEapiFILEapiFILEapiFILEapiFILEapiFILEapiFILE');
                                return res.end(JSON.stringify({error: 'adapter_error'}), 'utf8');
                                async.auto({
                                    first: function(cb) {
                                        if(current_receiver == 'S3'){
                                            // console.log(file);
                                            var emitter = global[ current_receiver + 'Receiver' ].md5EmitterStream({id: (file.extra.fsName).replace('thumbnail-',''), stream: res, thumb: '0', receiverinfo: current_receiverinfo },function(hasherr, hashresp){
                                                console.log('checkfileS3###responsecheckfileS3###responsecheckfileS3###response');
                                                if(hasherr){
                                                    cb(null, 'ENOENT');
                                                }
                                                console.log(hashresp);
                                                cb(null, hashresp);
                                            });
                                        }else{//Disk
                                            var hash = crypto.createHash('md5');
                                            console.log('cbfirstcbfirstcbfirstcbfirstcbfirstcbfirst');
                                            console.log(cb);
                                            var s = fsx.createReadStream(('/var/www/html/olympus/api/files/' || 'files/')+'' + file.extra.fsName);
                                            s.on('readable', function () {
                                                console.log('firstFileReadable');
                                                var chunk;
                                                while (null !== (chunk = s.read())) {
                                                    hash.update(chunk);
                                                }
                                            }).on('end', function () {
                                                console.log('firstFileEnd');
                                                console.log(cb);
                                                // encryptedData["first"] = hash.digest('hex');
                                                console.log(encryptedData);
                                                cb(null, hash.digest('hex'));
                                            }).on('error', function(e){
                                                console.log('firstFileError');
                                                console.log(e);
                                                cb(null, 'ENOENT');
                                            });
                                        }
                                    },
                                    comparefiles: ['first', function(cb, response) {

                                        console.log('upupupupupupupupupupupupupupupupupupup');
                                        console.log(response);
                                        console.log('upupupupupupupupupupupupupupupupupupup');

                                        if(current_receiver == 'Box'){

                                            console.log('ifHERE ifHERE ifHERE ifHERE ifHERE ifHERE ');
                                            //Do not pick file.filename as new file can be versioned
                                            var dropboxnode_name = file.extra.path.split("/").pop();//.replace(/\//g,'');

                                            res.end(JSON.stringify({
                                                origParams: req.params.all(),
                                                name: dropboxnode_name,
                                                size: file.extra.bytes,
                                                fsName: file.extra.rev,
                                                mimetype: file.extra.mime_type,//file.type,
                                                version: 0,
                                                oldFile: 0,
                                                thumbnail: file.extra.thumb_exists,//"1",

                                                //extra drive attributes
                                                md5checksum: null,//md5Checksum != md5checksum
                                                parentId: data.parent.id,//parsedFormData.parent.id,
                                                uploadPathId: current_receiverinfo.auth.id,//SyncDbox.id
                                                isOnBox: "1",
                                                // viewLink: file.extra.webViewLink,
                                                downloadLink: file.extra.path,
                                                iconLink: file.extra.icon,
                                            }), 'utf8');

                                        }else if(response.first !== 'ENOENT'){//Rishabh: check for error

                                            res.end(JSON.stringify({
                                                origParams: req.params.all(),
                                                name: file.filename,
                                                size: file.size,
                                                fsName: file.extra.fsName,
                                                mimetype: mimetype,//file.type,
                                                version: 0,
                                                oldFile: 0,
                                                thumbnail: "1",
                                                md5checksum: response.first
                                            }), 'utf8');
                                        }else{

                                            res.end(JSON.stringify({
                                                origParams: req.params.all(),
                                                name: file.filename,
                                                size: file.size,
                                                fsName: file.extra.fsName,
                                                mimetype: mimetype,//file.type,
                                                version: 0,
                                                oldFile: 0,
                                                thumbnail: "1",
                                                md5checksum: 'nochecksum'
                                            }), 'utf8');
                                        }
                                    }]
                                });
                            }


                            if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
                                console.log('1414141414141414141414141414141414');
                                if (current_receiver == "S3") {
                                }  else {
        console.log('151515151515151515151515151515151515151515151515151515151515151515151515');
                                    easyimg.resize({src: (current_receiverinfo.path||'files/')+'' + file.extra.fsName, dst: (current_receiverinfo.path||'files/')+'thumbnail-' + file.extra.fsName, width: 150, height: 150}, function (err, stdout, stderr) {
                                        if (err){
                                            // throw err;
                                            // return res.write(JSON.stringify({error: "ImageResizeError",desc: err}), 'utf8');
                                            console.log('Image not Resized to api/files/');
                                        }else{
                                            console.log('Resized to 100x100');
                                        }
                                    });


                                     easyimg.resize({src: (current_receiverinfo.path||'files/')+'' + file.extra.fsName, dst: sails.config.linuxPath+'master/public/images/thumbnail/'+file.filename, width: 150, height: 150}, function (err, stdout, stderr) {
                                        if (err){
                                            // throw err;
                                            // return res.write(JSON.stringify({error: "ImageResizeError",desc: err}), 'utf8');
                                            console.log('Image not Resized to master/public/images/thumbnail/');
                                        }else{
                                            console.log('Resized to 100x100');
                                        }
                                    });

                                }
                            }


                        });
                    });
        //})//end d.run-Rishabh



                });


            }]
        });
        //Rishabh: END async.auto



    }


};

var streamAdaptor = {
    firstFile: function (options, cb) {
        var hash = crypto.createHash('md5');
        var s = fsx.createReadStream((options.receiverpath||'files/')+'' + options.first);
        s.on('readable', function () {
            var chunk;
            while (null !== (chunk = s.read())) {
                hash.update(chunk);
            }
        }).on('end', function () {
            encryptedData["first"] = hash.digest('hex');

            ///Rishabh
            /*var hs = crypto.createHash('md5');
            var nw = fsx.ReadStream('/var/www/html/olympus/api/files/' + options.second);
            nw.on('readable', function () {
                var chunk;
                while (null !== (chunk = nw.read())) {
                    hs.update(chunk);
                }
            }).on('end', function () {
                encryptedData["second"] = hs.digest('hex');
                return cb(JSON.stringify(encryptedData));
            }).on('error', function(){
                return cb(JSON.stringify({error:'Latest file is missing.'}));
            });*/
            ///end-Rishabh
            
        }).on('error', function(e){
            console.log(e);
            return cb(JSON.stringify({error:'Old file is missing.'}));
        });

        var hs = crypto.createHash('md5');
        var nw = fsx.ReadStream((options.receiverpath||'files/')+'' + options.second);
        nw.on('readable', function () {
            var chunk;
            while (null !== (chunk = nw.read())) {
                hs.update(chunk);
            }
        }).on('end', function () {
            encryptedData["second"] = hs.digest('hex');
        }).on('error', function(e){
            console.log(e);
            return cb(JSON.stringify({error:'Latest file is missing.'}));
        });
        return cb(JSON.stringify(encryptedData));
    }
};

module.exports = FileController;
