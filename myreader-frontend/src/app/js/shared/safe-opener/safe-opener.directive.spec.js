describe('src/app/js/shared/safe-opener/safe-opener.directive.spec.js', function() {

    var testUtils = require('../test-utils');

    var safeOpenerService;

    beforeEach(require('angular').mock.module('myreader', testUtils.mock('safeOpenerService')));

    beforeEach(inject(function ($compile, $rootScope, _safeOpenerService_) {
        safeOpenerService = _safeOpenerService_;
        safeOpenerService['openSafely']  = jasmine.createSpy('safeOpenerService.openSafely');

        var element = $compile("<div my-safe-opener url='http//example.com/feed'></div>")($rootScope);
        element[0].click();
    }));

    it('should delegate to safeOpenerService', function () {
        expect(safeOpenerService.openSafely).toHaveBeenCalledWith('http//example.com/feed');
    });

});
