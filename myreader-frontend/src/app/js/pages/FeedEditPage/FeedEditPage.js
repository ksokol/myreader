import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {FeedEditForm} from '../../components'
import {
  deleteFeed,
  feedDeleted,
  feedFetchFailuresClear,
  feedFetchFailuresSelector,
  fetchFeed,
  fetchFeedFetchFailures,
  saveFeed,
  showErrorNotification,
  showSuccessNotification
} from '../../store'
import {FEEDS} from '../../constants'
import {adminFeedRoute} from '../../routes'
import {toFeed} from '../../store/admin/feed'

const mapStateToProps = state => ({
  ...feedFetchFailuresSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onMore: fetchFeedFetchFailures,
  feedFetchFailuresClear,
  fetchFeedFetchFailures,
}, dispatch)

class FeedEditPage extends React.Component {

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    feedFetchFailuresClear: PropTypes.func.isRequired,
    fetchFeedFetchFailures: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      feed: null,
      changePending: false,
      validations: []
    }
  }

  componentDidMount() {
    const {uuid} = this.props.match.params

    this.props.feedFetchFailuresClear()
    this.props.fetchFeedFetchFailures({path: `${FEEDS}/${uuid}/fetchError`})
    this.loadFeed(uuid)
  }

  loadFeed = uuid => {
    this.props.dispatch(fetchFeed({
      uuid,
      success: response => this.setState({feed: toFeed(response)})
    }))
  }

  onSaveFeed = feed => {
    this.setState({
      changePending: true
    })

    this.props.dispatch(saveFeed({
      feed,
      success: () => showSuccessNotification('Feed saved'),
      error: error => {
        if (error.status === 400) {
          this.setState({validations: error.fieldErrors})
          return []
        }
      },
      finalize: () => {
        this.setState({
          changePending: false
        })
      }
    }))
  }

  onDeleteFeed = uuid => {
    this.setState({
      changePending: true
    })

    this.props.dispatch(deleteFeed({
      uuid,
      success: () => {
        this.props.history.replace(adminFeedRoute())
        return () => feedDeleted(uuid)
      },
      error: (response, headers, status) => {
        return (status === 409 && showErrorNotification('Can not delete. Feed has subscriptions'))
          || (status !== 400 && showErrorNotification(response))
          || undefined
      },
      finalize: () => {
        this.setState({
          changePending: false
        })
      }
    }))
  }

  render() {
    const {
      feed,
      changePending,
      validations
    } = this.state

    return feed ? (
      <FeedEditForm
        {...this.props}
        data={feed}
        changePending={changePending}
        validations={validations}
        onSaveFormData={this.onSaveFeed}
        onRemove={this.onDeleteFeed}
      />
    ) : null
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FeedEditPage)
)
