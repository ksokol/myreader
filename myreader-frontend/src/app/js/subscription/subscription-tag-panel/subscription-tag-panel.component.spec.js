describe('src/app/js/subscription/subscription-tag-panel/subscription-tag-panel.component.spec.js', function () {

    describe('controller', function () {

        var component, subscriptionTagService;

        beforeEach(require('angular').mock.module('myreader'));

        beforeEach(inject(function (_$componentController_) {
            subscriptionTagService = jasmine.createSpyObj('subscriptionTagService', ['findAll']);
            component = _$componentController_('mySubscriptionTagPanel', { subscriptionTagService: subscriptionTagService });
        }));

        it('should call subscriptionTagService when loadTags() called on component', function () {
            component.loadTags();
            expect(subscriptionTagService.findAll).toHaveBeenCalledWith();
        });
    });

    describe('with html', function () {

        var testUtils = require('../../shared/test-utils');

        var myAutocompleteInput = testUtils.componentMock('myAutocompleteInput');

        var scope, element;

        beforeEach(require('angular').mock.module('myreader', myAutocompleteInput));

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();

            scope.myDisabled = true;
            scope.mySelectedItem = 'selectedItem';
            scope.myOnSelect = jasmine.createSpy('myOnSelect');
            scope.myOnClear = jasmine.createSpy('myOnClear');
            scope.myAsyncValues = jasmine.createSpy('myAsyncValues');

            element = $compile('<my-autocomplete-input ' +
                'my-label="label"' +
                'my-selected-item="mySelectedItem"' +
                'my-on-select="myOnSelect({value: value})"' +
                'my-on-clear="myOnClear()"' +
                'my-async-values="myAsyncValues()"' +
                'my-disabled="myDisabled">' +
                '</my-autocomplete-input>')(scope);

            scope.$digest();
        }));

        it('should forward binding parameters to child component', function () {
            expect(myAutocompleteInput.bindings.myLabel).toEqual('label');
            expect(myAutocompleteInput.bindings.myDisabled).toEqual(scope.myDisabled);
            expect(myAutocompleteInput.bindings.mySelectedItem).toEqual(scope.mySelectedItem);
        });

        it('should forward binding parameter myOnSelect to child component', function () {
            myAutocompleteInput.bindings.myOnSelect({ value: 'expected value'});
            expect(scope.myOnSelect).toHaveBeenCalledWith({ value: 'expected value'});
        });

        it('should forward binding parameter myOnClear to child component', function () {
            myAutocompleteInput.bindings.myOnClear();
            expect(scope.myOnClear).toHaveBeenCalledWith();
        });

        it('should forward binding parameter myAsyncValues to child component', function () {
            myAutocompleteInput.bindings.myAsyncValues();
            expect(scope.myAsyncValues).toHaveBeenCalledWith();
        });

        it('should set binding parameters in component template', inject(function ($compile) {
            element = $compile(require('./subscription-tag-panel.component.html'))(scope);
            expect(element.attr('my-label')).toEqual('Tag');
            expect(element.attr('my-disabled')).toEqual('$ctrl.myDisabled');
            expect(element.attr('my-selected-item')).toEqual('$ctrl.mySelectedItem');
            expect(element.attr('my-async-values')).toEqual('$ctrl.loadTags()');
            expect(element.attr('my-on-select')).toEqual('$ctrl.myOnSelect({value: value})');
            expect(element.attr('my-on-clear')).toEqual('$ctrl.myOnClear()');
        }));
    });
});
