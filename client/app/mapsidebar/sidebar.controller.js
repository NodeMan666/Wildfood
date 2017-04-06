'use strict';
angular
  .module('wildfoodApp')
  .controller(
  'SidebarCtrl',
  [
    '$scope',
    'MarkersService',
    'ImageViewer',

    'LoginUIService',
    '$timeout',
    'CommentService',
    'UserService',
    '$q', '$rootScope','GoogleMaps', 'MarkersSearchService','$window', '$location',

    function ($scope, MarkersService, ImageViewer,
              LoginUIService, $timeout,
              CommentService, UserService, $q,$rootScope,GoogleMaps,MarkersSearchService,$window,$location ) {

      $scope.fieldnotesopen = true;
      $scope.openComments = true;

      $scope.share = function(item, type) {
        console.log("share")

        var url ='http://'+$location.host() +"/" + item.myurl;

        if(type=='facebook') {
          FB.ui({
            method: 'share',
            href: url
          });
        }else if (type=='twitter'){
          var text = "Wildfoodmap"
          var user = "wildfoodmap"

          var url = "https://twitter.com/intent/tweet" +
            "?original_referer=" + url +
            "&text=" + text+
            "&tw_p=tweetbutton" +
            "&url=" +url+
            "&via=" + user;
          $window.open(url)
        }else if (type=='instagram'){
        }

      };
      //$scope.share = function (marker) {
      //  //ShareUIService.showModal(marker);
      //};
      $scope.discover = function() {
        $scope.showDiscover =true;
        $scope.$parent.discover();

      };



      $scope.userClicked = function ($item) {
        if($item && $item.owner) {
          console.log("sidebar clicked ",  $item.owner);
          $scope.$parent.showMarkersByUser($item.owner._id);

        }
      };

      $scope.goToPlant = function (marker) {
          if(marker.isMatched()){
       //     $scope.$parent.showPage('plants');
           // $scope.$parent.showPlantItem(marker.species);
            $scope.$parent.showSpeciesItems(marker.plant._id);
          }
      };

      $scope.showOthers = function (marker) {

        $rootScope
          .$broadcast("showSpeciesItems",
          marker.plant._id);
      };




      $scope.editItem = function (marker) {
        $scope.$parent.editItem(marker);
      };


      $scope.showLargerMarkerImage = function (item,
                                               imageitem) {
        var others = null;
        imageitem.source = item;
        if (item.isMatched()) {
          var deferred = $q.defer();
          MarkersSearchService.getAllMarkersForSpecies(
            item.plant._id).then(
            function (othermarkers) {
              var result = [];
              othermarkers.forEach(function (other) {
                if (other._id != item._id) {
                  var imageitem = other.getImage();
                  imageitem.source = other;
                  result.push(imageitem);
                }
              });
              deferred.resolve(result);

            });
          others = deferred;
        }

        ImageViewer.openViewer(imageitem, others,
          $scope.item, openImageViewerCallBack);
      };

      $scope.showLargerImage = function (item, image) {
        var otherImages = $q.defer();

        MarkersSearchService.getAllMarkersForSpecies(
          item.plant._id).then(
          function (othermarkers) {
            var result = [];
            othermarkers
              .forEach(function (other) {
                result.push(other
                  .getImage());
              });
            otherImages.resolve(result);
          });

        ImageViewer.openViewer(image, otherImages,
          $scope.item, openImageViewerCallBack);
      };

      function openImageViewerCallBack(selectedImage) {
        if (selectedImage != null) {
          MarkersService
            .getMarker(selectedImage.itemId)
            .then(
            function (selectedMarker) {

              //$scope.$parent
              //		.showSingleTargetMarker(selectedMarker);

              $rootScope
                .$broadcast("showOneMarker",
                selectedMarker);
            });

        }
      }

    }]);
