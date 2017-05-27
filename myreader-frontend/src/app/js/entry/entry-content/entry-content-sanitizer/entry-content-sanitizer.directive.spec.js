describe('src/app/js/entry/entry-content/entry-content-sanitizer/entry-content-sanitizer.directive.spec.js', function() {

    var testUtils = require('../../../shared/test-utils');

    var safeOpenerService, element;

    beforeEach(require('angular').mock.module('myreader', testUtils.mock('safeOpenerService')));

    beforeEach(inject(function ($compile, $rootScope, $timeout, _safeOpenerService_) {
        safeOpenerService = _safeOpenerService_;
        safeOpenerService['openSafely']  = jasmine.createSpy('safeOpenerService.openSafely');

        element = $compile("<div my-entry-content-sanitizer><p><a href='http://url1/'></a></p><span><a href='http://url2/'></a></span></div>")($rootScope.$new());
        $timeout.flush(0);
    }));

    it('should delegate url1 to safeOpenerService', function () {
        element.find('a')[0].click();
        expect(safeOpenerService.openSafely).toHaveBeenCalledWith('http://url1/');
    });

    it('should delegate url2 to safeOpenerService', function () {
        element.find('a')[1].click();
        expect(safeOpenerService.openSafely).toHaveBeenCalledWith('http://url2/');
    });
});
