/*---------------------
  :: Directory
  -> controller
---------------------*/

var copy = require('../services/lib/directory/copy'),
  emailService = require('../services/email');

var DirectoryController = {

  /**
   * POST /folder/:id/copy
   *
   * Copies a directory and all it's contents over to a new destination.
   *
   * ACL should be done at the policy level before getting here
   * so we can just look up the Account by the `id` param.
   */

  copy: function(req, res) {

    if (!req.param('id')) {
      return res.json({
        error: new Error('Must include a folder id').message,
        type: 'error'
      }, 400);
    }

    // Force to make sure a dest directory ID is defined
    if (!req.param('dest')) {
      return res.json({
        error: new Error('Must include a dest Id').message,
        type: 'error'
      }, 400);
    }

    // Check to make sure this user has the proper permissions in the target directory
    var permissionCriteria = {
      AccountId: req.session.Account && req.session.Account.id,
      DirectoryId: req.param('dest'),
      type: ['admin', 'write']
    };

    DirectoryPermission.find(permissionCriteria).exec(function(err, perms) {
      if (err) return res.json({
        error: err.message,
        type: 'error'
      }, 400);
      if (perms.length < 1) return res.send(403);

      // Find the directory we will be copying
      Directory.findOne(req.param('id')).exec(function(err, directory) {
        // Set the name if it was passed in
        directory.name = req.param('name', directory.name);

        // Copy Directory and all it's children and permissions
        directory.copy(req.param('dest'), function(err, copiedDir) {
          if (err) return res.json({
            error: err.message,
            type: 'error'
          }, 400);
          res.json(copiedDir, 200);
        });

      });
    });
  },

  share: function(req, res) {
    var directoryId = req.params.id;
    var emails = req.param('emails', []);
    var type = req.param('type');

    if (!directoryId || emails.length === 0 || !type) {
      return res.json({
        error: 'No file id and/or emails and/or type specified',
        type: 'error'
      });
    }

    var globalDirectory;
    Directory.findOne(directoryId).then(function(directory) {

      globalDirectory = directory;

      sails.log('Found directory :: ', directory);

      // get accounts referenced by email, or create if they don't exist
      var accounts = emails.map(function(email) {
        return Account.findOne({
          email: email
        }).then(function(account) {
          console.log(account);
          console.log(type);
          if (account || type === 'revoke') return account;
          // return Account.createAccount({ email: email, isVerified: false, isAdmin: false }).then(function(account) {

             
          //   // send an invite email
          //   emailService.sendInviteEmail({
          //     accountName: req.session.Account && req.session.Account.name || 'Someone',
          //     account: account,
          //     inode: directory,
          //     nodeType: 'folder'
          //   }, function(err, data) {
          //     console.log(data);
          //     if (err) sails.log.warn(err);
          //   });

          //   return account;
          // });

            var options = {
                name       : email,
                email       : email,
                isAdmin     : false,
                isVerified  : false,
                created_by  : req.param('created_by') !== 'undefined' ? req.param('created_by') : '',
                subscription_id : '1',
                title           : "OLYMPUS",
                ip              : "50.19.74.171",
                is_enterprise   : req.param('is_enterprise') !== 'undefined' ? req.param('is_enterprise') : '',
            };

            Account.createAccount(options, function(err, account) {

            console.log("ahdaskjdhaskjhaskhaskdjhaskdhaskdjashkashdaskjdajkhasjdaskasjkhashdjkhasha");
            console.log(err);
            console.log("ahdaskjdhaskjhaskhaskdjhaskdhaskdjashkashdaskjdajkhasjdaskasjkhashdjkhasha");
            console.log(account);

    // send an invite email
                emailService.sendInviteEmail({
                    accountName: req.session.Account && req.session.Account.name || 'Someone',
                    account: account,
                    inode: directory,
                    nodeType: 'folder'
                }, function(err, data) {
                    if (err) sails.log.warn(err);
                });
                 // return account;
            });

        }).fail(function(err) {
          return null;
        });
      });

      return accounts;
    }).all().then(function(accounts) {
      accounts.map(function(account) {
        if (!account) return;

        // grant file permissions
        globalDirectory.share(type, account.id, true);
      });
    }).then(function() {

      res.json({
        status: 'ok'
      });

    }).fail(function(err) {
      res.json({
        error: 'file not found',
        type: 'error'
      });
    });
  },


  getQuota: function(req, res) {
    var id = req.param('folderId');

    if (!id) return res.json({
      error: new Error('No folder id specified').message,
      type: 'error'
    }, 400);

    Directory.findOne(id).then(function(dir) {
      if (!dir) {
        return res.json({
          error: 'Directory not found',
          type: 'error'
        }, 400);
      }
      return res.json({
        quota: dir.quota
      });
    })

    .fail(function(err) {
      return res.json({
        error: err.message,
        type: 'error'
      }, 400);
    });

  },

  setQuota: function(req, res) {
    var id = req.param('folderId');
    var quota = req.param('quota');

    if (!id || !quota) return res.json({
      error: new Error('No folder id and/or quota specified').message,
      type: 'error'
    }, 400);

    Directory.findOne(id).then(function(dir) {
      if (!dir) {
        return res.json({
          error: 'Directory not found',
          type: 'error'
        }, 400);
      }
      dir.quota = quota;
      dir.save(function(err) {
        if (err) return res.json({
          error: err.message,
          type: 'error'
        }, 400);

        return res.json({
          quota: quota
        });
      });
    })

    .fail(function(err) {

      return res.json({
        error: err.message,
        type: 'error'
      }, 400);

    });
  },

    createWorkgroup: function(req, res){

      var dirOptions = {
          name : req.param('account_name') + '\'s Workgroup',
          quota: "1000000000"
      };

      var transOptions = {
          trans_id  : "default",
          account_id      : req.param('account_id'),
          created_date    : "2014-12-26 13:45:28" ,
          users_limit     : "10",
          quota           : "10",
          plan_name       : "Demo Plan",
          price           : "0",
          duration        : "12",
          paypal_status   : "",
      };

        Directory.createWorkgroup(dirOptions, req.param('account_id'), true, function (err, results) {
            
            if (err) return res.json({ error: err.message, type: 'error'}, 400);

            TransactionDetails.createAccount(transOptions, function(err, trans) {
                if (err) return res.json({ error: err.message, type: 'error'}, 400);
                return res.json({
                    type : 'succes',
                    directory : trans 
                });
            });

        });

    }

};
module.exports = DirectoryController;
