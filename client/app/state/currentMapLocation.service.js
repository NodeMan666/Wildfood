'use strict';
angular
  .module('wildfoodApp')
  .factory(
  'CurrentLocationService',
  [
    '$q',
    '$http', '$cookies', 'RemoteService',

    function ($q, $http, $cookies, RemoteService) {
      var myStyles = [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [
            {
              visibility: "off"
            }
          ]
        }
      ];


      var mapOptions = {};
      var map;

      var defaultZoomLevel = 12;

      function getSavedLocation(fromcookies) {
        try {
          //console.log("getDefaultLocation", fromcookies)
          if (fromcookies != null) {
            var obj = JSON.parse(fromcookies);
            //console.log("saved")

            return obj;
          }
        } catch (e) {
          console.log("ex", e)
        }
        return null;

      }

      function hasSavedLocation(cookie) {
        var savedLocation = getSavedLocation(cookie);
        return savedLocation && savedLocation.lat;
      }

      function getDefaultLocation() {
        if (hasSavedLocation($cookies.wildfoodsavedlocation)) {
          return getSavedLocation($cookies.wildfoodsavedlocation);
        } else {

          return {
            lat: -33.901349,
            long: 151.241885
          };
        }
      }

      function getDefaultLocationForAdmin() {
        var deferred = $q.defer();

        if (hasSavedLocation($cookies.wildfoodsavedAdminlocation)) {
          var loc = getSavedLocation($cookies.wildfoodsavedAdminlocation);

          deferred.resolve(loc);
        } else {

          if (navigator.geolocation) {
            navigator.geolocation
              .getCurrentPosition(function (position) {

                deferred.resolve({
                  lat: position.coords.latitude,
                  long: position.coords.longitude
                });


              });
          }
        }
        return deferred.promise;
      }

      function initMapOptions() {
//https://developers.google.com/maps/documentation/javascript/controls
        var savedLatLong = getDefaultLocation();

        if (!mapOptions.center) {
          mapOptions = {
            center: new google.maps.LatLng(
              savedLatLong.lat, savedLatLong.long),
            zoom: defaultZoomLevel,
            zoomControl: true,
            zoomControlOptions: {
              style: google.maps.ZoomControlStyle.SMALL,
              position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            bounds: undefined,
            styles: myStyles
          };
        }

      }

      function calculateCurrentRange() {

        var c = map.getCenter();

        if(map && map.getBounds()){
          var sw = map.getBounds().getSouthWest();
          var ne = map.getBounds().getNorthEast();

          var d = calculateDistanceFromPoints(sw, ne);

          return d * 1000 / 2;
        }else{
          return 0;
        }

      }

      function calculateDistanceFromPoints(latlong1, latlong2) {
        return calculateDistance(latlong1.lat(),
          latlong1.lng(), latlong2.lat(),
          latlong2.lng());
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

      return {
        saveLocation: function () {

          $cookies.wildfoodsavedlocation = JSON.stringify({
            lat: this.getCurrentLocation().lat(),
            long: this.getCurrentLocation().lng()
          })
          console.log("makeDefaultLoc", $cookies.wildfoodsavedlocation)

        },
        saveAdminLocation: function () {

          $cookies.wildfoodsavedAdminlocation = JSON.stringify({
            lat: this.getCurrentLocation().lat(),
            long: this.getCurrentLocation().lng()
          })
          console.log("makeDefaultLoc", $cookies.wildfoodsavedAdminlocation)

        },
        getDefaultLocationForAdmin: function () {
          return getDefaultLocationForAdmin();
        },

        getSavedLocation: function () {
          return getDefaultLocation();
        },


        getMapState: function () {
          initMapOptions();
          return mapOptions;
        },

        getMapCenter: function () {
          initMapOptions();
          return mapOptions.center;
        },

        getMapCenterLat: function () {
          return this.getMapCenter().lat()
        },

        getMapCenterLong: function () {
          return this.getMapCenter().lng()
        },

        setMapCenter: function (latlong) {
          mapOptions.center = latlong;


        },
        hasSavedLocation: function () {
          return hasSavedLocation($cookies.wildfoodsavedlocation);
        },
        setMapZoomLevel: function (param) {
          initMapOptions();
          mapOptions.zoom = param;
        },
        getMapZoomLevel: function () {
          initMapOptions();
          return mapOptions.zoom;
        },
        setMapBounds: function (param) {
          initMapOptions();
          mapOptions.bounds = param;
          // calculateCurrentRange();
        },
        getMapBounds: function () {
          if (map) {
            map.getBounds();
          }
          return null;
        },
        setMap: function (param) {

          map = param;
          // calculateCurrentRange();
        },
        getCurrentLocation: function () {
          initMapOptions();
          return mapOptions.center;
        },

        getCurrentLocationAndRange: function () {

          if(map && map.getBounds()){
            return {
              range: calculateCurrentRange(),
              lat: this.getMapCenter().lat(),
              long: this.getMapCenter().lng(),
              zoom: this.getMapZoomLevel(),
              sw_lat: map.getBounds().getSouthWest().lat(),
              sw_long: map.getBounds().getSouthWest().lng(),
              ne_lat: map.getBounds().getNorthEast().lat(),
              ne_long: map.getBounds().getNorthEast().lng()

            }
          }else{
            return {
              range: 0,
              lat: 0,
              long: 0,
              zoom: 0,
              sw_lat: 0,
              sw_long: 0,
              ne_lat: 0,
              ne_long: 0

            }
          }

        },

        getMainMap: function () {
          return map;
        },

        getCurrentRange: function () {
          return calculateCurrentRange();
        },

        getDefaultZoomLevel: function () {
          return defaultZoomLevel;
        },
        getCurrentLocationAddress: function () {
          return RemoteService.get('common/reversegeocode', {
            long: this.getMapCenterLong(),
            lat: this.getMapCenterLat()
          });
        },
        getCurrentClimateZone: function () {
          var deferred = $q.defer();
          RemoteService.get('climate/data/koeppen', {
            dataset: "koeppen",
            long: this.getMapCenterLong(),
            lat: this.getMapCenterLat()
          }).then(function (zone) {
            if (zone && zone.bomcode && zone.bomcode > 0) {
              deferred.resolve(zone);
            } else {
              deferred.resolve(null);
            }
          });
          return deferred.promise;
        }

      };
    }]);
