import React from 'react'
import PropTypes from 'prop-types'
import {SubscriptionEditForm} from '../../components'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {SUBSCRIPTIONS_URL} from '../../constants'
import {subscriptionApi, subscriptionTagsApi} from '../../api'
import {toast} from '../../components/Toast'

class SubscriptionEditPage extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired,
    historyReplace: PropTypes.func.isRequired,
    historyReload: PropTypes.func.isRequired
  }

  state = {
    subscription: null,
    changePending: false,
    validations: []
  }

  componentDidMount = async () => {
    const {uuid} = this.props.params

    try {
      const subscription = await subscriptionApi.fetchSubscription(uuid)
      const {content: subscriptionTags} = await subscriptionTagsApi.fetchSubscriptionTags()
      this.setState({subscription, subscriptionTags})
    } catch ({data}) {
      toast(data, {error: true})
    }
  }

  pendingEnd = () => this.setState({changePending: false})

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
        this.setState({validations: error.data.fieldErrors})
      } else {
        toast(error.data, {error: true})
      }
    } finally {
      this.pendingEnd()
    }
  }

  onDeleteSubscription = async uuid => {
    this.setState({changePending: true})

    try {
      await subscriptionApi.deleteSubscription(uuid)
      toast('Subscription deleted')
      this.props.historyReplace({pathname: SUBSCRIPTIONS_URL})
      this.props.historyReload()
    } catch ({data}) {
      this.pendingEnd()
      toast(data, {error: true})
    }
  }

  render() {
    const {
      subscription,
      subscriptionTags,
      changePending,
      validations
    } = this.state

    return subscription ? (
      <SubscriptionEditForm
        {...this.props}
        data={subscription}
        subscriptionTags={subscriptionTags}
        changePending={changePending}
        validations={validations}
        saveSubscriptionEditForm={this.onSaveSubscription}
        deleteSubscription={this.onDeleteSubscription}
      />
    ) : null
  }
}

export default withLocationState(SubscriptionEditPage)
