'use strict';
angular
  .module('wildfoodApp')
  .factory(
  'AdminService',
  [
    '$http',
    '$upload',
    'MarkersService',
    '$filter',
    'RemoteService',
    'PlantUtils',
    '$q',
    'wfUtils',
    'Utils', 'UserService',
    function ($http, $upload, MarkersService, $filter, RemoteService, PlantUtils, $q, wfUtils, Utils, UserService) {

      function preProcessData(plant, images) {
        if (images != null) {

          plant.images = _.map(images, function (img) {
            return wfUtils.pickImageProperties(img);
          });
        } else {
          plant.images = [];
        }
        return plant;
      }

      return {
        addNewSpecies: function (plant, images) {
          console.log(plant);
          var deferred = $q.defer();


          var data2 = preProcessData(plant, images);


          RemoteService
            .post('plant',
            data2)
            .then(
            function (data) {
              console
                .log("returned: "
                + data);
              var resultItem = PlantUtils
                .updateNewPlantFromResult(plant,
                data);


              deferred
                .resolve(resultItem);

            });

          return deferred.promise;
        },

        editSpecies: function (plant, images) {
          console.log(plant);
          var deferred = $q.defer();
          var data2 = preProcessData(plant, images);

          RemoteService
            .put('plant/' + plant._id,
            data2)
            .then(
            function (data) {
              console
                .log("returned: "
                + data);
              var resultItem = PlantUtils
                .updateEditedPlantFromResult(
                plant,
                data);
              deferred
                .resolve(resultItem);

            });

          return deferred.promise;

        },
        deletePlant: function (plant) {
          console.log(plant);

          return RemoteService.delete(
            'plant/' + plant._id);

        }


      };

    }]);
