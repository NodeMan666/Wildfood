'use strict';

describe('Directive: listedit', function () {


  beforeEach(module('wildfoodApp'));
  beforeEach(module('components/stringarrayedit/listedit.html'));
  beforeEach(module('components/stringarrayedit/test.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope,$templateCache) {
    scope = $rootScope.$new();

  }));


  it('Test simple', inject(function ($compile,$templateCache) {

    scope.notes = [];
    element = angular.element(' <span list-edit="\'components/stringarrayedit/test.html\'" ng-model="notes"/>');
    element = $compile(element)(scope);
    scope.$apply();

   // console.log(element);
    assert.equal(element.text().trim(), "add new");
  }));

  it('Test simple', inject(function ($compile,$templateCache) {

    scope.notes = [{text:"aaa"}];
    element = angular.element(' <span list-edit="\'components/stringarrayedit/test.html\'" ng-model="notes"/>');
    element = $compile(element)(scope);
    scope.$apply();

   // console.log(element);
    //assert.equal(element.text().trim(), "add new");
  }));

});
