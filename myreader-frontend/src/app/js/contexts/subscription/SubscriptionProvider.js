import React from 'react'
import PropTypes from 'prop-types'
import SubscriptionContext from './SubscriptionContext'
import {withLocationState} from '../locationState/withLocationState'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'
import {SubscriptionProviderInterceptor} from './SubscriptionProviderInterceptor'

class Provider extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    locationStateStamp: PropTypes.number.isRequired
  }

  state = {
    subscriptions: []
  }

  interceptor = new SubscriptionProviderInterceptor((newEntry, oldEntry) => this.entryChanged(newEntry, oldEntry))

  componentDidMount = async () => {
    subscriptionApi.addInterceptor(this.interceptor)
    await this.fetchSubscriptions()
  }

  componentWillUnmount() {
    subscriptionApi.removeInterceptor(this.interceptor)
  }

  async componentDidUpdate(prevProps) {
    if (this.props.locationStateStamp !== prevProps.locationStateStamp) {
      await this.fetchSubscriptions()
    }
  }

  fetchSubscriptions = async () => {
    try {
      const subscriptions = await subscriptionApi.fetchSubscriptions()
      this.setState({subscriptions})
    } catch (error) {
      toast(error.data, {error: true})
    }
  }

  entryChanged = (newEntry, oldEntry) => {
    const subscriptions = this.state.subscriptions.map(it => {
      const unseenChanged = it.uuid === newEntry.feedUuid && newEntry.seen !== oldEntry.seen

      return unseenChanged ? {
        ...it,
        unseen: newEntry.seen ? it.unseen - 1 : it.unseen + 1
      } : it
    })

    this.setState({subscriptions})
  }

  render() {
    return (
      <SubscriptionContext.Provider
        value={{
          subscriptions: this.state.subscriptions
        }}
      >
        {this.props.children}
      </SubscriptionContext.Provider>
    )
  }
}

export const SubscriptionProvider = withLocationState(Provider)
