import React from 'react'
import {FeedEditForm} from '../../components'
import {
  deleteFeed,
  feedEditFormChangeData,
  feedEditFormSelector,
  feedFetchFailuresSelector,
  fetchFeedFetchFailures,
  saveFeedEditForm
} from '../../store'
import {connect} from 'react-redux'

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

const FeedEditPage = props => <FeedEditForm {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedEditPage)
