'use strict';

describe('Service: ServiceConfig', function () {

    // load the service's module
    beforeEach(module('myApp'));

    // instantiate service
    var ServiceConfig;
    beforeEach(inject(function (_ServiceConfig_) {
	ServiceConfig = _ServiceConfig_;
    }));

    it('should do something', function () {
	expect(!!ServiceConfig).toBe(true);
    });

});
