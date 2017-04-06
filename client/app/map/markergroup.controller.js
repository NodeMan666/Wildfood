'use strict';
angular
    .module('wildfoodApp')
    .controller(
    'MarkerGroupController',
    [
        '$scope',
        '$cookies',
        '$filter',
        '$location',
        'GoogleMaps',
        '$timeout',
        'modalService',
        'UserService',
        'MapUtils',
        'MarkerUtils',
        'CurrentLocationService',
        'MarkersService',
        '$q',

        'Utils', '$anchorScroll', 'Auth', 'MarkersSearchService', 'PlantService',
        function ($scope, $cookies, $filter, $location, GoogleMaps, $timeout, modalService, UserService,
                  MapUtils, MarkerUtils, CurrentLocationService, MarkersService, $q, Utils, $anchorScroll, Auth, MarkersSearchService,PlantService) {


            $scope.selectedUser = {};

//      var batchsize = 8;
//      var lessbatchSize = 20;
//      var minmarkersgrouplength = 5;


            $scope.$on('event:loginStatusChanged', function (e, args) {
//        console.log('loginStatusChanged received');

                if (!Auth.isLoggedIn()) {

                    clearAllMarkerGroups();
                }
            });

            $scope.$on('showMyFavorites', function (event, x) {
                $scope.showFavoriteTargetMarkers();
            });

            $scope.$on('showMyItems', function (event, x) {
                $scope.showMineTargetMarkers();
            });
            $scope.$on('showSpeciesItems', function (event, speciesid) {
                $scope.showSpeciesTargetMarkers(speciesid);
            });

            $scope.$on('showUserItems', function (event, speciesid) {
                $scope.showUserTargetMarkers(speciesid);
            });


            $scope.$on('refreshMyItems', function (event, x) {
                $scope.showMineTargetMarkers();
            });

            $scope.$on('deleteMarker', function (event, marker) {

                for (var property in $scope.markergroups) {
                    if ($scope.markergroups.hasOwnProperty(property)) {

                        Utils.removeFromArrayIfExists($scope.markergroups[property].markers, marker);

                        Utils.removeFromArrayIfExists($scope.markergroups[property].allmarkers, marker);
                    }
                }
            });

            $scope.$on('showOneMarker', function (event, x) {
                $scope.showSingleTargetMarker(x);
            });

            $scope.showSingleTargetMarker = function (selectedMarker) {
                if (selectedMarker != null) {
                    prepareToShowSetOfMarkers();
                    addTargetMarker(selectedMarker)
                        .then(
                        function (addedMarker) {
                            $scope.$parent.openMarkerAndPan(addedMarker);
                        });

                }
            };


            function addGroupOfMarkersToMap(markers, type) {

                markers = $filter('orderBy')(markers, $scope.markergroups[type].sortpredicate, $scope.markergroups[type].sortdirection);

                $scope.markergroups[type].allmarkers = markers;


                panToClosestMarkerIfNoneOnMap(type);


            }

            function panToClosestMarkerIfNoneOnMap(type) {
                var hasLeastOneInMap = false;

                var closestMarker;
                var map = CurrentLocationService.getMainMap();

                if (map != null && map.getBounds() != null) {
                    $scope.markergroups[type].allmarkers.forEach(function (marker) {
                        if (closestMarker == null) {
                            closestMarker = marker;
                        } else {
                            if (MapUtils.isCloser(marker, closestMarker, map)) {
                                closestMarker = marker;
                            }
                        }

                        if (map.getBounds() && marker.mapmarker && marker.mapmarker.getPosition
                            && map.getBounds().contains(marker.mapmarker.getPosition())) {
                            hasLeastOneInMap = true;
                        }
                        MapUtils.setCurrentMapRelationProperties(marker, map);
                    });

                    if (!hasLeastOneInMap && closestMarker != null && closestMarker.location.position.latitude) {
                        map.panTo(new google.maps.LatLng(
                            closestMarker.location.position.latitude,
                            closestMarker.location.position.longitude));
                    }
                }
            }


            function clearAllMarkerGroups() {
                $scope.markergroups =
                {
                    plantmarkers: {
                        panel: 'speciesmarkers_panel',
                        collapsed: true,
                        sortpredicate: 'closenessToCenter',
                        sortdirection: false
                    },
                    user: {panel: 'usermarkers_panel', collapsed: true, sortpredicate: 'created', sortdirection: true},
                    favorites: {panel: 'favorites_panel', collapsed: true, sortpredicate: 'created', sortdirection: true},
                    mymarkers: {panel: 'mymarkers_panel', collapsed: true, sortpredicate: 'created', sortdirection: true}
                };
            }


            clearAllMarkerGroups();

            function showTargetMarkers(type, getmarkersfn) {

                $scope.markergroups[type].collapsed = false;
                $scope.markergroups[type].markers = [];
                $scope.markergroups[type].allmarkers = [];
                $scope.markergroups[type].loading = true;
                prepareToShowSetOfMarkers();


                getmarkersfn()
                    .then(
                    function (markers) {


                        addGroupOfMarkersToMap(markers, type);

                        $scope.markergroups[type].loading = false;
                        goto($scope.markergroups[type].panel);
                    });

            }

            $scope.showUserTargetMarkers = function (user) {


                $scope.selectedUser = {};

                UserService.getUser(user).then(function (fromserver) {
                    $scope.selectedUser = fromserver;
                });


                showTargetMarkers('user', function () {
                    return MarkersSearchService
                        .getMarkersByUser(user);
                });
            };

            $scope.closestMarkerFirstSort = function (marker) {
                var factor = MapUtils.calculateDistanceFactor(
                    marker, $scope.map);
                return factor;
            }

            $scope.showSpeciesTargetMarkers = function (speciesid) {

                $scope.extraInfoTitle = '';
                $scope.extraInfoSubTitle = '';

                PlantService.getPlant(speciesid).then(function (plant) {
                    $scope.extraInfoTitle = plant.species.name;
                    $scope.extraInfoSubTitle = plant.species.scientificName;
                });

                showTargetMarkers('plantmarkers', function () {

                    var deferred = $q.defer();

                    MarkersSearchService
                        .getAllMarkersForSpecies(speciesid).then(function (markers) {
                            if (markers.length > 0) {
                                markers = $filter('orderBy')(markers, function (marker) {
                                    var factor = MapUtils.calculateDistanceFactor(marker, GoogleMaps.getMainMap());
                                    marker.closenessToCenter = factor;
                                    return factor;

                                }, false)

                            }

                            deferred.resolve(markers);

                        });
                    return deferred.promise;

                });


            };

            $scope.showMineTargetMarkers = function () {
                showTargetMarkers('mymarkers', function () {
                    return MarkersSearchService
                        .getMyMarkers();
                });
            };

            $scope.showFavoriteTargetMarkers = function () {
                showTargetMarkers('favorites', function () {
                    return MarkersSearchService
                        .getMyFavorites();
                });
            };

            function goto(where) {
                var old = $location.hash();
                $location.hash(where);
                $anchorScroll();
                //reset to old to keep any additional routing logic from kicking in
                $location.hash(old);
            }

            //$scope.closestMarkerFirstSort = function (marker) {
            //  var factor = MapUtils.calculateDistanceFactor(
            //    marker, $scope.map);
            //  return factor;
            //}


            function prepareToShowSetOfMarkers() {
                if ($scope.item) {
                    $scope.item.closeMarker();
                }
                for (var property in $scope.markergroups) {
                    if ($scope.markergroups.hasOwnProperty(property)) {
                        angular.forEach($scope.markergroups[property].allmarkers,
                            function (marker, pos) {
                                marker.unselect();
                            });
                    }
                }
            }


            function addTargetMarker(selectedMarker) {
                var deferred = $q.defer();
                MarkersService.getMarker(selectedMarker._id)
                    .then(function (marker) {

                        if (!marker) {
                            marker = selectedMarker;
                        }
                        
                        $scope.$parent.addMarkerToMap(marker);
                        marker.select();
                        deferred.resolve(marker);
                    });

                return deferred.promise;
            }

            $scope.addTargetMarkerAndSelect = function (marker) {
                return addTargetMarker(marker);

            }

        }]);
