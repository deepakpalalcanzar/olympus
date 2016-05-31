var path = require('path');
var fsx = require('fs-extra');
var UUIDGenerator = require('node-uuid');

module.exports = {


	newEmitterStream: function newEmitterStream (options) {

		sails.log('Downloading '+options.id+' using from Disk.');
		//return blobAdapter.read({id: path.resolve(sails.config.uploadPath||'files', options.id)});

		if(options.thumb === '1'){
			return blobAdapter.read({
				id: path.resolve(sails.config.uploadPath||'files', 'thumbnail-'+options.id),
			});
		}else{
			return blobAdapter.read({
				id: path.resolve(sails.config.uploadPath||'files', options.id),
			});
		}

	},


	newThumbEmitterStream: function newThumbEmitterStream (options) {

		sails.log('Downloading Thumb'+options.id+' using from Disk.');
		// sails.log(options);
		if(options.thumb === '0'){ // thumb 0 means thumbnail does not exists in system
		  	return blobAdapter.generateThumb({
				id : path.resolve(sails.config.uploadPath||'files', options.id), 
				filename : options.id
			});
		}else if(options.thumb === '1'){ // If we already have thumbnail
			return blobAdapter.read({ 
				id : path.resolve(sails.config.uploadPath||'files', 'thumbnail-'+options.id),
				filename : options.id
			});
		}

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

	    	// var fsName = uuid + "." + _.str.fileExtension(__newFile.filename);

			log(('Receiver: Received file `'+__newFile.filename+'` from an Upstream.').grey);

			var outs = blobAdapter.touch({id: path.resolve(sails.config.uploadPath||'files', fsName)});
			outs.written = 0;

			__newFile.on('readable', readFromStream);

			function readFromStream() {

				var chunk;
				while (null !== (chunk = __newFile.read())) {
					var writeChunk = chunk;

					if (outs.written + writeChunk.length > options.maxBytes) {
						console.log("QUOTA ERROR: ", outs.written + writeChunk.length, ">", options.maxBytes);
						__newFile.removeListener('readable', readFromStream);
						outs.emit('error', "reached maxUploadSize");
						return;
					}

					outs.write(writeChunk, function() {

						outs.written += writeChunk.length;
						if (__newFile.byteCount) {
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
				next();
			});
			outs.on('error', function (err) {
				log(('Receiver: Error writing `'+__newFile.filename+'`:: '+ require('util').inspect(err)+' :: Cancelling upload and cleaning up already-written bytes...').red);
				
				// Garbage-collects the already-written bytes for this file.
				blobAdapter.rm({id: path.resolve(sails.config.uploadPath||'files', fsName)}, function (rmErr) {
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

		sails.log('Deleting '+options.id+' using from Disk.');

		sails.log(options);

		fsx.unlink('/var/www/html/olympus/api/files/' + options.id, function(err){
          // if (err) console.log(err);
        });
        fsx.unlink('/var/www/html/olympus/api/files/thumbnail-' + options.id, function(err){
          // if (err) console.log(err);
        });
        fsx.unlink('/var/www/html/olympus/api/files/thumbnail-thumbnail-' + options.id, function(err){
          // if (err) console.log(err);
        });
        // fs.unlink('/var/www/html/olympus/master/public/images/thumbnail/'+fileModel.name, function(err){
          // if (err) console.log(err);
        // });
        fsx.unlink('/var/www/html/olympus/master/public/images/thumbnail-thumbnail-'+options.id, function(err){
          // if (err) console.log(err);
        });

		cb();
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
