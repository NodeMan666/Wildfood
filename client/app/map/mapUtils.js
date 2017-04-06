'use strict';
angular.module('wildfoodApp.utils').service(
		'MapUtils',
		[ function() {

			function calculateDistanceFactor(marker, map) {
				var markerLat = Math.abs(Math.abs(marker.location.position.latitude)
						- Math.abs(map.getCenter().lat()));
				var markerLong = Math.abs(Math.abs(marker.location.position.longitude)
						- Math.abs(map.getCenter().lng()));

				return markerLat + markerLong;
			}

			function isInViewPort(marker, map) {
				var latlong = new google.maps.LatLng(marker.location.position.latitude,
						marker.location.position.longitude);

				return map.getBounds().contains(latlong);
			}
			function isCloser(marker, closestMarker, map) {

				var currentFactor = calculateDistanceFactor(closestMarker, map);
				var markerFactor = calculateDistanceFactor(marker, map);

				return markerFactor < currentFactor;
			}

			function setCurrentMapRelationProperties(marker, map) {
				if (isInViewPort(marker, map)) {
					marker.isOnMap = true;
				} else {
					marker.isOnMap = false;
				}

				var factor = calculateDistanceFactor(marker, map);

				if (marker.isOnMap) {
					marker.closenessToCenter = "close";
				} else {
					if (factor < 0.1) {
						marker.closenessToCenter = "close";
					} else if (factor < 1) {
						marker.closenessToCenter = "fairlyclose";
					} else {
						marker.closenessToCenter = "far";
					}

				}
			}
			function setMapStyles(map) {

				map.set('styles', [

				{
					featureType : 'road',
					elementType : 'geometry',
					stylers : [ {
						color : '#ffffff'
					}, {
						weight : 0.5
					} ]
				}, {
					featureType : 'water',
					elementType : 'geometry',
					stylers : [ {
						color : '#81C9EA'
					}, {
						weight : 0.5
					} ]
				}, {
					featureType : 'landscape.natural.landcover',
					elementType : 'geometry',
					stylers : [ {
						color : '#B9DB9A'
					}, {
						weight : 0.5
					} ]
				} ]);
			}

			this.setCurrentMapRelationProperties = function(marker, map) {
				return setCurrentMapRelationProperties(marker, map);
			};

			this.isCloser = function(marker, closestMarker, map) {
				return isCloser(marker, closestMarker, map);
			};

			this.calculateDistanceFactor = function(marker, map) {
				return calculateDistanceFactor(marker, map);
			};

			this.setMapStyles = function(map) {
				return setMapStyles(map);
			};
		} ]);
