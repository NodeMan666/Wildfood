'use strict';
angular
  .module('wildfoodApp.services')
  .factory(
  'GeoLocationService',
  [
    '$http', '$q', 'CurrentLocationService', 'RemoteService',
    function ($http, $q, CurrentLocationService, RemoteService) {

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
          locality: loc
        }


      }

      function findAddressComponent(components,
                                    typetosearch) {
        for (var i = 0; i < components.length; i++) {
          var comp = components[i];
          for (var j = 0; j < comp.types.length; j++) {
            var type = comp.types[j];
            if (type == typetosearch) {
              return comp.short_name;
            }
          }
        }

        return "";
      }


      return {


        parseGoogleAddress: function (address) {
          return parseAddress(address);
        },

        getAddressFromCoordinates: function (lat, long) {
          var deferred = $q.defer();

          return RemoteService.get('common/reversegeocode', {lat: lat, long: long});
          //  return deferred.promise;
        },
        searchPlace: function (val) {
          return RemoteService.get('common/places?search=' + val);
        },

        getPlaceDetails: function (val) {
          return RemoteService.get('common/places/' + val);
        },

        searchLocation: function (val, bounds) {
          var boundsStr;
          var key = "AIzaSyAk3bgg8TTk-G0cQTsTed_iYdCLA0F17YM";
          if (bounds != null) {
            boundsStr = bounds.getSouthWest().lat()
            + "," + bounds.getSouthWest().lng()
            + "|" + bounds.getNorthEast().lat()
            + "," + bounds.getNorthEast().lng();
          }
          return $http
            .get(
            'http://maps.googleapis.com/maps/api/geocode/json',
            {
              params: {
                address: val,
                bounds: (boundsStr != null) ? boundsStr : "",
                sensor: false
              }
            })
            .then(
            function (res) {
              // console.log(res);
              var addresses = [];
              angular
                .forEach(
                res.data.results,
                function (item) {


                  addresses
                    .push(item);
                });
              console.log(addresses);
              return addresses;
            });
        }

      };

    }]);
