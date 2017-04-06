'use strict';
angular.module('wildfoodApp').factory('Navigation',
		[ '$resource', '$rootScope', function($resource, $rootScope) {

			return {
				location : '',
				path : '',

				showPage : function(path) {
					this.path = path;
					if (path == 'add') {
						this.location = 'app/addmarker/addMarker.html';
					} else if (path == 'plants') {
						this.location = 'app/plants/plants.html';
          } else if (path == 'browse') {
            this.location = 'app/browse/browse.html';
					} else {
						this.location = 'app/map/main_map.html';
					}

				},

				isMyPage : function(path) {
					return (this.path === path);
				},
				setMap : function() {
					this.path = 'map';
				}

			}
		} ]);
