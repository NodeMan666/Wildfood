/**
 * GET     /markers              ->  index
 * POST    /markers              ->  create
 * GET     /markers/:id          ->  show
 * PUT     /markers/:id          ->  update
 * DELETE  /markers/:id          ->  destroy
 * GET     /markers/:location    -> indexByLocation
 */

'use strict';

var _ = require('lodash');
var Marker = require('./marker.model');
var Flickr = require('./../../components/flickr/flickrutils');
var GeoCoding = require('./../location/geocoding.service.js');
var Q = require("q");
var auth = require('../../auth/auth.service');
var User = require('./../user/user.model');
var Plant = require('./../plant/plant.model');
var UserController = require('./../user/user.controller');
var mongoose = require('mongoose');
var Auth = require('../../auth/auth.service');
var Paging = require('./../../components/paging/paging.utils');

exports.getPopulateConfig = function () {
  var useritems = 'name profile_link profile_picture fullname';
  return [
    {path: "comments.owner", select: useritems},
    {path: "owner", select: useritems},
    {path: "plant", select: 'scientificName marker_count localisedProfile.en_au.commonNames'},
    //{path: "plant", select: ''}
  ];
}

function pickFieldsToMofidy(input) {
  if (input.plant && input.plant._id) {
    input.plant = input.plant._id;
  }
  return _.pick(input, ['plant', 'plant_by_user', 'plant_unknown', 'description', 'location',
    'images', 'access', 'tags', 'permanencyType']);
}

function pickFieldsToCreate(input) {
  if (input.plant && input.plant._id) {
    input.plant = input.plant._id;
  }
  return _.pick(input, ['plant', 'plant_by_user', 'plant_unknown', 'description', 'source', 'location',
    'images', 'access', 'tags', 'permanencyType', 'source_id', 'source_link', 'comments',
    'legacyplantid', 'legacyid', 'created','migrated','imported']);
}


exports.populateMarkersAndReturn = function (req, markerReturnFn, res, applyfunc) {

  markerReturnFn
    .populate(exports.getPopulateConfig())
    .sort('created')
    .skip(Paging.getSkip(req))
    .limit(Paging.getLimit(req))
    .exec(function (err, markers) {
      if (err) {
        console.log(err);
        return handleError(res, err);
      }

      markers = _.map(markers, function (marker) {
        if (marker.plant && marker.plant._id) {
          marker.plant = marker.plant.localisedProfile.en_au.commonNames
        }
        return marker;
      });

      return res.json(200, Paging.populatePagedResults(markers, req));
    });
}

exports.show = function (req, res) {
  //404 too
  //if (marker.private === true && marker.owner.name !== req.user.name) {
  //  return res.send(403)
  //}
  console.log("show " + req.params.id);
  exports.getOneMarker(req.params.id).then(function (marker) {
    console.log("show " + JSON.stringify(marker));
    return res.json(200, marker);
  }, function (err) {
    handleError(res, err);
  });
};


exports.getOneMarker = function (markerId) {
  var deferred = Q.defer();
  var fn = Marker.findById(markerId)
    .populate(exports.getPopulateConfig())
    .exec(function (err, marker) {
      if (err) {
        deferred.reject(err);
      }
      if(marker!=null) {
        deferred.resolve(marker.profile);
      }else{
        deferred.resolve(null);
      }
    });
  return deferred.promise;
};

function findMyMarker(req, res) {
  var deferred = Q.defer();
  Marker.findById(req.params.id).exec(function (err, marker) {
      if (err) {
        return handleError(res, err);
      }
      if (!marker) {
        return res.send(404);
      }
      if ((req.user.id != marker.owner ) && req.user.role != 'admin') {
        return res.send(403);
      }
      deferred.resolve(marker);
    }
  )
  ;
  return deferred.promise;

}


exports.destroy = function (req, res) {
  findMyMarker(req, res).then(function (marker) {
    UserController.updateFavoriteStatus('myMarkers', {
      targetid: marker._id,
      state: false
    }, req.user.id).then(function (user) {
      marker.remove(function (err) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(204);
      });
    });
  });
};

exports.createWithUser = function (req, res) {
  exports.createWithUserMethod(req.body).then(function (marker) {
    return res.json(200, marker);
  }, function (err) {
    return handleError(res, err);
  });
}

