'use strict';

var config = require('./../../config/environment/index');
var Q = require("q");
var request = require("superagent");


function parseAddress(address) {

  var loc = findAddressComponent(
    address.address_components, "locality");
  var state = findAddressComponent(
    address.address_components,
    "administrative_area_level_1");
  var country = findAddressComponent(
    address.address_components, "country");


  return {
    country: country,
    state: state,
    locality: loc,
    formatted_short: (loc.short_name || '') + " " + (state.short_name || '') + " " +( country.short_name || ''),
    formatted_long: (loc.long_name || '') + ", " + (state.long_name || '') + ", " + (country.long_name || '')
  }
}

function findAddressComponent(components, typetosearch) {
  for (var i = 0; i < components.length; i++) {
    var comp = components[i];
    for (var j = 0; j < comp.types.length; j++) {
      var type = comp.types[j];
      if (type == typetosearch) {
        return {short_name: comp.short_name, long_name: comp.long_name};
      }
    }
  }

  return "";
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

var cache = [];

exports.reverseGeoCode = function (coords) {
  var deferred = Q.defer();


  if (cache[coords+""] != null) {
    console.log("resolving coords from cache" ,JSON.stringify(cache[coords+""]));
    deferred
      .resolve(cache[coords+""]);
  } else {
    var url = "https://maps.googleapis.com/maps/api/geocode/json";
    var params = {
      latlng: coords[1] + ","
      + coords[0],
      result_type: "locality",
      key: config.google.api_key
    };

    url = url + "?" + getDataAsPostVariables(params);
    console.log("GEOCODE: ", url);

    var isatwork = 0;

    if (isatwork) {
      deferred
        .resolve({
          locality: {},
          state: {},
          country: {},
          formatted_long: 'Unknown location',
          formatted_short: 'Unknown location'
        });
    } else {

      request
        .get(url)
        .end(function (error, res) {
          //console.log("GEOCODE RETURN", JSON.stringify(res.body));
          if (res && res.ok && res.body.results.length > 0) {

            var address = res.body.results[0];
            // console
            // .log(res.data.results[0]);
            var parsed = parseAddress(address);
            // console.log(parsed);
           // console.log("putting to cache " + coords +"");
            cache[coords+""] = parsed;
            deferred
              .resolve(parsed);
          } else {
            var result = {
              locality: {},
              state: {},
              country: {},
              formatted_long: 'Unknown location',
              formatted_short: 'Unknown location'
            }
            cache[coords] = result;
            deferred
              .resolve(result);
          }
        });
    }
  }

  return deferred.promise;
}
