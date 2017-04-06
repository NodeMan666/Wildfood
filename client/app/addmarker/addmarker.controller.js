'use strict';
angular
  .module('wildfoodApp')
  .controller(
  'AddMarkerCtrl',
  [
    '$scope',
    '$http',
    'GoogleMaps',
    'MarkersService',
    '$filter',
    'filterFilter',
    '$timeout',
    'PlantService',
    'modalService',
    'Utils',
    'ImageUtils',
    'GeoLocationService', 'AddMarkersService',
    function ($scope, $http, GoogleMaps, MarkersService, $filter, filterFilter, $timeout, PlantService, modalService,
              Utils, ImageUtils, GeoLocationService, AddMarkersService) {
      $scope.loading = false;
      $scope.allFiles = [];
      $scope.alerts = [];


      $scope.getSpecies = function (input) {
        return PlantService.searchPlant(input);
      };

      $scope.$watch('queryaddress', function (newVal, oldVal) {
        if (newVal) {
          if (newVal.formatted_address) {
            GeoLocationService.getPlaceDetails(newVal.place_id).then(function (result) {
              var loc = result.geometry.location;
              var lat = loc.lat;
              var lng = loc.lng;
              setClickedMarker(lat, lng);

              $scope.map
                .panTo(new google.maps.LatLng(
                  lat, lng));
            })
          }
        }
      });

      function setClickedMarker(lat, lng) {

        var myLatlng = new google.maps.LatLng(lat, lng);

        if ($scope.marker == null) {

          var marker = new google.maps.Marker({
            position: myLatlng,
            map: $scope.map,
            icon: 'assets/images/gm_marker.png'
          });
          marker.setDraggable(true);
          google.maps.event.addListener(marker,
            'dragend', function ($event) {

              console.log("dragend");
              setClickedMarker(
                $event.latLng.lat(),
                $event.latLng.lng());

            })

          $scope.marker = marker;
        } else {

          $scope.marker.setPosition(myLatlng);
        }
        $scope.addItem.location.position.latitude = lat;
        $scope.addItem.location.position.longitude = lng;

        ;

        Utils.applyToScope($scope);
      }

      $scope.$on('showAddMap', function (e, args) {
        adjustCenter();
        if ($scope.editing) {
          $scope.addItem = AddMarkersService
            .getEmptyNewMarker();

        }

        $scope.editing = false;

      });

      function adjustCenter() {
        if ($scope.marker == null) {
          $scope.map.setCenter(GoogleMaps
            .getMainMap().getCenter());

          $scope.map.setZoom(GoogleMaps.getMainMap()
            .getZoom());
        }
      }

      $scope.editing = false;
      $scope
        .$on(
        'showEditMarker',
        function (e, marker) {
          $scope.editing = true;

          if (marker.images.length > 0) {
            if (marker.getImageThumbUrl() != "assets/images/plant_placeholder.png") {
              var img = marker.images[0];
              $scope.file = img;
              $scope.file.preview = marker
                .getImageThumbUrl();
              $scope.file.valid = true;
              $scope.file.downloadReady = true;
              $scope.file.existing = true;
            } else {
              $scope.file = null;
            }
          } else {
            $scope.file = null;
          }


          $scope.editoriginal = marker;
          $scope.addItem = _.cloneDeep(marker);
          $scope.addItem.speciesItem = marker.getSpeciesFullNameOrNull();
          setClickedMarker(
            marker.location.position.latitude,
            marker.location.position.longitude);

          $scope.map
            .panTo(new google.maps.LatLng(
              marker.location.position.latitude,
              marker.location.position.longitude));
        });

      $scope.$on('addmapReady', function (e, args) {
        initMap();
      });

      function initMap() {
        $scope.map = GoogleMaps.getAddMap();

        google.maps.event
          .addListener(
          $scope.map,
          'click',
          function ($event) {

            setClickedMarker(
              $event.latLng.lat(),
              $event.latLng.lng());

          });
      }

      $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
      };

      $scope.addItem = AddMarkersService.getEmptyNewMarker();

      $scope.cancel = function () {
        $scope.$parent.showPage('map');
        $scope.file = null;
        $scope.loading = false;
      };

      function finish(marker) {
        $scope.addItem = AddMarkersService
          .getEmptyNewMarker();
        $scope.alerts = [];
        $scope.disableSubmit = true;
        $scope.file = null;
        $scope.$parent.addMarkerFinish(marker._id);
        $scope.loading = false;
      }

      function submit() {
        $scope.loading = true;
        if ($scope.marker != null) {
          $scope.marker.setMap(null);
          $scope.marker = null;
        }

        var item = $scope.addItem;

        if ($scope.editing) {

          if (item.speciesItem == $scope.editoriginal
              .getSpeciesFullName()) {
            //hasn't changed the plant
            item.speciesItem = {species: $scope.editoriginal.plant};
          }

          fixSpecies(item);
          _.merge($scope.editoriginal, item);


          AddMarkersService.editMarker($scope.editoriginal,
            $scope.file)
            .then(function (item) {
              console.log(item);
              finish(item);
            });

        } else {
          fixSpecies(item);
          AddMarkersService.addMarker(item, $scope.file)
            .then(function (createdItem) {
              console.log(createdItem);
              finish(createdItem);
            });
        }

      }

      function fixSpecies(item) {
        if (item.plant_unknown) {
          markunknown(item, item);
        } else if (typeof item.speciesItem === 'object') {
          copySpeciesDetails(item, item);
        } else {
          makerUserPlant(item, item);
        }
      }

      function markunknown(item, spec) {
        item.plant_by_user = null;
        item.plant = null;
        item.plant_unknown = true;
      }

      function makerUserPlant(item, spec) {
        item.plant_by_user = spec.speciesItem;
        item.plant = null;
        item.plant_unknown = false;
      }

      function copySpeciesDetails(target, source) {
        target.plant = source.speciesItem.species._id;
        target.plant_unknown = false;
      }

      function hasDeletedImage() {
        return $scope.editoriginal.length > 0 && (file == null || file.versions == null);
      }

      $scope.ok = function () {
        $scope.alerts = [];
        if (validForm()) {
          if ($scope.file != null) {
            submit();
          } else {

            if ($scope.editing && hasDeletedImage()) {
              modalService
                .showModal(
                {},
                {
                  closeButtonText: 'Cancel',
                  actionButtonText: 'Submit',
                  headerText: 'Submit without an image?',
                  bodyText: 'Are you sure you want submit and remove the image?'
                })
                .then(
                function (result) {
                  if (result != 'cancel') {
                    submit();
                  }

                });
            } else {

              modalService
                .showModal(
                {},
                {
                  closeButtonText: 'Cancel',
                  actionButtonText: 'Submit',
                  headerText: 'Submit without an image?',
                  bodyText: 'Are you sure you want to submit without an image?'
                })
                .then(
                function (result) {
                  if (result != 'cancel') {
                    submit();
                  }
                });
            }
          }

        } else {
          if ($scope.alerts.length === 0) {

            if (!isValidImage()) {
              $scope.alerts
                .push({
                  type: 'danger',
                  msg: 'Please wait till the image is uploaded'
                });
            } else {
              $scope.alerts
                .push({
                  type: 'danger',
                  msg: 'Check out your details. We need a location and the plant type'
                });
            }

          }

          //	window.scrollTo(0, 0);
        }

      };

      function validForm() {
        console.log($scope.addItem);
        return $scope.isLocationProvided()
          && isValidSpecies() && isValidImage();

      }

      function isValidImage() {
        var item = $scope.addItem;

        if ($scope.file != null) {
          return $scope.file.valid;

        }
        return true;


      }

      function isValidSpecies() {
        var item = $scope.addItem;
        console.log("isvalid", item.speciesItem);

        if (item.plant_unknown) {
          return true;
        } else {
          if (typeof item.speciesItem === 'object') {
            return item.speciesItem.species._id !== "";
          } else {
            return item.speciesItem != null && item.speciesItem !== "";
          }
        }
      }

      $scope.isLocationProvided = function (val) {
        return $scope.addItem.location.position.latitude !== ""
          && $scope.addItem.location.position.longitude !== "";

      };

      function checkForAddressMatchAtMarkerMove(lat, lng) {
        if ($scope.addItem.location.address.formatted_address) {
          if ($scope.addItem.location.address.geometry.location.lat != lat
            || $scope.addItem.location.address.geometry.location.lng != lng) {
            // marker moved?
          }
        }
      }


      $scope.getLocation = function (val) {

        return GeoLocationService
          .searchPlace(val)
      };
    }]);
