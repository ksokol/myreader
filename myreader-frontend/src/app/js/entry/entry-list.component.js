import template from './entry-list.component.html'
import './entry-list.component.css'
import React from 'react'
import PropTypes from 'prop-types'
import {
  changeEntry,
  entryClear,
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
    this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)

    this.loadMore = this.loadMore.bind(this)
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

  loadMore() {
    this.$ngRedux.dispatch(fetchEntries(this.links.next))
  }

  entryProps(entry) {
    return {
      item: entry,
      showEntryDetails: this.showEntryDetails,
      isDesktop: this.isDesktop,
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
