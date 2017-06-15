describe('src/app/js/settings/settings.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../shared/test-utils');

        var scope, element, settingsService;

        beforeEach(require('angular').mock.module('myreader', testUtils.mock('settingsService')));

        beforeEach(inject(function ($rootScope, $compile, _settingsService_) {
            scope = $rootScope.$new();
            settingsService = _settingsService_;

            settingsService.getPageSize = function () { return 20; };
            settingsService.isShowUnseenEntries = function () { return false; };
            settingsService.isShowEntryDetails = function () { return true; };

            settingsService.setPageSize = jasmine.createSpy('settingsService.setPageSize()');
            settingsService.setShowUnseenEntries = jasmine.createSpy('settingsService.setShowUnseenEntries()');
            settingsService.setShowEntryDetails = jasmine.createSpy('settingsService.setShowEntryDetails()');

            element = $compile('<my-settings></my-settings>')(scope);
            scope.$digest();
        }));

        it('should render setting values', function () {
            expect(element.find('md-option')[1].selected).toBe(true);
            expect(element.find('md-option')[1].innerText).toBe('20');

            expect(element.find('md-checkbox')[0].classList).not.toContain('md-checked');
            expect(element.find('md-checkbox')[1].classList).toContain('md-checked');
        });

        it('should update pageSize setting', function () {
            element.find('md-select').triggerHandler('click');
            scope.$digest();

            var select = angular.element(angular.element(document).find('md-select-menu'));
            select.find('md-option')[2].click();
            scope.$digest();

            expect(select.find('md-option')[2].selected).toBe(true);
            expect(select.find('md-option')[2].innerText).toContain('30');
            expect(settingsService.setPageSize).toHaveBeenCalledWith(30);
        });

        it('should update showUnseenEntries setting', function () {
            element.find('md-checkbox')[0].click();
            expect(element.find('md-checkbox')[0].classList).toContain('md-checked');
            expect(settingsService.setShowUnseenEntries).toHaveBeenCalledWith(true);
        });

        it('should update showEntryDetails setting', function () {
            element.find('md-checkbox')[1].click();
            expect(element.find('md-checkbox')[1].classList).not.toContain('md-checked');
            expect(settingsService.setShowEntryDetails).toHaveBeenCalledWith(false);
        });
    });
});
