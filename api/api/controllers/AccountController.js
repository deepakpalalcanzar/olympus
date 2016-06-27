/*---------------------
  :: Account
  -> controller
---------------------*/

var destroy = require('../services/lib/account/destroy'),
    crypto = require('crypto'),
    emailService = require('../services/email'),
    publicIp = require('public-ip');

var AccountController = {

    register: function (req, res) {

        if (!req.param('email')) return res.json({
            error: 'No email provided',
            type: 'error',
            email: req.param('email')
        }, 400);

// If the requested account already exists, return it
        Account.findOne({
            email: req.param('email')
        }).exec(function (err, account) {

            if (err) return res.json({
                error: 'Error creating email',
                type: 'error',
                email: req.param('email')
            },400);

            if (account) return res.json({
                error: 'Account with that email already exists',
                type: 'error',
                id: account.id,
                email_msg : 'email_exist',
                email: req.param('email')
            },400);

            if(req.param('isVerified') && !req.param('password')) {
                return res.json({
                    error: 'Account cannot be verified without a password',
                    type: 'error'
                },400);
            }
            publicIp(function (err, ip) {

                var ip = ip;
                var options = {
                    name        : req.param('name'),
                    email       : req.param('email'),
                    isAdmin     : req.param('isAdmin'),
                    isVerified  : req.param('isVerified'),
                    password    : req.param('password'),
                    quota       : req.param('quota'),
                    title       : req.param('title'),
                    workgroup   : req.param('workgroup'),
                    created_by  : req.param('created_by') !== 'undefined' ? req.param('created_by') : '',
                    is_enterprise   : req.param('is_enterprise') !== 'undefined' ? req.param('is_enterprise') : '',
                    subscription_id : req.param('subscription') !== 'undefined' ? req.param('subscription') : '',
                    created_by_name : req.param('created_by_name') !== 'undefined' ? req.param('created_by_name') : '',
                    enterprise_name : req.param('enterprise_name') !== 'undefined' ? req.param('enterprise_name') : '',
                    ip              : ''
                };
            
                Account.createAccount(options, function(err, account) {

                    if (err) return res.json({
                        /*console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs');
                        console.log(err);
                        console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs');*/
                        error: 'Error creating account',
                        type: 'error',
                        email: req.param('email')
                    });

                    if (!req.param('isVerified')) {
// send them a verfication email
                        emailService.sendVerifyEmail({
                            account: account
                        }, function (err, data) {

                            if (err) return res.json({
                                error: 'Error sending verification email',
                                type: 'error',
                                email: req.param('email')
                            });

                            return res.json({
                                account: {
                                    name: account.name,
                                    email: account.email,
                                    id   :account.id
                                }
                            });
                        });
                    } else {
// send them a welcome email
                        emailService.sendWelcomeEmail({
                            account: account,
                            password: req.param('password')
                        }, function (err, data) {

                            if (err) return res.json({
                                error: 'Error sending welcome email',
                                type: 'error',
                                email: req.param('email')
                            });

                            return res.json({
                              account: {
                                name: account.name,
                                email: account.email,
                                id   :account.id
                              }
                            });

                        });

                        return res.json({
                            account: {
                              name: account.name,
                              email: account.email,
                              id   :account.id
                            }
                        });
                    }
            });
       });
        });
    },


  /**
   * PUT /account/:id
   *
   * Updates a user's account params
   *
   * ACL should be done at the policy level before getting here
   * so we can just look up the Account by the `id` param.
   *
   * @param {String} email
   * @param {String} name
   * @param {String} phone
   * @param {String} title
   * @param {String} password
   */

    update: function (req, res) {

        if (!req.param('id')) {
          return res.send({
            error: new Error('Must include an Account ID').message,
            type: 'error'
          }, 400);
        }

        // Look up Account for currently logged-in user
        Account.findOne(req.param('id')).then(function (account) {

            // Make sure an Account exists with that ID
            if (!account) return res.json({
                error: 'No Account found with that ID',
                type: 'error'
            }, 400);

            // Update Model Values
            if (req.param('email')) account.email = req.param('email');
            if (req.param('name')) account.name = req.param('name');
            if (req.param('phone')) account.phone = req.param('phone');
            if (req.param('title')) account.title = req.param('title');
            if (req.param('password')) account.password = req.param('password');

            // Save the Account, returning a 200 response
            account.save(function (err) {
                if (err) return res.json({
                    error: err.message,
                    type: 'error'
                });
                return res.json(account, 200);
            });

        }).fail(function (err) {
            return res.json({
                error: err.message,
                type: 'error'
            }, 500);
        });
    },


  /**
   * DELETE /account/:id
   *
   * Destroys an account
   *
   * ACL should be done at the policy level before getting here
   * so we can just use the id param in the Account Query
   */

    del: function (req, res) {
    
        var accountName; 
        if (!req.param('id')) {
            return res.json({
                error: new Error('Must include an Account ID'),
                type: 'error'
            }, 400);
        }

    // Update Account and mark as deleted
        Account.findOne(req.param('id')).exec(function (err, account) {

            accountName = account.name;
            
            if (err) return res.json({
                error: err,
                type : 'error'
            }, 400);

            if (!account) {
                return res.json({
                    error: new Error('No account found with that ID'),
                    type : 'error'
                }, 400);
            }

            account.destroy(function (err) {

                if (err) return res.json({
                    error: err,
                    type : 'error'
                }, 400);

/*Create Log detail*/
                if(account.isAdmin){
                    var createdBy = account.id;
                }else{
                    var createdBy = account.created_by;
                }


                Enterprises.findOne({account_id:createdBy}).exec(function (err, enterprise) {

                    enterpriseName = typeof enterprise != "undefined" ? 'FROM '+ enterprise.name + 'workgroup.' : '';
                    var msg = req.param('accName')+' has deleted '+(accountName == req.param('accName') ? 'own' : 'user '+ accountName +'\'s')+' account ' + enterpriseName;
                    var opts ={
                        user_id       : req.param('accId'),
                        text_message  : msg,
                        activity      : 'delete',
                        on_user       : account.id
                    } 

                    Logging.createLog(opts, function(err, logging) {
                        if (err) return res.json({error: 'Error creating logging',type: 'error'});
                        res.json({ status: 'ok'}, 200);
                    });
                });
            });
        });
    },


  /**
   * PUT /account/:id/lock
   *
   * Locks/unlocks an account and all directories and files under workgroups the account
   * is owner of.
   *
   * ACL should be done at the policy level before getting here
   * so we can just use the id param in the Account Query
   */

    lock: function (req, res) {

        if (!req.param('id')) {
          return res.json({
            error: new Error('Must include an Account ID'),
            type: 'error'
          }, 400);
        }

    // Update Account and mark as locked or unlocked depending on input
        Account.findOne(req.param('id')).exec(function (err, account) {
            
            if (err) return res.json({
                error: err,
                type: 'error'
            }, 400);

            if (!account) {
                return res.json({
                    error: new Error('No account found with that ID'),
                    type: 'error'
                }, 400);
            }

// !! will cast the variable to a boolean
            account.lock( !! req.param('lock'), function (err) {
                
                if (err) return res.json({
                    error: err,
                    type: 'error'
                }, 400);

                res.json(account, 200);
            });
        });
    },

    /**
   * PUT /account/:id/lock
   *
   * Locks/unlocks an account and all directories and files under workgroups the account
   * is owner of.
   *
   * ACL should be done at the policy level before getting here
   * so we can just use the id param in the Account Query
   */

    changeDomainname: function (req, res) {

        if(typeof req.param('formaction') != 'undefined' && req.param('formaction') )
        {

            console.log('111111111111111111111111111111111111');
            console.log(req.param('formaction'));
            fsx = require('fs-extra');

            applicationjs = __dirname + '/../../config/application.js';
            fsx.readFile(applicationjs, 'utf8', function (err,data) {
              if (err){
                return res.json({
                        error: err,
                        type: 'error'
                    }, 400);
            }
if(req.param('formaction') == 'save_domain_info'){
    newdomainname = req.param('newdomainname');
    mail_service  = sails.config.mailService;
    mandrill_key  = sails.config.mandrill.token;
    smtp_host     = sails.config.smtpDetails.host;
    smtp_port     = sails.config.smtpDetails.port;
    smtp_user     = sails.config.smtpDetails.user;
    smtp_pass     = sails.config.smtpDetails.pass;
}else if(req.param('formaction') == 'save_email_info'){
    newdomainname = sails.config.hostName;
    mail_service  = req.param('mailservice');
    mandrill_key  = req.param('mandrillkey');
    smtp_host     = req.param('smtphost');
    smtp_port     = req.param('smtpport');
    smtp_user     = req.param('smtpuser');
    smtp_pass     = req.param('smtppass');
}else{//save_trash_setting
    newdomainname = sails.config.hostName;
    mail_service  = sails.config.mailService;
    mandrill_key  = sails.config.mandrill.token;
    smtp_host     = sails.config.smtpDetails.host;
    smtp_port     = sails.config.smtpDetails.port;
    smtp_user     = sails.config.smtpDetails.user;
    smtp_pass     = sails.config.smtpDetails.pass;

    crontab_html = '';

            trash_setting = req.param('trash_setting');
            temp_days          = req.param('days');

    if(trash_setting == 'auto'){

        cron_asterisk_str = '';
        console.log('temp_days');
        console.log(temp_days);
        // year      = parseInt(temp_days/365);
        // temp_days = temp_days%365;
        // console.log(temp_days);
        // month     = parseInt(temp_days/30);
        // console.log(temp_days%30);
        // days      = parseInt(temp_days%30);

        // year_str  = (year > 1 )?'*/'+year:'*';
        
        // if(year_str == 1){
        //     month_str = 1;
        // }else{
        //     month_str = (month > 1 )?'*/'+month:'*';
        //     if(month_str == 1){
        //         days_str = 1;
        //     }else{
        //         days_str  = (days > 1)?'*/'+days:'*';
        //     }
        // }

        // if((year >0) || (month >0) || (days >0)){
        //     cron_asterisk_str = '0 0 0 '+days_str+' '+month_str+' '+year_str;
        // }
        switch(temp_days){//https://en.wikipedia.org/wiki/Cron#Predefined_scheduling_definitions
            case 'hourly':
                cron_asterisk_str = '0 0 * * * *';
            break;
            case 'daily':
                cron_asterisk_str = '0 0 0 * * *';
            break;
            case 'weekly':
                cron_asterisk_str = '0 0 0 * * 0';
            break;
            case 'monthly':
                cron_asterisk_str = '0 0 0 1 * *';
            break;
            case 'yearly':
                cron_asterisk_str = '0 0 0 1 1 *';
            break;
        }

    if(cron_asterisk_str != ''){
        crontab_html = '\
        var path = require(\'path\'); \r\n\
        var fsx = require(\'fs-extra\'); \r\n\
        var UUIDGenerator = require(\'node-uuid\'); \r\n\
         \r\n\
        module.exports.crontab = { \r\n\
         \r\n\
          /* \r\n\
           * The asterisks in the key are equivalent to the \r\n\
           * schedule setting in crontab, i.e. \r\n\
           * minute hour day month day-of-week year \r\n\
           * so in the example below it will run every minute \r\n\
           */ \r\n\
        \''+cron_asterisk_str+'\'\: function(){ \r\n\
         \r\n\
            // require(\'../crontab/mycooljob.js\').run(); \r\n\
            sails.controllers.trash.deleteTrashContent(); \r\n\
          } \r\n\
        };';
        }



    }else{
        //else make the file empty
    }

        crontabjs = __dirname + '/../../config/crontab.js';
        fsx.readFile(crontabjs, 'utf8', function (err,data) {
          if (err){
            return res.json({
                    error: err,
                    type: 'error'
                }, 400);
          }

          fsx.writeFile(crontabjs, crontab_html, 'utf8', function (err) {
             if (err) return res.json({
                error: err,
                type: 'error'
             }, 400);

            console.log('************************************************');
            console.log('API:Cron Setting changed to ');
            console.log('************************************************');

            return res.json({ status: 'ok'}, 200);
          });
        });
}

//START- content for olympus/api/config/applicatio.js
api_application = '\
module.exports = { \r\n\
    // Port this Sails application will live on \r\n\r\n\
    port: process.env.PORT || 1337, \r\n\r\n\
    // The environment the app is deployed in \r\n\
    // (`development` or `production`) \r\n\
    // In `production` mode, all css and js are bundled up and minified \r\n\
    // And your views and templates are cached in-memory.  Gzip is also used. \r\n\
    // The downside?  Harder to debug, and the server takes longer to start. \r\n\r\n\
    environment: process.env.NODE_ENV || \'development\', \r\n\r\n\
    // Used for sending emails \r\n\r\n\
    hostName: \''+newdomainname+'\', \r\n\
    protocol: \'https://\', \r\n\
    // TODO: make this an adapter config \r\n\
    mailService: \''+mail_service+'\', \r\n\
    mandrill: { \r\n\
        token: \''+mandrill_key+'\' \r\n\
    }, \r\n\
    smtpDetails: { \r\n\
        host: \''+smtp_host+'\', \r\n\
        port: \''+smtp_port+'\', \r\n\
        user: \''+smtp_user+'\', \r\n\
        pass: \''+smtp_pass+'\', \r\n\
    } \r\n\
};';
//END- content for olympus/api/config/applicatio.js

              fsx.writeFile(applicationjs, api_application, 'utf8', function (err) {
                 if (err) return res.json({
                    error: err,
                    type: 'error'
                 }, 400);

                console.log('************************************************');
                console.log('API:Domain changed to '+req.param('newdomainname'));
                console.log('************************************************');

                console.log('sails.config.host API API');
                console.log(sails.config.host);
                sails.config.host = req.param('newdomain');
                console.log(sails.config.host);

                return res.json({ status: 'ok'}, 200);
              });
            });
        }else{
            console.log('222222222222222222222222222222222');
            return res.json({error: 'Some error occurred.', type: 'error' }, 400);
        }
    },
    saveTrashSetting: function (req, res) {

            fsx = require('fs-extra');
            crontab_html = '';

            trash_setting = req.param('trash_setting');
            temp_days          = req.param('days');

if(trash_setting == 'auto'){

    cron_asterisk_str = '';
    console.log('temp_days');
    console.log(temp_days);
    // year      = parseInt(temp_days/365);
    // temp_days = temp_days%365;
    // console.log(temp_days);
    // month     = parseInt(temp_days/30);
    // console.log(temp_days%30);
    // days      = parseInt(temp_days%30);

    // year_str  = (year > 1 )?'*/'+year:'*';
    
    // if(year_str == 1){
    //     month_str = 1;
    // }else{
    //     month_str = (month > 1 )?'*/'+month:'*';
    //     if(month_str == 1){
    //         days_str = 1;
    //     }else{
    //         days_str  = (days > 1)?'*/'+days:'*';
    //     }
    // }

    // if((year >0) || (month >0) || (days >0)){
    //     cron_asterisk_str = '0 0 0 '+days_str+' '+month_str+' '+year_str;
    // }
    switch(temp_days){//https://en.wikipedia.org/wiki/Cron#Predefined_scheduling_definitions
        case 'hourly':
            cron_asterisk_str = '0 * * * *';
        break;
        case 'daily':
            cron_asterisk_str = '0 0 * * *';
        break;
        case 'weekly':
            cron_asterisk_str = '0 0 * * 0';
        break;
        case 'monthly':
            cron_asterisk_str = '0 0 1 * *';
        break;
        case 'yearly':
            cron_asterisk_str = '0 0 1 1 *';
        break;
    }

if(cron_asterisk_str != ''){
crontab_html = '\
var path = require(\'path\'); \r\n\
var fsx = require(\'fs-extra\'); \r\n\
var UUIDGenerator = require(\'node-uuid\'); \r\n\
 \r\n\
module.exports.crontab = { \r\n\
 \r\n\
  /* \r\n\
   * The asterisks in the key are equivalent to the \r\n\
   * schedule setting in crontab, i.e. \r\n\
   * minute hour day month day-of-week year \r\n\
   * so in the example below it will run every minute \r\n\
   */ \r\n\
\''+cron_asterisk_str+'\'\: function(){ \r\n\
 \r\n\
    // require(\'../crontab/mycooljob.js\').run(); \r\n\
    sails.controllers.trash.deleteTrashContent(); \r\n\
  } \r\n\
};';
}



}else{
    //else make the file empty
}

            crontabjs = __dirname + '/../../config/crontab.js';
            fsx.readFile(crontabjs, 'utf8', function (err,data) {
              if (err){
                return res.json({
                        error: err,
                        type: 'error'
                    }, 400);
              }

              fsx.writeFile(crontabjs, crontab_html, 'utf8', function (err) {
                 if (err) return res.json({
                    error: err,
                    type: 'error'
                 }, 400);

                console.log('************************************************');
                console.log('API:Cron Setting changed to ');
                console.log('************************************************');

                return res.json({ status: 'ok'}, 200);
              });
            });
    },
};
module.exports = AccountController;
