'use strict';

describe('Service: GroupService', function () {

    // load the service's module
    beforeEach(module('myApp'));

    // instantiate service
    var GroupService;
    beforeEach(inject(function (_GroupService_) {
	GroupService = _GroupService_;
    }));

    it('should do something', function () {
	expect(!!GroupService).toBe(true);
    });

});
