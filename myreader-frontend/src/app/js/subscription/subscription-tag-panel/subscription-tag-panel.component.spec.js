import {componentMock} from '../../shared/test-utils'

describe('src/app/js/subscription/subscription-tag-panel/subscription-tag-panel.component.spec.js', () => {

    let scope, element, myAutocompleteInput

    beforeEach(() => {
        myAutocompleteInput = componentMock('myAutocompleteInput')
        angular.mock.module('myreader', myAutocompleteInput)
    })

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new(true)

        scope.myDisabled = true
        scope.mySelectedItem = 'selectedItem'
        scope.myOnSelect = jasmine.createSpy('myOnSelect')
        scope.myOnClear = jasmine.createSpy('myOnClear')
        scope.myValues = ['t1', 't2']

        element = $compile(`<my-autocomplete-input
                              my-label="label"
                              my-selected-item="mySelectedItem"
                              my-on-select="myOnSelect({value: value})"
                              my-on-clear="myOnClear()"
                              my-values="myValues"
                              my-disabled="myDisabled">
                            </my-autocomplete-input>`)(scope)
        scope.$digest()
    }))

    it('should forward binding parameters to child component', () => {
        expect(myAutocompleteInput.bindings.myLabel).toEqual('label')
        expect(myAutocompleteInput.bindings.myDisabled).toEqual(scope.myDisabled)
        expect(myAutocompleteInput.bindings.mySelectedItem).toEqual(scope.mySelectedItem)
        expect(myAutocompleteInput.bindings.myValues).toEqual(scope.myValues)
    })

    it('should forward binding parameter myOnSelect to child component', () => {
        myAutocompleteInput.bindings.myOnSelect({value: 'expected value'})
        expect(scope.myOnSelect).toHaveBeenCalledWith({ value: 'expected value'})
    })

    it('should forward binding parameter myOnClear to child component', () => {
        myAutocompleteInput.bindings.myOnClear()
        expect(scope.myOnClear).toHaveBeenCalledWith()
    })
})
