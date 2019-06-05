import React from 'react'
import PropTypes from 'prop-types'
import {FeedEditForm} from '../../components/FeedEditForm/FeedEditForm'
import {withLocationState, withNotification} from '../../contexts'
import {ADMIN_FEEDS_URL} from '../../constants'
import {feedApi} from '../../api'

class FeedEditPage extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired,
    historyReplace: PropTypes.func.isRequired,
    showSuccessNotification: PropTypes.func.isRequired,
    showErrorNotification: PropTypes.func.isRequired
  }

  state = {
    feed: null,
    changePending: false,
    validations: []
  }

  componentDidMount = async () => {
    await this.loadFeed(this.props.params.uuid)
  }

  loadFeed = async uuid => {
    try {
      const feed = await feedApi.fetchFeed(uuid)
      this.setState({
        feed
      })
    } catch(error) {
      this.props.showErrorNotification(error)
    }
  }

  onSaveFeed = async feed => {
    this.setState({
      changePending: true,
      validations: []
    })

    try {
      await feedApi.saveFeed(feed)
      this.props.showSuccessNotification('Feed saved')
    } catch(error) {
      if (error.status === 400) {
        this.setState({
          validations: error.data.fieldErrors
        })
      } else {
        this.props.showErrorNotification(error)
      }
    } finally {
      this.setState({
        changePending: false
      })
    }
  }

  onDeleteFeed = async uuid => {
    this.setState({
      changePending: true
    })

    try {
      await feedApi.deleteFeed(uuid)
      this.props.historyReplace({pathname: ADMIN_FEEDS_URL})
    } catch(error) {
      this.setState({
        changePending: false
      })
      if (error.status === 409) {
        this.props.showErrorNotification('Can not delete. Feed has subscriptions')
      } else {
        this.props.showErrorNotification(error.data)
      }
    }
  }

  render() {
    const {
      feed,
      changePending,
      validations
    } = this.state

    return feed ? (
      <FeedEditForm
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
  withNotification(FeedEditPage)
)
