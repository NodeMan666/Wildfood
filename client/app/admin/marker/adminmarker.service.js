'use strict';
angular
  .module('wildfoodApp')
  .factory(
  'AdminMarkerService',
  [
    '$http',
    '$upload',
    'MarkersService',
    '$filter',
    'RemoteService',

    function ($http, $upload, MarkersService, $filter, RemoteService) {
      return {
        editMarker: function (marker) {
          console.log("edit sent " + marker.plant
          + ", active:" + marker.active
          + ",processed: " + marker.verified);

          if (marker.verified === undefined) {
            marker.verified = false;
          }

          var data = _.pick(marker, ['active', 'verified', 'plant_unknown']);
          if (marker.plant) {
            data.plant = marker.plant._id;
          }else{
            data.plant = null;
          }
          return RemoteService.put(
            'marker/admin/' + marker._id, data);

        }

      };

    }]);
