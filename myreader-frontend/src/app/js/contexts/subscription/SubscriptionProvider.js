import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import SubscriptionContext from './SubscriptionContext'
import {subscriptionsReceived} from '../../store/subscription'
import {withLocationState} from '../locationState/withLocationState'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'
import {SubscriptionProviderInterceptor} from './SubscriptionProviderInterceptor'
import {changeEntry} from '../../store'

const mapDispatchToProps = dispatch => bindActionCreators({
  subscriptionsReceived,
  changeEntry
}, dispatch)

class Provider extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    locationReload: PropTypes.bool.isRequired,
    subscriptionsReceived: PropTypes.func.isRequired,
    changeEntry: PropTypes.func.isRequired
  }

  state = {
    subscriptions: []
  }

  interceptor = new SubscriptionProviderInterceptor(this.props.changeEntry)

  componentDidMount = async () => {
    subscriptionApi.addInterceptor(this.interceptor)
    await this.fetchSubscriptions()
  }

  componentWillUnmount() {
    subscriptionApi.removeInterceptor(this.interceptor)
  }

  async componentDidUpdate() {
    if (this.props.locationReload) {
      await this.fetchSubscriptions()
    }
  }

  fetchSubscriptions = async () => {
    try {
      const subscriptions = await subscriptionApi.fetchSubscriptions()
      this.props.subscriptionsReceived(subscriptions)
    } catch ({data}) {
      toast(data, {error: true})
    }
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

export const SubscriptionProvider = withLocationState(
  connect(
    null,
    mapDispatchToProps
  )(Provider)
)
