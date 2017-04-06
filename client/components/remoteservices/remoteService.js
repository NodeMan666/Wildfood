'use strict';
angular
  .module('wildfoodApp.services')
  .factory(
  'RemoteService',
  [
    '$http',
    '$filter',
    '$rootScope',
    '$location',
    '$cookies',
    'WildfoodState',
    '$q',
    '$upload',
    function ($http, $filter, $rootScope, $location,
              $cookies, WildfoodState, $q, $upload) {

      function generalErrorHandling(err) {
        //	$location.path("/error");
        console.log("error", err);
      }

      function getDataAsPostVariables(data) {

        var first = true;
        var result = "";

        for (var property in data) {
          if (data.hasOwnProperty(property)) {

            var sub = "";
            if (!first) {
              sub = "&";
            }
            var value = data[property];
            value = encodeURI(value);

            result += sub + property + "=" + value;

            first = false;
          }
        }
        console.log(result);
        return result;
      }

      function getDataAsGetVariables(data) {


        var first = true;
        var result = "";

        for (var property in data) {
          if (data.hasOwnProperty(property)) {

            var sub = "?";
            if (!first) {
              sub = "&";
            }

            result += sub + property + "="
            + data[property];

            first = false;
          }
        }
        return result;
      }

      function getRidOFUndefined(data) {

        var result = {};

        for (var property in data) {
          if (data.hasOwnProperty(property)) {
            var value = data[property];

            if (value !== undefined) {

              result[property] = value;
            }
          }
        }
        return result;
      }

      return {

        postWithFile: function (endpoint, data, file) {
          var deferred = $q.defer();

          $upload
            .upload(
            {
              url: WildfoodState
                .getApiUrl(endpoint),
              method: 'POST',
              headers: {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded"

              },
              data: getRidOFUndefined(data),
              file: file,
              fileFormDataName: 'image'
            })
            .success(function (item) {
              deferred.resolve(item);

            })
            .error(generalErrorHandling);

          return deferred.promise;

        },
        postfile: function (endpoint, file) {
          return $upload.upload({
            url: WildfoodState
              .getApiUrl(endpoint),
            file: file,
            fileFormDataName: 'image'
          });
        },
        postnewWithFile: function (endpoint, data, file) {
          var deferred = $q.defer();

          $upload
            .upload(
            {
              url: WildfoodState
                .getApiUrl(endpoint),
              method: 'POST',
              headers: {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded"

              },
              data: getRidOFUndefined(data),
              file: file,
              fileFormDataName: 'image'
            })
            .success(function (item) {
              deferred.resolve(item);

            })
            .error(generalErrorHandling);

          return deferred.promise;

        },
        post: function (endpoint, data) {

          var deferred = $q.defer();
          $http.post(
            WildfoodState
              .getApiUrl(endpoint),

            data
          ).success(
            function (data, status, headers,
                      config) {
              deferred.resolve(data);

            }).error(generalErrorHandling);
          return deferred.promise;

        },
        put: function (endpoint, data) {

          var deferred = $q.defer();
          $http.put(
            WildfoodState
              .getApiUrl(endpoint),

            data
          ).success(
            function (data, status, headers,
                      config) {
              deferred.resolve(data);

            }).error(generalErrorHandling);
          return deferred.promise;

        },
        get: function (endpoint, data) {
          var deferred = $q.defer();
          $http(
            {
              method: "GET",
              url: WildfoodState
                .getApiUrl(endpoint)
              + getDataAsGetVariables(data),
              headers: {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded"

              }
            }).success(
            function (data, status, headers,
                      config) {
              deferred.resolve(data);

            }).error(generalErrorHandling);
          return deferred.promise;
        },
        delete: function (endpoint, data) {
          var deferred = $q.defer();
          $http(
            {
              method: "DELETE",
              url: WildfoodState
                .getApiUrl(endpoint)
              + getDataAsGetVariables(data),
              headers: {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded"

              }
            }).success(
            function (data, status, headers,
                      config) {
              deferred.resolve(data);

            }).error(generalErrorHandling);
          return deferred.promise;
        }

      }

    }]);
