'use strict';
angular.module('wildfoodApp.utils').service('Cache',
		[ 'MarkerUtils', function(MarkerUtils) {

			var maxSize = 200;

			var markerCache = {};

			function clearByLocation() {
				// this is not working yet!!!
				// get Current location from current location
				// service
				var howmanytoclean = maxSize - getCacheLength() + 1;

				var items = Object.keys(markerCache);

				Object.keys(markerCache).forEach(function(key) {

				});

				var cleanIndex = 0;
				for (var i = 0; i < items; i++) {

					if (cleanIndex > howmanytoclean) {
						break;
					}
					var item = items[i];

					// markerCache[markerCache] = undefined;

					delete markerCache.item;

					cleanIndex++;
				}

			}

			function checkSizeAndClear() {
				if (getCacheLength() >= maxSize) {
					clearByLocation();
				}

			}

			function putMarker2(marker) {
				// checkSizeAndClear();

				if (!markerCache[marker._id]) {
          MarkerUtils.enhanceMarker(marker);

					markerCache[marker._id] = marker;

					return marker;
				} else {
					return markerCache[marker._id];
				}

			}

			function getCacheLength() {
				return Object.keys(markerCache).length;
			}

			this.get = function(id) {
				var itemFromCache = markerCache[id];
				return itemFromCache;
			};

			this.put = function(marker) {
				return putMarker2(marker);
			};

			this.remove = function(marker) {
				markerCache[marker._id] = undefined;
			};

			this.putAll = function(markers) {
				var result = [];
				markers.forEach(function(marker) {
					result.push(putMarker2(marker));
				});
				return result;
			};

			this.getSize = function() {
				return getCacheLength();
			};

			this.setMaxSize = function(size) {
				maxSize = size;
			};

		} ]);
