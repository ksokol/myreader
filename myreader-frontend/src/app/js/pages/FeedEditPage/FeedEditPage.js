import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {FeedEditForm} from '../../components'
import {
  clearFeedEditForm,
  deleteFeed,
  feedEditFormChangeData,
  feedEditFormSelector,
  feedFetchFailuresClear,
  feedFetchFailuresSelector,
  fetchFeedFetchFailures,
  loadFeedIntoEditForm,
  saveFeedEditForm
} from '../../store'
import {FEEDS} from '../../constants'

const mapStateToProps = state => ({
  ...feedEditFormSelector(state),
  ...feedFetchFailuresSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onChangeFormData: feedEditFormChangeData,
  onSaveFormData: saveFeedEditForm,
  onRemove: deleteFeed,
  onMore: fetchFeedFetchFailures,
  clearFeedEditForm,
  feedFetchFailuresClear,
  loadFeedIntoEditForm,
  fetchFeedFetchFailures,
}, dispatch)

class FeedEditPage extends React.Component {

  componentDidMount() {
    const {uuid} = this.props.match.params

    this.props.clearFeedEditForm()
    this.props.feedFetchFailuresClear()
    this.props.loadFeedIntoEditForm(uuid)
    this.props.fetchFeedFetchFailures({path: `${FEEDS}/${uuid}/fetchError`})
  }

  render = () => <FeedEditForm {...this.props} />
}

FeedEditPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  data: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  validations: PropTypes.any,
  failures: PropTypes.any,
  links: PropTypes.any,
  changePending: PropTypes.bool.isRequired,
  fetchFailuresLoading: PropTypes.bool.isRequired,
  onChangeFormData: PropTypes.func.isRequired,
  onSaveFormData: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMore: PropTypes.func.isRequired,
  clearFeedEditForm: PropTypes.func.isRequired,
  feedFetchFailuresClear: PropTypes.func.isRequired,
  loadFeedIntoEditForm: PropTypes.func.isRequired,
  fetchFeedFetchFailures: PropTypes.func.isRequired,
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FeedEditPage)
)
