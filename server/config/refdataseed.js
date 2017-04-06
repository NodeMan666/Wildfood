/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var ClimateZone = require('../api/climate/climatezone.model');
var ClimateZoneData = require('../api/climate/climatezone.data');

var Q = require("q");

function populateReferenceData() {
  ClimateZone.find(function (err, climatezones) {
    if (climatezones == null || climatezones.length == 0) {
      ClimateZone.create(ClimateZoneData);
    }
  });
}

populateReferenceData();


exports.populateDB = populateReferenceData;

