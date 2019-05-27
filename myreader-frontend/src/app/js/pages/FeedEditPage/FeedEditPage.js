import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {FeedEditForm} from '../../components'
import {withLocationState, withNotification} from '../../contexts'
import {
  deleteFeed,
  feedDeleted,
  feedFetchFailuresClear,
  feedFetchFailuresSelector,
  fetchFeed,
  fetchFeedFetchFailures,
  saveFeed,
  showErrorNotification
} from '../../store'
import {ADMIN_FEEDS_URL, FEEDS} from '../../constants'
import {toFeed} from '../../store/admin/feed'

const mapStateToProps = state => ({
  ...feedFetchFailuresSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onMore: fetchFeedFetchFailures,
  feedFetchFailuresClear,
  fetchFeedFetchFailures,
  fetchFeed,
  saveFeed,
  deleteFeed
}, dispatch)

class FeedEditPage extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired,
    historyReplace: PropTypes.func.isRequired,
    feedFetchFailuresClear: PropTypes.func.isRequired,
    fetchFeedFetchFailures: PropTypes.func.isRequired,
    fetchFeed: PropTypes.func.isRequired,
    saveFeed: PropTypes.func.isRequired,
    deleteFeed: PropTypes.func.isRequired,
    showSuccessNotification: PropTypes.func.isRequired
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
    const {uuid} = this.props.params

    this.props.feedFetchFailuresClear()
    this.props.fetchFeedFetchFailures({path: `${FEEDS}/${uuid}/fetchError`})
    this.loadFeed(uuid)
  }

  loadFeed = uuid => {
    this.props.fetchFeed({
      uuid,
      success: response => this.setState({feed: toFeed(response)})
    })
  }

  onSaveFeed = feed => {
    this.setState({
      changePending: true,
      validations: []
    })

    this.props.saveFeed({
      feed,
      success: () => this.props.showSuccessNotification('Feed saved'),
      error: error => {
        if (error.status === 400) {
          this.setState({
            validations: error.fieldErrors
          })
          return []
        }
        return undefined
      },
      finalize: () => {
        this.setState({
          changePending: false
        })
      }
    })
  }

  onDeleteFeed = uuid => {
    this.setState({
      changePending: true
    })

    this.props.deleteFeed({
      uuid,
      success: () => {
        this.props.historyReplace({pathname: ADMIN_FEEDS_URL})
        return () => feedDeleted(uuid)
      },
      error: (response, headers, status) => {
        this.setState({
          changePending: false
        })
        return (status === 409 && showErrorNotification('Can not delete. Feed has subscriptions'))
          || (status !== 400 && showErrorNotification(response))
          || undefined
      }
    })
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

export default withLocationState(
  withNotification(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(FeedEditPage)
  )
)
