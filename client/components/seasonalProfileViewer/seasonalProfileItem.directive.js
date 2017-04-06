'use strict';


angular.module('wildfoodApp')
  .directive('seasonalProfileItem', ['RemoteService', function (RemoteService) {
    return {
      templateUrl: 'components/seasonalProfileViewer/seasonalProfileItem.html',
      restrict: 'EA',
      scope: {
        profile: '=seasonalProfileItem'
      },
      link: function (scope, element, attrs) {

        scope.onchange = function (zone) {
          //console.log("onchange");

          zone.parts.forEach(function (part) {
            part.seasonalData.forEach(function (month) {
              if (month.mature == true) {
                if (zone.availability == 'NotExisting') {
                  zone.availability = 'Common';
                }
              }

            });
          });

        }


      }
    };
  }]);
