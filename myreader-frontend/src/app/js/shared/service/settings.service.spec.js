describe('src/app/js/shared/service/settings.service.spec.js', function() {

    beforeEach(require('angular').mock.module('myreader'));

    afterEach(function () {
        localStorage.clear();
    });

    describe('settings service', function () {

        let service;

        beforeEach(inject(function (settingsService) {
            service = settingsService;
            localStorage.clear();
        }));

        it('should return default pageSize equal to 10', function() {
            expect(service.getPageSize()).toBe(10);
        });

        it('should return pageSize equal to 20', function() {
            service.setPageSize(20);
            expect(service.getPageSize()).toBe(20);
        });

        it('should return default pageSize 10 when given pageSize is greater than 30', function() {
            service.setPageSize(31);
            expect(service.getPageSize()).toBe(10);
        });

        it('should return default pageSize 10 when given pageSize is zero', function() {
            service.setPageSize(0);
            expect(service.getPageSize()).toBe(10);
        });

        it('should return true for showEntryDetails setting', function() {
            service.setShowEntryDetails(true);
            expect(service.isShowEntryDetails()).toBe(true);
        });

        it('should return default value true for showEntryDetails setting', function() {
            expect(service.isShowEntryDetails()).toBe(true);
        });

        it('should return default true for showUnseenEntries setting', function() {
            expect(service.isShowUnseenEntries()).toBe(true);
        });

        it('should return true for showUnseenEntries setting', function() {
            service.setShowUnseenEntries(true);
            expect(service.isShowUnseenEntries()).toBe(true);
        });

        it('should return default value true for showUnseenEntries setting when given value is undefined', function() {
            service.setShowUnseenEntries(undefined);
            expect(service.isShowUnseenEntries()).toBe(true);
        });

        it('should return default value true for showEntryDetails setting when given value is undefined', function() {
            service.setShowEntryDetails(undefined);
            expect(service.isShowEntryDetails()).toBe(true);
        });
    });

    describe('settings service with malformed json', function () {

        beforeEach(function () {
            localStorage.setItem('myreader-settings', '{');
        });

        it('should initialize with default values', inject(function (settingsService) {
            expect(settingsService.getPageSize()).toBe(10);
            expect(settingsService.isShowEntryDetails()).toBe(true);
            expect(settingsService.isShowUnseenEntries()).toBe(true);

        }));
    });

    describe('settings service with valid json', function () {

        beforeEach(function () {
            localStorage.setItem('myreader-settings', '{"pageSize":20,"showUnseenEntries":false,"showEntryDetails":false}');
        });

        it('should initialize from persistent values', inject(function (settingsService) {
            expect(settingsService.getPageSize()).toBe(20);
            expect(settingsService.isShowEntryDetails()).toBe(false);
            expect(settingsService.isShowUnseenEntries()).toBe(false);
        }));
    });
});


