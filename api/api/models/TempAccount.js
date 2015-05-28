/*---------------------
  :: TempAccount
  -> model
---------------------*/

var bcrypt = require('bcrypt'),
  lockUtils = require('../services/lib/account/lock'),
  deleteUtils = require('../services/lib/account/destroy'),
  crypto = require('crypto'),
  Q = require('q');

module.exports = {

  attributes: {

    email: {
      type: 'string',
      required: true
    },

    password: {
      type: 'string',
      minLength: 3,
      required: true
    },

    name: {
      type: 'string',
      minLength: 3,
      maxLength: 25,
      required: true
    },

   is_enterprise: {
      type: 'boolean',
      defaultsTo: false
    },



    /****************************************************
     * Instance Methods
     ****************************************************/

    /**
     * Override the destroy instance method to flag as deleted
     *
     * @param {Function} callback
     */

    destroy: function (cb) {
      var self = this;

      // Flag as deleted
      this.deleted = true;
      this.deleteDate = new Date();

      this.save(function (err) {
        if (err) return cb(err);

        deleteUtils.recursiveDelete(self.id, function (err) {
          if (err) return cb(err);
          cb(null, self);
        });
      });
    },


    /**
     * Override toJSON()
     */

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      delete obj.deleted;
      delete obj.verified;
      delete obj.verificationCode;
      return obj;
    },


    /**
     * Lock an account and recursively lock all directories and files within
     * any workgroups the account is owner of.
     */

    lock: function (lockState, cb) {
      var self = this;

      // Flag as locked
      this.isLocked = lockState;

      this.save(function (err) {
        if (err) return cb(err);

        lockUtils.recursiveLock(self.id, lockState, function (err) {
          if (err) return cb(err);
          cb(null, self);
        });
      });
    }
  },

  // creates an account, returning a promise if no callback is specified
  createAccount: function (options, cb) {

    TempAccount.create({
      name: options.name || options.email,
      email: options.email,
      password: options.password || crypto.randomBytes(10).toString('hex'),
      is_enterprise : options.is_enterprise,
    }).exec(function foundAccount (err, account) {

        if (err) return cb && cb(err);
// Now create a workgroup, assigning the new account as an admin
            // var dirOptions = {
            //     name: account.name + '\'s Workgroup',
            //     quota: options.quota
            // };

            // Directory.createWorkgroup(dirOptions, account.id, true, function (err, results) {
            //     if (err) return cb && cb(err);
            //         return cb && cb(null, account);
            // });

        return cb && cb(null, account);
    });
  },

  /****************************************************
   * Lifecycle Callbacks
   ****************************************************/

  // beforeCreate: function encryptPassword(values, cb) {
  //   bcrypt.hash(values.password, 10, function (err, hash) {
  //     if (err) return cb(err);
  //     values.password = hash;
  //     cb();
  //   });
  // },


  // beforeSave: function encryptPassword(values, cb) {
  //   bcrypt.hash(values.password, 10, function (err, hash) {
  //     if (err) return cb(err);
  //     values.password = hash;
  //     cb();
  //   });
  // }

};
