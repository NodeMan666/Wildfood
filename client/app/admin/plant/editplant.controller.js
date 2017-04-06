'use strict';
angular
  .module('wildfoodApp')
  .service(
  'EditSpecies',
  [
    '$modal',
    '$timeout',
    'AdminService',
    'PlantService',
    'ImageUtils',
    'PlantUtils',
    'Utils',
    function ($modal, $timeout, AdminService, PlantService, ImageUtils, PlantUtils, Utils) {

      this.edit = function (item, returnFunction) {

        PlantService.getPlantFull(item._id).then(function (plant) {
          var modalInstance = $modal.open({
            templateUrl: 'app/admin/plant/editplant.html',
            controller: EditItemModalInstanceCtrl2,
            backdrop: false,
            resolve: {
              item: function () {
                return plant.species;
                // return item;
              },
              $timeout: function () {
                return $timeout;
              },
              Utils: function () {
                return Utils;
              }
            }
          });
          modalInstance.result.then(function (edititem) {

            if (edititem != null) {
              PlantService.getPlant(edititem._id).then(function (plant) {
                returnFunction(plant.species);
              });
            } else {
              returnFunction(null);
            }

          }, function () {
          });
        })


      };

      this.add = function (returnFunction) {
        var empty = {
          active: true,
          localisedProfile: {
            en_au: {
              edibility: {parts: []},
              medicinalProfile: {parts: []},
              otherUses: {parts: []}
            }
          },
          edibility: {parts: []},
          medicinalProfile: {parts: []},
          otherUses: {parts: []},
          seasonalProfile: {
            items: [],
            dataProvidedInLocation: {}
          }
        };

        var modalInstance = $modal.open({
          templateUrl: 'app/admin/plant/editplant.html',
          controller: EditItemModalInstanceCtrl2,
          windowClass: 'imageVIewerDialog',
          backdrop: false,
          resolve: {
            item: function () {
              return empty;
            },
            $timeout: function () {
              return $timeout;
            }
          }
        });
        modalInstance.result.then(function (edititem) {

          if (edititem != null) {
            returnFunction(edititem);
          } else {
            returnFunction(null);
          }
        }, function () {
        });
      };

      var EditItemModalInstanceCtrl2 = function ($scope, $modalInstance, item, $timeout, Utils) {

        $scope.item = angular.copy(item);
        $scope.loading = false;
        $scope.isEditing = item._id != null;
        $scope.allFiles = [];
        $scope.alerts = [];

        $scope.closeAlert = function (index) {
          $scope.alerts.splice(index, 1);
        };

        if (!$scope.isEditing) {


        } else {
          console.log(item.images);
          if (item.images) {
            item.images
              .forEach(function (itemimg) {

                itemimg.preview = itemimg
                  .versions.thumb.url;

                itemimg.valid = true;
                itemimg.downloadReady = true;
                itemimg.existing = true;

                $scope.allFiles
                  .push(itemimg);
              });
          }

        }

        $scope.deleteNote = function (item, array) {
          _.pull(array, item);
        };

        $scope.addNewNote = function (array) {
          if (array == null) {
            array = [];
          }
          array.push({});
        };

        $scope.moveNoteUp = function (item, array) {

          var indexUp = array.indexOf(item);

          if (indexUp > 0) {
            var indextogoDown = indexUp - 1;
            var itemDown = array[indextogoDown];

            array[indextogoDown] = item;
            array[indexUp] = itemDown;
          }
        };

        $scope.alerts = [];
        $scope.ok = function () {
          if (validForm($scope.item)) {

            angular.copy($scope.item, item);

            if ($scope.isEditing) {
              $scope.loading = true;
              AdminService.editSpecies(item,
                $scope.allFiles).then(
                function (result) {
                  $scope.loading = false;
                  $modalInstance
                    .close(item);
                });

            } else {
              $scope.loading = true;
              AdminService
                .addNewSpecies(item,
                $scope.allFiles)
                .then(
                function (resultItem) {
                  $scope.loading = false;
                  $modalInstance
                    .close(resultItem);
                });
            }
          } else {
            $scope.alerts = []
            $scope.alerts
              .push({
                type: 'danger',
                msg: 'Check out your details, and make sure all images are uploaded. everything with * is mandatory'
              });
          }

        };

        $scope.cancel = function () {
          $modalInstance.close();
        };


        function validForm(item) {
          console.log(item);
          return item.localisedProfile.en_au.commonNames != null && item.localisedProfile.en_au.commonNames.length > 0
            && item.scientificName != null
            && validImages();

        }

        function validImages() {
          if ($scope.allFiles.length > 0) {

            var valid = true;
            $scope.allFiles.forEach(function (item) {
              if (!item.valid) {
                valid = false;
              }
            })
            return valid;
          }
          return false;

        }

      };

    }]);
