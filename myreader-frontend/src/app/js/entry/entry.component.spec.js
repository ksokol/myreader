import {componentMock, mock, mockNgRedux} from '../shared/test-utils';

describe('src/app/js/entry/entry.component.spec.js', () => {

    const currentState = {
        common: {
            notification: {
                nextId: 1
            }
        }
    };

    const entryTitle = componentMock('myEntryTitle');
    const entryActions = componentMock('myEntryActions');
    const entryTags = componentMock('myEntryTags');
    const entryContent = componentMock('myEntryContent');

    let rootScope, scope, element, ngRedux, subscriptionEntryService, deferred, item;

    beforeEach(angular.mock.module('myreader', entryTitle, entryActions, entryTags, entryContent, mock('subscriptionEntryService'), mockNgRedux()));

    beforeEach(inject(($rootScope, $compile, $q, $ngRedux, _subscriptionEntryService_) => {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        ngRedux = $ngRedux;
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

    it('should propagate item to child components', () => {
        expect(entryTitle.bindings.myItem).toEqual(item);
        expect(entryActions.bindings.myItem).toEqual(item);
        expect(entryTags.bindings.myItem).toEqual(item);
        expect(entryContent.bindings.myItem).toEqual(item);
    });

    it('should show or hide entryTags and entryContent components based on showMore flag', () => {
        entryActions.bindings.myOnMore({showMore: true});
        rootScope.$digest();

        expect(entryTags.bindings.myShow).toEqual(true);
        expect(entryContent.bindings.myShow).toEqual(true);

        entryActions.bindings.myOnMore({showMore: false});
        rootScope.$digest();

        expect(entryTags.bindings.myShow).toEqual(false);
        expect(entryContent.bindings.myShow).toEqual(false);
    });

    it('should update seen flag when entryActions component fired myOnCheck event', () => {
        entryActions.bindings.myOnCheck({item: {seen: true}});

        expect(subscriptionEntryService.save).toHaveBeenCalledWith({uuid: 'uuid', seen: true, tag: 'tag'});
    });

    it('should propagate error message to notificationPanel when update fails', () => {
        deferred.reject('expected error');
        entryActions.bindings.myOnCheck({item: {}});
        rootScope.$digest();

        ngRedux.thunk(currentState);
        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: 'SHOW_NOTIFICATION',
            notification: jasmine.objectContaining({text: 'expected error', type: 'error'})
        }));
    });

    it('should update tag when entryTags component fired onSelect event', () => {
        entryTags.bindings.myOnChange({ tag: 'tag1' });

        expect(subscriptionEntryService.save).toHaveBeenCalledWith({uuid: 'uuid', seen: false, tag: 'tag1'});
    });

    it('should propagate updated tem to child components', () => {
        const updatedItem = {uuid: 'uuid', seen: false, tag: 'tag1'};
        deferred.resolve(updatedItem);

        entryTags.bindings.myOnChange({ tag: 'tag1' });
        rootScope.$digest();

        expect(entryTitle.bindings.myItem).toEqual(updatedItem);
        expect(entryActions.bindings.myItem).toEqual(updatedItem);
        expect(entryTags.bindings.myItem).toEqual(updatedItem);
        expect(entryContent.bindings.myItem).toEqual(updatedItem);
    });
});
