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
var MarkerController = require('./marker.controller');
var util = require('util');

var Q = require("q");
var auth = require('../../auth/auth.service');
var User = require('./../user/user.model');
var Plant = require('./../plant/plant.model');
var UserController = require('./../user/user.controller');
var mongoose = require('mongoose');
var Auth = require('../../auth/auth.service');
var Paging = require('./../../components/paging/paging.utils');

function parseCoordinate(c){


  //var f =  parseFloat(c).toFixed(6);
  var f =  parseFloat(c);
  //return c;
  return f;
}

function getMarkersWithLocation(req, res) {
  var deferred = Q.defer();

  if (!req.query.lat || !req.query.long) {
    return res.json(500, "Please provide request parameters 'lat' and 'long'");
  }
  var minDist = 10000;
  getSearchConditions(req, res).then(function (cond) {
    var point = {type: 'Point', coordinates: [parseCoordinate(req.query.long), parseCoordinate(req.query.lat)]};
    var opts = {
      maxDistance: minDist, //in meters
      spherical: true,
      query: cond
    };

    if (req.query.range) {
      opts.maxDistance = parseFloat(req.query.range);
    } else {
      opts.maxDistance = calculateCurrentRange(req);
    }

    if (opts.maxDistance < minDist) {
      opts.maxDistance = minDist;
    }

    var aggr = [
      {
        "$geoNear": {
          "near": {
            "type": "Point",
            "coordinates": point.coordinates
          },
          "spherical": true,
          "distanceField": "dis",
          "maxDistance": opts.maxDistance,
          "query": cond
        }
      }
    ];

    if (req.query.sortBy) {
      if (req.query.sortBy == 'recent') {
        aggr.push({$sort : {created: -1}});
      }
    }

    aggr.push({"$skip": Paging.getSkip(req)});
    aggr.push( {"$limit": Paging.getLimit(req)});

    console.log("Quering markers with: " + JSON.stringify(aggr));
    try {
      Marker.aggregate(
        aggr, function (err, markers) {

          if (err) {
            console.log(err);
            var results = Paging.populatePagedResults([], req, 1000);
            //var results = Paging.populatePagedResults(docs, req, count);

            deferred.resolve(results);
            return
            //return handleError(res, err);
          }

          markers = markers.map(function (x) {
            delete x.dis;
            var m = new Marker(x);
            //if(m.plant && m.plant._id){
            //    m.plant.commonNames = m.plant.localisedProfile.en_au.commonNames
            //}
            return m;
          });

          Marker.populate(markers, MarkerController.getPopulateConfig(), function (err, docs) {
            if (err) throw err;
            //  Marker.count(aggr[0], function (err, count) {

            docs = docs.map(function (m) {
              return m.profile;
            });

            var results = Paging.populatePagedResults(docs, req, 1000);
            //var results = Paging.populatePagedResults(docs, req, count);

            deferred.resolve(results);
            // })


          });

        });
    } catch (err) {
      console.log(err);
      var results = Paging.populatePagedResults([], req, 1000);
      //var results = Paging.populatePagedResults(docs, req, count);

      deferred.resolve(results);
    }
  });


  return deferred.promise;
}

function parseBoolean(string) {
  switch (string.toLowerCase()) {
    case "true":
    case "yes":
    case "1":
      return true;
    case "false":
    case "no":
    case "0":
    case null:
      return false;
    default:
      return Boolean(string);
  }
}

function rest(req, cond, and, or) {
  if (req.query.search) {
    var regex = new RegExp(req.query.search, "i");
    or.push({description: regex});
    or.push({title: regex});
  }

  if (req.query.plant) {
    if (req.query.plant == 'none') {
      and.push({plant: {$exists: false}});
    } else {
      and.push({plant: mongoose.Types.ObjectId(req.query.plant)});
    }
  }


  if (req.query.beforeDate || req.query.afterDate) {
    var dateCond = {};
    and.push({created: dateCond});
    console.log(req.query.afterDate);
    console.log(req.query.beforeDate);
    if (req.query.afterDate) {
      dateCond.$gte = new Date(req.query.afterDate);
    }

    if (req.query.beforeDate) {
      dateCond.$lt = new Date(req.query.beforeDate);
    }
  }

  if (req.query.verified) {
    and.push({verified: parseBoolean(req.query.verified)});
  }

  if (req.query.active) {
    if (req.query.active == 'both') {
    } else {
      and.push({active: parseBoolean(req.query.active)});
    }
  } else {
    and.push({active: true});
  }

  if (req.query.plant_unknown) {
    and.push({plant_unknown: parseBoolean(req.query.plant_unknown)});
  }

  if (req.query.owner) {
    and.push({owner: mongoose.Types.ObjectId(req.query.owner)});
  }

  if (and.length > 0) {
    cond.$and = and;
  }

  if (or.length > 0) {
    cond.$or = or;
  }
  return cond;
}

