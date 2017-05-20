describe('service', function() {
    var api, service;

    beforeEach(module('common.services'));

    beforeEach(module(function($provide) {
        api = {
            get: jasmine.createSpy(),
            post: jasmine.createSpy(),
            delete: jasmine.createSpy(),
            patch: jasmine.createSpy(),
            put: jasmine.createSpy()
        };

        $provide.service('api', function() {
            return api;
        });
    }));

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

    describe('subscriptionsTagService', function() {

        describe('event subscriptionEntry:updateEntries', function() {
            var service, cache;

            beforeEach(inject(function (subscriptionsTagService, _subscriptionsTagCache_) {
                service = subscriptionsTagService;
                cache = _subscriptionsTagCache_;

                spyOn(cache, 'get').and.callThrough();
                spyOn(cache, 'put').and.callThrough();
            }));

            it('should not update cache when cache is undefined', inject(function($rootScope) {
                $rootScope.$broadcast('subscriptionEntry:updateEntries');

                expect(cache.put).not.toHaveBeenCalled();
            }));

            it('should not update cache when subscriptionEntries are empty', inject(function($rootScope) {
                cache.get.and.returnValue([]);

                $rootScope.$broadcast('subscriptionEntry:updateEntries');

                expect(cache.put).not.toHaveBeenCalled();
            }));

            it('should update cache', inject(function($rootScope) {
                var cachedSubscriptionsTags = {
                    decrementSubscriptionUnseen: jasmine.createSpy()
                };

                cache.get.and.returnValue(cachedSubscriptionsTags);

                $rootScope.$broadcast('subscriptionEntry:updateEntries', [{feedUuid: 1, seen: true}]);

                expect(cache.put).toHaveBeenCalledWith('subscriptionsTags', cachedSubscriptionsTags);
            }));

            it('should decrementSubscriptionUnseen', inject(function($rootScope) {
                var cachedSubscriptionsTags = {
                    decrementSubscriptionUnseen: jasmine.createSpy()
                };

                cache.get.and.returnValue(cachedSubscriptionsTags);

                $rootScope.$broadcast('subscriptionEntry:updateEntries', [{seen: true, feedUuid: 1}]);

                expect(cachedSubscriptionsTags.decrementSubscriptionUnseen).toHaveBeenCalledWith(1);
                expect(cache.put).toHaveBeenCalledWith('subscriptionsTags', cachedSubscriptionsTags);
            }));

            it('should incrementSubscriptionUnseen', inject(function($rootScope) {
                var cachedSubscriptionsTags = {
                    incrementSubscriptionUnseen: jasmine.createSpy()
                };

                cache.get.and.returnValue(cachedSubscriptionsTags);

                $rootScope.$broadcast('subscriptionEntry:updateEntries', [{seen: false, feedUuid: 2}]);

                expect(cache.put).toHaveBeenCalledWith('subscriptionsTags', cachedSubscriptionsTags);
                expect(cachedSubscriptionsTags.incrementSubscriptionUnseen).toHaveBeenCalledWith(2);
            }));
        });

        describe('with real cache', function() {
            var api, call, cache;
            var promiseResult = 'success';

            beforeEach(module(function($provide) {
                api = {
                    get: jasmine.createSpy()
                };

                $provide.service('api', function() {
                    return api;
                });
            }));

            beforeEach(inject(function (subscriptionsTagService, $q, _subscriptionsTagCache_) {
                service = subscriptionsTagService;
                cache = _subscriptionsTagCache_;

                call = $q.defer();
                call.resolve(promiseResult);

                api.get.and.returnValue(call.promise);
            }));

            it('should return new uncached entries', inject(function($rootScope) {
                var unseen = true;
                var promise = service.findAllByUnseen(unseen);

                $rootScope.$digest();

                expect(api.get).toHaveBeenCalledWith('subscriptionsTag', '/myreader/api/2/subscriptions?unseenGreaterThan=0', cache);
                expect(promise.$$state.value).toEqual(promiseResult);

                expect(cache.get('subscriptionsTags')).toEqual(promiseResult);
                expect(cache.get('subscriptionsTags.unseenFlag')).toEqual(unseen);
            }));

            it('should return old uncached entries', inject(function($rootScope) {
                var unseen = false;
                var promise = service.findAllByUnseen(unseen);

                $rootScope.$digest();

                expect(api.get).toHaveBeenCalledWith('subscriptionsTag', '/myreader/api/2/subscriptions', cache);
                expect(promise.$$state.value).toEqual(promiseResult);

                expect(cache.get('subscriptionsTags')).toEqual(promiseResult);
                expect(cache.get('subscriptionsTags.unseenFlag')).toEqual(unseen);
            }));

            it('should return cached entries when called with unseen set to false and cached unseen flag false', function() {
                var unseen = false;
                var data = {uuid: 50};
                cache.put('subscriptionsTags', data);
                cache.put('subscriptionsTags.unseenFlag', unseen);

                var promise = service.findAllByUnseen(unseen);

                expect(api.get).not.toHaveBeenCalledWith('subscriptionsTag', '/myreader/api/2/subscriptions', cache);
                expect(promise.$$state.value).toEqual(data);

                expect(cache.get('subscriptionsTags')).toEqual(data);
                expect(cache.get('subscriptionsTags.unseenFlag')).toEqual(unseen);
            });

            it('should return uncached entries when called with unseen set to false and cached unseen flag true', inject(function($rootScope) {
                var unseen = false;
                var data = {uuid: 50};
                cache.put('subscriptionsTags', data);
                cache.put('subscriptionsTags.unseenFlag', true);

                var promise = service.findAllByUnseen(unseen);

                $rootScope.$digest();

                expect(api.get).toHaveBeenCalledWith('subscriptionsTag', '/myreader/api/2/subscriptions', cache);
                expect(promise.$$state.value).toEqual(promiseResult);

                expect(cache.get('subscriptionsTags')).toEqual(promiseResult);
                expect(cache.get('subscriptionsTags.unseenFlag')).toEqual(unseen);
            }));
        });
    });

    describe('subscriptionEntryService', function() {
        var call;
        var promiseResult = 'success';

        beforeEach(inject(function (subscriptionEntryService, $q) {
            service = subscriptionEntryService;

            call = $q.defer();
            call.resolve(promiseResult);

            api.get.and.returnValue(call.promise);
        }));

        it('should process own properties in params object', function() {
            var Params = function() {
                this.param1 = 1;
                this.param2 = 2;
            };

            Params.prototype.param3 = 3;

            service.findBy(new Params);

            expect(api.get).toHaveBeenCalledWith('subscriptionEntries', '/myreader/api/2/subscriptionEntries?&param1=1&param2=2');
        });

        it('should save entries', inject(function($rootScope, $q) {
            var data = [{uuid: 12}];
            var call = $q.defer();

            call.resolve({entries: data});

            api.patch.and.returnValue(call.promise);

            service.save(12);

            expect(api.patch).toHaveBeenCalledWith('subscriptionEntries', '/myreader/api/2/subscriptionEntries?', [12]);
        }));
    });

    describe('subscriptionService', function() {
        var promiseResult = 'success';

        beforeEach(inject(function (subscriptionService, $q) {
            service = subscriptionService;

            var getCall = $q.defer();
            getCall.resolve(promiseResult);

            var postPatchCall = $q.defer();
            postPatchCall.resolve(promiseResult);

            api.get.and.returnValue(getCall.promise);
            api.post.and.returnValue(postPatchCall.promise);
            api.patch.and.returnValue(postPatchCall.promise);
            api.delete.and.returnValue(postPatchCall.promise);
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
        var promiseResult = 'success';

        beforeEach(inject(function (exclusionService, $q) {
            service = exclusionService;

            var getCall = $q.defer();
            getCall.resolve(promiseResult);

            var postPutCall = $q.defer();
            postPutCall.resolve(promiseResult);

            api.get.and.returnValue(getCall.promise);
            api.post.and.returnValue(postPutCall.promise);
            api.delete.and.returnValue(postPutCall.promise);
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

        beforeEach(inject(function (subscriptionTagService, $q) {
            service = subscriptionTagService;

            var call = $q.defer();
            call.resolve({
                entries: [1]
            });

            api.get.and.returnValue(call.promise);
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
        var mockUrl = 'mockUrl';

        beforeEach(inject(function (feedService) {
            service = feedService;
        }));
    });

    describe('bookmarkService', function() {

        beforeEach(inject(function (bookmarkService, $q) {
            service = bookmarkService;

            var call = $q.defer();
            call.resolve({
                entries: [1]
            });

            api.get.and.returnValue(call.promise);
        }));

        it('should return result', inject(function($rootScope) {
            var promise = service.findAll();

            $rootScope.$digest();

            expect(api.get).toHaveBeenCalledWith('bookmarkTags', '/myreader/api/2/subscriptionEntries/availableTags');
            expect(promise.$$state.value.entries).toEqualData([1]);
        }));
    });

    describe('deferService', function() {
        var resolvedResult = 'success';
        var resolvedError = 'error';

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

        beforeEach(inject(function (deferService) {
            service = deferService;
        }));

        it('should resolve deferred call with success', function() {
            var promise = service.deferred(succeeding(callbackWithPromise));

            expect(promise.$$state.value).toEqual(resolvedResult);
        });

        it('should resolve deferred call with failure', function() {
            var promise = service.deferred(failing(callbackWithPromise));

            expect(promise.$$state.value).toEqual(resolvedError);
        });

        it('should call resolve on deferred object', function() {
            var promise = service.resolved(resolvedResult);

            expect(promise.$$state.value).toEqual(resolvedResult);
        });

        it('should call reject on deferred object', function() {
            var promise = service.reject(resolvedError);

            expect(promise.$$state.value).toEqual(resolvedError);
        });
    });

    describe('processingService', function() {

        beforeEach(inject(function (processingService) {
            service = processingService;
        }));

        it('should have been called rebuildSearchIndex', inject(function($q) {
            var call = $q.defer();
            call.resolve({
                entries: [1]
            });

            api.put.and.returnValue(call.promise);

            var promise = service.rebuildSearchIndex();

            expect(api.put).toHaveBeenCalledWith('searchIndexJob', '/myreader/api/2/processing', 'indexSyncJob');
            expect(promise.$$state.value.entries).toEqualData([1]);
        }));
    });

    describe('settingsService', function() {
        var cache;

        beforeEach(inject(function (settingsService, _settingsCache_) {
            service = settingsService;
            cache = _settingsCache_;

            cache.remove('settings-pageSize');
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
