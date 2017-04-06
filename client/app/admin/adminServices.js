'use strict';
angular
		.module('wildfoodApp')
		.factory(
				'AdminService',
				[
						'$http',
						'$upload',
						'MarkersService',
						'$filter',
						'RemoteService',
						'PlantUtils',
						'$q',
						'wfUtils',
						'Utils', 'UserService',
						function($http, $upload, MarkersService, $filter,
								RemoteService, PlantUtils, $q, wfUtils, Utils,UserService ) {

							function deleteItem(array, serviceName) {
								if (array != null && array.length > 0) {
									array
											.forEach(function(tag) {

												if (tag.id != null) {
													RemoteService
															.post(
																	serviceName,
																	{
																		id : tag.id

																	})
															.then(
																	function(
																			data) {
																		console
																				.log("returned  "
																						+ serviceName
																						+ " :"
																						+ data);

																	});
												}

											});
								}

							}

							function addItems(array, serviceName, propertyname,
									plantid, returnid) {
								if (array != null && array.length > 0) {
									array
											.forEach(function(tag) {

												if (tag.id == null
														&& tag[propertyname] != null) {

													var item = {
														plant_id : plantid
													}
													item[propertyname] = tag[propertyname];

													RemoteService
															.post(serviceName,
																	item)
															.then(
																	function(
																			data) {

																		tag.id = data[returnid];
																		console
																				.log("returned  "
																						+ serviceName
																						+ " :"
																						+ data);
																	});
												}

											});
								}

							}

							function addImages(array, plant) {
								if (array != null && array.length > 0) {
									array
											.forEach(function(tag) {

												if (tag.id == null) {

													var item = {
														plant_id : plant.id
													}

													RemoteService
															.postWithFile(
																	'addPlantImage.php',
																	item, tag)
															.then(
																	function(
																			result) {
																		console
																				.log("returned  addPlantImage"
																						+ " :"
																						+ result);


																		plant.images = result.images;

																	});
												}

											});
								}

							}

							return {
								addNewSpecies : function(plant, images) {
									console.log(plant);
									var deferred = $q.defer();
									var image = images[0];

                  plant.owner = UserService
                    .getUserId()

									RemoteService
											.postWithFile('addPlant.php',
													plant, image)
											.then(
													function(data) {
														console
																.log("returned: "
																		+ data);
														var resultItem = PlantUtils
																.updateNewPlantFromResult(
																		plant,
																		data);

														if (images.length > 1) {

															addImages(images,
																	plant.id);

														}
														addItems(
																plant.marker_tags,
																'addPlantMarkerTag.php',
																'tag',
																plant.id,
																'tag_id');

														addItems(
																plant.alternative_names,
																'addPlantAlternativeName.php',
																'name',
																plant.id,
																'name_id');

														deferred
																.resolve(resultItem);

													});

									return deferred.promise;
								},

								editSpecies : function(plant, images) {
									console.log(plant);
									var deferred = $q.defer();

                  plant.owner = UserService
                    .getUserId();

									addItems(plant.marker_tags,
											'addPlantMarkerTag.php', 'tag',
											plant.id, 'tag_id');

									addItems(plant.alternative_names,
											'addPlantAlternativeName.php',
											'name', plant.id, 'name_id');

									deleteItem(plant.to_delete_tags,
											'deletePlantMarkerTag.php');
									deleteItem(plant.to_delete_names,
											'deletePlantAlternativeName.php');

									plant.to_delete_tags = [];
									plant.to_delete_names = [];

									deleteItem(plant.deletedImages,
											'deleteImage.php');

									if (plant.deletedImages) {
										plant.deletedImages
												.forEach(function(tag) {
													Utils
															.removeFromArrayIfExistsWithComparator(
																	plant.images,
																	tag,
																	function(
																			item1,
																			item2) {
																		return item1.id == item2.id;
																	});

												});
									}

									plant.deletedImages = [];

									addImages(images, plant);

									RemoteService
											.postWithFile('editPlant.php',
													plant)
											.then(
													function(data) {
														console
																.log("returned: "
																		+ data);
														var resultItem = PlantUtils
																.updateEditedPlantFromResult(
																		plant,
																		data);
														deferred
																.resolve(resultItem);

													});

									return deferred.promise;

								},
								deletePlant : function(plant) {
									console.log(plant);

									return RemoteService.postWithFile(
											'deletePlant.php', {
												id : plant.id
											});

								},

								lookupTag : function(tag) {
									console.log(tag);

									return RemoteService.postWithFile(
											'lookupPlantTag.php', {
												id : tag
											});

								},

								editMarker : function(marker) {

									console.log("edit sent " + marker.plant_id
											+ ", active:" + marker.active
											+ ",processed: " + marker.verified);

									if (marker.verified === undefined) {
										marker.verified = false;
									}

									if (marker.plant_id == null) {
										marker.plant_id = "unknown";
									}

									var o = {
										id : marker.id,
										active : marker.active,
										verified : marker.verified,
										plant : marker.plant_id,
                    unknown : marker.unknown
									};

									return RemoteService.post(
											'adminMarker.php', o);

								}

							};

						} ]);
