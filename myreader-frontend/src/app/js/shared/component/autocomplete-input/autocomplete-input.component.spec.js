import {componentMock} from 'shared/test-utils'

class AutcompletePage {

    constructor(el, $scope, $timeout) {
        this.el = el
        this.$scope = $scope
        this.$timeout = $timeout
    }

    get label() {
        return this.el.find('label')[0]
    }

    get input() {
        return this.el.find('input')
    }

    get autocompleteSuggestionsComponent() {
        return this.el.find('my-autocomplete-suggestions')[0]
    }

    focusInput() {
        this.input.triggerHandler('focus')
        this.$scope.$digest()
    }

    blurInput() {
        this.input.triggerHandler('blur')
        this.$timeout.flush(100)
        this.$scope.$digest()
    }

    enterInput(value) {
        this.input.val(value).triggerHandler('change')
        this.$timeout.flush(100)
        this.$scope.$digest()
    }
}

describe('src/app/js/shared/component/autocomplete-input/autocomplete-input.component.spec.js', () => {

    let page, rootScope, scope, compile, timeout, element, myOnSelect, myOnClear, myAutocompleteSuggestions

    beforeEach(() => {
        jasmine.clock().uninstall()
        myAutocompleteSuggestions = componentMock('myAutocompleteSuggestions')
        angular.mock.module('myreader', myAutocompleteSuggestions)
    })

    beforeEach(inject(($rootScope, $compile, $timeout) => {
        myOnSelect = jasmine.createSpy('myOnSelect')
        myOnClear = jasmine.createSpy('myOnClear')

        compile = $compile
        rootScope = $rootScope
        timeout = $timeout
        scope = rootScope.$new(true)
        scope.myOnSelect = myOnSelect
        scope.myOnClear = myOnClear
        scope.label = 'a label'

        element = compile(`<my-autocomplete-input
                               my-label="label"
                               my-selected-item="selectedValue"
                               my-disabled="disabled"
                               my-values="values"
                               my-selected-item="selectedValue"
                               my-on-select="myOnSelect(value)"
                               my-on-clear="myOnClear()">
                           </my-autocomplete-input>`)(scope)
        page = new AutcompletePage(element, scope, $timeout)
        scope.$digest()
    }))

    it('should render label text', () => {
        expect(page.label.innerText).toEqual('a label')
    })

    it('should not render label text when binding value is undefined', () => {
        scope.label = undefined
        scope.$digest()
        expect(page.label).toBeUndefined()
    })

    it('should enable input element when myDisabled is false', () => {
        expect(page.input.attr('disabled')).toBeUndefined()
    })

    it('should disable input element when myDisabled is true', () => {
        scope.disabled = true
        scope.$digest()

        expect(page.input.attr('disabled')).toEqual('disabled')
    })

    it('should preset input with mySelectedItem', () => {
        scope.selectedValue = 'selected-value'
        scope.$digest()

        expect(page.input.val()).toEqual('selected-value')
    })

    it('should not create suggestions component when input is not focused', () => {
        expect(page.autocompleteSuggestionsComponent).toBeUndefined()
    })

    it('should create suggestions component when input is focused', () => {
        scope.values = ['irrelevant']
        scope.$digest()
        page.focusInput()

        expect(page.autocompleteSuggestionsComponent).toBeDefined()
    })

    it('should pass values to suggestions component bindings', () => {
        scope.values = ['tag1', 'tag2']
        scope.selectedValue = 'expected term value'
        scope.$digest()
        page.focusInput()

        expect(myAutocompleteSuggestions.bindings.myValues).toEqual(['tag1', 'tag2'])
        expect(myAutocompleteSuggestions.bindings.myCurrentTerm).toEqual('expected term value')
    })

    it('should pass changed input value to suggestions component', () => {
        scope.values = ['tag']
        scope.$digest()
        page.focusInput()

        page.enterInput('ta')
        expect(myAutocompleteSuggestions.bindings.myCurrentTerm).toEqual('ta')

        page.enterInput('tag')
        expect(myAutocompleteSuggestions.bindings.myCurrentTerm).toEqual('tag')
    })

    it('should destroy suggestions component when input field left', () => {
        scope.values = ['tag']
        scope.$digest()

        page.focusInput()
        expect(page.autocompleteSuggestionsComponent).toBeDefined()

        page.blurInput()
        expect(page.autocompleteSuggestionsComponent).toBeUndefined()
    })

    it('should emit entered value', () => {
        page.enterInput('expected value')

        expect(myOnClear).not.toHaveBeenCalled()
        expect(myOnSelect).toHaveBeenCalledWith('expected value')
    })

    it('should emit myOnSelect event with null value when input value is null', () => {
        page.enterInput(null)

        expect(myOnSelect).toHaveBeenCalledWith(null)
    })

    it('should emit myOnSelect event with null value when input value is empty string', () => {
        page.enterInput('')

        expect(myOnSelect).toHaveBeenCalledWith(null)
    })

    it('should emit myOnSelect event from suggestions component', () => {
        scope.values = ['irrelevant']
        scope.$digest()

        page.focusInput()
        myAutocompleteSuggestions.bindings.myOnSelect({term: 'expected value'})

        expect(myOnClear).not.toHaveBeenCalled()
        expect(myOnSelect).toHaveBeenCalledWith('expected value')
    })

    it('should destroy suggestions component when myOnSelect event emitted', () => {
        scope.values = ['irrelevant']
        scope.$digest()

        page.focusInput()
        myAutocompleteSuggestions.bindings.myOnSelect({term: 'expected value'})
        timeout.flush(100)
        scope.$digest()

        expect(page.autocompleteSuggestionsComponent).toBeUndefined()
    })
})
