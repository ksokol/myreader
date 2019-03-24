import React from 'react'
import {connect} from 'react-redux'
import {fetchFeeds, filteredBySearchFeedsSelector} from '../../store'
import {FeedListPage} from '../../pages'

const mapStateToProps = state => ({
  ...filteredBySearchFeedsSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onRefresh: () => dispatch(fetchFeeds())
})

const FeedListPageContainer = props => <FeedListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedListPageContainer)
