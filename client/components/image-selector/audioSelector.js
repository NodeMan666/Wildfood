'use strict';
angular.module('wildfoodApp.imageSelector',
		[ 'wildfoodApp.utils', 'angularFileUpload' ]).directive(
		'audioSelector',
		[
				'ImageUtils',
				function(ImageUtils) {
					return {
						restrict : 'AE',
						scope : {
							model : '=audioSelector',
							alerts : '=audioSelectorAlerts',
							ngDisabled : '=',
							isSingle : '=',
							title : '=audioSelectorTitle'

						},
						templateUrl : 'components/image-selector/audioSelector.tpl.html',
						link : function(scope, elem) {

							scope.allFiles = [];

							if (scope.model != null) {
							//	allFiles.push(scope.model);
							}

							scope.onFileSelectSingle = function(files) {

								if (scope.isSingle) {
									scope.allFiles = [];
								}
								scope.allFiles
										.push(ImageUtils.onFileSelectSingle(
												files, scope.alerts));
								updateModel();
							};

							function updateModel() {
								if (scope.allFiles.length > 0) {
									scope.model = scope.allFiles[0];
								} else {
									scope.model = null;
								}
							}

							scope.deleteItem = function(item) {
								var index = scope.allFiles.indexOf(item);
								scope.allFiles.splice(index, 1);
								updateModel();
							};

						}
					}
				} ]);
