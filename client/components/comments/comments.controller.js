'use strict';
angular
  .module('wildfoodApp')
  .controller(
  'CommentCtrl',
  [
    '$scope',
    'MarkersService',
    'ImageViewer',
    'LoginUIService',
    '$timeout',
    'CommentService',
    'UserService',
    '$q',
    'Utils',
    'ImageUtils',
    'modalService', 'Auth',
    function ($scope, MarkersService, ImageViewer,
              LoginUIService, $timeout,
              CommentService, UserService, $q, Utils,
              ImageUtils, modalService, Auth) {

      $scope.loading = false;

      $scope.userClicked = function ($item) {
        if ($item) {
          console.log("sidebar clicked ", $item);
          $scope.$parent.showMarkersByUser($item);

        }
      };

      $scope.addComment = function (marker) {

        if (Auth.isLoggedIn()) {

          initComment();
          $scope.addingComment = true;
        } else {
          LoginUIService.showLoginModal();
        }
      };

      $scope.collapseComment = function () {
        $scope.addingComment = false;
      };

      $scope.deleteComment = function (marker, comment) {
        var modalOptions = {
          closeButtonText: 'Cancel',
          actionButtonText: 'Delete',
          headerText: 'Delete?',
          bodyText: 'Are you sure you want to delete this comment?'
        };

        modalService
          .showModal({}, modalOptions)
          .then(
          function (result) {
            if (result != 'cancel') {
              CommentService
                .deleteComment(marker,
                comment)
                .then(
                function (resultComment) {
                  Utils
                    .removeFromArrayIfExists(
                    marker.comments,
                    comment);
                });
            }
          });

      };

      $scope.submitComment = function (marker) {
        Utils.$digestToScope($scope);
        if (Utils
            .stringNotEmpty($scope.addedCommentText)) {
          if($scope.file!=null && !$scope.file.valid){
            $scope.commentError = "Please wait for the image upload to finish";
          }else {
            $scope.loading = true;
            CommentService.addComment(marker, {
              text: $scope.addedCommentText
            }, $scope.file).then(
              function (resultmarker) {
                $scope.loading = false;
                //$scope.item.comments
                //  = resultmarker.comments;

                hideComment();

              });
          }
        } else {
          $scope.commentError = "Please type in your comment";
        }
      };

      $scope.onFileSelectSingle = function (files) {

        $scope.file = ImageUtils.onFileSelectSingle(
          files, $scope.alerts);

      };
      $scope.alerts = [];

      function hideComment() {
        $scope.addingComment = false;
        initComment();
      }

      function initComment() {
        $scope.addedCommentText = "";
        $scope.commentError = null;
        $scope.file = null;
        $scope.loading = false;
      }

      $scope.isCommentEditable = function (comment) {
        if (comment.owner._id == Auth.getCurrentUserId()
          || Auth.isAdmin()) {
          return true;
        } else {
          return false;
        }
      }

      $scope.deleteCommentImage = function () {
        $scope.file = null;
      }

      $scope.showLargerCommentImage = function (comment,
                                                commentimage) {
        var others = null;

        ImageViewer.openViewer(commentimage, others,
          null, null);
      };

    }]);
