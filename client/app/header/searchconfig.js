'use strict';
angular.module('wildfoodApp').factory('SearchConfig',
  ['$cookies', 'CurrentLocationService', function ($cookies,CurrentLocationService) {

    var defaultConfig = {
      plant: true,
      user: true,
      location: false,
      marker: true
    }


    return {

      getConfig: function () {
        try {

          var fromcookies = $cookies.wildfoodconfig;
          if (fromcookies != null) {
            var obj = JSON.parse(fromcookies);
            return obj;
          }
        } catch (e) {

        }
        return defaultConfig;
      },

      saveConfig: function (newconfig) {
        var json = JSON.stringify(newconfig);
        $cookies.wildfoodconfig = json;
      },

      isEnabled: function (type) {
        return this.getConfig()[type];
      }

    }
  }]);
