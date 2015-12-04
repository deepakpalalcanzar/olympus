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


        console.log("reqreqreqreqreqreqreqreqreqreqreqreqreqreqreqreqreqreqreq");
        console.log(req);
        console.log("reqreqreqreqreqreqreqreqreqreqreqreqreqreqreqreqreqreqreq");

        if (!req.param('email')) return res.json({
            error: 'No email provided',
            type: 'error'
        }, 400);

// If the requested account already exists, return it
        Account.findOne({
            email: req.param('email')
        }).exec(function (err, account) {

            if (err) return res.json({
                error: 'Error creating email',
                type: 'error'
            });

            if (account) return res.json({
                error: 'Account with that email already exists',
                type: 'error',
                id: account.id,
                email_msg : 'email_exits',
            });

            if(req.param('isVerified') && !req.param('password')) {
                return res.json({
                    error: 'Account cannot be verified without a password',
                    type: 'error'
                });
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
                        error: 'Error creating account',
                        type: 'error'
                    });

                    if (!req.param('isVerified')) {
// send them a verfication email
                        emailService.sendVerifyEmail({
                            account: account
                        }, function (err, data) {

                            if (err) return res.json({
                                error: 'Error sending verification email',
                                type: 'error'
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
                            account: account
                        }, function (err, data) {

                            if (err) return res.json({
                                error: 'Error sending welcome email',
                                type: 'error'
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
    }
};
module.exports = AccountController;
