import {myMock} from './testUtil';
import {mockNgRedux} from '../src/app/js/shared/test-utils';

describe("test/controllerTests.js", function() {
    var scope, subscriptionEntryServiceMock;

    beforeEach(angular.mock.module('common.controllers', mockNgRedux(), function($provide) {
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

        scope = $rootScope.$new();
        $controller('SubscriptionEntryListCtrl', {
            $scope: scope,
            subscriptionEntryService: subscriptionEntryServiceMock
        });
    }));

    it('should replace scope.data.entries on refresh event', inject(function($q) {
        scope.$digest();

        expect(scope.data.entries).toEqual([]);

        var firstCall = $q.defer();
        firstCall.resolve([1]);

        subscriptionEntryServiceMock.findBy.and.returnValue(firstCall.promise);

        scope.forceRefresh();
        scope.$digest();

        expect(scope.data.entries).toEqual([1]);

        var secondCall = $q.defer();
        secondCall.resolve([2]);

        subscriptionEntryServiceMock.findBy.and.returnValue(secondCall.promise);

        scope.forceRefresh();
        scope.$digest();

        expect(scope.data.entries).toEqual([2]);
    }));
});
