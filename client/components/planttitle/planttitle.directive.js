'use strict';
angular.module('wildfoodApp').directive('markerPlantTitle', function () {
    return {
        restrict: 'AE',
        scope: {
            marker: '=markerPlantTitle'

        },
        templateUrl: 'components/planttitle/template_plantTitle.html',
        link: function ($scope, element, attrs) {
            var marker = $scope.marker;
        }
    };
});


angular.module('wildfoodApp').directive('markerPlantTitleShort', function () {
    return {
        restrict: 'AE',
        scope: {
            marker: '=markerPlantTitleShort'

        },
        templateUrl: 'components/planttitle/template_plantTitleShort.html',
        link: function ($scope, element, attrs) {
            var marker = $scope.marker;
        }
    };
});
