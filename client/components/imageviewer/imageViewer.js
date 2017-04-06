'use strict';
angular
		.module('wildfoodApp')
		.service(
				'ImageViewer',
				[
						'$modal',
						function($modal) {
							this.openViewer = function(image, images,
									currentItem, returnFunction) {

								var modalInstance = $modal.open({
									templateUrl : 'components/imageviewer/template_imageViewer.html',
									controller : EditItemModalInstanceCtrl,
									windowClass : 'imageVIewerDialog',
									resolve : {
										image : function() {
											return image;
										},
										images : function() {
											return images;
										},
										currentItem : function() {
											return currentItem;
										}
									}
								});
								modalInstance.result.then(function(item) {

									var test = null;
									if (returnFunction) {
										returnFunction(item)
									}
								}, function() {
								});
							}

							var EditItemModalInstanceCtrl = function($scope,
									$modalInstance, image, images, currentItem) {
								var allimages = [];

								var otherimages = images;
								$scope.slides = allimages;
								allimages.push(image);
								image.active = true;
								image.showEntryLink = true;
								if (otherimages != null) {

									otherimages.promise
											.then(function(images) {
												angular
														.forEach(
																images,
																function(
																		eachimg,
																		pos) {
																	if (isSame(
																			image,
																			eachimg)) {
																		eachimg.active = true;
																	} else {
																		eachimg.active = false;
																	}
																	allimages
																			.push(eachimg);
																	if (currentItem) {
																		if (currentItem._id == eachimg.itemId
																				|| !eachimg.itemId) {
																			eachimg.showEntryLink = true;
																		} else {
																			eachimg.showEntryLink = true;
																		}
																	} else {
																		if (eachimg.itemId) {
																			eachimg.showEntryLink = true;
																		}
																	}
																});

											});

									$scope.onchange = function($index) {
										$scope.item = allimages[$index];
									};
								} else {
									image.originallyactive = true;

								}
								$scope.openEntry = function(selectedItem) {
									$modalInstance.close(selectedItem);
								};

								$scope.ok = function() {
									$modalInstance.close();
								};

								function isSame(image, eachimg) {
									if (image.itemId) {
										return image.itemId == eachimg.itemId;
									} else {
										return image.versions.low.url == eachimg.versions.low.url;
									}
								}
							};

						} ]);
