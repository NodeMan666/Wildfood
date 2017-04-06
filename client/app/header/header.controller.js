'use strict';
angular
  .module('wildfoodApp')
  .controller(
  'HeaderCtrl',
  [
    '$scope',
    'MarkersService',
    'PlantService',
    '$modal',
    '$cookies',
    'About',
    '$filter',

    '$location',
    'GoogleMaps',
    'LoginUIService',
    'Navigation',
    '$rootScope',
    '$timeout',
    'UserService',
    'MapUtils',
    '$q', 'GeoLocationService', 'SearchConfig',
    'SearchUtils', 'SignUpService', 'Auth', 'MarkersSearchService', 'CurrentLocationService', 'RemoteService',
    function ($scope, MarkersService, PlantService, $modal, $cookies, About, $filter,
              $location, GoogleMaps, LoginUIService, Navigation, $rootScope, $timeout, UserService, MapUtils,
              $q, GeoLocationService, SearchConfig, SearchUtils, SignUpService, Auth, MarkersSearchService, CurrentLocationService, RemoteService) {
      $scope.plants = [];
      PlantService.getPlants().then(function (plants) {
        $scope.plants = plants;
      });
      $scope.currentClimateZone = "";
      $scope.currentLocationAddress = "";

      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.isAdmin = Auth.isAdmin;
      $scope.getCurrentUser = Auth.getCurrentUser;
      $scope.isCurrentUserLocal = Auth.isCurrentUserLocal;

      $scope.$on('event:climatZoneChanged', function (e, args) {
        //console.log('climatZoneChanged received');
        refreshClimateZone();
      });


      function refreshClimateZone() {
        CurrentLocationService.getCurrentClimateZone().then(
          function (item) {
            $scope.currentClimateZone = item;
          });

        CurrentLocationService.getCurrentLocationAddress().then(
          function (address) {
            if (address && address.formatted_short) {
              $scope.currentLocationAddress = address.formatted_short;
            } else {
              $scope.currentLocationAddress = "";
            }

          });

      }

      $scope.$on('event:loginStatusChanged', function (e, args) {
        //      console.log('loginStatusChanged received');
        //       console.log('refresh user ', $scope.user);
        if ($scope.$root.$$phase != '$apply'
          && $scope.$root.$$phase != '$digest') {
          $scope.$apply();
        }
      });

      $scope.login = function () {
        LoginUIService.showLoginModal();
      };

      $scope.signup = function () {
        LoginUIService.showLoginModal(true);
      };


      $scope.logout = function () {
        Auth.logout();

        $rootScope
          .$broadcast('event:loginStatusChanged');
      };

      var currentSearchItem;

      $scope
        .$watch(
        'mainSearch',
        function (newVal, oldVal) {
          if (newVal && newVal.type) {

            currentSearchItem = newVal;
            if (newVal.type == 'plant') {
              $scope.mainSearch = newVal.searchResult;
            } else {
              $scope.mainSearch = newVal.searchResult;
            }


            searchReady(newVal,
              newVal.item);
          }

        });


      $scope.search = function () {

        if (currentSearchItem != null
          && currentSearchItem.name == $scope.mainSearch) {
          searchReady(currentSearchItem);
        }

      };

      $scope.cancelSearch = function () {
        $scope.mainSearch = "";
        $scope.pushedtypeaheadselection = [];
        $scope.cancelPlantSearch();
      };


      $scope.filteredSpecies = [];


      $scope.cancelPlantSearch = function () {
        $scope.$parent
          .updateFilteredPlantSpecies($scope.plants);
        $scope.filteredSpecies = [];
        $scope.queryPlant = "";
      };

      $scope.$on('showAllPlants', function (e, args) {
        $scope.cancelPlantSearch();
      });


      $scope.showPage = function (path) {

        $scope.queryPlant = "";
        $scope.$parent.showPage(path);
        $scope.mainSearch = "";
      };

      $scope.itemselected = function ($item) {
        $scope.pushedtypeaheadselection = [];
        searchReady($item);
      };

      function goToMapIfNotThere() {
        if (!$scope.$parent.isMyPage('map')) {
          $scope.$parent.showPage('map');
        }
      }

      function showPlantOnPlantPage(newVal) {
        $scope.$parent.showPlantItem(newVal);
      }


      function onPlantSelected(newVal) {
        if ($scope.$parent.isMyPage('map')) {
          $scope.$parent
            .showSpeciesItems(newVal.item._id);
        } else if ($scope.$parent.isMyPage('plants')) {
          showPlantOnPlantPage({species: newVal.item});
        } else {
          $scope.$parent.showPage('map');

          $timeout(function(){
            $scope.$parent
              .showSpeciesItems(newVal.item._id);
          },500)



        }
      }

      function searchReady(newVal, searchString) {
        if (newVal.type == 'findallusers') {
          findAllUsers(searchString);
        } else if (newVal.type == 'findallmarkers') {
          findAllMarkers(searchString);
        } else if (newVal.type == 'findallplants') {
          findAllPlants(searchString);
        } else if (newVal.type == 'findalllocations') {
          findalllocations(searchString);
        } else if (newVal.type == 'closeitems') {
          $scope.pushedtypeaheadselection = [];
        } else if (newVal.type == 'marker') {
          goToMapIfNotThere();
          $scope.$parent.showOneMarker(newVal.item._id);
        } else if (newVal.type == 'plant') {
          onPlantSelected(newVal);
        } else if (newVal.type == 'user') {
          goToMapIfNotThere();
          $scope.$parent
            .showUserItems(newVal.item._id);
        } else if (newVal.type == 'location') {

          onLocationSelected(newVal.item)


        } else {

        }
      }

      function onLocationSelected(item) {

        GeoLocationService.getPlaceDetails(item.place_id).then(function (result) {
          var loc = result.geometry.location;
          GoogleMaps.getMainMap().panTo(new google.maps.LatLng(
            loc.lat,
            loc.lng));
          //increase zoom level if possible
          var currentZoom = GoogleMaps.getMainMap().getZoom();
          if (currentZoom < 14) {
            GoogleMaps.getMainMap().setZoom(currentZoom + 2);
          }
        })

        goToMapIfNotThere();

      }

      function sortMarkers(markerResult) {
        return $filter('orderBy')(markerResult, function (marker) {
          var factor = MapUtils.calculateDistanceFactor(marker, GoogleMaps.getMainMap());
          marker.closenessToCenter = factor;
          return factor;
        })
      }

      function sortUsers(users) {
        return $filter('orderBy')(users, function (user) {
          return user.active_user;
        }, true)
      }

      function processSearchResult(result, addressresult, input) {

        var resultArray = [];

        if (SearchConfig.isEnabled('marker')) {
          result.markers = sortMarkers(result.markers);
        }

        if (SearchConfig.isEnabled('user')) {
          result.users = filterUsers(result.users);
          result.users = sortUsers(result.users);
        }

        var markertop = 5, planttop = 3, usertop = 1, locationtop = 1;

        SearchUtils.wrapFirstNItems(planttop, result.plants, resultArray, SearchUtils.wrapSearchPlant, 'plant');

        SearchUtils.wrapFirstNItems(usertop, result.users, resultArray, SearchUtils.wrapUser, 'user');
        SearchUtils.wrapFirstNItems(markertop, result.markers, resultArray, function (item) {
          if (item.description) {
            return SearchUtils.wrapSearchMarker(item);
          }
          return null;
        }, 'marker');


        SearchUtils.wrapFirstNItems(locationtop, addressresult, resultArray, SearchUtils.wrapLocation, 'location');

        resultArray.push(SearchUtils.getDivider());

        //should refactor this a bit, can make it be based on some objects
        addSearchForAllItemsWhenNecessary(result.plants, planttop, resultArray, SearchUtils.findAllPlantsItem(input), 'plant');
        addSearchForAllItemsWhenNecessary(result.markers, markertop, resultArray, SearchUtils.findAllMarkersItem(input), 'marker');
        addSearchForAllItemsWhenNecessary(result.users, usertop, resultArray, SearchUtils.findAllUsersItem(input), 'user');
        addSearchForAllItemsWhenNecessary(addressresult, locationtop, resultArray, SearchUtils.findAllLocationsItem(input), 'location');
        return resultArray;
      }

      function addSearchForAllItemsWhenNecessary(array, top, resultArray, item, type) {
        if (SearchConfig.isEnabled(type)) {
          resultArray.push(item)
        }
      }

      $scope.searchconfig = SearchConfig.getConfig();

      $scope.$watch('searchconfig.marker', function (newValue, oldValue) {
        SearchConfig.saveConfig($scope.searchconfig);
      });
      $scope.$watch('searchconfig.user', function (newValue, oldValue) {
        SearchConfig.saveConfig($scope.searchconfig);
      });

      $scope.$watch('searchconfig.plant', function (newValue, oldValue) {
        SearchConfig.saveConfig($scope.searchconfig);
      });

      $scope.$watch('searchconfig.location', function (newValue, oldValue) {
        SearchConfig.saveConfig($scope.searchconfig);
      });

      $scope.makeCurrentLocationDefault = function () {
        CurrentLocationService.saveLocation();
      };

      $scope.executeSearch = function (input) {

        $scope.pushedtypeaheadselection = [];

        if (input != null && input.length > 2) {

          var d = $q.defer();
          var address = d.promise;
          if (SearchConfig.isEnabled('location')) {


            address = GeoLocationService
              .searchPlace(input);

          } else {
            d.resolve([]);
          }


          var others;
          if (SearchConfig.isEnabled('plant')
            || SearchConfig.isEnabled('user')
            || SearchConfig.isEnabled('marker')) {
            others = MarkersSearchService
              .globalSearch(input);
          } else {
            var dd = $q.defer();
            others = dd.promise;
            dd.resolve([]);
          }

          var deferred = $q.defer();
          $q.all([others, address]).then(function (results) {
            deferred.resolve(processSearchResult(results[0], results[1], input));
          });

          return deferred.promise;

        }
        else {
          return [];
        }

      }


      function filterUsers(myresult) {
        //myresult = $filter('filter')(myresult, function (user) {
        //
        //  return user.active_user == 1 || user.markers > 1;
        //});
        return myresult;
      }

      function findAllUsers(input) {
        UserService
          .searchUser(input)
          .then(
          function (myresult) {
            $scope.pushedtypeaheadselection = [];
            myresult = filterUsers(myresult);
            myresult = sortUsers(myresult);

            SearchUtils.wrapFirstNItemsForPushedTypeahead(50, myresult, $scope.pushedtypeaheadselection, SearchUtils.wrapUser);

            console.log($scope.pushedtypeaheadselection);
          });
      }

      function findAllPlants(input) {

        $scope.pushedtypeaheadselection = [];

        PlantService.getPlants().then(function (list) {
          var filteredList = $filter('filter')(list, input);

          filteredList = $filter('orderBy')(filteredList, function (plant) {
            var fullname = plant.species.name + " ( "
              + plant.species.scientificName + " )";
            if (fullname.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
              return 0;
            }
            return 1;
          }, false);
          SearchUtils.wrapFirstNItemsForPushedTypeahead(50, filteredList, $scope.pushedtypeaheadselection, SearchUtils.wrapSearchPlant);
        });
      }

      function findAllMarkers(input) {
        MarkersSearchService
          .searchAll(input)
          .then(
          function (myresult) {
            myresult = sortMarkers(myresult)
            $scope.pushedtypeaheadselection = [];
            SearchUtils.wrapFirstNItemsForPushedTypeahead(50, myresult, $scope.pushedtypeaheadselection, SearchUtils.wrapSearchMarker);
          });


      }

      function findalllocations(input) {
        GeoLocationService
          .searchPlace(input).then(function (myresult) {

            //need to check that they are somewhat local
            $scope.pushedtypeaheadselection = [];
            SearchUtils.wrapFirstNItemsForPushedTypeahead(50, myresult, $scope.pushedtypeaheadselection, SearchUtils.wrapLocation);

          });

      }

    }
  ])
;
