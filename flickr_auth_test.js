'use strict';

//This is used to generate the following fields that need to be included in the flickr config
//run this JS file and it will generate the properties, only needs to be done once
//user_id: "129640022@N06",
//    access_token: "72157650062184755-091b588453a80e44",
//    access_token_secret: "edf165e722fd7d6a"

var Flickr = require("flickrapi");
//DEV
//var flickrOptions = {
//  api_key: "abe0822b463e844239ddbb63155613b3",
//  secret: "a02cf544c03ed917",
//  permissions: "write"
//
//};


//PROD
var flickrOptions = {
    api_key: "158b84081eacd003ea8a57554e1924b5",
    secret: "99f31fa338bbdb7d",
    permissions: "write"
};

 Flickr.authenticate(flickrOptions, function(error, flickr) {



  });
