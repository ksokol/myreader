describe('src/app/js/shared/component/search-input/search-input.component.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader'));

    describe('with html', function () {

        var scope, timeout, myOnChange, myOnClear, page;

        var Icon = function (el) {
            return {
                el: el,
                iconType: function () {
                    return el.attr('my-type');
                },
                click: function () {
                    el.triggerHandler('click');
                }
            }
        };

        var PageObject = function (el) {
            return {
                clearIcon: function () {
                    var icons = el.find('my-icon');
                    return new Icon(angular.element(icons[1]));
                },
                searchInput: function () {
                    return el.find('input');
                },
                enterSearchInput: function (value, tick) {
                    el.find('input').val(value).triggerHandler('input');
                    timeout.flush(tick || 250);
                }
            }
        };

        beforeEach(inject(function ($rootScope, $compile, $timeout) {
            myOnChange = jasmine.createSpy('myOnChange');
            myOnClear = jasmine.createSpy('myOnClear');
            timeout = $timeout;
            scope = $rootScope.$new();
            scope.value = 'a value';
            scope.myOnChange = myOnChange;
            scope.myOnClear = myOnClear;

            var element = $compile('<my-search-input my-value="value" my-on-change="myOnChange(value)" my-on-clear="myOnClear()"></my-search-input>')(scope);
            scope.$digest();
            page = new PageObject(element);
        }));

        it('should set initial value', function () {
            expect(page.searchInput().val()).toEqual('a value');
        });

        it('should show clear icon', function () {
            expect(page.clearIcon().iconType()).toEqual('clear');
            expect(page.clearIcon().el.hasClass('ng-hide')).toEqual(false);
        });

        it('should set no initial value', inject(function ($compile) {
            scope.value = null;
            var element = $compile('<my-search-input my-value="value"></my-search-input>')(scope);
            scope.$digest();
            page = new PageObject(element);

            expect(page.searchInput().val()).toEqual('');
        }));

        it('should not show clear icon when no value set', inject(function ($compile) {
            scope.value = null;
            var element = $compile('<my-search-input my-value="value"></my-search-input>')(scope);
            scope.$digest();
            page = new PageObject(element);

            expect(page.clearIcon().iconType()).toEqual('clear');
            expect(page.clearIcon().el.hasClass('ng-hide')).toEqual(true);
        }));

        it('should emit myOnChange event after a predefined amount of time when value is not empty', inject(function ($timeout) {
            page.enterSearchInput('changed value', 249);

            expect(myOnChange).not.toHaveBeenCalled();

            $timeout.flush(1);
            expect(myOnChange).toHaveBeenCalledWith('changed value');
        }));

        it('should emit myOnClear event after a predefined amount of time when value is empty', function () {
            page.enterSearchInput('');

            expect(myOnChange).not.toHaveBeenCalled();
            expect(myOnClear).toHaveBeenCalled();
        });

        it('should emit myOnClear event when clear icon clicked', function () {
            page.clearIcon().click();

            expect(myOnClear).toHaveBeenCalled();
        });

        it('should clear value when clear icon clicked', function () {
            page.clearIcon().click();

            expect(page.searchInput().val()).toEqual('');
        });
    });
});
