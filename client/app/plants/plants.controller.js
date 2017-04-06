'use strict';
angular
  .module('wildfoodApp')
  .controller(
  'PlantsCtrl',
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

      $scope.isMyFavoritesCollapsed = true;
      $scope.loadingMyFavorites = false;
      $scope.myFavorites = [];

      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.isAdmin = Auth.isAdmin;
      $scope.getCurrentUser = Auth.getCurrentUser;

      refreshLocalPlantList();

      $scope.localPlantsList = [];

      $scope.$on('event:climatZoneChanged', function (e, args) {
        console.log('Moved on map');
        refreshLocalPlantList();
      });

      function refreshLocalPlantList() {
        PlantService.getMostTaggedLocalPlants().then(function (results) {
          $scope.localPlantsList = results;

        });

        refreshLocalPlantCountForPlants($scope.filteredSpecies);
      }

      refreshLocalPlantList();


      // refreshLocalPlantCountForPlants($scope.filteredSpecies);

      function refreshLocalPlantCountForPlants(listOfPlants) {
        console.log("refreshing local tag counts for plants " + (listOfPlants || []).length)
        if (listOfPlants != null) {
          listOfPlants.forEach(function (plant) {
            plant.species.local_tags = 0;
          });

          listOfPlants.forEach(function (plant) {
            $scope.localPlantsList.forEach(function (r) {
              if (r.species._id == plant.species._id) {
                plant.species.local_tags = r.species.local_tags;
              }
            });
          });

        }
      }

      $scope.onFavoriteClick = function (marker) {

        if (Auth.isLoggedIn()) {
          PlantService.changeFavoriteStatus(
            !marker.species.isFavorite(), marker.species);
        } else {
          LoginUIService.showLoginModal();
        }

      };
      $scope.showAll = function () {
        $scope.$parent.showAllPlants();

      };


      $scope.showFavoritePlants = function () {
        $scope.myFavorites = [];
        $scope.loadingMyFavorites = true;
        window.scrollTo(0, 0);

        Plants
          .getMyFavorites()
          .then(
          function (plants) {
            $scope.isMyFavoritesCollapsed = false;
            $scope.loadingMyFavorites = false
            $scope.myFavorites = plants;


          });
      };

      $scope.$on('showMyFavoritePlants', function (event, x) {
        $scope.showFavoritePlants();
      });

      $scope.isAmin = function () {
        return Auth.isAdmin();
      };
      $scope.adminPlant = function (plant) {

        var base = $location.absUrl();

        base = base.substring(0, base.lastIndexOf("/"));

        var url = base + '/plantadmin?plantId=' + plant.species._id;

        $window.open(url, "plantadmin");
      };
      $scope.sortpredicate = 'species.name';
      $scope.sortdirection = "false";


      $scope.showItem = function (item) {
        console.log(item);
        $scope.item = item;
        $scope.showDetails = true;
        $scope.$parent.refreshCurrentSeasonalProfile($scope.item.species);

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

      $scope.$on('showPlantItem', function (event, x) {
        $scope.showItem(x);
        $scope.loading = false;
      });

      $scope.filteredSpecies = [];

      function loadAllPlants() {
        $scope.loading = true;
        PlantService
          .getPlantsPaged(function (setofplants) {
            $scope.filteredSpecies.push.apply($scope.filteredSpecies, setofplants);
            $timeout(function () {
              $scope.loading = false;
            }, 1000);

            refreshLocalPlantCountForPlants(setofplants);
          });
      }

      loadAllPlants();

      $scope.$on('updateFilteredPlantSpecies', function (event, x) {
        $scope.filteredSpecies = x;

      });

    }]);

