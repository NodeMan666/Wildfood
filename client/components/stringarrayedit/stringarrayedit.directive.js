'use strict';

angular.module('wildfoodApp').directive('stringArrayEdit', function (Utils) {
  return {
    restrict: 'AE',
    scope: {
      inputItems: '=stringArrayEdit'

    },
    templateUrl: 'components/stringarrayedit/stringarrayedit.html',
    link: function ($scope, element, attrs) {
      $scope.items = [];

      if ($scope.inputItems != null) {
        $scope.inputItems.forEach(function (item) {
          $scope.items.push({text: item});
        });
      }

      $scope.deleteName = function (item) {
        _.pull($scope.items, item);
        updateModel();
      };

      $scope.addNewName = function () {

        $scope.items.push({});
        updateModel();
      };

      $scope.moveUp = function (item) {

        var indexUp = $scope.items.indexOf(item);

        if (indexUp > 0) {
          var indextogoDown = indexUp - 1;
          var itemDown = $scope.items[indextogoDown];

          $scope.items[indextogoDown] = item;
          $scope.items[indexUp] = itemDown;
        }
        updateModel();
      };
      $scope.updateModel = function () {
        updateModel();
      }
      function updateModel() {
        $scope.inputItems = [];
        $scope.items.forEach(function (item) {
          $scope.inputItems.push(item.text);
        });
      }
    }
  };
});
