'use strict';
angular
  .module('wildfoodApp')
  .controller(
  'BrowseCtrl',
  [
    '$scope',
    'ImageViewer',
    '$filter',
    'filterFilter',
    '$q',
    '$timeout',
    'MarkersService',
    'PlantService', '$location', '$window', 'UserService', 'LoginUIService', 'MarkersSearchService', 'Auth',
    function ($scope, ImageViewer, $filter, filterFilter, $q, $timeout, MarkersService, PlantService, $location, $window,
              UserService, LoginUIService, MarkersSearchService, Auth) {

      $scope.loading = true;
      $scope.showDetails = false;

      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.isAdmin = Auth.isAdmin;
      $scope.getCurrentUser = Auth.getCurrentUser;
      //$scope.showMarkersByUser = function ($item) {
      //
      //    $scope.$parent.showMarkersByUser($item);
      //
      //
      //};

      $scope.markers = [];
      $scope.loading = true;
      $scope.nomore = false;
      var page = 1;
      $scope.$on('event:climatZoneChanged', function (e, args) {
        console.log('Moved on map,');
        page = 1;
        $scope.markers = [];
        refreshMarkerList();
      });

      function refreshMarkerList() {
        console.log('Browse: refreshMarkerList');
        $scope.loading = true;

        MarkersSearchService
          .getMostRecentLocalmarkers(page).then(function (setofmarkers) {

            if (setofmarkers.length == 0) {
              $scope.nomore = true;
            } else {
              setofmarkers.forEach(function (m) {
                var found = _.find($scope.markers, {'_id': m._id});
                if(!found){
                  $scope.markers.push(m);
                }
              })

            }
            $scope.loading = false;
          });
      }

      refreshMarkerList();

      $scope.showMoreMarkers = function () {
        page++;
        refreshMarkerList();
      }

      $scope.showItem = function (item) {
        console.log(item);
        $scope.item = item;
        $scope.showDetails = true;
        //$scope.$parent.refreshCurrentSeasonalProfile($scope.item.species);

      };

      $scope.showLargerImage = function (item, image) {

        var otherImages = $q.defer();
        MarkersSearchService.getAllMarkersForSpecies(
          item.species._id).then(
          function (othermarkers) {
            var result = [];
            othermarkers
              .forEach(function (other) {
                result.push(other
                  .getImage());
              });
            otherImages.resolve(result);
          });

        ImageViewer
          .openViewer(
          image,
          otherImages,
          null,
          function (selectedMarker) {
            if (selectedMarker) {
              $scope.$parent
                .showOneMarker(selectedMarker.itemId);
            }
          });
      };

      $scope.showAllSpeciesLocations = function (speciesItem) {

        $scope.$parent
          .showSpeciesItems(speciesItem.species._id);
      };


    }]);

