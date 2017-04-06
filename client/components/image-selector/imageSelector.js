'use strict';
angular
  .module('wildfoodApp.imageSelector')
  .directive(
  'imageSelector',
  [
    'ImageUtils', 'RemoteService', '$timeout',
    function (ImageUtils, RemoteService, $timeout) {
      return {
        restrict: 'AE',
        scope: {
          model: '=imageSelector',
          alerts: '=imageSelectorAlerts',
          imageSelectorDeletedFiles: '=imageSelectorDeletedFiles',
          ngDisabled: '=',
          isSingle: '=',
          title: '=imageSelectorTitle'

        },
        templateUrl: 'components/image-selector/imageSelector.tpl.html',
        link: function (scope, elem) {

          scope.allFiles = [];

          if (scope.model != null) {
            //allFiles.push(scope.model);
          }

          scope.$watch('model', function () {
            scope.allFiles = [];
            if (scope.model) {
              scope.allFiles.push(scope.model);
            } else {
            }
          });

          scope.onFileSelectSingle = function (files) {

            scope.allFiles = [];
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
            if (scope.allFiles.length > 0) {
              scope.model = scope.allFiles[0];
            } else {
              scope.model = null;
            }
          }


          scope.deleteItem = function (item) {


            if (scope.imageSelectorDeletedFiles && item._id != null) {
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
