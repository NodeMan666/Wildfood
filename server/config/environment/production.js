'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.PORT ||
  8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
    'mongodb://localhost/wildfood'
  },
  runJobs: true,

  flickr: {
    api_key: "158b84081eacd003ea8a57554e1924b5",
    secret: "99f31fa338bbdb7d",
    permissions: "write",
    user_id: "131552279@N02",
    access_token: "72157651021915581-0a031688c84bdc9e",
    access_token_secret: "85da472e5ae01ed5"
  }

};
