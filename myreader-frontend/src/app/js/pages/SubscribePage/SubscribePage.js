import React from 'react'
import PropTypes from 'prop-types'
import {SubscribeForm} from '../../components'
import {withLocationState, withNotification} from '../../contexts'
import {SUBSCRIPTION_URL} from '../../constants'
import {subscriptionApi} from '../../api'

class SubscribePage extends React.Component {

  static propTypes = {
    historyReplace: PropTypes.func.isRequired,
    showSuccessNotification: PropTypes.func.isRequired,
    showErrorNotification: PropTypes.func.isRequired
  }

  state = {
    changePending: false,
    validations: []
  }

  onSaveNewSubscription = async subscription => {
    this.setState({
      changePending: true,
      validations: []
    })

    try {
      const {uuid} = await subscriptionApi.subscribe(subscription)
      this.props.showSuccessNotification('Subscribed')
      this.props.historyReplace({pathname: SUBSCRIPTION_URL, params: {uuid}})
    } catch (error) {
      this.setState({
        validations: error.status === 400 ? error.data.fieldErrors : [],
        changePending: false
      })

      if (error.status !== 400) {
        this.props.showErrorNotification(error.data)
      }
    }
  }

  render() {
    const {
      changePending,
      validations
    } = this.state

    return (
      <SubscribeForm
        changePending={changePending}
        validations={validations}
        saveSubscribeEditForm={this.onSaveNewSubscription}
      />
    )
  }
}

export default withLocationState(
  withNotification(SubscribePage)
)
