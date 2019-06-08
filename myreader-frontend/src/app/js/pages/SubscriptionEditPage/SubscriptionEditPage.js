import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {SubscriptionEditForm} from '../../components'
import {withLocationState} from '../../contexts'
import {fetchSubscription, subscriptionTagsSelector} from '../../store'
import {toSubscription} from '../../store/subscription/subscription'
import {SUBSCRIPTIONS_URL} from '../../constants'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'

const mapStateToProps = state => ({
  ...subscriptionTagsSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSubscription
}, dispatch)

class SubscriptionEditPage extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired,
    historyReplace: PropTypes.func.isRequired,
    historyReload: PropTypes.func.isRequired,
    fetchSubscription: PropTypes.func.isRequired
  }

  state = {
    subscription: null,
    changePending: false,
    validations: []
  }

  componentDidMount() {
    const {uuid} = this.props.params
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

  onSaveSubscription = async subscription => {
    try {
      this.setState({
        changePending: true,
        validations: []
      })
      await subscriptionApi.saveSubscription(subscription)
      toast('Subscription saved')
      this.props.historyReload()
    } catch (error) {
      if (error.status === 400) {
        this.setState({validations: error.fieldErrors})
      } else {
        toast(error, {error: true})
      }
    } finally {
      this.pendingEnd()
    }
  }

  onDeleteSubscription = async uuid => {
    this.setState({
      changePending: true
    })

    try {
      await subscriptionApi.deleteSubscription(uuid)
      toast('Subscription deleted')
      this.props.historyReplace({pathname: SUBSCRIPTIONS_URL})
      this.props.historyReload()
    } catch (error) {
      this.pendingEnd()
      toast(error, {error: true})
    }
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubscriptionEditPage)
)
