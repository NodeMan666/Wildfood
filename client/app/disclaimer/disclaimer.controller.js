'use strict';
angular.module('wildfoodApp')
  .controller('DisclaimerCtrl', function ($scope) {
    $scope.message = 'Hello';
  });

angular.module('wildfoodApp').service('Displaimer',
  ['$modal', '$cookies', function ($modal, $cookies) {

    this.showIfNecessary = function showIfNecessary() {
      if (!$cookies.wildFooddisclaimer) {
        this.show();
      }
    };

    this.show = function show() {

      $cookies.wildFooddisclaimer = 'initialised';

      var modalInstance = $modal.open({
        templateUrl: 'app/disclaimer/disclaimer.html',
        backdrop: true,
        keyboard: true,
        controller: ViewItemModalInstanceCtrl,
        resolve: {}
      });
      modalInstance.result.then(function () {
      }, function () {
      });
    };

    var ViewItemModalInstanceCtrl = function ($scope, $modalInstance) {

      $scope.ok = function () {
        $modalInstance.dismiss('cancel');
      };
    };

  }]);
