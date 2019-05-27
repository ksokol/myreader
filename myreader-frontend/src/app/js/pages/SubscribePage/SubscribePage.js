import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {SubscribeForm} from '../../components'
import {withLocationState, withNotification} from '../../contexts'
import {saveSubscribeEditForm} from '../../store'
import {SUBSCRIPTION_URL} from '../../constants'

class SubscribePage extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    historyReplace: PropTypes.func.isRequired,
    showSuccessNotification: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      changePending: false,
      validations: []
    }
  }

  onSaveNewSubscription = subscription => {
    this.setState({
      changePending: true,
      validations: []
    })

    this.props.dispatch(saveSubscribeEditForm({
      subscription,
      success: [
        () => this.props.showSuccessNotification('Subscribed'),
        ({uuid}) => this.props.historyReplace({pathname: SUBSCRIPTION_URL, params: {uuid}})
      ],
      error: error => {
        this.setState({
          validations: error.status === 400 ? error.fieldErrors : [],
          changePending: false
        })
        return []
      }
    }))
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
  withNotification(
    connect()(SubscribePage)
  )
)
