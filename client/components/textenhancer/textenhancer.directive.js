'use strict';
angular.module('wildfoodApp').directive(
    'enhanceLinks',
    [
        '$sce', 'wfUtils',
        function ($sce, wfUtils) {
            return {
                restrict: 'A',
                template: "<div ng-bind-html='text2'></div>",
                // template : "<div>{{text}}</div>",
                scope: {
                    text: '=',
                    source: '='
                },
                replace: true,
                link: function ($scope, element, attrs) {
                    var text = $scope.text;
                    var source = $scope.source;

                    // $scope.$watch('text', function(newVal, oldVal){
                    // // console.log(newVal);
                    //
                    // if (text) {
                    // $scope.text2 =
                    // $sce.trustAsHtml(getEnchancedString(text));
                    // }
                    // }, true);

                    if (text) {
                        $scope.text2 = $sce.trustAsHtml(wfUtils
                            .getEnchancedString(text));
                    }

                }
            };
        }]);
