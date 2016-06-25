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
        var emitter = global[sails.config.receiver + 'Receiver'].newEmitterStream({id: req.param('id'), stream: res});
        emitter.on('finish', function () {
            res.end();
        });
        emitter.pipe(res);
    },
    
 thumbnaildownload: function (req, res) {

        var thumb   = path.resolve(sails.config.uploadPath||'files', 'thumbnail-'+req.param('id'));
        var mainFile= path.resolve(sails.config.uploadPath||'files', req.param('id'));

        fsx.exists(thumb, function(exists) { 

            if(exists){ 
                // If thubnail exists then  create a stream of file and download that file
                var emitter =   global[ 'DiskReceiver' ].newThumbEmitterStream({ id: req.param('id'), stream: res, thumb: '1' });
                emitter.on('finish', function () { res.end(); });
                emitter.pipe(res); 
            } else {

                if(sails.config.receiver === 'Disk'){
                    console.log('sails.config.uploadPathHH');
                    console.log(sails.config.uploadPath);
                    fsx.exists((path.resolve(sails.config.uploadPath||'files', req.param('id'))), function(exists) {
                        if(exists){
                            easyimg.resize({
                                src: '/var/www/html/olympus/api/files/'+req.param('id'), 
                                dst: '/var/www/html/olympus/api/files/thumbnail-'+req.param('id'), width: 150, height: 150
                            }).then(
                                function(image) {
                                    easyimg.resize({
                                        src: '/var/www/html/olympus/api/files/'+req.param('id'), 
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
                fsx.exists((path.resolve(sails.config.uploadPath||'files', req.param('id'))), function(exists) {
                    if(exists){
                        // If thumbnail of file does not exists then make a call to its corresponding receiver
                        var emitter = global[ sails.config.receiver + 'Receiver' ].newThumbEmitterStream({id: req.param('id'), stream: res, thumb: '0' });
                        if(emitter){//emitter is not null(maybe null when file does not exist)
                            emitter.on('finish', function () { res.end(); });
                            emitter.pipe(res);
                        }
                    }
                });

            }

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

        if (req.headers['user-agent'].indexOf('AdobeAIR') > -1) {
            var user_platform = "desktopApp";
        } else {
            var user_platform = req.headers['user-agent'];
        }
        console.log(user_platform);
        console.log('user-agent');

        //  Get the current workgroup size
        Directory.workgroup({id: data.parent.id}, function (err, workgroup) {

            var receiver = global[sails.config.receiver + 'Receiver'].newReceiverStream({
                maxBytes: workgroup.quota - workgroup.size,
                totalUploadSize: req.headers['content-length']
            });

            receiver.on('progress', function (progressData) {
                console.log('22222222222222222222222222222222222222222222');
                progressData.parentId = typeof req.param('data') == 'undefined' ? req.param('parent_id') : data.parent.id;
                res.write(JSON.stringify(progressData), 'utf8')
            }).on('error', function(err){
                console.log('hththththhthththththththhthththththththhthththththththhththt');
                return res.end(JSON.stringify({error: 'dashgdjashgdjsajdg'}), 'utf8');
            });

console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');

//Rishabh
// In a FileController.js or similar controller...

/*var d = require('domain').create()

// Intentional noop - only fired when a file upload is aborted and the actual
// error will be properly passed to the function callback below
d.on('error', function (err) {console.log('testOOOtestOOOtestOOOtestOOOtestOOOtestOOOtestOOO');
    return res.end(JSON.stringify({error: 'dashgdjashgdjsajdg1'}), 'utf8');})
//Rishabh

d.run(function safelyUpload () {*/ //Rishabh
            uploadStream.upload(receiver, function (err, files) {
                console.log('333333333333333333333333333333333333333333');
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
                                            {first: fileData.fsName, second: file.extra.fsName}, function (rmErr) {
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
                                                mimetype: file.type,
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
                                        mimetype: file.type,
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
                                    if (latestFile.size == file.size) {
                                        if(sails.config.receiver === 'Disk'){
                                            streamAdaptor.firstFile(
                                                    {first: latestFile.fsName, second: file.extra.fsName}, function (rmErr) {
                                                        console.log('1010101010101010101010101010101010');
                                                        console.log(rmErr);
                                                var parsedResponse = JSON.parse(rmErr);
                                                if(parsedResponse.error === undefined){//Rishabh: check for error
                                                    console.log('567567567567567567567567567567567567567567567');
                                                    if (parsedResponse.first === parsedResponse.second) {
                                                        //fsx.unlink('/var/www/html/olympus/api/files/' + file.extra.fsName);
                                                        // fsx.unlink('/home/alcanzar/api/files/'+file.extra.fsName);
                                                        if(user_platform == 'desktopApp'){
                                                            return res.end(JSON.stringify({error: "FileExist",filedata:latestFile}), 'utf8');
                                                        }else{
                                                            return res.end(JSON.stringify({error: "FileExist"}), 'utf8');
                                                        }
                                                    }
                                                }else{
                                                    console.log('234234234234234234234234234234234234234234234');
                                                    return res.end(JSON.stringify({
                                                        origParams: req.params.all(),
                                                        name: file.filename,
                                                        size: file.size,
                                                        fsName: file.extra.fsName,
                                                        mimetype: file.type,
                                                        version: parseInt(findMax) + 1,
                                                        oldFile: fileData.id,
                                                        thumbnail: "1",
                                                    }), 'utf8');
                                                }
                                            });
                                        }else{
                                            // return res.end(JSON.stringify({error: "FileExist"}), 'utf8');
                                            console.log('1212121212121212121212121212121212');
                                            res.end(JSON.stringify({
                                                origParams: req.params.all(),
                                                name: file.filename,
                                                size: file.size,
                                                fsName: file.extra.fsName,
                                                mimetype: file.type,
                                                version: parseInt(findMax) + 1,
                                                oldFile: fileData.id,
                                                thumbnail: "1",
                                            }), 'utf8');
                                        }
                                    } else {
                                        console.log('1212121212121212121212121212121212');
                                        res.end(JSON.stringify({
                                            origParams: req.params.all(),
                                            name: file.filename,
                                            size: file.size,
                                            fsName: file.extra.fsName,
                                            mimetype: file.type,
                                            version: parseInt(findMax) + 1,
                                            oldFile: fileData.id,
                                            thumbnail: "1",
                                        }), 'utf8');
                                    }
                                });
                            }
                        });

                    } else {
                        console.log('13131313131313131313131313131313');
                        res.end(JSON.stringify({
                            origParams: req.params.all(),
                            name: file.filename,
                            size: file.size,
                            fsName: file.extra.fsName,
                            mimetype: file.type,
                            version: 0,
                            oldFile: 0,
                            thumbnail: "1",
                        }), 'utf8');
                    }


                    if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
                        console.log('1414141414141414141414141414141414');
                        if (sails.config.receiver == "S3") {
                        }  else {
console.log('151515151515151515151515151515151515151515151515151515151515151515151515');
                            easyimg.resize({src: '/var/www/html/olympus/api/files/' + file.extra.fsName, dst: '/var/www/html/olympus/api/files/thumbnail-' + file.extra.fsName, width: 150, height: 150}, function (err, stdout, stderr) {
                                if (err){
                                    // throw err;
                                    // return res.write(JSON.stringify({error: "ImageResizeError",desc: err}), 'utf8');
                                    console.log('Image not Resized to api/files/');
                                }else{
                                    console.log('Resized to 100x100');
                                }
                            });


			                 easyimg.resize({src: '/var/www/html/olympus/api/files/' + file.extra.fsName, dst: '/var/www/html/olympus/master/public/images/thumbnail/'+file.filename, width: 150, height: 150}, function (err, stdout, stderr) {
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


    }


};

var streamAdaptor = {
    firstFile: function (options, cb) {
        var hash = crypto.createHash('md5');
        var s = fsx.createReadStream('/var/www/html/olympus/api/files/' + options.first);
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
        var nw = fsx.ReadStream('/var/www/html/olympus/api/files/' + options.second);
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
