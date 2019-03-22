import React from 'react'
import {connect} from 'react-redux'
import {fetchFeeds, filteredBySearchFeedsSelector, routeChange, routeSelector} from '../../store'
import {FeedListPage} from '../../pages'
import {adminFeedRoute} from '../../routes'

const mapStateToProps = state => ({
  ...filteredBySearchFeedsSelector(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onSearchChange: params => dispatch(routeChange(adminFeedRoute(params))),
  onRefresh: () => dispatch(fetchFeeds())
})

const FeedListPageContainer = props => <FeedListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedListPageContainer)
