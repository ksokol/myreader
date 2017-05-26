describe('test/serviceTests.js', function() {
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

        describe('with real cache', function() {
            var api, call;
            var promiseResult = 'success';

            beforeEach(module(function($provide) {
                api = {
                    get: jasmine.createSpy()
                };

                $provide.service('api', function() {
                    return api;
                });
            }));

            beforeEach(inject(function (subscriptionsTagService, $q) {
                service = subscriptionsTagService;

                call = $q.defer();
                call.resolve(promiseResult);

                api.get.and.returnValue(call.promise);
            }));

            it('should return entries when called with unseen set to false', inject(function($rootScope) {
                var unseen = false;

                var promise = service.findAllByUnseen(unseen);

                $rootScope.$digest();

                expect(api.get).toHaveBeenCalledWith('subscriptionsTag', '/myreader/api/2/subscriptions');
                expect(promise.$$state.value).toEqual(promiseResult);
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

        it('should return tags', inject(function($rootScope) {
            var firstPromise = service.findAll();

            $rootScope.$digest();

            expect(api.get).toHaveBeenCalledWith('subscriptionTag', '/myreader/api/2/subscriptions/availableTags');
            expect(firstPromise.$$state.value.entries).toEqualData([1]);
        }));
    });

    describe('feedService', function() {
        var mockUrl = 'mockUrl';

        beforeEach(inject(function (feedService) {
            service = feedService;
        }));
    });

    describe('bookmarkService', function() {

        var httpBackend;

        beforeEach(inject(function ($rootScope, bookmarkService, $httpBackend) {
            service = bookmarkService;
            httpBackend = $httpBackend;
        }));

        it('should return converted result', function(done) {
            var tag1 = {
                "uuid": "35",
                "title": "tag1",
                "tag": "news",
                "unseen": 106,
                "links": []
            };

            var expectedTags = {
                tags: [
                    {
                        links: {},
                        tag: [
                            {
                                uuid: '35',
                                title: 'tag1',
                                tag: 'news',
                                unseen: 106,
                                links: []
                            }
                        ],
                        title: [
                            {
                                uuid: '35',
                                title: 'tag1',
                                tag: 'news',
                                unseen: 106,
                                links: []
                            }
                        ],
                        type: 'tag'
                    }
                ]
            };

            httpBackend.expectGET('/myreader/api/2/subscriptionEntries/availableTags').respond({content: [tag1]});

            service.findAll()
            .then(function (data) {
                expect(data).toEqualData(expectedTags);
                done();
            });

            httpBackend.flush();
        });
    });

    describe('processingService', function() {

        var httpBackend;

        beforeEach(inject(function (processingService, $httpBackend) {
            service = processingService;
            httpBackend = $httpBackend;
        }));

        it('should have been called rebuildSearchIndex', function(done) {
            httpBackend.expectPUT('/myreader/api/2/processing').respond({});

            service.rebuildSearchIndex()
            .success(function () {
                done();
            });

            httpBackend.flush();
        });
    });

    describe('settingsService', function() {

        beforeEach(inject(function (settingsService) {
            service = settingsService;
            localStorage.clear();
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

        it('should return "false" for method call isShowEntryDetails', function() {
            expect(service.isShowEntryDetails()).toBe(false);
        });

        it('should return "false" for method call isShowUnseenEntries', function() {
            service.setShowUnseenEntries(undefined);
            expect(service.isShowUnseenEntries()).toBe(false);
        });

        it('should return "false" for method call isShowUnseenEntries', function() {
            expect(service.isShowUnseenEntries()).toBe(false);
        });

        it('should return "true" for method call isShowUnseenEntries', function() {
            service.setShowUnseenEntries(true);
            var pageSize = service.isShowUnseenEntries();

            expect(pageSize).toBe(true);
        });
    });
});
