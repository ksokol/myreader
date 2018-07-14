import template from './entry-list.component.html'
import './entry-list.component.css'
import {
  changeEntry,
  entryClear,
  fetchEntries,
  getEntries,
  mediaBreakpointIsDesktopSelector,
  settingsShowEntryDetailsSelector
} from '../store'

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
    this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
  }

  $onDestroy() {
    this.unsubscribe()
    this.$ngRedux.dispatch(entryClear())
  }

  mapStateToThis(state) {
    return {
      ...getEntries(state),
      showEntryDetails: settingsShowEntryDetailsSelector(state),
      isDesktop: mediaBreakpointIsDesktopSelector(state)
    }
  }

  isFocused(item) {
    return this.entryInFocus.uuid === item.uuid
  }

  loadMore(more) {
    this.$ngRedux.dispatch(fetchEntries(more))
  }

  entryProps(entry) {
    return {
      item: entry,
      showEntryDetails: this.showEntryDetails,
      isDesktop: this.isDesktop,
      onChange: item => this.$ngRedux.dispatch(changeEntry(item))
    }
  }
}

export const EntryListComponent = {
  template, controller
}
