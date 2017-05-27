describe('src/app/js/shared/safe-opener/safe-opener.service.spec.js', function() {

    var testUtils = require('../test-utils');

    var windowAttributes, safeOpenerService;

    beforeEach(require('angular').mock.module('myreader', testUtils.mock('$window')));

    beforeEach(inject(function ($window, _safeOpenerService_) {
        $window.open = jasmine.createSpy('open');
        $window.open.and.returnValue(windowAttributes = {});
        safeOpenerService = _safeOpenerService_;
    }));

    it('should remove opener', function () {
        safeOpenerService.openSafely('http://example.com/feed');
        expect(windowAttributes.opener).toBeNull();
    });

    it('should set location', function () {
        safeOpenerService.openSafely('http://example.com/feed');
        expect(windowAttributes.location).toBe('http://example.com/feed');
    });
});
