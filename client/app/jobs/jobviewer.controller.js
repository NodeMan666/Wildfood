'use strict';

angular.module('wildfoodApp')
    .directive('jobValue', ['RemoteService', function (RemoteService) {
        return {
            template: '<tr class="labelvalue"><td class="label">{{title}}</td><td class="value">{{value}}</td></tr>',
            restrict: 'EA',
            replace: true,
            scope: {
                value: '=jobValue',
                title: '@title'
            },
            link: function (scope, element, attrs) {
            }
        };
    }]);

angular
    .module('wildfoodApp')
    .controller(
    'JobsadminCtrl',
    [
        '$scope',
        '$filter',
        'LoginUIService',
        '$rootScope',
        '$timeout',
        '$q', 'RemoteService', 'Auth', 'UserService',
        function ($scope, $filter, LoginUIService, $rootScope, $timeout, $q, RemoteService, Auth, UserService) {
            init();


            $scope.logout = function () {
                UserService.logout($scope.user);

                authorise();
            };

            $scope.$watch('currentPage', function (newval, oldval) {
                if (newval != oldval) {
                    refresh();
                }
            });


            function authorise() {
                $scope.isLoggedIn = Auth.isLoggedIn;
                $scope.isAdmin = Auth.isAdmin;
                $scope.getCurrentUser = Auth.getCurrentUser;

                $scope.user = Auth.getCurrentUser();
            }

            $scope.logout = function () {
                UserService.logout($scope.user);

                authorise();
            };


            $scope.login = function () {
                LoginUIService.showLoginModal();
            };

            $scope.$on('event:loginStatusChanged', function (e, args) {
                console.log('loginStatusChanged received');

                $timeout(
                    function () {
                        authorise();
                    }, 5000);
            });

            $scope.items = [];

            function init() {
                authorise();
                refresh();
            }

            $scope.currentPage = 1;
            $scope.itemCount = 0;
            $scope.resultsPerPage = 5;

            function refresh() {
              var page = parseInt($scope.currentPage)-1;
                var params = "?page=" + page + "&size=" + $scope.resultsPerPage;

                if ($scope.filter != null && $scope.filter != "") {
                    params = "?job=" + $scope.filter;
                }
                RemoteService.get('jobs/last' + params)
                    .then(
                    function (items) {
                        $scope.items = items.data;
                        $scope.itemCount = items.pagination.itemCount;

                    });
            }

            $scope.$watch('filter', function () {
                refresh();
            })


        }]);
