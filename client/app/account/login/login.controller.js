'use strict';
angular.module('wildfoodApp')
    .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
        $scope.user = {};
        $scope.errors = {};

        var redirect = $location.search().redirect;

        $scope.login = function (form) {
            $scope.submitted = true;
            var data = {
                email: $scope.user.email,
                password: $scope.user.password
            };
            if (redirect && redirect != '') {
                data.redirect = redirect;
            }

            if (form.$valid) {
                Auth.login(data)
                    .then(function (returnredirect) {
                        // Logged in, redirect to home
                        if(returnredirect && returnredirect!=''){
                            $location.path('/');
                        }else{
                            $location.path('/' + returnredirect);
                        }

                    })
                    .catch(function (err) {
                        $scope.errors.other = err.message;
                    });
            }
        };

        $scope.loginOauth = function (provider) {
            $window.location.href = '/auth/' + provider;
        };
    });
