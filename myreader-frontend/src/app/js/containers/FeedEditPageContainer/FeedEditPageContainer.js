import React from 'react'
import {connect} from 'react-redux'
import {
  deleteFeed,
  feedEditFormChangeData,
  feedEditFormSelector,
  feedFetchFailuresSelector,
  fetchFeedFetchFailures,
  saveFeedEditForm
} from '../../store'
import {FeedEditPage} from '../../pages'

const mapStateToProps = state => ({
  ...feedEditFormSelector(state),
  ...feedFetchFailuresSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onChangeFormData: data => dispatch(feedEditFormChangeData(data)),
  onSaveFormData: data => dispatch(saveFeedEditForm(data)),
  onRemove: uuid => dispatch(deleteFeed(uuid)),
  onMore: link => dispatch(fetchFeedFetchFailures(link))
})

const FeedEditPageContainer = props => <FeedEditPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedEditPageContainer)
