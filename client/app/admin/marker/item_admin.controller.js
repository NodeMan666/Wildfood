'use strict';

angular.module('wildfoodApp').controller(
  'markerAdminItemController',
  [
    '$scope',
    'MarkersService',
    '$modal',
    '$cookies',
    'About',
    '$filter',
    'ImageViewer',
    '$stateParams',
    '$location',
    'LoginUIService',
    'Navigation',
    '$rootScope',
    '$timeout',
    'AdminMarkerService',
    'MarkerUtils', 'modalService', 'PlantService',
    function ($scope, MarkersService, $modal, $cookies,
              About, $filter, ImageViewer, $stateParams, $location,
              LoginUIService, Navigation, $rootScope, $timeout,
              AdminMarkerService, MarkerUtils, modalService, PlantService) {

      $scope.$watch("item.plantQuery", function (newVal,
                                                 oldValue) {
        checkNewSpecies($scope.item, newVal);
      });

      function checkNewSpecies(marker, newVal) {
        if (newVal && newVal.species && newVal.species._id) {
          marker.plant = newVal.species
          AdminMarkerService.editMarker(marker);
        } else {
          if (newVal === "") {
            // $scope.cancelPlantSearch();
          }
        }

      }

      $scope.clearSpecies = function (marker) {
        marker.plant = null;
        marker.plantQuery = null;
        $scope.checkIfValid(marker);
        AdminMarkerService.editMarker(marker);
      };

      $scope.showBiggerPicture = function (marker) {
        ImageViewer.openViewer(marker.getImage(), null, marker,
          null);
      };


      $scope.permanentdelete = function (marker) {
        var modalOptions = {
          closeButtonText: 'Cancel',
          actionButtonText: 'Delete',
          headerText: 'Delete?',
          bodyText: 'Are you sure you want to permanently delete this tag?'
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
                  $scope.removeFromScreen(marker);

                });
            }

          });
      };


      $scope.process = function (marker) {

        MarkerUtils.setVerified(marker);
        AdminMarkerService.editMarker(marker);
      };

      $scope.unprocess = function (marker) {
        MarkerUtils.unsetVerified(marker);
        AdminMarkerService.editMarker(marker);
      };

      $scope.removeFromScreen = function (marker) {
        marker.removed = true;
      };

      $scope.hide = function (marker) {
        MarkerUtils.hideMarker(marker);
        AdminMarkerService.editMarker(marker);
      };

      $scope.unhide = function (marker) {
        MarkerUtils.unhideMarker(marker);
        AdminMarkerService.editMarker(marker);
      };

      $scope.makeUnknown = function (marker) {
        MarkerUtils.makeUnknown(marker);
        $scope.clearSpecies(marker);
      };

      $scope.makeKnown = function (marker) {
        MarkerUtils.makeKnown(marker);
        AdminMarkerService.editMarker(marker);
      };


      $scope.getSpecies = function (input) {
        return PlantService.searchPlant(input);
      };

    }]);
