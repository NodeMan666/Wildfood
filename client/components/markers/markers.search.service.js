'use strict';
angular
  .module('wildfoodApp')
  .service(
  'MarkersSearchService',
  [

    'Cache',
    '$q',
    'UserService',
    'CurrentLocationService',
    '$http',
    '$timeout',
    'MarkerUtils',
    '$upload',
    'RemoteService',
    'Utils',
    'wfUtils', 'PlantUtils', 'UserUtils', 'GeoLocationService',
    function (Cache, $q, UserService, CurrentLocationService, $http, $timeout, MarkerUtils, $upload, RemoteService, Utils, wfUtils, PlantUtils, UserUtils, GeoLocationService) {

      function getMarkersToPageFromServer(url, data) {

        var deferred = $q.defer();
        //console.log(url);

        RemoteService.get(url, data).then(
          function (result) {

            var items = result.data;

            items = Cache.putAll(items);

            deferred.resolve(result);
          });

        return deferred.promise;
      }

      function getMarkersFromServer(url, data) {

        var deferred = $q.defer();
        console.log(url);

        RemoteService.get(url, data).then(
          function (result) {

            var items = result.data;

            items = Cache.putAll(items);

            deferred.resolve(items);
          });

        return deferred.promise;
      }

      var pagedMarkersServiceState = {};


      function getPagedMarkers(returnfn) {

        var currentpage = 1;
        var pagesize = 30;

        var myvariables = {
          location: CurrentLocationService.getCurrentLocationAndRange()
        }

        if (pagedMarkersServiceState.stillRunning) {

          if (!_.isEqual(pagedMarkersServiceState.location, myvariables.location)) {
            //stop the previous process and start new one

            pagedMarkersServiceState.stop = true;
            pagedMarkersServiceState = myvariables;
            getPagedMarkersLoop(pagedMarkersServiceState, currentpage, pagesize, returnfn)
          } else {
            //do nothing, let the other process finish
          }

        } else {
          pagedMarkersServiceState.location = CurrentLocationService.getCurrentLocationAndRange();
          getPagedMarkersLoop(pagedMarkersServiceState, currentpage, pagesize, returnfn)
        }
      }


      function getPagedMarkersLoop(pagedMarkersServiceState, currentpage, pagesize, returnfn) {

        pagedMarkersServiceState.stillRunning = true;

        var params = pagedMarkersServiceState.location;

        params.page = currentpage;
        params.size = pagesize;

        RemoteService.get(
          'marker', params).then(function (result) {

            var items = Cache.putAll(result.data);

            if (result.pagination) {
              currentpage = result.pagination.next_page;
            } else {
              currentpage = -1;
            }

            returnfn(items);

            if (currentpage > 0 && !pagedMarkersServiceState.stop && items.length > 0) {
              getPagedMarkersLoop(pagedMarkersServiceState, currentpage, pagesize, returnfn)
            } else {
              pagedMarkersServiceState.stillRunning = false;
            }
          }
        );

      }

      return {

        getFilteredMarkers: function (params) {

          return getMarkersToPageFromServer(
            'marker', params);
        },

        getPagedMarkersByLocation: function (returnfn) {

          getPagedMarkers(returnfn)

        },

        getMostRecentLocalmarkers: function (page) {

          var param = CurrentLocationService.getCurrentLocationAndRange();

          param.sortBy = 'recent';

          param.page = page || 1;
          param.size = 15;
          param.range = 30000;
          return getMarkersFromServer(
            'marker', param);

        },

        getAllMarkersForSpecies: function (speciesid) {
          return getMarkersFromServer(
            'marker', {
              plant: speciesid
            });
        },

        getMyMarkers: function () {
          return getMarkersFromServer(
            'marker/mymarkers', {});

        },

        getMarkersByUser: function (userid) {
          return getMarkersFromServer(
            'marker', {
              owner: userid
            });

        },
        search: function (input) {

          var params = CurrentLocationService.getCurrentLocationAndRange()
          params.search = input;

          return getMarkersFromServer(
            'marker', params);

        },
        searchAll: function (input) {

          return getMarkersFromServer(
            'marker', {
              search: input
            });

        },
        globalSearch: function (input) {

          var params = CurrentLocationService.getCurrentLocationAndRange()
          params.search = input;

          var deferred = $q.defer();

          RemoteService.get('common/fullsearch', params).then(
            function (result) {

              var items = result.markers;

              items = Cache.putAll(items);

              result.markers = items;

              var plants = [];
              result.plants.forEach(function (plant) {
                plants.push(PlantUtils.enhancePlant(plant));
              });

              result.plants = plants;


              var users = [];
              result.users.forEach(function (user) {
                UserUtils.refineUser(user);
                users.push(user);
              });

              result.users = users;


              deferred.resolve(result);
            });

          return deferred.promise;

        },
        getMyFavorites: function () {

          return getMarkersFromServer(
            'marker/myfavorites', {});
        }


      }

    }]);
