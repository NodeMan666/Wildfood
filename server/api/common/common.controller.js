'use strict';

var _ = require('lodash');
var Marker = require('./../marker/marker.model');
var multiparty = require('multiparty');
var Flickr = require('./../../components/flickr/flickrutils');
var Q = require("q");
var auth = require('../../auth/auth.service');
var User = require('./../user/user.model');
var MarkerController = require('./../marker/marker.search.controller');
var UserController = require('./../user/user.controller');
var PlantController = require('./../plant/plant.controller');
var mongoose = require('mongoose');
var Auth = require('../../auth/auth.service');
var GeoSearch = require('./../location/google.places.service.js');
var GeoCoding = require('./../location/geocoding.service.js');

function hasProperty(fields, propname) {
  return fields && fields[propname] && fields[propname].length > 0;
}

function getProperty(fields, propname) {
  if (fields && fields[propname] && fields[propname].length > 0) {
    return fields[propname][0];
  }
  return null;
}


exports.reserseGeoCode = function (req, res) {
    GeoCoding.reverseGeoCode([req.query.long, req.query.lat]).then(function(results){
        return res.json(200,results);
    })
}


exports.searchPlace = function (req, res) {
  GeoSearch.searchLocation(req.query.search).then(function(results){
    return res.json(200,results);
  })
}

exports.getplace = function (req, res) {
  GeoSearch.getPlaceDetails(req.params.id).then(function(results){
    return res.json(200,results);
  })
}

exports.postimage = function (req, res) {

  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    if (hasProperty(files, 'image')) {
      //validate size....

      var image = getProperty(files, 'image');

      var returnimage = {
        path: image.path
      };

     // console.log("uploading ",returnimage);

      Flickr.uploadimage(returnimage).then(function (flickrimage) {
        return res.json(flickrimage);
      }, function (err) {
        return handleError(err, res);
      });

      //return res.json(returnimage);
    }else{
      return handleError(err, res);
    }


  });
};


exports.globalsearch = function (req, res) {

  var searchString = req.query.search;
  var markerpromise;
  if (req.query.lat && req.query.long) {
    markerpromise = MarkerController.searchMarkersWithLocation(req, res);
  } else {
    markerpromise = MarkerController.searchMarkers(req, res);
  }

  var userspromise = UserController.searchUsers(searchString, req, res);

  var plantpromise = PlantController.searchPlants(searchString, req, res);


  Q.all([markerpromise, userspromise, plantpromise]).then(function (results) {

    var returnobject = {
      markers: results[0].data,
      users: results[1].data,
      plants: results[2].data
    };
    // console.log(returnobject);

    return res.json(200, returnobject);
  }, function (err) {
    console.log(err);
    return handleError(err, res);
  });


};
function handleError(err, res) {
  console.log(err);
  return res.send(500, err);
}
