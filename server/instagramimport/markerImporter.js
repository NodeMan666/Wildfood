var Q = require("q");
var Marker = require('./../api/marker/marker.model');
var MarkerController = require('./../api/marker/marker.controller');
var User = require('../api/user/user.model');
var UserController = require('../api/user/user.controller');
var Plant = require('./../api/plant/plant.model.js');
var PlantMatcher = require('./plantmatcher');
var PromiseUtils = require('./promiseUtils');
var UserUtils = require('./userrefresh/userrefresher');
var ImportUtils = require('./importUtils');
var Config = require('./../config/environment');


function convertMarkerFields(item) {
  //console.log("convertMarkerFields, ", JSON.stringify(item));
  var marker = {location: {position: [item.location.longitude, item.location.latitude]}};
  marker.tags = item.tags;
  marker.source = 'instagram';
  marker.source_id = item.id;
  marker.source_link = item.link;
  marker.created = ImportUtils.convertDate(item.created_time);
  if (item.caption) {
    marker.description = item.caption.text;
  }
  var image = {}
  marker.images = [image];
  image.versions = {};

  image.versions.thumb = item.images.thumbnail;
  image.versions.standard = item.images.standard_resolution;
  image.versions.low = item.images.low_resolution;
  marker.imported = new Date();
  return marker;
}


exports.importMarker = function (item, plants) {
  //console.log("import single marker");
  var deferred = Q.defer();
  Marker.findOne({"source_id": item.id},
    function (err, marker) {
      if (err) {
        deferred.reject(err);
      }
      if (marker == null) {
        //console.log("import: marker doesn't exist, creating it based on ", JSON.stringify(item));
        var timeoutProtect = setTimeout(function () {
          timeoutProtect = null;
          return getWildfoodUser(item.user).then(function (user) {
            return convertComments(item).then(function (comments) {
              return ImportUtils.processLocation(item).then(function (convertedLocation) {
                return PlantMatcher.matchPlant(item, plants).then(function (plant) {
                  var converted = convertMarkerFields(item);
                  converted.owner = user._id;
                  converted.comments = comments;

                  if (convertedLocation) {
                    converted.location.address = convertedLocation;
                  }

                  if (plant != null) {
                    converted.plant = plant;
                  }
                  sendMarker(converted, deferred);
                });

              });
            });
          });
        }, Config.jobs.importmarkers.timeout);
      } else {
       // console.log("import: marker exists already, do nothing " + marker._id);
        deferred.resolve({status: 2, text: "Exists already"});
      }
    });

  return deferred.promise;
}

function updateUserWithComments(comment, marker){
  return UserController.updateFavoriteStatus('myCommentedMarkers', {
    targetid: marker._id,
    state: true
  },comment.owner._id);
}

function sendMarker(converted, deferred) {
  //console.log("sending ", JSON.stringify(converted));

  MarkerController.createWithUserMethod(converted).then(function (marker) {
    if(marker.comments && marker.comments.length >0){
      PromiseUtils.runAsyncFnBasedOnArray(marker.comments, updateUserWithComments, marker).then(function(results){
        deferred.resolve(marker);
      })
    }else{
      deferred.resolve(marker);
    }


  }, function (err) {
    deferred.reject(err);
  });


}


function convertComments(useritem) {
  //console.log("converting comments");
  var deferred = Q.defer();
  if (useritem.comments && useritem.comments.data && useritem.comments.data.length > 0) {
    PromiseUtils.runAsyncFnBasedOnArray(useritem.comments.data, getComment).then(function (results) {
      deferred.resolve(results);
    });

  } else {
    deferred.resolve(null);
  }
  return deferred.promise;
}

function getComment(comment) {
  var deferred = Q.defer();
  getWildfoodUser(comment.from).then(function (user) {
      var c = {};
      c.text = comment.text;
      c.source_id = comment.id;
      c.created = ImportUtils.convertDate(comment.created_time);
      c.owner = user._id;
      deferred.resolve(c);
    });

  return deferred.promise;
}

function getWildfoodUser(useritem) {
  return UserUtils.updateUser(useritem);
}


function canBeImported(item) {
  return item && item.location && item.location.latitude && item.location.longitude;
}

exports.importIfPossible = function (item, plants) {
  var deferred = Q.defer();
  if (canBeImported(item)) {
    exports.importMarker(item, plants).then(function (result) {
      //console.log("importIfPossible");
      deferred.resolve(result);
    }, function (err) {
        console.log("failed to import " + JSON.stringify(item), err)
        delete item.images;
        delete item.location;
        delete item.comments;
        deferred.resolve({status: 3, text: "Exception: " + JSON.stringify(item) + " " + err, error: err });
    });
  } else {
    //console.log("can't be converted " + JSON.stringify(item));
    deferred.resolve({status: "1", text: "can't be imported. most likely no location"});
  }
  return deferred.promise;
}


