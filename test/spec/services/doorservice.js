'use strict';

describe('Service: DoorService', function () {

    // load the service's module
    beforeEach(module('myApp'));

    // instantiate service
    var DoorService;
    beforeEach(inject(function (_DoorService_) {
	DoorService = _DoorService_;
    }));

    it('should do something', function () {
	expect(!!DoorService).toBe(true);
    });

});
