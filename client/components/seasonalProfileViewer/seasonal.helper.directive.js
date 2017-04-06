'use strict';
angular.module('wildfoodApp')
    .directive('climateZoneTitleShort', ['RemoteService', function (RemoteService) {
        return {
            template: '<span class="zoneTitle">{{zone.climate.bomcode}}<span ng-show="zone.climate.samplePlaces && zone.climate.samplePlaces.length>0">{{zone.climate.samplePlaces[0].town | truncate: 3: "" | uppercase}}</span></span>',
            restrict: 'EA',
            scope: {
                zone: '=climateZoneTitleShort'
            },
            link: function (scope, element, attrs) {
            }
        };
    }]);
angular.module('wildfoodApp')
    .directive('climateZoneTitle', ['RemoteService', function (RemoteService) {
        return {
            template: '<span class="zoneTitle"><b>BOM {{zone.climate.bomcode}} {{zone.climate.category}} - {{zone.climate.description}}</b> <span ng-show="zone.climate.samplePlaces && zone.climate.samplePlaces.length>0">{{zone.climate.samplePlaces[0].town}}</span></span>',
            restrict: 'EA',
            scope: {
                zone: '=climateZoneTitle'
            },
            link: function (scope, element, attrs) {
            }
        };
    }]);

