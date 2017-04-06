'use strict';

angular
  .module('wildfoodApp')
  .controller(
  'MarkerAdminCtrl',
  [
    '$scope',
    'MarkersService',
    'PlantService',
    '$modal',
    '$cookies',
    'About',
    '$filter',
    'ImageViewer',
    '$stateParams',
    '$location',
    'Navigation',
    '$rootScope',
    '$timeout',
    'UserService',
    'modalService',
    'MarkerUtils',
    'AdminService',
    'LoginUIService', '$q', 'GeoLocationService', 'Auth', 'MarkersSearchService', 'CurrentLocationService',
    function ($scope, MarkersService, PlantService, $modal, $cookies, About, $filter, ImageViewer, $stateParams, $location,
              Navigation, $rootScope, $timeout, UserService, modalService, MarkerUtils, AdminService,
              LoginUIService, $q, GeoLocationService, Auth, MarkersSearchService,CurrentLocationService) {

      $scope.currentPage = 1;
      $scope.itemCount = 0;
      $scope.resultsPerPage = 30;


      init();

      function authorise() {
        $scope.user = Auth.getCurrentUser();
      }

      function init() {

        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;

        var currentMarkerId = $stateParams.markerId;

        if (currentMarkerId != null) {
          $scope.markerIdFilter = currentMarkerId;
          showMarkerById(currentMarkerId);
        } else {

          CurrentLocationService
            .getDefaultLocationForAdmin().then(function (position) {
              $scope.location.geometry = {
                lat: position.lat,
                lng: position.long
              };

              filter();
              GeoLocationService.getAddressFromCoordinates(position.lat, position.long).then(function (result) {
                console.log(result);
                $scope.location.formatted_address = result.formatted_long;
              })
            });

        }


        $scope.hidden = false;
        $scope.unmatched = false;
        $scope.unknownmarkersonly = false;
        $scope.mode = "UNPROCESSED";
        $scope.location = {};
        // $scope.location.formatted_address = {};


        authorise();
        $scope.loading = true;


      }


      $scope.getSpecies = function (input) {
        return PlantService.searchPlant(input);
      };

      $scope.logout = function () {
        Auth.logout();

        $rootScope
          .$broadcast('event:loginStatusChanged');

        authorise();
      };

      $scope.checkIfValid = function (marker) {
        marker.valid = marker.verified
        && marker.plant && marker.plant._id != null;
      };


      $scope.login = function () {
        LoginUIService.showLoginModal();
      };

      $scope.$on('event:loginStatusChanged', function (e, args) {
        console.log('loginStatusChanged received');
        authorise();

      });

      $scope.showAll = function () {
        $scope.mode = "ALL";
        filter();
      };

      $scope.showUnprocessed = function () {
        $scope.mode = "UNPROCESSED";
        filter();
      };

      $scope.clearMarkerIdFilter = function () {
        $scope.markerIdFilter = null;
        filter();
      };

      $scope.clearLocationFilter = function () {
        $scope.location = {};
        // $scope.location.formatted_address = {};
        filter();
      };
      $scope.clearMarkersByUserFilter = function () {
        $scope.userMarkerFilter = null;
        $scope.userfilterid = null;
        filter();
      };

      $scope.clearMarkersByPlantFilter = function () {
        $scope.plantMarkerFilter = null;
        $scope.plantfilterid = null;
        filter();
      };

      $scope.clearMarkerFilter = function () {
        $scope.markerFilter = null;
        filter();
      };

      $scope.getAllMarkerIds = function () {

        if ($scope.allmarkerids == null) {
          var result = [];
          $scope.allitems.forEach(function (item) {
            result.push(item.id);

          });
          $scope.allmarkerids = result;
        }

        return $scope.allmarkerids;
      };

      function canApplyBatch() {
        var deferred = $q.defer();
        if ($scope.markers.length > 100) {
          window.alert("too many markers selected");
          deferred.resolve(false);
        } else if ($scope.markers.length > 3) {
          var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Do it!',
            headerText: 'Sure?',
            bodyText: 'Are you sure you want to do this? you have '
            + $scope.markers.length
            + ' selected items.'
          };

          modalService.showModal({}, modalOptions)
            .then(function (result) {
              if (result == 'cancel') {
                deferred.resolve(false);
              }
              deferred.resolve(true);
            });

        }
        return deferred.promise;
      }

      function applyBatch(myfunc) {

        canApplyBatch().then(function (result) {
          if (result) {
            $scope.markers.forEach(function (item) {
              myfunc(item);
              AdminService.editMarker(item);
            });
          }
        })

      }

      $scope.markAllAsInactive = function () {

        applyBatch(function (item) {
          MarkerUtils.hideMarker(item);
        });

      };

      $scope.markAllAsactive = function () {
        applyBatch(function (item) {
          MarkerUtils.unhideMarker(item);
        });
      };

      $scope.markAllAsProcessed = function () {
        applyBatch(function (item) {
          MarkerUtils.setVerified(item);
        });
      };

      $scope.markAllAsNotProcessed = function () {
        applyBatch(function (item) {
          MarkerUtils.unsetVerified(item);
        });
      };

      $scope.searchUsers = function (searchString) {
        return UserService.searchAllUsers(searchString);
      };

      $scope.$watch('hidden', function (newVal, oldVal) {
        filterWhenNecessary(newVal, oldVal);
      });

      $scope.$watch('location.formatted_address', function (newVal, oldVal) {
        if (shouldFilter(newVal, oldVal)) {
          if (newVal.geometry != null) {
            $scope.location.geometry = newVal.geometry.location;
            // $scope.location = newVal.geometry;
            filter();
          }
        }

        if (newVal === '') {
          $scope.clearLocationFilter();
        }
      });


      $scope.$watch('howmany', function (newVal, oldVal) {
        filterWhenNecessary(newVal, oldVal);
      });

      function shouldFilter(newVal, oldVal) {
        return newVal != null && newVal != oldVal;
      }

      function filterWhenNecessary(newVal, oldVal) {
        if (shouldFilter(newVal, oldVal)) {
          filter();
        }
      }

      $scope.$watch('unmatched',
        function (newVal, oldVal) {
          filterWhenNecessary(newVal, oldVal);
        });

      $scope.$watch('unknownmarkersonly',
        function (newVal, oldVal) {
          filterWhenNecessary(newVal, oldVal);
        });

      $scope.$watch('markerFilter', function (newVal, oldVal) {
        filterWhenNecessary(newVal, oldVal);

      });

      $scope.$watch('markerIdFilter', function (newVal, oldVal) {
        if (newVal != null && newVal != oldVal) {
          if (newVal != null && newVal !== "") {
            showMarkerById(newVal);
          } else if (newVal === "") {
            $scope.clearMarkerIdFilter();
            filter();
          }
        }

      });

      function showMarkerById(newVal) {

        MarkersService
          .getMarker(newVal)
          .then(
          function (returnmarker) {
            $scope.loading = false;
            if (returnmarker._id) {

              prepareMarker(returnmarker);
              $scope.markers = [returnmarker];
            } else {
              $scope.markers = [];
            }
          });
      }

      $scope.userfilterid = null;

      $scope.$watch('userMarkerFilter', function (newVal, oldVal) {
        if (newVal != null && newVal != oldVal) {
          if (newVal != null && newVal._id) {

            $scope.userMarkerFilter = newVal.username;
            $scope.userfilterid = newVal._id;
            filter();
          } else if (newVal === "") {
            $scope.clearMarkersByUserFilter();
            filter();
          }
        }
      });

      $scope.$watch('plantMarkerFilter', function (newVal, oldVal) {
        if (newVal != null && newVal != oldVal) {
          if (newVal != null && newVal.species && newVal.species._id) {
            $scope.plantMarkerFilter = newVal.species.name;
            $scope.plantfilterid = newVal.species._id;
            filter();
          } else if (newVal === "") {
            $scope.clearMarkersByPlantFilter();
            filter();
          }
        }
      });


      function getPlantFlag() {

        if ($scope.plantfilterid != null && $scope.plantfilterid != '') {
          return $scope.plantfilterid;
        }

        if ($scope.unmatched) {
          return "none";
        }
      }

      function hasPlantParam() {

        if ($scope.plantfilterid != null) {
          return true;
        }

        if ($scope.unmatched) {
          return true;
        }
        return false;
      }

      function prepareMarker(marker, length) {
        MarkerUtils.checkIfValid(marker);
        if (length && length < 30) {

        }
      }

      $scope.getLocation = function (val) {
        return GeoLocationService
          .searchPlace(val);
      };

      $scope.$watch('location.formatted_address', function (newVal, oldVal) {
        if (newVal) {
          if (newVal.formatted_address) {
            GeoLocationService.getPlaceDetails(newVal.place_id).then(function (result) {
              var loc = result.geometry.location;

              $scope.location.geometry = {
                lat: loc.lat,
                lng: loc.lng
              }


              filter();
            })
          }
        }
      });

      $scope.filter = function () {
        filter();
      }


      $scope.makeCurrentLocationDefault = function () {
        CurrentLocationService.saveAdminLocation();
      };

      $scope.$watch('currentPage', function (newval, oldval) {
        if (newval != oldval) {
          filter();
        }
      });

      function filter() {
        $scope.loading = true;

        if ($scope.markerIdFilter != null && $scope.markerIdFilter != '') {
          showMarkerById($scope.markerIdFilter);
        } else {


          var params = {};

          if ($scope.mode == 'UNPROCESSED') {
            params.verified = false;
          }

          if (hasPlantParam()) {
            params.plant = getPlantFlag();
          }

          if ($scope.hidden) {
            params.active = "both";
          }

          if ($scope.unknownmarkersonly) {
            params.plant_unknown = true;
          }


          if ($scope.location.geometry) {

            params.lat = $scope.location.geometry.lat;
            params.range = 100000;
            params.long = $scope.location.geometry.lng;
          }


          if ($scope.userfilterid != null) {
            params.owner = $scope.userfilterid;
          }

          if ($scope.markerFilter != null
            && $scope.markerFilter !== "") {

            params.search = $scope.markerFilter;

          }

          params.page = $scope.currentPage;
          params.size = $scope.resultsPerPage

          MarkersSearchService
            .getFilteredMarkers(params)
            .then(
            function (items) {
              var markers = items.data;
              //itemCount: 1000
              //next_page: -1
              //page: "1"
              //size: "30"
              //if (items.pagination.next_page == -1) {
              //  $scope.itemCount = $scope.resultsPerPage;
              //} else {
              //  $scope.itemCount = items.pagination.itemCount;
              //}
              $scope.itemCount = items.pagination.itemCount;
              $scope.next_page = items.pagination.next_page;

              for (var i = 0; i < markers.length; i++) {
                prepareMarker(
                  markers[i],
                  markers.length);

              }
              $scope.markers = markers;
              $scope.loading = false;
            });
        }
      }

    }]);