exports.createWithUserMethod = function (imputmarker) {
  var deferred = Q.defer();
  var user = imputmarker.owner;
  imputmarker = pickFieldsToCreate(imputmarker);
  imputmarker.owner = user;
  console.log("create new marker at marker.controller", JSON.stringify(imputmarker));

  if (imputmarker.plant_unknown) {
    imputmarker.plant_by_user = null;
    imputmarker.plant = null;
  }

  function fn(imputmarker, deferred) {
    Marker.create(imputmarker, function (err, marker) {

      if (err) {
        return deferred.reject(err);
      }

      if (marker == undefined || marker._id == null) {
        return deferred.reject(new Error("something went wrong with marker creation ", JSON.stringify(imputmarker)));
      }


      UserController.updateFavoriteStatus('myMarkers', {targetid: marker._id, state: true}, user).then(function (user) {
        refreshMarkerCountOfPlantIfNecessary(imputmarker.plant).then(function (rr) {
          exports.getOneMarker(marker._id).then(function (marker) {
            console.log("marker created COMPLETE", JSON.stringify(marker));
            deferred.resolve(marker);
          }, function (err) {
            deferred.reject(err);
          });


        });
      });
    });
  }

  GeoCoding.reverseGeoCode(imputmarker.location.position).then(function (address) {
    imputmarker.location.address = address;
    fn(imputmarker, deferred);
  }, function (err) {
    console.log("Geocoding failed ", err);
    fn(imputmarker, deferred);
  });

  return deferred.promise;
}


exports.create = function (req, res) {
  req.body.owner = req.user.id;
  return exports.createWithUser(req, res);
}


function updateMarkerAndReturn(req, marker, res, notimages) {
  var previous = (marker.plant != null && marker.plant != undefined) ? marker.plant + '' : null;
  var updated = _.merge(marker, req.body);
  if ((req.body.images == null || req.body.images.length == 0) && !notimages) {
    updated.images = [];
    updated.markModified('images');
  }

  console.log("updateMarkerAndReturn", JSON.stringify(updated));

  updated.save(function (err) {
    if (err) {
      return handleError(res, err);
    }
    refreshMarkerCountOfPlantIfNecessary(req.body.plant, previous).then(function () {
      return returnMarkerOrError(err, req, res);
    });
  });
};

exports.admin = function (req, res) {
  req.body = _.pick(req.body, ['verified', 'active', 'plant_unknown', 'plant']);
  req.body.updated = new Date();
  findMyMarker(req, res).then(function (marker) {
    updateMarkerAndReturn(req, marker, res, true);
  })
};

exports.update = function (req, res) {

  req.body = pickFieldsToMofidy(req.body);
  req.body.updated = new Date();
  console.log("marker.controller:update", JSON.stringify(req.body));

  findMyMarker(req, res).then(function (marker) {
    var previousLocation = marker.location.position;
    var currentLocation = req.body.location.position;
    console.log("previousLocation", previousLocation);
    console.log("currentLocation", currentLocation);

    if (currentLocation[0] == previousLocation[0] && currentLocation[1] == previousLocation[1]) {
      console.log("same address, no geocoding required");
      return updateMarkerAndReturn(req, marker, res);
    } else {
      console.log("location changed, geocoding");
      GeoCoding.reverseGeoCode(req.body.location.position).then(function (address) {
        console.log("setting address to ", JSON.stringify(address));
        req.body.location.address = address;
        return updateMarkerAndReturn(req, marker, res);
      }, function (err) {
        console.log("Geocoding failed ", err);
        return updateMarkerAndReturn(req, marker, res);
      });
    }


  });

};


function refreshMarkerCountOfPlantIfNecessary(plantid, previousplantid) {
  var deferred = Q.defer();
  updateMarkerCountrForPlant(plantid).then(function () {
    updateMarkerCountrForPlant(previousplantid).then(function () {
      deferred.resolve();
    });
  });
  return deferred.promise;
}

function updateMarkerCountrForPlant(plantid) {
  var deferred = Q.defer();
  if (plantid != null) {
    console.log("updateMarkerCountrForPlant " + plantid)
    Marker.find({plant: plantid}, function (err, markers) {
      if (!err) {
        var markerIds = markers.map(function (x) {
          return x._id;
        });

        Plant.findById(plantid, function (err, plant) {
          var updated = _.merge(plant, {markers: markerIds, marker_count: markerIds.length});
          console.log("saving plant " + plantid)
          updated.save(function (err) {
            console.log(err);
            deferred.resolve();
          });
        });
      } else {
        console.log(err);
        deferred.resolve();

      }
    });
  } else {
    deferred.resolve();
  }
  return deferred.promise;
}


