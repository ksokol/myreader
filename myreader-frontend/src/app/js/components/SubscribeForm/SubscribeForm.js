import './SubscribeForm.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button, Input, withValidations} from '../../components'

export const SubscribeOriginInput = withValidations(Input)

class SubscribeForm extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      origin: PropTypes.string
    }),
    validations: PropTypes.any,
    changePending: PropTypes.bool.isRequired,
    subscriptionEditFormChangeData: PropTypes.func.isRequired,
    saveSubscribeEditForm: PropTypes.func.isRequired
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
        className='my-subscribe-form'
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
          className='my-subscribe-form__buttons'
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

export default SubscribeForm
