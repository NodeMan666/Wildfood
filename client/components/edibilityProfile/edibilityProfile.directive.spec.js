'use strict';

describe('Directive: edibilityProfile', function () {

  // load the directive's module and view
  beforeEach(module('wildfoodApp'));
  beforeEach(module('components/edibilityProfile/edibilityProfile.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<edibility-profile></edibility-profile>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the edibilityProfile directive');
  }));
});
