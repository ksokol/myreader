import React from 'react'
import {connect} from 'react-redux'
import {fetchFeeds, filteredBySearchFeedsSelector, routeChange, routeSelector} from '../../store'
import {FeedListPage} from '../../pages'
import {adminFeedDetailRoute, adminFeedRoute} from '../../routes'

const mapStateToProps = state => ({
  ...filteredBySearchFeedsSelector(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  navigateTo: feed => dispatch(routeChange(adminFeedDetailRoute(feed))),
  onSearchChange: params => dispatch(routeChange(adminFeedRoute(params))),
  onRefresh: () => dispatch(fetchFeeds())
})

const FeedListPageContainer = props => <FeedListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedListPageContainer)
