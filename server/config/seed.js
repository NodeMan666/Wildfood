/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Plant = require('../api/plant/plant.model');
var ClimateZone = require('../api/climate/climatezone.model');
var ClimateZoneData = require('../api/climate/climatezone.data');
var Marker = require('../api/marker/marker.model');
var User = require('../api/user/user.model');
var Mocks = require('./../test/mocks');
var Utils = require('./../test/test.marker.utils');
var Q = require("q");

function populateDB() {
  var deferred = Q.defer();
  User.find({}).remove(function () {
    User.create(Mocks.user, Mocks.admin, function (err, createduser) {
      console.log('finished populating users ', createduser._id);
      Plant.find({}).remove(function () {
        var plant = Mocks.plants[0];
        plant.updated_by = createduser._id;
        plant.created_by = createduser._id;
        Plant.create(plant, function (err, createdplant) {
          console.log(err);

          console.log('finished populating plants ', createdplant._id);
          var plant2 = Mocks.plants[1];
          plant2.updated_by = createduser._id;
          plant2.created_by = createduser._id;
          Plant.create(plant2, function (err, createdplant) {
              console.log(err);
              console.log('finished populating plants ', createdplant._id);

              Marker.find({}).remove(function () {
                Marker.create(Mocks.getMarker(createdplant._id, createduser._id), function (err, createdplant) {
                    console.log('finished populating markers ' + createdplant._id);
                    deferred.resolve("done seeding");
                  }
                );
              });
            }
          );
        });
      });
    });
  });
  return deferred.promise;
}



function populateReferenceData() {
  ClimateZone.find({}).remove(function () {
    ClimateZone.create(ClimateZoneData);
  });
}

//populateReferenceData();

//populateDB();

exports.populateDB = populateDB;

