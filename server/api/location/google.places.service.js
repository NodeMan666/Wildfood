'use strict';

var config = require('./../../config/environment/index');
var Q = require("q");
var request = require("superagent");

exports.searchLocation = function (input) {
  var deferred = Q.defer();

  var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json"
  var params = {
    input: input,
    key: config.google.api_key,
    types: []
  };

  //location — The point around which you wish to retrieve place information. Must be specified as latitude,longitude.
  //  radius — The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area. See Location Biasing below.


  //https://developers.google.com/places/documentation/autocomplete
  url = url + "?" + getDataAsPostVariables(params);
  console.log("searchLocation: ", url);
  request
    .get(url)
    .end(function (error, res) {
      console.log("searchLocation RETURN", JSON.stringify(res.body));
      //console.log("Google Places RETURN", res.body.predictions);
      if (res.ok && res.body.predictions.length > 0) {
        //var fns = [];
        //res.body.predictions.forEach(function (item) {
        //  console.log(item.description);
        //  fns.push(exports.getPlaceDetails(item.place_id));
        //});
        //Q.all(fns).then(function (results) {
        //  deferred.resolve(results);
        //});
        res.body.predictions.forEach(function (item) {
          item.formatted_address = item.description;

        });

        deferred.resolve(res.body.predictions);
      } else {

        deferred
          .resolve([]);
      }
    });


  return deferred.promise;
}

exports.getPlaceDetails = function (id) {
  var deferred = Q.defer();
  var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + id + "&key=" + config.google.api_key;
  console.log("getPlaceDetails: ", url);
  request
    .get(url)
    .end(function (error, res) {
      console.log("getPlaceDetails", JSON.stringify(res.body));
      if (res.ok && res.body.result) {
        deferred
          .resolve({
            formatted_address: res.body.result.formatted_address,
            geometry: res.body.result.geometry
          });
      } else {

        deferred
          .resolve({});
      }
    });
  return deferred.promise;
}


function getDataAsPostVariables(data) {

  var first = true;
  var result = "";

  for (var property in data) {
    if (data.hasOwnProperty(property)) {

      var sub = "";
      if (!first) {
        sub = "&";
      }
      var value = data[property];
      value = encodeURI(value);

      result += sub + property + "=" + value;

      first = false;
    }
  }
  // console.log(result);
  return result;
}
