'use strict';
angular
    .module('wildfoodApp')
    .service(
    'AddMarkersService',
    [

        'Cache',
        '$q',
        'UserService',
        'MarkerUtils',
        'RemoteService', 'wfUtils',
        function (Cache, $q, UserService, MarkerUtils, RemoteService, wfUtils) {

            function createPostParams(marker, image) {

                var data = _.pick(marker,  ['plant', 'plant_by_user', 'plant_unknown', 'description', 'source', 'location',
                  'images', 'access', 'tags', 'permanencyType', 'source_id', 'source_link']);

                if (image != null && image.versions) {
                    data.images = [wfUtils.pickImageProperties(image)];
                }
                console.log(data.images);

                data.location.position = [marker.location.position.longitude, marker.location.position.latitude];
                return data;
            }


            return {

                getEmptyNewMarker: function () {

                    return {
                        "source": "web",
                        "location": {
                            "address": {},
                            position: {
                                "latitude": "",
                                "longitude": ""
                            }
                        }
                    };
                },

                addMarker: function (marker, image) {

                    var deferred = $q.defer();
                    var data2 = createPostParams(marker, image);

                    RemoteService.post('marker', data2)
                        .then(
                        function (item) {
                            Cache.put(item);
                            deferred.resolve(item);
                        });

                    return deferred.promise;

                },
                editMarker: function (marker, image) {
                    var deferred = $q.defer();

                    var data2 = createPostParams(marker, image);

                    console.log(data2);

                    RemoteService
                        .put('marker/' + marker._id, data2).then(
                        function (item) {
                            Cache.remove(item);
                            Cache.put(item);
                            deferred.resolve(item);
                        });
                    return deferred.promise;
                }


            }
        }
    ])
;
