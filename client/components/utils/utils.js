'use strict';
angular.module('wildfoodApp.utils').service(
		'Utils',
		[ function() {

			function checkDefinedAndThrow(field, name) {
				if (field === undefined) {
					throw new Error(name + ' not defined');
				}
			}


			this.contains = function(str, substr) {

				checkDefinedAndThrow(str, 'str');
				checkDefinedAndThrow(substr, 'substr');

				if (str === "" || substr === "") {
					return false;
				}
				return str.indexOf(substr) >= 0;
			};

			this.startsWith = function(str, prefix) {
				checkDefinedAndThrow(str, 'str');
				checkDefinedAndThrow(prefix, 'prefix');
				if (str === "" || prefix === "") {
					return false;
				}

				return str.indexOf(prefix) === 0;
			};


			this.removeFromArrayIfExistsWithComparator = function(array, item,
					comparator) {

				if (array != null) {
					var index = -1;

					var c = 0;
					array.forEach(function(key) {
						if (comparator(key, item)) {
							index = c;
						}
						c++;
					});

					if (index > -1) {
						array.splice(index, 1);
					}
				}
			};

			this.removeFromArrayIfExists = function(array, item) {
				if (array != null) {
					var index = array.indexOf(item);

					if (index > -1) {
						array.splice(index, 1);
					}
				}
			}

			this.stringNotEmpty = function(value) {
				return isStringNotEmpty(value);
			};

			this.stringEmpty = function(value) {
				return !isStringNotEmpty(value);
			};

			this.isEmpty = function(value) {
				return value == null;
			};

			this.isNotEmpty = function(value) {
				return value != null;
			};

			function isStringNotEmpty(value) {
				return value != null && value !== "";
			}



			this.applyToScope = function($scope) {
				if ($scope.$root !=null &&$scope.$root.$$phase != '$apply'
						&& $scope.$root.$$phase != '$digest') {
					$scope.$apply();
				}
			}

			this.$digestToScope = function($scope) {
				if ($scope.$root !=null &&$scope.$root.$$phase != '$apply'
						&& $scope.$root.$$phase != '$digest') {
					$scope.$digest();
				}
			}

		} ]);
