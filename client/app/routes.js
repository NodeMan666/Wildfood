'use strict';
angular.module('wildfoodApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('jobsadmin', {
        url: '/jobsadmin',
        templateUrl: 'app/jobs/jobviewer.html',
        controller: 'JobsadminCtrl',
        authenticate: true
      });

    $stateProvider
      .state('plantadmin', {
        url: '/plantadmin?plantId',
        templateUrl: 'app/admin/plant/plantadmin.html',
        controller: 'SpeciesAdminCtrl',
        authenticate: true
      });

    $stateProvider
      .state('adminmarker', {
        url: '/markeradmin?markerId',
        templateUrl: 'app/admin/marker/admin_marker.html',
        controller: 'MarkerAdminCtrl',
        authenticate: true
      });

    $stateProvider
      .state('map', {
        url: '/:tab',
        templateUrl: 'app/wildfoodmain/main.html',
        controller: 'MainController'
      });

    $stateProvider
      .state('tag', {
        url: '/tag/:markerid',
        templateUrl: 'app/wildfoodmain/main.html',
        controller: 'MainController'
      });

    $stateProvider
      .state('user', {
        url: '/user/:userid',
        templateUrl: 'app/wildfoodmain/main.html',
        controller: 'MainController'
      });


    $stateProvider
      .state('plant', {
        url: '/plant/:plantid',
        templateUrl: 'app/wildfoodmain/main.html',
        controller: 'MainController'
      });
  });
