'use strict';
angular.module('wildfoodApp').directive(
    'sectionData',
    function () {
        return {
            restrict: 'A',
            template: "<div><p>{{item}}</p>"
            + "<p ng-show='showItem2'>{{item2}}</p></div>",
            replace: true,

            scope: {
                item: '@',
                item2: '@',
                species: '@'
            },
            link: function ($scope, element, attrs) {

                if (!$scope.item && !$scope.item2) {
                    $scope.item = "No data available";
                }
                $scope.showItem2 = $scope.item2 != null
                && $scope.item2 !== "";
            }
        };
    });
