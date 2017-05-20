describe('myEntryActions', function () {

    var item;

    beforeEach(require('angular').mock.module('myreader'));

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

        var scope, element;

        beforeEach(inject(function ($rootScope, $compile) {
            var myOnMore = jasmine.createSpy('myOnMore');
            var myOnCheck = jasmine.createSpy('myOnCheck');
            scope = $rootScope.$new();
            scope.myOnMore = myOnMore;
            scope.myOnCheck = myOnCheck;

            scope.item = {
                seen: true
            };

            element = $compile('<my-entry-actions my-item="item" my-on-more="myOnMore(showMore)" my-on-check="myOnCheck(item)"></my-entry-actions>')(scope);
            scope.$digest();
        }));

        it('should show "expand more" and "unseen item" actions', function () {
            scope.item.seen = false;

            var buttons = element.find('button');
            expect(buttons[0].innerText).toContain('expand_more');
            expect(buttons[1].innerText).toContain('check');
        });

        it('should toggle "expand more" action', function () {
            element.find('button')[0].click();
            expect(element.find('button')[0].innerText).toContain('expand_less');

            element.find('button')[0].click();
            expect(element.find('button')[0].innerText).toContain('expand_more');
        });

        it('should show "seen item" action when seen flag is set to true', function () {
            expect(element.find('button')[1].innerText).toContain('check_circle');
        });

        it('should propagate "onMore" event when "expand more" action triggered', function () {
            element.find('button')[0].click();
            scope.$digest();
            expect(scope.myOnMore).toHaveBeenCalledWith(true);

            element.find('button')[0].click();
            scope.$digest();
            expect(scope.myOnMore).toHaveBeenCalledWith(false);
        });

        it('should propagate "onCheck" event with seen flag set to false when "check" action triggered', function () {
            element.find('button')[1].click();
            scope.$digest();
            expect(scope.myOnCheck).toHaveBeenCalledWith({ seen: false });
        });

        it('should propagate "onCheck" event with seen flag set to true when "check" action triggered', function () {
            scope.item.seen = false;
            scope.$digest();
            element.find('button')[1].click();
            scope.$digest();
            expect(scope.myOnCheck).toHaveBeenCalledWith({ seen: true });
        });
    });
});
