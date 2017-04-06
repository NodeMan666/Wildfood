'use strict';
angular
    .module('wildfoodApp.markers')
    .service(
    'PlantService',
    [
        '$filter',
        '$q',
        'RemoteService',
        'Utils',
        'PlantUtils', 'UserService', 'Auth', 'CurrentLocationService',
        function ($filter, $q, RemoteService, Utils, PlantUtils, UserService, Auth,CurrentLocationService) {

            var plantCache = [];
            var plantCacheMap = {};

            function enhancePlant(item) {
                var wrapper = PlantUtils.enhancePlant(item);
                plantCacheMap[item._id] = wrapper;
                return wrapper;
            }

            function enhancePlants(species) {

                var items = [];
                for (var i = 0; i < species.length; i++) {
                    var item = species[i];
                    var wrapper = enhancePlant(item);
                    plantCacheMap[item._id] = wrapper;
                    items[i] = wrapper;
                }
                return items;

            }

            function getPlantsFromRemote(species) {

                var deferred = $q.defer();

                RemoteService
                    .get('plant', {})
                    .then(
                    function (result) {
                        var enchanced = enhancePlants(result.data);
                        plantCache = enchanced;
                        deferred
                            .resolve(plantCache);
                    });

                return deferred.promise;

            }

            function getPlantsIncrementalLoad(onItemLoadedFunction) {

                var currentpage = 1;
                var pagesize = 20;

                getPlantsIncrementalLoadLoop(currentpage, pagesize, onItemLoadedFunction)

            }

            function getPlantsIncrementalLoadLoop(currentpage, pagesize, onItemLoadedFunction) {


                RemoteService
                    .get('plant', {
                        size: pagesize,
                        page: currentpage
                    })
                    .then(
                    function (result) {
                        var rest = [];

                        var plants = result.data;

                        for (var i = 0; i < plants.length; i++) {
                            var item = plants[i];
                            var wrapper = enhancePlant(item);
                            rest.push(wrapper);

                        }
                        if (result.pagination) {
                            currentpage = result.pagination.next_page;
                        } else {
                            currentpage = -1;
                        }

                        onItemLoadedFunction(rest);

                        if (currentpage > 0 && rest.length > 0) {
                            getPlantsIncrementalLoadLoop(currentpage, pagesize, onItemLoadedFunction)
                        }
                    });

            }

            function getPlantsFromCacheOrRemote(species) {
                var deferred = $q.defer();
                if (plantCache.length === 0) {
                    return getPlantsFromRemote();
                } else {
                    deferred.resolve(plantCache);
                }
                return deferred.promise;
            }

            return {
                getPlants: function () {
                    return getPlantsFromCacheOrRemote();
                },

                getPlant: function (plantid) {
                    var deferred = $q.defer();

                    RemoteService
                        .get('plant/' + plantid, {})
                        .then(
                        function (result) {
                            var enchanced = enhancePlant(result);
                            deferred
                                .resolve(enchanced);
                        });

                    return deferred.promise;
                },

                getPlantFull: function (plantid) {
                    var deferred = $q.defer();

                    RemoteService
                        .get('plant/full/' + plantid, {})
                        .then(
                        function (result) {
                            var enchanced = enhancePlant(result);
                            deferred
                                .resolve(enchanced);
                        });

                    return deferred.promise;
                },

                getPlantsPaged: function (onItemLoadedFunction) {
                    getPlantsIncrementalLoad(onItemLoadedFunction);
                },

              getMostTaggedLocalPlants: function () {
                var deferred = $q.defer();

                var params = CurrentLocationService.getCurrentLocationAndRange()

                RemoteService
                  .get('plant', params)
                  .then(
                  function (result) {
                    var enchanced = enhancePlants(result.data);
                    deferred
                      .resolve(enchanced);
                  });

                return deferred.promise;
              },

                searchPlant: function (input) {
                    var deferred = $q.defer();

                    RemoteService
                        .get('plant', {
                            search: input
                        })
                        .then(
                        function (result) {
                            var enchanced = enhancePlants(result.data);
                            deferred
                                .resolve(enchanced);
                        });

                    return deferred.promise;
                },

                getPlantItemForMarker: function (marker) {

                    var deferred = $q.defer();

                    getPlantsFromCacheOrRemote()
                        .then(
                        function (jsondata) {

                            deferred
                                .resolve(plantCacheMap[marker.plant._id].species);

                        });

                    return deferred.promise;
                },
                changeFavoriteStatus: function (newvalue, plant) {

                    var deferred = $q.defer();

                    if (newvalue) {
                        RemoteService.post(
                                'users/me/favoriteplants/' + plant._id, {
                            }).then(function (result) {
                                Auth.refreshUser();
                            });
                    } else {
                        RemoteService.delete(
                                'users/me/favoriteplants/' + plant._id, {
                            }).then(function (result) {
                                Auth.refreshUser();
                            });
                    }


                    return deferred.promise;


                },

              getMyFavorites: function () {
                    var deferred = $q.defer();

                    RemoteService.get('getFavourites2.php', {}).then(
                        function (result) {

                            var enchanced = enhancePlants(result.plants);


                            enchanced.forEach(function (item) {
                                item.favourited = true;
                            })

                            deferred.resolve(enchanced);
                        });


                    return deferred.promise;


                }

            }

        }]);
