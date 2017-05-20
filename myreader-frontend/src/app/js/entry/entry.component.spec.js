describe('myEntry', function () {

    describe('with html', function () {

        var testUtils = require('../shared/test-utils');

        var entryTitle = testUtils.componentMock('myEntryTitle');
        var entryActions = testUtils.componentMock('myEntryActions');
        var entryTags = testUtils.directiveMock('myEntryTags');
        var entryContent = testUtils.componentMock('myEntryContent');
        var notificationPanel = testUtils.componentMock('myNotificationPanel');

        var rootScope, scope, element, subscriptionEntryService, deferred, item;

        beforeEach(
            require('angular').mock.module(
                'myreader',
                entryTitle,
                entryActions,
                entryTags,
                entryContent,
                notificationPanel,
                testUtils.mock('subscriptionEntryService')
            )
        );

        beforeEach(inject(function ($rootScope, $compile, $q, _subscriptionEntryService_) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            deferred = $q.defer();

            subscriptionEntryService = _subscriptionEntryService_;
            subscriptionEntryService.save = jasmine.createSpy('save');
            subscriptionEntryService.save.and.returnValue(deferred.promise);

            scope.item = item = {
                uuid: 'uuid',
                seen: false,
                tag: 'tag'
            };

            element = $compile('<my-entry my-item="item"></my-entry>')(scope);
            scope.$digest();
        }));

        it('should propagate item to child components', function () {
            expect(entryTitle.bindings.myItem).toEqual(item);
            expect(entryActions.bindings.myItem).toEqual(item);
            expect(entryTags.scope.entry).toEqual(item);
            expect(entryContent.bindings.myItem).toEqual(item);
            expect(notificationPanel.bindings.myMessage).toBeUndefined();
        });

        it('should show or hide entryTags and entryContent components based on showMore flag', function () {
            entryActions.bindings.myOnMore({showMore: true});
            rootScope.$digest();

            expect(entryTags.scope.hide).toEqual(true);
            expect(entryContent.bindings.myShow).toEqual(true);

            entryActions.bindings.myOnMore({showMore: false});
            rootScope.$digest();

            expect(entryTags.scope.hide).toEqual(false);
            expect(entryContent.bindings.myShow).toEqual(false);
        });

        it('should update seen flag when entryActions component fired myOnCheck event', function () {
            entryActions.bindings.myOnCheck({ item: {seen: true }});

            expect(subscriptionEntryService.save).toHaveBeenCalledWith({ uuid: 'uuid', seen: true, tag: 'tag' });
        });

        it('should propagate error message to notificationPanel when update fails', function () {
            expect(notificationPanel.bindings.myMessage).toBeUndefined();
            deferred.reject('expected error');
            entryActions.bindings.myOnCheck({ item: {}});
            rootScope.$digest();

            expect(notificationPanel.bindings.myMessage).toEqual({ type: 'error', message: 'expected error' });
        });

        it('should clear message property when notificationPanel fired myOnDismiss event', function () {
            deferred.reject();
            entryActions.bindings.myOnCheck({ item: {}});
            rootScope.$digest();

            notificationPanel.bindings.myOnDismiss();

            expect(element.controller('myEntry').message).toBeNull();
        });

        it('should update tag when entryTags component fired onSelect event', function () {
            entryTags.scope.onSelect({ item: {tag: 'tag1' }});

            expect(subscriptionEntryService.save).toHaveBeenCalledWith({ uuid: 'uuid', seen: false, tag: 'tag1' });
        });

        it('should propagate iupdated tem to child components', function () {
            var updatedItem = { uuid: 'uuid', seen: false, tag: 'tag1' };
            deferred.resolve(updatedItem);

            entryTags.scope.onSelect({ item: {tag: 'tag1' }});
            rootScope.$digest();

            expect(entryTitle.bindings.myItem).toEqual(updatedItem);
            expect(entryActions.bindings.myItem).toEqual(updatedItem);
            expect(entryTags.scope.entry).toEqual(updatedItem);
            expect(entryContent.bindings.myItem).toEqual(updatedItem);
        })
    });
});
