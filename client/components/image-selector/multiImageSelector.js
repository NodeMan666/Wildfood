'use strict';
angular
  .module('wildfoodApp.imageSelector')
  .directive(
  'multiImageSelector',
  [
    'ImageUtils', 'RemoteService',
    function (ImageUtils, RemoteService) {
      return {
        restrict: 'AE',
        scope: {
          allFiles: '=multiImageSelector',
          alerts: '=imageSelectorAlerts',
          imageSelectorDeletedFiles: '=imageSelectorDeletedFiles',
          ngDisabled: '=',
          isSingle: '=',
          title: '=imageSelectorTitle'

        },
        templateUrl: 'components/image-selector/multiImageSelector.tpl.html',
        link: function (scope, elem) {

          // scope.$watch('model', function() {
          // scope.allFiles = [];
          // if (scope.model) {
          // scope.allFiles.push(scope.model);
          // } else {
          // }
          // });

          scope.onFileSelectSingle = function (files) {
            var item = ImageUtils
              .onFileSelectSingle(files,
              scope.alerts);

            if (item != null) {

              scope.allFiles.push(item);

              ImageUtils.uploadFile(item);
            }


            updateModel();
          };

          function updateModel() {
            // scope.model = scope.allFiles;
          }

          scope.deleteItem = function (item) {

            if (scope.imageSelectorDeletedFiles) {
              scope.imageSelectorDeletedFiles
                .push(item);
            }
            var index = scope.allFiles
              .indexOf(item);
            scope.allFiles.splice(index, 1);
            updateModel();
          };

        }
      }
    }]);
