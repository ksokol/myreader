import {componentMock, reactComponent} from '../../../shared/test-utils'

class AutcompletePage {

  constructor(el) {
    this.el = el
  }

  get autocompleteSuggestionsComponent() {
    return this.el.querySelectorAll('my-autocomplete-suggestions')[0]
  }
}

describe('src/app/js/shared/component/autocomplete-input/autocomplete-input.component.spec.js', () => {

  let page, rootScope, scope, compile, timeout, myOnSelect, myOnClear, autocompleteInput, myAutocompleteSuggestions

  beforeEach(() => {
    autocompleteInput = reactComponent('AutocompleteInput')
    myAutocompleteSuggestions = componentMock('myAutocompleteSuggestions')
    angular.mock.module('myreader', autocompleteInput, myAutocompleteSuggestions)
  })

  beforeEach(inject(($rootScope, $compile, $timeout) => {
    myOnSelect = jest.fn()
    myOnClear = jest.fn()

    compile = $compile
    rootScope = $rootScope
    timeout = $timeout
    scope = rootScope.$new(true)
    scope.myOnSelect = myOnSelect
    scope.myOnClear = myOnClear
    scope.label = 'a label'

    const element = compile(`<my-autocomplete-input
                               my-label="label"
                               my-selected-item="selectedValue"
                               my-disabled="disabled"
                               my-values="values"
                               my-selected-item="selectedValue"
                               my-on-select="myOnSelect(value)"
                               my-on-clear="myOnClear()">
                           </my-autocomplete-input>`)(scope)[0]
    page = new AutcompletePage(element)
    scope.$digest()
  }))

  it('should pass expected props to input component', () => {
    expect(autocompleteInput.bindings).toContainObject({
      label: 'a label',
      name: 'autocomplete-input',
      value: '',
      disabled: undefined
    })
  })

  it('should disable input element when myDisabled is true', () => {
    scope.disabled = true
    scope.$digest()

    expect(autocompleteInput.bindings).toContainObject({
      disabled: true
    })
  })

  it('should preset input with mySelectedItem', () => {
    scope.selectedValue = 'selected-value'
    scope.$digest()

    expect(autocompleteInput.bindings).toContainObject({
      value: 'selected-value'
    })
  })

  it('should not create suggestions component when input is not focused', () => {
    expect(page.autocompleteSuggestionsComponent).toBeUndefined()
  })

  it('should create suggestions component when input is focused', () => {
    scope.values = ['irrelevant']
    scope.$digest()
    autocompleteInput.bindings.onFocus()

    expect(page.autocompleteSuggestionsComponent).toBeDefined()
  })

  it('should pass values to suggestions component bindings', () => {
    scope.values = ['tag1', 'tag2']
    scope.selectedValue = 'expected term value'
    scope.$digest()
    autocompleteInput.bindings.onFocus()

    expect(myAutocompleteSuggestions.bindings.myValues).toEqual(['tag1', 'tag2'])
    expect(myAutocompleteSuggestions.bindings.myCurrentTerm).toEqual('expected term value')
  })

  it('should pass changed input value to suggestions component', () => {
    scope.values = ['tag']
    scope.$digest()

    autocompleteInput.bindings.onChange('ta')
    expect(myAutocompleteSuggestions.bindings.myCurrentTerm).toEqual('ta')

    autocompleteInput.bindings.onChange('tag')
    expect(myAutocompleteSuggestions.bindings.myCurrentTerm).toEqual('tag')
  })

  it('should destroy suggestions component when input field left', () => {
    scope.values = ['tag']
    scope.$digest()

    autocompleteInput.bindings.onFocus()
    expect(page.autocompleteSuggestionsComponent).toBeDefined()

    autocompleteInput.bindings.onBlur()
    timeout.flush(100)
    scope.$digest()
    expect(page.autocompleteSuggestionsComponent).toBeUndefined()
  })

  it('should emit entered value', () => {
    autocompleteInput.bindings.onChange('expected value')

    expect(myOnClear).not.toHaveBeenCalled()
    expect(myOnSelect).toHaveBeenCalledWith('expected value')
  })

  it('should emit myOnSelect event with null value when input value is null', () => {
    autocompleteInput.bindings.onChange(null)

    expect(myOnSelect).toHaveBeenCalledWith(null)
  })

  it('should pass empty string to prop "value" when entered input value is null', () => {
    autocompleteInput.bindings.onChange(null)

    expect(autocompleteInput.bindings.value).toEqual('')
  })

  it('should emit myOnSelect event with null value when input value is empty string', () => {
    autocompleteInput.bindings.onChange('')

    expect(myOnSelect).toHaveBeenCalledWith(null)
  })

  it('should emit myOnSelect event from suggestions component', () => {
    scope.values = ['irrelevant']
    scope.$digest()

    autocompleteInput.bindings.onFocus()
    myAutocompleteSuggestions.bindings.myOnSelect({term: 'expected value'})

    expect(myOnClear).not.toHaveBeenCalled()
    expect(myOnSelect).toHaveBeenCalledWith('expected value')
  })

  it('should destroy suggestions component when myOnSelect event emitted', () => {
    scope.values = ['irrelevant']
    scope.$digest()

    autocompleteInput.bindings.onFocus()
    myAutocompleteSuggestions.bindings.myOnSelect({term: 'expected value'})
    timeout.flush(100)
    scope.$digest()

    expect(page.autocompleteSuggestionsComponent).toBeUndefined()
  })
})
