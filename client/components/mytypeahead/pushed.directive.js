'use strict';
angular.module('wildfoodApp').directive('typeaheadExtra', function () {
  return {
    restrict: 'AE',
    scope: {
      matches: '=typeaheadExtra',
      query: '=',
      position: '=',
      select: '&'

    },
    replace: true,
    templateUrl: 'components/mytypeahead/pushed_typeahead.tmp.html',
    link: function (scope, element, attrs) {

      scope.templateUrl = attrs.templateUrl;

      scope.isOpen = function () {
        return scope.matches!=null && scope.matches.length > 0;
      };

      scope.isActive = function (matchIdx) {
        return scope.active == matchIdx;
      };

      scope.selectActive = function (matchIdx) {
        scope.active = matchIdx;
      };

      scope.selectMatch = function (activeIdx) {

        var sel = scope.matches[activeIdx];

        scope.select({
          $item: sel.model
        });
      };
    }
  };
});


angular.module('wildfoodApp').filter('typeaheadHighlight', function() {

  function escapeRegexp(queryToEscape) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }

  return function(matchItem, query) {
    return query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
  };
});



angular.module('wildfoodApp').directive('typeaheadExtraItem', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
  return {
    restrict: 'AE',
    scope: {
      index: '=',
      match: '=',
      query: '='
    },
    replace: true,
    templateUrl: 'components/mytypeahead/pushed_typeahead_item.tmp.html',
    link: function (scope, element, attrs) {

      var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
      $http.get(tplUrl, {cache: $templateCache}).success(function (tplContent) {
        element.replaceWith($compile(tplContent.trim())(scope));
      });
    }
  };
}]);
