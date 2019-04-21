import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {SubscribeForm} from '../../components'
import {saveSubscribeEditForm, showSuccessNotification} from '../../store'
import {subscriptionRoute} from '../../routes'

class SubscribePage extends React.Component {

  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
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
        () => showSuccessNotification('Subscribed'),
        ({uuid}) => this.props.history.replace(subscriptionRoute({uuid}))
      ],
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

export default withRouter(
  connect()(SubscribePage)
)
