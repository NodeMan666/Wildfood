'use strict';
angular
  .module('wildfoodApp')
  .factory(
  'WildfoodState',
  [
    '$location',
    function ($location) {

      var map;
      var envConfig = [
        {
          host: 'wildfood.in',
          googleapi: 'AIzaSyB1VoCE7PEXUdF2_0xUuVbMvZMEO42kUTY'
        },
        {
          host: 'wildfoodmap.herokuapp.com',
          googleapi: 'AIzaSyAR-_Xv2YvFIoxBaLHgabt9VMbdvotASRQ'
        },
        {
          host: 'wildfoodmapdev.herokuapp.com',
          googleapi: 'AIzaSyAk3bgg8TTk-G0cQTsTed_iYdCLA0F17YM'
        },
        {
          host: 'wildfoodmapdev2.herokuapp.com',
          googleapi: 'AIzaSyAk3bgg8TTk-G0cQTsTed_iYdCLA0F17YM'

        },
        {
          host: 'wildfood.me',
          googleapi: 'AIzaSyAk3bgg8TTk-G0cQTsTed_iYdCLA0F17YM'

        },

        {
          host: 'localhost',
          googleapi: 'AIzaSyAk3bgg8TTk-G0cQTsTed_iYdCLA0F17YM'
        }
      ]

      function getEnv() {
        var currenthost = $location.host();
        var result;
        envConfig.forEach(function (type) {
          if (currenthost == type.host) {
            result = type;
          }
        })
        return result;
      }

      return {

        getApiUrl: function (service) {
          //return getEnv().baseApiUrl + service;
          return "/api/" + service;
        },
        getGoogleApiKey: function () {
          return getEnv().googleapi;
        }
      };
    }]);
