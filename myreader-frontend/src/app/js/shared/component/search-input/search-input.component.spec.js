describe('src/app/js/shared/component/search-input/search-input.component.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader'));

    describe('with html', function () {

        var scope, element, myOnChange, myOnClear;

        beforeEach(inject(function ($rootScope, $compile) {
            myOnChange = jasmine.createSpy('myOnChange');
            myOnClear = jasmine.createSpy('myOnClear');
            scope = $rootScope.$new();
            scope.value = 'a value';
            scope.myOnChange = myOnChange;
            scope.myOnClear = myOnClear;

            element = $compile('<my-search-input my-value="value" my-on-change="myOnChange(value)" my-on-clear="myOnClear()"></my-search-input>')(scope);
            scope.$digest();
        }));

        it('should set initial value', function () {
            expect(element.find('input').val()).toEqual('a value');
        });

        it('should show clear icon', function () {
            expect(element.find('md-icon')[1].classList).toContain('my-search-input-container__button-clear');
            expect(element.find('md-icon')[1].classList).not.toContain('ng-hide')
        });

        it('should set no initial value', inject(function ($compile) {
            scope.value = null;
            element = $compile('<my-search-input my-value="value"></my-search-input>')(scope);
            scope.$digest();

            expect(element.find('input').val()).toEqual('');
        }));

        it('should not show clear icon when no value set', inject(function ($compile) {
            scope.value = null;
            element = $compile('<my-search-input my-value="value"></my-search-input>')(scope);
            scope.$digest();

            expect(element.find('md-icon')[1].classList).toContain('my-search-input-container__button-clear');
            expect(element.find('md-icon')[1].classList).toContain('ng-hide');
        }));

        it('should emit myOnChange event after a predefined amount of time when value is not empty', inject(function ($timeout) {
            element.find('input').val('changed value').triggerHandler('input');

            $timeout.flush(249);
            expect(myOnChange).not.toHaveBeenCalled();

            $timeout.flush(1);
            expect(myOnChange).toHaveBeenCalledWith('changed value');
        }));

        it('should emit myOnClear event after a predefined amount of time when value is empty', inject(function ($timeout) {
            element.find('input').val('').triggerHandler('input');

            $timeout.flush(250);
            expect(myOnChange).not.toHaveBeenCalled();
            expect(myOnClear).toHaveBeenCalled();
        }));

        it('should emit myOnClear event when clear icon clicked', function () {
            element.find('md-icon')[1].click();

            expect(myOnClear).toHaveBeenCalled();
        });

        it('should clear value when clear icon clicked', function () {
            element.find('md-icon')[1].click();

            expect(element.find('input').val()).toEqual('');
        });
    });
});
