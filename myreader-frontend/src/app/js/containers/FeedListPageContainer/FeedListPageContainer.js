import React from 'react'
import {connect} from 'react-redux'
import {fetchFeeds, filteredBySearchFeedsSelector, routeChange, routeSelector} from '../../store'
import {FeedListPage} from '../../components'

const mapStateToProps = state => ({
  ...filteredBySearchFeedsSelector(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  navigateTo: feed => dispatch(routeChange(['admin', 'feed-detail'], {uuid: feed.uuid})),
  onSearchChange: params => dispatch(routeChange(['admin', 'feed'], params)),
  onRefresh: () => dispatch(fetchFeeds())
})

const FeedListPageContainer = props => <FeedListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedListPageContainer)
