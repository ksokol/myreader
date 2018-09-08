import template from './autocomplete-input.component.html'
import './autocomplete-input.component.css'
import {Input} from '../../../components'

/**
 * @deprecated
 */
export const AutocompleteInput = Input

class controller {

  constructor($timeout) {
    'ngInject'
    this.$timeout = $timeout

    this.onFocus = this.onFocus.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  onSelect() {
    this.mySelectedItem && this.mySelectedItem.length !== 0 ?
      this.myOnSelect({value: this.mySelectedItem}) :
      this.myOnSelect({value: null})
  }

  onChange(value) {

    this.mySelectedItem = value
    this.onFocus()
    this.onSelect()
  }

  onFocus() {
    this.showSuggestions = (this.myValues || []).length > 0
  }

  onBlur() {
    this.$timeout(() => this.showSuggestions = false, 100)
  }

  onSelectSuggestion(term) {
    this.mySelectedItem = term
    this.onSelect()
    this.onBlur()
  }

  get inputProps() {
    return {
      label: this.myLabel,
      name: 'autocomplete-input',
      value: this.mySelectedItem || '',
      disabled: this.myDisabled,
      onFocus: this.onFocus,
      onChange: this.onChange,
      onBlur: this.onBlur
    }
  }
}

export const AutoCompleteInputComponent = {
  template, controller,
  bindings: {
    myLabel: '<',
    myDisabled: '<',
    mySelectedItem: '<',
    myValues: '<',
    myOnSelect: '&'
  }
}
