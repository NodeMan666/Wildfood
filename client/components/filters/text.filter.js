'use strict';
angular.module('wildfoodApp.filters').filter('shortVersion',
  [ 'wfUtils', function(wfUtils) {
    return function(input) {
      return wfUtils.getShorterVersion(input);
    };
  } ]);

angular.module('wildfoodApp.filters').filter('ellipsis', function() {
  return function(input, param) {
    if (input == null) {
      return "";
    }
    var n = param;
    if (input.length > n) {
      return input.substring(0, n) + "..";
    }
    return input;
  };
});

angular.module('wildfoodApp.filters').filter('ellipsis', function() {
  return function(input,param) {
    if (input == null) {
      return "";
    }
    var n = param;
    if (input.length > n) {
      return input.substring(0, n) + "..";
    }
    return input;
  };
});

angular.module('wildfoodApp.filters').filter('clean', function() {
  return function(string) {
    return (string) ? string.replace("_", " ") : null;
  };
});

angular.module('wildfoodApp.filters').filter('clean', function() {
  return function(string) {
    return (string) ? string.replace("_", " ") : null;
  };
});

angular.module('wildfoodApp.filters').filter('shortVersionForFilter',
  function() {
    return function(input) {
      if (input == null) {
        return "";
      }
      var n = 50;
      if (input.length > n) {

        // if(input.indexOf(" ")>0){}

        return input.substring(0, n) + "...";
      }
      return input;
    };
  });

angular.module('wildfoodApp.filters').filter('popupShortDescription',
  [ 'Utils', function(Utils) {
    return function(input) {
      return cutSentence(input);
    };
  } ]);

angular.module('wildfoodApp.filters').filter(
  'cutLongestWords',
  function() {
    return function(input) {

      var howmany = 50;
      if (input != null && input !== '') {
        var array = input.split(' ');

        var len = array.length;

        for (var i = 0; i < len; i++) {
          var a = array[i];

          if (a.length > howmany) {
            a = a.substring(0, howmany) + " "
            + a.substring(howmany, a.length);

            array[i] = a;
          }
        }

        var strFix = array.join(" ");

        return strFix;
      }
      return '';
    };
  });

angular.module('wildfoodApp.filters').filter('longerVersion',
  [ 'wfUtils', function(wfUtils) {
    return function(input) {
      return wfUtils.getLongerVersion(input);
    };
  } ]);

angular.module('wildfoodApp.filters').filter('enhanceLinks',
  [ 'wfUtils', function(wfUtils) {
    return function(input) {
      return wfUtils.getEnchancedString(input);
    };
  } ]);

angular.module('wildfoodApp.filters')
  .filter('joinBy', function () {
    return function (input,delimiter, property) {
      var input = (input || []);
      var str =[];
      if(property){
        input.forEach(function(item){
          if(item[property]) {
            str.push(item[property]);
          }
        });
      }else{
        str = input;
      }
     var result =  str.join(delimiter || ',');
      return result ;
    };
  });
