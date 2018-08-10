import template from './entry-list.component.html'
import './entry-list.component.css'
import React from 'react'
import PropTypes from 'prop-types'
import {
  changeEntry,
  fetchEntries,
  getEntries,
  mediaBreakpointIsDesktopSelector,
  settingsShowEntryDetailsSelector
} from '../store'
import {Button} from '../shared/component/buttons'
import {IntersectionObserver} from '../shared/component/intersection-observer'

/**
 * @deprecated
 */
export const EntryListLoadMore = props => {
  return (
    <IntersectionObserver onIntersection={props.onClick}>
      <Button onClick={props.onClick}
              disabled={props.disabled}>
        Load More
      </Button>
    </IntersectionObserver>
  )
}

EntryListLoadMore.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux

    this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis.bind(this))(this)
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
      loadMore: () => dispatch(fetchEntries(this.links.next))
    }
  }

  entryProps(entry) {
    return {
      item: entry,
      showEntryDetails: this.showEntryDetails,
      isDesktop: this.isDesktop,
      focusUuid: this.entryInFocus && this.entryInFocus.uuid,
      onChange: item => this.$ngRedux.dispatch(changeEntry(item))
    }
  }

  get loadMoreProps() {
    return {
      disabled: this.loading,
      onClick: this.loadMore,
      onIntersection: this.loadMore
    }
  }
}

export const EntryListComponent = {
  template, controller
}
