'use strict';
angular.module('wildfoodApp')
    .controller('FeedbackCtrl', function ($scope) {

    });

angular.module('wildfoodApp').service('Feedback',
    ['$modal', '$cookies', function ($modal, $cookies) {

        this.show = function show() {

            var modalInstance = $modal.open({
                templateUrl: 'app/feedback/feedback.html',
                backdrop: true,
                keyboard: true,
                controller: ViewItemModalInstanceCtrl,
                resolve: {

                }
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        };

        var ViewItemModalInstanceCtrl = function ($scope, $modalInstance, RemoteService) {

            $scope.item = {
                app :"wildfood.me"
            };
            $scope.types = ['Feedback', 'Contact', 'Support'];

            $scope.submitFeedback = function () {
                RemoteService.post('feedback', $scope.item)
                    .then(
                    function (item) {
                        $modalInstance.dismiss('cancel');
                    },function(err){
                        console.log(err);
                        $modalInstance.dismiss('cancel');
                    });

            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

    }]);
