/**
 * GET     /plants              ->  index
 * POST    /plants              ->  create
 * GET     /plants/:id          ->  show
 * PUT     /plants/:id          ->  update
 * DELETE  /plants/:id          ->  destroy
 */

'use strict';

var Plant = require('./plant.model');
var _ = require('lodash');
var Auth = require('../../auth/auth.service');
var User = require('./../user/user.model');
var UserController = require('./../user/user.controller');
var markerController = require('./../marker/marker.search.controller');
var Q = require("q");
var Paging = require('./../../components/paging/paging.utils');
var mongoose = require('mongoose');

function pickFieldsToMofidy(input) {
  return _.pick(input, ['active', 'wiki_link', 'ala_link', 'notes',
    'warnings', 'danger', 'activeSubstances',
    'distinguishing_features', 'commonNames', 'scientificName', 'family', 'habitat',
    'description', 'characteristics', 'images', 'edibility',
    'medicinalProfile', 'otherUses', 'legacyid', 'permanencyType', 'seasonalProfile', 'localisedProfile']);
}


function getPopulateConfig() {
  var userfields = 'name';
  return [
    {path: "seasonalProfile.items.climate"},
    {path: "created_by", select: userfields},
    {path: "updated_by", select: userfields}
  ];
}


exports.index = function (req, res) {

  if (req.query.lat && req.query.long) {
    req.query.range = 30000;
    return exports.getPlantsByLocationAndReturn(req, res);
  } else {
    var conditions = {};
    if (req.query.search != null) {
      conditions = getSearchConditions(req.query.search);
    }
    return getPlantsByConditionAndReturn(req, conditions, res);
  }

};

exports.getPlantsByLocationAndReturn = function (req, res) {
  markerController.searchMarkersWithLocation(req, res).then(function (markers) {

    var count = {};

    markers.data.forEach(function (marker) {
      if (marker.plant && marker.plant._id) {
        if (count[marker.plant._id]) {
          count[marker.plant._id] = count[marker.plant._id] + 1;
        } else {
          count[marker.plant._id] = 1;
        }
      }
    });

    var array = [];
    _.keys(count).forEach(function (key) {
      array.push({
        id: mongoose.Types.ObjectId(key), count: count[key]
      })
    });
   var sorted =_.sortByOrder(array, 'count',true);

    var ids = _.pluck(sorted, 'id');
    var conditions = {_id: {$in: ids}};

    var f = function(plant){
      array.forEach(function (item) {
        if(JSON.stringify(item.id) ==JSON.stringify(plant._id)){
          plant.local_tags = item.count
        }
      });
    }
    return getPlantsByConditionAndReturn(req, conditions, res,f);

  }).done();
};

function getSearchConditions(searchstring) {
  //i makes it case insensitive
  var regex = new RegExp(searchstring, "i");
  return {
    $or: [
      {scientificName: regex},
      {'localisedProfile.en_au.commonNames': regex},
      {family: regex},
      {'localisedProfile.en_au.description': regex}
    ]
  };
}

exports.myfavorites = function (req, res) {
  UserController.getFavoriteIds(req, res, 'favoritePlants').then(function (ids) {
    var conditions = {_id: {$in: ids}};
    return getPlantsByConditionAndReturn(req, conditions, res);
  });
};

exports.searchPlants = function (searchStr, req, res) {
  var conditions = getSearchConditions(searchStr);
  return getPlants(req, conditions, res);
}

function getPlants(req, conditions, res, applyfn) {
  var deferred = Q.defer();
  Plant
    .find(conditions)
    .populate(getPopulateConfig())
    .sort('localisedProfile.en_au.name')
    .skip(Paging.getSkip(req))
    .limit(Paging.getLimit(req))
    .exec(function (err, plants) {
      if (err) {
        deferred.reject(err);
      }

      plants = _.map(plants, function (plant) {
        return plant.profile;
      });

      if(applyfn!=null){
        plants.forEach(function(p){
          applyfn(p);
        });
      }

      deferred.resolve(Paging.populatePagedResults(plants, req));
    });
  return deferred.promise;
}

function getPlantsByConditionAndReturn(req, conditions, res, applyfn) {
  getPlants(req, conditions, res,applyfn).then(function (plants) {
    return res.json(200, plants);
  });
}

exports.showFull = function (req, res) {
  Plant.findById(req.params.id)
    .populate(getPopulateConfig())
    .lean()
    .exec(function (err, plant) {
      if (err) {
        handleError(err, res);
      }
      if (!plant) {
        return res.send(404);
      }
      plant.commonNames = plant.localisedProfile.en_au.commonNames;

      return res.json(plant);

    });
};


exports.show = function (req, res) {
  Plant.findById(req.params.id)
    .populate(getPopulateConfig())
    .exec(function (err, plant) {
      if (err) {
        handleError(err, res);
      }
      if (!plant) {
        return res.send(404);
      }
      return res.json(plant.profile);

    });
};

function returnPlantOrError(err, req, res) {
  if (err) {
    return handleError(res, err);
  }
  return exports.show(req, res);
}

exports.create = function (req, res) {
  req.body = pickFieldsToMofidy(req.body);
  console.log("create new plant", JSON.stringify(req.body));
  req.body.created_by = req.user.id;
  req.body.updated_by = req.user.id;
  updateClimateZone(req.body);

  Plant.create(req.body, function (err, plant) {
    if (err) {
      return handleError(res, err);
    }
    req.params.id = plant._id;
    return exports.showFull(req, res);
  })
  ;
};

function updateClimateZone(plant) {

  if (plant.seasonalProfile && plant.seasonalProfile.items) {
    plant.seasonalProfile.items.forEach(function (zone) {
      if (zone.climate && zone.climate._id) {
        zone.climate = zone.climate._id;
      }
    });

  }

}


exports.update = function (req, res) {
  req.body = pickFieldsToMofidy(req.body);
  console.log("update plant", JSON.stringify(req.body));
  req.body.updated_by = req.user.id;
  req.body.updated = new Date();


  updateClimateZone(req.body);

  Plant.findById(req.params.id, function (err, plant) {
    if (err) {
      return handleError(res, err);
    }
    if (!plant) {
      return res.send(404);
    }
    var updated = _.merge(plant, req.body);
    //have to do this for all sub arrays, otherwise they don't update
    updated.markModified('commonNames');
    updated.markModified('notes');
    if (req.body.images == null || req.body.images.length == 0) {
      updated.images = [];
    }

    updated.markModified('images');

    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return exports.show(req, res);
    });
  });
};

// Deletes a plant .
exports.destroy = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Plant.findById(req.params.id, function (err, plant) {
    if (err) {
      return handleError(res, err);
    }
    if (!plant) {
      return res.send(404);
    }
    //plant.deleted = true;
    plant.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log("ERROR", err);
  return res.send(500, err);
}
