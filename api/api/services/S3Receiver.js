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
			key: sails.config.adapters.s3.apiKey, 
			secret: sails.config.adapters.s3.apiSecret,
			bucket: sails.config.adapters.s3.bucket
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

		var client = knox.createClient({
			key: sails.config.adapters.s3.apiKey, 
			secret: sails.config.adapters.s3.apiSecret,
			bucket: sails.config.adapters.s3.bucket
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

		var fileWrite = s3res.pipe(fsx.createWriteStream("/var/www/html/olympus/api/files/"+options.id));
		fileWrite.on('finish', function(){
		easyimg.resize({
			src: '/var/www/html/olympus/api/files/'+options.id, 
			dst: '/var/www/html/olympus/api/files/thumbnail-'+options.id, width: 150, height: 150
		}).then(
			
			function(image) {
				easyimg.resize({
                                	src: '/var/www/html/olympus/api/files/'+options.id, 
                                	dst: '/var/www/html/olympus/master/public/images/thumbnail-'+options.id, width: 150, height: 150
                            	}).then(
					function(image){
                            			fsx.unlink("/var/www/html/olympus/api/files/"+options.id);
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
			key: sails.config.adapters.s3.apiKey, 
			secret: sails.config.adapters.s3.apiSecret,
			bucket: sails.config.adapters.s3.bucket
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
	}
};
