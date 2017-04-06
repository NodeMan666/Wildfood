'use strict';
angular
  .module('wildfoodApp')
  .service(
  'SearchUtils',
  ['SearchConfig', '$filter',

    function (SearchConfig, $filter) {


      this.wrapFirstNItems = function (howmany, array, resultarray, wrapfn, type) {

        var start = 0;

        if (SearchConfig.isEnabled(type) && array) {
          var end = Math.min(howmany, array.length - 1);
          for (var i = start; i <= end; i++) {
            var item = array[i];
            var result = wrapfn(item);
            if (result != null) {
              resultarray.push(result);
            }
          }
        }
      }

      this.wrapFirstNItemsForPushedTypeahead = function (howmany, array, resultarray, wrapfn) {

        var start = 0;

        var end = Math.min(howmany, array.length - 1);
        for (var i = start; i <= end; i++) {
          var item = array[i];
          var result = wrapfn(item);
          if (result != null) {
            resultarray.push({
              model: result
            });
          }
        }
        if (array.length == 0) {
          resultarray.push({
            model: getNoItemsFound()
          });
        }

        resultarray.push({
          model: getCloseItem()
        });
      }


      this.wrapSearchMarker = function (item) {

        item.shortVersionForFilter = $filter(
          'shortVersionForFilter')(
          item.description);
        var marker = {
          type: "marker",
          icon: "fa-map-marker",
          name: item.shortVersionForFilter,
          extra: item.description,
          searchResult: item.description,
          item: item,
          description: "",
          closenessToCenter: item.closenessToCenter,
          location: item.location,
          style: 'searchresult_marker',
          image: item.getImageThumbUrl()
        }
        return marker;
      }


      this.wrapSearchPlant = function (plant) {

        var item = plant.species;
        var planttags = "";

        if (item.marker_count > 0) {
          planttags = " (" + item.marker_count
          + " tags)";
        }
        var alt = "";

        if (item.commonNames.length > 1) {
          var s = "";
          for (var i = 1; i < item.commonNames.length; i++) {
            s = s + "," + item.commonNames[i];
          }

          alt = "(Also known as: " + s + ")";
          //alt = "(Also known as: " + $filter('joinBy')(item.commonNames, ', ', 'name') + ")";
        }
        // var filteredList = $filter('filter')(list, input);

        return {
          type: "plant",
          icon: "fa-pagelines",
          name: item.name + " ( " + item.scientificName
          + ") " + planttags,
          extra: item.name + " ( " + item.scientificName
          + ") " + planttags + " " + alt,
          searchResult: item.name + " ( "
          + item.scientificName + ") ",
          item: item,
          closenessToCenter: 'close',
          location: {},
          style: 'searchresult_plant'
        };
      }

      this.wrapUser = function (item) {

        var name = item.name;

        return {
          type: "user",
          icon: "fa-user",
          name: name,
          extra: name,
          searchResult: name,
          item: item,
          closenessToCenter: 'close',
          location: {},
          style: 'searchresult_user',
          image: item.profile_picture
        };
      }

      this.wrapLocation = function (item) {

        var name = item.formatted_address;
        return {
          type: "location",
          icon: "fa-bullseye",
          name: name,
          extra: name,
          searchResult: name,
          item: item,
          closenessToCenter: 'close',
          location: {},
          style: 'searchresult_location'

        };
      }

      this.findAllMarkersItem = function (search) {

        var marker = {
          type: "findallmarkers",
          icon: "fa-map-marker",
          name: "Find tags only with '" + search + "'",
          extra: "Find tags only  with '" + search + "'",
          closenessToCenter: 'close',
          location: {},
          item: search,
          style: 'searchresult_marker_findall'
        }
        return marker;
      }

      this.findAllPlantsItem = function (search) {

        var marker = {
          type: "findallplants",
          icon: "fa-pagelines",
          name: "Find plants only  with '" + search + "'",
          extra: "Find plants only  with '" + search + "'",
          closenessToCenter: 'close',
          location: {},
          item: search,
          style: 'searchresult_plant_findall'
        }
        return marker;
      }

      this.findAllUsersItem = function (search) {

        var marker = {
          type: "findallusers",
          icon: "fa-users",
          name: "Find people only with '" + search + "'",
          extra: "Find people only with '" + search + "'",
          closenessToCenter: 'close',
          location: {},
          item: search,
          style: 'searchresult_user_findall'
        }
        return marker;
      }


      this.findAllLocationsItem = function (search) {

        var marker = {
          type: "findalllocations",
          icon: "fa-bullseye",
          name: "Find locations only with '" + search + "'",
          extra: "Find locations only with '" + search + "'",
          closenessToCenter: 'close',
          location: {},
          item: search,
          style: 'searchresult_location_findall'
        }
        return marker;
      }

     function getNoItemsFound() {

        var marker = {
          type: "closeitems",
          icon: "",
          name: "...nothing found...",
          extra: "...nothing found...",
          closenessToCenter: 'close',
          location: {},
          color: "#333"
        }
        return marker;
      }
      function getCloseItem() {

        var marker = {
          icon: "",
          name: "Close search",
          extra: "Close search",
          closenessToCenter: 'close',
          location: {},
          color: "#333"
        }
        return marker;
      }

      this.getTooManyMarkersItem = function () {

        var marker = {
          type: "nonselectable",
          icon: "",
          name: "...too many markers, please refine your search...",
          extra: "...too many markers, please refine your search...",
          closenessToCenter: 'close',
          location: {},
          color: "#333"
        }
        return marker;
      }


      this.getDivider = function () {

        var marker = {
          type: "nonselectable",
          icon: "",
          name: "  ",
          extra: "  ",
          closenessToCenter: 'close',
          location: {},
          style: 'typeaheaddivider'
        }
        return marker;
      }


    }
  ])
;
