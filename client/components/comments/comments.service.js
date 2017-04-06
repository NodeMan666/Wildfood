'use strict';
angular
  .module('wildfoodApp')
  .factory(
  'CommentService',
  [
    '$http',
    'MarkersService',
    '$filter',
    '$rootScope',
    'UserService',
    '$upload',
    'RemoteService',
    '$q',
    'MarkerUtils',
    'CommentUtils', 'wfUtils',
    function ($http, MarkersService, $filter,
              $rootScope, UserService, $upload,
              RemoteService, $q, MarkerUtils, CommentUtils, wfUtils) {

      return {
        addComment: function (marker, comment, image) {

          var deferred = $q.defer();

          if (image != null && image.versions) {
            comment.images = [wfUtils.pickImageProperties(image)];
          }

          RemoteService
            .post(
            'marker/' + marker._id + '/comment',
            comment, image)
            .then(
            function (resultmarker) {

              marker.comments
                = CommentUtils.updateNewCommentFromResult(resultmarker.comments);

              deferred
                .resolve(resultmarker);

            });

          return deferred.promise;

        },

        editComment: function (marker, comment, image) {
          return RemoteService.postWithFile(
            'marker/' + comment.marker._id + '/editcomment', {
              text: comment.text
            });

        },

        deleteComment: function (marker, comment, onSuccess) {
          return RemoteService.delete(
            'marker/' + marker._id + '/comment/' + comment._id, {
            });

        }

      };

    }]);
