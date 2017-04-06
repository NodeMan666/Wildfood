'use strict';

var _ = require('lodash');
var Climatezone = require('./climatezone.model');
var Mapper = require('./climatedata.mapper');

// Get list of climatezones
exports.index = function(req, res) {
  Climatezone.find(function (err, climatezones) {
    if(err) { return handleError(res, err); }
    return res.json(200, climatezones);
  });
};

// Get a single climatezone
exports.show = function(req, res) {
  Climatezone.findById(req.params.id, function (err, climatezone) {
    if(err) { return handleError(res, err); }
    if(!climatezone) { return res.send(404); }
    return res.json(climatezone);
  });
};

// Creates a new climatezone in the DB.
exports.create = function(req, res) {
  Climatezone.create(req.body, function(err, climatezone) {
    if(err) { return handleError(res, err); }
    return res.json(201, climatezone);
  });
};

// Updates an existing climatezone in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Climatezone.findById(req.params.id, function (err, climatezone) {
    if (err) { return handleError(res, err); }
    if(!climatezone) { return res.send(404); }
    var updated = _.merge(climatezone, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, climatezone);
    });
  });
};

// Deletes a climatezone from the DB.
exports.destroy = function(req, res) {
  Climatezone.findById(req.params.id, function (err, climatezone) {
    if(err) { return handleError(res, err); }
    if(!climatezone) { return res.send(404); }
    climatezone.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

// Lookup a given climate zone code by geocode
exports.lookup = function(req, res) {
  var latitude; var longitude;var dataset;
  if ((req.query.lat) && (req.query.long) ) {
	  latitude = req.query.lat;
	  longitude = req.query.long;
	  dataset = req.params.dataset;
  } else {
	return res.send(400);
  }
  var resolved = Mapper.map(dataset, latitude, longitude);
  if (resolved.datapoint == -12) { return res.json({ bomcode: -12, reason: "No data available"}); }
  if (!resolved) { return res.json({ bomcode: -12, reason: "No such dataset"}); }
  // This could be tidier. At the moment there are only koeppen clidate data documents
  switch (resolved.units) {
    case "bomcode":
      var query = Climatezone.where({ bomcode: resolved.datapoint});
      query.findOne(function (err, climatezone) {
        if (err) return handleError(err);
        if (climatezone) {
          return res.json(climatezone);
        } else {
          return res.json({ bomcode: resolved.datapoint, units: resolved.units});
        }
      });
      break;
    default:
      return res.json({ datapoint: resolved.datapoint, units: resolved.units });
   }
};
