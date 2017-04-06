'use strict';


angular.module('wildfoodApp').directive('listEdit', function (Utils, $rootScope, $timeout, $templateCache, $q, $http, $compile, $document) {
  return {
    restrict: 'AE',
    scope: {
      template: '=listEdit',
      items: '=ngModel'

    },
    templateUrl: 'components/stringarrayedit/listedit.html',
    link: function ($scope, element, attrs) {


      var mytemplate;

      function add(item) {
        var container = element.find('#container');

        console.log("adding to:",container[0]);

        console.log("item ",item);
        var myscope = $rootScope.$new(true, $rootScope);

        myscope.item = item;
        var result = $compile(mytemplate)(myscope);


       // myscope.$apply();
//       myscope.$digest();

        container.append(result);

        console.log("adding this: ",container[0]);
      }


      $q.when(loadTemplate($scope.template)).then(function (template) {
        template = angular.isString(template) ?
          template :
          template.data && angular.isString(template.data) ?
            template.data :
            '';
        mytemplate = template;
        //console.log("loaded:", template);

        $scope.$watch('items', function (newval, oldval) {
          //console.log("watch",newval);
          if (newval != null) {
            newval.forEach(function (item) {
              if (item != null) {
                add(item);
              }
            });
          }
        });
      });


      $scope.deleteName = function (item) {
        _.pull($scope.items, item);

      };

      $scope.addNewName = function () {
        if ($scope.items == null) {
          $scope.items = [];
        }
        $scope.items.push({});
      };

      $scope.moveUp = function (item) {

        var indexUp = $scope.items.indexOf(item);

        if (indexUp > 0) {
          var indextogoDown = index - 1;
          var itemDown = $scope.items[indextogoDown];

          $scope.items[indextogoDown] = item;
          $scope.items[indexUp] = itemDown;
        }
      };

      function loadTemplate(template) {
        return $templateCache.get(template) || $http.get(template, {cache: true});
      }
    }
  };
});
