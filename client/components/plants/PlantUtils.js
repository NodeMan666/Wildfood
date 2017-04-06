'use strict';
angular
  .module('wildfoodApp.utils')
  .service(
  'PlantUtils',
  [
    'UserUtils',
    'wfUtils',
    'Utils', 'Auth',

    function (UserUtils, wfUtils, Utils, Auth) {
      function getImageItemFromPlant(plant, plantimage) {
        plant.images.description = "Plant Data Base: "
        + plant.fullname;
        return plant.images;

      }

      function enhancePlantImages(plant) {

        // if (plant.images != null) {
        // var result = [];
        // plant.images.forEach(function(item) {
        // var imgItem = getImageItemFromPlant(
        // plant, item);
        // result.push(imgItem);
        // })
        // plant.images = result;
        // }

      }

      function createItem(plant) {
        var item = {};
        item.species = plant;
        if(plant.commonNames && plant.commonNames.length >0){
          plant.name = plant.commonNames[0];
        }else{
          plant.name = ''
        }


        item.fullname = item.name + " ( "
        + item.scientificName + " )";
        if (!plant.marker_count) {
          plant.marker_count = 0;
        }

        plant.isImagesAvailable = function () {
          return !(plant.images == null || plant.images.length === 0);
        };

        plant.picturesTab = {
          show: plant.isImagesAvailable(),
          open: plant.isImagesAvailable()
        };
        return item;
      }

      function enhanPlant(item) {
        var wrapper = createItem(item);

        enhancePlantImages(item);

        item.isFavorite = function () {
          if (Auth.isLoggedIn()) {
            if (Auth.getCurrentUser() && Auth.getCurrentUser().favoritePlants) {

              var found = false;
              Auth.getCurrentUser().favoritePlants.items.forEach(function (f) {
                if (item._id == f.refid) {
                  found = true;
                }
              });
              return found;

            }

          }
          return false;
        };
        item.hasDanger = function () {
          return item.danger && item.danger.length > 0;
        };

        item.hasWarning = function () {
          return item.warnings && item.warnings.length > 0;
        };


        item.descriptionTab = {show: true, open: true};
        item.plant_profileTab = setTabs([item.origin, item.habitat, item.characteristics]);

        //item.knownHazardsTab = setTabs(item.known_hazards);
        item.edible_partsTab = setTabsEdibilityObject([item.edibility]);

        item.medicinalTab = setTabsEdibilityObject([
          item.medicinalProfile,
          item.otherUses]);

        item.resourcesTab = setTabs([item.wiki_link,
          item.ala_link]);

        function setTabsEdibilityObject(items) {
          var result = {show: false, open: false};
          if (items != null) {
            items.forEach(function (item) {
                if (item != null) {
                  if (item.parts.length > 0 || !Utils.stringEmpty(item.description))
                    result.show = true;
                  result.open = result.show;
                }
              }
            )
            ;
          }

          return result;
        }

        function setTabs(items) {
          var result = {show: false, open: false};
          if (items) {
            items.forEach(function (item) {
              if (!Utils.stringEmpty(item)) {
                result.show = true;
                result.open = result.show;
              }
            });
          }
          return result;
        }

        return wrapper;
      }

//function getImageItem(Plant) {
//  return {
//    itemId: Plant._id,
//    images: Plant.images,
//    user: Plant.user,
//    created: Plant.created,
//    description: Plant.text
//  };
//}

      return {

        enhancePlant: function (plant) {
          return enhanPlant(plant);

        },
        updateNewPlantFromResult: function (item, result) {


          item = _.merge(item, result);


          if (result.images == null || result.images.length == 0) {
            item.images = [];
          }

          var resultItem = enhanPlant(item);


          return resultItem;

        },
        updateEditedPlantFromResult: function (item, result) {
          return this.updateNewPlantFromResult(item, result);
        }
      }

    }])
;
