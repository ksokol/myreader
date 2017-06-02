describe('src/app/js/shared/component/autocomplete-input/autocomplete-input.component.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader', 'ngMaterial-mock'));

    describe('controller', function () {

        var componentController;

        beforeEach(inject(function (_$componentController_) {
            componentController = _$componentController_;
        }));

        it('should throw error when myLabel is not set', function () {
            var component = componentController('myAutocompleteInput');
            expect(function () {
                component.$onInit();
            }).toThrowError('myLabel is undefined');
        });

        it('should not change myValues when change object has myValues undefined', function () {
            var component = componentController('myAutocompleteInput', null, { myLabel: 'label'});
            component.$onChanges({myValues: undefined});
            expect(component.myValues).toBeUndefined();
        });
    });

    describe('with html', function () {

        var scope, element, myOnSelect, myOnClear;

        beforeEach(inject(function ($rootScope, $compile) {
            myOnSelect = jasmine.createSpy('myOnSelect');
            myOnClear = jasmine.createSpy('myOnClear');

            scope = $rootScope.$new();
            scope.value = 'a value';
            scope.myOnSelect = myOnSelect;
            scope.myOnClear = myOnClear;
            scope.label = 'a label';
            scope.show = true;

            element = $compile('<my-autocomplete-input ' +
                                'my-label="{{label}}" ' +
                                'my-show="show" ' +
                                'my-values="values" ' +
                                'my-selected-item="selectedValue" ' +
                                'my-on-select="myOnSelect(value)" ' +
                                'my-on-clear="myOnClear()">' +
                              '</my-autocomplete-input>')(scope);
            scope.$digest();
        }));

        it('should render myLabel', function () {
            expect(element.find('label')[0].innerText).toEqual('a label');
        });

        it('should not render component when myShow is set to false', function () {
            scope.show = false;
            scope.$digest();

            expect(element.children().length).toEqual(0);
        });

        it('should not render component when myShow is set to true', function () {
            expect(element.children().length).toEqual(1);
        });

        it('should preset input with mySelectedItem', function () {
            scope.selectedValue = 'selected-value';
            scope.$digest();

            expect(element.find('input').val()).toEqual('selected-value');
        });

        it('should render myValues', inject(function ($timeout, $material) {
            scope.values = ['tag1', 'tag2'];
            scope.$digest();

            element.find('input').triggerHandler('focus');
            $timeout.flush();
            $material.flushOutstandingAnimations();
            scope.$digest();

            var tags = angular.element(document).find('md-virtual-repeat-container').find('span');

            expect(tags.length).toBe(2);
            expect(tags[0].innerText).toBe('tag1');
            expect(tags[1].innerText).toBe('tag2');
        }));

        it('should reduce suggestions to current input value', inject(function ($timeout, $material) {
            scope.values = ['tag', 'other'];
            scope.$digest();

            element.find('input').triggerHandler('focus');
            $timeout.flush(250);
            $material.flushOutstandingAnimations();
            scope.$digest();
            element.find('input').val('oth').triggerHandler('input');
            $timeout.flush(250);
            scope.$digest();

            var tags = angular.element(document).find('md-autocomplete-parent-scope');

            expect(tags.length).toBe(1);
            expect(tags[0].innerText).toBe('other');
        }));

        it('should suggest current input value', inject(function ($timeout, $material) {
            element.find('input').triggerHandler('focus');
            $timeout.flush(250);
            $material.flushOutstandingAnimations();
            scope.$digest();
            element.find('input').val('oth').triggerHandler('input');
            $timeout.flush(250);
            scope.$digest();

            var tags = angular.element(document).find('md-autocomplete-parent-scope');

            expect(tags.length).toBe(1);
            expect(tags[0].innerText).toBe('oth');
        }));

        it('should emit onClear event when mySelectedValue is empty', inject(function ($timeout) {
            scope.selectedValue = 'selected-value';
            scope.$digest();

            element.find('input').val('').triggerHandler('input');
            $timeout.flush(250);
            scope.$digest();

            expect(myOnClear).toHaveBeenCalled();
            expect(myOnSelect).not.toHaveBeenCalled();
        }));

        it('should emit onClear event when clear button clicked', inject(function ($timeout) {
            scope.selectedValue = 'selected-value';
            $timeout.flush();
            scope.$digest();

            element.find('button')[0].click();
            $timeout.flush();
            scope.$digest();

            expect(myOnClear).toHaveBeenCalled();
            expect(myOnSelect).not.toHaveBeenCalled();
        }));
    });
});
