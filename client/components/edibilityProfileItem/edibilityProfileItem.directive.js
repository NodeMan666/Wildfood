'use strict';

angular.module('wildfoodApp')
  .directive('edibilityProfileItem', function () {
    return {
      templateUrl: 'components/edibilityProfileItem/edibilityProfileItem.html',
      scope: {
        profile: '=edibilityProfileItem'
      },
      restrict: 'EA',
      link: function (scope, element, attrs) {
      //  console.log("hre", scope.profile);
      }
    };
  });
