/*---------------------
:: UploadPaths
-> model
---------------------*/
module.exports = {

    attributes: {


        type 			: 'string',
        path 			: 'string',
        accessKeyId		: 'string',
		secretAccessKey	: 'string',
		bucket			: 'string',
		region			: 'string',
		isActive		: 'INTEGER',
        // Add a reference to User
        // owner: {
        //   model: 'user'
        // }
    }
};