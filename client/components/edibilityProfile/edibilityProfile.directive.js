'use strict';

angular.module('wildfoodApp')
  .directive('edibilityProfile', ['REF_DATA', function (REF_DATA) {
    return {
      templateUrl: 'components/edibilityProfile/edibilityProfile.html',
      scope: {
        profile: '=edibilityProfile'
      },
      restrict: 'EA',
      link: function (scope, element, attrs) {


        var props = REF_DATA.plantPartList;

        var parts = scope.profile.parts;


        props.forEach(function (prop) {


          var exists = false;
          parts.forEach(function (exitingpart) {
            if (exitingpart.part == prop) {
              exists = true;
            }
          });

          if(!exists){
            var  part = {};
            part.part = prop + "";
            parts.push(part);
          }
          //
          //if (parts[prop] != null) {
          //  part = parts[prop];
          //} else {
          //  part = {};
          //  parts[prop] = part;
          //}


        });

      }
    };
  }]);
