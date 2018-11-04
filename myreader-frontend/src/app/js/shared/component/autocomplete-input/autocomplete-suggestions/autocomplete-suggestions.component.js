import template from './autocomplete-suggestions.component.html'
import './autocomplete-suggestions.component.css'
import {isDefined} from '../../../../shared/utils'

class controller {

  $onInit() {
    this.filteredValues = []
  }

  $onChanges(changes) {
    this.resetIndexSelected()
    if (isDefined(changes.myValues) && isDefined(changes.myValues.currentValue)) {
      this.source = [...changes.myValues.currentValue]
    }
  }

  onDown() {
    const index = isDefined(this.indexSelected) ? this.indexSelected + 1 : 0
    this.indexSelected = index < this.filteredValues.length ? index : this.indexSelected
  }

  onUp() {
    this.indexSelected = this.indexSelected > 0 ? this.indexSelected - 1 : undefined
  }

  onEnter() {
    if (isDefined(this.indexSelected)) {
      this.onSelectSuggestion(this.filteredValues[this.indexSelected])
      this.resetIndexSelected()
    }
  }

  onEscape() {
    this.onSelectSuggestion(this.myCurrentTerm)
    this.resetIndexSelected()
  }

  onSelectSuggestion(term) {
    this.myOnSelect({term})
    this.resetIndexSelected()
  }

  filterSuggestions() {
    this.filteredValues = this.myCurrentTerm ? this.source.filter(it => it.startsWith(this.myCurrentTerm)) : this.source
  }

  resetIndexSelected() {
    this.indexSelected = undefined
  }

  suggestionItemProp(term) {
    return {
      term,
      termFragment: this.myCurrentTerm
    }
  }
}

export const AutocompleteSuggestionsComponent = {
  template,
  controller,
  bindings: {
    myValues: '<',
    myCurrentTerm: '<',
    myOnSelect: '&'
  }
}
