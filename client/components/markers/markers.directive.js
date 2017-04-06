'use strict';
angular.module('wildfoodApp').directive('favoriteItem', function () {
  return {
    restrict: 'AE',
    scope: {
      item: '=favoriteItem'
    },
    template: '<span class="isFavoriteIcon favorited squarefavorite"><i class="fa fa-heart fa-lg fa-lg" ng-show="item.isFavorite()" ' +
    ' tooltip=This tag has been liked"></i></span>',
    link: function ($scope, element, attrs) {


    }
  };
});

angular.module('wildfoodApp').directive('markerSourceIcon', function () {
  return {
    restrict: 'AE',
    scope: {
      marker: '=markerSourceIcon'
    },
    template: '<img ng-src="{{marker.getSourceImage()}}" class="myMarkerSource" ng-show="marker.source==\'wildfoodmap\'"  tooltip="Originating from wildfoodmap app">' +
    '<i class="fa myMarkerSource"  tooltip="Originating from {{marker.source}}" ng-class="{\'fa-twitter\': marker.source==\'twitter\',\'fa-facebook-square\': marker.source==\'facebook\',\'fa-instagram\': marker.source==\'instagram\'}"  ng-show="marker.source!=\'wildfoodmap\'"></i>',
    link: function ($scope, element, attrs) {


    }
  };
});


angular.module('wildfoodApp').directive('markerShortTitle', function () {
  return {
    restrict: 'AE',
    scope: {
      marker: '=markerShortTitle'
    },
    template: '<p class="markersquaretext"conditional-tooltip15="{{marker.description}}">{{marker.description|ellipsis:15}}</p>',
    link: function ($scope, element, attrs) {


    }
  };
});


angular.module('wildfoodApp').directive('markerShortLocation', function ($filter) {
  return {
    restrict: 'AE',
    scope: {
      marker: '=markerShortLocation'
    },
    template: '<p class="markersquaretext" tooltip-placement="right" tooltip="{{getMarkerLocationAndTime(marker)}}">' +
    '{{ marker.location.address.formatted_short |ellipsis:15}}</p>',
    link: function ($scope, element, attrs) {
      $scope.getMarkerLocationAndTime = function (marker) {
        var date = $filter('datenotime')(marker.created);
        if (marker.location.address != null && marker.location.address.formatted_short != null) {
          return marker.location.address.formatted_short + ", " + date;
        } else {
          return "unknown location, " + date;
        }

      }
    }
  };
});

angular.module('wildfoodApp').directive('markerLongLocation', function () {
  return {
    restrict: 'AE',
    scope: {
      item: '=markerLongLocation'
    },
    template: '<p ng-show="item.location.address!=null && item.location.address.formatted_short!=null" class="location">' +
    '<i class="fa fa-dot-circle-o fa-lg"></i> {{item.location.address.formatted_short}}</p>',
    link: function ($scope, element, attrs) {
        //console.log("test");
        //console.log($scope.item);

    }
  };
});

angular.module('wildfoodApp').directive('markerThumb', function () {
  return {
    restrict: 'AE',
    scope: {
      marker: '=markerThumb'
    },
    template: '   <p class="thumbnail markerWindow">' +
    '<img ng-src="{{marker.getImageThumbUrl()}}" class="roundedImage" tooltip="Created by {{marker.owner.formatted_name}}">' +
    '</p>',
    link: function ($scope, element, attrs) {
    }
  };
});