function getSearchConditions(req, res) {
  var deferred = Q.defer();
  var cond = {};
  var and = [];
  var or = [];

  Auth.internalIsAuthenticated(req, res, function (result) {
    if (result && result.status == 401) {
      and.push({private: false});
      deferred.resolve(rest(req, cond, and, or));
    } else {

      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        req.user = user;

        if (!Auth.internalHasRole(req.user.role, 'admin')) {
          and.push({
            $or: [
              {private: false},
              {owner: mongoose.Types.ObjectId(req.user.id)}
            ]
          });
        }
        deferred.resolve(rest(req, cond, and, or));
      });
    }


  });

  return deferred.promise;
}
//exports.recent = function (req, res) {
//  //req.afterDate = moment().subtract(20, 'days');
//  req.sortBy = 'recent';
//  return exports.index(req, res);
//};
exports.index = function (req, res) {

  if (req.query.lat && req.query.long) {
    return exports.indexByLocation(req, res);
  } else {
    exports.searchMarkers(req, res).then(function (markers) {
      return res.json(200, markers);
    }, function (err) {
      console.log(err);
      return handleError(res, err);
    });


  }
};

exports.indexByLocation = function (req, res) {
  return getMarkersWithLocation(req, res).then(function (markers) {
    return res.json(200, markers);
  });
};

exports.searchMarkersWithLocation = function (req, res) {
  return getMarkersWithLocation(req, res);
}

exports.searchMarkers = function (req, res) {
  var deferred = Q.defer();
  getSearchConditions(req, res).then(function (cond) {
    var fn = Marker.find(cond);
    console.log("Quering markers with: " + JSON.stringify(cond));
    fn
      .populate(MarkerController.getPopulateConfig())
      .sort('created')
      .skip(Paging.getSkip(req))
      .limit(Paging.getLimit(req))
      .exec(function (err, markers) {
        if (err) {
          deferred.reject(err);
        }
        markers = _.map(markers, function (marker) {
          return marker.profile;
        });
        deferred.resolve(Paging.populatePagedResults(markers, req));
      });
  });
  return deferred.promise;
}

exports.mymarkers = function (req, res) {
  var conditions = {owner: req.user.id};
  return getMarkersAndReturn(req, conditions, res);
};

exports.myfavorites = function (req, res) {
  UserController.getFavoriteIds(req, res, 'favoriteMarkers').then(function (ids) {
    var conditions = {_id: {$in: ids}};
    return getMarkersAndReturn(req, conditions, res);
  });

};

function getMarkersAndReturn(req, conditions, res, applyfunc) {
  var fn = Marker.find(conditions);
  console.log("Quering markers with: " + JSON.stringify(conditions));
  MarkerController.populateMarkersAndReturn(req, fn, res, applyfunc);
}


function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}

function calculateCurrentRange(params) {
  var d = calculateDistanceFromPoints(params.sw, params.ne);
  return d * 1000 / 2;
}

function calculateDistanceFromPoints(latlong1, latlong2) {
  return calculateDistance(latlong1.lat, latlong1.long, latlong2.lat, latlong2.long);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  // http://www.movable-type.co.uk/scripts/latlong.html
  var R = 6371; // km
  var v1 = toRadians(lat1);
  var v2 = toRadians(lat2);
  var vvv = toRadians(lat2 - lat1);
  var ddd = toRadians(lon2 - lon1);

  var a = Math.sin(vvv / 2) * Math.sin(vvv / 2)
    + Math.cos(v1) * Math.cos(v2)
    * Math.sin(ddd / 2) * Math.sin(ddd / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math
      .sqrt(1 - a));

  var d = R * c;
  return d;
}

function toRadians(number) {
  return number * Math.PI / 180;
}
