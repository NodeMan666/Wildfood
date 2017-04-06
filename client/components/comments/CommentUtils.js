'use strict';
angular
  .module('wildfoodApp.utils')
  .service(
  'CommentUtils',
  [
    'UserUtils',
    'wfUtils',
    'Utils',

    function (UserUtils, wfUtils, Utils) {

      function enhanComment(comment) {
        wfUtils.enhanceWithImageMethods(comment);

        //UserUtils.refineUser(comment.owner);
      }

      return {

        refineComment: function (comment) {
          return enhanComment(comment);

        }
        ,
        updateNewCommentFromResult: function (comments) {

          comments.forEach(function (comment) {
            enhanComment(comment);
          })

          return comments;

        }
      }

    }]);
