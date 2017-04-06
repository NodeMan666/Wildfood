'use strict';
angular.module('wildfoodApp')
  .controller('SplashCtrl', function ($scope) {

  });

angular.module('wildfoodApp').service('Intro',
  [ '$modal', '$cookies', function($modal, $cookies) {

    this.showIfNecessary = function showIfNecessary() {
      if (!$cookies.wildfoodintro) {
        this.show();
      }
    };


    this.show = function show() {

      $cookies.wildfoodintro = 'initialised';

      var modalInstance = $modal.open({
        templateUrl: 'app/intro/intro.html',
        backdrop: true,
        keyboard: true,
        controller: ViewItemModalInstanceCtrl,
        windowClass : 'intromodal',
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

  } ]);
