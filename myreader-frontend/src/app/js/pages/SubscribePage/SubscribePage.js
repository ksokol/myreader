import React from 'react'
import PropTypes from 'prop-types'
import {SubscribeForm} from '../../components'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {SUBSCRIPTION_URL} from '../../constants'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'

class SubscribePage extends React.Component {

  static propTypes = {
    historyReplace: PropTypes.func.isRequired
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
      toast('Subscribed')
      this.props.historyReplace({pathname: SUBSCRIPTION_URL, params: {uuid}})
    } catch (error) {
      if (error.status === 400) {
        this.setState({
          validations: error.data.errors
        })
      }

      if (error.status !== 400) {
        toast(error.data, {error: true})
      }
    } finally {
      this.setState({
        changePending: false
      })
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

export default withLocationState(SubscribePage)
