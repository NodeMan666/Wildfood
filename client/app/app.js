'use strict';


angular.module('wildfoodApp.widgets', [
  'wildfoodApp.conditionalTooltip', 'wildfoodApp.imageSelector', 'wildfoodApp.carousel', 'sticky']);


angular.module('wildfoodApp.remote', []);
angular.module('wildfoodApp.utils', []);
angular.module('wildfoodApp.filters', ['wildfoodApp.utils']);
angular.module('wildfoodApp.services', ['ngCookies']);
angular.module('wildfoodApp.markers', ['wildfoodApp.remote',
  'wildfoodApp.filters', 'wildfoodApp.services', 'wildfoodApp.utils']);

angular.module('wildfoodApp.components', [
  'wildfoodApp.remote',
  'wildfoodApp.services',
  'wildfoodApp.filters',
  'wildfoodApp.markers',
  'wildfoodApp.utils'
]);

angular.module('wildfoodApp', [
  'templates-appjs',
  'ngCookies',
  'ngResource',
  'ngSanitize',

  //,
  //'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'angularFileUpload',
  'nsPopover',
  'google.places',
  'ngGPlaces',
  'xeditable',
  'angular.filter',
  'wildfoodApp.widgets',
  'wildfoodApp.components',
  'djds4rce.angular-socialshare',
  'vAccordion',
  'pageslide-directive'

])
angular.module('wildfoodApp').constant('REF_DATA', {


    monthCodes: {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec"
    },
    plantPartList: ['all', 'roots', 'rhizome', 'stems', 'bark', 'leaves', 'flowers', 'seed', 'berries', 'fruit', 'spores', 'shoots']

})
//.config(function(ngGPlacesAPIProvider){
//  ngGPlacesAPIProvider.setDefaults({
//    radius: 1000000,
//    //sensor: false,
//    latitude: null,
//    longitude: null,
//    //types: ['food'],
//    types: null,
//    map: null,
//    elem: null,
//    nearbySearchKeys: ['name', 'reference', 'vicinity'],
//    placeDetailsKeys: ['formatted_address', 'formatted_phone_number',
//      'reference', 'website'
//    ]
//  });
//})
  .config(function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
  })
.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    //console.log("get $urlRouterProvider");
    $urlRouterProvider
      .otherwise('/');


    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401) {

         //add the redirect to the path
         // $location.path('/login' + '?redirect=test');
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })
.run(function(editableOptions) {
//    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
})
  .run(function ($templateCache, $http) {
    //if jasmine is available we are in a unit test and should not populate the templates as it screws up the server side http gets
    if (typeof mocha === 'undefined') {
      var templates = ['app/map/template_markerInfoPopup.html'];
      templates.forEach(puttocache);

    }
    function puttocache(url) {
      $http.get(url).success(function (result) {
        $templateCache.put(url, result);
      });
    }

  })
  .run(function($FB){
    $FB.init('733688820053919');
  })
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
            //add the redirect to the path
            //$location.path('/login' + '?redirect=test');
            $location.path('/login');
        }
      });
    });
  })
//.run([
//  '$rootScope',
//  '$window',
//  'myGoogleMap',
//  function($rootScope, $window, myGoogleMap) {
//
//    //myGoogleMap.initialize();
//
//  }]);
