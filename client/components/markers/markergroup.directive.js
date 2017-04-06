angular.module('wildfoodApp').directive('markerGroup', function (Utils, MarkersService) {
  return {
    restrict: 'AE',
    transclude: true,
    replace: true,
    scope: {
      group: '=markerGroup',
      template: '=',
      addMethod: '&',
      showMethod: '&',
      onFavoriteMethod: '&',
      editMethod: '&',
      deleteMethod: '&'
    },
    templateUrl: 'components/markers/marker_group_template.html',
    link: function ($scope, element, attrs) {
      $scope.pageSize = batchsize;
      $scope.panelid = 123;
      $scope.panelid_notags = 123;
      var batchsize = 8;
      var lessbatchSize = 20;
      var minmarkersgrouplength = 5;

      $scope.$watch('group.allmarkers', function (newValue, oldValue) {
        if (newValue != null) {
          $scope.showMoreMarkers();
        }
      });

      $scope.showSingleTargetMarker = function (marker) {
        $scope.showMethod({
          $item: marker
        })
      };
      $scope.deleteMarker = function (marker) {
        $scope.deleteMethod({
          $item: marker
        })
      };
      $scope.editMarker = function (marker) {
        $scope.editMethod({
          $item: marker
        })
      };
      $scope.onFavoriteClick = function (marker) {
        $scope.onFavoriteMethod({
          $item: marker
        })
      };

      $scope.showLessMarkers = function (type) {

        var start = $scope.group.markers.length - 1;

        var end = Math.max(start - lessbatchSize, minmarkersgrouplength - 1);

        for (var i = start; i > end; i--) {
          $scope.group.markers.splice(i, 1);
        }

        Utils.applyToScope($scope);
      };

      $scope.moreMarkersToShow = function () {
        if ($scope.group != null && $scope.group.markers != null && $scope.group.allmarkers != null) {
          return $scope.group.allmarkers.length > $scope.group.markers.length;
        }
        return false;
      };
      $scope.lessMarkersToShow = function (type) {

        var minlenadd = minmarkersgrouplength / 2;

        if ($scope.group != null && $scope.group.markers != null) {

          return $scope.group.allmarkers.length == $scope.group.markers.length && $scope.group.markers.length > batchsize;
        }
        return false;
      };

      $scope.showMoreMarkers = function () {
        var start = $scope.group.markers.length;

        var end = Math.min(start + batchsize, $scope.group.allmarkers.length);

        for (var i = start; i < end; i++) {
          var marker = $scope.group.allmarkers[i];

          $scope.addMethod({
            $item: marker
          })
            .then(
            function (resultmarker) {
              resultmarker
                .select();
              $scope.group.markers
                .push(resultmarker);
            });

        }


        Utils.applyToScope($scope);
      };


    }
  };
});





