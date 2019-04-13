import './SubscribePage.css'
import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Button, Input, withValidations} from '../../components'
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

export const SubscribeOriginInput = withValidations(Input)

class SubscribePage extends React.Component {

  componentDidMount() {
    this.props.clearSubscriptionEditForm()
  }

  render() {
    const {
      data,
      validations,
      changePending,
      subscriptionEditFormChangeData,
      saveSubscribeEditForm
    } = this.props

    return (
      <form
        className='my-subscribe-page'
      >
        <SubscribeOriginInput
          name='origin'
          value={data ? data.origin : ''}
          label='Url'
          disabled={changePending}
          validations={validations}
          onChange={event => subscriptionEditFormChangeData({origin: event.target.value})}
        />

        <div
          className='my-subscribe-page__buttons'
        >
          <Button
            disabled={changePending}
            onClick={() => saveSubscribeEditForm({...data})}
            primary>Subscribe
          </Button>
        </div>
      </form>
    )
  }
}

SubscribePage.propTypes = {
  data: PropTypes.shape({
    origin: PropTypes.string
  }),
  validations: PropTypes.any,
  changePending: PropTypes.bool.isRequired,
  subscriptionEditFormChangeData: PropTypes.func.isRequired,
  saveSubscribeEditForm: PropTypes.func.isRequired,
  clearSubscriptionEditForm: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribePage)
