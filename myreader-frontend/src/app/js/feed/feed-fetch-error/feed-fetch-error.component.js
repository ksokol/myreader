import template from './feed-fetch-error.component.html'
import './feed-fetch-error.component.css'
import React from 'react'
import PropTypes from 'prop-types'
import {feedFetchFailuresSelector, fetchFeedFetchFailures} from '../../store'
import {Button, IntersectionObserver} from '../../components'

/**
 * @deprecated
 */
export const FeedFetchErrorLoadMore = props => {
  return (
    <IntersectionObserver onIntersection={props.onClick}>
      <Button disabled={props.disabled} onClick={props.onClick}>
        Load More
      </Button>
    </IntersectionObserver>
  )
}

FeedFetchErrorLoadMore.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

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
      ...feedFetchFailuresSelector(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      onMore: () => dispatch(fetchFeedFetchFailures(this.links.next))
    }
  }

  get loadMoreProps() {
    return {
      disabled: this.fetchFailuresLoading,
      onClick: this.onMore,
      onIntersection: this.onMore
    }
  }

  createdAtProp(item) {
    return {
      date: item.createdAt
    }
  }
}

export const FeedFetchErrorComponent = {
  template, controller
}
