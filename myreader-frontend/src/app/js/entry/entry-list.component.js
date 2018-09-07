import {
  changeEntry,
  fetchEntries,
  getEntries,
  mediaBreakpointIsDesktopSelector,
  settingsShowEntryDetailsSelector
} from '../store'

class controller {

  constructor($ngRedux) {
    'ngInject'

    this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis.bind(this))(this)
  }

  $onDestroy() {
    this.unsubscribe()
  }

  mapStateToThis(state) {
    return {
      ...getEntries(state),
      showEntryDetails: settingsShowEntryDetailsSelector(state),
      isDesktop: mediaBreakpointIsDesktopSelector(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      loadMore: link => dispatch(fetchEntries(link)),
      onChange: item => dispatch(changeEntry(item))
    }
  }

  get props() {
    return {
      links: this.links,
      entries: [...this.entries],
      showEntryDetails: this.showEntryDetails,
      isDesktop: this.isDesktop,
      focusUuid: this.entryInFocus && this.entryInFocus.uuid,
      loading: this.loading,
      onChangeEntry: this.onChange,
      onLoadMore: this.loadMore
    }
  }
}

/**
 * @deprecated
 */
export const EntryListComponent = {
  template: '<react-component name="EntryList" props="$ctrl.props"></react-component>',
  controller
}