exports.deletecomment = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  UserController.updateFavoriteStatus('myCommentedMarkers', {
    targetid: req.params.id,
    state: false
  }, req.user.id).then(function (user) {
    Marker.update({_id: req.params.id},
      {$pull: {"comments": {_id: req.params.commentid}}}, function (err, data) {
        return returnMarkerOrError(err, req, res);
      });
  });
};

exports.like = function (req, res) {
  return processVote(req, res, 'likes', true, 'likedMarkers');
};

exports.togglelike = function (req, res) {
  return processVote(req, res, 'likes', req.body.state, 'likedMarkers');
};


exports.unlike = function (req, res) {
  return processVote(req, res, 'likes', false, 'likedMarkers');
};

exports.confirm = function (req, res) {
  return processVote(req, res, 'confirmations', true, 'confirmedMarkers');
};

exports.unconfirm = function (req, res) {
  return processVote(req, res, 'confirmations', false, 'confirmedMarkers');
};

exports.cantfind = function (req, res) {
  return processVote(req, res, 'notfoundVotes', true, 'notfoundMarkers');
};

exports.reversecantfind = function (req, res) {
  return processVote(req, res, 'notfoundVotes', false, 'notfoundMarkers');
};

//exclude all the user marker stuff from the general user json, unless its mine
function processVote(req, res, key, type, userkey) {
  Marker.findById(req.params.id)
    .exec(function (err, marker) {
      if (err) {
        return handleError(res, err);
      }
      if (!marker) {
        console.log("marker not found " + req.params.id);
        return res.send(404);
      }

      var existingItem = findVoteItem(marker, key, req.user.id);
      if (existingItem && type) {
        return res.send(500, "cant vote twice");
      }

      var voteItem = {
        user: req.user.id,
        type: type
      }

      if (Auth.internalHasRole(req.user.role, 'admin')) {
        voteItem.userIsAdmin = true;
      }

      var count = getCurrentVoteCount(marker, key);
      var sets = {$set: {}};
      UserController.updateFavoriteStatus(userkey, {
        targetid: req.params.id,
        state: type
      }, req.user.id).then(function (user) {

        if (type) {
          count++;
          sets.$push = {};
          sets.$push[key + ".items"] = voteItem;
        } else {
          count--;
          sets.$pull = {};
          sets.$pull[key + ".items"] = existingItem;
        }
        sets.$set[key + ".count"] = count;
        Marker.update({_id: req.params.id},
          sets, {upsert: true}, function (err, data) {
            return returnMarkerOrError(err, req, res);
          });

      });
    });
}

function getCurrentVoteCount(marker, key) {
  var count = 0;
  marker[key].items.forEach(function (like) {
    if (like.type) {
      count++;
    } else {
      count--;
    }

  });
  return count;
}

function findVoteItem(marker, key, userid) {
  var found = null;
  if (marker[key] && marker[key].items) {
    marker[key].items.forEach(function (like) {
      if (like.user == userid) {
        found = like;
      }
    });
  }
  return found;
}

exports.addcomment = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  Marker.findById(req.params.id)
    .exec(function (err, marker) {
      if (err) {
        return handleError(res, err);
      }
      if (!marker) {
        console.log("addcomment marker not found " + req.params.id);
        return res.send(404);
      }

      //some validation maybe
      var comment = {}
      comment.text = req.body.text;
      comment.owner = req.user.id;
      if (req.body.images) {
        comment.images = req.body.images;
      }
      console.log("update myCommentedMarkers " + marker.comments);
      UserController.updateFavoriteStatus('myCommentedMarkers', {
        targetid: req.params.id,
        state: true
      }, req.user.id).then(function (user) {
        console.log("addcommentandreturn");
        if (!marker.comments) {
          Marker.update({_id: req.params.id},
            {$set: {comments: []}}, function (err, data) {
              return addcommentandreturn(comment, req, res);
            });
        } else {
          return addcommentandreturn(comment, req, res);
        }

      });
    });
};


function addcommentandreturn(comment, req, res) {
  console.log("pushing " + comment);
  Marker.update({_id: req.params.id},
    {$push: {comments: comment}}, {upsert: true}, function (err, data) {
      return returnMarkerOrError(err, req, res);
    });
}

function returnMarkerOrError(err, req, res) {
  console.log("returnMarkerOrError");
  if (err) {
    return handleError(res, err);
  }
  return exports.show(req, res);
}

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
