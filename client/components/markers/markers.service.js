'use strict';
angular
    .module('wildfoodApp')
    .service(
    'MarkersService',
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
        'wfUtils', 'PlantUtils', 'UserUtils', 'GeoLocationService', 'Auth',
        function (Cache, $q, UserService, CurrentLocationService, $http, $timeout, MarkerUtils, $upload, RemoteService,
                  Utils, wfUtils, PlantUtils, UserUtils, GeoLocationService, Auth) {


            return {

                deleteMarker: function (marker) {
                    var deferred = $q.defer();
                    RemoteService.delete('marker/' + marker._id, {
                    }).then(function (item) {
                        Cache.remove(marker);
                        deferred.resolve(marker);
                    });
                    return deferred.promise;

                },
                deleteMarkerPermanently: function (marker) {
                    var deferred = $q.defer();
                    RemoteService.delete('marker/' + marker._id, {
                    }).then(function (item) {
                        Cache.remove(marker);
                        deferred.resolve(marker);
                    });
                    return deferred.promise;

                },

                getMarker: function (id) {

                    var deferred = $q.defer();

                    RemoteService.get('marker/' + id, {

                    }).then(function (result) {
                        if (result._id) {
                            result = Cache.put(result);
                        }
                        deferred.resolve(result);
                    });


                    return deferred.promise;

                },
                changeFavoriteStatus: function (newvalue, marker) {
                    var deferred = $q.defer();
                  if(newvalue) {
                      RemoteService.post(
                              'marker/'+marker._id+'/likes', {}).then(function (result) {
                              Auth.refreshUser();
                          });
                  }else{
                      RemoteService.delete(
                              'marker/'+marker._id+'/likes', {}).then(function (result) {
                              Auth.refreshUser();
                          });
                  }
                    return deferred.promise;

                }

            }

        }]);
