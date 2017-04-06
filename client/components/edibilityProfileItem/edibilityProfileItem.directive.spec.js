'use strict';

describe('Directive: edibilityProfileItem', function () {

  // load the directive's module and view
  beforeEach(module('wildfoodApp'));
  beforeEach(module('components/edibilityProfileItem/edibilityProfileItem.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<edibility-profile-item></edibility-profile-item>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the edibilityProfileItem directive');
  }));
});