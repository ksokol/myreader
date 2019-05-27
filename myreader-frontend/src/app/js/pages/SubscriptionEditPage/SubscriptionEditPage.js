import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {SubscriptionEditForm} from '../../components'
import {withLocationState, withNotification} from '../../contexts'
import {
  addSubscriptionExclusionPattern,
  deleteSubscription,
  fetchSubscription,
  fetchSubscriptionExclusionPatterns,
  removeSubscriptionExclusionPattern,
  saveSubscriptionEditForm,
  subscriptionExclusionPatternsSelector,
  subscriptionTagsSelector
} from '../../store'
import {toSubscription} from '../../store/subscription/subscription'
import {SUBSCRIPTIONS_URL} from '../../constants'

const mapStateToProps = (state, ownProps) => ({
  ...subscriptionTagsSelector(state),
  ...subscriptionExclusionPatternsSelector(ownProps.params.uuid)(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  removeSubscriptionExclusionPattern,
  addSubscriptionExclusionPattern,
  fetchSubscriptionExclusionPatterns,
  fetchSubscription,
  deleteSubscription,
  saveSubscriptionEditForm
}, dispatch)

class SubscriptionEditPage extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired,
    historyReplace: PropTypes.func.isRequired,
    historyReload: PropTypes.func.isRequired,
    removeSubscriptionExclusionPattern: PropTypes.func.isRequired,
    addSubscriptionExclusionPattern: PropTypes.func.isRequired,
    fetchSubscriptionExclusionPatterns: PropTypes.func.isRequired,
    fetchSubscription: PropTypes.func.isRequired,
    deleteSubscription: PropTypes.func.isRequired,
    saveSubscriptionEditForm: PropTypes.func.isRequired,
    showSuccessNotification: PropTypes.func.isRequired
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
    const {uuid} = this.props.params
    this.props.fetchSubscriptionExclusionPatterns(uuid)
    this.loadSubscription(uuid)
  }

  loadSubscription = uuid => {
    this.props.fetchSubscription({
      uuid,
      success: response => this.setState({subscription: toSubscription(response)})
    })
  }

  pendingEnd = () => {
    this.setState({
      changePending: false
    })
  }

  onSaveSubscription = subscription => {
    this.setState({
      changePending: true,
      validations: []
    })

    this.props.saveSubscriptionEditForm({
      subscription,
      success: () => this.props.showSuccessNotification('Subscription saved'),
      error: error => {
        if (error.status === 400) {
          this.setState({validations: error.fieldErrors})
          return []
        }
        return undefined
      },
      finalize: this.pendingEnd
    })
  }

  onDeleteSubscription = uuid => {
    this.setState({
      changePending: true
    })

    this.props.deleteSubscription({
      uuid,
      success: [
        () => this.props.showSuccessNotification('Subscription deleted'),
        () => this.props.historyReplace({pathname: SUBSCRIPTIONS_URL}),
        () => this.props.historyReload()
      ],
      error: this.pendingEnd
    })
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

export default withLocationState(
  withNotification(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SubscriptionEditPage)
  )
)
