describe("SubscriptionEntryListCtrl", function() {
    var scope,
        subscriptionEntryServiceMock,
        subscriptionsTagServiceMock;

    beforeEach(module('common.controllers', function($provide) {
        $provide.provider(myMock.provider(['$stateParams', '$state']));

        $provide.provider(myMock.providerWithObj('hotkeys', {
            bindTo: function() {
                return {
                    add: function() {}
                }
            }
        }));
    }));

    beforeEach(inject(function($q, $rootScope, $controller){
        subscriptionEntryServiceMock = {
            findBy: jasmine.createSpy().and.returnValue($q.defer().promise)
        };

        subscriptionsTagServiceMock = {
            findAllByUnseen: jasmine.createSpy().and.returnValue($q.defer().promise)
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

        subscriptionEntryServiceMock.findBy.and.returnValue(firstCall.promise);

        scope.$broadcast('refresh');
        scope.$digest();

        expect(scope.data.entries).toEqual([1]);

        var secondCall = $q.defer();
        secondCall.resolve({
            entries: [2]
        });

        subscriptionEntryServiceMock.findBy.and.returnValue(secondCall.promise);

        scope.$broadcast('refresh');
        scope.$digest();

        expect(scope.data.entries).toEqual([2]);
    }));
});

describe("SubscriptionCtrl", function() {
    var scope;

    beforeEach(module('common.controllers', function($provide) {
        $provide.provider(myMock.provider(['$stateParams', '$state', '$mdToast', '$mdDialog', '$previousState']));
    }));

    beforeEach(inject(function($rootScope, $controller){
        scope = $rootScope.$new();
        $controller('SubscriptionCtrl', {
            $scope: scope
        });
    }));

    it('should return unknown tag as array when calling querySearch with "unknownTag"', function() {
        var queryResult = scope.querySearch('unknownTag');
        expect(queryResult).toEqual(['unknownTag']);
    });

    it('should return known tags as array when calling querySearch with "tagt"', function() {
        scope.availableTags = ['tag', 'tagte', 'tagtest5', 'unknown'];
        var queryResult = scope.querySearch('tagt');
        expect(queryResult).toEqual(['tagte', 'tagtest5']);
    });
});
