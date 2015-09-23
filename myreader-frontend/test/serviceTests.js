describe('service', function() {
    var service;

    beforeEach(module('common.services'));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('permissionService', function() {
        beforeEach(inject(function (permissionService) {
            service = permissionService;
        }));

        it('should return false without roles set', function () {
            expect(service.isAdmin()).toBe(false);
        });

        it('should return false for roles set to void', function () {
            service.setAuthorities();
            expect(service.isAdmin()).toBe(false);
        });

        it('should return false for roles set to role1 and role2', function () {
            service.setAuthorities('role1', 'role2');
            expect(service.isAdmin()).toBe(false);
        });

        it('should return true for roles set to ROLE_ADMIN', function () {
            service.setAuthorities('ROLE_ADMIN');
            expect(service.isAdmin()).toBe(true);
        });
    });

    describe('processingService', function() {
        var api;

        beforeEach(module(function($provide) {
            api = {
                get: jasmine.createSpy(),
                put: jasmine.createSpy()
            };

            $provide.service('api', function() {
                return api;
            })
        }));

        beforeEach(inject(function (processingService) {
            service = processingService;
        }));

        it('should have been called runningFeedFetches', inject(function($q) {
            var call = $q.defer();
            call.resolve({
                entries: [1]
            });

            api.get.andReturn(call.promise);

            var promise = service.runningFeedFetches();

            expect(api.get).toHaveBeenCalledWith('feeds', '/myreader/api/2/processing/feeds');

            promise.then(function(data) {
                expect(data).toBe(undefined);
            });

            expect(promise.$$state.value.entries).toEqualData([1]);
        }));

        it('should have been called rebuildSearchIndex', inject(function($q) {
            var call = $q.defer();
            call.resolve({
                entries: [1]
            });

            api.put.andReturn(call.promise);

            var promise = service.rebuildSearchIndex();

            expect(api.put).toHaveBeenCalledWith('searchIndexJob', '/myreader/api/2/processing', 'indexSyncJob');

            promise.then(function(data) {
                expect(data).toBe(undefined);
            });

            expect(promise.$$state.value.entries).toEqualData([1]);
        }));
    });

    describe('settingsService', function() {
        var cache;

        beforeEach(inject(function (settingsService, CacheFactory) {
            service = settingsService;
            cache = CacheFactory.get('settingsCache');
        }));

        it('should return pageSize equal to 10', function() {
            var pageSize = service.getPageSize();

            expect(pageSize).toBe(10);
        });

        it('should return pageSize equal to 20', function() {
            service.setPageSize(20);
            var pageSize = service.getPageSize();

            expect(pageSize).toBe(20);
        });

        it('should return "true" for method call isShowEntryDetails', function() {
            service.setShowEntryDetails(true);
            var pageSize = service.isShowEntryDetails();

            expect(pageSize).toBe(true);
        });

        it('should return "true" for method call isShowEntryDetails', function() {
            cache.remove('settings-showEntryDetails');
            var pageSize = service.isShowEntryDetails();

            expect(pageSize).toBe(true);
        });

        it('should return "true" for method call isShowUnseenEntries', function() {
            service.setShowUnseenEntries(undefined);
            var pageSize = service.isShowUnseenEntries();

            expect(pageSize).toBe(true);
        });

        it('should return "true" for method call isShowUnseenEntries', function() {
            cache.remove('settings-showUnseenEntries');
            var pageSize = service.isShowUnseenEntries();

            expect(pageSize).toBe(true);
        });

        it('should return "true" for method call isShowUnseenEntries', function() {
            service.setShowUnseenEntries(true);
            var pageSize = service.isShowUnseenEntries();

            expect(pageSize).toBe(true);
        });
    });
});
