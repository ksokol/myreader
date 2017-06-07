describe('src/app/js/shared/component/autocomplete-input/autocomplete-input.component.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader', 'ngMaterial-mock'));

    describe('controller', function () {

        var rootScope, componentController, myAsyncValues;

        beforeEach(inject(function ($rootScope, $q, _$componentController_) {
            rootScope = $rootScope;
            componentController = _$componentController_;
            myAsyncValues = jasmine.createSpy('myAsyncValues()');

            var deferred = $q.defer();
            deferred.resolve(['v3', 'v4']);
            myAsyncValues.and.returnValue(deferred.promise);
        }));

        it('should throw error when myLabel is not set', function () {
            var component = componentController('myAutocompleteInput');
            expect(function () {
                component.$onInit();
            }).toThrowError('myLabel is undefined');
        });

        it('should cache result of myAsyncValues()', function () {
            var component = componentController('myAutocompleteInput', null, { myLabel: 'label', myAsyncValues: myAsyncValues });

            component.filterValues('v');
            rootScope.$digest();
            expect(myAsyncValues).toHaveBeenCalledTimes(1);

            component.filterValues('v');
            rootScope.$digest();
            expect(myAsyncValues).toHaveBeenCalledTimes(1);
        });

        it('should call myAsyncValues() a second time when myValues changed', function () {
            var component = componentController('myAutocompleteInput', null, { myLabel: 'label', myAsyncValues: myAsyncValues });

            component.filterValues('');
            rootScope.$digest();

            component.$onChanges({ myValues: { currentValue: [ 'value' ]}});

            component.filterValues('');
            rootScope.$digest();
            expect(myAsyncValues).toHaveBeenCalledTimes(2);
        });
    });

    describe('with html', function () {

        var rootScope, scope, compile, element, myOnSelect, myOnClear;

        beforeEach(inject(function ($rootScope, $compile) {
            myOnSelect = jasmine.createSpy('myOnSelect');
            myOnClear = jasmine.createSpy('myOnClear');

            compile = $compile;
            rootScope = $rootScope;
            scope = rootScope.$new();
            scope.myOnSelect = myOnSelect;
            scope.myOnClear = myOnClear;
            scope.label = 'a label';

            element = compile('<my-autocomplete-input ' +
                                'my-label="{{label}}" ' +
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

        it('should enable input element when myDisabled is false', function () {
            expect(element.find('input').attr('disabled')).toBeUndefined();
        });

        it('should disable input element when myDisabled is true', function () {
            scope.myDisabled = true;
            element = compile('<my-autocomplete-input ' +
                'my-label="{{label}}" ' +
                'my-disabled="myDisabled">' +
                '</my-autocomplete-input>')(scope);
            scope.$digest();

            expect(element.find('input').attr('disabled')).toEqual('disabled');
        });

        it('should preset input with mySelectedItem', function () {
            scope.selectedValue = 'selected-value';

            element = compile('<my-autocomplete-input ' +
                'my-label="{{label}}" ' +
                'my-selected-item="selectedValue">' +
                '</my-autocomplete-input>')(scope);
            scope.$digest();

            expect(element.find('input').val()).toEqual('selected-value');
        });

        it('should not update input value when mySelectedItem changed', function () {
            scope.selectedValue = 'selected-value';

            element = compile('<my-autocomplete-input ' +
                'my-label="{{label}}" ' +
                'my-selected-item="selectedValue">' +
                '</my-autocomplete-input>')(scope);
            scope.$digest();

            scope.selectedValue = 'change';
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

        it('should emit onClear event when input value is empty', inject(function ($timeout) {
            scope.selectedValue = 'selected-value';

            element = compile('<my-autocomplete-input ' +
                'my-label="{{label}}" ' +
                'my-selected-item="selectedValue" ' +
                'my-on-select="myOnSelect(value)" ' +
                'my-on-clear="myOnClear()">' +
                '</my-autocomplete-input>')(scope);

            scope.$digest();

            element.find('input').val('').triggerHandler('input');
            $timeout.flush(250);
            scope.$digest();

            expect(myOnClear).toHaveBeenCalled();
            expect(myOnSelect).not.toHaveBeenCalled();
        }));

        it('should emit onClear event when clear button clicked', inject(function ($timeout) {
            scope.selectedValue = 'selected-value';

            element = compile('<my-autocomplete-input ' +
                'my-label="{{label}}" ' +
                'my-selected-item="selectedValue" ' +
                'my-on-select="myOnSelect(value)" ' +
                'my-on-clear="myOnClear()">' +
                '</my-autocomplete-input>')(scope);

            $timeout.flush();
            scope.$digest();

            element.find('button')[0].click();
            $timeout.flush();
            scope.$digest();

            expect(myOnClear).toHaveBeenCalled();
            expect(myOnSelect).not.toHaveBeenCalled();
        }));

        describe('with async values', function () {

            var deferred;

            beforeEach(inject(function ($q) {
                deferred = $q.defer();

                scope.myAsyncValues = jasmine.createSpy('myAsyncValues()');
                scope.myAsyncValues.and.callFake(function () { return deferred.promise; });

                element = compile('<my-autocomplete-input ' +
                    'my-label="{{label}}" ' +
                    'my-values="myValues" ' +
                    'my-async-values="myAsyncValues()" ' +
                    'my-on-select="myOnSelect(value)">' +
                    '</my-autocomplete-input>')(scope);
                scope.$digest();
            }));

            it('should render suggestion when loaded', inject(function ($timeout, $material) {
                element.find('input').triggerHandler('focus');
                $timeout.flush(250);
                $material.flushOutstandingAnimations();
                deferred.resolve(['value1', 'value2']);
                scope.$digest();

                var tags = angular.element(document).find('md-virtual-repeat-container').find('span');
                expect(tags.length).toBe(2);
                expect(tags[0].innerText).toBe('value1');
                expect(tags[1].innerText).toBe('value2');
            }));

            it('should render suggestions merged from myValues and myAsyncValues', inject(function ($timeout, $material) {
                scope.myValues = [ 'value1', 'value2' ];
                element.find('input').triggerHandler('focus');
                $timeout.flush(250);
                $material.flushOutstandingAnimations();
                deferred.resolve(['value3', 'value4']);
                scope.$digest();

                var tags = angular.element(document).find('md-virtual-repeat-container').find('span');

                expect(tags.length).toBe(4);
                expect(tags[0].innerText).toBe('value1');
                expect(tags[1].innerText).toBe('value2');
                expect(tags[2].innerText).toBe('value3');
                expect(tags[3].innerText).toBe('value4');
            }));
        });
    });
});
