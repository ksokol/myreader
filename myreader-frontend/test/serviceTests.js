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

    describe('subscriptionEntryTagService', function() {
        var api;

        beforeEach(module(function($provide) {
            api = {
                get: jasmine.createSpy()
            };

            $provide.service('api', function() {
                return api;
            });
        }));

        beforeEach(inject(function (subscriptionEntryTagService, $q) {
            service = subscriptionEntryTagService;

            var call = $q.defer();
            call.resolve({
                entries: [1]
            });

            api.get.andReturn(call.promise);
        }));

        it('should return cached result', inject(function($rootScope) {
            var firstPromise = service.findAll();

            $rootScope.$digest();

            expect(api.get).toHaveBeenCalledWith('subscriptionEntryTag', '/myreader/api/2/subscriptions/availableTags');
            expect(firstPromise.$$state.value.entries).toEqualData([1]);

            api.get = jasmine.createSpy();

            var secondPromise = service.findAll();

            $rootScope.$digest();

            expect(api.get).not.toHaveBeenCalledWith('subscriptionEntryTag', '/myreader/api/2/subscriptions/availableTags');
            expect(secondPromise.$$state.value.entries).toEqualData([1]);
        }));
    });



    describe('subscriptionService', function() {
        var api;
        var promiseResult = 'success';

        beforeEach(module(function($provide) {
            api = {
                get: jasmine.createSpy(),
                post: jasmine.createSpy(),
                patch: jasmine.createSpy(),
                delete: jasmine.createSpy()
            };

            $provide.service('api', function() {
                return api;
            });
        }));

        beforeEach(inject(function (subscriptionService, $q) {
            service = subscriptionService;

            var getCall = $q.defer();
            getCall.resolve(promiseResult);

            var postPatchCall = $q.defer();
            postPatchCall.resolve(promiseResult);

            api.get.andReturn(getCall.promise);
            api.post.andReturn(postPatchCall.promise);
            api.patch.andReturn(postPatchCall.promise);
            api.delete.andReturn(postPatchCall.promise);
        }));

        it('should return ' + promiseResult + " on findAll", function() {
            var promise = service.findAll();

            expect(api.get).toHaveBeenCalledWith('subscriptions', '/myreader/api/2/subscriptions');
            expect(promise.$$state.value).toEqual(promiseResult);
        });

        it('should return ' + promiseResult + " on find", function() {
            var promise = service.find('subscriptionUuid');

            expect(api.get).toHaveBeenCalledWith('subscription', '/myreader/api/2/subscriptions/subscriptionUuid');
            expect(promise.$$state.value).toEqual(promiseResult);
        });

        it('should return ' + promiseResult + " on save and call http post on missing uuid", function() {
            var promise = service.save({});

            expect(api.post).toHaveBeenCalledWith('subscription', '/myreader/api/2/subscriptions', {});
            expect(api.patch).not.toHaveBeenCalled();
            expect(promise.$$state.value).toEqual(promiseResult);
        });

        it('should return ' + promiseResult + " on save and call http patch", function() {
            var subscription = {uuid: 'subscriptionUuid'};
            var promise = service.save(subscription);

            expect(api.post).not.toHaveBeenCalled();
            expect(api.patch).toHaveBeenCalledWith('subscription', '/myreader/api/2/subscriptions/' + subscription.uuid, subscription);
            expect(promise.$$state.value).toEqual(promiseResult);
        });

        it('should return ' + promiseResult + " on unsubscribe", function() {
            var subscription = {uuid: 'subscriptionUuid'};
            var promise = service.unsubscribe(subscription);

            expect(api.delete).toHaveBeenCalledWith('subscription', '/myreader/api/2/subscriptions/' + subscription.uuid);
            expect(promise.$$state.value).toEqual(promiseResult);
        });
    });

    describe('exclusionService', function() {
        var api;
        var promiseResult = 'success';

        beforeEach(module(function($provide) {
            api = {
                get: jasmine.createSpy(),
                post: jasmine.createSpy(),
                delete: jasmine.createSpy()
            };

            $provide.service('api', function() {
                return api;
            });
        }));

        beforeEach(inject(function (exclusionService, $q) {
            service = exclusionService;

            var getCall = $q.defer();
            getCall.resolve(promiseResult);

            var postPutCall = $q.defer();
            postPutCall.resolve(promiseResult);

            api.get.andReturn(getCall.promise);
            api.post.andReturn(postPutCall.promise);
            api.delete.andReturn(postPutCall.promise);
        }));

        it('should return ' + promiseResult + " on get call", function() {
            var promise = service.find('exclusionUuid');

            expect(api.get).toHaveBeenCalledWith('exclusions', '/myreader/api/2/exclusions/exclusionUuid/pattern');
            expect(promise.$$state.value).toEqual(promiseResult);
        });

        it('should return ' + promiseResult + " on post call", function() {
            var promise = service.save('exclusionUuid', 'secondParam');

            expect(api.post).toHaveBeenCalledWith('exclusion', '/myreader/api/2/exclusions/exclusionUuid/pattern', 'secondParam');
            expect(promise.$$state.value).toEqual(promiseResult);
        });

        it('should return ' + promiseResult + " on delete call", function() {
            var promise = service.delete('subscriptionUuid', 'exclusionUuid');

            expect(api.delete).toHaveBeenCalledWith('exclusion', '/myreader/api/2/exclusions/subscriptionUuid/pattern/exclusionUuid');
            expect(promise.$$state.value).toEqual(promiseResult);
        });
    });

    describe('subscriptionTagService', function() {
        var api;

        beforeEach(module(function($provide) {
            api = {
                get: jasmine.createSpy()
            };

            $provide.service('api', function() {
                return api;
            });
        }));

        beforeEach(inject(function (subscriptionTagService, $q) {
            service = subscriptionTagService;

            var call = $q.defer();
            call.resolve({
                entries: [1]
            });

            api.get.andReturn(call.promise);
        }));

        it('should return cached result', inject(function($rootScope) {
            var firstPromise = service.findAll();

            $rootScope.$digest();

            expect(api.get).toHaveBeenCalledWith('subscriptionTag', '/myreader/api/2/subscriptions/availableTags');
            expect(firstPromise.$$state.value.entries).toEqualData([1]);

            api.get = jasmine.createSpy();

            var secondPromise = service.findAll();

            $rootScope.$digest();

            expect(api.get).not.toHaveBeenCalledWith('subscriptionTag', '/myreader/api/2/subscriptions/availableTags');
            expect(secondPromise.$$state.value.entries).toEqualData([1]);
        }));
    });

    describe('feedService', function() {
        var api;
        var mockUrl = 'mockUrl';

        beforeEach(module(function($provide) {
            api = {
                post: jasmine.createSpy()
            };

            $provide.service('api', function() {
                return api;
            });
        }));

        beforeEach(inject(function (feedService) {
            service = feedService;
        }));

        it('should return cached result', inject(function($rootScope, $q) {
            var call = $q.defer();
            call.resolve({
                status: 200
            });

            api.post.andReturn(call.promise);

            var firstPromise = service.probe(mockUrl);

            $rootScope.$digest();

            expect(api.post).toHaveBeenCalledWith('feedProbe', '/myreader/api/2/feeds/probe', mockUrl);
            expect(firstPromise.$$state.value.status).toEqual(200);

            api.post = jasmine.createSpy();

            var secondPromise = service.probe(mockUrl);

            $rootScope.$digest();

            expect(api.post).not.toHaveBeenCalledWith('feedProbe', '/myreader/api/2/feeds/probe', mockUrl);
            expect(secondPromise.$$state.value.status).toEqualData(200);
        }));

        it('should reject cached status 400', inject(function($rootScope, $q) {
            var call = $q.defer();
            call.reject({
                status: 400
            });

            api.post.andReturn(call.promise);

            var firstPromise = service.probe(mockUrl);

            $rootScope.$digest();

            expect(api.post).toHaveBeenCalledWith('feedProbe', '/myreader/api/2/feeds/probe', mockUrl);
            expect(firstPromise.$$state.value.status).toEqual(400);

            api.post = jasmine.createSpy();

            var secondPromise = service.probe(mockUrl);

            $rootScope.$digest();

            expect(api.post).not.toHaveBeenCalledWith('feedProbe', '/myreader/api/2/feeds/probe', mockUrl);
            expect(secondPromise.$$state.value.status).toEqualData(400);
        }));
    });

    describe('bookmarkService', function() {
        var api;

        beforeEach(module(function($provide) {
            api = {
                get: jasmine.createSpy()
            };

            $provide.service('api', function() {
                return api;
            });
        }));

        beforeEach(inject(function (bookmarkService, $q) {
            service = bookmarkService;

            var call = $q.defer();
            call.resolve({
                entries: [1]
            });

            api.get.andReturn(call.promise);
        }));

        it('should return cached result', inject(function($rootScope) {
            var firstPromise = service.findAll();

            $rootScope.$digest();

            expect(api.get).toHaveBeenCalledWith('bookmarkTags', '/myreader/api/2/subscriptionEntries/availableTags');
            expect(firstPromise.$$state.value.entries).toEqualData([1]);

            api.get = jasmine.createSpy();

            var secondPromise = service.findAll();

            $rootScope.$digest();

            expect(api.get).not.toHaveBeenCalledWith('bookmarkTags', '/myreader/api/2/subscriptionEntries/availableTags');
            expect(secondPromise.$$state.value.entries).toEqualData([1]);
        }));
    });

    describe('deferService', function() {
        var q, deferred;
        var resolvedResult = 'success';
        var resolvedError = 'error';
        var promiseResult = 'promise';

        var succeeding = function(fn) {
            return fn(true);
        };

        var failing = function(fn) {
            return fn(false);
        };

        var callbackWithPromise = function(result) {
            return function() {
                return {
                    $promise : {
                        then: function(fn) {
                            if(result === true) {
                                fn(resolvedResult);
                            }
                            return this;
                        },
                        catch: function(fn) {
                            if(result === false) {
                                fn(resolvedError);
                            }
                            return this;
                        }
                    }
                }
            }
        };

        beforeEach(module(function($provide) {
            q = {
                defer: jasmine.createSpy()
            };

            deferred = {
                promise: promiseResult,
                resolve: jasmine.createSpy(),
                reject: jasmine.createSpy()
            };

            q.defer.andReturn(deferred);

            $provide.service('$q', function() {
                return q;
            })
        }));

        beforeEach(inject(function (deferService) {
            service = deferService;
        }));

        it('should resolve deferred call with success', function() {
            var promise = service.deferred(succeeding(callbackWithPromise));

            expect(q.defer).toHaveBeenCalled();
            expect(deferred.resolve).toHaveBeenCalledWith(resolvedResult);
            expect(deferred.reject).not.toHaveBeenCalled();
            expect(promise).toEqual(promiseResult);
        });

        it('should resolve deferred call with failure', function() {
            var promise = service.deferred(failing(callbackWithPromise));

            expect(q.defer).toHaveBeenCalled();
            expect(deferred.resolve).not.toHaveBeenCalled();
            expect(deferred.reject).toHaveBeenCalledWith(resolvedError);
            expect(promise).toEqual(promiseResult);
        });

        it('should call resolve on deferred object', function() {
            var promise = service.resolved(resolvedResult);

            expect(q.defer).toHaveBeenCalled();
            expect(deferred.resolve).toHaveBeenCalledWith(resolvedResult);
            expect(deferred.reject).not.toHaveBeenCalled();
            expect(promise).toEqual(promiseResult);
        });

        it('should call reject on deferred object', function() {
            var promise = service.reject(resolvedError);

            expect(q.defer).toHaveBeenCalled();
            expect(deferred.resolve).not.toHaveBeenCalled();
            expect(deferred.reject).toHaveBeenCalledWith(resolvedError);
            expect(promise).toEqual(promiseResult);
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
