'use strict';
angular.module('wildfoodApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.message = 'Hello';
  });



angular.module('wildfoodApp').service('About', [ '$modal', function($modal) {

  this.show = function show() {
    var modalInstance = $modal.open({
      templateUrl : 'app/about/about.html',
      controller : ViewItemModalInstanceCtrl,
      resolve : {

      }
    });
    modalInstance.result.then(function() {
    }, function() {
    });
  };

  var ViewItemModalInstanceCtrl = function($scope, $modalInstance) {

    $scope.ok = function() {
      $modalInstance.dismiss('cancel');
    };
  };

} ]);
