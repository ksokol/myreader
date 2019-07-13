import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import SubscriptionContext from './SubscriptionContext'
import {subscriptionsReceived} from '../../store/subscription'
import {withLocationState} from '../locationState/withLocationState'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'

const mapDispatchToProps = dispatch => bindActionCreators({
  subscriptionsReceived
}, dispatch)

class Provider extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    locationReload: PropTypes.bool.isRequired,
    subscriptionsReceived: PropTypes.func.isRequired
  }

  state = {
    subscriptions: []
  }

  componentDidMount = async () => await this.fetchSubscriptions()

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
