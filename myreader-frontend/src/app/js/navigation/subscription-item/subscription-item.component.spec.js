describe('src/app/js/navigation/subscription-item/subscription-item.component.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader'));

    describe('$onInit', function () {

        var component;

        it('should set default values', inject(function (_$componentController_) {
            component = _$componentController_('myNavigationSubscriptionItem');
            component.$onInit();

            expect(component.item).toEqual({});
            expect(component.selected).toEqual({});
        }));

        it('should use bindings', inject(function (_$componentController_) {
            var bindings = { myItem: 'expected myItem', mySelected: 'expected mySelected'};
            component = _$componentController_('myNavigationSubscriptionItem', null, bindings);
            component.$onInit();

            expect(component.item).toEqual('expected myItem');
            expect(component.selected).toEqual('expected mySelected');
        }));
    });

    describe('controller', function () {

        var component, bindings, myOnSelect;

        beforeEach(inject(function (_$componentController_) {
            myOnSelect = jasmine.createSpy('myOnSelect');

            bindings = {
                mySelected: {
                    tag: 'tag',
                    uuid: 'uuid'
                },
                myOnSelect: myOnSelect
            };

            component = _$componentController_('myNavigationSubscriptionItem', null, bindings);
            component.$onInit();
        }));

        it('should update selected on $onChanges', function () {
            var expected = { tag: 'expected tag', uuid: 'expected uuid' };
            component.$onChanges({ mySelected: { currentValue: expected }});

            expect(component.selected).toEqual(expected);
        });

        it('should not mark item as selected when uuid does not match', function () {
            var item = {
                tag: bindings.mySelected.tag,
                uuid: 'other uuid'
            };

            expect(component.isSelected(item)).toEqual(false);
        });

        it('should not mark item as selected when tag does not match', function () {
            var item = {
                tag: 'other tag',
                uuid: bindings.mySelected.uuid
            };

            expect(component.isSelected(item)).toEqual(false);
        });

        it('should mark item as selected when tag and uuid match', function () {
            var item = {
                tag: bindings.mySelected.tag,
                uuid: bindings.mySelected.uuid
            };

            expect(component.isSelected(item)).toEqual(true);
        });

        it('should mark submenu as open when tag matches', inject(function (_$componentController_) {
            bindings.myItem = {
                tag: bindings.mySelected.tag
            };

            component = _$componentController_('myNavigationSubscriptionItem', null, bindings);
            component.$onInit();

            expect(component.isOpen()).toEqual(true);
        }));

        it('should not mark submenu as open when tag does not match', inject(function (_$componentController_) {
            bindings.myItem = {
                tag: 'other tag'
            };

            component = _$componentController_('myNavigationSubscriptionItem', null, bindings);
            component.$onInit();

            expect(component.isOpen()).toEqual(false);
        }));

        it('should propagate selected item', function () {
            component.onSelect('tag parameter', 'uuid parameter');

            expect(myOnSelect).toHaveBeenCalledWith({selected: { tag: 'tag parameter', uuid: 'uuid parameter'}});
        });

        it('', function () {
            expect(component.isInvisible({})).toEqual(false);
            expect(component.isInvisible({ unseen: 0})).toEqual(true);
            expect(component.isInvisible({ unseen: -1})).toEqual(true);
            expect(component.isInvisible({ unseen: 1})).toEqual(false);
        });
    });

    describe('with html', function () {

        var scope, element, myOnSelect, navigationItemTitleFilter;

        var item = {
            tag: 'tag',
            uuid: 'uuid',
            subscriptions: [
                { tag: 'tag', uuid: 'uuid1' },
                { tag: 'tag', uuid: 'uuid2' }
            ]
        };

        beforeEach(require('angular').mock.module('myreader', function($provide) {
            navigationItemTitleFilter = jasmine.createSpy('myNavigationItemTitle');
            navigationItemTitleFilter.and.callFake(function (item) {
                return 'called myNavigationItemTitlePipe with ' + item.tag + '/' + item.uuid;
            });
            $provide.value('myNavigationItemTitleFilter', navigationItemTitleFilter);
        }));

        beforeEach(inject(function ($rootScope, $compile) {
            myOnSelect = jasmine.createSpy('myOnSelect');

            scope = $rootScope.$new();
            scope.item = item;
            scope.selected = {
                tag: scope.item.tag,
                uuid: scope.item.uuid
            };
            scope.onSelect = myOnSelect;

            element = $compile('<my-navigation-subscription-item my-item="item" my-selected="selected" my-on-select="onSelect(selected)"></my-navigation-subscription-item>')(scope);
            scope.$digest();
        }));

        describe('parent item', function () {

            it('should not mark as selected', inject(function ($compile) {
                scope.selected = {};
                element = $compile('<my-navigation-subscription-item my-item="item" my-selected="selected"></my-navigation-subscription-item>')(scope);
                scope.$digest();

                expect(element.find('li')[0].classList).not.toContain('my-navigation-dynamic__item');
            }));

            it('should mark as selected', function () {
                expect(element.find('li')[0].classList).toContain('my-navigation-dynamic__item');
            });

            it('should not hide when unseen count is greater than zero', function () {
                expect(element.find('li')[0].classList).not.toContain('ng-hide');
            });

            it('should hide when unseen count is zero', inject(function ($compile) {
                scope.item = { unseen: 0 };
                scope.selected = {};

                element = $compile('<my-navigation-subscription-item my-item="item" my-selected="selected"></my-navigation-subscription-item>')(scope);
                scope.$digest();

                expect(element.find('li')[0].classList).toContain('ng-hide');
            }));

            it('should propagate selection', function () {
                element.find('button')[0].click();
                scope.$digest();

                expect(myOnSelect).toHaveBeenCalledWith({ tag: 'tag', uuid: 'uuid' });
            });

            it('should render title with pipe', function () {
                expect(navigationItemTitleFilter).toHaveBeenCalledWith(jasmine.objectContaining({ tag: 'tag', uuid: 'uuid' }));
                expect(element.find('span')[0].innerText).toEqual('called myNavigationItemTitlePipe with tag/uuid');
            });
        });

        describe('sub items', function () {

            it('should hide items', inject(function ($compile) {
                scope.selected = {};
                element = $compile('<my-navigation-subscription-item my-item="item" my-selected="selected"></my-navigation-subscription-item>')(scope);
                scope.$digest();

                expect(element.find('ul')[0].classList).toContain('ng-hide');
            }));

            it('should not hide items', function () {
                expect(element.find('ul')[0].classList).not.toContain('ng-hide');
            });

            it('should render every item', function () {
                expect(element.find('ul').find('li').length).toEqual(2);
            });

            it('should hide items when unseen count is zero', inject(function ($rootScope, $compile) {
                scope.item.subscriptions[0].unseen = 0;
                element = $compile('<my-navigation-subscription-item my-item="item" my-selected="selected"></my-navigation-subscription-item>')(scope);
                scope.$digest();

                var items = element.find('ul').find('li');

                expect(items[0].classList).toContain('ng-hide');
                expect(items[1].classList).not.toContain('ng-hide');
            }));

            it('should not mark as selected', function () {
                var items = element.find('ul').find('li');

                expect(items[0].classList).not.toContain('my-navigation-dynamic__item');
                expect(items[1].classList).not.toContain('my-navigation-dynamic__item');
            });

            it('should mark as selected', function () {
                scope.selected = {
                    tag: scope.item.tag,
                    uuid: 'uuid1'
                };
                scope.$digest();

                var items = element.find('ul').find('li');

                expect(items[0].classList).toContain('my-navigation-dynamic__item');
                expect(items[1].classList).not.toContain('my-navigation-dynamic__item');
            });

            it('should propagate selection', function () {
                element.find('ul').find('li').find('button')[1].click();
                scope.$digest();

                expect(myOnSelect).toHaveBeenCalledWith({ tag: 'tag', uuid: 'uuid2' });
            });

            it('should render title with pipe', function () {
                expect(navigationItemTitleFilter.calls.allArgs()[1]).toContain(jasmine.objectContaining({ tag: 'tag', uuid: 'uuid1' }));
                expect(navigationItemTitleFilter.calls.allArgs()[2]).toContain(jasmine.objectContaining({ tag: 'tag', uuid: 'uuid2' }));

                expect(element.find('ul').find('li').find('button')[0].innerText).toEqual('called myNavigationItemTitlePipe with tag/uuid1');
                expect(element.find('ul').find('li').find('button')[1].innerText).toEqual('called myNavigationItemTitlePipe with tag/uuid2');
            });
        });
    });
});
