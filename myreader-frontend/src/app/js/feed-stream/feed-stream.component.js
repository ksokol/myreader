import template from './feed-stream.component.html'
import {
  changeEntry,
  entryFocusNext,
  entryFocusPrevious,
  fetchSubscriptions,
  getEntryInFocus,
  getNextFocusableEntry,
  mediaBreakpointIsDesktopSelector,
  routeChange,
  routeSelector
} from '../store'
import {EntryListContainer} from '../containers'

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
  }

  $onInit() {
    this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis.bind(this))(this)
  }

  $onDestroy() {
    this.unsubscribe()
  }

  mapStateToThis(state) {
    return {
      entryInFocus: getEntryInFocus(state),
      nextFocusableEntry: getNextFocusableEntry(state),
      isDesktop: mediaBreakpointIsDesktopSelector(state),
      ...routeSelector(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      navigateTo: (params, options) => dispatch(routeChange(['app', 'entries'], params, options)),
      previousEntry: () => dispatch(entryFocusPrevious()),
      toggleEntryReadFlag: () => dispatch(changeEntry({...this.entryInFocus, seen: !this.entryInFocus.seen})),
      nextEntry: () => {
        if (this.nextFocusableEntry.seen === false) {
          dispatch(changeEntry({...this.nextFocusableEntry, seen: true}))
        }
        dispatch(entryFocusNext())
      },
      refresh: () => {
        dispatch(fetchSubscriptions())
        this.navigateTo(this.router.query, {reload: true})
      }
    }
  }

  get entryListContainerProps() {
    return {
      component: () => EntryListContainer
    }
  }
}

export const FeedStreamComponent = {
  template, controller
}
