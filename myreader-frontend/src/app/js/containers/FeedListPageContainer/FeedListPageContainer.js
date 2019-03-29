import React from 'react'
import {connect} from 'react-redux'
import {filteredBySearchFeedsSelector} from '../../store'
import {FeedListPage} from '../../pages'

const mapStateToProps = state => ({
  ...filteredBySearchFeedsSelector(state)
})

const FeedListPageContainer = props => <FeedListPage {...props} />

export default connect(
  mapStateToProps,
)(FeedListPageContainer)
