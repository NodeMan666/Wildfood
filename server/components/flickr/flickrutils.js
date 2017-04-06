'use strict';

var fs = require('fs');
//var Flickr = require("./flickrApi/FlickrAPI");
var Q = require("q");
var config = require("./../../config/environment/index");
var flickr = require('flickr-with-uploads');
//var api = flickr("158b84081eacd003ea8a57554e1924b5",
//  "99f31fa338bbdb7d",
//  "72157651021915581-0a031688c84bdc9e",
//  "85da472e5ae01ed5");


function doupload(image) {
  var deferred = Q.defer();

  console.log("uploading to flickr next", image.path);

  api({
    method: 'upload',
    is_public: 1,
    photo: fs.createReadStream(image.path)
  }, function (err, response) {
    if (err) {
      console.error('Could not upload photo:', err);
      deferred.reject(new Error(err));
      return;
    }
    else {
      console.log('success upload photo: ', response.photoid[0]);
      var resultid = response.photoid[0];
      api({method: 'flickr.photos.getSizes', photo_id: resultid}, function (error, response) {
        if (error) {
          console.log("flickr error", JSON.stringify(error));
          deferred.reject(new Error(error));
          return;
        }
        console.log('Full photo info:', response);

        var versions = parseFlickrSizes(response);
        console.log("flickr done ", versions);
        //deferred.resolve({flickr: {id: resultid, sizes: result.sizes.size}, versions: versions});
        deferred.resolve({flickr: {id: resultid}, versions: versions});

      });
    }
  });

  return deferred.promise;
}


exports.uploadimage = function (image) {

  var deferred = Q.defer();
  console.log("uploadimage START", JSON.stringify(image));


  exports.authenticate().then(function (flickr) {
    return doupload(image).then(function (returnobject) {
      deferred.resolve(returnobject);
    });
  }).done();

  return deferred.promise;
}


var api;


exports.authenticate = function () {
  var deferred = Q.defer();
  console.log("Flickr.authenticate ");

  if (api == null) {
    try {
      console.log("log in to flickr with " + config.flickr.api_key)
      api = flickr(
        config.flickr.api_key,
        config.flickr.secret,
        config.flickr.access_token,
        config.flickr.access_token_secret);
      deferred.resolve(api);
    } catch (err) {
      console.log("error with flickr", err);
    }
  } else {
    console.log("already authenticated");
    deferred.resolve(api);
  }

  return deferred.promise;
}


function parseSize(size) {
  return {
    url: size.$.source,
    width: size.$.width,
    height: size.$.height
  };
}

function parseFlickrSizes(result) {
  var versions = {};
  result.sizes[0].size.forEach(function (size) {
    if (size.$.label == "Large Square") {
      versions.thumb = parseSize(size);
    } else if (size.$.label == "Small 320") {
      versions.low = parseSize(size);
    } else if (size.$.label == "Medium 640") {
      versions.standard = parseSize(size);
    }
  });
  return versions;
}
