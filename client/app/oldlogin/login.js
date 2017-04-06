'use strict';
angular
  .module('wildfoodApp')
  .service(
  'LoginUIService',
  [

    '$modal',
    '$http',
    '$filter',
    '$rootScope',
    '$cookies', 'UserService', 'WildfoodState', 'Auth', '$location', '$window',
    function ($modal, $http, $filter, $rootScope,
              $cookies, UserService, WildfoodState, Auth, $location, $window) {

      this.showLoginModal = function (signup) {

        var modalInstance = $modal.open({
          templateUrl: 'app/oldlogin/loginPopup.html',
          controller: ViewItemModalInstanceCtrl,
          backdrop: true,
          keyboard: false,
          resolve: {
            signup: function () {
              return signup;
            },
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
          function (result) {
            console.log("retuls " + result);
          },
          function (result) {
            if(result==='signup') {
              SignUpService.signup();
            }else{
              console
                .log('event:loginStatusChanged', result);
              $rootScope
                .$broadcast('event:loginStatusChanged');
            }
          });

      };

      var ViewItemModalInstanceCtrl = function (signup,$scope,
                                                $modalInstance,
                                         $cookies, UserService, WildfoodState, Auth, $location, $window) {

        $scope.showlogin = !signup;

        $scope.cancel = function () {

          $modalInstance.dismiss('cancel');
        };

        $scope.user = {};
        $scope.errors = {};

        $scope.login = function (form) {
          $scope.submitted = true;

          if (form.$valid) {
            Auth.login({
              email: $scope.user.email,
              password: $scope.user.password
            })
              .then(function () {
                $modalInstance.dismiss('login');
              })
              .catch(function (err) {
                $scope.errors.other = err.message;
              });
          }
        };

        $scope.loginOauth = function (provider) {
          $window.location.href = '/auth/' + provider;
        };
        $scope.signup = function () {

          $scope.showlogin = false;
        };
        $scope.switchtologin = function () {

          $scope.showlogin = true;
        };


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

      };

    }]);
