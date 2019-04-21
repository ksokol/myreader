import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {SubscribeForm} from '../../components'
import {
  clearSubscriptionEditForm,
  saveSubscribeEditForm,
  subscriptionEditFormChangeData,
  subscriptionEditFormSelector
} from '../../store'

const mapStateToProps = state => ({
  ...subscriptionEditFormSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  subscriptionEditFormChangeData,
  saveSubscribeEditForm,
  clearSubscriptionEditForm
}, dispatch)

class SubscribePage extends React.Component {

  static propTypes = {
    clearSubscriptionEditForm: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.clearSubscriptionEditForm()
  }

  render = () => <SubscribeForm {...this.props} />
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribePage)
