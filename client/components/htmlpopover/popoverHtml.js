angular.module('wildfoodApp')
    .directive( 'popoverHtmlPopup', ['$sce','$templateCache','$compile',function ($sce,$templateCache,$compile) {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@',
                content: '@',
                placement: '@',
                animation: '&',
                isOpen: '&',
                item: '='
            },
            templateUrl: 'components/htmlpopover/popover-html.tpl.html',
            link: function(scope,elem,attrs) {
                var templateName = scope.content;
                var templateContent = $templateCache.get(templateName);
                var compileScope = scope.$parent;
                compileScope.item = scope.$parent.$parent.item
                var compiled = $compile(templateContent)(compileScope);
                compileScope.$digest();
                scope.trustedContent = $sce.trustAsHtml(compiled.html());

                scope.hide = function(){
                    compileScope.tt_isOpen = false;
                    elem.hide();
                }
            }
        };
    }])
    .directive( 'popoverHtml', ['$tooltip',  function ( $tooltip ) {
        return $tooltip( 'popoverHtml', 'popover', 'click' );
    }])
