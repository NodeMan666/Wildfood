'use strict';

angular.module('wildfoodApp')
  .directive('edibilityProfileViewer', function () {
    return {
      templateUrl: 'components/edibilityProfileViewer/edibilityProfileViewer.html',
      restrict: 'EA',
      scope: {
        profile: '=edibilityProfileViewer',
        localised: '=localised'
      },
      link: function (scope, element, attrs) {
      }
    };
  });
