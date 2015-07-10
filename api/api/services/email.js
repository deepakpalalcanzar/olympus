// TODO: make this an adapter
var mandrill = require('node-mandrill')(require('../../config/application').mandrill.token);


exports.sendWelcomeEmail = function (options, cb) {

  var account = options.account;

  // Send an email to the user we just verified, giving them their username / password
  var host = sails.config.hostName;
  var protocol = sails.config.protocol || 'http://';

  mandrill('/messages/send', {
    message: {
      "subject": "Welcome to Olympus",
      "from_email": "info@olympus.co",
      "from_name": "Olympus",
      "to": [{
        "email": account.email,
        "name": account.name
      }],
      "track_opens": true,
      "track_clicks": true,
      "auto_text": true,
      "url_strip_qs": true,
      "tags": ["test", "example", "sample"],
      "google_analytics_domains": ["werxltd.com"],
      "html": "Dear " + account.name + ",<br/><br/>Welcome to the Olympus file sharing system!  Your account details are: <br/><br/>User: " + account.email + "<br/><br/>To log in to Olympus, <a href='" + protocol + host + "'>click here.</a><br/><br/>Sincerely,<br/>The Olympus Team",
      "text": "Dear " + account.name + ",\n\nWelcome to the Olympus file sharing system!  Your account details are: \n\nUser: " + account.email + "\n\nTo log in to Olympus, go to " + protocol + host + "\n\nSincerely,\nThe Olympus Team"
    }
  }, cb);


};

exports.sendVerifyEmail = function (options, cb) {

  var account = options.account;

  // Send an email to the user we just verified, giving them their username / password
  var host = sails.config.hostName;
  var protocol = sails.config.protocol || 'http://';

  mandrill('/messages/send', {
    message: {
      "subject": "Welcome to Olympus",
      "from_email": "info@balderdash.co",
      "from_name": "Olympus",
      "to": [{
        "email": account.email,
        "name": account.name
      }],
      "track_opens": true,
      "track_clicks": true,
      "auto_text": true,
      "url_strip_qs": true,
      "tags": ["test", "example", "sample"],
      "google_analytics_domains": ["werxltd.com"],
      "html": "Dear " + account.name + ",<br/><br/>Welcome to the Olympus file sharing system!  In order to log in to Olympus, please verify your account by <a href='" + protocol + host + "/auth/verify?code=" + account.verificationCode + "'>clicking here</a>",
      "text": "Dear " + account.name + ",\n\nWelcome to the Olympus file sharing system!  In order to log in to Olympus, please verify your account by <a href='" + protocol + host + "/auth/verify?code=" + account.verificationCode + "'>clicking here</a>"
    }
  }, cb);
};

exports.sendInviteEmail = function (options, cb) {

  // accountName is the name of the account that is inviting
  var accountName = options.accountName;

  // the target account model
  var account = options.account;

  // the file/folder model
  var inode = options.inode;

  // 'file'/'folder'
  var nodeType = options.nodeType;
  var host = sails.config.hostName;
  var protocol = sails.config.protocol || 'http://';

  // Send an email to the user we granted permissions to.  If they're a new
  // user, send them the verification link.  Otherwise, just send them an update.
  var opts = {
    "message": {
      "subject": accountName + " shared a " + nodeType + " with  you on Olympus",
      "from_email": "info@olympus.io",
      "from_name": "Olympus",
      "to": [{
        "email": account.email,
        "name": account.name
      }],
      "track_opens": true,
      "track_clicks": true,
      "auto_text": true,
      "url_strip_qs": true,
      "tags": ["test", "example", "sample"],
      "google_analytics_domains": ["werxltd.com"]
    }
  };
  if (account.verified === true) {
    opts.message.html = "Dear " + account.name + ",<br/><br/>You were added to the " + nodeType + " &ldquo;" + inode.name + "&rdquo;.";
    opts.message.text = "Dear " + account.name + ",\n\nYou were added to the " + nodeType + " '" + inode.name + "'.";
  } else {

    opts.message.html = "Dear " + account.name + ",<br/><br/>" + account.name + "    has shared a " + nodeType + " with you in the Olympus file sharing system.  In order to log in to Olympus, please verify your account by <a href='" + protocol + host + "/auth/verify?code=" + account.verificationCode + "'>clicking here</a>";
    opts.message.text = "Dear " + account.name + ",\n\n" + accountName + " has      shared a " + nodeType + " with you in the Olympus file sharing system.  In order to log in to     Olympus, please verify your account by <a href='" + protocol + host + "/auth/verify?code=" + account.verificationCode + "'>clicking here</a>";
  }

  mandrill('/messages/send', opts, cb);
};
