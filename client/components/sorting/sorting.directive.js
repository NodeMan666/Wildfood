'use strict';

angular.module('wildfoodApp').directive('sortGroup', function () {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      sortProperty: '=sortGroup',
      sortDirection: '=sortGroupDirection'

    },
    templateUrl: 'components/sorting/template_sortingDiv.html',
    controller: function ($scope, $element, $attrs) {

      this.sort = function (prop, defaultValue) {
        if ($scope.sortProperty == prop) {
          //change direction
          $scope.sortDirection = !$scope.sortDirection;
        } else {
          $scope.sortProperty = prop;

          $scope.sortDirection = defaultValue;
        }
      }
      this.isSelected = function (prop) {
        return $scope.sortProperty == prop;
      }
    },
    link: function ($scope, element, attrs) {

    }
  };
});

angular.module('wildfoodApp').directive('sortItem', function () {
  return {
    restrict: 'AE',
    require: '^sortGroup',
    scope: {
      title: '=sortItem',
      property: '=sortProperty',
      direction: '=sortDefaultDirection',
      ngHide: '='

    },
    templateUrl: 'components/sorting/template_sortingTitle.html',
    link: function ($scope, element, attrs, controller) {

      $scope.title = attrs['sortItem'];
      var property = attrs['sortProperty'];

      var direction = (attrs['sortDefaultDirection'] != null) ? attrs['sortDefaultDirection'] : true;

      $scope.isSelected = function () {
        return controller.isSelected(property);
      }
      $scope.sort = function () {
        controller.sort(property, direction);
      }
    }
  };
});
