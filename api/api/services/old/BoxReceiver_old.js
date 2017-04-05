var fsx 		= require('fs-extra');
var MultiPartUpload 	= require('knox-mpu');
var knox 		= require('knox');
var UUIDGenerator 	= require('node-uuid');
var easyimg 		= require('easyimage');
var path 		= require('path');
var https 		= require('https');

module.exports = {


	/**
	 * Build a mock readable stream that emits incoming files.
	 * (used for file downloads)
	 *
	 * @return {Stream.Readable}
	 */
	newEmitterStream: function newEmitterStream (options) {

		sails.log('Downloading '+options.id+' using from Disk.');
		//return blobAdapter.read({id: path.resolve(options.receiverinfo.path||'files', options.id)});

		if(options.thumb === '1'){
			return blobAdapter.read({
				id: path.resolve(options.receiverinfo.path||'files', 'thumbnail-'+options.id),
			});
		}else{
			return blobAdapter.read({
				id: path.resolve(options.receiverinfo.path||'files', options.id),
			});
		}

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

		client.getFile('thumbnails/thumbnail-'+options.id, function( err, s3res ) {

			if (err) {
				emitter__.emit('error', err);
			}
			if(s3res.statusCode == 200){
				s3res.pipe(emitter__)
				.pipe(fsx.createWriteStream(('files/')+"thumbnail-"+options.id));//cache image in local server(so that next time it will be picked from Disk)
			}else if(s3res.statusCode == 404){

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
					                	dst: sails.config.appPath + '/../master/public/images/thumbnail-'+options.id, width: 150, height: 150
					            	}).then(function(image){




					            			console.log('THUMB image THUMB image THUMB image THUMB image');
					            			console.log(image);

					            			var mpu = new MultiPartUpload(
										            {
										                client: client,
										                objectName: 'thumbnails/'+image.name, // Amazon S3 object name
										                file: image.path// path to the file
										            },
										            // Callback handler
										            function(err, body) {

										            	console.log('mpuBodympuBodympuBodympuBodympuBodympuBodympuBodympuBody');
										            	if (err) {
										            		console.log(err);
										            	}
										            	console.log(body);
										                // If successful, will return body, containing Location, Bucket, Key, ETag and size of the object

										                  // {
										                  //     Location: 'http://Example-Bucket.s3.amazonaws.com/destination.txt',
										                  //     Bucket: 'Example-Bucket',
										                  //     Key: 'destination.txt',
										                  //     ETag: '"3858f62230ac3c915f300c664312c11f-9"',
										                  //     size: 7242880
										                  // }

										            }
										        );

					            			fsx.unlink(('files/')+""+options.id);
					            		},
					                	function (err) {
					                		console.log(err);
					                		return s3res.pipe(options.stream);
					                	}
					                );
					            },
					            function (err) {
					                console.log(err);
					                return s3res.pipe(options.stream);
					            }
					        );
				            // return s3res.pipe(options.stream);//Rishabh: possible bug of returning raw image first time instead of thumbnail
						});
			        }
					s3res.pipe(emitter__);
				});
			}
			console.log('s3ress3ress3ress3ress3ress3ress3ress3ress3ress3res');
		});

		return emitter__;
	},

	newProfileEmitterStream: function newThumbEmitterStream (options) {

		console.log('newProfileEmitterStreamnewProfileEmitterStreamnewProfileEmitterStream');
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

		client.getFile('profile/'+options.id, function( err, s3res ) {

			// if (err) {
			// 	emitter__.emit('error', err);
			// }
			console.log('errerrerrerrerrerrerrerrerrerrerrerrerrerrerrerrerr');
			console.log(err);
			if(s3res.statusCode == 200){
				s3res.pipe(emitter__)
				.pipe(fsx.createWriteStream( sails.config.appPath + ('/../master/public/images/profile/') +options.id));//cache image in local server(so that next time it will be picked from Disk)
			}else if(s3res.statusCode == 404){
				emitter__.emit('risherror', {
					name: '__newFile.filename'
				});
				return false;
			}
			console.log('s3ress3ress3ress3ress3ress3ress3ress3ress3ress3res');
		});

		return emitter__;
	},

	newLogoEmitterStream: function newLogoEmitterStream (options) {

		console.log('newLogoEmitterStreamnewLogoEmitterStreamnewLogoEmitterStreamnewLogoEmitterStream');
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

		client.getFile('enterprises/'+options.id, function( err, s3res ) {

			// if (err) {
			// 	emitter__.emit('error', err);
			// }
			console.log('errerrerrerrerrerrerrerrerrerrerrerrerrerrerrerrerr');
			console.log(err);
			if(s3res.statusCode == 200){
				s3res.pipe(emitter__)
				.pipe(fsx.createWriteStream( sails.config.appPath + ('/../master/public/images/enterprises/') +options.id));//cache image in local server(so that next time it will be picked from Disk)
			}else if(s3res.statusCode == 404){
				emitter__.emit('risherror', {
					name: '__newFile.filename'
				});
				return false;
			}
			console.log('s3ress3ress3ress3ress3ress3ress3ress3ress3ress3res');
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
                    var s = fsx.createReadStream((sails.config.appPath + '/files/' || 'files/')+'' + options.id);
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
                        fileHash = hash.digest('hex')

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

		sails.log('Creating new Disk receiver.');
		var log = sails.log;


		var Writable = require('stream').Writable;
		var receiver__ = Writable({objectMode: true});


		receiver__._write = function onFile (__newFile, encoding, next) {

		    // Create a unique(?) filename
		    var fsName = UUIDGenerator.v1();
		    __newFile.extra = {fsName:fsName};
		    console.log(fsName);console.log(__newFile.filename);
		    
	    	// var fsName = uuid + "." + _.str.fileExtension(__newFile.filename);

			log(('Receiver: Received file `'+__newFile.filename+'` from an Upstream.').grey);



			var outs = blobAdapter.touch({id: path.resolve('/var/www/html/olympus/api/files/', fsName)});
			outs.written = 0;

			

			__newFile.on('readable', readFromStream);



			function readFromStream() {

				var chunk;
				while (null !== (chunk = __newFile.read())) {
					var writeChunk = chunk;


					outs.write(writeChunk, function() {

						outs.written += writeChunk.length;
						if (__newFile.byteCount) {
							console.log('DiskReceiver '+(outs.written / __newFile.byteCount * 100 | 0));
							receiver__.emit('progress', {
								name: __newFile.filename,
								written: outs.written,
								total: __newFile.byteCount,
								percent: outs.written / __newFile.byteCount * 100 | 0
							});
						}
					});
  				}				
			};



			__newFile.on('end', function() {
				outs.end();
			});



			outs.on('finish', function () {
				log(('Receiver: Finished writing `'+__newFile.filename+'`').grey);

				var Box3 = require('nodejs-box');
 
				var box3 = new Box3({
				  access_token: 'rB8OEeo3PVHTyv6DAIFQAzl128QAO7OK',
				  //refreh_token: 'tSblEF9inGuvfcdfBRSDKRS0Jm5pf7bPIP9HSoUfyDhgxP4OroVZFEvLVVjsBVfl'
				});

				next();

			});



			outs.on('error', function (err) {
				log(('Receiver: Error writing `'+__newFile.filename+'`:: '+ require('util').inspect(err)+' :: Cancelling upload and cleaning up already-written bytes...').red);
				
				// Garbage-collects the already-written bytes for this file.
				blobAdapter.rm({id: path.resolve('/var/www/html/olympus/api/files/', fsName)}, function (rmErr) {
					// If the file could not be garbage-collected, concatenate a final error
					// before calling `next()`
					if (rmErr) return next([err].concat([rmErr]));
					return next(err);
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

			if(err){
				sails.log(err);
				// return res.send(500);
			}
			// return res.send(200);throwing TypeError: Object #<IncomingMessage> has no method 'send'

			client.deleteFile( 'thumbnails/thumbnail-' + options.id, function(err, res) {

				cb();

				if(err){
					sails.log(err);
					// return res.send(500);
				}
				// return res.send(200);throwing TypeError: Object #<IncomingMessage> has no method 'send'

	        });

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

		      	// fsx.unlink((options.receiverinfo.path||sails.config.appPath + '/files/')+'' + f, function(err){
		          	// if (err) console.log(err);

		          	fsx.unlink((options.receiverinfo.path||sails.config.appPath + '/files/')+'thumbnail-' + f, function(err){
			          // if (err) console.log(err);
			        });
			        fsx.unlink((options.receiverinfo.path||sails.config.appPath + '/files/')+'thumbnail-thumbnail-' + f, function(err){
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

					console.log('Deleting thumbnails from S3.');
					var img_array = options.ids.split(',');

					console.log(img_array);

					for(var i=0;i<img_array.length;i++){
					    img_array[i]= "thumbnails/thumbnail-" + img_array[i];
					}

					client.deleteMultiple(img_array,function (err, res) {//delete thumbnail files from s3
						if(err){
							console.log(err);
							cb();
						}

				    	cb();//final callback
				    });
			    });
			});
		}else{
			cb();
		}
	}

};


var blobAdapter = {


	touch: function (options) {
		// Default the output path for files to `/dev/null` for testing purposes.
		var id = options.id;
		var filePath = options.id || '/dev/null';

		// TODO: validate/normalize file path

		return fsx.createWriteStream(filePath);
	},

	read: function (options) {
		var id = options.id;
		var filePath = id;

		// TODO: validate/normalize file path

		return fsx.createReadStream(filePath, 'utf8');
	},


	generateThumb: function(options){
		var id 			= options.id;
		var filePath 	= id;
		return fsx.createReadStream(filePath, 'utf8');
	},

	rm: function (options, cb) {
		console.log("REMOVING ", options.id);
		var id = options.id;
		var filePath = options.id || '/dev/null';
		// TODO: validate/normalize file path

		fsx.remove(filePath, function (err) {
			if (err) {
				// TODO: normalize error
				return cb(err);
			}
			return cb();
		});
	}
};

