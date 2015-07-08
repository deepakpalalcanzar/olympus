/*---------------------
  :: Logging
  -> controller
---------------------*/

var destroy = require('../services/lib/account/destroy'),
    crypto = require('crypto'),
    emailService = require('../services/email');
   //var publicIp = require('public-ip');
    var myip = require('myip');

var LoggingController = {

  register: function (req, res) {
    myip(function (err, ip) {

       console.log('jai234234234');
       console.log('Your IP address is:', ip);
    var ip = ip;


      var newoption = {

      user_id       : req.body.user_id, 
      text_message  : req.body.text_message,
      activity      : req.body.activity,
      on_user       : req.body.on_user,
      ip            :ip

    };
        Logging.createLog(newoption, function(err, logging) {
            if (err) return res.json({error: 'Error creating logging',type: 'error'});
           
            return  res.json({
                  logging: {
                    id   : logging.id,
                  }
              });
        });
      });
    },

};

module.exports = LoggingController;
