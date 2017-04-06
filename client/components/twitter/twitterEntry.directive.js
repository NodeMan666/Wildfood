'use strict';
angular.module('wildfoodApp').directive('userTwitterEntry', function () {
  return {
    restrict: 'AE',
    scope: {
      marker: '=userTwitterEntry',
      ngClick: '&'

    },
    templateUrl: 'components/twitter/template_twitterSmall.html',
    link: function ($scope, element, attrs) {


      $scope.onLinkClick = function () {
        console.log("click userTwitterEntry");
        if ($scope.ngClick) {
          $scope.ngClick({
            $item: $scope.item
          });
        }
      };
    }
  };
});
angular.module('wildfoodApp').directive('userTwitterEntryAdmin', function () {
  return {
    restrict: 'AE',
    scope: {
      marker: '=userTwitterEntryAdmin',
      ngClick: '&'

    },
    templateUrl: 'components/twitter/template_twitterAdmin.html',
    link: function ($scope, element, attrs) {


      $scope.onLinkClick = function () {
        console.log("click userTwitterEntry");
        if ($scope.ngClick) {
          $scope.ngClick({
            $item: $scope.item
          });
        }
      };
    }
  };
});

angular.module('wildfoodApp').directive('userTwitterEntryFull', function () {
  return {
    restrict: 'AE',
    scope: {
      item: '=userTwitterEntryFull',
      ngClick: '&'
    },
    templateUrl: 'components/twitter/template_twitterFull.html',
    link: function ($scope, element, attrs) {
      var marker = $scope.marker;

      $scope.onLinkClick = function () {
        console.log("click");
        if ($scope.ngClick) {
          $scope.ngClick({
            $item: $scope.item
          });
        }
      };


    }
  };
});

angular
  .module('wildfoodApp')
  .directive(
  'twitterEntryUserOnly',
  function () {
    return {
      restrict: 'A',
      templateUrl: 'components/twitter/template_twitter_entry_useronly.html',
      scope: {
        user: '=twitterEntryUserOnly',
        ngClick: '&'
      },
      replace: true,
      link: function ($scope, element, attrs) {

        //this could be merge with twitterEntry, as they are both based on the user
        //in theory i should be able to merge all of these, just always pass the date separately

        $scope.onLinkClick = function () {
          console.log("click twitterEntryUserOnly");
          if ($scope.ngClick) {
            $scope.ngClick({
              $item: $scope.item
            });
          }
        };
      }
    };
  });

angular
  .module('wildfoodApp')
  .directive(
  'twitterEntry',
  function () {
    return {
      restrict: 'A',
      templateUrl: 'components/twitter/template_twitter.html',

      scope: {
        user: '=',
        itemDate: '=',
        ngClick: '&'
      },
      replace: true,
      link: function ($scope, element, attrs) {
        var item = $scope.user;
        if (item) {
          $scope.showUser = item.showUser;

          $scope.showAt = item.showAt;

          $scope.showUserNameAsLink = item.showUserNameAsLink
        }


        $scope.onLinkClick = function () {
          console.log("click twitterEntry",$scope.user);
          if ($scope.ngClick) {
            $scope.ngClick({
              $item: $scope.user
            });
          }
        };
      }
    };
  });





