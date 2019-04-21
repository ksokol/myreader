import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {SubscriptionEditForm} from '../../components'
import {
  addSubscriptionExclusionPattern,
  deleteSubscription,
  fetchSubscription,
  fetchSubscriptionExclusionPatterns,
  removeSubscriptionExclusionPattern,
  saveSubscriptionEditForm,
  showSuccessNotification,
  subscriptionDeleted,
  subscriptionExclusionPatternsSelector,
  subscriptionTagsSelector
} from '../../store'
import {toSubscription} from '../../store/subscription/subscription'
import {subscriptionsRoute} from '../../routes'

const mapStateToProps = (state, ownProps) => ({
  ...subscriptionTagsSelector(state),
  ...subscriptionExclusionPatternsSelector(ownProps.match.params.uuid)(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  removeSubscriptionExclusionPattern,
  addSubscriptionExclusionPattern,
  fetchSubscriptionExclusionPatterns
}, dispatch)

class SubscriptionEditPage extends React.Component {

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
    removeSubscriptionExclusionPattern: PropTypes.func.isRequired,
    addSubscriptionExclusionPattern: PropTypes.func.isRequired,
    fetchSubscriptionExclusionPatterns: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      subscription: null,
      changePending: false,
      validations: []
    }
  }

  componentDidMount() {
    const {uuid} = this.props.match.params

    this.props.fetchSubscriptionExclusionPatterns(uuid)
    this.loadSubscription(uuid)
  }

  loadSubscription = uuid => {
    this.props.dispatch(fetchSubscription({
      uuid,
      success: response => this.setState({subscription: toSubscription(response)})
    }))
  }

  onSaveSubscription = subscription => {
    this.setState({
      changePending: true,
      validations: []
    })

    this.props.dispatch(saveSubscriptionEditForm({
      subscription,
      success: () => showSuccessNotification('Subscription saved'),
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

  onDeleteSubscription = uuid => {
    this.setState({
      changePending: true
    })

    this.props.dispatch(deleteSubscription({
      uuid,
      success: [
        () => showSuccessNotification('Subscription deleted'),
        () => subscriptionDeleted(uuid),
        () => this.props.history.replace(subscriptionsRoute())
      ],
      finalize: () => {
        this.setState({
          changePending: false
        })
      }
    }))
  }

  render() {
    const {
      subscription,
      changePending,
      validations
    } = this.state

    return subscription ? (
      <SubscriptionEditForm
        {...this.props}
        data={subscription}
        changePending={changePending}
        validations={validations}
        saveSubscriptionEditForm={this.onSaveSubscription}
        deleteSubscription={this.onDeleteSubscription}
      />
    ) : null
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubscriptionEditPage)
)
