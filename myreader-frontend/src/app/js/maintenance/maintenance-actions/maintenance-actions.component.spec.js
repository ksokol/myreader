describe('src/app/js/maintenance/maintenance-actions/maintenance-actions.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../../shared/test-utils');

        var myNotificationPanel = testUtils.componentMock('myNotificationPanel');

        var scope, element, processingService, deferred;

        beforeEach(require('angular').mock.module('myreader', testUtils.mock('processingService')));

        beforeEach(inject(function ($rootScope, $compile, $q, _processingService_) {
            scope = $rootScope.$new();

            deferred = $q.defer();

            processingService = _processingService_;
            processingService.rebuildSearchIndex = jasmine.createSpy('processingService.rebuildSearchIndex()');
            processingService.rebuildSearchIndex.and.returnValue(deferred.promise);

            element = $compile('<my-maintenance-actions></my-maintenance-actions>')(scope);
            scope.$digest();
        }));

        it('should start indexing job when button clicked', function () {
            deferred.resolve();
            element.find('button')[0].click();
            scope.$digest();

            expect(processingService.rebuildSearchIndex).toHaveBeenCalledWith();
            expect(element.find('my-notification-panel').find('span')[0].innerText).toEqual('started');
        });

        it('should show error message when indexing job failed', function () {
            deferred.reject('expected error');
            element.find('button')[0].click();
            scope.$digest();

            expect(element.find('my-notification-panel').find('span')[0].innerText).toEqual('expected error');
        });

    });
});
