'use strict';
angular
  .module('wildfoodApp')
  .controller(
  'SpeciesAdminCtrl',
  [
    '$scope',
    'MarkersService',
    '$modal',
    '$filter',
    'ImageViewer',
    '$stateParams',
    '$location',
    'LoginUIService',
    'Navigation',
    '$rootScope',
    '$timeout',
    'EditSpecies',
    'PlantService',
    'modalService',
    'AdminService',
    '$q',
    'Utils', 'UserService', 'Auth',
    function ($scope, MarkersService, $modal, $filter,
              ImageViewer, $stateParams, $location,
              LoginUIService, Navigation, $rootScope,
              $timeout, EditSpecies, PlantService, modalService,
              AdminService, $q, Utils, UserService, Auth) {

      init();



      function authorise() {
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;

        //if (Auth.isAdmin()) {
        //  $scope.isAuthorised = true;
        //  $scope.user = Auth.getCurrentUser();
        //} else {
        //  $scope.isAuthorised = false;
        //  $scope.user = null;
        //}
        $scope.user = Auth.getCurrentUser();
      }

      $scope.logout = function () {
        Auth.logout();

        $rootScope
          .$broadcast('event:loginStatusChanged');

        authorise();
      };

      $scope.login = function () {
        LoginUIService.showLoginModal();
      };

      $scope.$on('event:loginStatusChanged', function (e,
                                                       args) {
        console.log('loginStatusChanged received');

        $timeout(
          function () {
            authorise();
          }, 5000);
      });

      $scope.edit = function (item) {
        EditSpecies.edit(item.species,
          function (newitem) {
           // $scope.clearItem();
         //   initPlants();
            if(newitem!=null) {
              $scope.allitems.forEach(function (plant) {
                if (plant.species._id == newitem._id) {
                  plant.species = newitem;
                  //_.merge(plant.species, newitem);
                  $scope.currentSeasonalProfile = newitem.seasonalProfile;

                }
              })
              $scope.filteredSpecies.forEach(function (plant) {
                if (plant.species._id == newitem._id) {
                  plant.species = newitem;
                  $scope.currentSeasonalProfile = newitem.seasonalProfile;

                }
              })
            }
          });
      };
      $scope.addPlant = function (item) {
        var newItem = {};
        EditSpecies.add(function (newitem) {
          $scope.clearItem();
          initPlants();
          $scope.showAll();
        });
      };

      function initPlants(plantId){
        $scope.filteredSpecies = [];
        $scope.allitems = [];

        if (plantId != null) {
            PlantService.getPlant(plantId).then(function (result) {
            var selectedPlant = result;
            $scope.showItem(selectedPlant);
            $scope.filteredSpecies = [selectedPlant];
          });
        } else {
        }

          PlantService.getPlantsPaged(function (setofplants) {
          if ($scope.plantId != null) {
          } else {
            $scope.allitems.push.apply($scope.allitems, setofplants);
          }
        });
      }

      function init() {

        //UserService
        //  .initUser()
        //  .then(
        //  function (user) {
        //    $timeout(
        //      function () {
        //        authorise();
        //      }, 5000);
        //  });

        authorise();
        $scope.queryPlant = "";
        $scope.plantId = $stateParams.plantId;

        initPlants($scope.plantId);

      }

      $scope.clearFilter = function () {
        $scope.showAll();
        $scope.queryPlant = "";
      };

      $scope.showAll = function () {
        $scope.plantId = null;
        $scope.filteredSpecies = $scope.allitems;
      };

      $scope.getSpecies = function (input) {
        return PlantService.searchPlant(input);
      };

      $scope.showDetails = false;

      $scope.showItem = function (item) {
        $scope.item = item;
        $scope.showDetails = true;
        $scope.currentSeasonalProfile =item.species.seasonalProfile;
      };

      $scope.clearItem = function () {
        $scope.queryPlant ="";
        $scope.item = null;
        $scope.showDetails = false;
      };
      $scope.deleteItem = function (item) {
        var modalOptions = {
          closeButtonText: 'Cancel',
          actionButtonText: 'Delete',
          headerText: 'Delete?',
          bodyText: 'Are you sure you want to delete this plant?'
        };

        modalService
          .showModal({}, modalOptions)
          .then(
          function (result) {
            if (result != 'cancel') {
              AdminService
                .deletePlant(
                item.species)
                .then(
                function () {
                  Utils
                    .removeFromArrayIfExists(
                    $scope.allitems,
                    item);
                  Utils
                    .removeFromArrayIfExists(
                    $scope.filteredSpecies,
                    item);

                  if ($scope.item == item._id) {
                    $scope.item = null;
                    $scope.showDetails = false;
                  }

                });
            }

          });
      };



      $scope.showLargerImage = function (item, image) {

        var r = [];

        var otherImages = $q.defer();

        otherImages.resolve(r);

        ImageViewer.openViewer(image, otherImages,
          null, null);

      };
      $scope.cancelPlantSearch = function () {
        $scope.filteredSpecies = $scope.allitems;
        $scope.queryPlant = "";
      };
      $scope
        .$watch(
        'queryPlant',
        function (newVal, oldVal) {
          if (newVal
            && newVal.species
           ) {
            $scope.filteredSpecies = [newVal];

            $scope.showItem(newVal);
          } else {
            if (newVal === "") {
              $scope
                .cancelPlantSearch();
            }
          }

        });
      $scope.$on('updateFilteredPlantSpecies', function (event, x) {
        $scope.filteredSpecies = x;
        $scope.loading = false;
      });

    }]);
