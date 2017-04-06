'use strict';
angular
  .module('wildfoodApp.services')
  .factory(
  'GooglePlacesService',
  [
    '$http', '$q',
    function ($http, $q) {

      return {


        parseGoogleAddress: function (address) {
          var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});

          google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
            $scope.$apply();
          });
        }

      }

    }]);
