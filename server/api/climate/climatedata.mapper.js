/**
 * Created by rhys on 21/02/2015.
 */
'use strict';

// Load my datasets. In future would be worth auto-indexing the directory
var datasets = [];
datasets[0] = require('./geodata.au.bom.koeppen');
datasets[1] = require('./geodata.au.bom.avesolarhours');
datasets[2] = require('./geodata.au.bom.averainfall');

exports.map = function(dataset, latitude, longitude) {
  var i;
  for (i = 0; i < datasets.length; i++) {
    if (datasets[i].type == dataset) {
      if (longitude < datasets[i].westernreach ||
          longitude > datasets[i].easternreach ||
          latitude < datasets[i].southernreach ||
          latitude > datasets[i].northernreach) {
        if (i == datasets.length-1) {return -12 };
      } else {
        // Map it
          var xindex = Math.abs(Math.floor((latitude - datasets[i].northernreach) / datasets[i].latresolution));
          var yindex = Math.abs(Math.floor((longitude - datasets[i].westernreach) / datasets[i].longresolution));
          return {datapoint: datasets[i].data[xindex][yindex], units: datasets[i].units};
      }
    }
  }
  return false;
};

