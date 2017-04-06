'use strict';
angular
  .module('wildfoodApp')
  .controller(
  'MapController',
  [
    '$scope',
    '$cookies',
    '$filter',
    '$location',
    'GoogleMaps',
    '$timeout',
    'modalService',
    'UserService',
    'MapUtils',
    'MarkerUtils',
    'CurrentLocationService',
    'MarkersService',
    '$q',
    'PlantService',
    'Utils', 'Displaimer', 'MarkersSearchService',
    function ($scope, $cookies, $filter, $location, GoogleMaps, $timeout, modalService, UserService,
              MapUtils, MarkerUtils, CurrentLocationService, MarkersService, $q, PlantService, Utils, Displaimer, MarkersSearchService) {

      $scope.loading = false;

      $scope.$on('goHome', function (event, x) {
        $scope.goHomeOrToDefaultLocation();
      });


      $scope.$on('discover', function (event, x) {


        $timeout(
          function () {
            if ($scope.map != null) {

              var current = $scope.map.getCenter();

              var currentlat = current.lat();
              var currentlng = current.lng();

              var latlong = new google.maps.LatLng(currentlat + 0.011,
                current.lng() - 0.011);

              if ($scope.map != null) {
                //$scope.map.pan
                $scope.map.panTo(latlong);
                // $scope.map.panBy(10, 10);
                $scope.map.setZoom(CurrentLocationService.getDefaultZoomLevel() + 2);
              }
            }
          }, 1000);
      });

      $scope.goHome = function () {
        if (navigator.geolocation) {
          navigator.geolocation
            .getCurrentPosition(initMapWithCenter);
        }
      };

      $scope.goHomeOrToDefaultLocation = function () {

        if (CurrentLocationService.hasSavedLocation()) {

        } else {
          if (navigator.geolocation) {
            navigator.geolocation
              .getCurrentPosition(initMapWithCenter);
          }
        }

      };


      $scope.goHomeOrToDefaultLocation();

      $scope.$on('mapReady', function (e, args) {
        initMap();
      });

      function initMapWithCenter(position) {
        try {
          var latlong = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude);
          if ($scope.map != null) {
            $scope.map.setCenter(latlong);
            $scope.map.setZoom(CurrentLocationService.getDefaultZoomLevel());
          }
          CurrentLocationService.setMapCenter(latlong);
        } catch (err) {

        }
      }

      function initMap() {
        console.log('initMap');
        $scope.map = GoogleMaps.getMainMap();

        CurrentLocationService.setMap($scope.map);
        $scope.map.markers = [];

        google.maps.event
          .addListener(
          $scope.map,
          'center_changed',
          function () {

            CurrentLocationService
              .setMapCenter($scope.map
                .getCenter());
          });

        google.maps.event.addListener($scope.map,
          'center_changed', _.throttle(function () {
            $scope.$parent.centerChanged();
          }, 2000));


        google.maps.event.addListener($scope.map,
          'dragstart', function () {
          });
        google.maps.event.addListener($scope.map,
          'drag', function () {
          });

        google.maps.event.addListener($scope.map,
          'zoom_changed', function () {
            CurrentLocationService
              .setMapZoomLevel($scope.map
                .getZoom());
          });

        var throttledBoundsChange = _.throttle(actionBoundChange, 1000);
        google.maps.event.addListener($scope.map,
          'dragend', throttledBoundsChange);

        google.maps.event
          .addListener(
          $scope.map,
          'bounds_changed',
          throttledBoundsChange);

        $scope.openMarker = function (marker) {
          openMarker(marker);
        };

        $scope.openMarkerAndPan = function (marker) {
          $scope.map
            .panTo(new google.maps.LatLng(
              marker.location.position.latitude,
              marker.location.position.longitude));


          $scope.showInfoWindow(marker);
          $scope.openMarker(marker);
        };

        $scope.openComments = function ($event, marker) {
          $event.stopPropagation();
          openMarker(marker);

        };
      }

      function populateAllMarkers(alldata) {

        if (alldata) {
          alldata.forEach(function (item) {
            $scope.addMarkerToMap(item);
          });
        }

        $scope.loading = false;
      }

      function actionBoundChange() {
        CurrentLocationService.setMapBounds($scope.map
          .getBounds());

        var bounds = $scope.map.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();

        console.log("bounds_changed [" + sw.lat() + ","
        + sw.lng() + "]" + ",[" + ne.lat()
        + "," + ne.lng() + "] " + $scope.map.getZoom());

        if (sw.lat() && sw.lng() && ne.lat() && ne.lng()) {
          MarkersSearchService.getPagedMarkersByLocation(populateAllMarkers);
        }
      }


      $scope.addMarkerToMap = function (marker) {
        if (marker.mapmarker == null) {
          MarkerUtils.setupMapMarker(marker,
            $scope.map, $scope);
        } else {
          MarkerUtils.updateMapMarker(marker,
            $scope.map, $scope);
        }

        marker.mapmarker.map = $scope.map;

        google.maps.event.addListener(marker.mapmarker,
          'click', function () {
            $scope.showInfoWindow(marker);
          });

      }

      function openMarker(marker) {
        Displaimer.showIfNecessary();
        $scope.item = marker;
        $scope.$parent.refreshCurrentSeasonalProfile($scope.item.species);

        if (marker.isMatched()) {
          PlantService.getPlantItemForMarker(marker).then(
            function (plant) {
              console.log("plant returned ");
              $scope.item.species = plant;
            })
        }

      }

      $scope.showInfoWindow = function (marker) {
        // console.log(marker);
        if ($scope.marker) {
          $scope.marker.closeMarker();
        }
        $scope.marker = marker;


        Utils.applyToScope($scope);
        marker.openInfoWindow($scope.map, $scope);

      }


      $scope.getMap = function () {
        return $scope.map;
      }


      $scope.$on('deleteMarker', function (event, marker) {
        marker.hideMarker();

        if ($scope.item != null) {
          if ($scope.item._id == marker._id) {
            $scope.item = null;
          }
        }


      });


    }]);
