describe("SubscriptionEntryListCtrl controller", function() {
    var scope,
        subscriptionEntryServiceMock,
        subscriptionsTagServiceMock;

    beforeEach(module('common.controllers', function($provide) {
        $provide.provider('$stateParams', function () {
            return {
                $get: function () {
                    return {
                    };
                }
            };
        });

        $provide.provider('$state', function () {
            return {
                $get: function () {
                    return {
                    };
                }
            };
        });

        $provide.provider('$mdMedia', function () {
            return {
                $get: function () {
                    return {
                    };
                }
            };
        });

        $provide.provider('hotkeys', function () {
            return {
                $get: function () {
                    return {
                        bindTo: function() {
                            return {
                                add: function() {}
                            }
                        }
                    };
                }
            };
        });
    }));

    beforeEach(inject(function($q, $rootScope, $controller){
        subscriptionEntryServiceMock = {
            findBy: jasmine.createSpy().andReturn($q.defer().promise)
        };

        subscriptionsTagServiceMock = {
            findAllByUnseen: jasmine.createSpy().andReturn($q.defer().promise)
        };

        scope = $rootScope.$new();
        $controller('SubscriptionEntryListCtrl', {
            $scope: scope,
            subscriptionEntryService: subscriptionEntryServiceMock,
            subscriptionsTagService: subscriptionsTagServiceMock
        });
    }));

    it('should replace scope.data.entries on refresh event', inject(function($q) {
        scope.$digest();

        expect(scope.data.entries).toEqual([]);

        var firstCall = $q.defer();
        firstCall.resolve({
            entries: [1]
        });

        subscriptionEntryServiceMock.findBy.andReturn(firstCall.promise);

        scope.$broadcast('refresh');
        scope.$digest();

        expect(scope.data.entries).toEqual([1]);

        var secondCall = $q.defer();
        secondCall.resolve({
            entries: [2]
        });

        subscriptionEntryServiceMock.findBy.andReturn(secondCall.promise);

        scope.$broadcast('refresh');
        scope.$digest();

        expect(scope.data.entries).toEqual([2]);
    }));
});
