describe('src/app/js/entry/entry-actions/entry-actions.component.spec.js', function () {

    var item;
    var angular = require('angular');
    beforeEach(angular.mock.module('myreader'));

    beforeEach(function () {
        item = {
            seen: false
        };
    });

    describe('controller', function () {

        var component, myOnMore, myOnCheck;

        beforeEach(require('angular').mock.module('myreader'));

        beforeEach(inject(function (_$componentController_) {
            myOnMore = jasmine.createSpy('myOnMore');
            myOnCheck = jasmine.createSpy('myOnCheck');

            component = _$componentController_('myEntryActions', null, { myItem: item, myOnMore: myOnMore, myOnCheck: myOnCheck});
            component.$onInit();
        }));

        it('should set default values on init', inject(function (_$componentController_) {
            component = _$componentController_('myEntryContent');
            component.$onInit();

            expect(component.item).toEqual({});
        }));

        it('should update seen flag when myItem is defined on $onChanges', function () {
            component.$onChanges({ myItem: { currentValue: { seen: true }}});

            expect(component.item.seen).toEqual(true);
        });
    });

    describe('with html', function () {

        var scope, page;

        var Button = function (el) {
            return {
                iconType: function () {
                    return el.find('my-icon').attr('my-type');
                },
                click: function () {
                    el.triggerHandler('click');
                }
            }
        };

        var PageObject = function (el) {
            return {
                expandIcon: function () {
                    var buttons = el.find('button');
                    return new Button(angular.element(buttons[0]));
                },
                checkButton: function () {
                    var buttons = el.find('button');
                    return new Button(angular.element(buttons[1]));
                }
            }
        };

        beforeEach(inject(function ($rootScope, $compile) {
            var myOnMore = jasmine.createSpy('myOnMore');
            var myOnCheck = jasmine.createSpy('myOnCheck');
            scope = $rootScope.$new();
            scope.myOnMore = myOnMore;
            scope.myOnCheck = myOnCheck;

            scope.item = {
                seen: true
            };

            var element = $compile('<my-entry-actions my-item="item" my-on-more="myOnMore(showMore)" my-on-check="myOnCheck(item)"></my-entry-actions>')(scope);
            scope.$digest();

            page = new PageObject(element);
        }));

        it('should show "expand more" and "unseen item" actions', function () {
            scope.item.seen = false;
            scope.$digest();

            expect(page.expandIcon().iconType()).toEqual('expand-more');
            expect(page.checkButton().iconType()).toEqual('check');
        });

        it('should toggle "expand more" action', function () {
            page.expandIcon().click();
            expect(page.expandIcon().iconType()).toEqual('expand-less');

            page.expandIcon().click();
            expect(page.expandIcon().iconType()).toEqual('expand-more');
        });

        it('should show "seen item" action when seen flag is set to true', function () {
            expect(page.checkButton().iconType()).toEqual('check-circle');
        });

        it('should propagate "onMore" event when "expand more" action triggered', function () {
            page.expandIcon().click();
            scope.$digest();
            expect(scope.myOnMore).toHaveBeenCalledWith(true);

            page.expandIcon().click();
            scope.$digest();
            expect(scope.myOnMore).toHaveBeenCalledWith(false);
        });

        it('should propagate "onCheck" event with seen flag set to false when "check" action triggered', function () {
            page.checkButton().click();
            scope.$digest();
            expect(scope.myOnCheck).toHaveBeenCalledWith({ seen: false });
        });

        it('should propagate "onCheck" event with seen flag set to true when "check" action triggered', function () {
            scope.item.seen = false;
            scope.$digest();
            page.checkButton().click();
            scope.$digest();
            expect(scope.myOnCheck).toHaveBeenCalledWith({ seen: true });
        });
    });
});
