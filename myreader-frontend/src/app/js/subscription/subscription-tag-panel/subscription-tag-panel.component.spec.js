import {mockNgRedux, componentMock} from '../../shared/test-utils'

describe('src/app/js/subscription/subscription-tag-panel/subscription-tag-panel.component.spec.js', () => {

    describe('controller', () => {

        let component, ngReduxMock

        beforeEach(angular.mock.module('myreader', mockNgRedux()))

        beforeEach(inject(($componentController, $ngRedux) => {
            ngReduxMock = $ngRedux
            component = $componentController('mySubscriptionTagPanel', {$ngRedux})
        }))

        it('should call subscriptionTagService when loadTags() called on component', () => {
            component.loadTags()
            expect(ngReduxMock.getActionTypes()).toEqual(['GET_SUBSCRIPTION_TAGS'])
        })
    })

    describe('with html', () => {

        const myAutocompleteInput = componentMock('myAutocompleteInput')
        let scope, element

        beforeEach(angular.mock.module('myreader', myAutocompleteInput))

        beforeEach(inject(($rootScope, $compile) => {
            scope = $rootScope.$new(true)

            scope.myDisabled = true
            scope.mySelectedItem = 'selectedItem'
            scope.myOnSelect = jasmine.createSpy('myOnSelect')
            scope.myOnClear = jasmine.createSpy('myOnClear')
            scope.myAsyncValues = jasmine.createSpy('myAsyncValues')

            element = $compile('<my-autocomplete-input ' +
                'my-label="label"' +
                'my-selected-item="mySelectedItem"' +
                'my-on-select="myOnSelect({value: value})"' +
                'my-on-clear="myOnClear()"' +
                'my-async-values="myAsyncValues()"' +
                'my-disabled="myDisabled">' +
                '</my-autocomplete-input>')(scope)

            scope.$digest()
        }))

        it('should forward binding parameters to child component', () => {
            expect(myAutocompleteInput.bindings.myLabel).toEqual('label')
            expect(myAutocompleteInput.bindings.myDisabled).toEqual(scope.myDisabled)
            expect(myAutocompleteInput.bindings.mySelectedItem).toEqual(scope.mySelectedItem)
        })

        it('should forward binding parameter myOnSelect to child component', () => {
            myAutocompleteInput.bindings.myOnSelect({value: 'expected value'})
            expect(scope.myOnSelect).toHaveBeenCalledWith({ value: 'expected value'})
        })

        it('should forward binding parameter myOnClear to child component', () => {
            myAutocompleteInput.bindings.myOnClear()
            expect(scope.myOnClear).toHaveBeenCalledWith()
        })

        it('should forward binding parameter myAsyncValues to child component', () => {
            myAutocompleteInput.bindings.myAsyncValues()
            expect(scope.myAsyncValues).toHaveBeenCalledWith()
        })

        it('should set binding parameters in component template', inject($compile => {
            element = $compile(require('./subscription-tag-panel.component.html'))(scope)
            expect(element.attr('my-label')).toEqual('Tag')
            expect(element.attr('my-disabled')).toEqual('$ctrl.myDisabled')
            expect(element.attr('my-selected-item')).toEqual('$ctrl.mySelectedItem')
            expect(element.attr('my-async-values')).toEqual('$ctrl.loadTags()')
            expect(element.attr('my-on-select')).toEqual('$ctrl.myOnSelect({value: value})')
            expect(element.attr('my-on-clear')).toEqual('$ctrl.myOnClear()')
        }))
    })
})
