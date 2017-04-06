'use strict';
angular.module('wildfoodApp').factory('GoogleMaps',
  [function () {
    var maps = {};

    function getMap(mapId) {
      var map = maps[mapId];
      return map;
    }

    return {
      getMainMap: function () {
        return getMap('map-canvas');
      },
      getAddMap: function () {
        return getMap('add-map-canvas');
      },

      setMap: function (mapId, map) {
        maps[mapId] = map;
      }

    }
  }]);

angular
  .module('wildfoodApp')
  .service(
  'loadGoogleMapAPI',
  [
    '$window',
    '$q',
    'WildfoodState',
    function ($window, $q, WildfoodState) {

      var deferred = $q.defer();

      function loadScript() {

        if ($window.google && $window.google.maps) {
          deferred.resolve();
        } else {
          var script = document
            .createElement('script');

          var key = WildfoodState.getGoogleApiKey();

          script.src = '//maps.googleapis.com/maps/api/js?key=' + key + '&sensor=false&callback=initMap';
          document.body.appendChild(script);
        }
      }

      $window.initMap = function () {
        var infobox = document.createElement('script');
        infobox.src = 'bower_components/infobox/infobox.js';
        document.body.appendChild(infobox);
        deferred.resolve();
      }

      loadScript();

      return deferred.promise;
    }]);

angular.module('wildfoodApp').directive(
  'myGoogleMap',
  [
    '$rootScope',
    'loadGoogleMapAPI',
    'CurrentLocationService',
    'GoogleMaps',
    function ($rootScope, loadGoogleMapAPI, CurrentLocationService,
              GoogleMaps) {

      return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {

          $scope.initialize = function () {

            var mapOptions = CurrentLocationService
              .getMapState();

            console.log(mapOptions);

            var id = attrs['id'];

            var map = new google.maps.Map(document
              .getElementById(id), mapOptions);

            GoogleMaps.setMap(id, map);

            if (id == 'add-map-canvas') {
              $rootScope.$broadcast('addmapReady');
            }

            if (id == 'map-canvas') {
              $rootScope.$broadcast('mapReady');
            }

          }

          loadGoogleMapAPI.then(function () {
            $scope.initialize();
          }, function () {
            // Promise rejected
          });
        }
      };
    }]);
