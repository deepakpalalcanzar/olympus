/*---------------------
  :: Logging
  -> controller
---------------------*/

var destroy = require('../services/lib/account/destroy'),
    crypto = require('crypto'),
    emailService = require('../services/email');

var LoggingController = {

  register: function (req, res) {

        Logging.createLog(req.body, function(err, logging) {
            if (err) return res.json({error: 'Error creating logging',type: 'error'});
           
            return  res.json({
                  logging: {
                    id   : logging.id,
                  }
              });
        });
    },

};

module.exports = LoggingController;
