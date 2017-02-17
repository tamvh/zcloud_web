'use strict';

describe('Controller: SubmitmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('myAppApp'));

  var SubmitmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SubmitmodalCtrl = $controller('SubmitmodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
