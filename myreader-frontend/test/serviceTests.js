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
});
