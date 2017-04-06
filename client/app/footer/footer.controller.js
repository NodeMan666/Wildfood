'use strict';
angular.module('wildfoodApp').controller(
    'FooterCtrl',
    [
        '$scope',
        'MarkersService',
        '$modal',
        '$cookies',
        'Displaimer',
        'About',
        '$window', 'Intro', 'Feedback',
        function ($scope, MarkersService, $modal, $cookies, Displaimer, About, $window, Intro,Feedback) {

            $scope.showDisclaimer = function () {
                Displaimer.show();
            };

            $scope.showIntro = function () {
                Intro.show();
            };

            $scope.showAbout = function () {
                About.show();
            };

            $scope.showFeedback = function () {
                Feedback.show();
            };

        } ]);






