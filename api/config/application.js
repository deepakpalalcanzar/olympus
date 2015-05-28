module.exports = {

  // Port this Sails application will live on
  port: process.env.PORT || 1337,

  // The environment the app is deployed in
  // (`development` or `production`)
  //
  // In `production` mode, all css and js are bundled up and minified
  // And your views and templates are cached in-memory.  Gzip is also used.
  // The downside?  Harder to debug, and the server takes longer to start.
  environment: process.env.NODE_ENV || 'development',

  // Used for sending emails
  hostName: 'localhost',
  protocol: 'http://',

  // TODO: make this an adapter config
  mandrill: {
    token: 'f137c8a3-296a-463b-b4b1-d5652b646942'
  }

};
