'use strict';
angular
  .module('wildfoodApp.services')
  .factory(
  'UserService',
  [
    '$http',
    '$rootScope',
    '$location',
    '$cookies',
    '$q',
    'RemoteService',
    'UserUtils', 'WildfoodState',
    function ($http, $rootScope, $location, $cookies, $q, RemoteService, UserUtils, WildfoodState) {

      return {
          getUser: function (id) {

              var deferred = $q.defer();
              RemoteService
                  .get('users/public/' + id)
                  .then(
                  function (user) {
                      UserUtils.refineUser(user);
                      deferred.resolve(user);
                  });

              return deferred.promise;
          },

          searchUser: function (searchStr) {

          var deferred = $q.defer();
          RemoteService
            .get('users/search', {
              search: searchStr
            })
            .then(
            function (data) {
              var result = [];

              data.data.forEach(function (user) {
                UserUtils.refineUser(user);
                result.push(user);
              });

              deferred.resolve(result);
            });

          return deferred.promise;
        },
         searchAllUsers: function (searchStr) {

          var deferred = $q.defer();
          RemoteService
            .get('users/searchall', {
              search: searchStr
            })
            .then(
            function (data) {
              var result = [];

              data.data.forEach(function (user) {
                UserUtils.refineUser(user);
                result.push(user);
              });

              deferred.resolve(result);
            });

          return deferred.promise;
        }


      };


    }]);
