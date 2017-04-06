'use strict';
angular.module('wildfoodApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isCurrentUserLocal = Auth.isCurrentUserLocal;

    $scope.user = _.cloneDeep(Auth.getCurrentUser());

    if (Auth.getCurrentUser().profile_picture) {
      $scope.file = {
        preview: Auth.getCurrentUser().profile_picture
      };
      $scope.file.valid = true;
      $scope.file.downloadReady = true;
      $scope.file.existing = true;
    }

    function validImage() {
      if ($scope.file) {
        return $scope.file.valid;
      }
      return true;
    }

    $scope.updateDetails = function (form) {
      $scope.submitted = true;
      form.password.$setValidity('mongoose', true);

      if (form.$valid && validImage()) {
        Auth.updateDetails($scope.user, $scope.file)
          .then(function () {
            $scope.message = 'User details succesfully changed.';

            Auth.refreshUser();
          })
          .catch(function () {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'error';
            $scope.message = '';
          });
      }
    };
    $scope.pwalerts = [];
    $scope.changePassword = function (form) {
      $scope.submittedchangepw = true;
      form.password.$setValidity('mongoose', true);
      $scope.errors.other = "";
      $scope.messagePw = "";
      if (form.$valid) {
        if($scope.user.newPassword != $scope.user.newPasswordRepeat){
          $scope.errors.other = "Passwords must match";
          form.password.$setValidity('mongoose', false);
        }else {
          Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
            .then(function () {
              $scope.messagePw = 'Password successfully changed.';
              $scope.user.newPassword ="";
              $scope.user.oldPassword ="";
              $scope.user.newPasswordRepeat ="";
              $scope.submittedchangepw = false;
              form.newPassword.$dirty = false;
            })
            .catch(function () {
              form.password.$setValidity('mongoose', false);
              $scope.errors.other = 'Incorrect password';
              $scope.messagePw = '';
            });
        }
      }
    };
  });
