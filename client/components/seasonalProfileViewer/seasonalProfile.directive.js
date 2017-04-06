'use strict';

angular.module('wildfoodApp')
  .directive('seasonalCalendar', ['REF_DATA', function (REF_DATA) {
    return {
      template: '<span ng-repeat="month in months">' +
      '<button type="button" btn-checkbox class="btn btn-primary seasonViewerButton" ng-disabled="true" ng-model="month.mature">' +
      '{{getMonthLabel(month.month)}}' +
      '</button>' +
      '</span>',
      restrict: 'EA',
      scope: {
        months: '=seasonalCalendar'
      },
      link: function (scope, element, attrs) {
        var allmonths = REF_DATA.monthCodes;


        scope.getMonthLabel = function (id) {
          return allmonths[id];
        };
      }
    };
  }]);

angular.module('wildfoodApp')
  .directive('seasonalProfile', ['RemoteService', 'REF_DATA', function (RemoteService, REF_DATA) {
    return {
      templateUrl: 'components/seasonalProfileViewer/seasonalProfile.html',
      restrict: 'EA',
      scope: {
        profile: '=seasonalProfile'
      },
      link: function (scope, element, attrs) {


        scope.hasZoneContent = function (zone) {
          var yes = false;
          zone.parts.forEach(function (part) {
            if (scope.hasPartContent(part)) {
              yes = true;
            }
          });

          return yes;
        };

        scope.hasPartContent = function (part) {
          var yes = false;

          part.seasonalData.forEach(function (data) {
            if (data.mature) {
              yes = true;
            }
          });

          return yes;
        };

        scope.hasAnything = function () {
          var yes = false;
          if (scope.profile && scope.profile.items) {
            scope.profile.items.forEach(function (part) {
              if (scope.hasZoneContent(part)) {
                yes = true;
              }
            });
          }

          return yes;
        };

      }
    };
  }]);
