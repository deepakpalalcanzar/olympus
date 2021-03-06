var fsx 		= require('fs-extra');
var MultiPartUpload 	= require('knox-mpu');
var knox 		= require('knox');
var UUIDGenerator 	= require('node-uuid');
var easyimg 		= require('easyimage');
var path 		= require('path');

module.exports = {


	/**
	 * Build a mock readable stream that emits incoming files.
	 * (used for file downloads)
	 * 
	 * @return {Stream.Readable}
	 */
	newEmitterStream: function newEmitterStream (options) {

		sails.log('Downloading '+options.id+' using from S3.');

		var client = knox.createClient({
			key: options.receiverinfo.accessKeyId,//sails.config.adapters.s3.apiKey, 
			secret: options.receiverinfo.secretAccessKey,//sails.config.adapters.s3.apiSecret,
			bucket: options.receiverinfo.bucket//sails.config.adapters.s3.bucket
		});

		var Duplex = require('stream').Duplex;
		var emitter__ = Duplex();		

		emitter__._write = function (chunk, encoding, next) {
			emitter__.push(chunk, encoding);
			next();
			return true;
		}

		emitter__._read = function(size) {
			return;
		}

		client.getFile(options.id, function( err, s3res ) {

			if (err) {
				emitter__.emit('error', err);
			}

                        if (options.stream) {
                           return s3res.pipe(options.stream);
                        }

			s3res.pipe(emitter__);
		});



		return emitter__;
	},





	/**
		* Build a mock readable stream that emits incoming files.
		* (used for file downloads)
		* @return {Stream.Readable}
	*/

	newThumbEmitterStream: function newThumbEmitterStream (options) {

		sails.log('Downloading '+options.id+' using from S3.');

		/*File.update({
            fsName: options.id
        }, {
            md5checksum         : 'checkingup'
        }).exec(function(err, file){
        	console.log('S3ReceiverS3ReceiverS3ReceiverS3Receiver');
        	console.log(file)
        	console.log('S3ReceiverS3ReceiverS3ReceiverS3Receiver');
        });*/

		var client = knox.createClient({
			key: options.receiverinfo.accessKeyId,//sails.config.adapters.s3.apiKey, 
			secret: options.receiverinfo.secretAccessKey,//sails.config.adapters.s3.apiSecret,
			bucket: options.receiverinfo.bucket//sails.config.adapters.s3.bucket
		});

		var Duplex = require('stream').Duplex;
		var emitter__ = Duplex();		

		emitter__._write = function (chunk, encoding, next) {
			emitter__.push(chunk, encoding);
			next();
			return true;
		}

		emitter__._read = function(size) {
			return;
		}

		client.getFile(options.id, function( err, s3res ) {

			if (err) {
				emitter__.emit('error', err);
			}

            if (options.stream) {

				var fileWrite = s3res.pipe(fsx.createWriteStream(('files/')+""+options.id));
				fileWrite.on('finish', function(){

					easyimg.resize({
						src: ('files/')+''+options.id, 
						dst: ('files/')+'thumbnail-'+options.id, width: 150, height: 150
					}).then(
						
						function(image) {
							easyimg.resize({
			                	src: ('files/')+''+options.id, 
			                	dst: '/var/www/html/olympus/master/public/images/thumbnail-'+options.id, width: 150, height: 150
			            	}).then(function(image){
			            			fsx.unlink(('files/')+""+options.id);
			            		},
			                	function (err) {
			                		console.log(err);
			                	}
			                );
			            },
			            function (err) {
			                console.log(err);
			            }
			        );
		            return s3res.pipe(options.stream);
				});
	        }
			s3res.pipe(emitter__);
		});
		return emitter__;
	},

	/**
		* Build a mock readable stream that emits incoming files.
		* (used for file downloads)
		* @return {Stream.Readable}
	*/

	md5EmitterStream: function md5EmitterStream (options,cb) {

		var crypto = require('crypto');
		sails.log('Downloading '+options.id+' using from S3.');

		var client = knox.createClient({
			key: options.receiverinfo.accessKeyId,//sails.config.adapters.s3.apiKey, 
			secret: options.receiverinfo.secretAccessKey,//sails.config.adapters.s3.apiSecret,
			bucket: options.receiverinfo.bucket//sails.config.adapters.s3.bucket
		});

		client.getFile(options.id, function( err, s3res ) {

			if (err) {
				cb(null, 'ENOENT');
			}

            if (options.stream) {

				var fileWrite = s3res.pipe(fsx.createWriteStream(('files/')+""+options.id));
				fileWrite.on('finish', function(){

					var hash = crypto.createHash('md5');
                    console.log('cbfirstcbfirstcbfirstcbfirstcbfirstcbfirst');
                    // console.log(cb);
                    var s = fsx.createReadStream(('/var/www/html/olympus/api/files/' || 'files/')+'' + options.id);
                    s.on('readable', function () {
                        console.log('firstFileReadable');
                        var chunk;
                        while (null !== (chunk = s.read())) {
                            hash.update(chunk);
                        }
                    }).on('end', function () {
                        console.log('firstFileEnd');
                        // console.log(cb);
                        // encryptedData["first"] = hash.digest('hex');
                        fileHash = hash.digest('hex');


                        console.log('deepakdeepakdeepakdeepakdeepakdeepakdeepakdeepakdeepakdeepakdeepakdeepakdeepak');

                        //condole.log(s);

                        easyimg.resize({
							src: ('files/')+''+options.id, 
							dst: ('files/')+'thumbnail-'+options.id, width: 150, height: 150
						}).then(
							
							function(image) {

								var Writable = require('stream').Writable;
								var receiver__ = Writable({objectMode: true});
								var client = knox.createClient({
									key: options.receiverinfo.accessKeyId,//sails.config.adapters.s3.apiKey, 
									secret: options.receiverinfo.secretAccessKey,//sails.config.adapters.s3.apiSecret,
									bucket: options.receiverinfo.bucket,//sails.config.adapters.s3.bucket
								});

								var mpu = new MultiPartUpload({
									client: client,
									objectName: 'thumbnail-'+options.id,
									//stream: __newFile,
									//maxUploadSize: options.maxBytes,
									//totalUploadSize: options.totalUploadSize
								}, function(err, body) {
									if (err) {
										//log(('Receiver: Error writing `'+__newFile.filename+'`:: '+ require('util').inspect(err)+' :: Cancelling upload and cleaning up already-written bytes...').red);
										//receiver__.emit('error', err);
										return;
									}
									//__newFile.extra = body;
									//__newFile.extra.fsName = fsName;

									//log(('Receiver: Finished writing `'+__newFile.filename+'`').grey);
									//next();
								});

								mpu.on('progress', function(data) {
									receiver__.emit('progress', {
										name: 'thumbnail-'+options.id,
										written: data.written,
										total: data.total,
										percent: data.percent
									});
								});
								

				                fsx.unlink(('files/')+"thumbnail-"+options.id);
				            },
				            function (err) {
				                console.log(err);
				            }
				        );

                        console.log('deepak1deepak1deepakdeepakdeepakdeepakdeepakdeepakdeepakdeepakdeepakdeepakdeepak');

                        //Unlink the file now
						fsx.unlink(('files/')+""+options.id);

                    	if(typeof cb != 'undefined')
				        	cb(null, fileHash);

                    }).on('error', function(e){
                        console.log('firstFileError');
                        console.log(e);
                        cb(null, 'ENOENT');
                    });
		            // return s3res.pipe(options.stream);
				});
	        }
			// s3res.pipe(emitter__);
		});
		// return emitter__;
	},

	/**
	 * Build a mock writable stream that handles incoming files.
	 * (used for file uploads)
	 * 
	 * @return {Stream.Writable}
	 */
	
	newReceiverStream: function newReceiverStream (options) {

		sails.log('Created new S3 receiver.');

		var log = sails.log;

		var Writable = require('stream').Writable;
		var receiver__ = Writable({objectMode: true});
		var client = knox.createClient({
			key: options.receiverinfo.accessKeyId,//sails.config.adapters.s3.apiKey, 
			secret: options.receiverinfo.secretAccessKey,//sails.config.adapters.s3.apiSecret,
			bucket: options.receiverinfo.bucket,//sails.config.adapters.s3.bucket
		});

		receiver__._write = function onFile (__newFile, encoding, next) {

		    // Create a unique(?) filename
		    var fsName = UUIDGenerator.v1();
			log(('Receiver: Received file `'+__newFile.filename+'` from an Upstream.').grey);

			var mpu = new MultiPartUpload({
				client: client,
				objectName: fsName,
				stream: __newFile,
				maxUploadSize: options.maxBytes,
				totalUploadSize: options.totalUploadSize
			}, function(err, body) {
				if (err) {
					log(('Receiver: Error writing `'+__newFile.filename+'`:: '+ require('util').inspect(err)+' :: Cancelling upload and cleaning up already-written bytes...').red);
					receiver__.emit('error', err);
					return;
				}
				__newFile.extra = body;
				__newFile.extra.fsName = fsName;

				log(('Receiver: Finished writing `'+__newFile.filename+'`').grey);
				next();
			});

			mpu.on('progress', function(data) {
				receiver__.emit('progress', {
					name: __newFile.filename,
					written: data.written,
					total: data.total,
					percent: data.percent
				});
			});

		};
		
		return receiver__;
	},

	/**
	 * Build a mock readable stream that emits incoming files.
	 * (used for file downloads)
	 * 
	 * @return {Stream.Readable}
	 */
	deleteobject: function newEmitterStream (options,cb) {

		sails.log('Deleting '+options.id+' using from S3.');

		sails.log(options);

		var client = knox.createClient({
			key: options.receiverinfo.accessKeyId, 
			secret: options.receiverinfo.secretAccessKey,
			bucket: options.receiverinfo.bucket
		});

		client.deleteFile(options.id, function(err, res) {
cb();
			if(err){
				sails.log(err);
				// return res.send(500);
			}
			// return res.send(200);throwing TypeError: Object #<IncomingMessage> has no method 'send'
			
        });
	},

	deleteAll: function newEmitterStream (options,cb) {

		sails.log('Deleting '+options.id+' using from S3.');

		// sails.log(options);

		var client = knox.createClient({
			key: options.receiverinfo.accessKeyId, 
			secret: options.receiverinfo.secretAccessKey,
			bucket: options.receiverinfo.bucket
		});

		function deleteFiles(files, callback){
		   	if (files.length==0) callback();
		   	else {
		   	  	// console.log(files);
		      	var f = files.pop();

		      	// fsx.unlink((options.receiverinfo.path||'/var/www/html/olympus/api/files/')+'' + f, function(err){
		          	// if (err) console.log(err);

		          	fsx.unlink((options.receiverinfo.path||'/var/www/html/olympus/api/files/')+'thumbnail-' + f, function(err){
			          // if (err) console.log(err);
			        });
			        fsx.unlink((options.receiverinfo.path||'/var/www/html/olympus/api/files/')+'thumbnail-thumbnail-' + f, function(err){
			          // if (err) console.log(err);
			        });
			        // fs.unlink(sails.config.linuxPath+'master/public/images/thumbnail/'+fileModel.name, function(err){
			          // if (err) console.log(err);
			        // });
			        fsx.unlink('/var/www/html/master/public/images/thumbnail-thumbnail-'+f, function(err){
			          // if (err) console.log(err);
			        });

			        // if (err) callback(err);
			        // else {
			            console.log(f + ' thumbnails deleted from disk.');
			            deleteFiles(files, callback);
			        // }
		        // });
		   	}
		}

		// sails.log(options);
		if(options.ids != ''){
			deleteFiles(options.ids.split(','), function(){//delete thumbs from local

				sails.log('Deleting '+options.ids+' using from S3.');
				
				client.deleteMultiple(options.ids.split(','),function (err, res) {//delete files from s3
					if(err){
						console.log(err);
						cb();
					}

			    	cb();
			    });
			});	
		}else{
			cb();
		}
	}

};
