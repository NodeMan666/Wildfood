'use strict';
angular
  .module('wildfoodApp')
  .service(
  'SignUpService',
  [

    '$modal',
    '$http',
    '$filter',
    '$rootScope',
    '$cookies', 'UserService', 'WildfoodState', 'Auth', '$location', '$window', 'LoginUIService',
    function ($modal, $http, $filter, $rootScope,
              $cookies, UserService, WildfoodState, Auth, $location, $window,LoginUIService) {
      this.signup = function show() {
        var modalInstance = $modal.open({
          templateUrl: 'app/oldlogin/signup.html',
          controller: ViewItemModalInstanceCtrl,
          backdrop: true,
          keyboard: false,
          resolve: {

            UserService: function () {
              return UserService;
            },
            $cookies: function () {
              return $cookies;
            },
            WildfoodState: function () {
              return WildfoodState;
            },
            Auth: function () {
              return Auth;
            },
            $location: function () {
              return $location;
            },
            $window: function () {
              return $window;
            }
          }
        });
        modalInstance.result
          .then(
          function () {
          },
          function (result) {
            if(result==='login') {
              LoginUIService.showLoginModal();
            }else{
              console
                .log('event:loginStatusChanged', result);
              $rootScope
                .$broadcast('event:loginStatusChanged');
            }
          });

      };

      var ViewItemModalInstanceCtrl = function ($scope,
                                                $modalInstance,
                                                 $cookies, UserService, WildfoodState, Auth, $location, $window) {

        $scope.cancel = function () {

          $modalInstance.dismiss('cancel');
        };

        $scope.user = {};
        $scope.errors = {};

        $scope.register = function (form) {
          $scope.submitted = true;

          if (form.$valid) {
            Auth.createUser({
              name: $scope.user.name,
              email: $scope.user.email,
              password: $scope.user.password
            })
              .then(function () {
                // Account created, redirect to home
              //  $location.path('/');
                $modalInstance.dismiss('done');
              })
              .catch(function (err) {
                err = err.data;
                $scope.errors = {};

                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.errors, function (error, field) {
                  form[field].$setValidity('mongoose', false);
                  $scope.errors[field] = error.message;
                });
              });
          }
        };

        $scope.loginOauth = function (provider) {
          $window.location.href = '/auth/' + provider;
        };


        $scope.login = function (provider) {
          $modalInstance.dismiss('login');
        };
      };

    }]);
