'use strict';

angular.module('wildfoodApp')
    .directive('seasonalProfileViewer', ['RemoteService', '$filter', 'REF_DATA', function (RemoteService, $filter, REF_DATA) {
        return {
            templateUrl: 'components/seasonalProfileViewer/seasonalProfileEditor.html',
            restrict: 'EA',
            scope: {
                profile: '=seasonalProfileViewer'
            },
            link: function (scope, element, attrs) {
                var partList = REF_DATA.plantPartList;
                var allmonths = REF_DATA.monthCodes;
                scope.allparts = [];
                scope.allzones = [];

                function initMonths(partitem) {

                    var pos = 0;
                    _.forOwn(allmonths, function (n, key) {

                        partitem.seasonalData.push({
                            month: key,
                            label: allmonths[key],
                            mature: false
                        });


                        pos++;
                    });
                }


                function refreshParts() {
                    console.log("refreshParts")
                    angular.forEach(scope.profile.items, function (zone) {
                        angular.forEach(scope.allparts, function (partitem) {

                            var idfn = function (n) {
                                return n.part.name == partitem.part.name;
                            };

                            if (partitem.selected) {
                                if (_.findIndex(zone.parts, idfn) < 0) {
                                    var c = angular.copy(partitem);
                                    initMonths(c);
                                    zone.parts.push(c);
                                }
                            } else {
                                _.remove(zone.parts, idfn);
                            }
                        });
                    });
                }

                function findZoneIndex(array, item) {
                    return _.findIndex(array, function (n) {
                        return item && item.climate && n.climate && n.climate.bomcode == item.climate.bomcode;
                    })
                }

                function refreshZones() {
                    console.log("refreshZones")
                    angular.forEach(scope.allzones, function (item) {
                        var idfn = function (n) {
                            return n.climate && item.climate && n.climate.bomcode == item.climate.bomcode;
                        };

                        if (item.selected) {
                            if (findZoneIndex(scope.profile.items, item) < 0) {
                                scope.profile.items.push(item);
                            }
                        } else {
                            _.remove(scope.profile.items, idfn);
                        }
                    });
                    refreshParts();
                }


                function initParts() {
                    angular.forEach(partList, function (item, pos) {
                        scope.allparts.push({
                            part: {
                                name: item
                            },
                            seasonalData: [],
                            selected: false
                        });
                    });
                }


                function initZonesFromRemote(items) {
                    angular.forEach(items, function (item, pos) {
                        scope.allzones.push({
                            climate: item,
                            selected: false,
                            parts: [],
                            availability: 'NotExisting'
                        });

                    });

                    if (scope.profile.items.length == 0) {
                        initDefaultZones();
                    } else {
                        mergeDataWithExisting();
                    }
                }

                function initDefaultZones() {
                    var defaultZones = ["9", "6", "7"];
                    angular.forEach(scope.allzones, function (zone, pos) {
                        angular.forEach(defaultZones, function (defz, pos) {
                            if (defz == zone.climate.bomcode) {
                                zone.selected = true;
                                //scope.profile.items.push(climateitem);
                            }
                        });
                    });
                }

                function mergeDataWithExisting() {
                    if (scope.profile.items && scope.profile.items.length > 0) {
                        angular.forEach(scope.allzones, function (item, pos) {
                            processZoneFromExisting(item)

                        });
                    }
                }

                function selectThisPartFromAllParts(part) {
                    var i = _.findIndex(scope.allparts, function (n) {
                        return n.part.name == part.part.name;
                    });
                    scope.allparts[i].selected = true;
                }

                function processZoneFromExisting(zoneToProcess) {

                    var index = findZoneIndex(scope.profile.items, zoneToProcess);
                    if (index >= 0) {
                        var myZone = scope.profile.items[index];
                        myZone.selected = true;
                        zoneToProcess.selected = true;

                        angular.forEach(myZone.parts, function (part, pos) {
                            part.selected = true;
                            angular.forEach(part.seasonalData, function (month, pos) {
                                month.label = allmonths[month.month];
                            });
                            selectThisPartFromAllParts(part);
                        });
                    }
                }


                function initWatchers() {
                    angular.forEach(scope.allparts, function (item, pos) {
                        var expr = 'allparts[' + pos + '].selected';
                        scope.$watch(expr, function (newValue, oldValue) {
                            if (newValue != oldValue || newValue) {
                                refreshParts();
                            }
                        });
                    });
                    angular.forEach(scope.allzones, function (item, pos) {
                        var expr = 'allzones[' + pos + '].selected';
                        scope.$watch(expr, function (newValue, oldValue) {
                            //console.log("refresh ")
                            if (newValue != oldValue || newValue) {
                                refreshZones();
                            }
                        });
                    });
                }

                function initZones() {
                    RemoteService
                        .get('climate/').then(
                        function (items) {

                            items = $filter('orderBy')(items, 'bomcode', true)

                            initZonesFromRemote(items);

                            refreshZones();
                            initWatchers();
                        });
                }

                function initCurrentLocation() {


                    function initLocation(position) {

                        if (position && position.coords && position.coords.latitude) {
                            var lat = position.coords.latitude;
                            var long = position.coords.longitude;

                            scope.profile.dataProvidedInLocation = {
                                position: [long, lat]
                            }

                            RemoteService.get('common/reversegeocode', {long: long, lat: lat}).then(
                                function (address) {
                                    scope.profile.address = address;
                                });
                        }
                    }

                    if (navigator.geolocation) {
                        navigator.geolocation
                            .getCurrentPosition(initLocation);
                    }


                }

                initParts();
                initZones();
                initCurrentLocation();

            }
        };
    }]);
