/*---------------------
  :: TransactionDetail
  -> model
---------------------*/

var bcrypt = require('bcrypt'),
  lockUtils = require('../services/lib/account/lock'),
  deleteUtils = require('../services/lib/account/destroy'),
  crypto = require('crypto'),
  Q = require('q');

module.exports = {

  attributes: {

    transaction_id: {
      type: 'string',
      required: true
    },

    account_id: 'integer',

    created_date: 'datetime',

    users_limit: 'string',

    quota: 'string',

    paypal_status: 'string',

    is_deleted: {
      type: 'boolean',
      defaultsTo: false
    },

    plan_name: 'string',

    price: {
      type: 'decimal',
    },

    duration: {
      type: 'string',
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
    console.log('**in history model**');
    console.log(options);
    TransactionDetails.create({
      transaction_id  : options.trans_id,
      account_id      : options.account_id,
      created_date    : options.created_date,
      users_limit     : options.users_limit,
      quota           : options.quota,
      plan_name       : options.plan_name,
      price           : options.price,
      duration        : options.duration,
      paypal_status   : options.paypal_status,
    }).exec(function foundAccount (err, account) {
      console.log(err);
        if (err) return cb && cb(err);

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
