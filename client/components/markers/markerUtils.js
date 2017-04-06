'use strict';
angular
  .module('wildfoodApp.utils')
  .service(
  'MarkerUtils',
  [
    '$templateCache',
    '$compile',
    'UserUtils',
    'Utils',
    'wfUtils',
    'CommentUtils', 'Auth',
    function ($templateCache, $compile, UserUtils, Utils, wfUtils, CommentUtils, Auth) {

      function createMapMarker(mymarker, map) {
        var myLatlng = new google.maps.LatLng(
          mymarker.location.position.latitude,
          mymarker.location.position.longitude);
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: mymarker.shortDescriptionString,
          icon: mymarker.getMarkerIcon()
        });

        return marker;
      }

      function getMarkerImagePath(marker, base) {

        var un = marker.isMatched() ? "" : "_um";
        var fav = marker.isFavorite() ? "_favorite" : "";

        var mine = marker.isMine() ? "_mine" : "";

        var result = "assets/images/marker" + base + un + fav
          + mine + ".png";

        return result;
      }

      function createPopupInfoBox($scope) {

        var template = $templateCache
          .get('app/map/template_markerInfoPopup.html');

        var compiled = $compile(template)($scope);

        Utils.$digestToScope($scope);

        var myOptions = getPopupOptions(compiled[0]);

        var ib = new InfoBox(myOptions);
        return ib;
      }

      function enhanceMarkerWithUiMethods(marker) {

        marker.getMarkerIcon = function () {
          return getMarkerImagePath(marker, "");
        };


        marker.getOpenMarkerIcon = function () {
          return getMarkerImagePath(marker, "_open");
        };

        marker.getVisitedMarkerIcon = function () {
          return getMarkerImagePath(marker,
            "_visited");
        };

        marker.getHighlightedMarkerIcon = function () {
          return getMarkerImagePath(marker,
            "_selected");
        };

        marker.setIcon = function (icon) {
          if (marker.mapmarker != null && marker.mapmarker.setIcon) {
            marker.mapmarker.setIcon(icon);
          }
        };

        marker.close = function () {

          marker.setIcon(marker
            .getVisitedMarkerIcon());
        };


        marker.getSourceImage = function () {
          return "assets/images/marker.png";
        };

        marker.seeMore = function ($event) {
          $event.stopPropagation();
          marker.showFullDescription = true;
        }

        marker.seeLess = function ($event) {
          $event.stopPropagation();
          marker.showFullDescription = false;
        }
        marker.closeMarker = function (map) {
          marker.close();
          if (marker.infobox != null && marker.infobox.close) {
            marker.infobox.close();
          }
        };

        marker.select = function () {
          marker.setIcon(marker
            .getHighlightedMarkerIcon());
        };
        marker.unselect = function () {
          if (marker.mapmarker) {
            if (marker.visited) {
              marker.setIcon(marker
                .getVisitedMarkerIcon());
            } else {
              marker.setIcon(marker
                .getMarkerIcon());
            }
          }
        };
        marker.unknown = (marker.unknown == 1) ? true : false;

        marker.hideMarker = function () {

          marker.closeMarker();

          if (marker.mapmarker != null) {
            marker.mapmarker.setMap(null);
          }
        };

        marker.openInfoWindow = function (map, $scope) {
          marker.visited = true;
          marker.setIcon(marker
            .getOpenMarkerIcon());

          if (!marker.infobox) {
            marker.infobox = createPopupInfoBox($scope);
            google.maps.event.addListener(marker.infobox,
              'closeclick', function () {
                marker.close();
              });
          }
          marker.infobox.open(map, marker.mapmarker);
        };

        marker.showFullDescription = false;
        marker.visited = false;
        marker.hasBeenEnhanced = true;
      }

      this.enhanceMarker = function (marker) {
        enhanceMarkerWithUiMethods(marker);
        enhanceMarker(marker);
      };

      this.setupMapMarker = function (marker, map, $scope) {
        setupMapMarker(marker, map, $scope);
      };

      this.updateMapMarker = function (marker, map, $scope) {
        updateMapMarker(marker, map, $scope);
      };


      this.hideMarker = function (marker) {
        marker.active = false;
        marker.verified = true;
        this.checkIfValid(marker);
      }

      this.unhideMarker = function (marker) {
        marker.active = true;
        this.checkIfValid(marker);
      }

      this.makeUnknown = function (marker) {
        marker.plant_unknown = true;
        this.checkIfValid(marker);
      }

      this.makeKnown = function (marker) {
        marker.plant_unknown = false;
        this.checkIfValid(marker);
      }

      this.setVerified = function (marker) {
        marker.verified = true;
        this.checkIfValid(marker);
      }

      this.unsetVerified = function (marker) {
        marker.verified = false;
        this.checkIfValid(marker);
      }

      this.checkIfValid = function (marker) {
        if (!marker.active) {
          marker.valid = marker.verified;
        } else {
          marker.valid = marker.verified && marker.plant && marker.plant._id;
        }
      }


      this.updateEditedMarkerFromResult = function (marker, item) {

        marker.images = item.images;
        return marker;
      };

      function setupMapMarker(marker, map, $scope) {
        var mapmarker = createMapMarker(marker, map);

        marker.mapmarker = mapmarker;
        mapmarker.map = map;
      }

      function updateMapMarker(marker, map, $scope) {

        var mapmarker = marker.mapmarker;

        var myLatlng = new google.maps.LatLng(
          marker.location.position.latitude,
          marker.location.position.longitude);
        mapmarker.position = myLatlng;
      }

      function getPopupOptions(content) {

        return {
          alignBottom: true,
          content: content,
          disableAutoPan: false,
          maxWidth: 0,
          pixelOffset: new google.maps.Size(-80, -50),
          zIndex: null,
          boxStyle: {
            opacity: 1,
            width: "245px"
          },
          closeBoxMargin: "-3px -3px 2px 2px",
          closeBoxURL: "assets/images/close.png",
          infoBoxClearance: new google.maps.Size(20,
            20),
          isHidden: false,
          pane: "floatPane",
          enableEventPropagation: true
        };
      }

      function enhanceMarker(marker) {
        marker.isMatched = function () {
          return marker.plant != null
            && marker.plant._id != null
        };



        marker.isFavorite = function () {
          if (Auth.isLoggedIn()) {
            if (Auth.getCurrentUser() && Auth.getCurrentUser().favoriteMarkers) {

              var found = false;
              Auth.getCurrentUser().likedMarkers.items.forEach(function (f) {
                if (marker._id == f.refid) {
                  found = true;
                }
              });
              return found;

            }

          }
          return false;
        };

        marker.isMyMarker = function () {
          return marker.isMine()
            || Auth.isAdmin();

        };

        marker.isMine = function () {
          return marker.owner._id == Auth.getCurrentUserId();
        };

        marker.getSpeciesName = function () {
          if (marker.isMatched()) {
            return marker.plant.name;
          }
          if (marker.plant_by_user != null) {
            return marker.plant_by_user;
          }
          return "unknown";
        };


        marker.getSpeciesFullNameOrNull = function () {
          if (marker.isMatched()) {
            var name = marker.plant.name;

            return name + " ("
              + marker.plant.scientificName + ")";
          }
          if (marker.plant_by_user != null) {
            return marker.plant_by_user;
          }

        };

        marker.getSpeciesFullName = function () {
          if (marker.getSpeciesFullNameOrNull()) {
            return marker.getSpeciesFullNameOrNull();
          }
          return "unknown";
        };

        marker.generaltitle = marker.getSpeciesFullName();

        if (marker.description == null
          || marker.description === "") {
          marker.description = "";
        }
        //had to refactor the pos at the server so need to hack this for a while
        var newpos = {
          latitude: marker.location.position[1],
          longitude: marker.location.position[0]
        }

        marker.location.position = newpos;

        UserUtils.refineUser(marker.owner);

        marker.myurl = 'tag/' + marker._id;

        if (marker.comments) {

          for (var j = 0; j < marker.comments.length; j++) {
            var comment = marker.comments[j];
            CommentUtils.refineComment(comment);
          }
        }

        if (marker.isMatched()) {
          if(marker.plant.commonNames &&marker. plant.commonNames.length >0){
            marker.plant.name = marker.plant.commonNames[0];
          }else{
            marker.plant.name = ''
          }
        } else {

          if (marker.plant_by_user != null) {
            marker.shortDescriptionString = wfUtils
              .getShorterVersion(marker.plant_by_user);
            marker.longerDescriptionString = wfUtils
              .getLongerVersion(marker.plant_by_user);
          } else {
            marker.shortDescriptionString = wfUtils
              .getShorterVersion(marker.description);
            marker.longerDescriptionString = wfUtils
              .getLongerVersion(marker.description);
          }
        }

        marker.shortVersionForFilter = wfUtils
          .getShorterVersion(marker.description);

        if (marker.owner.fullname != null
          && marker.owner.fullname !== '') {
          marker.mainUserId = marker.owner.fullname;
        } else {
          marker.mainUserId = marker.owner.username;
        }

        setMarkerIcon(marker);

        marker.getTitleString = function () {

          if (marker.isMatched()) {
            return marker.getSpeciesFullName();
          } else {
            return wfUtils
              .getShorterVersion(marker.description);
          }
        };

        marker.options = {
          title: marker.getTitleString
        };


        if (marker.images == null
          || marker.images.length === 0) {
          marker.images = wfUtils.getEmptyImagesElement(
          );

        }

        marker.images.forEach(function (image) {
          image.itemId = marker._id;
          image.user = marker.user;
          image.created = marker.created;
          image.description = marker.description;
        });

        wfUtils.enhanceWithImageMethods(marker);

        if (marker.verified == 1) {
          marker.verified = true;
        } else {
          marker.verified = false;
        }


        if (marker.active == 1) {
          marker.active = true;
        } else {
          marker.active = false;
        }

      }

      function setMarkerIcon(marker) {
        marker.icon = getMarkerImagePath(marker, "");

      }

    }])
;
