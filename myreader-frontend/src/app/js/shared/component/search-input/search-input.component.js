import template from './search-input.component.html'
import './search-input.component.css'
import {Input, withDebounce} from '../input'

/**
 * @deprecated
 */
export const SearchInput = withDebounce(Input, 250)

class controller {

  $onInit() {
    this.value = this.myValue || ''
  }

  get inputProps() {
    return {
      name: 'search-input',
      value: this.value,
      onChange: value => this.myOnChange({value})
    }
  }
}

export const SearchInputComponent = {
  template, controller,
  bindings: {
    myValue: '<',
    myOnChange: '&'
  }
}
