'use strict';
angular
  .module('wildfoodApp')
  .controller(
  'MainController',
  [
    '$scope',
    'MarkersService',
    'PlantService',
    '$modal',
    '$cookies',
    'Displaimer',
    'About',
    '$filter',
    'ImageViewer',
    '$stateParams',
    '$location',
    'LoginUIService',
    'Navigation',
    '$rootScope',
    '$timeout',
    'UserService',
    'modalService', 'Utils', 'Intro', '$window', 'Auth', 'Feedback', 'CurrentLocationService', '$q',
'GoogleMaps',
    function ($scope, MarkersService, PlantService, $modal, $cookies, Displaimer, About,
              $filter, ImageViewer, $stateParams, $location, LoginUIService, Navigation,
              $rootScope, $timeout, UserService, modalService, Utils, Intro, $window,
              Auth, Feedback, CurrentLocationService, $q,GoogleMaps) {


      Intro.showIfNecessary();

      $scope.showingFooter = false;

      $scope.content = Navigation;
      $scope.showMap = true;

      $scope.showFooter = function (path) {
        $scope.showingFooter = true;
      };

      $scope.closeFooter = function (path) {
        $scope.showingFooter = false;
      };


      $scope.discover = function () {
        $scope.$broadcast('discover');

      };
      $scope.learnAboutPlants = function () {
        $scope.showPage("plants");
      };
      $scope.shareIntro = function () {
        $scope.showPage("add");
      };
      $scope.connect = function () {

      };
      $scope.centerChanged = function () {
        $scope.$broadcast('event:climatZoneChanged');
      };

      $scope.showMarkersByUser = function (user) {

        if (!$scope.isMyPage('map')) {
          $scope.showPage('map');
          $timeout(function(){
            $scope.$broadcast('showUserItems', user);
          },500)
        }else{
          $scope.$broadcast('showUserItems', user);
        }

      };

      $scope.goToLocation = function (marker) {



        if (!$scope.isMyPage('map')) {
          $scope.showPage('map');
          GoogleMaps.getMainMap().panTo(new google.maps.LatLng(
            marker.location.position.latitude,
            marker.location.position.longitude));

          GoogleMaps.getMainMap().setZoom(17);
        }else{
          GoogleMaps.getMainMap().panTo(new google.maps.LatLng(
            marker.location.position.latitude,
            marker.location.position.longitude));

          GoogleMaps.getMainMap().setZoom(17);
        }

      };

      $scope.showOthers = function (marker) {



        if (!$scope.isMyPage('map')) {
          $scope.showPage('map');
          $timeout(function(){
            $rootScope
              .$broadcast("showSpeciesItems",
              marker.plant._id);
          },500)
        }else{
          $rootScope
            .$broadcast("showSpeciesItems",
            marker.plant._id);
        }
      };

      $scope.showAllPlants = function () {
        $scope.$broadcast('showAllPlants');
      };
      $scope.currentSeasonalProfile = null;

      $scope.refreshCurrentSeasonalProfile = function (plant) {
        if (plant && plant.seasonalProfile && plant.seasonalProfile.items && plant.seasonalProfile.items.length > 0) {
          CurrentLocationService.getCurrentClimateZone().then(function (currentzone) {
            if (currentzone) {
              var result;
              plant.seasonalProfile.items.forEach(function (item) {
                if (item.climate.bomcode == currentzone.bomcode) {
                  result = {items: [item]};
                }
              });
              $scope.currentSeasonalProfile = result;

            }
          });
        }
      };


      $scope.editMarker = function (marker) {
        $scope.showMap = false;
        Navigation.showPage("add");

        $timeout(
          function () {
            $scope.$broadcast("showEditMarker",
              marker);
          }, 2000);
      };

      $scope.adminMarker = function (marker) {
        var base = $location.absUrl();

        base = base.substring(0, base.lastIndexOf("/"));

        var url = base + '/markeradmin?markerId=' + marker._id;

        $window.open(url, "markeradmin");
      };

      $scope.deleteMarker = function (marker) {

        var modalOptions = {
          closeButtonText: 'Cancel',
          actionButtonText: 'Delete',
          headerText: 'Delete?',
          bodyText: 'Are you sure you want to delete this tag?'
        };

        modalService
          .showModal({}, modalOptions)
          .then(
          function (result) {
            if (result != 'cancel') {
              MarkersService
                .deleteMarkerPermanently(
                marker)
                .then(
                function () {
                  $scope.$broadcast("deleteMarker",
                    marker);

                });
            }

          });

      }
      $scope.showOneMarker = function (markerId) {
        MarkersService.getMarker(markerId).then(
          function (marker) {
            $scope.showPage('map');
            $scope.$broadcast("showOneMarker",
              marker);
          });

      };
      $scope.showPage = function (path,markerid,userid,plantid) {
        if (path == "map") {
          Navigation.setMap();
          $scope.showMap = true;
        } else if (path == "add") {
          $scope.showMap = false;
          $scope.$broadcast("showAddMap");
          Navigation.showPage(path);
        } else if (path == "plants") {
          $scope.showMap = false;
          Navigation.showPage(path);
        } else if (path == "browse") {
          $scope.showMap = false;
          Navigation.showPage(path);
        } else if (markerid !=null) {
          Navigation.setMap();
          $scope.showMap = true;
          $timeout(function(){
            $scope.showOneMarker(markerid);
          },3000);
        } else if (userid !=null) {
          Navigation.setMap();
          $scope.showMap = true;
          $timeout(function(){
            $scope.showMarkersByUser(userid);
          },3000);
        } else if (plantid !=null) {
          $scope.showMap = false;
          Navigation.showPage('plants');
          $timeout(function(){
            //$scope.showMarkersByUser(userid);
          },3000);
        } else {
          Navigation.setMap();
          $scope.showMap = true;
        }

      };
      $scope.showPage($stateParams.tab,$stateParams.markerid,$stateParams.userid,$stateParams.plantid);

      $scope.onFavoriteClick = function (marker) {

        if (Auth.isLoggedIn()) {
          MarkersService.changeFavoriteStatus(
            !marker.isFavorite(), marker);
        } else {
          LoginUIService.showLoginModal();
        }

      };



      $scope.isMyPage = function (path) {
        return Navigation.isMyPage(path);
      };

        PlantService.getPlants().then(function (species) {
        $scope.species = species.plants;
      });

      $scope.isLoggedIn = Auth.isLoggedIn();


      $scope.showDisclaimer = function () {
        Displaimer.show();
      };


      $scope.showFeedback = function () {
        Feedback.show();
      };

      $scope.showIntro = function () {
        Intro.show();
      };

      $scope.showAbout = function () {
        About.show();
      };

      $scope.showMyFavorites = function () {
        $scope.showPage('map');
        $scope.$broadcast("showMyFavorites");
      };

      $scope.showMyFavoritePlants = function () {
        $scope.showPage('plants');
        $scope.$broadcast("showMyFavoritePlants");
      };

      $scope.showMyItems = function () {
        $scope.showPage('map');
        $scope.$broadcast("showMyItems");
      };

      $scope.showSpeciesItems = function (speciesId) {
        $scope.showPage('map');
        $scope
          .$broadcast("showSpeciesItems",
          speciesId);
      };

      $scope.showUserItems = function (user) {
        $scope.showPage('map');
        $scope
          .$broadcast("showUserItems",
          user);
      };



      $scope.addMarkerFinish = function (markerId) {

        $scope.showPage('map');

        $timeout(function () {
          $scope.$broadcast("refreshMyItems");
        }, 200);

        $timeout(function () {
          MarkersService.getMarker(markerId).then(
            function (marker) {
              $scope.$broadcast("showOneMarker",
                marker);
            });
        }, 2000);

      };

      $scope.addMarker = function () {
        if (Auth.isLoggedIn()) {
          $scope.showPage('add');
        } else {
          LoginUIService.showLoginModal();
        }

      };

      $scope.isAdmin = Auth.isAdmin;


      $scope.goHome = function () {
        $scope.showPage('map');
        $scope.$broadcast("goHome");
      };

      $scope.showPlantItem = function (item) {
        $scope
          .updateFilteredPlantSpecies([item]);

        $scope.$broadcast("showPlantItem", item);
      };

      $scope.updateFilteredPlantSpecies = function (item) {
        $scope.$broadcast("updateFilteredPlantSpecies",
          item);
      };

    }]);
