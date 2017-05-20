describe('safeOpener', function() {

    var testUtils = require('../../test-utils');

    var windowAttributes;

    beforeEach(require('angular').mock.module('myreader', testUtils.mock('$window')));

    beforeEach(inject(function ($compile, $rootScope, $window) {
        $window.open = jasmine.createSpy('open');
        $window.open.and.returnValue(windowAttributes = {});

        var element = $compile("<div my-safe-opener url='http//example.com/feed'></div>")($rootScope);
        element[0].click();
    }));

    it('should remove opener', function () {
        expect(windowAttributes.opener).toBeNull();
    });

    it('should set location', function () {
        expect(windowAttributes.location).toBe('http//example.com/feed');
    });
});
